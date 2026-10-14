// OST 찾기  GET /api/ost?title=Begin Again&ko=비긴 어게인&year=2013&skip=123,456
// Apple iTunes 검색 API(무료, 키 불필요)로 "영화" 사운드트랙 앨범과 30초 미리듣기 곡을 찾습니다.
// 같은 제목의 TV 프로그램·드라마·뮤지컬 OST와 헷갈리지 않도록 점수를 매겨 고릅니다.
const { send, query, clean, getJson } = require('./_lib/http');

const OST_WORDS = /(soundtrack|o\.?s\.?t\b|original score|music from|music inspired|사운드트랙|영화 음악)/i;
const FILM_WORDS = /(motion picture|original score|music from the film|from the film|the movie|film soundtrack|영화)/i;
const NOT_FILM = /(television|\btv\b|episode|season|series|드라마|예능|에피소드|musical|broadway|cast recording|video game|game soundtrack|anime series)/i;

const norm = (s) => String(s || '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/[^a-z0-9가-힣]/g, '');

async function search(term, country) {
  const u = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=25&country=${country}`;
  const r = await getJson(u).catch(() => null);
  return r && r.ok ? (r.data.results || []).map((a) => ({ ...a, _store: country })) : [];
}

function score(a, titles, year) {
  const name = a.collectionName || '';
  const n = norm(name);
  if (!OST_WORDS.test(name)) return -99;
  if (NOT_FILM.test(name)) return -99;                  // TV·드라마·뮤지컬 OST 제외
  const hit = titles.find((t) => t && n.includes(t));
  if (!hit) return -99;                                  // 제목이 앨범 이름에 없으면 제외
  let s = 4;
  if (n.startsWith(hit)) s += 2;
  if (FILM_WORDS.test(name)) s += 3;
  if (/ - single$/i.test(name)) s -= 3;
  if (/ - ep$/i.test(name)) s -= 1;
  if ((a.trackCount || 0) >= 8) s += 1;
  const y = Number(String(a.releaseDate || '').slice(0, 4));
  if (year && y) {
    const d = Math.abs(y - year);
    if (d <= 1) s += 3; else if (d === 2) s += 1; else if (d > 4) s -= 4;
  }
  return s;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  const q = query(req);
  const title = clean(q.title, 80);
  const ko = clean(q.ko, 80);
  const year = Number(q.year) || null;
  const skip = new Set(String(q.skip || '').split(',').map(Number).filter(Boolean));
  if (!title) return send(res, 400, { error: 'title' });
  try {
    const titles = [...new Set([norm(title), norm(ko)])].filter((t) => t.length >= 2);
    const lists = await Promise.all([
      search(`${title} soundtrack`, 'US'),
      search(`${title} soundtrack`, 'KR'),
      ko && ko !== title ? search(`${ko} OST`, 'KR') : Promise.resolve([]),
    ]);
    const seen = new Set();
    const albums = lists.flat()
      .filter((a) => a.collectionId && !skip.has(a.collectionId) && !seen.has(a.collectionId) && seen.add(a.collectionId))
      .map((a) => ({ a, s: score(a, titles, year) }))
      .filter((x) => x.s >= 6)
      .sort((x, y) => y.s - x.s);
    const best = albums[0] && albums[0].a;
    if (!best) return send(res, 200, { album: null, tracks: [] }, 86400);
    const lk = await getJson(`https://itunes.apple.com/lookup?id=${best.collectionId}&entity=song&limit=40&country=${best._store}`);
    const tracks = (lk.ok ? lk.data.results || [] : []).filter((x) => x.wrapperType === 'track').slice(0, 30).map((x) => ({
      name: x.trackName, artist: x.artistName, preview: x.previewUrl || null, ms: x.trackTimeMillis || null, url: x.trackViewUrl || null,
    }));
    return send(res, 200, {
      album: {
        id: best.collectionId, name: best.collectionName, artist: best.artistName,
        artwork: (best.artworkUrl100 || '').replace('100x100bb', '600x600bb'), url: best.collectionViewUrl, year: String(best.releaseDate || '').slice(0, 4),
      },
      tracks,
      more: albums.length > 1,
    }, 86400);
  } catch (e) {
    return send(res, 502, { error: 'OST 정보를 불러오지 못했습니다' });
  }
};
