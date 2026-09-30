import { Link } from 'react-router';
import type { Shift } from '../types';
import { time } from '../utils/format';
import StatusBadge from './StatusBadge';
import styles from './ServiceCard.module.css';
export default function ServiceCard({ shift }: { shift: Shift }) {
  const tone = shift.critical
    ? 'urgent'
    : shift.maxDelay >= 30
      ? 'flexible'
      : 'normal';
  return (
    <article className={`${styles.card} ${styles[tone]}`}>
      <strong className={styles.time}>{time(shift.start)}</strong>
      <div>
        <h4>個案 {shift.clientId}</h4>
        <p>{shift.district}</p>
      </div>
      <div className={styles.requirement}>
        {shift.critical
          ? '高風險｜服務不可中斷'
          : shift.femaleRequired
            ? `需女性照服員｜技能 ${shift.skills.join('、')}`
            : `可延後 ${shift.maxDelay} 分鐘`}
      </div>
      <StatusBadge tone={tone}>
        {shift.critical
          ? '優先處理'
          : shift.maxDelay >= 30
            ? '可調整'
            : '需確認'}
      </StatusBadge>
      <Link className={styles.link} to={`/rescue/${shift.id}`}>
        查看方案 →
      </Link>
    </article>
  );
}
