// 영화 검색·상세  GET /api/movies?q=라라랜드   GET /api/movies?id=313369
const { send, query, clean } = require('./_lib/http');
const { tmdb, movie, key } = require('./_lib/tmdb');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  if (!key()) return send(res, 501, { error: 'TMDB_API_KEY 가 설정되지 않았습니다' });
  const q = query(req);
  try {
    if (q.id) {
      const id = Number(q.id);
      if (!Number.isInteger(id) || id <= 0) return send(res, 400, { error: 'id' });
      return send(res, 200, { movie: movie(await tmdb(`/movie/${id}`)) }, 86400);
    }
    const text = clean(q.q, 80);
    if (text.length < 1) return send(res, 400, { error: 'q' });
    const data = await tmdb('/search/movie', { query: text, include_adult: 'false', region: 'KR', page: 1 });
    const results = (data.results || []).slice(0, 12).map(movie);
    return send(res, 200, { results }, 3600);
  } catch (e) {
    return send(res, e.status === 404 ? 404 : 502, { error: '영화 정보를 불러오지 못했습니다' });
  }
};
