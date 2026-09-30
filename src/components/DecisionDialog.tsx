import { useEffect, useRef, useState } from 'react';
import type { Plan, Decision } from '../types';
import { useApp } from '../context/AppContext';
import { generatePlans } from '../services/rescueEngine';
import { time } from '../utils/format';
import Button from './Button';
interface Props {
  plan: Plan;
  onClose: () => void;
  onDone: () => void;
}
export default function DecisionDialog({ plan, onClose, onDone }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { data, decide } = useApp();
  const [action, setAction] = useState<Decision['action']>('accept');
  const [candidate, setCandidate] = useState(plan.id);
  const [reason, setReason] = useState('');
  const [operator, setOperator] = useState('居督');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const shift = data.shifts.find((s) => s.id === plan.shiftId)!;
  const alternatives = generatePlans(data, shift).plans;
  const chosen =
    action === 'modify' ? alternatives.find((p) => p.id === candidate) : plan;
  useEffect(() => {
    dialog.current?.showModal();
  }, []);
  return (
    <dialog ref={dialog} aria-labelledby="decision-title" onCancel={onClose}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (saving) return;
          setSaving(true);
          try {
            if (!chosen) throw new Error('請選擇有效方案');
            decide(chosen, action, reason, operator);
            onDone();
          } catch (err) {
            setError(err instanceof Error ? err.message : '操作失敗');
            setSaving(false);
          }
        }}
      >
        <h2 id="decision-title">方案確認｜{shift.clientId}</h2>
        <p>必要条件由示範規則重新檢查；實際派班仍需後端與機構規則。</p>
        <label>
          決策
          <select
            value={action}
            onChange={(e) => setAction(e.target.value as Decision['action'])}
          >
            <option value="accept">接受方案</option>
            <option value="modify">修改：改選其他可行人員</option>
            <option value="reject">拒絕方案（班次仍待處理）</option>
          </select>
        </label>
        {action === 'modify' && (
          <label>
            替代方案
            <select
              value={candidate}
              onChange={(e) => setCandidate(e.target.value)}
            >
              {alternatives.map((p) => (
                <option key={p.id} value={p.id}>
                  {data.caregivers.find((c) => c.id === p.caregiverId)?.name}｜
                  {time(p.start)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          操作人
          <input
            value={operator}
            onChange={(e) => setOperator(e.target.value)}
            required
            maxLength={80}
          />
        </label>
        <label>
          決策原因
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            maxLength={1000}
            rows={3}
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="actions">
          <Button onClick={onClose}>取消</Button>
          <Button type="submit" variant="primary" disabled={saving}>
            確認並保存
          </Button>
        </div>
      </form>
    </dialog>
  );
}
