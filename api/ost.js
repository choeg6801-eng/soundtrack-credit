// OST 찾기  GET /api/ost?title=La La Land&year=2016
// Apple iTunes 검색 API(무료, 키 불필요)로 사운드트랙 앨범과 30초 미리듣기 곡을 찾습니다.
const { send, query, clean, getJson } = require('./_lib/http');

const OST_WORDS = /(soundtrack|o\.?s\.?t|score|music from|사운드트랙|오리지널)/i;

async function search(term, country) {
  const u = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=15&country=${country}`;
  const r = await getJson(u);
  return r.ok ? r.data.results || [] : [];
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  const q = query(req);
  const title = clean(q.title, 80);
  const year = Number(q.year) || null;
  if (!title) return send(res, 400, { error: 'title' });
  try {
    let albums = [];
    for (const country of ['KR', 'US']) {
      albums = (await search(`${title} soundtrack`, country)).filter((a) => OST_WORDS.test(a.collectionName || ''));
      if (albums.length) break;
    }
    const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
    const t = norm(title);
    albums.sort((a, b) => {
      const sa = (norm(a.collectionName).includes(t) ? 2 : 0) + (year && String(a.releaseDate || '').startsWith(String(year)) ? 1 : 0);
      const sb = (norm(b.collectionName).includes(t) ? 2 : 0) + (year && String(b.releaseDate || '').startsWith(String(year)) ? 1 : 0);
      return sb - sa;
    });
    const a = albums[0];
    if (!a || !norm(a.collectionName).includes(t)) return send(res, 200, { album: null, tracks: [] }, 86400);
    const country = a.country === 'USA' ? 'US' : 'KR';
    const lk = await getJson(`https://itunes.apple.com/lookup?id=${a.collectionId}&entity=song&limit=40&country=${country}`);
    const tracks = (lk.ok ? lk.data.results || [] : []).filter((x) => x.wrapperType === 'track').slice(0, 30).map((x) => ({
      name: x.trackName, artist: x.artistName, preview: x.previewUrl || null, ms: x.trackTimeMillis || null, url: x.trackViewUrl || null,
    }));
    return send(res, 200, {
      album: {
        id: a.collectionId, name: a.collectionName, artist: a.artistName,
        artwork: (a.artworkUrl100 || '').replace('100x100bb', '600x600bb'), url: a.collectionViewUrl, year: String(a.releaseDate || '').slice(0, 4),
      },
      tracks,
    }, 86400);
  } catch (e) {
    return send(res, 502, { error: 'OST 정보를 불러오지 못했습니다' });
  }
};
