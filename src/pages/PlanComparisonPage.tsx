import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { generatePlans } from '../services/rescueEngine';
import type { Plan } from '../types';
import { time } from '../utils/format';
import PageHeader from '../components/PageHeader';
import PlanCard from '../components/PlanCard';
import DecisionDialog from '../components/DecisionDialog';
export default function PlanComparisonPage() {
  const { shiftId } = useParams();
  const { data } = useApp();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Plan | null>(null);
  const shift = data.shifts.find((s) => s.id === shiftId);
  if (!shift)
    return (
      <>
        <PageHeader title="找不到班次" />
        <Link to="/dashboard">返回總覽</Link>
      </>
    );
  const result = generatePlans(data, shift);
  return (
    <>
      <PageHeader
        title={`個案 ${shift.clientId}｜方案比較`}
        description="先篩選硬性條件，再比較熟悉度、交通與負荷。"
        actions={<Link to="/dashboard">← 返回總覽</Link>}
      />
      <section className="panel">
        <h3>服务需求</h3>
        <div className="info-grid">
          <p>
            時段：{time(shift.start)}–{time(shift.end)}
          </p>
          <p>地區：{shift.district}</p>
          <p>必要技能：{shift.skills.join('、')}</p>
          <p>允許延後：{shift.maxDelay} 分鐘</p>
          <p>女性照服員：{shift.femaleRequired ? '必要' : '無指定'}</p>
          <p>不可中斷：{shift.critical ? '是' : '否'}</p>
        </div>
      </section>
      <p className="muted">
        交通與工時設定均為合成情境；以下說明由規則模板產生，尚未串接生成式 AI。
      </p>
      {shift.status !== 'pending' ? (
        <section className="panel">
          此班次已處理或取消。<Link to="/records">查看紀錄</Link>
        </section>
      ) : (
        <>
          <div className="plan-grid">
            {result.plans.map((p) => (
              <PlanCard key={p.id} plan={p} onSelect={setSelected} />
            ))}
          </div>
          {!result.plans.length && (
            <section className="panel">
              目前無可行方案，請查看排除原因並人工協調。
            </section>
          )}
          <details className="panel">
            <summary>候選人排除原因（{result.excluded.length}）</summary>
            <ul>
              {result.excluded.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </details>
        </>
      )}
      {selected && (
        <DecisionDialog
          key={selected.id}
          plan={selected}
          onClose={() => setSelected(null)}
          onDone={() => navigate('/records')}
        />
      )}
    </>
  );
}
