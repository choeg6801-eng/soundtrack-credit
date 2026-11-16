// "N년 전 오늘": 예전 같은 날(또는 그 무렵)에 본 영화를 다시 꺼내 줍니다.
const DAY = 864e5;
const dated = (t) => ['exact', 'day'].includes(t.date_precision || 'exact');
const md = (d) => (d.getMonth() + 1) * 100 + d.getDate();

/**
 * 기준 날짜(기본 오늘)와 같은 날 무렵에 본 지난 해의 기록.
 * range: 0 = 그날만, n = 앞뒤 n일, 'month' = 같은 달 전체
 */
export function memoriesFor(tickets, date = new Date(), range = 3) {
  const out = [];
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  for (const t of tickets || []) {
    if (!dated(t)) continue;
    const d = new Date(t.watched_at);
    const yearsAgo = base.getFullYear() - d.getFullYear();
    if (yearsAgo < 1) continue;
    let diff;
    if (range === 'month') {
      if (d.getMonth() !== base.getMonth()) continue;
      diff = d.getDate() - base.getDate();
    } else {
      const same = new Date(base.getFullYear(), d.getMonth(), d.getDate());
      diff = Math.round((same - base) / DAY);
      if (Math.abs(diff) > range) continue;
    }
    out.push({ t, yearsAgo, diff, exact: diff === 0 });
  }
  return out.sort((a, b) => Math.abs(a.diff) - Math.abs(b.diff) || a.yearsAgo - b.yearsAgo);
}

/** 몇 년 전인지로 묶기 (가까운 해부터) */
export function groupByYears(mems) {
  const map = new Map();
  for (const m of mems) {
    if (!map.has(m.yearsAgo)) map.set(m.yearsAgo, []);
    map.get(m.yearsAgo).push(m);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]).map(([yearsAgo, items]) => ({ yearsAgo, items }));
}

export function memoryLabel(m) {
  if (m.exact) return `${m.yearsAgo}년 전 오늘`;
  return m.diff < 0 ? `${m.yearsAgo}년 전 이번 주` : `${m.yearsAgo}년 전 이맘때`;
}

/** 지난 해 기록이 있는 날짜들 (기준일 이후로 가까운 순, 월·일 기준) */
export function memoryDays(tickets, date = new Date(), limit = 8) {
  const thisYear = date.getFullYear();
  const days = new Map();
  for (const t of tickets || []) {
    if (!dated(t)) continue;
    const d = new Date(t.watched_at);
    if (d.getFullYear() >= thisYear) continue;
    const k = md(d);
    days.set(k, (days.get(k) || 0) + 1);
  }
  const today = md(date);
  return [...days.entries()]
    .map(([k, n]) => ({ month: Math.floor(k / 100), day: k % 100, n, order: (k - today + 1300) % 1300 }))
    .sort((a, b) => a.order - b.order)
    .slice(0, limit);
}

export const hasPastMemories = (tickets, date = new Date()) => (tickets || []).some((t) => dated(t) && new Date(t.watched_at).getFullYear() < date.getFullYear());
