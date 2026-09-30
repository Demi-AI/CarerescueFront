import type { Shift } from '../types';
import { time } from '../utils/format';
import styles from './ServiceTimeline.module.css';
export default function ServiceTimeline({ shifts }: { shifts: Shift[] }) {
  return (
    <section className="panel">
      <h3>班次動線</h3>
      <p className="muted">原照服員 A 的受影響服務，包含已補位或停服的班次。</p>
      <ol className={styles.list}>
        {[...shifts]
          .sort((a, b) => a.start - b.start)
          .map((s) => (
            <li key={s.id}>
              <strong>{time(s.start)}</strong>
              <h4>{s.clientId}</h4>
              <p>
                {s.status === 'assigned'
                  ? '已補位'
                  : s.status === 'cancelled'
                    ? '已停服'
                    : '待處理'}
              </p>
            </li>
          ))}
      </ol>
    </section>
  );
}
