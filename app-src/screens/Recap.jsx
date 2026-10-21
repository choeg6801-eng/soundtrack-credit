// 연말 결산 화면  #/recap?year=2026
import { useMemo, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { ShareSheet } from '../ui/ShareSheet.jsx';
import { computeRecap, recapYears, recapTiles, renderRecapCard } from '../lib/recap.js';
import { whenDate, placeOf } from '../lib/when.js';

export function Recap({ query }) {
  const { tickets } = useApp();
  const years = useMemo(() => recapYears(tickets), [tickets]);
  const now = new Date().getFullYear();
  const asked = Number(query.get('year'));
  const [year, setYear] = useState(years.includes(asked) ? asked : years.includes(now) ? now : years[0] || now);
  const r = useMemo(() => computeRecap(tickets, year), [tickets, year]);
  const [share, setShare] = useState(false);
  const max = Math.max(1, ...r.months);
  const quote = r.pick ? (r.pick.review || r.pick.transcript || '') : '';
  const done = year < now || new Date().getMonth() === 11;

  return (
    <>
      <a className="back" href="#/"><I.back />티켓북</a>
      <div className="recap-hero">
        <p className="kicker">{year} · YOUR YEAR IN CREDITS</p>
        {r.total ? (
          <h1>{year}년, {done ? '' : '지금까지 '}나는 <em>{r.total}편</em>의 영화와<br /><em>{r.moodCount}번</em>의 여운을 남겼어요</h1>
        ) : <h1>{year}년에는 아직 기록이 없어요</h1>}
        {years.length > 1 && (
          <div className="chips" role="group" aria-label="연도" style={{ marginTop: 16 }}>
            {years.map((y) => <button key={y} className="chip" aria-pressed={y === year} onClick={() => setYear(y)}>{y}</button>)}
          </div>
        )}
      </div>

      {!r.total ? (
        <div className="empty"><I.ticket /><h2>본 영화를 기록하면 결산이 채워져요</h2><p>예전에 본 영화도 ‘연도만’ 골라 기록할 수 있어요.</p><a className="btn primary" href="#/add"><I.plus />티켓 등록</a></div>
      ) : (
        <>
          <div className="recap-posters" aria-label={`${year}년에 본 영화`}>
            {r.list.slice().reverse().map((t) => <a key={t.id} href={`#/ticket/${t.id}`} title={t.title}><Poster src={t.poster_url} title={t.title} /></a>)}
          </div>

          <div className="stats recap-stats">
            {recapTiles(r).map(([label, value, sub]) => (
              <div className="stat" key={label}><b>{value}{sub && <small> · {sub}</small>}</b><span>{label}</span></div>
            ))}
          </div>

          <div className="cols">
            <section className="card" aria-labelledby="rc-month">
              <div className="card-title"><h2 id="rc-month">월별 관람</h2>{r.topMonth && <span className="faint small">{r.topMonth.month}월에 가장 많이 봤어요</span>}</div>
              <div className="recap-bars" role="img" aria-label={`월별 관람 편수: ${r.months.map((n, i) => `${i + 1}월 ${n}편`).join(', ')}`}>
                {r.months.map((n, i) => (
                  <div key={i} className={n === max && n ? 'top' : ''}>
                    <span className="n">{n || ''}</span>
                    <i style={{ height: `${n ? Math.max(8, (n / max) * 100) : 3}%` }} />
                    <small>{i + 1}</small>
                  </div>
                ))}
              </div>
              {r.undatedMonths > 0 && <p className="faint tiny" style={{ margin: '10px 0 0' }}>몇 월인지 모르는 {r.undatedMonths}편은 그래프에서 빠졌어요.</p>}
              <div className="recap-split" aria-label="어디서 봤나요">
                <div className="bar">
                  {r.cinema > 0 && <i style={{ flex: r.cinema }} className="c" />}
                  {r.ott > 0 && <i style={{ flex: r.ott }} className="o" />}
                  {r.other > 0 && <i style={{ flex: r.other }} className="h" />}
                </div>
                <div className="faint small row" style={{ gap: 14, marginTop: 8 }}>
                  <span><b className="dot c" />영화관 {r.cinema}편</span><span><b className="dot o" />OTT {r.ott}편</span>{r.other > 0 && <span><b className="dot h" />TV·기타 {r.other}편</span>}
                </div>
              </div>
              <ul className="recap-facts">
                {r.rainy > 0 && <li>비 오는 날 본 영화 <b>{r.rainy}편</b></li>}
                {r.snowy > 0 && <li>눈 오는 날 본 영화 <b>{r.snowy}편</b></li>}
                {r.ostCount > 0 && <li>OST를 찾아 둔 영화 <b>{r.ostCount}편</b></li>}
                {r.voiceCount > 0 && <li>남긴 보이스 메모 <b>{r.voiceCount}개 · {Math.round(r.voiceSeconds)}초</b></li>}
                {r.first && <li>올해의 첫 영화 <b>{r.first.title}</b> <span className="faint">({whenDate(r.first)})</span></li>}
                {r.last && r.last !== r.first && <li>가장 최근 영화 <b>{r.last.title}</b> <span className="faint">({whenDate(r.last)})</span></li>}
              </ul>
            </section>

            {r.pick && (
              <section className="card recap-pick" aria-labelledby="rc-pick">
                <div className="card-title"><h2 id="rc-pick"><I.spark />올해 가장 진하게 남은 한 편</h2></div>
                <a href={`#/ticket/${r.pick.id}`} className="row" style={{ alignItems: 'flex-start', gap: 16, color: 'inherit', textDecoration: 'none' }}>
                  <div style={{ width: 96, flex: 'none' }}><Poster src={r.pick.poster_url} title={r.pick.title} /></div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ margin: 0 }}>{r.pick.title}</h3>
                    <div className="faint tiny">{whenDate(r.pick)} · {placeOf(r.pick)}</div>
                    {quote && <blockquote>“{quote}”</blockquote>}
                    {(r.pick.moods || []).length > 0 && <div className="tags">{r.pick.moods.slice(0, 3).map((m) => <span key={m}>{m}</span>)}</div>}
                  </div>
                </a>
                <p className="faint tiny" style={{ margin: '12px 0 0' }}>보이스 메모·감상·무드가 가장 많이 남은 기록을 골랐어요.</p>
              </section>
            )}
          </div>

          <div className="row" style={{ marginTop: 22 }}>
            <button className="btn primary" onClick={() => setShare(true)}><I.share />결산 카드 만들기</button>
          </div>
          {share && <ShareSheet title={`${year} 결산 카드`} render={(f) => renderRecapCard(r, f)} fileBase={`${year}-recap`} alt={`${year}년 결산 카드 미리보기`} shareTitle={`나의 ${year} 영화 크레딧`} shareText="#연말결산 #시네필기록 #올해의영화" caption="올해 본 영화 포스터, 많이 본 장르·여운·극장, 월별 관람 그래프가 한 장에 들어가요." onClose={() => setShare(false)} />}
        </>
      )}
    </>
  );
}
