import { useEffect, useRef, useState } from 'react';
import { useApp, Poster } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { searchCatalog, byId, MOODS } from '../lib/catalog.js';
import { server } from '../lib/server.js';
import { CITIES, fetchWeather, nearestCity } from '../lib/weather.js';
import { toLocalInput, fromLocalInput } from '../lib/util.js';

const FORMATS = ['qr_code', 'code_128', 'code_39', 'code_93', 'codabar', 'ean_13', 'ean_8', 'itf', 'upc_a', 'pdf417', 'data_matrix', 'aztec'];

// ── 1단계: 바코드 ───────────────────────────
function Scan({ onDone }) {
  const [code, setCode] = useState('');
  const [cam, setCam] = useState(false);
  const [msg, setMsg] = useState('');
  const video = useRef(null);
  const stream = useRef(null);
  const supported = typeof window !== 'undefined' && 'BarcodeDetector' in window && navigator.mediaDevices;

  const stop = () => { if (stream.current) stream.current.getTracks().forEach((t) => t.stop()); stream.current = null; setCam(false); };
  useEffect(() => stop, []);

  const start = async () => {
    setMsg('');
    try {
      const all = await window.BarcodeDetector.getSupportedFormats();
      const detector = new window.BarcodeDetector({ formats: FORMATS.filter((f) => all.includes(f)) });
      stream.current = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setCam(true);
      requestAnimationFrame(async () => {
        const v = video.current;
        if (!v) return;
        v.srcObject = stream.current;
        await v.play().catch(() => {});
        const tick = async () => {
          if (!stream.current) return;
          try {
            const found = await detector.detect(v);
            if (found.length) { const value = found[0].rawValue.trim().slice(0, 64); if (navigator.vibrate) navigator.vibrate(60); stop(); onDone(value); return; }
          } catch (e) { /* 다음 프레임에서 다시 */ }
          setTimeout(tick, 220);
        };
        tick();
      });
    } catch (e) {
      stop();
      setMsg('카메라를 열 수 없어요. 브라우저의 카메라 권한을 확인하거나 아래에 번호를 직접 입력해 주세요.');
    }
  };

  return (
    <>
      <h1>티켓 바코드</h1>
      <p className="muted" style={{ margin: '8px 0 20px' }}>종이·키오스크·모바일 티켓의 바코드(또는 QR)를 비추면 예매번호가 저장돼요. 같은 티켓이 두 번 등록되는 것도 막아 줘요.</p>
      {cam ? (
        <div className="scanner"><video ref={video} playsInline muted /><div className="frame" aria-hidden="true" /></div>
      ) : supported ? (
        <button className="btn primary block" onClick={start}><I.camera />카메라로 스캔하기</button>
      ) : (
        <p className="note">이 브라우저는 바코드 자동 인식을 지원하지 않아요 (안드로이드 Chrome에서 지원). 티켓에 적힌 예매번호를 아래에 입력하거나 건너뛰어 주세요.</p>
      )}
      {cam && <button className="btn block" style={{ marginTop: 12 }} onClick={stop}>스캔 그만두기</button>}
      {msg && <p className="error" role="alert">{msg}</p>}
      <form style={{ marginTop: 22 }} onSubmit={(e) => { e.preventDefault(); if (code.trim()) onDone(code.trim()); }}>
        <label className="field"><span>예매번호·바코드 번호 직접 입력</span>
          <input className="input mono" inputMode="numeric" value={code} maxLength={64} onChange={(e) => setCode(e.target.value)} placeholder="예: 0123-4567-8901" />
        </label>
        <div className="row">
          <button className="btn primary" disabled={!code.trim()}>다음</button>
          <button type="button" className="btn ghost" onClick={() => onDone('')}>바코드 없이 건너뛰기</button>
        </div>
      </form>
    </>
  );
}

// ── 2단계: 영화 고르기 ──────────────────────
function Pick({ onDone }) {
  const { config } = useApp();
  const [q, setQ] = useState('');
  const [results, setResults] = useState(() => (config.movies ? [] : searchCatalog('')));
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState(false);
  const [title, setTitle] = useState('');
  const seq = useRef(0);

  useEffect(() => {
    const text = q.trim();
    if (!config.movies) { setResults(searchCatalog(text)); return; }
    if (!text) { setResults([]); return; }
    const my = ++seq.current;
    setBusy(true);
    const t = setTimeout(async () => {
      const r = await server.search(text);
      if (my !== seq.current) return;
      setResults(r ? r.results : searchCatalog(text));
      setBusy(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  if (manual) {
    return (
      <form onSubmit={(e) => { e.preventDefault(); if (title.trim()) onDone({ id: null, title: title.trim(), originalTitle: '', year: null, poster: null, genres: [] }); }}>
        <h1>영화 직접 입력</h1>
        <p className="muted" style={{ margin: '8px 0 20px' }}>검색되지 않는 영화(영화제·독립영화 등)는 제목만으로 기록할 수 있어요.</p>
        <label className="field"><span>영화 제목</span><input className="input" value={title} maxLength={120} onChange={(e) => setTitle(e.target.value)} /></label>
        <div className="row"><button className="btn primary" disabled={!title.trim()}>다음</button><button type="button" className="btn ghost" onClick={() => setManual(false)}>검색으로 돌아가기</button></div>
      </form>
    );
  }
  return (
    <>
      <h1>어떤 영화를 보셨나요?</h1>
      <label className="sr" htmlFor="movie-q">영화 제목 검색</label>
      <input id="movie-q" className="input" style={{ marginTop: 18 }} type="search" autoFocus placeholder="영화 제목 (한글·영문)" value={q} onChange={(e) => setQ(e.target.value)} />
      {!config.movies && <p className="faint tiny" style={{ marginTop: 8 }}>지금은 기본 영화 15편 안에서 검색돼요. (TMDB 키를 연결하면 모든 영화 검색)</p>}
      {busy && <p className="faint small">찾는 중…</p>}
      <div className="results">
        {results.map((m) => (
          <button key={m.id} className="pick" onClick={() => onDone(m)}>
            <Poster src={m.poster} title={m.title} />
            <b>{m.title}</b>
            <span>{[m.year, (m.genres || []).slice(0, 2).join('·')].filter(Boolean).join(' · ')}</span>
          </button>
        ))}
      </div>
      {q.trim() && !busy && results.length === 0 && <p className="muted">검색 결과가 없어요.</p>}
      <button className="btn ghost" style={{ marginTop: 18 }} onClick={() => setManual(true)}>찾는 영화가 없어요 · 직접 입력</button>
    </>
  );
}

// ── 3단계: 관람 정보 ────────────────────────
function Details({ movie, barcode, onSaved, onBack }) {
  const { backend, tickets, toast } = useApp();
  const last = (tickets || [])[0];
  const [when, setWhen] = useState(() => { const d = new Date(); d.setSeconds(0, 0); return toLocalInput(d); });
  const [theater, setTheater] = useState(last ? last.theater || '' : '');
  const [seat, setSeat] = useState('');
  const [city, setCity] = useState(last && last.city ? last.city : '서울');
  const [geo, setGeo] = useState(null);
  const [weather, setWeather] = useState(null);
  const [wState, setWState] = useState('idle');
  const [moods, setMoods] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const coords = () => {
    if (geo) return [geo.lat, geo.lon];
    const c = CITIES.find((x) => x[0] === city) || CITIES[0];
    return [c[1], c[2]];
  };

  useEffect(() => {
    let alive = true;
    const [lat, lon] = coords();
    setWState('loading');
    const t = setTimeout(async () => {
      const w = await fetchWeather(lat, lon, fromLocalInput(when));
      if (!alive) return;
      setWeather(w); setWState(w ? 'ok' : 'fail');
    }, 350);
    return () => { alive = false; clearTimeout(t); };
  }, [when, city, geo]);

  const locate = () => {
    if (!navigator.geolocation) { toast('위치 기능을 쓸 수 없어요', true); return; }
    navigator.geolocation.getCurrentPosition(
      (p) => { const lat = p.coords.latitude, lon = p.coords.longitude; setGeo({ lat, lon }); setCity(nearestCity(lat, lon)); },
      () => toast('위치 권한이 없어서 도시를 직접 골라 주세요', true),
      { timeout: 8000, maximumAge: 600000 },
    );
  };

  const save = async (e) => {
    e.preventDefault();
    setErr(''); setBusy(true);
    const [lat, lon] = coords();
    const c = movie.id ? byId(movie.id) : null;
    try {
      const row = await backend.createTicket({
        barcode: barcode || null,
        movie_id: movie.id || null,
        title: movie.title,
        original_title: movie.originalTitle || null,
        poster_url: movie.poster || null,
        release_year: movie.year || null,
        genres: movie.genres || [],
        watched_at: fromLocalInput(when).toISOString(),
        theater: theater.trim() || null,
        seat: seat.trim().toUpperCase() || null,
        city, lat: Number(lat.toFixed(4)), lon: Number(lon.toFixed(4)),
        weather_code: weather ? weather.code : null,
        weather_text: weather ? weather.text : null,
        temp_c: weather ? weather.temp : null,
        moods,
      });
      onSaved(row);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save}>
      <div className="chosen">
        <Poster src={movie.poster} title={movie.title} />
        <div><p className="kicker">{barcode ? `TICKET · ${barcode}` : 'TICKET'}</p><h1 style={{ fontSize: 24 }}>{movie.title}</h1><button type="button" className="linkbtn" onClick={onBack}>영화 바꾸기</button></div>
      </div>
      <label className="field"><span>관람 일시</span><input className="input" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} required /></label>
      <div className="grid2">
        <label className="field"><span>극장·상영관</span><input className="input" value={theater} maxLength={60} onChange={(e) => setTheater(e.target.value)} placeholder="예: OO시네마 3관" /></label>
        <label className="field"><span>좌석</span><input className="input mono" value={seat} maxLength={20} onChange={(e) => setSeat(e.target.value)} placeholder="F11" /></label>
      </div>
      <div className="field">
        <span id="city-l">관람 도시 (날씨 기록용)</span>
        <div className="row">
          <select className="select" style={{ flex: '1 1 160px', width: 'auto' }} aria-labelledby="city-l" value={city} onChange={(e) => { setGeo(null); setCity(e.target.value); }}>
            {CITIES.map((c) => <option key={c[0]} value={c[0]}>{c[0]}</option>)}
          </select>
          <button type="button" className="btn sm" onClick={locate}><I.map />현재 위치</button>
        </div>
      </div>
      <div className="note" aria-live="polite" style={{ marginBottom: 16 }}>
        {wState === 'loading' && '그 시각의 날씨를 불러오는 중…'}
        {wState === 'ok' && <>그 시각 {city}의 날씨 <b>{weather.text || '—'}{weather.temp != null ? ` ${weather.temp}°` : ''}</b> 가 함께 저장돼요.</>}
        {wState === 'fail' && '날씨를 불러오지 못했어요. 날씨 없이 저장돼요.'}
      </div>
      <div className="field">
        <span>지금 남은 여운 (선택)</span>
        <div className="chips">
          {MOODS.map((m) => <button type="button" key={m} className="chip" aria-pressed={moods.includes(m)} onClick={() => setMoods((x) => (x.includes(m) ? x.filter((y) => y !== m) : [...x, m]))}>{m}</button>)}
        </div>
      </div>
      <button className="btn primary block" disabled={busy} style={{ marginTop: 8 }}>{busy ? '저장 중…' : '티켓 저장하기'}</button>
      {err && <p className="error" role="alert">{err}</p>}
    </form>
  );
}

export function AddTicket({ query }) {
  const { go, reloadTickets, config } = useApp();
  const preset = query.get('movie');
  const [step, setStep] = useState(preset ? 3 : 1);
  const [barcode, setBarcode] = useState('');
  const [movie, setMovie] = useState(() => (preset ? byId(preset) : null));

  useEffect(() => {
    if (!preset || movie) return;
    if (!config.movies) { setStep(2); return; }
    server.movie(preset).then((r) => { if (r && r.movie) setMovie(r.movie); else setStep(2); });
  }, [preset]);

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <a className="back" href="#/"><I.back />티켓북</a>
      <div className="steps" aria-label={`3단계 중 ${step}단계`}>{[1, 2, 3].map((s) => <i key={s} className={s <= step ? 'on' : ''} />)}</div>
      {step === 1 && <Scan onDone={(c) => { setBarcode(c); setStep(movie ? 3 : 2); }} />}
      {step === 2 && <Pick onDone={(m) => { setMovie(m); setStep(3); }} />}
      {step === 3 && movie && <Details movie={movie} barcode={barcode} onBack={() => setStep(2)} onSaved={async (row) => { await reloadTickets(); go(`/ticket/${row.id}?new=1`); }} />}
      {step === 3 && !movie && <p className="muted">영화 정보를 불러오는 중…</p>}
    </div>
  );
}
