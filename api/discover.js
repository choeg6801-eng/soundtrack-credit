// 취향으로 찾기  GET /api/discover?genres=로맨스,음악&exclude=313369,…&page=1
// 기록이 없어도 고른 장르로 TMDB 전체에서 평이 좋고 많이 본 영화를 찾습니다.
const { send, query } = require('./_lib/http');
const { tmdb, movie, key, GENRES } = require('./_lib/tmdb');

const BY_NAME = Object.fromEntries(Object.entries(GENRES).map(([id, name]) => [name, Number(id)]));
const ids = (s, max) => String(s || '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  if (!key()) return send(res, 501, { error: 'TMDB_API_KEY 가 설정되지 않았습니다' });
  const q = query(req);
  const names = String(q.genres || '').split(',').map((s) => s.trim()).filter((s) => BY_NAME[s]).slice(0, 6);
  if (!names.length) return send(res, 400, { error: 'genres' });
  const exclude = new Set(ids(q.exclude, 500));
  const page = Math.min(Math.max(Number(q.page) || 1, 1), 5);
  const wanted = names.map((n) => BY_NAME[n]);
  try {
    // 고른 장르 중 하나라도 맞는 영화(OR) — 평점 7점 이상, 충분히 많이 본 영화만
    const pages = await Promise.all([page * 2 - 1, page * 2].map((p) => tmdb('/discover/movie', {
      with_genres: wanted.join('|'),
      sort_by: 'popularity.desc',
      'vote_count.gte': 400,
      'vote_average.gte': 7,
      include_adult: 'false',
      page: p,
    }).then((d) => d.results || []).catch(() => [])));
    const seen = new Set();
    const out = pages.flat().filter((m) => m.poster_path && !exclude.has(m.id) && !seen.has(m.id) && seen.add(m.id)).map((m) => {
      const mv = movie(m);
      const shared = mv.genres.filter((g) => names.includes(g));
      return { ...mv, sharedGenres: shared, score: shared.length * 2 + (m.vote_average || 0) / 2 + Math.log10(1 + (m.vote_count || 0)) / 2, rating: m.vote_average || null };
    }).sort((a, b) => b.score - a.score).slice(0, 18);
    const top = out.length ? out[0].score : 1;
    out.forEach((m) => { m.match = Math.round(60 + 38 * (m.score / top)); delete m.score; });
    send(res, 200, { results: out, page }, 3600);
  } catch (e) {
    send(res, 502, { error: '영화 정보를 불러오지 못했습니다' });
  }
};
