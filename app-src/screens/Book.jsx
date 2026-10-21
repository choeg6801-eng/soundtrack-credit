import { useMemo, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { count } from '../lib/util.js';
import { whenDate, yearKey, knowsMonth, isCinema } from '../lib/when.js';

export function Book() {
  const { tickets, profile, watch } = useApp();
  const wl = watch || [];
  const [q, setQ] = useState('');
  const [year, setYear] = useState('전체');
  const list = tickets || [];

  const years = useMemo(() => ['전체', ...new Set(list.map(yearKey))], [list]);
  const shown = list.filter((t) => {
    if (year !== '전체' && yearKey(t) !== year) return false;
    if (!q.trim()) return true;
    const s = q.trim().toLowerCase();
    return [t.title, t.original_title, t.theater, t.platform, ...(t.moods || [])].some((x) => String(x || '').toLowerCase().includes(s));
  });

  const now = new Date();
  const thisMonth = list.filter((t) => { if (!knowsMonth(t)) return false; const d = new Date(t.watched_at); return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth(); }).length;
  const topGenre = count(list.flatMap((t) => t.genres || []))[0];
  const topMood = count(list.flatMap((t) => t.moods || []))[0];

  return (
    <>
      <div className="head">
        <div>
          <p className="kicker">MY TICKET BOOK</p>
          <h1>{profile && profile.nickname ? `${profile.nickname}님의 티켓북` : '나의 티켓북'}</h1>
        </div>
        <a className="btn primary hide-sm" href="#/add"><I.plus />티켓 등록</a>
      </div>

      {list.length > 0 && (
        <div className="stats" aria-label="관람 통계">
          <div className="stat"><b>{list.length}편</b><span>지금까지 본 영화</span></div>
          <div className="stat"><b>{thisMonth}편</b><span>이번 달</span></div>
          <div className="stat"><b>{topGenre ? topGenre[0] : '—'}</b><span>가장 많이 본 장르</span></div>
          <div className="stat"><b>{topMood ? topMood[0] : '—'}</b><span>가장 자주 남은 여운</span></div>
        </div>
      )}

      {wl.length > 0 && (
        <a className="watch-strip" href="#/recommend?tab=watch" aria-label={`보고 싶은 영화 ${wl.length}편 전체 보기`}>
          <div className="watch-strip-head"><span><I.bookmarked />보고 싶은 영화 <b>{wl.length}편</b></span><span className="faint small">전체 보기 →</span></div>
          <div className="watch-strip-row">{wl.slice(0, 8).map((w) => <Poster key={w.movie_id} src={w.poster_url} title={w.title} />)}</div>
        </a>
      )}

      {list.length === 0 ? (
        <div className="empty">
          <I.ticket />
          <h2>아직 기록된 티켓이 없어요</h2>
          <p>오늘 본 영화의 티켓 바코드를 스캔하거나 영화 제목으로 검색해서 첫 크레딧을 남겨 보세요.</p>
          <div className="row" style={{ justifyContent: 'center' }}><a className="btn primary" href="#/add"><I.plus />첫 티켓 등록하기</a><a className="btn" href="#/recommend"><I.spark />취향으로 영화 추천 받기</a></div>
        </div>
      ) : (
        <>
          <div className="toolbar">
            <label className="sr" htmlFor="book-q">티켓 검색</label>
            <input id="book-q" className="input" type="search" placeholder="제목, 극장·OTT, 무드로 찾기" value={q} onChange={(e) => setQ(e.target.value)} />
            {years.length > 2 && (
              <select className="select" style={{ width: 'auto', minHeight: 46 }} value={year} onChange={(e) => setYear(e.target.value)} aria-label="연도">
                {years.map((y) => <option key={y} value={y}>{y === '전체' ? '전체 연도' : `${y}년`}</option>)}
              </select>
            )}
          </div>
          {shown.length === 0 ? <p className="muted">찾는 티켓이 없어요.</p> : (
            <div className="book">
              {shown.map((t) => (
                <a key={t.id} className="tcard" href={`#/ticket/${t.id}`}>
                  <div style={{ position: 'relative' }}>
                    <Poster src={t.poster_url} title={t.title} />
                    <div className="badges">
                      {t.voice_path && <span className="badge"><I.mic />{t.voice_seconds ? `0:${String(t.voice_seconds).padStart(2, '0')}` : '보이스'}</span>}
                      {!isCinema(t) && <span className="badge">{t.watch_type === 'ott' ? 'OTT' : 'HOME'}</span>}
                      {t.sample && <span className="badge">예시</span>}
                    </div>
                  </div>
                  <h3>{t.title}</h3>
                  <div className="meta">{whenDate(t)}{isCinema(t) ? (t.seat ? ` · ${t.seat}` : '') : t.platform ? ` · ${t.platform}` : ''}{t.weather_text ? ` · ${t.weather_text}` : ''}</div>
                </a>
              ))}
            </div>
          )}
        </>
      )}
      <a className="btn primary fab" href="#/add" aria-label="티켓 등록"><I.plus />등록</a>
    </>
  );
}
