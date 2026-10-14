// 촬영지  GET /api/locations?id=313369
//  1) 운영자가 확인한 촬영지 (Supabase filming_locations, 승인된 것만)
//  2) 위키데이터의 "촬영지(P915)" — 무료·상업 이용 가능(CC0). TMDB 영화 ID(P4947)로 영화를 찾습니다.
// 두 목록을 합치고, 이름이 겹치면 운영자 정보를 우선합니다.
const { send, query, getJson } = require('./_lib/http');

const UA = 'SoundtrackCredit/1.0 (https://soundtrack-credit.vercel.app; contact via site)';

async function curated(id) {
  const base = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const anon = process.env.SUPABASE_ANON_KEY || '';
  if (!base || !anon) return [];
  const r = await getJson(`${base}/rest/v1/filming_locations?select=name,note,lat,lon,source&movie_id=eq.${id}&status=eq.approved&order=id.asc&limit=30`, {
    headers: { apikey: anon, Authorization: `Bearer ${anon}` },
  }).catch(() => null);
  return r && r.ok && Array.isArray(r.data) ? r.data.map((x) => ({ ...x, source: x.source === 'curated' ? 'curated' : 'member' })) : [];
}

async function wikidata(id) {
  const sparql = `SELECT ?loc ?locLabel ?coord ?countryLabel WHERE {
  ?film wdt:P4947 "${id}" .
  ?film wdt:P915 ?loc .
  OPTIONAL { ?loc wdt:P625 ?coord . }
  OPTIONAL { ?loc wdt:P17 ?country . }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en". }
} LIMIT 40`;
  const r = await getJson(`https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(sparql)}`, {
    headers: { Accept: 'application/sparql-results+json', 'User-Agent': UA },
  }).catch(() => null);
  const rows = r && r.ok && r.data && r.data.results ? r.data.results.bindings : [];
  const seen = new Set();
  return rows.map((b) => {
    const name = b.locLabel && b.locLabel.value;
    if (!name || /^Q\d+$/.test(name) || seen.has(name)) return null; // 이름 없는 항목 제외
    seen.add(name);
    const m = b.coord && /Point\(([-\d.]+) ([-\d.]+)\)/.exec(b.coord.value);
    const country = b.countryLabel && b.countryLabel.value;
    return {
      name: country && !name.includes(country) ? `${name} (${country})` : name,
      note: null,
      lat: m ? Number(m[2]) : null,
      lon: m ? Number(m[1]) : null,
      source: 'wikidata',
      url: b.loc ? b.loc.value : null,
    };
  }).filter(Boolean);
}

const norm = (s) => String(s || '').toLowerCase().replace(/\(.*?\)/g, '').replace(/[^a-z0-9가-힣]/g, '');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return send(res, 405, { error: 'method' });
  const id = Number(query(req).id);
  if (!Number.isInteger(id) || id <= 0) return send(res, 400, { error: 'id' });
  const [a, b] = await Promise.all([curated(id), wikidata(id)]);
  const near = (x, y) => x.lat != null && y.lat != null && Math.abs(x.lat - y.lat) < 0.01 && Math.abs(x.lon - y.lon) < 0.01;
  const merged = [...a];
  b.forEach((w) => {
    if (!merged.some((c) => norm(c.name) === norm(w.name) || near(c, w))) merged.push(w);
  });
  send(res, 200, { locations: merged.slice(0, 20) }, 6 * 3600);
};
