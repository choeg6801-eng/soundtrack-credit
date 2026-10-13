// 추천  GET /api/recommend?ids=313369,239563&exclude=313369,239563,…
// 내가 본 영화 각각의 TMDB 추천 목록을 모아, 여러 영화에서 겹쳐 나올수록·내 장르와 겹칠수록 높은 점수.
const { send, query } = require('./_lib/http');
const { tmdb, movie, key } = require('./_lib/tmdb');

const ids = (s, max) => String(s || '').split(',').map(Number).filter((n) => Number.isInteger(n) && n > 0).slice(0, max);

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  if (!key()) return send(res, 501, { error: 'TMDB_API_KEY 가 설정되지 않았습니다' });
  const q = query(req);
  const seeds = ids(q.ids, 8);
  const exclude = new Set([...seeds, ...ids(q.exclude, 500)]);
  const likedGenres = String(q.genres || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 5);
  if (!seeds.length) return send(res, 400, { error: 'ids' });

  const lists = await Promise.all(seeds.map((id) =>
    tmdb(`/movie/${id}/recommendations`, { page: 1 }).then((d) => d.results || []).catch(() => [])));

  const pool = new Map();
  lists.forEach((list, si) => {
    list.slice(0, 20).forEach((m, rank) => {
      if (exclude.has(m.id) || !m.poster_path) return;
      const cur = pool.get(m.id) || { m: movie(m), score: 0, because: [] };
      cur.score += 1 + (20 - rank) / 20;
      if (!cur.because.includes(seeds[si])) cur.because.push(seeds[si]);
      pool.set(m.id, cur);
    });
  });
  const out = [...pool.values()].map((c) => {
    const shared = c.m.genres.filter((g) => likedGenres.includes(g));
    return { ...c.m, score: c.score + shared.length * 0.6, because: c.because, sharedGenres: shared };
  }).sort((a, b) => b.score - a.score).slice(0, 12);
  const top = out.length ? out[0].score : 1;
  out.forEach((m) => { m.match = Math.round(62 + 36 * (m.score / top)); });
  send(res, 200, { results: out }, 3600);
};
