// 공유 카드: 티켓 한 장을 인스타그램 스토리(9:16)·피드(4:5) 이미지로 그립니다.
import { whenDate, whenTime, placeOf, thirdCell } from './when.js';

const C = { bg: '#0A0907', amber: '#E9B04A', amberSoft: '#F6CF84', cream: '#F4ECDD', ink: '#1D1913', inkMuted: '#6B6151', fg: '#F3EBDD', muted: '#CFC5B3', faint: '#968C7A' };
const SERIF = '"Nanum Myeongjo", "Noto Serif KR", serif';
const SANS = '"IBM Plex Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif';
const MONO = '"IBM Plex Mono", ui-monospace, Menlo, monospace';
export const FORMATS = { story: { w: 1080, h: 1920, label: '스토리 9:16' }, feed: { w: 1080, h: 1350, label: '피드 4:5' } };

function loadImage(src) {
  return new Promise((resolve) => {
    if (!src) return resolve(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function fontsReady() {
  if (!document.fonts || !document.fonts.load) return;
  await Promise.race([
    Promise.all([`800 72px ${SERIF}`, `700 40px ${SERIF}`, `500 32px ${SANS}`, `600 32px ${SANS}`, `400 28px ${MONO}`].map((f) => document.fonts.load(f).catch(() => {}))),
    new Promise((r) => setTimeout(r, 1500)),
  ]);
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

// 한글은 글자 단위, 영어는 단어 단위로 줄바꿈
function wrap(ctx, text, maxW, maxLines) {
  const tokens = String(text || '').replace(/\s+/g, ' ').trim().match(/[A-Za-z0-9'’.,!?-]+\s?|\s|./g) || [];
  const lines = [];
  let cur = '';
  for (const t of tokens) {
    if (ctx.measureText(cur + t).width > maxW && cur) { lines.push(cur.trimEnd()); cur = t.trimStart(); } else cur += t;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && cur) lines.push(cur.trimEnd());
  if (lines.length === maxLines && tokens.join('').length > lines.join('').length + 1) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(last + '…').width > maxW && last.length) last = last.slice(0, -1);
    lines[maxLines - 1] = last + '…';
  }
  return lines;
}

function cover(ctx, img, x, y, w, h) {
  const s = Math.max(w / img.width, h / img.height);
  const sw = w / s, sh = h / s;
  ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, w, h);
}

function placeholderPoster(ctx, x, y, w, h, title) {
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#3A2A14'); g.addColorStop(1, '#0E0C09');
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.font = `800 ${Math.round(w * 0.1)}px ${SERIF}`;
  const lines = wrap(ctx, title, w * 0.84, 3);
  const lh = w * 0.125;
  let ty = y + h - w * 0.1 - (lines.length - 1) * lh;
  ctx.fillStyle = C.amber; ctx.font = `400 ${Math.round(w * 0.04)}px ${MONO}`;
  ctx.fillText('NOW SHOWING', x + w * 0.08, ty - lh * 0.95);
  ctx.fillStyle = C.fg; ctx.font = `800 ${Math.round(w * 0.1)}px ${SERIF}`;
  lines.forEach((l, i) => ctx.fillText(l, x + w * 0.08, ty + i * lh));
}

function brand(ctx, x, y, size) {
  ctx.strokeStyle = C.amber; ctx.lineWidth = size * 0.16;
  ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2 + size * 0.1, size * 0.36, 0, Math.PI * 2); ctx.stroke();
  ctx.fillStyle = C.amberSoft; ctx.beginPath(); ctx.arc(x + size / 2, y + size * 0.12, size * 0.13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = C.fg; ctx.font = `800 ${Math.round(size * 0.62)}px ${SERIF}`; ctx.textBaseline = 'middle';
  ctx.fillText('Soundtrack Credit', x + size * 1.35, y + size * 0.55); ctx.textBaseline = 'alphabetic';
}

function stub(ctx, x, y, w, h, t) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 16;
  rr(ctx, x, y, w, h, 26); ctx.fillStyle = C.cream; ctx.fill(); ctx.restore();
  // 펀치 구멍
  ctx.fillStyle = '#0D0B08';
  [[x, y + h / 2], [x + w, y + h / 2]].forEach(([cx, cy]) => { ctx.beginPath(); ctx.arc(cx, cy, 18, 0, Math.PI * 2); ctx.fill(); });
  const cells = [
    ['DATE', whenDate(t)],
    ['TIME', whenTime(t)],
    [thirdCell(t)[0].toUpperCase(), thirdCell(t)[1]],
    ['WEATHER', t.weather_text ? `${t.weather_text}${t.temp_c != null ? ` ${Math.round(t.temp_c)}°` : ''}` : '—'],
  ];
  const cw = (w - 80) / 4;
  cells.forEach(([k, v], i) => {
    const cx = x + 40 + i * cw;
    ctx.fillStyle = C.inkMuted; ctx.font = `400 20px ${MONO}`; ctx.fillText(k, cx, y + 52);
    ctx.fillStyle = C.ink; ctx.font = `500 ${v.length > 9 ? 26 : 30}px ${MONO}`;
    let s = v; while (ctx.measureText(s).width > cw - 16 && s.length > 1) s = s.slice(0, -1);
    ctx.fillText(s, cx, y + 96);
  });
  if (h > 150) {
    ctx.strokeStyle = '#BFB29A'; ctx.setLineDash([8, 8]); ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(x + 40, y + 128); ctx.lineTo(x + w - 40, y + 128); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = C.inkMuted; ctx.font = `400 22px ${MONO}`;
    ctx.fillText(`${placeOf(t, 'ADMIT ONE')}${t.city && t.weather_text ? ` · ${t.city}` : ''}`.slice(0, 34), x + 40, y + 170);
    // 바코드
    let bx = x + w - 300;
    const seed = String(t.barcode || t.id || 'x');
    for (let i = 0; i < 60 && bx < x + w - 40; i++) {
      const bw = 2 + (seed.charCodeAt(i % seed.length) % 3);
      if (i % 2 === 0) { ctx.fillStyle = C.ink; ctx.fillRect(bx, y + 146, bw, 34); }
      bx += bw + 2;
    }
  }
}

function chips(ctx, list, x, y, maxW, center) {
  ctx.font = `600 26px ${SANS}`;
  let cx = x;
  if (center) {
    const total = list.reduce((a, m) => a + ctx.measureText(m).width + 56, -12);
    cx = x + Math.max(0, (maxW - total) / 2);
  }
  list.forEach((m) => {
    const w = ctx.measureText(m).width + 44;
    if (cx + w > x + maxW) return;
    rr(ctx, cx, y, w, 52, 26); ctx.strokeStyle = 'rgba(233,176,74,.7)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = C.amberSoft; ctx.fillText(m, cx + 22, y + 35);
    cx += w + 12;
  });
}

function noteIcon(ctx, x, y, s) {
  ctx.strokeStyle = C.amber; ctx.fillStyle = C.amber; ctx.lineWidth = s * 0.1;
  ctx.beginPath(); ctx.moveTo(x + s * 0.35, y + s * 0.78); ctx.lineTo(x + s * 0.35, y + s * 0.12); ctx.lineTo(x + s * 0.9, y); ctx.lineTo(x + s * 0.9, y + s * 0.66); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + s * 0.22, y + s * 0.8, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + s * 0.77, y + s * 0.68, s * 0.15, 0, Math.PI * 2); ctx.fill();
}
function micIcon(ctx, x, y, s) {
  ctx.strokeStyle = C.amber; ctx.lineWidth = s * 0.1;
  rr(ctx, x + s * 0.32, y, s * 0.36, s * 0.6, s * 0.18); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + s * 0.5, y + s * 0.42, s * 0.32, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + s * 0.5, y + s * 0.74); ctx.lineTo(x + s * 0.5, y + s * 0.95); ctx.stroke();
}

function quoteOf(t) {
  if (t.review) return { text: t.review, voice: false };
  if (t.transcript) return { text: t.transcript, voice: true };
  return null;
}
function ostOf(t) {
  if (t.ost && t.ost.tracks && t.ost.tracks.length) return t.ost.tracks[0].name;
  return null;
}

function background(ctx, W, H, poster) {
  ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  if (poster) {
    ctx.save(); ctx.globalAlpha = 0.55;
    if ('filter' in ctx) ctx.filter = 'blur(48px) saturate(1.1)';
    cover(ctx, poster, -80, -80, W + 160, H + 160);
    ctx.restore();
  }
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, 'rgba(10,9,7,.55)'); g.addColorStop(0.45, 'rgba(10,9,7,.7)'); g.addColorStop(1, 'rgba(10,9,7,.96)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
}

function posterFrame(ctx, poster, title, x, y, w, h) {
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
  rr(ctx, x, y, w, h, 24); ctx.fillStyle = '#000'; ctx.fill(); ctx.restore();
  ctx.save(); rr(ctx, x, y, w, h, 24); ctx.clip();
  if (poster) cover(ctx, poster, x, y, w, h); else placeholderPoster(ctx, x, y, w, h, title);
  ctx.restore();
  rr(ctx, x - 10, y - 10, w + 20, h + 20, 32); ctx.strokeStyle = 'rgba(233,176,74,.85)'; ctx.lineWidth = 3; ctx.stroke();
}

function drawStory(ctx, t, poster) {
  const W = 1080, H = 1920;
  background(ctx, W, H, poster);
  brand(ctx, 80, 86, 56);
  ctx.fillStyle = C.amber; ctx.font = `400 24px ${MONO}`; ctx.textAlign = 'right';
  ctx.fillText('MY TICKET BOOK', W - 80, 124); ctx.textAlign = 'left';
  posterFrame(ctx, poster, t.title, 270, 200, 540, 810);
  let y = 1120;
  ctx.textAlign = 'center';
  ctx.fillStyle = C.fg; ctx.font = `800 76px ${SERIF}`;
  wrap(ctx, t.title, 920, 2).forEach((l) => { ctx.fillText(l, W / 2, y); y += 88; });
  const sub = [t.original_title && t.original_title !== t.title ? t.original_title : null, t.release_year].filter(Boolean).join(' · ');
  if (sub) { ctx.fillStyle = C.muted; ctx.font = `500 32px ${SANS}`; ctx.fillText(sub, W / 2, y - 18); y += 34; }
  ctx.textAlign = 'left';
  stub(ctx, 80, y, W - 160, 200, t);
  y += 268;
  const q = quoteOf(t);
  if (q) {
    ctx.font = `700 42px ${SERIF}`; ctx.fillStyle = C.fg; ctx.textAlign = 'center';
    const need = (ostOf(t) ? 70 : 0) + (t.moods && t.moods.length ? 80 : 0) + (q.voice || t.voice_seconds ? 40 : 0);
    const room = Math.max(1, Math.min(3, Math.floor((H - 160 - need - y) / 60)));
    wrap(ctx, `“${q.text}”`, 900, room).forEach((l) => { ctx.fillText(l, W / 2, y); y += 60; });
    if (q.voice || t.voice_seconds) {
      ctx.font = `400 24px ${MONO}`; ctx.fillStyle = C.amber;
      ctx.fillText(`VOICE NOTE${t.voice_seconds ? ` · 0:${String(t.voice_seconds).padStart(2, '0')}` : ''}`, W / 2, y + 6); y += 40;
    }
    ctx.textAlign = 'left'; y += 20;
  }
  const ost = ostOf(t);
  if (ost) {
    ctx.fillStyle = C.muted; ctx.font = `500 30px ${SANS}`;
    let s = `OST · ${ost}`; while (ctx.measureText(s).width > 780 && s.length > 4) s = s.slice(0, -2) + '…';
    const sw = ctx.measureText(s).width; const sx = (W - sw - 56) / 2;
    noteIcon(ctx, sx, y - 30, 38); ctx.fillText(s, sx + 56, y); y += 70;
  }
  // 아래 해시태그와 겹치지 않을 때만 무드 표시
  if (t.moods && t.moods.length && y - 36 + 52 < H - 170) { chips(ctx, t.moods, 120, y - 36, W - 240, true); }
  ctx.fillStyle = C.faint; ctx.font = `500 26px ${SANS}`; ctx.textAlign = 'center';
  ctx.fillText('#시네필기록  #영화OST여운  #나만의영화관', W / 2, H - 120);
  ctx.font = `400 22px ${MONO}`; ctx.fillStyle = C.amber;
  ctx.fillText('SOUNDTRACK CREDIT · 불이 켜져도, 여운은 꺼지지 않게', W / 2, H - 76);
  ctx.textAlign = 'left';
}

function drawFeed(ctx, t, poster) {
  const W = 1080, H = 1350;
  background(ctx, W, H, poster);
  brand(ctx, 72, 70, 48);
  posterFrame(ctx, poster, t.title, 72, 180, 430, 645);
  const x = 560, mw = W - x - 72;
  let y = 250;
  ctx.fillStyle = C.amber; ctx.font = `400 22px ${MONO}`;
  ctx.fillText([t.release_year, (t.genres || []).slice(0, 2).join(' · ')].filter(Boolean).join(' · ') || 'NOW SHOWING', x, y); y += 70;
  ctx.fillStyle = C.fg; ctx.font = `800 62px ${SERIF}`;
  wrap(ctx, t.title, mw, 3).forEach((l) => { ctx.fillText(l, x, y); y += 74; });
  if (t.original_title && t.original_title !== t.title) { ctx.fillStyle = C.muted; ctx.font = `500 28px ${SANS}`; wrap(ctx, t.original_title, mw, 1).forEach((l) => ctx.fillText(l, x, y)); y += 50; }
  const q = quoteOf(t);
  if (q) {
    y += 20; ctx.fillStyle = C.fg; ctx.font = `700 34px ${SERIF}`;
    wrap(ctx, `“${q.text}”`, mw, 5).forEach((l) => { ctx.fillText(l, x, y); y += 50; });
    if (q.voice || t.voice_seconds) { micIcon(ctx, x, y - 6, 30); ctx.fillStyle = C.amber; ctx.font = `400 22px ${MONO}`; ctx.fillText(`VOICE NOTE${t.voice_seconds ? ` · 0:${String(t.voice_seconds).padStart(2, '0')}` : ''}`, x + 42, y + 18); y += 50; }
  }
  const ost = ostOf(t);
  if (ost && y < 780) { y += 16; noteIcon(ctx, x, y - 28, 32); ctx.fillStyle = C.muted; ctx.font = `500 26px ${SANS}`; let s = ost; while (ctx.measureText(s).width > mw - 50 && s.length > 4) s = s.slice(0, -2) + '…'; ctx.fillText(s, x + 48, y); }
  stub(ctx, 72, 890, W - 144, 200, t);
  if (t.moods && t.moods.length) chips(ctx, t.moods, 72, 1130, W - 144);
  ctx.fillStyle = C.faint; ctx.font = `500 24px ${SANS}`;
  ctx.fillText('#시네필기록  #영화OST여운  #나만의영화관', 72, H - 72);
  ctx.textAlign = 'right'; ctx.fillStyle = C.amber; ctx.font = `400 20px ${MONO}`;
  ctx.fillText('SOUNDTRACK CREDIT', W - 72, H - 72); ctx.textAlign = 'left';
}

// 반환: Blob (PNG)
export async function renderShareCard(ticket, format = 'story') {
  await fontsReady();
  const f = FORMATS[format] || FORMATS.story;
  const draw = (poster) => {
    const canvas = document.createElement('canvas');
    canvas.width = f.w; canvas.height = f.h;
    const ctx = canvas.getContext('2d');
    (format === 'feed' ? drawFeed : drawStory)(ctx, ticket, poster);
    return new Promise((resolve, reject) => {
      try { canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('blob'))), 'image/png'); } catch (e) { reject(e); }
    });
  };
  const poster = await loadImage(ticket.poster_url);
  try {
    return await draw(poster);
  } catch (e) {
    return draw(null); // 포스터 서버가 이미지 복사를 막으면 포스터 없이 그립니다
  }
}
