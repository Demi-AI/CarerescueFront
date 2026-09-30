import type { Plan } from '../types';
import { useApp } from '../context/AppContext';
import { time } from '../utils/format';
import Button from './Button';
import StatusBadge from './StatusBadge';
import styles from './PlanCard.module.css';
export default function PlanCard({
  plan,
  onSelect,
}: {
  plan: Plan;
  onSelect: (plan: Plan) => void;
}) {
  const { data } = useApp();
  const worker = data.caregivers.find((c) => c.id === plan.caregiverId);
  const risk = { low: '低', medium: '中', high: '高' };
  return (
    <article className={`${styles.card} ${styles[plan.risk]}`}>
      <StatusBadge
        tone={
          plan.risk === 'high'
            ? 'urgent'
            : plan.risk === 'medium'
              ? 'flexible'
              : 'normal'
        }
      >
        後續調度風險：{risk[plan.risk]}
      </StatusBadge>
      <h3>{plan.title}</h3>
      <strong>照服員 {worker?.name}</strong>
      <p className="muted">
        ID：{plan.caregiverId}｜
        {plan.familiar ? '曾服務此個案' : '未曾服務此個案'}
      </p>
      <dl>
        <dt>服務時段</dt>
        <dd>
          {time(plan.start)}–{time(plan.end)}
        </dd>
        <dt>新增交通時間（模擬）</dt>
        <dd>＋{plan.travel} 分鐘</dd>
        <dt>主要代價</dt>
        <dd>{plan.tradeOff}</dd>
        <dt>綜合評估</dt>
        <dd>{plan.summary}</dd>
      </dl>
      <Button onClick={() => onSelect(plan)}>查看與確認方案</Button>
    </article>
  );
}
