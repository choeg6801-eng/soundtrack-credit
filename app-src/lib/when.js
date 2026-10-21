// 어디서·언제 봤는지: 영화관 / OTT / TV·기타, 그리고 기억나는 만큼의 날짜
import { pad, fmtDate } from './util.js';

export const WATCH_TYPES = [['cinema', '영화관'], ['ott', 'OTT'], ['other', 'TV·기타']];
export const PLATFORMS = {
  ott: ['넷플릭스', '티빙', '쿠팡플레이', '웨이브', '디즈니+', '왓챠', '애플TV+', '프라임비디오'],
  other: ['TV 방송', 'IPTV·VOD', 'DVD·블루레이', '비행기', '모임·상영회'],
};
export const PRECISIONS = [['exact', '날짜·시간'], ['day', '날짜만'], ['month', '연·월'], ['year', '연도만'], ['unknown', '기억 안 나요']];

const precOf = (t) => t.date_precision || 'exact';
const typeOf = (t) => t.watch_type || 'cinema';

/** 화면에 보여 줄 날짜 (기억나는 만큼만) */
export function whenDate(t) {
  const d = new Date(t.watched_at);
  switch (precOf(t)) {
    case 'month': return `${d.getFullYear()}.${pad(d.getMonth() + 1)}`;
    case 'year': return `${d.getFullYear()}년`;
    case 'unknown': return '언젠가';
    default: return fmtDate(t.watched_at, false);
  }
}
export const whenTime = (t) => (precOf(t) === 'exact' ? `${pad(new Date(t.watched_at).getHours())}:${pad(new Date(t.watched_at).getMinutes())}` : '—');

/** 어디서 봤는지 한 줄 */
export function placeOf(t, empty = '극장 미입력') {
  const ty = typeOf(t);
  if (ty === 'cinema') return t.theater || empty;
  return t.platform || (ty === 'ott' ? 'OTT' : 'TV·기타');
}
/** 티켓 셋째 칸: 영화관이면 좌석, 아니면 플랫폼 */
export const thirdCell = (t) => (typeOf(t) === 'cinema' ? ['Seat', t.seat || '—'] : ['Via', t.platform || (typeOf(t) === 'ott' ? 'OTT' : 'TV·기타')]);
export const isCinema = (t) => typeOf(t) === 'cinema';
/** 연도별 묶음 키 */
export const yearKey = (t) => (precOf(t) === 'unknown' ? '날짜 모름' : String(new Date(t.watched_at).getFullYear()));
/** '이번 달' 같은 통계에 써도 될 만큼 날짜가 정확한지 */
export const knowsMonth = (t) => ['exact', 'day', 'month'].includes(precOf(t));
export const hasWeatherDate = (prec) => prec === 'exact' || prec === 'day';

const todayStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const nowLocal = () => { const d = new Date(); d.setSeconds(0, 0); return `${todayStr(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`; };

/** 입력 폼 초기값 (새로 기록 / 기존 티켓 수정) */
export function initialWhen(t, preset = {}) {
  const now = new Date();
  if (!t) {
    return {
      type: preset.type || 'cinema', platform: '', prec: preset.prec || 'exact', theater: preset.theater || '', seat: '',
      dt: nowLocal(), day: todayStr(), y: preset.y || String(now.getFullYear()), m: String(now.getMonth() + 1),
    };
  }
  const d = new Date(t.watched_at);
  const local = `${todayStr(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  return {
    type: typeOf(t), platform: t.platform || '', prec: precOf(t), theater: t.theater || '', seat: t.seat || '',
    dt: local, day: todayStr(d), y: String(d.getFullYear()), m: String(d.getMonth() + 1),
  };
}

/** 폼 값 → 저장할 필드 (정렬용 대표 날짜 포함) */
export function buildWhen(s, releaseYear) {
  const now = new Date();
  let d;
  switch (s.prec) {
    case 'exact': d = new Date(s.dt); break;
    case 'day': d = new Date(`${s.day}T20:00`); break;
    case 'month': d = new Date(Number(s.y), Number(s.m) - 1, 15, 12); break;
    case 'year': d = new Date(Number(s.y), 6, 1, 12); break;
    default: d = releaseYear ? new Date(Number(releaseYear), 11, 31, 12) : now; // 기억 안 나면 개봉 연도 기준으로 정리
  }
  if (isNaN(d) || d > now) d = now;
  const cinema = s.type === 'cinema';
  return {
    watch_type: s.type,
    platform: cinema ? null : (s.platform.trim().slice(0, 30) || null),
    date_precision: s.prec,
    watched_at: d.toISOString(),
    theater: cinema ? (s.theater.trim() || null) : null,
    seat: cinema ? (s.seat.trim().toUpperCase() || null) : null,
  };
}

/** 연도 선택지: 올해부터 개봉 연도(없으면 1950)까지 */
export function yearOptions(releaseYear) {
  const now = new Date().getFullYear();
  const from = Math.min(now, Math.max(1950, Number(releaseYear) || 1950));
  const out = [];
  for (let y = now; y >= from; y--) out.push(String(y));
  return out;
}
export { todayStr };
