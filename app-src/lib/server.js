// /api 호출. 서버 기능이 꺼져 있거나(로컬 파일로 열었을 때 등) 실패하면 null 을 돌려줘서 화면이 대체 경로를 쓰게 합니다.
async function get(path) {
  try {
    const r = await fetch(path, { headers: { Accept: 'application/json' } });
    if (!r.ok) return null;
    const ct = r.headers.get('content-type') || '';
    if (!ct.includes('json')) return null;
    return await r.json();
  } catch (e) {
    return null;
  }
}

export const server = {
  config: () => get('/api/config'),
  search: (q) => get(`/api/movies?q=${encodeURIComponent(q)}`),
  movie: (id) => get(`/api/movies?id=${id}`),
  recommend: (ids, exclude, genres) => get(`/api/recommend?ids=${ids.join(',')}&exclude=${exclude.join(',')}&genres=${encodeURIComponent(genres.join(','))}`),
  discover: (genres, boost, exclude, page = 1) => get(`/api/discover?genres=${encodeURIComponent(genres.join(','))}&boost=${encodeURIComponent(boost.join(','))}&exclude=${exclude.join(',')}&page=${page}`),
  locations: (id) => get(`/api/locations?id=${id}`),
  ost: (title, year) => get(`/api/ost?title=${encodeURIComponent(title)}${year ? `&year=${year}` : ''}`),
};
