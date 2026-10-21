// 체험 모드: Supabase 를 연결하기 전, 이 브라우저 안에만 저장합니다.
import { byId } from '../lib/catalog.js';
import { uuid } from '../lib/util.js';
import { AppError } from './supabase.js';

const KEY = 'sc.demo.v1';
const VOICE = 'sc.demo.voice.';
const memory = {};
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return memory[k] ?? null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { memory[k] = v; } },
  del(k) { try { localStorage.removeItem(k); } catch (e) { delete memory[k]; } },
};

function seed() {
  const now = Date.now();
  const mk = (id, daysAgo, seat, theater, weather, moods, review, transcript) => {
    const m = byId(id);
    const d = new Date(now - daysAgo * 864e5); d.setHours(19, 40, 0, 0);
    return {
      id: uuid(), user_id: 'demo', barcode: null, movie_id: m.id, title: m.title, original_title: m.originalTitle,
      poster_url: m.poster, release_year: m.year, genres: m.genres, watched_at: d.toISOString(), theater, seat,
      city: '서울', lat: 37.5665, lon: 126.978, weather_code: weather[0], weather_text: weather[1], temp_c: weather[2],
      moods, review, location_name: null, ost: null, voice_path: null, voice_seconds: null, transcript,
      created_at: d.toISOString(), updated_at: d.toISOString(), sample: true,
    };
  };
  return {
    user: { id: 'demo', email: 'demo@soundtrack.credit' },
    profile: { id: 'demo', nickname: '시네필', theme: 'dark', plan: 'beta' },
    tickets: [
      mk(313369, 16, 'F11', '예시 극장 3관', [0, '맑음', 21], ['아련함', '설렘'], '마지막 5분, 둘의 눈빛만으로 다 설명됐다.', null),
      mk(198277, 60, 'E07', '예시 극장 5관', [61, '비', 24], ['설렘', '청량'], '이어폰 하나 나눠 끼고 밤거리를 걷고 싶어졌다.', null),
      mk(157336, 140, 'I13', '예시 극장 IMAX', [1, '대체로 맑음', 29], ['경이', '그리움'], '오르간 소리에 몸이 의자에 붙어 버렸다.', null),
    ],
    tags: [],
    watch: [],
  };
}

export function createLocalBackend() {
  let db = null;
  let signedIn = false;
  const listeners = new Set();
  const load = () => {
    if (db) return db;
    try { db = JSON.parse(store.get(KEY) || 'null'); } catch (e) { db = null; }
    if (!db) { db = seed(); save(); }
    return db;
  };
  const save = () => {
    try { store.set(KEY, JSON.stringify(db)); } catch (e) { throw new AppError('브라우저 저장 공간이 부족해요.', 'quota'); }
  };
  const emit = () => listeners.forEach((f) => f(signedIn ? load().user : null));
  const delay = (v) => new Promise((r) => setTimeout(() => r(v), 60));
  const find = (id) => load().tickets.find((t) => t.id === id);

  return {
    mode: 'demo',
    async init() { signedIn = store.get('sc.demo.in') === '1'; return { user: signedIn ? load().user : null, recovery: false }; },
    onAuth(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    user: () => (signedIn ? load().user : null),
    token: () => null,
    async enter() { signedIn = true; store.set('sc.demo.in', '1'); emit(); },
    async signOut() { signedIn = false; store.del('sc.demo.in'); emit(); },
    async reset() {
      (load().tickets || []).forEach((t) => t.voice_path && store.del(VOICE + t.voice_path));
      db = seed(); save();
    },

    async getProfile() { return delay({ ...load().profile }); },
    async updateProfile(patch) { Object.assign(load().profile, patch); save(); return { ...db.profile }; },

    async listTickets() {
      return delay(load().tickets.slice().sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at)).map((t) => ({ ...t })));
    },
    async getTicket(id) { const t = find(id); return delay(t ? { ...t } : null); },
    async createTicket(t) {
      if (t.barcode && load().tickets.some((x) => x.barcode === t.barcode)) throw new AppError('이미 등록한 티켓이에요. (같은 바코드)', 'duplicate');
      const now = new Date().toISOString();
      const row = { id: uuid(), user_id: 'demo', genres: [], moods: [], created_at: now, updated_at: now, ...t };
      load().tickets.push(row); save();
      return delay({ ...row });
    },
    async updateTicket(id, patch) {
      const t = find(id);
      if (!t) throw new AppError('티켓을 찾을 수 없어요.', 'missing');
      Object.assign(t, patch, { updated_at: new Date().toISOString() }); save();
      return delay({ ...t });
    },
    async deleteTicket(t) {
      if (t.voice_path) store.del(VOICE + t.voice_path);
      load().tickets = db.tickets.filter((x) => x.id !== t.id); save();
    },

    async uploadVoice(ticketId, blob) {
      const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(blob); });
      const path = `demo/${ticketId}`;
      try { store.set(VOICE + path, dataUrl); } catch (e) { throw new AppError('브라우저 저장 공간이 부족해요.', 'quota'); }
      return path;
    },
    async voiceUrl(path) {
      const d = store.get(VOICE + path);
      if (!d) throw new AppError('녹음을 찾을 수 없어요.', 'missing');
      return d;
    },
    async removeVoice(path) { store.del(VOICE + path); },

    // ── 보고 싶은 영화 ──
    async listWatch() { const d = load(); d.watch = d.watch || []; return delay(d.watch.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)).map((w) => ({ ...w }))); },
    async addWatch(m) {
      const d = load(); d.watch = d.watch || [];
      let row = d.watch.find((w) => w.movie_id === m.movie_id);
      if (!row) { row = { user_id: 'demo', created_at: new Date().toISOString(), ...m }; d.watch.push(row); save(); }
      return { ...row };
    },
    async removeWatch(movieId) { const d = load(); d.watch = (d.watch || []).filter((w) => w.movie_id !== movieId); save(); },

    async listTags() { return delay(load().tags.map((t) => ({ ...t }))); },
    async addTag(tag) { if (load().tags.some((t) => t.id === tag.id)) throw new AppError('이미 연결된 링이에요.', 'duplicate'); const row = { created_at: new Date().toISOString(), last_tap_at: null, ...tag }; load().tags.push(row); save(); return { ...row }; },
    async updateTag(id, patch) { const t = load().tags.find((x) => x.id === id); if (!t) return null; Object.assign(t, patch); save(); return { ...t }; },
    async suggestLocation() { return delay(true); },
    async claimRing(id, code) {
      // 체험 모드: 연결 코드 8자리면 무엇이든 통과
      if (load().tags.some((t) => t.id === id)) return 'ok';
      if (String(code || '').trim().length !== 8) return 'wrong_code';
      load().tags.push({ id, label: '내 시네마 링', kind: 'ring', created_at: new Date().toISOString(), last_tap_at: null }); save();
      return 'ok';
    },
    async removeTag(id) { load().tags = db.tags.filter((t) => t.id !== id); save(); },

    async deleteAccount() { await this.reset(); await this.signOut(); },
  };
}
