// 영화 정보 보기: 앱 안에서 줄거리·감독·출연·볼 수 있는 곳·예고편을 보여 주고, 외부 링크는 보조로.
import { useEffect, useState } from 'react';
import { Sheet, Loading, Poster } from './kit.jsx';
import { I } from './icons.jsx';
import { server } from '../lib/server.js';
import { links } from '../lib/util.js';
import { byId } from '../lib/catalog.js';

const cache = new Map();

export function InfoButton({ m }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn sm ghost" onClick={() => setOpen(true)} aria-label={`${m.title} 정보 보기`}>정보 보기</button>
      {open && <MovieInfo m={m} onClose={() => setOpen(false)} />}
    </>
  );
}

export function MovieInfo({ m, onClose }) {
  const id = Number(m.id || m.movie_id) || null;
  const [d, setD] = useState(() => (id && cache.get(id)) || null);
  const [state, setState] = useState(d ? 'ok' : id ? 'loading' : 'none');
  useEffect(() => {
    if (!id || cache.has(id)) return undefined;
    let alive = true;
    server.movieDetail(id).then((r) => {
      if (!alive) return;
      if (r && r.movie) { cache.set(id, r.movie); setD(r.movie); setState('ok'); } else setState('none');
    });
    return () => { alive = false; };
  }, [id]);

  const cat = id ? byId(id) : null; // 서버 없이도 기본 영화는 정보가 있음
  const title = (d && d.title) || m.title;
  const year = (d && d.year) || m.year || m.release_year;
  const genres = (d && d.genres && d.genres.length ? d.genres : m.genres) || [];
  const overview = (d && d.overview) || m.overview || (cat && cat.overview) || '';
  const rating = (d && d.rating) || m.rating;
  const p = d && d.providers;

  return (
    <Sheet title="영화 정보" onClose={onClose}>
      <div className="mi-head">
        <div className="mi-poster"><Poster src={(d && d.poster) || m.poster || m.poster_url} title={title} /></div>
        <div style={{ minWidth: 0 }}>
          <h3>{title}</h3>
          {d && d.originalTitle && d.originalTitle !== title && <div className="faint small">{d.originalTitle}</div>}
          <div className="faint small" style={{ marginTop: 6 }}>{[year, genres.slice(0, 3).join('·'), d && d.runtime ? `${d.runtime}분` : null, d && d.certification ? `${d.certification}${/^\d+$/.test(d.certification) ? '세' : ''}` : null].filter(Boolean).join(' · ')}</div>
          {rating ? <div className="mi-rating">★ {Number(rating).toFixed(1)} <span className="faint tiny">TMDB 평점</span></div> : null}
        </div>
      </div>

      {state === 'loading' ? <Loading text="영화 정보를 불러오는 중" /> : (
        <>
          {d && d.tagline && <p className="mi-tagline">“{d.tagline}”</p>}
          {overview ? <p className="mi-overview">{overview}</p> : <p className="muted small">등록된 줄거리가 아직 없어요.</p>}
          {d && (d.directors.length > 0 || d.cast.length > 0) && (
            <dl className="mi-credits">
              {d.directors.length > 0 && <><dt>감독</dt><dd>{d.directors.join(', ')}</dd></>}
              {d.cast.length > 0 && <><dt>출연</dt><dd>{d.cast.join(', ')}</dd></>}
            </dl>
          )}
          {p && (p.stream.length > 0 || p.rent.length > 0 || p.buy.length > 0) && (
            <div className="mi-where">
              <b>볼 수 있는 곳 <span className="faint tiny">(한국 기준)</span></b>
              {p.stream.length > 0 && <div><span className="faint small">구독</span>{p.stream.map((x) => <span key={x} className="pill">{x}</span>)}</div>}
              {p.rent.length > 0 && <div><span className="faint small">대여</span>{p.rent.map((x) => <span key={x} className="pill">{x}</span>)}</div>}
              {p.buy.length > 0 && p.rent.length === 0 && <div><span className="faint small">구매</span>{p.buy.map((x) => <span key={x} className="pill">{x}</span>)}</div>}
              <span className="faint tiny">정보 제공: JustWatch</span>
            </div>
          )}
        </>
      )}

      <div className="mi-links">
        {d && d.trailer
          ? <a className="btn sm primary" href={d.trailer} target="_blank" rel="noopener"><I.play />예고편</a>
          : <a className="btn sm" href={links.youtubeTrailer(title, year)} target="_blank" rel="noopener"><I.play />예고편 찾기</a>}
        <a className="btn sm" href={links.naverMovie(title, year)} target="_blank" rel="noopener"><I.search />네이버에서 보기</a>
        {id && <a className="btn sm ghost" href={(d && d.tmdbUrl) || `https://www.themoviedb.org/movie/${id}?language=ko`} target="_blank" rel="noopener"><I.link />TMDB</a>}
      </div>
      <div className="actions"><button className="btn ghost" onClick={onClose}>닫기</button></div>
    </Sheet>
  );
}
