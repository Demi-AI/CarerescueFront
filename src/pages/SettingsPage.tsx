import { useState } from 'react';
import { useApp } from '../context/AppContext';
import PageHeader from '../components/PageHeader';
import Button from '../components/Button';
export default function SettingsPage() {
  const { data, reset } = useApp();
  const [message, setMessage] = useState('');
  return (
    <>
      <PageHeader
        title="系統設定"
        description="合成資料與示範規則。真實機構工時、資格規則與交通 API 尚未介接。"
      />
      <section className="panel">
        <h3>照服員資料（唯讀）</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>姓名</th>
                <th>技能</th>
                <th>原班表分鐘</th>
                <th>示範上限</th>
                <th>可服務</th>
              </tr>
            </thead>
            <tbody>
              {data.caregivers.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.skills.join('、')}</td>
                  <td>{c.workMinutes}</td>
                  <td>{c.maxMinutes}</td>
                  <td>{c.available ? '是' : '否'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="panel">
        <h3>示範规则</h3>
        <p>
          排除不可服務、性別限制不符、技能不足、工時超限、服務與前後交通時間衝突的人選。
        </p>
        <p>
          排序分數＝延後分鐘 × 3＋交通分鐘＋近期補班次數 × 2＋不熟悉個案 25
          分。越低越前；這是示範權重，不是經實務驗證的最佳化模型。
        </p>
        <p>
          交通使用固定合成矩陣；只評估單日、單班補位，不會自動移動其他人的班次。
        </p>
      </section>
      <section className="panel">
        <h3>重設示範</h3>
        <p>會清除這個網站在目前瀏覽器保存的事件、決策與通知紀錄。</p>
        <Button
          variant="danger"
          onClick={() => {
            if (window.confirm('確定清除目前示範紀錄並還原資料？')) {
              reset();
              setMessage('已還原示範資料。');
            }
          }}
        >
          重設示範資料
        </Button>
        <p role="status">{message}</p>
      </section>
    </>
  );
}
