import type { AppData, Plan, Shift } from '../types';
// 合成交通矩陣：不是即時地圖資料。
const travelMinutes: Record<string, number> = {
  B0456: 8,
  C0789: 14,
  A0123: 3,
  D: 20,
  A: 10,
};
export function generatePlans(
  data: AppData,
  shift: Shift,
): { plans: Plan[]; excluded: string[] } {
  const plans: Plan[] = [];
  const excluded: string[] = [];
  for (const worker of data.caregivers) {
    const reasons: string[] = [];
    if (!worker.available) reasons.push('目前不可服務');
    if (shift.femaleRequired && !worker.female)
      reasons.push('不符合女性照服員限制');
    if (!shift.skills.every((skill) => worker.skills.includes(skill)))
      reasons.push('缺少必要技能');
    const duration = shift.end - shift.start;
    const assigned = data.shifts
      .filter(
        (s) =>
          s.id !== shift.id &&
          s.caregiverId === worker.id &&
          s.status === 'assigned',
      )
      .reduce((sum, s) => sum + s.end - s.start, 0);
    if (worker.workMinutes + assigned + duration > worker.maxMinutes)
      reasons.push('超過工時上限');
    const travel = travelMinutes[worker.id] ?? 20;
    const busy = data.shifts.filter(
      (s) =>
        s.id !== shift.id &&
        s.caregiverId === worker.id &&
        (s.status === 'scheduled' || s.status === 'assigned'),
    );
    let validStart: number | undefined;
    for (
      let start = shift.start;
      start <= shift.start + shift.maxDelay;
      start++
    ) {
      const end = start + duration;
      if (
        busy.every((s) => end + travel <= s.start || s.end + travel <= start)
      ) {
        validStart = start;
        break;
      }
    }
    if (validStart === undefined) reasons.push('服務或前後交通時間衝突');
    if (reasons.length) {
      excluded.push(`${worker.name}：${reasons.join('、')}`);
      continue;
    }
    const start = validStart!;
    const familiar = shift.familiarIds.includes(worker.id);
    const delay = start - shift.start;
    const risk = !familiar ? 'high' : delay > 0 ? 'medium' : 'low';
    plans.push({
      id: `${shift.id}-${worker.id}`,
      shiftId: shift.id,
      caregiverId: worker.id,
      title: familiar
        ? worker.recentRescues <= 1
          ? '負荷較平均'
          : '維持熟悉照護'
        : '快速補位',
      start,
      end: start + duration,
      travel,
      familiar,
      risk,
      tradeOff:
        delay > 0
          ? `延後 ${delay} 分鐘，仍在允許時段內；需確認服務時間。`
          : familiar
            ? '需增加交通與補班工時。'
            : '由不熟悉個案的人員接手，需要完整交接。',
      summary: `必要條件通過；${familiar ? '曾服務此個案' : '需交接'}；近期補班 ${worker.recentRescues} 次。`,
      score:
        delay * 3 + travel + worker.recentRescues * 2 + (familiar ? 0 : 25),
    });
  }
  return { plans: plans.sort((a, b) => a.score - b.score), excluded };
}
export function prioritized(shifts: Shift[]) {
  return [...shifts].sort(
    (a, b) => Number(b.critical) - Number(a.critical) || a.start - b.start,
  );
}
