import { useEffect, useRef, useState } from 'react';
import { useApp, Poster, Sheet, Loading } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { MOODS, byId } from '../lib/catalog.js';
import { server } from '../lib/server.js';
import { fetchWeather } from '../lib/weather.js';
import { renderShareCard } from '../lib/sharecard.js';
import { ShareSheet } from '../ui/ShareSheet.jsx';
import { fmtDate, fmtSec, links } from '../lib/util.js';
import { initialWhen, buildWhen, hasWeatherDate, whenDate, whenTime, placeOf, thirdCell } from '../lib/when.js';
import { WhenWhere } from '../ui/WhenWhere.jsx';

const MAX = 30;
// Chrome 으로 녹음한 webm 은 길이 정보가 비어 있어 재생바가 멈춰 보이는 문제를 바로잡습니다
function fixDuration(e) {
  const a = e.currentTarget;
  if (a.duration !== Infinity) return;
  const back = () => { a.removeEventListener('timeupdate', back); a.currentTime = 0; };
  a.addEventListener('timeupdate', back);
  a.currentTime = 1e7;
}
const MIMES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];

// ── 30초 보이스 메모 ───────────────────────
function Voice({ ticket, onChange, autoFocus }) {
  const { backend, toast } = useApp();
  const [state, setState] = useState('idle'); // idle | rec | saving
  const [left, setLeft] = useState(MAX);
  const [bars, setBars] = useState(() => Array(28).fill(0.12));
  const [url, setUrl] = useState(null);
  const [live, setLive] = useState('');
  const [text, setText] = useState(ticket.transcript || '');
  const [editing, setEditing] = useState(false);
  const r = useRef({});
  const btn = useRef(null);
  const supported = typeof window !== 'undefined' && window.MediaRecorder && navigator.mediaDevices && navigator.mediaDevices.getUserMedia;

  useEffect(() => { if (autoFocus && btn.current) { btn.current.scrollIntoView({ block: 'center' }); btn.current.focus(); } }, []);
  useEffect(() => {
    let alive = true;
    setUrl(null);
    if (ticket.voice_path) backend.voiceUrl(ticket.voice_path).then((u) => alive && setUrl(u)).catch(() => {});
    return () => { alive = false; };
  }, [ticket.voice_path]);
  useEffect(() => () => cleanup(), []);

  function cleanup() {
    const x = r.current;
    clearInterval(x.timer); cancelAnimationFrame(x.raf);
    if (x.rec && x.rec.state !== 'inactive') { x.discard = true; x.rec.stop(); }
    if (x.stream) x.stream.getTracks().forEach((t) => t.stop());
    if (x.ctx) x.ctx.close().catch(() => {});
    if (x.sr) { try { x.sr.abort(); } catch (e) { /* 무시 */ } }
    r.current = {};
  }

  async function start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
      const mime = MIMES.find((m) => window.MediaRecorder.isTypeSupported && window.MediaRecorder.isTypeSupported(m)) || '';
      const rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 48000 } : undefined);
      const chunks = [];
      const x = { stream, rec, chunks, startedAt: Date.now(), finalText: '' };
      r.current = x;
      rec.ondataavailable = (e) => e.data && e.data.size && chunks.push(e.data);
      rec.onstop = () => finish(x);
      rec.start(250);

      // 파형
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) {
        x.ctx = new AC();
        const an = x.ctx.createAnalyser(); an.fftSize = 64;
        x.ctx.createMediaStreamSource(stream).connect(an);
        const buf = new Uint8Array(an.frequencyBinCount);
        const draw = () => { an.getByteFrequencyData(buf); setBars(Array.from({ length: 28 }, (_, i) => 0.12 + (buf[i % buf.length] / 255) * 0.88)); x.raf = requestAnimationFrame(draw); };
        draw();
      }
      // 음성 → 글 (Chrome·Safari 지원 시)
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const sr = new SR(); sr.lang = 'ko-KR'; sr.continuous = true; sr.interimResults = true;
        sr.onresult = (e) => {
          let fin = '', tmp = '';
          for (let i = 0; i < e.results.length; i++) (e.results[i].isFinal ? (fin += e.results[i][0].transcript) : (tmp += e.results[i][0].transcript));
          x.finalText = (fin + ' ' + tmp).trim();
          setLive(x.finalText);
        };
        sr.onerror = () => {};
        try { sr.start(); x.sr = sr; } catch (e) { /* 무시 */ }
      }
      setLive(''); setLeft(MAX); setState('rec');
      x.timer = setInterval(() => {
        const l = MAX - (Date.now() - x.startedAt) / 1000;
        setLeft(Math.max(0, Math.ceil(l)));
        if (l <= 0) stop();
      }, 200);
    } catch (e) {
      cleanup();
      toast('마이크를 쓸 수 없어요. 브라우저의 마이크 권한을 확인해 주세요.', true);
    }
  }

  function stop() {
    const x = r.current;
    if (!x.rec || x.rec.state === 'inactive') return;
    clearInterval(x.timer); cancelAnimationFrame(x.raf);
    x.seconds = Math.min(MAX, Math.max(1, Math.round((Date.now() - x.startedAt) / 1000)));
    if (x.sr) { try { x.sr.stop(); } catch (e) { /* 무시 */ } }
    x.rec.stop();
    setState('saving');
  }

  async function finish(x) {
    if (x.stream) x.stream.getTracks().forEach((t) => t.stop());
    if (x.ctx) x.ctx.close().catch(() => {});
    if (x.discard) return;
    // 음성 인식 마지막 결과가 들어올 시간을 조금 줍니다
    await new Promise((res) => setTimeout(res, 600));
    const blob = new Blob(x.chunks, { type: (x.rec.mimeType || 'audio/webm').split(';')[0] });
    setBars(Array(28).fill(0.12));
    try {
      const old = ticket.voice_path;
      const path = await backend.uploadVoice(ticket.id, blob);
      const transcript = (x.finalText || '').slice(0, 1000) || null;
      await onChange({ voice_path: path, voice_seconds: x.seconds, transcript });
      if (old && old !== path) backend.removeVoice(old).catch(() => {}); // 형식이 바뀐 이전 녹음 파일 정리
      if (transcript) setText(transcript);
      setUrl(await backend.voiceUrl(path));
      toast('보이스 메모를 크레딧에 붙였어요');
    } catch (e) {
      toast(e.message, true);
    } finally {
      setState('idle'); r.current = {};
    }
  }

  const removeVoice = async () => {
    if (!confirm('보이스 메모를 지울까요?')) return;
    try { await backend.removeVoice(ticket.voice_path); await onChange({ voice_path: null, voice_seconds: null, transcript: null }); setText(''); toast('보이스 메모를 지웠어요'); } catch (e) { toast(e.message, true); }
  };

  return (
    <section className="card" aria-labelledby="v-h">
      <div className="card-title"><h2 id="v-h"><I.mic />30초 보이스 메모</h2>{ticket.voice_seconds ? <span className="pill">{fmtSec(ticket.voice_seconds)}</span> : null}</div>
      {!supported ? <p className="note">이 브라우저는 녹음을 지원하지 않아요. 최신 Chrome·Safari에서 열어 주세요.</p> : (
        <div className="voice">
          <button ref={btn} className={`rec ${state === 'rec' ? 'on' : ''}`} onClick={state === 'rec' ? stop : start} disabled={state === 'saving'} aria-label={state === 'rec' ? '녹음 멈추기' : ticket.voice_path ? '다시 녹음하기' : '30초 녹음 시작'}><span /></button>
          <div className="wave" aria-hidden="true">{bars.map((h, i) => <i key={i} style={{ height: `${Math.round(h * 100)}%` }} />)}</div>
          <div className="timer" aria-live="off">{state === 'rec' ? fmtSec(left) : state === 'saving' ? '…' : fmtSec(ticket.voice_seconds || MAX)}</div>
        </div>
      )}
      <p className="faint small" style={{ margin: '10px 0 0' }} aria-live="polite">
        {state === 'rec' ? '말씀하세요. 다시 누르면 멈추고, 30초가 되면 자동 저장돼요.' : state === 'saving' ? '저장하는 중…' : ticket.voice_path ? '다시 녹음하면 이전 메모를 바꿔요.' : '엔딩 크레딧이 올라갈 때의 첫 감정을 목소리로 남겨 보세요.'}
      </p>
      {state === 'rec' && live && <div className="transcript">{live}</div>}
      {url && state !== 'rec' && <audio controls src={url} preload="metadata" onLoadedMetadata={fixDuration} />}
      {ticket.voice_path && state === 'idle' && (
        <>
          {editing ? (
            <form onSubmit={async (e) => { e.preventDefault(); await onChange({ transcript: text.trim().slice(0, 1000) || null }); setEditing(false); toast('저장했어요'); }}>
              <label className="sr" htmlFor="tr">자동 변환 텍스트</label>
              <textarea id="tr" className="textarea" style={{ marginTop: 12 }} value={text} maxLength={1000} onChange={(e) => setText(e.target.value)} />
              <div className="row" style={{ marginTop: 8 }}><button className="btn sm primary">저장</button><button type="button" className="btn sm ghost" onClick={() => { setText(ticket.transcript || ''); setEditing(false); }}>취소</button></div>
            </form>
          ) : (
            <div className="transcript"><span className="faint tiny">자동 변환 텍스트</span><br />{ticket.transcript || <span className="faint">변환된 글이 없어요. 직접 적어 둘 수 있어요.</span>}</div>
          )}
          <div className="row" style={{ marginTop: 10 }}>
            {!editing && <button className="btn sm" onClick={() => setEditing(true)}><I.edit />글 다듬기</button>}
            <button className="btn sm danger" onClick={removeVoice}><I.trash />메모 지우기</button>
          </div>
        </>
      )}
    </section>
  );
}

// ── 무드·한 줄 감상 ────────────────────────
function Mood({ ticket, onChange }) {
  const { toast } = useApp();
  const [moods, setMoods] = useState(ticket.moods || []);
  const [review, setReview] = useState(ticket.review || '');
  const dirty = review !== (ticket.review || '') || moods.join() !== (ticket.moods || []).join();
  return (
    <section className="card" aria-labelledby="m-h">
      <div className="card-title"><h2 id="m-h"><I.heart />남은 여운</h2></div>
      <div className="chips">{MOODS.map((m) => <button key={m} className="chip" aria-pressed={moods.includes(m)} onClick={() => setMoods((x) => (x.includes(m) ? x.filter((y) => y !== m) : [...x, m]))}>{m}</button>)}</div>
      <label className="field" style={{ marginTop: 14 }}><span>한 줄 감상</span>
        <textarea className="textarea" value={review} maxLength={300} onChange={(e) => setReview(e.target.value)} placeholder="극장을 나서며 든 생각을 한 줄로" />
      </label>
      <button className="btn sm primary" disabled={!dirty} onClick={async () => { await onChange({ moods, review: review.trim() || null }); toast('저장했어요'); }}>저장</button>
    </section>
  );
}

// ── OST ────────────────────────────────
const OST_V = 2; // OST 찾는 방식이 바뀌면 숫자를 올려서, 예전에 잘못 저장된 OST를 다시 찾게 합니다
function Ost({ ticket, onChange }) {
  const valid = ticket.ost && ticket.ost.v === OST_V;
  const [data, setData] = useState(valid && ticket.ost.album ? ticket.ost : null);
  const [state, setState] = useState(valid ? (ticket.ost.album ? 'ok' : 'none') : 'loading');
  const [playing, setPlaying] = useState(null);
  const [skip, setSkip] = useState((ticket.ost && ticket.ost.skip) || []);
  const audio = useRef(null);
  const q = `${ticket.original_title || ticket.title} soundtrack`;
  const known = byId(ticket.movie_id);

  const find = (skipIds) => {
    setState('loading');
    if (audio.current) { audio.current.pause(); setPlaying(null); }
    return server.ost(ticket.original_title || ticket.title, ticket.title, ticket.release_year, skipIds).then((r) => {
      if (r && r.album) {
        const ost = { v: OST_V, album: r.album, tracks: r.tracks.slice(0, 12), more: !!r.more, skip: skipIds };
        setData(ost); setState('ok');
        onChange({ ost }, true).catch(() => {});
      } else {
        setData(null); setState(r ? 'none' : 'offline');
        if (r) onChange({ ost: { v: OST_V, album: null, tracks: [], skip: skipIds } }, true).catch(() => {});
      }
    });
  };

  useEffect(() => {
    if (valid) return;
    find(skip);
  }, [ticket.id]);

  // "이 OST가 아니에요": 지금 앨범을 빼고 다음 후보를 찾습니다
  const wrong = () => {
    const next = [...skip, data.album.id];
    setSkip(next);
    find(next);
  };
  useEffect(() => () => audio.current && audio.current.pause(), []);

  const play = (t, i) => {
    if (!audio.current) { audio.current = new Audio(); audio.current.onended = () => setPlaying(null); }
    if (playing === i) { audio.current.pause(); setPlaying(null); return; }
    audio.current.src = t.preview; audio.current.play().catch(() => setPlaying(null)); setPlaying(i);
  };

  return (
    <section className="card" aria-labelledby="o-h">
      <div className="card-title"><h2 id="o-h"><I.music />OST</h2></div>
      {state === 'loading' && <div className="skeleton" style={{ height: 84 }} />}
      {state === 'ok' && data && data.album && (
        <>
          <div className="album">
            {data.album.artwork && <img src={data.album.artwork} alt={`${data.album.name} 앨범 커버`} />}
            <div><b>{data.album.name}</b><div className="faint small">{data.album.artist}{data.album.year ? ` · ${data.album.year}` : ''}</div></div>
          </div>
          <ul className="tracks">
            {data.tracks.map((t, i) => (
              <li key={i}>
                {t.preview ? <button className="icon-btn" style={{ width: 40, height: 40 }} onClick={() => play(t, i)} aria-label={`${t.name} ${playing === i ? '멈추기' : '30초 미리듣기'}`}>{playing === i ? <I.pause /> : <I.play />}</button> : <span style={{ width: 40 }} />}
                <div className="t"><b>{t.name}</b><span>{t.artist}</span></div>
              </li>
            ))}
          </ul>
          <div className="row" style={{ justifyContent: 'space-between', marginTop: 8 }}>
            <span className="faint tiny">미리듣기 제공: Apple Music</span>
            <button className="linkbtn small" onClick={wrong}>이 영화 OST가 아니에요</button>
          </div>
        </>
      )}
      {(state === 'none' || state === 'offline') && (
        <>
          <p className="muted small" style={{ marginTop: 0 }}>{known ? <>대표곡 <b>{known.ost}</b> · </> : null}{state === 'none' ? '맞는 OST 앨범을 찾지 못했어요. 아래 음악 앱에서 바로 찾아 들을 수 있어요.' : '아래 음악 앱에서 이 영화의 OST를 바로 찾아 들을 수 있어요.'}</p>
          {skip.length > 0 && <button className="linkbtn small" onClick={() => { setSkip([]); find([]); }}>처음부터 다시 찾기</button>}
        </>
      )}
      <div className="linkrow">
        <a className="btn sm" href={links.spotify(q)} target="_blank" rel="noopener">Spotify</a>
        <a className="btn sm" href={links.ytmusic(q)} target="_blank" rel="noopener">YouTube Music</a>
        <a className="btn sm" href={links.melon(`${ticket.title} OST`)} target="_blank" rel="noopener">멜론</a>
      </div>
    </section>
  );
}

// ── 촬영지·기억할 장소 ─────────────────────
const SRC = { curated: 'Soundtrack Credit 추천', member: '회원 제보', wikidata: '위키데이터' };
const gmapAt = (l) => (l.lat != null ? `https://www.google.com/maps/search/?api=1&query=${l.lat},${l.lon}` : links.gmap(l.name));
const kmapAt = (l) => (l.lat != null ? `https://map.kakao.com/link/map/${encodeURIComponent(l.name)},${l.lat},${l.lon}` : links.kmap(l.name));

function Place({ ticket, onChange }) {
  const { backend, toast } = useApp();
  const [list, setList] = useState(null);
  const [name, setName] = useState(ticket.location_name || '');
  const [share, setShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const q = name.trim();

  useEffect(() => {
    let alive = true;
    const fallback = () => {
      const c = byId(ticket.movie_id);
      return c && c.place ? [{ name: c.place, note: null, lat: null, lon: null, source: 'curated' }] : [];
    };
    if (!ticket.movie_id) { setList([]); return; }
    server.locations(ticket.movie_id).then((r) => { if (alive) setList(r && r.locations && r.locations.length ? r.locations : fallback()); });
    return () => { alive = false; };
  }, [ticket.movie_id]);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onChange({ location_name: q || null });
      if (share && q && ticket.movie_id) {
        await backend.suggestLocation({ movie_id: ticket.movie_id, name: q.slice(0, 80) });
        toast('저장했어요. 운영자가 확인한 뒤 다른 회원에게도 보여 드릴게요');
        setShare(false);
      } else toast('저장했어요');
    } catch (e2) { toast(e2.message, true); }
    setBusy(false);
  };

  return (
    <section className="card" aria-labelledby="p-h">
      <div className="card-title"><h2 id="p-h"><I.map />촬영지 · 성지순례</h2></div>
      {list === null ? <div className="skeleton" style={{ height: 72 }} /> : list.length === 0 ? (
        <p className="faint small" style={{ marginTop: 0 }}>아직 알려진 촬영지가 없어요. 아는 장소가 있다면 아래에서 알려 주세요.</p>
      ) : (
        <ul className="taglist" style={{ marginBottom: 6 }}>
          {list.map((l, i) => (
            <li key={i} style={{ alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                <b style={{ fontWeight: 600 }}>{l.name}</b>
                {l.note && <div className="muted small">{l.note}</div>}
                <div className="faint tiny">{SRC[l.source] || ''}</div>
              </div>
              <div className="row" style={{ gap: 6 }}>
                <a className="btn sm" href={gmapAt(l)} target="_blank" rel="noopener" aria-label={`${l.name} 구글 지도`}>구글 지도</a>
                <a className="btn sm" href={kmapAt(l)} target="_blank" rel="noopener" aria-label={`${l.name} 카카오맵`}>카카오맵</a>
              </div>
            </li>
          ))}
        </ul>
      )}
      <hr className="sep" style={{ margin: '12px 0 14px' }} />
      <form onSubmit={save}>
        <label className="field" style={{ marginBottom: 8 }}><span>내가 다녀온 곳 · 기억하고 싶은 장소</span>
          <input className="input" value={name} maxLength={80} onChange={(e) => setName(e.target.value)} placeholder="예: 그리피스 천문대 전망대" />
        </label>
        {ticket.movie_id ? (
          <label className="small muted" style={{ display: 'flex', alignItems: 'flex-start', gap: 10, margin: '0 0 12px', cursor: 'pointer', lineHeight: 1.5 }}>
            <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} style={{ width: 20, height: 20, margin: 0, flex: 'none', accentColor: '#E9B04A' }} />
            <span>
            이 영화의 촬영지로 다른 회원에게도 알려 주기 (운영자 확인 후 공개)</span>
          </label>
        ) : null}
        <div className="row">
          <button className="btn sm primary" disabled={busy || (q === (ticket.location_name || '') && !share)}>저장</button>
          {q && <a className="btn sm ghost" href={links.gmap(q)} target="_blank" rel="noopener">지도에서 보기</a>}
        </div>
      </form>
      {list && list.some((l) => l.source === 'wikidata') && <p className="faint tiny" style={{ marginTop: 12 }}>촬영지 정보 일부 출처: Wikidata (CC0)</p>}
    </section>
  );
}

// ── 공유 카드 ─────────────────────────────
// ── 정보 수정 ─────────────────────────────
function EditSheet({ ticket, onClose, onSave }) {
  const [ww, setWw] = useState(() => initialWhen(ticket));
  const [busy, setBusy] = useState(false);
  return (
    <Sheet title="관람 정보 수정" onClose={onClose}>
      <form onSubmit={async (e) => {
        e.preventDefault(); setBusy(true);
        const patch = buildWhen(ww, ticket.release_year);
        const d = new Date(patch.watched_at);
        if (!hasWeatherDate(ww.prec)) Object.assign(patch, { weather_code: null, weather_text: null, temp_c: null });
        else if ((d.getTime() !== new Date(ticket.watched_at).getTime() || !ticket.weather_text) && ticket.lat != null) {
          const w = await fetchWeather(ticket.lat, ticket.lon, d);
          if (w) Object.assign(patch, { weather_code: w.code, weather_text: w.text, temp_c: w.temp });
        }
        await onSave(patch); setBusy(false); onClose();
      }}>
        <WhenWhere s={ww} set={setWw} releaseYear={ticket.release_year} />
        <div className="actions"><button type="button" className="btn ghost" onClick={onClose}>취소</button><button className="btn primary" disabled={busy}>저장</button></div>
      </form>
    </Sheet>
  );
}

export function TicketView({ id, query }) {
  const { backend, tickets, setTickets, toast, go, reloadTickets } = useApp();
  const [t, setT] = useState(() => (tickets || []).find((x) => x.id === id) || null);
  const [missing, setMissing] = useState(false);
  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [share, setShare] = useState(false);

  useEffect(() => {
    let alive = true;
    backend.getTicket(id).then((row) => { if (!alive) return; if (row) setT(row); else setMissing(true); }).catch((e) => toast(e.message, true));
    return () => { alive = false; };
  }, [id]);

  const update = async (patch, quiet) => {
    try {
      const row = await backend.updateTicket(t.id, patch);
      setT(row);
      setTickets((list) => (list || []).map((x) => (x.id === row.id ? row : x)));
      return row;
    } catch (e) {
      if (!quiet) toast(e.message, true);
      throw e;
    }
  };

  if (missing) return <div className="empty"><h2>티켓을 찾을 수 없어요</h2><p>삭제되었거나 다른 계정의 티켓이에요.</p><a className="btn" href="#/">티켓북으로</a></div>;
  if (!t) return <Loading />;

  return (
    <>
      <a className="back" href="#/"><I.back />티켓북</a>
      {query.get('new') && <p className="note" role="status" style={{ margin: '4px 0 18px' }}>티켓이 저장됐어요. 여운이 사라지기 전에 아래에서 <b>30초 보이스 메모</b>를 남겨 보세요.</p>}
      <div className="hero">
        <Poster src={t.poster_url} title={t.title} />
        <div>
          <p className="kicker">{[t.release_year, (t.genres || []).slice(0, 3).join(' · ')].filter(Boolean).join(' · ') || 'TICKET'}</p>
          <h1>{t.title}</h1>
          {t.original_title && t.original_title !== t.title && <p className="muted" style={{ margin: 0 }}>{t.original_title}</p>}
          {t.sample && <span className="pill" style={{ marginTop: 8 }}>예시 데이터</span>}
        </div>
        <div className="stub">
          <div><small>Date</small><b>{whenDate(t)}</b></div>
          <div><small>Time</small><b>{whenTime(t)}</b></div>
          <div><small>{thirdCell(t)[0]}</small><b>{thirdCell(t)[1]}</b></div>
          <div><small>Weather</small><b>{t.weather_text ? `${t.weather_text}${t.temp_c != null ? ` ${Math.round(t.temp_c)}°` : ''}` : '—'}</b></div>
          <div className="code"><span className="mono tiny" style={{ color: 'var(--ticket-muted)' }}>{placeOf(t)}{t.city && (t.weather_text || (t.watch_type || 'cinema') === 'cinema') ? ` · ${t.city}` : ''}</span>{t.barcode ? <span className="bars" role="img" title={t.barcode} aria-label={`바코드 ${t.barcode}`} /> : null}</div>
        </div>
      </div>
      <div className="cols">
        <div><Voice ticket={t} onChange={update} autoFocus={query.get('record') === '1'} /><Mood ticket={t} onChange={update} /></div>
        <div><Ost ticket={t} onChange={update} /><Place ticket={t} onChange={update} /></div>
      </div>
      <div className="row" style={{ marginTop: 22 }}>
        <button className="btn primary" onClick={() => setShare(true)}><I.share />공유 카드 만들기</button>
        <button className="btn" onClick={() => setEdit(true)}><I.edit />관람 정보 수정</button>
        <button className="btn danger" onClick={() => setDel(true)}><I.trash />티켓 삭제</button>
      </div>
      {share && <ShareSheet render={(f) => renderShareCard(t, f)} fileBase={t.original_title || t.title} alt={`${t.title} 공유 카드 미리보기`} shareTitle={t.title} caption="한 줄 감상(없으면 보이스 메모 글)·좌석·날씨·OST·무드가 함께 들어가요. 저장한 뒤 인스타그램 스토리나 피드에서 사진으로 올리면 돼요." onClose={() => setShare(false)} />}
      {edit && <EditSheet ticket={t} onClose={() => setEdit(false)} onSave={(p) => update(p).then(() => toast('저장했어요')).catch(() => {})} />}
      {del && (
        <Sheet title="이 티켓을 삭제할까요?" onClose={() => setDel(false)}>
          <p className="muted">‘{t.title}’ 티켓과 보이스 메모가 함께 지워지고 되돌릴 수 없어요.</p>
          <div className="actions">
            <button className="btn ghost" onClick={() => setDel(false)}>취소</button>
            <button className="btn primary" onClick={async () => { try { await backend.deleteTicket(t); await reloadTickets(); toast('삭제했어요'); go('/'); } catch (e) { toast(e.message, true); } }}>삭제</button>
          </div>
        </Sheet>
      )}
    </>
  );
}
