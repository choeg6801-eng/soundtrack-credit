import { useApp } from '../ui/kit.jsx';
import { I } from '../ui/icons.jsx';
import { FromTaste } from './Recommend.jsx';

// 가입 직후(기록이 없을 때) 한 번 보여 주는 취향 고르기 화면
export function Welcome() {
  const { backend, profile, setProfile, go } = useApp();
  const skip = async (to = '/') => {
    const taste = { ...((profile && profile.taste) || {}), done: true };
    setProfile((p) => ({ ...(p || {}), taste }));
    try { await backend.updateProfile({ taste }); } catch (e) { /* 무시 */ }
    go(typeof to === 'string' ? to : '/');
  };
  return (
    <>
      <div className="head">
        <div>
          <p className="kicker">WELCOME · 첫 상영</p>
          <h1>{profile && profile.nickname ? `${profile.nickname}님, 반가워요` : 'Soundtrack Credit에 오신 걸 환영해요'}</h1>
          <p className="muted">좋아하는 장르와 보고 나서 남았으면 하는 여운을 고르면, 지금 바로 볼 만한 영화를 찾아 드릴게요. 본 영화를 기록할수록 추천이 더 정확해져요.</p>
        </div>
        <button className="btn ghost sm" onClick={() => skip()}>나중에 할게요</button>
      </div>
      <FromTaste list={[]} title="취향 고르기 · 여러 개 골라도 좋아요" />
      <div className="row" style={{ justifyContent: 'center', marginTop: 24 }}>
        <button className="btn primary" onClick={() => skip('/add')}><I.plus />본 영화 기록하러 가기</button>
        <button className="btn" onClick={() => skip()}><I.ticket />티켓북으로</button>
      </div>
    </>
  );
}
