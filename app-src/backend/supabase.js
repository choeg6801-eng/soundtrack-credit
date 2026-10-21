// Supabase 연결 (공식 REST API 를 직접 호출하는 가벼운 클라이언트)
// 인증: /auth/v1   데이터: /rest/v1   파일: /storage/v1
const SESSION_KEY = 'sc.session';

const AUTH_ERRORS = {
  invalid_credentials: '이메일 또는 비밀번호가 맞지 않아요.',
  invalid_grant: '이메일 또는 비밀번호가 맞지 않아요.',
  email_not_confirmed: '메일함에서 가입 확인 링크를 먼저 눌러 주세요.',
  user_already_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
  email_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
  weak_password: '비밀번호는 8자 이상, 영문과 숫자를 섞어 주세요.',
  over_email_send_rate_limit: '메일을 너무 자주 요청했어요. 잠시 후 다시 시도해 주세요.',
  over_request_rate_limit: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.',
  email_address_invalid: '사용할 수 없는 이메일 주소예요.',
  signup_disabled: '지금은 신규 가입을 받지 않고 있어요.',
  same_password: '이전과 다른 비밀번호를 입력해 주세요.',
};

export class AppError extends Error {
  constructor(message, code) { super(message); this.code = code; }
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch (e) { return null; }
}
function writeSession(s) {
  try { s ? localStorage.setItem(SESSION_KEY, JSON.stringify(s)) : localStorage.removeItem(SESSION_KEY); } catch (e) { /* 저장 불가 환경 */ }
}

// ── PKCE (메일 링크 로그인 보호) ──────────────
const PKCE_KEY = 'sc.pkce';
const LINK_ERRORS = {
  otp_expired: '메일 링크가 만료됐어요. 다시 요청해 주세요.',
  access_denied: '메일 링크가 만료되었거나 이미 사용됐어요. 다시 요청해 주세요.',
};
function readPkce() {
  try {
    const p = JSON.parse(localStorage.getItem(PKCE_KEY) || 'null');
    return p && Date.now() - p.at < 24 * 3600e3 ? p : null;
  } catch (e) { return null; }
}
function writePkce(p) {
  try { p ? localStorage.setItem(PKCE_KEY, JSON.stringify(p)) : localStorage.removeItem(PKCE_KEY); } catch (e) { /* 무시 */ }
}
async function pkce(type) {
  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const buf = new Uint8Array(56);
  crypto.getRandomValues(buf);
  const v = Array.from(buf, (b) => abc[b % abc.length]).join('');
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)));
  const challenge = btoa(String.fromCharCode(...digest)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  writePkce({ v, t: type, at: Date.now() });
  return { code_challenge: challenge, code_challenge_method: 's256' };
}

export function createSupabaseBackend({ url, anonKey }) {
  const base = url.replace(/\/+$/, '');
  const redirectTo = `${location.origin}/app/`;
  let session = readSession();
  let refreshing = null;
  const listeners = new Set();
  const emit = () => listeners.forEach((f) => f(session ? session.user : null));

  function setSession(data) {
    if (!data || !data.access_token) { session = null; writeSession(null); emit(); return; }
    const expiresAt = data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600);
    session = { access_token: data.access_token, refresh_token: data.refresh_token, expires_at: expiresAt, user: data.user || (session && session.user) };
    writeSession(session);
    emit();
  }

  async function raw(path, { method = 'GET', body, headers = {}, auth = true, json = true } = {}) {
    const h = { apikey: anonKey, ...headers };
    if (auth && session) h.Authorization = `Bearer ${session.access_token}`;
    else h.Authorization = `Bearer ${anonKey}`;
    if (body !== undefined && json) h['Content-Type'] = 'application/json';
    let r;
    try {
      r = await fetch(base + path, { method, headers: h, body: body === undefined ? undefined : json ? JSON.stringify(body) : body });
    } catch (e) {
      throw new AppError('인터넷 연결을 확인해 주세요.', 'network');
    }
    const text = await r.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = text; }
    return { ok: r.ok, status: r.status, data };
  }

  function authError(res, fallback) {
    const d = res.data || {};
    const code = d.error_code || d.code || d.error || '';
    return new AppError(AUTH_ERRORS[code] || d.msg || d.error_description || d.message || fallback, code);
  }

  async function refresh() {
    if (!session || !session.refresh_token) return false;
    if (!refreshing) {
      refreshing = (async () => {
        const used = session.refresh_token;
        const res = await raw('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: used }, auth: false });
        if (res.ok) { setSession(res.data); return true; }
        // 다른 탭이 먼저 갱신했을 수 있으니 저장된 로그인을 다시 확인
        const stored = readSession();
        if (stored && stored.refresh_token !== used && stored.expires_at > Date.now() / 1000) { session = stored; return true; }
        if (res.status >= 400 && res.status < 500) setSession(null); // 만료된 로그인
        return false;
      })().finally(() => { refreshing = null; });
    }
    return refreshing;
  }

  async function authed(path, opts = {}) {
    if (session && session.expires_at - 60 < Date.now() / 1000) await refresh();
    let res = await raw(path, opts);
    if (res.status === 401 && session && (await refresh())) res = await raw(path, opts);
    if (res.status === 401) { setSession(null); throw new AppError('다시 로그인해 주세요.', 'auth'); }
    return res;
  }

  function dbError(res, fallback) {
    const d = res.data || {};
    if (d.code === '23505') return new AppError(fallback.includes('링') ? '이미 연결된 링이에요.' : '이미 등록한 티켓이에요. (같은 바코드)', 'duplicate');
    if (d.code === '23514') return new AppError('입력한 내용이 너무 길거나 형식이 맞지 않아요.', 'check');
    return new AppError(fallback, d.code || res.status);
  }

  async function rest(path, opts, fallback) {
    const res = await authed('/rest/v1' + path, opts);
    if (!res.ok) throw dbError(res, fallback);
    return res.data;
  }

  // 다른 탭에서 로그인·로그아웃·토큰 갱신이 일어나면 이 탭도 따라갑니다
  window.addEventListener('storage', (e) => {
    if (e.key !== SESSION_KEY) return;
    const next = readSession();
    const changed = (next && next.user && next.user.id) !== (session && session.user && session.user.id);
    session = next;
    if (changed) emit();
  });

  const uid = () => (session && session.user ? session.user.id : null);
  const ext = (mime) => (mime.includes('mp4') || mime.includes('aac') ? 'm4a' : mime.includes('ogg') ? 'ogg' : mime.includes('mpeg') ? 'mp3' : mime.includes('wav') ? 'wav' : 'webm');

  return {
    mode: 'supabase',

    // ── 인증 ───────────────────────────────
    async init() {
      // 메일 링크(가입 확인·매직 링크·비밀번호 재설정)로 돌아온 경우: 주소의 ?code=… 를 로그인으로 바꿉니다 (PKCE).
      // 이 브라우저가 직접 요청한 링크만 받아들이므로, 남이 만든 링크로 엉뚱한 계정에 로그인되는 일을 막습니다.
      const search = new URLSearchParams(location.search);
      const hash = new URLSearchParams(location.hash.replace(/^#\/?/, ''));
      const code = search.get('code');
      const linkError = search.get('error_code') || search.get('error') || hash.get('error_code') || hash.get('error');
      let recovery = false;
      if (code || linkError || hash.has('access_token')) {
        history.replaceState(null, '', location.pathname + '#/');
        if (linkError) throw new AppError(LINK_ERRORS[linkError] || '메일 링크가 만료되었거나 이미 사용됐어요. 다시 요청해 주세요.', 'link');
        if (code) {
          const pk = readPkce();
          if (!pk) throw new AppError('메일 인증이 끝났어요. 이메일과 비밀번호로 로그인해 주세요. (링크 로그인은 요청한 브라우저에서 열어야 해요)', 'link');
          const res = await raw('/auth/v1/token?grant_type=pkce', { method: 'POST', body: { auth_code: code, code_verifier: pk.v }, auth: false });
          writePkce(null);
          if (!res.ok) throw new AppError('메일 링크가 만료되었거나 이미 사용됐어요. 다시 요청해 주세요.', 'link');
          setSession(res.data);
          recovery = pk.t === 'recovery';
        }
      }
      if (session) {
        const me = await authed('/auth/v1/user').catch(() => null);
        // 인터넷이 끊긴 경우(me=null)에는 로그인을 유지하고, 탈퇴·만료된 계정이면 로그아웃
        if (me && me.ok) { session.user = me.data; writeSession(session); } else if (me && (me.status === 403 || me.status === 404)) setSession(null);
      }
      emit();
      return { user: session ? session.user : null, recovery };
    },
    onAuth(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    user: () => (session ? session.user : null),
    token: () => (session ? session.access_token : null),

    async signUp(email, password) {
      const res = await raw(`/auth/v1/signup?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: { email, password, ...(await pkce('signup')) }, auth: false });
      if (!res.ok) throw authError(res, '가입하지 못했어요.');
      if (res.data && res.data.access_token) { setSession(res.data); return { needsConfirm: false }; }
      // 이미 가입된(확인 완료) 이메일이면 Supabase 는 보안상 빈 신원 목록을 돌려줍니다
      const ids = res.data && (res.data.identities || (res.data.user && res.data.user.identities));
      if (Array.isArray(ids) && ids.length === 0) throw new AppError(AUTH_ERRORS.user_already_exists, 'user_already_exists');
      return { needsConfirm: true };
    },
    async signIn(email, password) {
      const res = await raw('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password }, auth: false });
      if (!res.ok) throw authError(res, '로그인하지 못했어요.');
      setSession(res.data);
    },
    async magicLink(email) {
      const res = await raw(`/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: { email, create_user: true, ...(await pkce('magiclink')) }, auth: false });
      if (!res.ok) throw authError(res, '메일을 보내지 못했어요.');
    },
    async resetPassword(email) {
      const res = await raw(`/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`, { method: 'POST', body: { email, ...(await pkce('recovery')) }, auth: false });
      if (!res.ok) throw authError(res, '메일을 보내지 못했어요.');
    },
    async updatePassword(password) {
      const res = await authed('/auth/v1/user', { method: 'PUT', body: { password } });
      if (!res.ok) throw authError(res, '비밀번호를 바꾸지 못했어요.');
    },
    async signOut() {
      if (session) await raw('/auth/v1/logout', { method: 'POST' }).catch(() => {});
      setSession(null);
    },

    // ── 프로필 ─────────────────────────────
    async getProfile() {
      const rows = await rest(`/profiles?select=*&id=eq.${uid()}`, {}, '프로필을 불러오지 못했어요.');
      return rows[0] || { id: uid(), theme: 'dark', plan: 'beta', nickname: null };
    },
    async updateProfile(patch) {
      const rows = await rest(`/profiles?id=eq.${uid()}`, { method: 'PATCH', body: patch, headers: { Prefer: 'return=representation' } }, '저장하지 못했어요.');
      return rows[0];
    },

    // ── 티켓 ───────────────────────────────
    listTickets: () => rest('/tickets?select=*&order=watched_at.desc', {}, '티켓을 불러오지 못했어요.'),
    async getTicket(id) {
      const rows = await rest(`/tickets?select=*&id=eq.${encodeURIComponent(id)}`, {}, '티켓을 불러오지 못했어요.');
      return rows[0] || null;
    },
    async createTicket(t) {
      const rows = await rest('/tickets', { method: 'POST', body: t, headers: { Prefer: 'return=representation' } }, '티켓을 저장하지 못했어요.');
      return rows[0];
    },
    async updateTicket(id, patch) {
      const rows = await rest(`/tickets?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, headers: { Prefer: 'return=representation' } }, '저장하지 못했어요.');
      return rows[0];
    },
    async deleteTicket(t) {
      if (t.voice_path) await this.removeVoice(t.voice_path).catch(() => {});
      await rest(`/tickets?id=eq.${encodeURIComponent(t.id)}`, { method: 'DELETE' }, '삭제하지 못했어요.');
    },

    // ── 보이스 메모 ─────────────────────────
    async uploadVoice(ticketId, blob) {
      const mime = (blob.type || 'audio/webm').split(';')[0];
      const path = `${uid()}/${ticketId}.${ext(mime)}`;
      const res = await authed(`/storage/v1/object/voice/${path}`, { method: 'POST', body: blob, json: false, headers: { 'Content-Type': mime, 'x-upsert': 'true', 'cache-control': '3600' } });
      if (!res.ok) throw new AppError('녹음 파일을 올리지 못했어요.', res.status);
      return path;
    },
    async voiceUrl(path) {
      const res = await authed(`/storage/v1/object/sign/voice/${path}`, { method: 'POST', body: { expiresIn: 3600 } });
      if (!res.ok || !res.data) throw new AppError('녹음을 불러오지 못했어요.', res.status);
      const signed = res.data.signedURL || res.data.signedUrl;
      return signed.startsWith('http') ? signed : `${base}/storage/v1${signed}`;
    },
    async removeVoice(path) {
      await authed('/storage/v1/object/voice', { method: 'DELETE', body: { prefixes: [path] } });
    },

    // ── 촬영지 제안 (운영자 확인 후 공개) ──
    async suggestLocation(loc) {
      await rest('/filming_locations', { method: 'POST', body: { movie_id: loc.movie_id, name: loc.name, note: loc.note || null }, headers: { Prefer: 'return=minimal' } }, '촬영지를 제안하지 못했어요.');
    },

    // ── 보고 싶은 영화 ─────────────────────
    listWatch: () => rest('/watchlist?select=*&order=created_at.desc', {}, '보고 싶은 영화를 불러오지 못했어요.'),
    async addWatch(m) {
      const rows = await rest('/watchlist', { method: 'POST', body: m, headers: { Prefer: 'return=representation,resolution=ignore-duplicates' } }, '보고 싶은 영화에 담지 못했어요.');
      return rows[0] || { ...m, created_at: new Date().toISOString() };
    },
    removeWatch: (movieId) => rest(`/watchlist?movie_id=eq.${Number(movieId)}`, { method: 'DELETE' }, '목록에서 빼지 못했어요.'),

    // ── NFC 링·태그 ─────────────────────────
    listTags: () => rest('/nfc_tags?select=*&order=created_at.asc', {}, '링 목록을 불러오지 못했어요.'),
    async addTag(tag) {
      const rows = await rest('/nfc_tags', { method: 'POST', body: tag, headers: { Prefer: 'return=representation' } }, '링을 등록하지 못했어요.');
      return rows[0];
    },
    async updateTag(id, patch) {
      const rows = await rest(`/nfc_tags?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: patch, headers: { Prefer: 'return=representation' } }, '저장하지 못했어요.');
      return rows[0] || null;
    },
    async claimRing(id, code) {
      const res = await authed('/rest/v1/rpc/claim_ring', { method: 'POST', body: { p_id: id, p_code: code } });
      if (!res.ok) throw new AppError('링을 연결하지 못했어요.', res.status);
      return res.data; // ok | wrong_code | taken | locked | not_found
    },
    removeTag: (id) => rest(`/nfc_tags?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' }, '삭제하지 못했어요.'),

    // ── 계정 ───────────────────────────────
    async deleteAccount() {
      const res = await fetch('/api/delete-account', { method: 'POST', headers: { Authorization: `Bearer ${session.access_token}` } }).catch(() => null);
      if (!res || !res.ok) {
        const d = res ? await res.json().catch(() => ({})) : {};
        throw new AppError(d.error || '탈퇴 처리 중 문제가 생겼어요. 고객센터로 문의해 주세요.', 'delete');
      }
      setSession(null);
    },
  };
}
