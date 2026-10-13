import { useEffect, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { recommendFromCatalog, discoverFromCatalog, tasteGenres, GENRE_CHOICES, MOODS } from '../lib/catalog.js';
import { server } from '../lib/server.js';
import { count, links } from '../lib/util.js';

function RecCard({ m, reason }) {
  return (
    <article className="rec-card">
      <Poster src={m.poster} title={m.title} />
      <div style={{ minWidth: 0 }}>
        <h3>{m.title}</h3>
        <div className="faint tiny">{[m.year, (m.genres || []).slice(0, 2).join('·'), m.rating ? `평점 ${m.rating.toFixed(1)}` : null].filter(Boolean).join(' · ')}</div>
        <div className="meter" aria-hidden="true"><i style={{ width: `${m.match}%` }} /></div>
        <div className="small"><b style={{ color: 'var(--accent-text)' }}>{m.match}%</b> <span className="muted">{reason}</span></div>
        <div className="tags">{[...(m.sharedMoods || []).map((x) => `${x} 무드`), ...(m.sharedGenres || []).slice(0, 2)].slice(0, 3).map((x) => <span key={x}>{x}</span>)}</div>
        <div className="row" style={{ marginTop: 10, gap: 6 }}>
          <a className="btn sm" href={`#/add?movie=${m.id}`}>봤어요</a>
          <a className="btn sm ghost" href={links.naver(`${m.title} 영화`)} target="_blank" rel="noopener">정보 보기</a>
        </div>
      </div>
    </article>
  );
}

const Skeletons = () => <div className="recs">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 170 }} />)}</div>;

// ── 기록 기반 ───────────────────────────────
function FromHistory({ list, tasteG }) {
  const { config } = useApp();
  const [recs, setRecs] = useState(null);
  const [source, setSource] = useState('');

  useEffect(() => {
    let alive = true;
    const local = () => { setRecs(recommendFromCatalog(list)); setSource('catalog'); };
    const seeds = list.filter((t) => t.movie_id).slice(0, 8);
    if (!config.movies || !seeds.length) { local(); return; }
    setRecs(null);
    const genres = [...new Set([...count(list.flatMap((t) => t.genres || [])).slice(0, 3).map((x) => x[0]), ...tasteG])].slice(0, 5);
    server.recommend(seeds.map((t) => t.movie_id), list.map((t) => t.movie_id).filter(Boolean), genres).then((r) => {
      if (!alive) return;
      if (r && r.results && r.results.length) {
        const title = (id) => (list.find((t) => t.movie_id === id) || {}).title;
        setRecs(r.results.map((m) => ({ ...m, becauseTitles: m.because.map(title).filter(Boolean), sharedMoods: [] })));
        setSource('tmdb');
      } else local();
    });
    return () => { alive = false; };
  }, [list]);

  if (recs === null) return <Skeletons />;
  if (!recs.length) return <p className="muted">지금은 추천할 영화를 찾지 못했어요. ‘취향으로 찾기’를 써 보세요.</p>;
  return (
    <>
      <div className="recs">
        {recs.map((m) => <RecCard key={m.id} m={m} reason={m.becauseTitles && m.becauseTitles.length ? `‘${m.becauseTitles.slice(0, 2).join('’, ‘')}’의 여운을 좋아했다면` : '내 취향과 닮았어요'} />)}
      </div>
      <p className="faint tiny" style={{ marginTop: 18 }}>{source === 'tmdb' ? '내가 본 영화마다 비슷한 영화를 모아, 여러 편에서 겹치고 내 장르 취향과 맞을수록 높게 매겼어요. 영화 정보 제공: TMDB' : '기본 영화 목록 안에서 무드(×3)·장르(×2)·OST 스타일(×2)이 겹치는 정도로 계산했어요. (TMDB를 연결하면 전체 영화에서 추천)'}</p>
    </>
  );
}

// ── 취향으로 찾기 ───────────────────────────
function FromTaste({ list }) {
  const { backend, config, profile, setProfile, toast } = useApp();
  const saved = (profile && profile.taste) || {};
  const [genres, setGenres] = useState(saved.genres || []);
  const [moods, setMoods] = useState(saved.moods || []);
  const [recs, setRecs] = useState(null);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [asked, setAsked] = useState({ genres: [], moods: [] });
  const exclude = list.map((t) => t.movie_id).filter(Boolean);
  const toggle = (set) => (v) => set((x) => (x.includes(v) ? x.filter((y) => y !== v) : [...x, v]));

  const run = async (g, m, p = 1) => {
    const all = tasteGenres(g, m);
    if (!all.length) { toast('장르나 무드를 하나 이상 골라 주세요', true); return; }
    setBusy(true);
    if (p === 1) setRecs(null);
    setAsked({ genres: g, moods: m });
    let found = null;
    if (config.movies) {
      const r = await server.discover(all, exclude, p);
      if (r && r.results) {
        found = r.results.map((x) => ({ ...x, sharedMoods: [] }));
        setMore(r.results.length >= 10 && p < 5);
      }
    }
    if (!found) { found = discoverFromCatalog(g, m, exclude); setMore(false); }
    setRecs((prev) => (p === 1 || !prev ? found : [...prev, ...found.filter((x) => !prev.some((y) => y.id === x.id))]));
    setPage(p);
    setBusy(false);
  };

  useEffect(() => { if ((saved.genres || []).length || (saved.moods || []).length) run(saved.genres || [], saved.moods || []); }, []);

  const submit = async () => {
    run(genres, moods);
    try { const p = await backend.updateProfile({ taste: { genres, moods } }); if (p) setProfile(p); } catch (e) { /* 저장 실패해도 추천은 보여 줌 */ }
  };

  const label = [...asked.genres, ...asked.moods].slice(0, 3).join('·');
  return (
    <>
      <section className="card" aria-labelledby="taste-h" style={{ marginBottom: 18 }}>
        <div className="card-title"><h2 id="taste-h"><I.heart />어떤 영화가 끌리세요?</h2></div>
        <p className="faint small" style={{ margin: '0 0 8px' }}>장르</p>
        <div className="chips">{GENRE_CHOICES.map((g) => <button key={g} className="chip" aria-pressed={genres.includes(g)} onClick={() => toggle(setGenres)(g)}>{g}</button>)}</div>
        <p className="faint small" style={{ margin: '16px 0 8px' }}>보고 나서 남았으면 하는 여운</p>
        <div className="chips">{MOODS.map((m) => <button key={m} className="chip" aria-pressed={moods.includes(m)} onClick={() => toggle(setMoods)(m)}>{m}</button>)}</div>
        <div className="row" style={{ marginTop: 18 }}>
          <button className="btn primary" disabled={busy || (!genres.length && !moods.length)} onClick={submit}><I.spark />이 취향으로 찾기</button>
          {(genres.length > 0 || moods.length > 0) && <button className="btn ghost sm" onClick={() => { setGenres([]); setMoods([]); }}>선택 지우기</button>}
        </div>
        <p className="faint tiny" style={{ marginTop: 10 }}>고른 취향은 저장돼서, 기록 기반 추천에도 함께 반영돼요.</p>
      </section>
      {recs === null ? (busy ? <Skeletons /> : null) : recs.length === 0 ? <p className="muted">맞는 영화를 찾지 못했어요. 다른 장르를 골라 보세요.</p> : (
        <>
          <div className="recs">{recs.map((m) => <RecCard key={m.id} m={m} reason={`선택한 ‘${label}’ 취향과 맞아요`} />)}</div>
          {more && <div style={{ textAlign: 'center', marginTop: 18 }}><button className="btn" disabled={busy} onClick={() => run(asked.genres, asked.moods, page + 1)}>{busy ? '불러오는 중…' : '더 보기'}</button></div>}
          <p className="faint tiny" style={{ marginTop: 18 }}>{config.movies ? 'TMDB 전체 영화 중 평점 7점 이상·많이 본 영화에서 골랐어요. 영화 정보 제공: TMDB' : '지금은 기본 영화 15편 안에서 찾았어요. TMDB를 연결하면 전 세계 영화에서 찾아 드려요.'}</p>
        </>
      )}
    </>
  );
}

export function Recommend() {
  const { tickets, profile } = useApp();
  const list = tickets || [];
  const [tab, setTab] = useState(list.length ? 'history' : 'taste');
  const taste = (profile && profile.taste) || {};
  const tasteG = tasteGenres(taste.genres || [], taste.moods || []);
  const topMoods = count(list.flatMap((t) => t.moods || [])).slice(0, 3).map((x) => x[0]);

  return (
    <>
      <div className="head">
        <div>
          <p className="kicker">NEXT FEATURE</p>
          <h1>당신의 여운과 닮은 다음 영화</h1>
          <p className="muted">{tab === 'history'
            ? `기록한 ${list.length}편${topMoods.length ? ` · 자주 남은 여운 ${topMoods.join(', ')}` : ''}을 바탕으로 골랐어요.`
            : '좋아하는 장르와 남았으면 하는 여운을 고르면, 그에 맞는 영화를 찾아 드려요.'}</p>
        </div>
      </div>
      <div className="seg" role="group" aria-label="추천 방식" style={{ maxWidth: 420, margin: '0 0 20px' }}>
        <button type="button" aria-pressed={tab === 'history'} onClick={() => setTab('history')}>내 기록 기반</button>
        <button type="button" aria-pressed={tab === 'taste'} onClick={() => setTab('taste')}>취향으로 찾기</button>
      </div>
      {tab === 'taste' ? <FromTaste list={list} /> : list.length ? <FromHistory list={list} tasteG={tasteG} /> : (
        <div className="empty"><I.spark /><h2>아직 기록한 영화가 없어요</h2><p>‘취향으로 찾기’에서 장르와 무드를 고르거나, 본 영화를 기록하면 닮은 영화를 찾아 드려요.</p>
          <div className="row" style={{ justifyContent: 'center' }}><button className="btn primary" onClick={() => setTab('taste')}><I.heart />취향으로 찾기</button><a className="btn" href="#/add"><I.plus />티켓 등록</a></div>
        </div>
      )}
    </>
  );
}
