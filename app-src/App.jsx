import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppCtx, useToast, Loading } from './ui/kit.jsx';
import { I } from './ui/icons.jsx';
import { Auth, NewPassword } from './screens/Auth.jsx';
import { Book } from './screens/Book.jsx';
import { AddTicket } from './screens/AddTicket.jsx';
import { TicketView } from './screens/TicketView.jsx';
import { Recommend } from './screens/Recommend.jsx';
import { Rings, Tap } from './screens/Rings.jsx';
import { Settings } from './screens/Settings.jsx';
import { Welcome } from './screens/Welcome.jsx';
import { Recap } from './screens/Recap.jsx';

function parse(hash) {
  const raw = hash.replace(/^#/, '') || '/';
  const [path, qs] = raw.split('?');
  return { path: path || '/', query: new URLSearchParams(qs || '') };
}

const TABS = [
  ['/', '티켓북', I.ticket],
  ['/recommend', '추천', I.spark],
  ['/rings', '링·태그', I.ring],
  ['/settings', '설정', I.gear],
];

export function App({ backend, config, init }) {
  const [route, setRoute] = useState(() => parse(location.hash));
  const [user, setUser] = useState(init.user);
  const [recovery, setRecovery] = useState(init.recovery);
  const [profile, setProfile] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [watch, setWatch] = useState(null);
  const [toastNode, toast] = useToast();

  useEffect(() => {
    const f = () => { setRoute(parse(location.hash)); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  useEffect(() => backend.onAuth((u) => setUser(u)), [backend]);
  useEffect(() => { if (init.error) toast(init.error, true); }, []);

  const go = useCallback((to) => { if (location.hash !== '#' + to) location.hash = to; }, []);

  const reloadTickets = useCallback(async () => {
    try { setTickets(await backend.listTickets()); } catch (e) { toast(e.message, true); setTickets((t) => t || []); }
  }, [backend]);

  useEffect(() => {
    if (!user) { setProfile(null); setTickets(null); setWatch(null); return; }
    backend.getProfile().then(setProfile).catch(() => setProfile({ theme: 'dark', plan: 'beta' }));
    backend.listWatch().then(setWatch).catch(() => setWatch([]));
    reloadTickets();
    // 로그인 전에 링을 태그했다면 그 화면으로 이어서 이동
    try {
      const pending = sessionStorage.getItem('sc.pendingTap');
      if (pending) { sessionStorage.removeItem('sc.pendingTap'); go('/tap/' + pending); }
    } catch (e) { /* 무시 */ }
  }, [user && user.id]); // 토큰 갱신 때마다 다시 불러오지 않도록 계정 ID 기준

  // 기록도 취향도 없는 신규 회원은 첫 화면에서 취향 고르기로 안내 (한 번만)
  useEffect(() => {
    if (!user || !profile || tickets === null) return;
    const t = profile.taste || {};
    const fresh = tickets.length === 0 && !t.done && !(t.genres || []).length && !(t.moods || []).length;
    if (fresh && (route.path === '/' || route.path === '')) go('/welcome');
  }, [user && user.id, profile, tickets && tickets.length]);

  const theme = (profile && profile.theme) || document.documentElement.dataset.theme || 'dark';
  const setTheme = useCallback(async (t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('sc.theme', t); } catch (e) { /* 무시 */ }
    setProfile((p) => ({ ...(p || {}), theme: t }));
    if (user) backend.updateProfile({ theme: t }).catch(() => {});
  }, [backend, user]);
  useEffect(() => { if (profile && profile.theme) { document.documentElement.dataset.theme = profile.theme; try { localStorage.setItem('sc.theme', profile.theme); } catch (e) { /* 무시 */ } } }, [profile && profile.theme]);

  // 보고 싶은 영화: 담기·빼기 (화면은 바로 바뀌고, 저장 실패 시 되돌림)
  const isWanted = useCallback((id) => !!(watch || []).some((w) => w.movie_id === Number(id)), [watch]);
  const toggleWatch = useCallback(async (m) => {
    const id = Number(m.id || m.movie_id);
    if (!id) return;
    const had = (watch || []).find((w) => w.movie_id === id);
    if (had) {
      setWatch((l) => (l || []).filter((w) => w.movie_id !== id));
      try { await backend.removeWatch(id); toast('보고 싶은 영화에서 뺐어요'); } catch (e) { setWatch((l) => [had, ...(l || [])]); toast(e.message, true); }
      return;
    }
    const row = {
      movie_id: id, title: String(m.title || '').slice(0, 120), original_title: m.originalTitle || m.original_title || null,
      poster_url: m.poster || m.poster_url || null, release_year: m.year || m.release_year || null,
      genres: (m.genres || []).slice(0, 10), rating: m.rating || null,
    };
    const temp = { ...row, created_at: new Date().toISOString() };
    setWatch((l) => [temp, ...(l || [])]);
    try {
      const saved = await backend.addWatch(row);
      setWatch((l) => (l || []).map((w) => (w === temp ? saved : w)));
      toast('보고 싶은 영화에 담았어요');
    } catch (e) { setWatch((l) => (l || []).filter((w) => w !== temp)); toast(e.message, true); }
  }, [backend, watch, toast]);
  const unwatch = useCallback((id) => { setWatch((l) => (l || []).filter((w) => w.movie_id !== Number(id))); return backend.removeWatch(Number(id)).catch(() => {}); }, [backend]);

  const ctx = useMemo(() => ({ backend, config, user, profile, setProfile, tickets, setTickets, reloadTickets, toast, go, theme, setTheme, route, watch, isWanted, toggleWatch, unwatch }),
    [backend, config, user, profile, tickets, reloadTickets, toast, go, theme, setTheme, route, watch, isWanted, toggleWatch, unwatch]);

  const { path, query } = route;
  const seg = path.split('/').filter(Boolean);

  if (!user) {
    if (seg[0] === 'tap' && seg[1]) { try { sessionStorage.setItem('sc.pendingTap', seg[1]); } catch (e) { /* 무시 */ } }
    return <AppCtx.Provider value={ctx}><Auth />{toastNode}</AppCtx.Provider>;
  }
  if (recovery) return <AppCtx.Provider value={ctx}><NewPassword onDone={() => setRecovery(false)} />{toastNode}</AppCtx.Provider>;

  let screen;
  if (seg[0] === 'welcome') screen = <Welcome />;
  else if (seg[0] === 'add') screen = <AddTicket query={query} />;
  else if (seg[0] === 'ticket' && seg[1]) screen = <TicketView id={seg[1]} query={query} />;
  else if (seg[0] === 'recommend') screen = <Recommend />;
  else if (seg[0] === 'recap') screen = <Recap query={query} />;
  else if (seg[0] === 'rings') screen = <Rings />;
  else if (seg[0] === 'settings') screen = <Settings />;
  else if (seg[0] === 'tap' && seg[1]) screen = <Tap tagId={seg[1]} />;
  else screen = <Book />;

  const active = '/' + (['ticket', 'add', 'recap'].includes(seg[0]) || !seg[0] ? '' : seg[0]);

  return (
    <AppCtx.Provider value={ctx}>
      <div className="shell">
        <header className="topbar">
          <div className="topbar-in">
            <a className="brand" href="#/"><span className="brand-mark" aria-hidden="true" />Soundtrack Credit</a>
            {backend.mode === 'demo' && <span className="pill demo">체험 모드</span>}
            <span className="spacer" />
            <nav className="tabs" aria-label="주요 메뉴">
              <div className="tabs-in">
                {TABS.map(([to, label, Icon]) => (
                  <a key={to} className="tab" href={'#' + to} aria-current={active === to ? 'page' : undefined}><Icon />{label}</a>
                ))}
              </div>
            </nav>
          </div>
        </header>
        <main className="main" id="main">{tickets === null && !['settings', 'rings'].includes(seg[0]) ? <Loading /> : screen}</main>
      </div>
      {toastNode}
    </AppCtx.Provider>
  );
}
