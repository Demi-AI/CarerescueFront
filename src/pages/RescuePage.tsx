import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import ServiceCard from '../components/ServiceCard';
import { prioritized } from '../services/rescueEngine';
export default function RescuePage() {
  const { data } = useApp();
  const shifts = prioritized(data.shifts.filter((s) => s.status === 'pending'));
  return (
    <>
      <PageHeader
        title="補救方案"
        description="選擇待處理班次，查看符合示範規則的候選人。"
      />
      <div className="stack">
        {shifts.map((s) => (
          <ServiceCard key={s.id} shift={s} />
        ))}
        {!shifts.length && (
          <section className="panel">目前沒有待補位班次。</section>
        )}
      </div>
    </>
  );
}
