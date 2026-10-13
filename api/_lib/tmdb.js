// TMDB(The Movie Database) 호출 도우미. 환경 변수 TMDB_API_KEY 필요.
const { getJson } = require('./http');

const GENRES = {
  28: '액션', 12: '모험', 16: '애니메이션', 35: '코미디', 80: '범죄', 99: '다큐멘터리', 18: '드라마',
  10751: '가족', 14: '판타지', 36: '역사', 27: '공포', 10402: '음악', 9648: '미스터리', 10749: '로맨스',
  878: 'SF', 10770: 'TV 영화', 53: '스릴러', 10752: '전쟁', 37: '서부',
};
const IMG = 'https://image.tmdb.org/t/p/w342';

function key() { return process.env.TMDB_API_KEY || ''; }

async function tmdb(path, params = {}) {
  const k = key();
  const u = new URL('https://api.themoviedb.org/3' + path);
  for (const [a, b] of Object.entries({ language: 'ko-KR', ...params })) u.searchParams.set(a, String(b));
  const headers = { Accept: 'application/json' };
  // v4 "읽기 액세스 토큰"(eyJ…)과 v3 "API 키" 둘 다 지원
  if (k.startsWith('eyJ')) headers.Authorization = 'Bearer ' + k;
  else u.searchParams.set('api_key', k);
  const r = await getJson(u.toString(), { headers });
  if (!r.ok) throw Object.assign(new Error('tmdb ' + r.status), { status: r.status });
  return r.data;
}

function movie(m) {
  const genres = m.genres ? m.genres.map((g) => g.name) : (m.genre_ids || []).map((id) => GENRES[id]).filter(Boolean);
  const date = m.release_date || '';
  return {
    id: m.id,
    title: m.title || m.original_title || '',
    originalTitle: m.original_title || '',
    year: date ? Number(date.slice(0, 4)) : null,
    poster: m.poster_path ? IMG + m.poster_path : null,
    genres,
    overview: (m.overview || '').slice(0, 400),
    runtime: m.runtime || null,
    popularity: m.popularity || 0,
  };
}

module.exports = { tmdb, movie, key, GENRES };
