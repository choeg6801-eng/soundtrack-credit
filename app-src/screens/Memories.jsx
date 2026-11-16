// N년 전 오늘  #/memories?date=2026-10-22
import { useMemo, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { memoriesFor, groupByYears, memoryDays } from '../lib/memories.js';
import { placeOf } from '../lib/when.js';
import { fmtDate, pad } from '../lib/util.js';

const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const RANGES = [[0, '그날만'], [3, '앞뒤 3일'], ['month', '그달 전체']];
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function Memories({ query }) {
  const { tickets } = useApp();
  const list = tickets || [];
  const [date, setDate] = useState(() => { const q = query.get('date'); const d = q ? new Date(`${q}T12:00`) : new Date(); return isNaN(d) ? new Date() : d; });
  const [range, setRange] = useState(3);
  const groups = useMemo(() => groupByYears(memoriesFor(list, date, range)), [list, date, range]);
  const days = useMemo(() => memoryDays(list, date), [list, date]);
  const isToday = ymd(date) === ymd(new Date());
  const shift = (n) => setDate((d) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; });
  const total = groups.reduce((a, g) => a + g.items.length, 0);
  const title = `${date.getMonth() + 1}월 ${date.getDate()}일`;

  return (
    <>
      <a className="back" href="#/"><I.back />티켓북</a>
      <div className="head">
        <div>
          <p className="kicker">ON THIS DAY</p>
          <h1>{isToday ? `N년 전 오늘, ${title}` : `N년 전 ${title}`}</h1>
          <p className="muted">{total ? `지난 ${groups.length}개 해에 걸쳐 ${total}편의 기억이 있어요.` : '이 날짜 근처에는 아직 기억이 없어요.'}</p>
        </div>
      </div>

      <div className="mem-controls">
        <div className="row" style={{ gap: 6 }}>
          <button type="button" className="btn sm" onClick={() => shift(-1)} aria-label="전날"><I.back /></button>
          <input className="input" type="date" aria-label="날짜 고르기" value={ymd(date)} onChange={(e) => { const d = new Date(`${e.target.value}T12:00`); if (!isNaN(d)) setDate(d); }} style={{ width: 'auto', minHeight: 40 }} />
          <button type="button" className="btn sm" onClick={() => shift(1)} aria-label="다음날"><span style={{ display: 'inline-flex', transform: 'scaleX(-1)' }}><I.back /></span></button>
          {!isToday && <button type="button" className="btn sm ghost" onClick={() => setDate(new Date())}>오늘</button>}
        </div>
        <div className="chips" role="group" aria-label="범위">
          {RANGES.map(([k, label]) => <button key={label} type="button" className="chip" style={{ minHeight: 36 }} aria-pressed={range === k} onClick={() => setRange(k)}>{label}</button>)}
        </div>
      </div>

      {groups.length > 0 ? (
        <div className="mem-years">
          {groups.map(({ yearsAgo, items }) => (
            <section key={yearsAgo} className="mem-year" aria-labelledby={`y-${yearsAgo}`}>
              <h2 id={`y-${yearsAgo}`}><b>{yearsAgo}년 전</b><span className="faint small">{date.getFullYear() - yearsAgo}년</span></h2>
              <div className="mem-list">
                {items.map(({ t, diff }) => {
                  const d = new Date(t.watched_at);
                  const quote = t.review || t.transcript || '';
                  return (
                    <a key={t.id} className="mem-item" href={`#/ticket/${t.id}`}>
                      <Poster src={t.poster_url} title={t.title} />
                      <div style={{ minWidth: 0 }}>
                        <div className="kicker" style={{ margin: 0 }}>{diff === 0 ? '바로 이날' : diff < 0 ? `${-diff}일 전` : `${diff}일 뒤`} · {fmtDate(t.watched_at, false)} ({WEEK[d.getDay()]})</div>
                        <h3>{t.title}</h3>
                        <div className="faint small">{placeOf(t)}{t.weather_text ? ` · ${t.weather_text}${t.temp_c != null ? ` ${Math.round(t.temp_c)}°` : ''}` : ''}</div>
                        {quote && <blockquote>“{quote}”</blockquote>}
                        <div className="tags">
                          {t.voice_path && <span><I.mic />보이스 {t.voice_seconds ? `0:${String(t.voice_seconds).padStart(2, '0')}` : ''}</span>}
                          {(t.moods || []).slice(0, 3).map((m) => <span key={m}>{m}</span>)}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="empty" style={{ paddingTop: 24 }}>
          <I.ticket />
          <h2>{range === 'month' ? `지난 해 ${date.getMonth() + 1}월에 본 영화가 없어요` : '이 날짜 근처에 본 영화가 없어요'}</h2>
          <p>{days.length ? '아래는 지난 해의 기억이 남아 있는 날이에요.' : '예전에 본 영화를 날짜와 함께 기록해 두면, 그날이 돌아올 때 다시 꺼내 드려요.'}</p>
          {range !== 'month' && <button type="button" className="btn" onClick={() => setRange('month')}>{date.getMonth() + 1}월 전체에서 찾기</button>}
        </div>
      )}

      {days.length > 0 && (
        <section style={{ marginTop: 26 }} aria-labelledby="mem-days">
          <h2 id="mem-days" className="small muted" style={{ fontFamily: 'var(--sans)', fontWeight: 600, marginBottom: 10 }}>기억이 남아 있는 날</h2>
          <div className="chips">
            {days.map((x) => (
              <button key={`${x.month}-${x.day}`} type="button" className="chip" style={{ minHeight: 36 }} onClick={() => { setDate(new Date(date.getFullYear(), x.month - 1, x.day, 12)); setRange(0); }}>
                {x.month}월 {x.day}일{x.n > 1 ? ` · ${x.n}편` : ''}
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
