// 연말 결산 "YOUR YEAR IN CREDITS": 한 해 동안의 티켓으로 통계를 만들고, 공유용 카드를 그립니다.
import { count } from './util.js';
import { C, SERIF, SANS, MONO, FORMATS, loadImage, fontsReady, rr, wrap, cover, placeholderPoster, brand } from './sharecard.js';

const prec = (t) => t.date_precision || 'exact';
const yearOf = (t) => new Date(t.watched_at).getFullYear();
const RAIN = (c) => c != null && ((c >= 51 && c <= 67) || (c >= 80 && c <= 82) || (c >= 95));
const SNOW = (c) => c != null && ((c >= 71 && c <= 77) || c === 85 || c === 86);

/** 결산에 쓸 수 있는 연도들 (최신순) */
export function recapYears(tickets) {
  return [...new Set((tickets || []).filter((t) => prec(t) !== 'unknown').map(yearOf))].sort((a, b) => b - a);
}

export function computeRecap(tickets, year) {
  const list = (tickets || []).filter((t) => prec(t) !== 'unknown' && yearOf(t) === year)
    .sort((a, b) => new Date(a.watched_at) - new Date(b.watched_at));
  const dated = list.filter((t) => prec(t) !== 'year');
  const months = Array.from({ length: 12 }, (_, i) => dated.filter((t) => new Date(t.watched_at).getMonth() === i).length);
  const topMonthIdx = months.some(Boolean) ? months.indexOf(Math.max(...months)) : -1;
  const cinema = list.filter((t) => (t.watch_type || 'cinema') === 'cinema');
  const ott = list.filter((t) => t.watch_type === 'ott');
  const other = list.filter((t) => t.watch_type === 'other');
  const moods = list.flatMap((t) => t.moods || []);
  const voices = list.filter((t) => t.voice_path);
  const score = (t) => (t.voice_seconds || 0) * 3 + String(t.review || '').length + (t.moods || []).length * 10 + (t.ost ? 5 : 0);
  const pick = list.slice().sort((a, b) => score(b) - score(a))[0] || null;
  const top = (arr) => { const c = count(arr.filter(Boolean)); return c[0] ? { name: c[0][0], n: c[0][1] } : null; };
  return {
    year,
    list,
    total: list.length,
    moodCount: moods.length,
    months,
    topMonth: topMonthIdx >= 0 ? { month: topMonthIdx + 1, n: months[topMonthIdx] } : null,
    undatedMonths: list.length - dated.length,
    topGenre: top(list.flatMap((t) => t.genres || [])),
    topMood: top(moods),
    topTheater: top(cinema.map((t) => t.theater)),
    topPlatform: top([...ott, ...other].map((t) => t.platform)),
    cinema: cinema.length, ott: ott.length, other: other.length,
    rainy: list.filter((t) => RAIN(t.weather_code)).length,
    snowy: list.filter((t) => SNOW(t.weather_code)).length,
    voiceCount: voices.length,
    voiceSeconds: voices.reduce((a, t) => a + (t.voice_seconds || 0), 0),
    ostCount: list.filter((t) => t.ost && t.ost.album).length,
    first: dated[0] || null,
    last: dated[dated.length - 1] || null,
    pick,
    posters: list.slice().reverse().slice(0, 5),
  };
}

/** 결산 카드에 들어갈 6칸 */
export function recapTiles(r) {
  const tiles = [
    ['가장 많이 본 장르', r.topGenre ? `${r.topGenre.name}` : '—', r.topGenre ? `${r.topGenre.n}편` : ''],
    ['가장 자주 남은 여운', r.topMood ? r.topMood.name : '—', r.topMood ? `${r.topMood.n}번` : ''],
    r.topTheater ? ['가장 자주 간 극장', r.topTheater.name, `${r.topTheater.n}번`] : ['영화관에서 본 영화', `${r.cinema}편`, ''],
    r.topPlatform ? ['가장 많이 본 곳', r.topPlatform.name, `${r.topPlatform.n}편`] : r.ott + r.other ? ['OTT·집에서 본 영화', `${r.ott + r.other}편`, ''] : ['영화관에서 본 비율', '100%', `${r.cinema}편`],
    ['가장 많이 본 달', r.topMonth ? `${r.topMonth.month}월` : '—', r.topMonth ? `${r.topMonth.n}편` : ''],
    r.voiceCount ? ['남긴 보이스 메모', `${r.voiceCount}개`, `${Math.round(r.voiceSeconds)}초`] : [r.snowy > r.rainy ? '눈 오는 날 본 영화' : '비 오는 날 본 영화', `${Math.max(r.rainy, r.snowy)}편`, ''],
  ];
  return tiles;
}

// ── 공유 카드 ──────────────────────────────
function bg(ctx, W, H) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  const g = ctx.createRadialGradient(W * 0.2, H * 0.05, 40, W * 0.2, H * 0.05, W * 1.1);
  g.addColorStop(0, 'rgba(233,176,74,.28)'); g.addColorStop(1, 'rgba(233,176,74,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function posters(ctx, imgs, list, x, y, w, h, gap) {
  list.forEach((t, i) => {
    const px = x + i * (w + gap);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 12;
    rr(ctx, px, y, w, h, 16); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
    ctx.save(); rr(ctx, px, y, w, h, 16); ctx.clip();
    if (imgs[i]) cover(ctx, imgs[i], px, y, w, h); else placeholderPoster(ctx, px, y, w, h, t.title);
    ctx.restore();
  });
}

function tilesGrid(ctx, tiles, x, y, w, h, gap, cols) {
  const tw = (w - gap * (cols - 1)) / cols;
  tiles.forEach(([label, value, sub], i) => {
    const tx = x + (i % cols) * (tw + gap), ty = y + Math.floor(i / cols) * (h + gap);
    rr(ctx, tx, ty, tw, h, 22); ctx.fillStyle = 'rgba(27,24,18,.92)'; ctx.fill();
    ctx.strokeStyle = 'rgba(233,176,74,.18)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = C.faint; ctx.font = `500 24px ${SANS}`; ctx.fillText(label, tx + 28, ty + 46);
    ctx.font = `800 40px ${SERIF}`; ctx.fillStyle = C.fg;
    let v = String(value); while (ctx.measureText(v).width > tw - 56 - (sub ? 90 : 0) && v.length > 1) v = v.slice(0, -1);
    if (v !== String(value)) v = v.slice(0, -1) + '…';
    ctx.fillText(v, tx + 28, ty + h - 32);
    if (sub) { ctx.font = `500 26px ${MONO}`; ctx.fillStyle = C.amberSoft; ctx.textAlign = 'right'; ctx.fillText(sub, tx + tw - 26, ty + h - 34); ctx.textAlign = 'left'; }
  });
}

function bars(ctx, months, x, y, w, h) {
  const max = Math.max(1, ...months);
  const bw = (w - 11 * 14) / 12;
  ctx.fillStyle = C.faint; ctx.font = `500 24px ${SANS}`; ctx.fillText('월별 관람', x, y);
  const top = y + 26, area = h - 70;
  months.forEach((n, i) => {
    const bx = x + i * (bw + 14);
    const bh = n ? Math.max(10, (n / max) * area) : 4;
    rr(ctx, bx, top + area - bh, bw, bh, Math.min(10, bw / 2));
    ctx.fillStyle = n === max && n ? C.amber : n ? 'rgba(233,176,74,.55)' : 'rgba(243,235,221,.12)'; ctx.fill();
    ctx.fillStyle = C.faint; ctx.font = `400 20px ${MONO}`; ctx.textAlign = 'center';
    ctx.fillText(String(i + 1), bx + bw / 2, top + area + 32); ctx.textAlign = 'left';
  });
}

function headline(ctx, r, x, y, size, maxW) {
  ctx.fillStyle = C.amber; ctx.font = `500 26px ${MONO}`;
  ctx.fillText(`${r.year} · YOUR YEAR IN CREDITS`, x, y);
  ctx.fillStyle = C.fg; ctx.font = `800 ${size}px ${SERIF}`;
  const l1 = `${r.year}년, 나는 ${r.total}편의 영화와`;
  const l2 = `${r.moodCount}번의 여운을 남겼다`;
  [l1, l2].forEach((l, i) => { let s = l; while (ctx.measureText(s).width > maxW && s.length > 1) s = s.slice(0, -1); ctx.fillText(s, x, y + 30 + size * (i + 1) * 1.22); });
  return y + 30 + size * 2 * 1.22;
}

function footer(ctx, W, H) {
  ctx.fillStyle = C.faint; ctx.font = `500 26px ${SANS}`; ctx.textAlign = 'center';
  ctx.fillText('#연말결산 #시네필기록 #올해의영화 #디지털티켓북', W / 2, H - 120);
  ctx.fillStyle = C.amberSoft; ctx.font = `700 30px ${SERIF}`;
  ctx.fillText('영화가 끝나도, 당신의 크레딧은 계속됩니다', W / 2, H - 68);
  ctx.textAlign = 'left';
}

function drawStory(ctx, r, imgs) {
  const W = 1080, H = 1920;
  bg(ctx, W, H);
  brand(ctx, 72, 96, 54);
  const end = headline(ctx, r, 72, 250, 74, W - 144);
  const n = r.posters.length;
  const pw = 176, ph = 264, gap = 18;
  const px = (W - (n * pw + (n - 1) * gap)) / 2;
  if (n) posters(ctx, imgs, r.posters, px, end + 70, pw, ph, gap);
  const ty = end + (n ? 70 + ph + 70 : 60);
  tilesGrid(ctx, recapTiles(r), 72, ty, W - 144, 150, 22, 2);
  bars(ctx, r.months, 72, ty + 3 * 150 + 2 * 22 + 80, W - 144, 250);
  footer(ctx, W, H);
}

function drawFeed(ctx, r, imgs) {
  const W = 1080, H = 1350;
  bg(ctx, W, H);
  brand(ctx, 64, 60, 44);
  const end = headline(ctx, r, 64, 180, 58, W - 128);
  const n = r.posters.length;
  const pw = 128, ph = 192, gap = 14;
  if (n) posters(ctx, imgs, r.posters, 64, end + 44, pw, ph, gap);
  const ty = end + (n ? 44 + ph + 40 : 40);
  tilesGrid(ctx, recapTiles(r).slice(0, 4), 64, ty, W - 128, 128, 18, 2);
  bars(ctx, r.months, 64, ty + 2 * 128 + 18 + 60, W - 128, 190);
  ctx.textAlign = 'center';
  ctx.fillStyle = C.faint; ctx.font = `500 24px ${SANS}`; ctx.fillText('#연말결산 #시네필기록 #올해의영화', W / 2, H - 92);
  ctx.fillStyle = C.amberSoft; ctx.font = `700 26px ${SERIF}`; ctx.fillText('영화가 끝나도, 당신의 크레딧은 계속됩니다', W / 2, H - 48);
  ctx.textAlign = 'left';
}

export async function renderRecapCard(r, format = 'story') {
  await fontsReady();
  const f = FORMATS[format] || FORMATS.story;
  const draw = (imgs) => {
    const canvas = document.createElement('canvas');
    canvas.width = f.w; canvas.height = f.h;
    const ctx = canvas.getContext('2d');
    (format === 'feed' ? drawFeed : drawStory)(ctx, r, imgs);
    return new Promise((resolve, reject) => {
      try { canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'); } catch (e) { reject(e); }
    });
  };
  const imgs = await Promise.all(r.posters.map((t) => loadImage(t.poster_url)));
  try { return await draw(imgs); } catch (e) { return draw([]); }
}
