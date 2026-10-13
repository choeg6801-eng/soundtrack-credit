import { useEffect, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { recommendFromCatalog } from '../lib/catalog.js';
import { server } from '../lib/server.js';
import { count, links } from '../lib/util.js';

export function Recommend() {
  const { tickets, config } = useApp();
  const list = tickets || [];
  const [recs, setRecs] = useState(null);
  const [source, setSource] = useState('');

  useEffect(() => {
    let alive = true;
    if (!list.length) { setRecs([]); return; }
    const local = () => { setRecs(recommendFromCatalog(list)); setSource('catalog'); };
    const seeds = list.filter((t) => t.movie_id).slice(0, 8);
    if (!config.movies || !seeds.length) { local(); return; }
    setRecs(null);
    const genres = count(list.flatMap((t) => t.genres || [])).slice(0, 3).map((x) => x[0]);
    server.recommend(seeds.map((t) => t.movie_id), list.map((t) => t.movie_id).filter(Boolean), genres).then((r) => {
      if (!alive) return;
      if (r && r.results && r.results.length) {
        const title = (id) => (list.find((t) => t.movie_id === id) || {}).title;
        setRecs(r.results.map((m) => ({ ...m, becauseTitles: m.because.map(title).filter(Boolean), sharedMoods: [] })));
        setSource('tmdb');
      } else local();
    });
    return () => { alive = false; };
  }, [tickets]);

  const topMoods = count(list.flatMap((t) => t.moods || [])).slice(0, 3).map((x) => x[0]);

  return (
    <>
      <div className="head">
        <div>
          <p className="kicker">NEXT FEATURE</p>
          <h1>당신의 여운과 닮은 다음 영화</h1>
          <p className="muted">{list.length ? `기록한 ${list.length}편${topMoods.length ? ` · 자주 남은 여운 ${topMoods.join(', ')}` : ''}을 바탕으로 골랐어요.` : '티켓을 기록하면 취향을 읽기 시작해요.'}</p>
        </div>
      </div>
      {!list.length ? (
        <div className="empty"><I.spark /><h2>먼저 본 영화를 기록해 주세요</h2><p>한 편만 기록해도 무드·장르·OST 스타일이 닮은 영화를 찾아 드려요.</p><a className="btn primary" href="#/add"><I.plus />티켓 등록</a></div>
      ) : recs === null ? (
        <div className="recs">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: 170 }} />)}</div>
      ) : recs.length === 0 ? (
        <p className="muted">지금은 추천할 영화를 찾지 못했어요. 티켓을 더 기록해 주세요.</p>
      ) : (
        <>
          <div className="recs">
            {recs.map((m) => (
              <article key={m.id} className="rec-card">
                <Poster src={m.poster} title={m.title} />
                <div style={{ minWidth: 0 }}>
                  <h3>{m.title}</h3>
                  <div className="faint tiny">{[m.year, (m.genres || []).slice(0, 2).join('·')].filter(Boolean).join(' · ')}</div>
                  <div className="meter" aria-hidden="true"><i style={{ width: `${m.match}%` }} /></div>
                  <div className="small"><b style={{ color: 'var(--accent-text)' }}>{m.match}%</b> <span className="muted">{m.becauseTitles && m.becauseTitles.length ? `‘${m.becauseTitles.slice(0, 2).join('’, ‘')}’의 여운을 좋아했다면` : '내 취향과 닮았어요'}</span></div>
                  <div className="tags">{[...(m.sharedMoods || []).map((x) => `${x} 무드`), ...(m.sharedGenres || []).slice(0, 2)].slice(0, 3).map((x) => <span key={x}>{x}</span>)}</div>
                  <div className="row" style={{ marginTop: 10, gap: 6 }}>
                    <a className="btn sm" href={`#/add?movie=${m.id}`}>봤어요</a>
                    <a className="btn sm ghost" href={links.naver(`${m.title} 영화`)} target="_blank" rel="noopener">정보 보기</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="faint tiny" style={{ marginTop: 18 }}>{source === 'tmdb' ? '영화 정보 제공: TMDB. 이 서비스는 TMDB API를 사용하지만 TMDB의 보증이나 인증을 받지 않았습니다.' : '기본 영화 목록 안에서 무드(×3)·장르(×2)·OST 스타일(×2)이 겹치는 정도로 계산했어요.'}</p>
        </>
      )}
    </>
  );
}
