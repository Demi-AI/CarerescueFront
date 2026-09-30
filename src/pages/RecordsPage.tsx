import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
import { dateTime, time } from '../utils/format';
const actionLabels = { accept: '接受', modify: '修改', reject: '拒絕' };
const noticeLabels = {
  pending: '待發送',
  sent: '已模擬發送',
  replied: '已模擬回覆',
  failed: '模擬失敗',
};
export default function RecordsPage() {
  const { data, notify } = useApp();
  return (
    <>
      <PageHeader
        title="補班紀錄"
        description="保存決策原因與通知進度；通知僅為站內模擬，不會發送給真人。"
      />
      {!data.decisions.length && (
        <section className="panel">
          尚無決策紀錄，請先確認一個補班方案。
        </section>
      )}
      {data.decisions.map((d) => (
        <section className="panel" key={d.id}>
          <div className="section-heading">
            <h3>
              {d.plan.shiftId}｜{actionLabels[d.action]}方案
            </h3>
            <span className="muted">{dateTime(d.createdAt)}</span>
          </div>
          <p>
            操作人：{d.operator}｜原因：{d.reason}
          </p>
          <p>
            原安排：{d.originalCaregiverId}，{time(d.originalStart)} →
            候選安排：{d.plan.caregiverId}，{time(d.plan.start)}
          </p>
          {d.action === 'reject' && <p>未更動班表，服務仍待處理。</p>}
          <div className="stack">
            {data.notifications
              .filter((n) => n.decisionId === d.id)
              .map((n) => (
                <div className="record" key={n.id}>
                  <strong>
                    {n.recipient}｜{noticeLabels[n.status]}
                  </strong>
                  <div className="actions">
                    <Button onClick={() => notify(n.id, 'sent')}>
                      模擬發送
                    </Button>
                    <Button
                      onClick={() => notify(n.id, 'replied')}
                      disabled={n.status !== 'sent'}
                    >
                      模擬回覆
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => notify(n.id, 'failed')}
                    >
                      模擬失敗
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
