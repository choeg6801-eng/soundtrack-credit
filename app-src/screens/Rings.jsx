import { useEffect, useState } from 'react';
import { useApp, Loading, Sheet } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { fmtDate, randomId } from '../lib/util.js';

const tapUrl = (id) => `${location.origin}/app/#/tap/${id}`;

export function Rings() {
  const { backend, toast } = useApp();
  const [tags, setTags] = useState(null);
  const [adding, setAdding] = useState(null); // { id, label, kind, step }
  const nfc = typeof window !== 'undefined' && 'NDEFReader' in window;

  const load = () => backend.listTags().then(setTags).catch((e) => { toast(e.message, true); setTags([]); });
  useEffect(() => { load(); }, []);

  const begin = () => setAdding({ id: randomId(16), label: '내 시네마 링', kind: 'ring', step: 'name' });

  const write = async () => {
    try {
      const reader = new window.NDEFReader();
      setAdding((a) => ({ ...a, step: 'writing' }));
      await reader.write({ records: [{ recordType: 'url', data: tapUrl(adding.id) }] });
      await save();
    } catch (e) {
      setAdding((a) => ({ ...a, step: 'name' }));
      toast(e.name === 'NotAllowedError' ? 'NFC 권한을 허용해 주세요' : '태그에 기록하지 못했어요. 링을 휴대폰 뒷면 가운데에 대고 다시 시도해 주세요.', true);
    }
  };
  const save = async () => {
    try {
      await backend.addTag({ id: adding.id, label: adding.label.trim().slice(0, 30) || '내 링', kind: adding.kind });
      toast('링을 연결했어요');
      setAdding(null); load();
    } catch (e) { toast(e.message, true); }
  };
  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text); toast('주소를 복사했어요'); } catch (e) { toast('길게 눌러 직접 복사해 주세요', true); }
  };

  return (
    <>
      <div className="head"><div><p className="kicker">RING &amp; TAG</p><h1>링·태그 연결</h1><p className="muted">엔딩 크레딧이 올라갈 때 링을 휴대폰에 톡. 오늘 등록한 티켓의 녹음 화면이 바로 열려요.</p></div></div>
      <div className="cols">
        <div>
          <section className="card" style={{ textAlign: 'center' }}>
            <div className="ring-art" aria-hidden="true" />
            <h2>새 링·태그 연결하기</h2>
            <p className="muted small">{nfc ? '이 휴대폰은 NFC 기록을 지원해요. 버튼을 누르고 링을 휴대폰 뒷면에 대 주세요.' : '이 기기에서는 웹 NFC 기록을 지원하지 않아요(아이폰·PC). 연결 주소를 만들어 NFC 앱으로 기록할 수 있어요.'}</p>
            <button className="btn primary" onClick={begin}><I.link />연결 시작</button>
          </section>
          <section className="card">
            <h3 style={{ marginBottom: 10 }}>태그하면 이렇게 동작해요</h3>
            <ol className="list-plain">
              <li>최근 8시간 안에 등록한 티켓이 있으면 그 티켓의 <b>30초 녹음</b>이 바로 열려요.</li>
              <li>없으면 <b>새 티켓 등록</b> 화면이 열려요.</li>
              <li>다른 사람이 내 링을 태그해도 내 기록은 보이지 않아요 (로그인한 본인만).</li>
            </ol>
          </section>
        </div>
        <div>
          <section className="card">
            <div className="card-title"><h2><I.ring />내 링·태그</h2></div>
            {tags === null ? <Loading /> : tags.length === 0 ? <p className="muted small">아직 연결된 링·태그가 없어요.</p> : (
              <ul className="taglist">
                {tags.map((t) => (
                  <li key={t.id}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>{t.label}</b> <span className="pill">{t.kind === 'ring' ? '링' : '태그'}</span>
                      <div className="faint tiny">{t.last_tap_at ? `마지막 태그 ${fmtDate(t.last_tap_at)}` : `연결 ${fmtDate(t.created_at, false)}`}</div>
                    </div>
                    <button className="icon-btn" aria-label={`${t.label} 주소 복사`} onClick={() => copy(tapUrl(t.id))}><I.link /></button>
                    <button className="icon-btn" aria-label={`${t.label} 연결 해제`} onClick={async () => { if (!confirm('연결을 해제할까요? 이 링을 태그해도 더 이상 열리지 않아요.')) return; await backend.removeTag(t.id).catch((e) => toast(e.message, true)); load(); }}><I.trash /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="card">
            <h3 style={{ marginBottom: 10 }}>아이폰에서 연결하는 법</h3>
            <ol className="list-plain">
              <li>App Store에서 무료 앱 <b>NFC Tools</b> 설치</li>
              <li>위에서 ‘연결 시작’ → 주소 복사</li>
              <li>NFC Tools → 쓰기 → 기록 추가 → URL → 복사한 주소 붙여 넣기 → 쓰기 → 링을 휴대폰 위쪽에 대기</li>
            </ol>
          </section>
        </div>
      </div>

      {adding && (
        <Sheet title="링·태그 연결" onClose={() => setAdding(null)}>
          <label className="field"><span>이름</span><input className="input" value={adding.label} maxLength={30} onChange={(e) => setAdding({ ...adding, label: e.target.value })} /></label>
          <div className="seg" role="group" aria-label="종류" style={{ marginTop: 0 }}>
            <button type="button" aria-pressed={adding.kind === 'ring'} onClick={() => setAdding({ ...adding, kind: 'ring' })}>시네마 링</button>
            <button type="button" aria-pressed={adding.kind === 'tag'} onClick={() => setAdding({ ...adding, kind: 'tag' })}>티켓 태그</button>
          </div>
          {nfc ? (
            <>
              <p className="note">{adding.step === 'writing' ? '지금 링을 휴대폰 뒷면 가운데에 대 주세요…' : '아래 버튼을 누른 뒤 링을 휴대폰 뒷면에 대면 기록돼요.'}</p>
              <div className="actions">
                <button className="btn ghost" onClick={() => setAdding(null)}>취소</button>
                <button className="btn primary" disabled={adding.step === 'writing'} onClick={write}>{adding.step === 'writing' ? '기다리는 중…' : '링에 기록하기'}</button>
              </div>
            </>
          ) : (
            <>
              <div className="field"><span>링에 기록할 주소</span>
                <div className="copy"><input className="input" readOnly value={tapUrl(adding.id)} aria-label="링에 기록할 주소" onFocus={(e) => e.target.select()} /><button className="btn sm" onClick={() => copy(tapUrl(adding.id))}>복사</button></div>
              </div>
              <p className="faint small">NFC Tools 앱으로 이 주소를 링에 기록한 뒤 ‘연결 완료’를 눌러 주세요.</p>
              <div className="actions">
                <button className="btn ghost" onClick={() => setAdding(null)}>취소</button>
                <button className="btn primary" onClick={save}>연결 완료</button>
              </div>
            </>
          )}
        </Sheet>
      )}
    </>
  );
}

// 링을 태그했을 때 열리는 화면: #/tap/<태그코드>
// 공장에서 미리 주소를 기록해 출고한 링은 처음 태그할 때 내 계정에 연결(등록)합니다.
export function Tap({ tagId }) {
  const { backend, tickets, go, toast } = useApp();
  const [state, setState] = useState('checking'); // checking | claim | busy
  const valid = /^[a-zA-Z0-9_-]{8,40}$/.test(tagId);

  const open = () => {
    backend.updateTag(tagId, { last_tap_at: new Date().toISOString() }).catch(() => {});
    const recent = (tickets || []).find((t) => Date.now() - new Date(t.created_at).getTime() < 8 * 3600e3);
    go(recent ? `/ticket/${recent.id}?record=1` : '/add');
  };

  useEffect(() => {
    let alive = true;
    backend.listTags().catch(() => []).then((tags) => {
      if (!alive) return;
      if (tags.some((t) => t.id === tagId)) open(); else setState('claim');
    });
    return () => { alive = false; };
  }, [tagId]);

  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const MSG = {
    wrong_code: '연결 코드가 맞지 않아요. 포장 카드의 8자리를 다시 확인해 주세요.',
    taken: '이미 다른 계정에 연결된 링이에요. 기존 주인이 연결을 해제해야 연결할 수 있어요.',
    locked: '코드를 여러 번 틀려서 잠겼어요. 고객센터로 문의해 주세요.',
    not_found: '등록된 링이 아니에요. 링·태그 메뉴에서 새로 연결해 주세요.',
  };
  const claim = async (e) => {
    e.preventDefault();
    setErr(''); setState('busy');
    try {
      const r = await backend.claimRing(tagId, code.trim().toUpperCase());
      if (r === 'ok') { toast('링을 내 계정에 연결했어요'); open(); return; }
      setErr(MSG[r] || '링을 연결하지 못했어요.');
    } catch (e2) {
      setErr(e2.message);
    }
    setState('claim');
  };

  if (state === 'checking') return <Loading text="링을 확인하는 중" />;
  return (
    <div className="empty">
      <div className="ring-art" aria-hidden="true" />
      {valid ? (
        <>
          <h2>새 링을 발견했어요</h2>
          <p>포장 카드에 적힌 <b>연결 코드 8자리</b>를 입력하면 내 계정에 연결돼요. 다음부터는 태그만 해도 오늘의 티켓과 30초 녹음이 바로 열려요.</p>
          <form onSubmit={claim} style={{ maxWidth: 320, margin: '0 auto' }}>
            <label className="sr" htmlFor="claim-code">연결 코드</label>
            <input id="claim-code" className="input mono" style={{ textAlign: 'center', letterSpacing: '0.2em', textTransform: 'uppercase' }} autoComplete="off" autoCapitalize="characters" maxLength={8} value={code} onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))} placeholder="ABCD2345" />
            <button className="btn primary block" style={{ marginTop: 12 }} disabled={state === 'busy' || code.trim().length !== 8}>내 계정에 연결하기</button>
          </form>
          {err && <p className="error" role="alert">{err}</p>}
        </>
      ) : (
        <>
          <h2>올바른 링 코드가 아니에요</h2>
          <p>링·태그 메뉴에서 다시 연결해 주세요.</p>
          <a className="btn" href="#/rings">링·태그 메뉴</a>
        </>
      )}
    </div>
  );
}
