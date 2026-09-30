import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import ServiceCard from '../components/ServiceCard';
import ServiceTimeline from '../components/ServiceTimeline';
import StatusBadge from '../components/StatusBadge';
import { prioritized } from '../services/rescueEngine';
export default function DashboardPage() {
  const { data } = useApp();
  const pending = prioritized(
    data.shifts.filter((s) => s.status === 'pending'),
  );
  const demo = data.shifts.filter((s) => s.id.startsWith('S-'));
  return (
    <>
      <PageHeader
        title="今日量能總覽"
        description="優先維持不能中斷的照護服務"
      />
      <section className="panel">
        <div className="section-heading">
          <h3>待處理服務</h3>
          <StatusBadge tone="urgent">待處理 {pending.length} 筆</StatusBadge>
        </div>
        <div className="stack">
          {pending.map((s) => (
            <ServiceCard key={s.id} shift={s} />
          ))}
          {!pending.length && <p>目前沒有待處理服務。</p>}
        </div>
      </section>
      <ServiceTimeline shifts={demo} />
    </>
  );
}
