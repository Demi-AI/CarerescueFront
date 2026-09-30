import { useState } from 'react';
import type { EventRecord } from '../types';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { dateTime } from '../utils/format';
const labels = {
  leave: '照服員請假',
  delay: '照服員延誤',
  stop: '個案停服',
  hospital: '個案送醫',
  change: '需求變更',
};
export default function EventsPage() {
  const { data, addEvent } = useApp();
  const [type, setType] = useState<EventRecord['type']>('leave');
  const [worker, setWorker] = useState('A');
  const [shift, setShift] = useState('S-001');
  const [reason, setReason] = useState('');
  const [delay, setDelay] = useState(15);
  const [message, setMessage] = useState('');
  const person = type === 'leave' || type === 'delay';
  return (
    <>
      <PageHeader
        title="異動事件"
        description="此原型以一日班表示範，請假影響該人員所有未取消班次。"
      />
      <section className="panel">
        <h3>新增異動</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            try {
              addEvent({
                type,
                caregiverId: person ? worker : undefined,
                shiftId: person ? undefined : shift,
                delayMinutes: type === 'delay' ? delay : 0,
                reason,
              });
              setReason('');
              setMessage('事件已建立，請前往今日總覽或補救方案查看。');
            } catch (err) {
              setMessage(err instanceof Error ? err.message : '新增失敗');
            }
          }}
        >
          <div className="info-grid">
            <label>
              事件類型
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventRecord['type'])}
              >
                {Object.entries(labels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            {person ? (
              <label>
                照服員
                <select
                  value={worker}
                  onChange={(e) => setWorker(e.target.value)}
                >
                  {data.caregivers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label>
                班次
                <select
                  value={shift}
                  onChange={(e) => setShift(e.target.value)}
                >
                  {data.shifts
                    .filter((s) => s.status !== 'cancelled')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.id}｜{s.clientId}
                      </option>
                    ))}
                </select>
              </label>
            )}
          </div>
          {type === 'delay' && (
            <label>
              延誤分鐘（記錄原因，示範版轉交人工補位）
              <input
                type="number"
                min="1"
                max="240"
                value={delay}
                onChange={(e) => setDelay(Number(e.target.value))}
                required
              />
            </label>
          )}
          <label>
            原因／變更內容
            <textarea
              rows={3}
              required
              maxLength={1000}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>
          <p className="muted">
            停服、送醫會取消服務；需求變更只建立待辦，必要條件需於系統設定／後續後端功能更新。
          </p>
          <Button type="submit" variant="primary">
            建立事件
          </Button>
          <p role="status">{message}</p>
        </form>
      </section>
      <section className="panel">
        <h3>事件紀錄</h3>
        <div className="stack">
          {data.events.map((ev) => (
            <article className="record" key={ev.id}>
              <strong>{labels[ev.type]}</strong>
              <p>{ev.reason}</p>
              <p className="muted">
                {dateTime(ev.createdAt)}｜受影響：{ev.affectedIds.join('、')}
              </p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
