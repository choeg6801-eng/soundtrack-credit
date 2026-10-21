// "1년 전 오늘": 예전 같은 날(또는 같은 주)에 본 영화를 다시 꺼내 줍니다.
const DAY = 864e5;

/** 오늘과 같은 날짜(±3일)에 본 지난 해의 기록. 가까운 날짜·최근 해 순 */
export function memoriesFor(tickets, now = new Date()) {
  const out = [];
  for (const t of tickets || []) {
    const p = t.date_precision || 'exact';
    if (p !== 'exact' && p !== 'day') continue;
    const d = new Date(t.watched_at);
    const yearsAgo = now.getFullYear() - d.getFullYear();
    if (yearsAgo < 1) continue;
    const same = new Date(now.getFullYear(), d.getMonth(), d.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = Math.round((same - today) / DAY);
    if (Math.abs(diff) > 3) continue;
    out.push({ t, yearsAgo, diff, exact: diff === 0 });
  }
  return out.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || a.yearsAgo - b.yearsAgo);
}

export function memoryLabel(m) {
  if (m.exact) return `${m.yearsAgo}년 전 오늘`;
  return m.diff < 0 ? `${m.yearsAgo}년 전 이번 주` : `${m.yearsAgo}년 전 이맘때`;
}
