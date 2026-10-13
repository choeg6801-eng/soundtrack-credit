export const pad = (n) => String(n).padStart(2, '0');

export function fmtDate(iso, withTime = true) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  const s = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`;
  return withTime ? `${s} · ${pad(d.getHours())}:${pad(d.getMinutes())}` : s;
}

// <input type="datetime-local"> 값 ↔ Date
export const toLocalInput = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const fromLocalInput = (s) => { const d = new Date(s); return isNaN(d) ? new Date() : d; };

export function randomId(len = 16) {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => abc[b % abc.length]).join('');
}

export function uuid() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const b = new Uint8Array(16); crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function count(list) {
  const m = new Map();
  list.forEach((x) => m.set(x, (m.get(x) || 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

export const fmtSec = (s) => `0:${pad(Math.max(0, Math.round(s)))}`;

export function downloadJson(name, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

export const links = {
  spotify: (q) => `https://open.spotify.com/search/${encodeURIComponent(q)}`,
  ytmusic: (q) => `https://music.youtube.com/search?q=${encodeURIComponent(q)}`,
  melon: (q) => `https://www.melon.com/search/total/index.htm?q=${encodeURIComponent(q)}`,
  gmap: (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`,
  kmap: (q) => `https://map.kakao.com/?q=${encodeURIComponent(q)}`,
  naver: (q) => `https://search.naver.com/search.naver?query=${encodeURIComponent(q)}`,
};
