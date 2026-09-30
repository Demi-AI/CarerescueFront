import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type {
  AppData,
  EventRecord,
  Plan,
  Decision,
  Notification,
} from '../types';
import { createSeed } from '../data/seed';
import { generatePlans } from '../services/rescueEngine';
const KEY = 'carerescue-demo-v1';
function load(): AppData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const value = JSON.parse(raw);
      if (
        value.version === 1 &&
        Array.isArray(value.shifts) &&
        Array.isArray(value.caregivers) &&
        Array.isArray(value.events) &&
        Array.isArray(value.decisions) &&
        Array.isArray(value.notifications)
      )
        return value;
    }
  } catch {
    /* 使用新的示範資料 */
  }
  return createSeed();
}
interface Store {
  data: AppData;
  storageError: string;
  addEvent: (
    event: Omit<EventRecord, 'id' | 'createdAt' | 'affectedIds'>,
  ) => void;
  decide: (
    plan: Plan,
    action: Decision['action'],
    reason: string,
    operator: string,
  ) => void;
  notify: (id: string, status: Notification['status']) => void;
  reset: () => void;
}
const Context = createContext<Store | null>(null);
export function AppProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(load);
  const [storageError, setStorageError] = useState('');
  function save(next: AppData) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setStorageError('');
    } catch {
      setStorageError('瀏覽器無法保存資料，本次操作僅保留到重新整理前。');
    }
    setData(next);
  }
  function addEvent(
    input: Omit<EventRecord, 'id' | 'createdAt' | 'affectedIds'>,
  ) {
    const affected = data.shifts.filter(
      (s) =>
        s.status !== 'cancelled' &&
        (input.caregiverId
          ? s.caregiverId === input.caregiverId
          : s.id === input.shiftId),
    );
    if (!affected.length) throw new Error('沒有符合的班次。');
    const cancel = input.type === 'stop' || input.type === 'hospital';
    save({
      ...data,
      caregivers: data.caregivers.map((c) =>
        input.type === 'leave' && c.id === input.caregiverId
          ? { ...c, available: false }
          : c,
      ),
      shifts: data.shifts.map((s) =>
        affected.some((a) => a.id === s.id)
          ? { ...s, status: cancel ? 'cancelled' : 'pending' }
          : s,
      ),
      events: [
        {
          ...input,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          affectedIds: affected.map((s) => s.id),
        },
        ...data.events,
      ],
    });
  }
  function decide(
    plan: Plan,
    action: Decision['action'],
    reason: string,
    operator: string,
  ) {
    if (!reason.trim() || !operator.trim())
      throw new Error('請填寫操作人與決策原因。');
    const shift = data.shifts.find((s) => s.id === plan.shiftId);
    if (!shift || shift.status !== 'pending')
      throw new Error('班次已處理，請重新查看。');
    const fresh = generatePlans(data, shift).plans.find(
      (p) => p.id === plan.id,
    );
    if (!fresh || fresh.start !== plan.start)
      throw new Error('方案條件已變更，請重新選擇。');
    const decision: Decision = {
      id: crypto.randomUUID(),
      plan: fresh,
      action,
      reason: reason.trim(),
      operator: operator.trim(),
      createdAt: new Date().toISOString(),
      originalCaregiverId: shift.caregiverId,
      originalStart: shift.start,
    };
    const accepted = action !== 'reject';
    const worker = data.caregivers.find((c) => c.id === plan.caregiverId)!;
    const notifications: Notification[] = accepted
      ? [worker.name, `個案 ${shift.clientId} 家屬`].map((recipient) => ({
          id: crypto.randomUUID(),
          decisionId: decision.id,
          recipient,
          status: 'pending',
        }))
      : [];
    save({
      ...data,
      shifts: data.shifts.map((s) =>
        s.id === shift.id && accepted
          ? {
              ...s,
              caregiverId: fresh.caregiverId,
              start: fresh.start,
              end: fresh.end,
              status: 'assigned',
            }
          : s,
      ),
      decisions: [decision, ...data.decisions],
      notifications: [...notifications, ...data.notifications],
    });
  }
  return (
    <Context.Provider
      value={{
        data,
        storageError,
        addEvent,
        decide,
        notify: (id, status) =>
          save({
            ...data,
            notifications: data.notifications.map((n) =>
              n.id === id ? { ...n, status } : n,
            ),
          }),
        reset: () => save(createSeed()),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useApp() {
  const value = useContext(Context);
  if (!value) throw new Error('缺少 AppProvider');
  return value;
}
