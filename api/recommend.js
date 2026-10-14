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
      const cur = pool.get(m.id) || { m: movie(m), score: 0, because: [], best: -1, bestSeed: null };
      const pts = 1 + (20 - rank) / 20;
      cur.score += pts;
      if (pts > cur.best) { cur.best = pts; cur.bestSeed = seeds[si]; }
      if (!cur.because.includes(seeds[si])) cur.because.push(seeds[si]);
      pool.set(m.id, cur);
    });
  });
  const all = [...pool.values()].map((c) => {
    const shared = c.m.genres.filter((g) => likedGenres.includes(g));
    return { ...c.m, score: c.score + shared.length * 0.6, because: c.because, sharedGenres: shared, seed: c.bestSeed };
  });
  // 한 영화에 추천이 쏠리지 않도록 본 영화별로 번갈아 고른 뒤 점수순 정렬
  const groups = seeds.map((id) => all.filter((m) => m.seed === id).sort((a, b) => b.score - a.score));
  const out = [];
  for (let i = 0; out.length < 12 && groups.some((g) => g.length > i); i++) {
    groups.map((g) => g[i]).filter(Boolean).sort((a, b) => b.score - a.score).forEach((m) => { if (out.length < 12) out.push(m); });
  }
  out.sort((a, b) => b.score - a.score);
  const top = out.length ? out[0].score : 1;
  out.forEach((m) => { m.match = Math.round(62 + 36 * (m.score / top)); delete m.seed; });
  send(res, 200, { results: out }, 3600);
};
