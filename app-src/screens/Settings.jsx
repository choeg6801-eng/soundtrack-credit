import { useState } from 'react';
import { useApp, Sheet, Switch } from '../ui/kit.jsx';
import { downloadJson } from '../lib/util.js';

const PLAN = { beta: '베타 멤버', free: '무료', member: '정식 멤버' };

export function Settings() {
  const { backend, config, user, profile, setProfile, tickets, theme, setTheme, toast, go } = useApp();
  const [nick, setNick] = useState((profile && profile.nickname) || '');
  const [del, setDel] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [busy, setBusy] = useState(false);
  const demo = backend.mode === 'demo';

  const saveNick = async (e) => {
    e.preventDefault();
    try { setProfile(await backend.updateProfile({ nickname: nick.trim().slice(0, 30) || null })); toast('저장했어요'); } catch (e2) { toast(e2.message, true); }
  };

  const exportAll = async () => {
    const tags = await backend.listTags().catch(() => []);
    downloadJson(`soundtrack-credit-${new Date().toISOString().slice(0, 10)}.json`, {
      exported_at: new Date().toISOString(), account: user && user.email, profile, tickets, rings: tags,
      note: '보이스 메모 음성 파일은 각 티켓 화면에서 재생·저장할 수 있어요.',
    });
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <div className="head"><div><p className="kicker">SETTINGS</p><h1>설정</h1></div></div>

      <section className="card plan">
        <p className="kicker">MEMBERSHIP</p>
        <h2 style={{ margin: '8px 0 6px' }}>{PLAN[(profile && profile.plan) || 'beta']}</h2>
        <p className="muted small" style={{ margin: 0 }}>정식 출시 전까지 모든 기능을 무료로 써요. 출시 후 멤버십은 <b className="price" style={{ fontSize: 'inherit' }}>월 10,000원</b>(링 또는 태그 1개 포함)이며, 결제가 시작되기 전에 미리 안내해 드려요.</p>
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 6 }}>화면</h3>
        <div className="setting"><div><b>상영 모드</b><div className="faint small">어두운 화면과 앰버 톤으로 눈부심을 줄여요</div></div><Switch checked={theme !== 'light'} onChange={(on) => setTheme(on ? 'dark' : 'light')} label="상영 모드" /></div>
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 12 }}>계정</h3>
        <p className="muted small" style={{ marginTop: 0 }}>{demo ? '체험 모드 · 이 브라우저에만 저장돼요' : user && user.email}</p>
        <form className="row" onSubmit={saveNick}>
          <label className="sr" htmlFor="nick">닉네임</label>
          <input id="nick" className="input" style={{ flex: '1 1 200px', width: 'auto' }} value={nick} maxLength={30} onChange={(e) => setNick(e.target.value)} placeholder="닉네임 (티켓북 제목에 표시)" />
          <button className="btn sm">저장</button>
        </form>
        <hr className="sep" />
        <div className="row">
          <button className="btn sm" onClick={exportAll}>내 기록 내려받기 (JSON)</button>
          <button className="btn sm" onClick={async () => { await backend.signOut(); go('/'); }}>로그아웃</button>
          {demo && <button className="btn sm" onClick={async () => { await backend.reset(); location.reload(); }}>체험 데이터 초기화</button>}
          <button className="btn sm danger" onClick={() => setDel(true)}>{demo ? '체험 데이터 모두 삭제' : '회원 탈퇴'}</button>
        </div>
      </section>

      <section className="card">
        <h3 style={{ marginBottom: 10 }}>안내</h3>
        <div className="row">
          <a className="btn sm ghost" href="/terms.html">이용약관</a>
          <a className="btn sm ghost" href="/privacy.html">개인정보처리방침</a>
          <a className="btn sm ghost" href="/">서비스 소개</a>
        </div>
        <p className="faint tiny" style={{ marginTop: 14 }}>영화 정보: TMDB · 날씨: Open-Meteo · OST 미리듣기: Apple Music<br />This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </section>

      {del && (
        <Sheet title={demo ? '체험 데이터를 모두 지울까요?' : '정말 탈퇴할까요?'} onClose={() => setDel(false)}>
          <p className="muted">티켓, 보이스 메모, 링 연결 정보가 모두 삭제되고 되돌릴 수 없어요. 먼저 ‘내 기록 내려받기’로 백업해 두세요.</p>
          {!demo && !config.accountDeletion && <p className="note">탈퇴 기능이 아직 서버에 설정되지 않았어요. 고객센터로 요청해 주세요.</p>}
          <label className="field"><span>확인을 위해 ‘탈퇴’를 입력해 주세요</span><input className="input" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} /></label>
          <div className="actions">
            <button className="btn ghost" onClick={() => setDel(false)}>취소</button>
            <button className="btn primary" disabled={confirmText.trim() !== '탈퇴' || busy || (!demo && !config.accountDeletion)} onClick={async () => {
              setBusy(true);
              try { await backend.deleteAccount(); toast('모든 기록을 삭제했어요'); go('/'); } catch (e) { toast(e.message, true); } finally { setBusy(false); }
            }}>삭제</button>
          </div>
        </Sheet>
      )}
    </div>
  );
}
