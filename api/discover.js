// 취향으로 찾기  GET /api/discover?genres=로맨스,코미디&boost=드라마&exclude=313369,…&page=1
//  genres : 직접 고른 장르 → 반드시 맞아야 함 (여러 개면 "모두 포함"하는 영화부터)
//  boost  : 고른 무드에서 나온 장르 → 맞으면 가산점만
//  고르지 않은 어두운 장르(공포·범죄·스릴러·전쟁)와 애니메이션·가족·다큐는, 고르지 않았다면 빼고 찾습니다.
const { send, query } = require('./_lib/http');
const { tmdb, movie, key, GENRES } = require('./_lib/tmdb');

const BY_NAME = Object.fromEntries(Object.entries(GENRES).map(([id, name]) => [name, Number(id)]));
const ids = (s, max) => String(s || '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, max);
const names = (s) => String(s || '').split(',').map((x) => x.trim()).filter((x) => BY_NAME[x]);

const DARK = [27, 80, 53, 10752];          // 공포, 범죄, 스릴러, 전쟁
const SOFT = [10749, 35, 10751, 16, 10402]; // 로맨스, 코미디, 가족, 애니메이션, 음악
const NICHE = [16, 10751, 99, 10770];       // 애니메이션, 가족, 다큐, TV 영화 — 고른 경우에만

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  if (!key()) return send(res, 501, { error: 'TMDB_API_KEY 가 설정되지 않았습니다' });
  const q = query(req);
  let must = [...new Set(names(q.genres).map((n) => BY_NAME[n]))].slice(0, 4);
  let boost = [...new Set(names(q.boost).map((n) => BY_NAME[n]))].filter((g) => !must.includes(g)).slice(0, 6);
  // 무드만 고른 경우: 무드 장르 중 하나 이상 맞으면 됨
  const moodOnly = !must.length;
  if (moodOnly) { must = boost; boost = []; }
  if (!must.length) return send(res, 400, { error: 'genres' });

  const chosen = new Set([...must, ...boost]);
  const without = [];
  if (SOFT.some((g) => chosen.has(g)) && !DARK.some((g) => chosen.has(g))) without.push(...DARK);
  NICHE.forEach((g) => { if (!chosen.has(g)) without.push(g); });

  const exclude = new Set(ids(q.exclude, 500));
  const page = Math.min(Math.max(Number(q.page) || 1, 1), 5);
  const base = { sort_by: 'popularity.desc', 'vote_count.gte': 300, 'vote_average.gte': 6.6, include_adult: 'false', without_genres: without.join(',') };
  const fetchPages = (withGenres) => Promise.all([page * 2 - 1, page * 2].map((p) =>
    tmdb('/discover/movie', { ...base, with_genres: withGenres, page: p }).then((d) => d.results || []).catch(() => [])));

  try {
    // 1) 고른 장르를 "모두" 포함하는 영화  2) 부족하면 "하나라도" 포함하는 영화로 채움
    const strict = !moodOnly && must.length > 1 ? (await fetchPages(must.join(','))).flat() : [];
    const loose = strict.length >= 24 ? [] : (await fetchPages(must.join('|'))).flat();

    const seen = new Set();
    const out = [...strict, ...loose].filter((m) => m.poster_path && !exclude.has(m.id) && !seen.has(m.id) && seen.add(m.id)).map((m) => {
      const g = m.genre_ids || [];
      const hit = must.filter((x) => g.includes(x)).length;
      const full = hit === must.length;
      const boostHit = boost.filter((x) => g.includes(x)).length;
      const primary = must.includes(g[0]);
      const score = hit * 3 + (full && !moodOnly ? 4 : 0) + boostHit * 1.5 + (primary ? 1.5 : 0)
        + (m.vote_average || 0) / 2 + Math.log10(1 + (m.vote_count || 0)) / 2;
      const mv = movie(m);
      const want = [...must, ...boost].map((x) => GENRES[x]);
      return { ...mv, sharedGenres: mv.genres.filter((x) => want.includes(x)), rating: m.vote_average || null, full, score };
    }).filter((m) => m.sharedGenres.length > 0).sort((a, b) => b.score - a.score).slice(0, 18);

    // 일치율: 고른 장르를 모두 갖추면 높게, 일부만 맞으면 낮게
    const top = out.length ? out[0].score : 1;
    out.forEach((m) => { m.match = Math.min(98, Math.round((m.full ? 70 : 52) + 28 * (m.score / top))); delete m.score; delete m.full; });
    send(res, 200, { results: out, page }, 3600);
  } catch (e) {
    send(res, 502, { error: '영화 정보를 불러오지 못했습니다' });
  }
};
