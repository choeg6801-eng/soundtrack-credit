// 영화 검색·상세  GET /api/movies?q=라라랜드   GET /api/movies?id=313369   GET /api/movies?id=313369&detail=1 (감독·출연·예고편·볼 수 있는 곳)
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
      if (!q.detail) return send(res, 200, { movie: movie(await tmdb(`/movie/${id}`)) }, 86400);
      const d = await tmdb(`/movie/${id}`, { append_to_response: 'credits,videos,watch/providers,release_dates', include_video_language: 'ko,en,null' });
      let overview = d.overview;
      if (!overview) { try { overview = (await tmdb(`/movie/${id}`, { language: 'en-US' })).overview; } catch (e) { /* 없음 */ } }
      const vids = ((d.videos && d.videos.results) || []).filter((v) => v.site === 'YouTube' && /Trailer|Teaser/.test(v.type));
      const trailer = vids.find((v) => v.iso_639_1 === 'ko') || vids.find((v) => v.type === 'Trailer') || vids[0];
      const kr = (d['watch/providers'] && d['watch/providers'].results && d['watch/providers'].results.KR) || {};
      const names = (arr) => (arr || []).map((p) => p.provider_name).filter(Boolean).slice(0, 6);
      const krRel = ((d.release_dates && d.release_dates.results) || []).find((r) => r.iso_3166_1 === 'KR');
      const cert = krRel ? ((krRel.release_dates || []).find((x) => x.certification) || {}).certification || null : null;
      return send(res, 200, {
        movie: {
          ...movie({ ...d, overview }),
          overview: String(overview || '').slice(0, 900),
          tagline: d.tagline || null,
          directors: ((d.credits && d.credits.crew) || []).filter((c) => c.job === 'Director').map((c) => c.name).slice(0, 2),
          cast: ((d.credits && d.credits.cast) || []).slice(0, 6).map((c) => c.name),
          trailer: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null,
          providers: { stream: names(kr.flatrate), rent: names(kr.rent), buy: names(kr.buy), link: kr.link || null },
          certification: cert,
          tmdbUrl: `https://www.themoviedb.org/movie/${id}?language=ko`,
        },
      }, 86400);
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
