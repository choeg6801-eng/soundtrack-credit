// 공유 이미지 미리보기·저장·공유 (티켓 카드, 연말 결산 카드에서 함께 사용)
import { useEffect, useState } from 'react';
import { useApp, Sheet, Loading } from './kit.jsx';
import { I } from './icons.jsx';
import { FORMATS } from '../lib/sharecard.js';

export function ShareSheet({ title = '공유 카드', render, fileBase, alt, caption, shareTitle, shareText = '#시네필기록 #영화OST여운', onClose }) {
  const { toast } = useApp();
  const [format, setFormat] = useState('story');
  const [card, setCard] = useState(null); // { blob, url }
  useEffect(() => {
    let alive = true, url = null;
    setCard(null);
    render(format).then((blob) => {
      if (!alive) return;
      url = URL.createObjectURL(blob);
      setCard({ blob, url });
    }).catch(() => toast('카드를 만들지 못했어요', true));
    return () => { alive = false; if (url) URL.revokeObjectURL(url); };
  }, [format]);

  const name = `soundtrack-credit-${String(fileBase).replace(/[^a-zA-Z0-9가-힣]+/g, '-').slice(0, 40)}-${format}.png`;
  const file = card ? new File([card.blob], name, { type: 'image/png' }) : null;
  const canShare = file && navigator.canShare && navigator.canShare({ files: [file] });

  return (
    <Sheet title={title} onClose={onClose}>
      <div className="seg" role="group" aria-label="카드 크기" style={{ marginTop: 0 }}>
        {Object.entries(FORMATS).map(([k, f]) => <button key={k} type="button" aria-pressed={format === k} onClick={() => setFormat(k)}>{f.label}</button>)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--bg)', borderRadius: 16, padding: 12, minHeight: 280 }}>
        {card ? <img className="share-preview" src={card.url} alt={alt} style={{ maxHeight: '56vh', width: 'auto', borderRadius: 12, boxShadow: 'var(--shadow)' }} /> : <Loading text="카드 만드는 중" />}
      </div>
      {caption && <p className="faint small" style={{ margin: '12px 0 0' }}>{caption}</p>}
      <div className="actions">
        <button className="btn ghost" onClick={onClose}>닫기</button>
        {card && <a className="btn" href={card.url} download={name}>이미지 저장</a>}
        {canShare && <button className="btn primary" onClick={() => navigator.share({ files: [file], title: shareTitle, text: shareText }).catch(() => {})}><I.share />공유하기</button>}
      </div>
    </Sheet>
  );
}
