// 내 기록을 아는 AI 추천  POST /api/ai-recommend  (Authorization: Bearer <로그인 토큰>)
// 회원의 관람 기록(제목·장르·무드·감상)을 Claude 에게 보내 "왜 이 사람에게 맞는지"까지 담긴 추천을 받고,
// 추천된 영화가 실제로 있는지 TMDB 로 확인한 뒤 포스터와 함께 돌려줍니다.
// 환경 변수: ANTHROPIC_API_KEY (필수), ANTHROPIC_MODEL (선택, 기본 claude-haiku-5-5), AI_DAILY_LIMIT (선택, 기본 10)
const { send, getJson, clean } = require('./_lib/http');
const { tmdb, movie, key: tmdbKey } = require('./_lib/tmdb');

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5';
const LIMIT = Number(process.env.AI_DAILY_LIMIT) || 10;

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch (e) { return {}; } }
  const chunks = [];
  let size = 0;
  for await (const c of req) { size += c.length; if (size > 100000) break; chunks.push(c); }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}'); } catch (e) { return {}; }
}

// 브라우저가 보낸 기록을 꼭 필요한 만큼만, 길이를 잘라서 정리
function tidy(body) {
  const arr = (x, n) => (Array.isArray(x) ? x.slice(0, n) : []);
  const strs = (x, n, len) => arr(x, n).map((s) => clean(s, len)).filter(Boolean);
  const history = arr(body.history, 40).map((t) => ({
    id: Number(t.movie_id) || null,
    title: clean(t.title, 80),
    original: clean(t.original_title, 80),
    year: Number(t.release_year) || null,
    genres: strs(t.genres, 4, 12),
    moods: strs(t.moods, 5, 10),
    note: clean(t.review || t.transcript, 140),
    where: clean(t.watch_type === 'ott' ? `OTT${t.platform ? ` (${t.platform})` : ''}` : t.watch_type === 'other' ? 'TV·기타' : '영화관', 30),
    when: clean(t.when, 20),
  })).filter((t) => t.title);
  return {
    history,
    taste: { genres: strs(body.taste && body.taste.genres, 8, 12), moods: strs(body.taste && body.taste.moods, 8, 10) },
    watch: strs(body.watch, 30, 80),
    exclude: arr(body.exclude, 300).map(Number).filter((n) => Number.isInteger(n) && n > 0),
  };
}

const TOOL = {
  name: 'recommend',
  description: '회원에게 추천할 영화 목록과 취향 요약을 제출합니다.',
  input_schema: {
    type: 'object',
    properties: {
      summary: { type: 'string', description: '회원의 기록에서 읽어 낸 영화 취향 한두 문장 (한국어, 존댓말, 회원에게 말하듯)' },
      picks: {
        type: 'array',
        minItems: 6,
        maxItems: 9,
        items: {
          type: 'object',
          properties: {
            title_ko: { type: 'string', description: '한국 개봉 제목 (없으면 원제)' },
            original_title: { type: 'string', description: '원제 (영문 등)' },
            year: { type: 'integer', description: '개봉 연도' },
            reason: { type: 'string', description: '이 회원에게 맞는 이유 1~2문장. 회원이 남긴 구체적인 무드·감상 표현·영화를 짚어서.' },
            because: { type: 'array', items: { type: 'string' }, maxItems: 3, description: '근거가 된 회원의 기록 영화 제목' },
          },
          required: ['title_ko', 'original_title', 'year', 'reason'],
        },
      },
    },
    required: ['summary', 'picks'],
  },
};

function prompt(d) {
  const lines = d.history.map((t, i) => `${i + 1}. ${t.title}${t.original && t.original !== t.title ? ` (${t.original})` : ''}${t.year ? `, ${t.year}` : ''}`
    + `${t.genres.length ? ` | 장르: ${t.genres.join(', ')}` : ''}${t.moods.length ? ` | 남은 여운: ${t.moods.join(', ')}` : ''}`
    + `${t.note ? ` | 감상: "${t.note}"` : ''} | 본 곳: ${t.where}${t.when ? ` | 본 때: ${t.when}` : ''}`).join('\n');
  return [
    '당신은 영화를 깊이 아는 큐레이터입니다. 아래는 한 회원이 영화 기록 앱에 남긴 관람 기록입니다.',
    '이 사람이 영화를 보고 나서 어떤 감정이 오래 남는지(무드·감상)를 가장 중요하게 보고, 아직 보지 않았을 만한 영화를 추천해 주세요.',
    '',
    '규칙:',
    '- 실제로 존재하는 장편 영화만 추천합니다. 제목·원제·개봉 연도를 정확히 적어 주세요.',
    '- 아래 기록에 있는 영화와 "보고 싶은 영화" 목록은 추천하지 마세요.',
    '- 너무 뻔한 흥행작만 고르지 말고, 숨은 명작과 한국 영화도 섞어 주세요.',
    '- reason 에는 회원이 남긴 구체적인 표현(예: 무드 이름, 감상 속 단어, 기록한 영화)을 짚어서, 왜 이 사람에게 맞는지 말해 주세요. 줄거리 소개는 짧게.',
    '- 모든 문장은 자연스러운 한국어 존댓말로.',
    '',
    `[관람 기록 ${d.history.length}편]`,
    lines || '(아직 없음)',
    '',
    d.taste.genres.length || d.taste.moods.length ? `[직접 고른 취향] 장르: ${d.taste.genres.join(', ') || '-'} / 원하는 여운: ${d.taste.moods.join(', ') || '-'}` : '',
    d.watch.length ? `[이미 보고 싶은 영화로 담아 둔 것 — 추천 제외] ${d.watch.join(', ')}` : '',
  ].filter((x) => x !== '').join('\n');
}

async function askClaude(d) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch(`${(process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '')}/v1/messages`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'content-type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 2000,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: 'recommend' },
        messages: [{ role: 'user', content: prompt(d) }],
      }),
    });
    const data = await r.json().catch(() => null);
    if (!r.ok || !data) throw Object.assign(new Error('claude ' + r.status), { status: r.status });
    const use = (data.content || []).find((c) => c.type === 'tool_use');
    return use ? use.input : null;
  } finally {
    clearTimeout(timer);
  }
}

// 추천된 제목이 실제 영화인지 TMDB 로 확인하고 포스터·ID 를 붙임
async function verify(p) {
  const year = Number(p.year) || undefined;
  const tries = [[p.original_title, year], [p.title_ko, year], [p.original_title, undefined]];
  for (const [q, y] of tries) {
    if (!q) continue;
    try {
      const r = await tmdb('/search/movie', { query: q, include_adult: 'false', page: 1, ...(y ? { primary_release_year: y } : {}) });
      const hit = (r.results || [])[0];
      if (hit) return movie(hit);
    } catch (e) { /* 다음 방법 */ }
  }
  return null;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'method' });
  const base = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
  const anon = process.env.SUPABASE_ANON_KEY || '';
  if (!process.env.ANTHROPIC_API_KEY || !base || !anon) return send(res, 501, { error: 'AI 추천이 아직 설정되지 않았어요' });

  // 1) 로그인한 회원만
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  if (!token) return send(res, 401, { error: '로그인이 필요해요' });
  const who = await getJson(`${base}/auth/v1/user`, { headers: { apikey: anon, Authorization: `Bearer ${token}` } });
  if (!who.ok || !who.data || !who.data.id) return send(res, 401, { error: '다시 로그인해 주세요' });

  // 2) 하루 사용량 제한 (회원 본인 권한으로 기록 — 지울 수 없음)
  const asUser = { apikey: anon, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const since = new Date(Date.now() - 864e5).toISOString();
  const used = await getJson(`${base}/rest/v1/ai_requests?select=id&created_at=gte.${encodeURIComponent(since)}`, { headers: asUser });
  if (!used.ok || !Array.isArray(used.data)) return send(res, 502, { error: 'AI 추천을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.' });
  if (used.data.length >= LIMIT) return send(res, 429, { error: `AI 추천은 하루 ${LIMIT}번까지 받을 수 있어요. 내일 다시 받아 보세요.`, remaining: 0 });

  const d = tidy(await readBody(req));
  if (!d.history.length && !d.taste.genres.length && !d.taste.moods.length) return send(res, 400, { error: '티켓을 한 편 이상 기록하거나 취향을 골라 주세요' });

  const mark = await getJson(`${base}/rest/v1/ai_requests`, { method: 'POST', headers: { ...asUser, Prefer: 'return=minimal' }, body: JSON.stringify({}) });
  if (!mark.ok) return send(res, 502, { error: 'AI 추천을 준비하지 못했어요. 잠시 후 다시 시도해 주세요.' });

  // 3) Claude 에게 추천 받기
  let out;
  try { out = await askClaude(d); } catch (e) { return send(res, 502, { error: 'AI가 지금 답하지 못했어요. 잠시 후 다시 시도해 주세요.' }); }
  if (!out || !Array.isArray(out.picks)) return send(res, 502, { error: 'AI 추천을 만들지 못했어요. 다시 시도해 주세요.' });

  // 4) 실제 영화인지 확인 + 이미 본 영화 빼기
  const seenIds = new Set([...d.exclude, ...d.history.map((t) => t.id).filter(Boolean)]);
  const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9가-힣]/g, '');
  const seenTitles = new Set([...d.history.flatMap((t) => [norm(t.title), norm(t.original)]), ...d.watch.map(norm)].filter(Boolean));
  const picks = out.picks.slice(0, 9).map((p) => ({
    title_ko: clean(p.title_ko, 80), original_title: clean(p.original_title, 80), year: Number(p.year) || null,
    reason: clean(p.reason, 300), because: (Array.isArray(p.because) ? p.because : []).slice(0, 3).map((x) => clean(x, 80)).filter(Boolean),
  })).filter((p) => p.title_ko && !seenTitles.has(norm(p.title_ko)) && !seenTitles.has(norm(p.original_title)));

  let results;
  if (tmdbKey()) {
    const found = await Promise.all(picks.map(verify));
    const ids = new Set();
    results = picks.map((p, i) => (found[i] ? { ...found[i], reason: p.reason, because: p.because } : null))
      .filter((m) => m && !seenIds.has(m.id) && !ids.has(m.id) && ids.add(m.id));
  } else {
    results = picks.map((p) => ({ id: null, title: p.title_ko, originalTitle: p.original_title, year: p.year, poster: null, genres: [], reason: p.reason, because: p.because }));
  }
  return send(res, 200, { summary: clean(out.summary, 300), results, remaining: Math.max(0, LIMIT - used.data.length - 1), model: MODEL });
};
