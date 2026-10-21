import { useEffect, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { recommendFromCatalog, discoverFromCatalog, tasteGenres, moodGenres, GENRE_CHOICES, MOODS } from '../lib/catalog.js';
import { server } from '../lib/server.js';
import { count, links, fmtDate } from '../lib/util.js';

export function WantButton({ m }) {
  const { isWanted, toggleWatch } = useApp();
  const on = isWanted(m.id || m.movie_id);
  return (
    <button type="button" className={`btn sm want${on ? ' on' : ''}`} aria-pressed={on} onClick={() => toggleWatch(m)} aria-label={on ? `${m.title} 보고 싶은 영화에서 빼기` : `${m.title} 보고 싶은 영화에 담기`}>
      {on ? <I.bookmarked /> : <I.bookmark />}{on ? '담았어요' : '보고 싶어요'}
    </button>
  );
}

function RecCard({ m, reason, rank }) {
  return (
    <article className="rec-card">
      <Poster src={m.poster} title={m.title} />
      <div style={{ minWidth: 0 }}>
        <h3>{rank ? <span style={{ color: 'var(--accent-text)', fontFamily: 'var(--mono)', fontSize: 13, marginRight: 6 }}>{rank}</span> : null}{m.title}</h3>
        <div className="faint tiny">{[m.year, (m.genres || []).slice(0, 3).join('·'), m.rating ? `평점 ${m.rating.toFixed(1)}` : null].filter(Boolean).join(' · ')}</div>
        <div className="meter" aria-hidden="true"><i style={{ width: `${m.match}%` }} /></div>
        <div className="small"><b style={{ color: 'var(--accent-text)' }}>{m.match}%</b> <span className="muted">{reason}</span></div>
        <div className="tags">{[...(m.sharedMoods || []).map((x) => `${x} 무드`), ...(m.sharedGenres || []).slice(0, 2)].slice(0, 3).map((x) => <span key={x}>{x}</span>)}</div>
        <div className="row rec-actions">
          <WantButton m={m} />
          <a className="btn sm" href={`#/add?movie=${m.id}`}>봤어요</a>
          <a className="btn sm ghost" href={links.naver(`${m.title} 영화`)} target="_blank" rel="noopener">정보 보기</a>
        </div>
      </div>
    </article>
  );
}

const SORTS = [['match', '추천 높은 순'], ['rating', '평점 높은 순'], ['year', '최신 개봉 순']];
function sortRecs(list, key) {
  const by = {
    match: (a, b) => (b.match || 0) - (a.match || 0) || (b.rating || 0) - (a.rating || 0),
    rating: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.match || 0) - (a.match || 0),
    year: (a, b) => (b.year || 0) - (a.year || 0) || (b.match || 0) - (a.match || 0),
  }[key];
  return list.slice().sort(by);
}
function SortBar({ value, onChange, count, showRating }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between', margin: '0 0 14px' }}>
      <span className="faint small">{count}편 · {SORTS.find((x) => x[0] === value)[1]}</span>
      <div className="chips" role="group" aria-label="정렬">
        {SORTS.filter((x) => showRating || x[0] !== 'rating').map(([k, label]) => <button key={k} className="chip" style={{ minHeight: 36 }} aria-pressed={value === k} onClick={() => onChange(k)}>{label}</button>)}
      </div>
    </div>
  );
}

const Skeletons = () => <div className="recs">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 170 }} />)}</div>;

// ── 기록 기반 ───────────────────────────────
function FromHistory({ list, tasteG }) {
  const { config } = useApp();
  const [recs, setRecs] = useState(null);
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('match');

  useEffect(() => {
    let alive = true;
    const local = () => { setRecs(recommendFromCatalog(list, tasteG)); setSource('catalog'); };
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
      <SortBar value={sort} onChange={setSort} count={recs.length} showRating={recs.some((m) => m.rating)} />
      <div className="recs">
        {sortRecs(recs, sort).map((m, i) => <RecCard key={m.id} m={m} rank={i + 1} reason={m.becauseTitles && m.becauseTitles.length ? `‘${m.becauseTitles.slice(0, 2).join('’, ‘')}’의 여운을 좋아했다면` : '내 취향과 닮았어요'} />)}
      </div>
      <p className="faint tiny" style={{ marginTop: 18 }}>{source === 'tmdb' ? '내가 본 영화마다 비슷한 영화를 모아, 여러 편에서 겹치고 내 장르 취향과 맞을수록 높게 매겼어요. 영화 정보 제공: TMDB' : '지금은 기본 영화 15편 안에서만 골랐어요. 본 영화마다 무드·장르·OST 스타일이 닮은 영화를 번갈아 보여 줘요. (TMDB를 연결하면 전 세계 영화에서 추천)'}</p>
    </>
  );
}

// ── 취향으로 찾기 ───────────────────────────
export function FromTaste({ list, title = '어떤 영화가 끌리세요?' }) {
  const { backend, config, profile, setProfile, toast } = useApp();
  const saved = (profile && profile.taste) || {};
  const [genres, setGenres] = useState(saved.genres || []);
  const [moods, setMoods] = useState(saved.moods || []);
  const [recs, setRecs] = useState(null);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const [more, setMore] = useState(false);
  const [asked, setAsked] = useState({ genres: [], moods: [] });
  const [sort, setSort] = useState('match');
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
      const r = await server.discover(g, moodGenres(m, g), exclude, p);
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
    try { const p = await backend.updateProfile({ taste: { genres, moods, done: true } }); if (p) setProfile(p); } catch (e) { /* 저장 실패해도 추천은 보여 줌 */ }
  };

  const label = [...asked.genres, ...asked.moods].slice(0, 3).join('·');
  return (
    <>
      <section className="card" aria-labelledby="taste-h" style={{ marginBottom: 18 }}>
        <div className="card-title"><h2 id="taste-h"><I.heart />{title}</h2></div>
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
          <SortBar value={sort} onChange={setSort} count={recs.length} showRating={recs.some((m) => m.rating)} />
          <div className="recs">{sortRecs(recs, sort).map((m, i) => <RecCard key={m.id} m={m} rank={i + 1} reason={m.sharedGenres && m.sharedGenres.length ? `‘${m.sharedGenres.slice(0, 3).join('·')}’ 취향과 맞아요` : `선택한 ‘${label}’ 취향과 맞아요`} />)}</div>
          {more && <div style={{ textAlign: 'center', marginTop: 18 }}><button className="btn" disabled={busy} onClick={() => run(asked.genres, asked.moods, page + 1)}>{busy ? '불러오는 중…' : '더 보기'}</button></div>}
          <p className="faint tiny" style={{ marginTop: 18 }}>{config.movies ? 'TMDB 전체 영화 중 평점 7점 이상·많이 본 영화에서 골랐어요. 영화 정보 제공: TMDB' : '지금은 기본 영화 15편 안에서 찾았어요. TMDB를 연결하면 전 세계 영화에서 찾아 드려요.'}</p>
        </>
      )}
    </>
  );
}

// ── 보고 싶은 영화 ──────────────────────────
const WSORTS = [['added', '담은 순'], ['rating', '평점 높은 순'], ['year', '최신 개봉 순']];
export function WatchList() {
  const { watch, toggleWatch } = useApp();
  const [sort, setSort] = useState('added');
  const [genre, setGenre] = useState('전체');
  if (watch === null) return <Skeletons />;
  if (!watch.length) return (
    <div className="empty"><I.bookmark /><h2>아직 담은 영화가 없어요</h2><p>추천 목록에서 ‘보고 싶어요’를 누르면 여기에 모여요. 다 보고 티켓을 기록하면 목록에서 자동으로 빠져요.</p></div>
  );
  const genres = ['전체', ...count(watch.flatMap((w) => w.genres || [])).slice(0, 6).map((x) => x[0])];
  const shown = watch.filter((w) => genre === '전체' || (w.genres || []).includes(genre)).slice().sort({
    added: (a, b) => String(b.created_at).localeCompare(String(a.created_at)),
    rating: (a, b) => (b.rating || 0) - (a.rating || 0),
    year: (a, b) => (b.release_year || 0) - (a.release_year || 0),
  }[sort]);
  return (
    <>
      <div className="row" style={{ justifyContent: 'space-between', margin: '0 0 10px' }}>
        <span className="faint small">{shown.length}편{genre !== '전체' ? ` · ${genre}` : ''}</span>
        <div className="chips" role="group" aria-label="정렬">
          {WSORTS.filter((x) => x[0] !== 'rating' || watch.some((w) => w.rating)).map(([k, label]) => <button key={k} className="chip" style={{ minHeight: 36 }} aria-pressed={sort === k} onClick={() => setSort(k)}>{label}</button>)}
        </div>
      </div>
      {genres.length > 2 && <div className="chips" role="group" aria-label="장르" style={{ marginBottom: 14 }}>{genres.map((g) => <button key={g} className="chip" style={{ minHeight: 36 }} aria-pressed={genre === g} onClick={() => setGenre(g)}>{g}</button>)}</div>}
      <div className="recs">
        {shown.map((w) => (
          <article className="rec-card" key={w.movie_id}>
            <Poster src={w.poster_url} title={w.title} />
            <div style={{ minWidth: 0 }}>
              <h3>{w.title}</h3>
              <div className="faint tiny">{[w.release_year, (w.genres || []).slice(0, 3).join('·'), w.rating ? `평점 ${Number(w.rating).toFixed(1)}` : null].filter(Boolean).join(' · ')}</div>
              <div className="faint tiny" style={{ marginTop: 6 }}>{fmtDate(w.created_at, false)}에 담음</div>
              <div className="row rec-actions">
                <a className="btn sm primary" href={`#/add?movie=${w.movie_id}`}><I.ticket />봤어요 · 기록</a>
                <a className="btn sm ghost" href={links.naver(`${w.title} 영화`)} target="_blank" rel="noopener">정보 보기</a>
                <button type="button" className="btn sm ghost" onClick={() => toggleWatch(w)} aria-label={`${w.title} 목록에서 빼기`}><I.trash />빼기</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export function Recommend() {
  const { tickets, profile, route, watch } = useApp();
  const list = tickets || [];
  const want = route.query.get('tab');
  const [tab, setTab] = useState(want === 'watch' ? 'watch' : list.length ? 'history' : 'taste');
  useEffect(() => { if (want === 'watch') setTab('watch'); }, [want]);
  const taste = (profile && profile.taste) || {};
  const tasteG = tasteGenres(taste.genres || [], taste.moods || []);
  const topMoods = count(list.flatMap((t) => t.moods || [])).slice(0, 3).map((x) => x[0]);

  return (
    <>
      <div className="head">
        <div>
          <p className="kicker">NEXT FEATURE</p>
          <h1>당신의 여운과 닮은 다음 영화</h1>
          <p className="muted">{tab === 'watch' ? '담아 둔 영화를 한눈에 보고, 다 보면 바로 티켓으로 기록하세요.' : tab === 'history'
            ? `기록한 ${list.length}편${topMoods.length ? ` · 자주 남은 여운 ${topMoods.join(', ')}` : ''}을 바탕으로 골랐어요.`
            : '좋아하는 장르와 남았으면 하는 여운을 고르면, 그에 맞는 영화를 찾아 드려요.'}</p>
        </div>
      </div>
      <div className="seg seg3" role="group" aria-label="추천 방식" style={{ maxWidth: 560, margin: '0 0 20px' }}>
        <button type="button" aria-pressed={tab === 'history'} onClick={() => setTab('history')}>내 기록 기반</button>
        <button type="button" aria-pressed={tab === 'taste'} onClick={() => setTab('taste')}>취향으로 찾기</button>
        <button type="button" aria-pressed={tab === 'watch'} onClick={() => setTab('watch')}>보고 싶어요{watch && watch.length ? ` ${watch.length}` : ''}</button>
      </div>
      {tab === 'watch' ? <WatchList /> : tab === 'taste' ? <FromTaste list={list} /> : list.length ? <FromHistory list={list} tasteG={tasteG} /> : (
        <div className="empty"><I.spark /><h2>아직 기록한 영화가 없어요</h2><p>‘취향으로 찾기’에서 장르와 무드를 고르거나, 본 영화를 기록하면 닮은 영화를 찾아 드려요.</p>
          <div className="row" style={{ justifyContent: 'center' }}><button className="btn primary" onClick={() => setTab('taste')}><I.heart />취향으로 찾기</button><a className="btn" href="#/add"><I.plus />티켓 등록</a></div>
        </div>
      )}
    </>
  );
}
