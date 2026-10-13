// 관람 시각·장소의 날씨 (Open-Meteo, 키 불필요)
export const CITIES = [
  ['서울', 37.5665, 126.978], ['부산', 35.1796, 129.0756], ['인천', 37.4563, 126.7052], ['대구', 35.8714, 128.6014],
  ['대전', 36.3504, 127.3845], ['광주', 35.1595, 126.8526], ['울산', 35.5384, 129.3114], ['수원', 37.2636, 127.0286],
  ['고양', 37.6584, 126.832], ['성남', 37.42, 127.1267], ['용인', 37.2411, 127.1776], ['창원', 35.2281, 128.6811],
  ['청주', 36.6424, 127.489], ['전주', 35.8242, 127.148], ['천안', 36.8151, 127.1139], ['포항', 36.019, 129.3435],
  ['춘천', 37.8813, 127.7298], ['강릉', 37.7519, 128.8761], ['제주', 33.4996, 126.5312],
];

export function weatherText(code) {
  if (code == null) return '';
  if (code === 0) return '맑음';
  if (code === 1) return '대체로 맑음';
  if (code === 2) return '구름 조금';
  if (code === 3) return '흐림';
  if (code === 45 || code === 48) return '안개';
  if (code >= 51 && code <= 57) return '이슬비';
  if (code >= 61 && code <= 67) return '비';
  if (code >= 71 && code <= 77) return '눈';
  if (code >= 80 && code <= 82) return '소나기';
  if (code === 85 || code === 86) return '눈보라';
  if (code >= 95) return '뇌우';
  return '';
}

const pad = (n) => String(n).padStart(2, '0');
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// when: Date (현지 시각), 반환: { code, text, temp } 또는 null
export async function fetchWeather(lat, lon, when) {
  const day = ymd(when);
  const ageDays = (Date.now() - when.getTime()) / 864e5;
  if (ageDays < -15) return null; // 너무 먼 미래
  const host = ageDays > 80 ? 'https://archive-api.open-meteo.com/v1/archive' : 'https://api.open-meteo.com/v1/forecast';
  const url = `${host}?latitude=${lat.toFixed(4)}&longitude=${lon.toFixed(4)}&hourly=temperature_2m,weather_code&timezone=Asia%2FSeoul&start_date=${day}&end_date=${day}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 7000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return null;
    const d = await r.json();
    const i = Math.min(when.getHours(), (d.hourly && d.hourly.time ? d.hourly.time.length : 1) - 1);
    const code = d.hourly && d.hourly.weather_code ? d.hourly.weather_code[i] : null;
    const temp = d.hourly && d.hourly.temperature_2m ? d.hourly.temperature_2m[i] : null;
    if (code == null && temp == null) return null;
    return { code, text: weatherText(code), temp: temp == null ? null : Math.round(temp) };
  } catch (e) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export function nearestCity(lat, lon) {
  let best = CITIES[0], bd = Infinity;
  for (const c of CITIES) {
    const d = (c[1] - lat) ** 2 + (c[2] - lon) ** 2;
    if (d < bd) { bd = d; best = c; }
  }
  return best[0];
}
