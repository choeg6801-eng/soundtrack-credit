// 공용 도우미: JSON 응답, 외부 API 호출(시간 제한), 문자열 정리
const TIMEOUT_MS = 8000;

function send(res, status, body, cacheSeconds) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (cacheSeconds) res.setHeader('Cache-Control', `public, s-maxage=${cacheSeconds}, stale-while-revalidate=86400`);
  else res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function getJson(url, init = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { ...init, signal: ctrl.signal });
    const text = await r.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = { raw: text }; }
    return { ok: r.ok, status: r.status, data };
  } finally {
    clearTimeout(t);
  }
}

function query(req) {
  if (req.query) return req.query;
  const u = new URL(req.url, 'http://local');
  return Object.fromEntries(u.searchParams.entries());
}

const clean = (s, max = 100) => String(s == null ? '' : s).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

module.exports = { send, getJson, query, clean };
