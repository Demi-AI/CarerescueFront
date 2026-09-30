import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
export default function AnalyticsPage() {
  const { data } = useApp();
  const affected = new Set(data.events.flatMap((e) => e.affectedIds));
  const relevant = data.shifts.filter(
    (s) => affected.has(s.id) && s.status !== 'cancelled',
  );
  const assigned = relevant.filter((s) => s.status === 'assigned').length;
  const pending = relevant.filter((s) => s.status === 'pending').length;
  const accepted = data.decisions.filter((d) => d.action !== 'reject');
  const elapsed = accepted.flatMap((d) => {
    const e = data.events.find(
      (e) =>
        e.affectedIds.includes(d.plan.shiftId) &&
        new Date(e.createdAt) <= new Date(d.createdAt),
    );
    return e
      ? [
          (new Date(d.createdAt).getTime() - new Date(e.createdAt).getTime()) /
            60000,
        ]
      : [];
  });
  const avg = elapsed.length
    ? (elapsed.reduce((a, b) => a + b, 0) / elapsed.length).toFixed(1)
    : '—';
  return (
    <>
      <PageHeader
        title="量能分析"
        description="由目前瀏覽器的合成資料計算；不代表真實服務成效。"
      />
      <div className="metrics">
        {[
          ['待補位', `${pending} 班`],
          ['已補位', `${assigned} 班`],
          [
            '補位率',
            relevant.length
              ? `${Math.round((assigned / relevant.length) * 100)}%`
              : '—',
          ],
          ['平均決策時間', `${avg} 分鐘`],
        ].map(([label, value]) => (
          <section className="panel" key={label}>
            <p className="muted">{label}</p>
            <h2>{value}</h2>
          </section>
        ))}
      </div>
      <section className="panel">
        <h3>各人員補班分布</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>照服員</th>
                <th>本次補班數</th>
                <th>新增服務分鐘</th>
              </tr>
            </thead>
            <tbody>
              {data.caregivers.map((c) => {
                const shifts = data.shifts.filter(
                  (s) => s.caregiverId === c.id && s.status === 'assigned',
                );
                return (
                  <tr key={c.id}>
                    <td>{c.name}</td>
                    <td>{shifts.length}</td>
                    <td>
                      {shifts.reduce((sum, s) => sum + s.end - s.start, 0)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="muted">
          補位率分母為受異動影響且未取消的班次。尚未記錄實際服務完成，不能計算服務不中斷率。
        </p>
      </section>
    </>
  );
}
