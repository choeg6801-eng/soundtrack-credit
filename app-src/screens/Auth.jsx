import { useState } from 'react';
import { useApp } from '../ui/kit.jsx';
import { CATALOG } from '../lib/catalog.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Art() {
  return (
    <section className="auth-art" aria-label="소개">
      <div className="wall" aria-hidden="true">{CATALOG.concat(CATALOG).slice(0, 25).map((m, i) => <img key={i} src={m.poster} alt="" />)}</div>
      <div className="shade" aria-hidden="true" />
      <a className="brand" href="/" style={{ color: '#F3EBDD' }}><span className="brand-mark" aria-hidden="true" />Soundtrack Credit</a>
      <div>
        <p className="kicker" style={{ color: '#E9B04A' }}>NOW SHOWING · 나만의 영화관</p>
        <h1 style={{ marginTop: 14 }}>불이 켜져도,<br /><em>여운은 꺼지지 않게.</em></h1>
        <p style={{ color: '#CFC5B3', maxWidth: 440, marginTop: 14 }}>티켓 한 장에 날짜·날씨·좌석·포스터, OST와 촬영지, 그리고 30초의 목소리까지.</p>
      </div>
    </section>
  );
}

export function Auth() {
  const { backend, toast } = useApp();
  const [tab, setTab] = useState('in');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sent, setSent] = useState('');

  if (backend.mode === 'demo') {
    return (
      <div className="auth">
        <Art />
        <div className="auth-form">
          <p className="kicker">체험 모드</p>
          <h2 style={{ margin: '10px 0 12px', fontSize: 28 }}>로그인 없이 바로 둘러보기</h2>
          <p className="muted">아직 서버(Supabase)가 연결되지 않아 <b>이 브라우저 안에만</b> 저장돼요. 예시 티켓 3장이 들어 있고, 티켓 등록·녹음·추천·링 연결을 모두 직접 해 볼 수 있어요.</p>
          <button className="btn primary block" style={{ marginTop: 20 }} onClick={() => backend.enter()}>체험 시작하기</button>
          <p className="faint small" style={{ marginTop: 18 }}>운영자 안내: Vercel 환경 변수에 SUPABASE_URL 과 SUPABASE_ANON_KEY 를 넣으면 실제 회원가입·로그인 화면으로 바뀝니다.</p>
        </div>
      </div>
    );
  }

  const run = async (fn) => {
    setErr(''); setSent('');
    if (!EMAIL.test(email.trim())) { setErr('이메일 주소를 확인해 주세요.'); return; }
    setBusy(true);
    try { await fn(); } catch (e) { setErr(e.message); } finally { setBusy(false); }
  };

  const submit = (e) => {
    e.preventDefault();
    if (tab === 'up') {
      if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) { setErr('비밀번호는 8자 이상, 영문과 숫자를 섞어 주세요.'); return; }
      run(async () => {
        const r = await backend.signUp(email.trim(), pw);
        if (r.needsConfirm) setSent(`${email.trim()} 로 가입 확인 메일을 보냈어요. 메일의 링크를 누르면 바로 시작돼요.`);
      });
    } else {
      if (!pw) { setErr('비밀번호를 입력해 주세요.'); return; }
      run(() => backend.signIn(email.trim(), pw));
    }
  };

  return (
    <div className="auth">
      <Art />
      <form className="auth-form" onSubmit={submit} noValidate>
        <p className="kicker">{tab === 'in' ? 'WELCOME BACK' : 'JOIN THE PREMIERE'}</p>
        <h2 style={{ margin: '10px 0 0', fontSize: 28 }}>{tab === 'in' ? '나의 티켓북 열기' : '첫 티켓을 기록해 볼까요'}</h2>
        <div className="seg" role="group" aria-label="로그인 또는 가입">
          <button type="button" aria-pressed={tab === 'in'} onClick={() => { setTab('in'); setErr(''); setSent(''); }}>로그인</button>
          <button type="button" aria-pressed={tab === 'up'} onClick={() => { setTab('up'); setErr(''); setSent(''); }}>회원가입</button>
        </div>
        <label className="field"><span>이메일</span>
          <input className="input" type="email" autoComplete="email" inputMode="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
        </label>
        <label className="field"><span>비밀번호{tab === 'up' ? ' (8자 이상, 영문+숫자)' : ''}</span>
          <input className="input" type="password" autoComplete={tab === 'up' ? 'new-password' : 'current-password'} value={pw} onChange={(e) => setPw(e.target.value)} required minLength={tab === 'up' ? 8 : undefined} />
        </label>
        {tab === 'up' && <p className="faint small" style={{ margin: '0 0 14px' }}>가입하면 <a href="/terms.html" target="_blank" rel="noopener">이용약관</a>과 <a href="/privacy.html" target="_blank" rel="noopener">개인정보처리방침</a>에 동의하는 것으로 봅니다.</p>}
        <button className="btn primary block" disabled={busy}>{busy ? '잠시만요…' : tab === 'in' ? '로그인' : '가입하고 시작하기'}</button>
        {err && <p className="error" role="alert">{err}</p>}
        {sent && <p className="note" role="status" style={{ marginTop: 14 }}>{sent}</p>}
        <div className="or">또는</div>
        <button type="button" className="btn block" disabled={busy} onClick={() => run(async () => { await backend.magicLink(email.trim()); setSent(`${email.trim()} 로 로그인 링크를 보냈어요. 메일의 링크를 누르면 바로 들어와요.`); })}>비밀번호 없이 메일 링크로 로그인</button>
        {tab === 'in' && <button type="button" className="linkbtn" onClick={() => run(async () => { await backend.resetPassword(email.trim()); setSent('비밀번호 재설정 메일을 보냈어요.'); toast('메일함을 확인해 주세요'); })}>비밀번호를 잊었어요</button>}
      </form>
    </div>
  );
}

export function NewPassword({ onDone }) {
  const { backend, toast } = useApp();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw)) { setErr('비밀번호는 8자 이상, 영문과 숫자를 섞어 주세요.'); return; }
    setBusy(true);
    try { await backend.updatePassword(pw); toast('새 비밀번호로 바꿨어요'); onDone(); } catch (e2) { setErr(e2.message); } finally { setBusy(false); }
  };
  return (
    <div className="auth">
      <Art />
      <form className="auth-form" onSubmit={submit}>
        <h2 style={{ fontSize: 28, marginBottom: 18 }}>새 비밀번호 설정</h2>
        <label className="field"><span>새 비밀번호 (8자 이상, 영문+숫자)</span>
          <input className="input" type="password" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
        </label>
        <button className="btn primary block" disabled={busy}>저장</button>
        {err && <p className="error" role="alert">{err}</p>}
      </form>
    </div>
  );
}
