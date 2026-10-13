import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export function Poster({ src, title, className = '', label }) {
  const [bad, setBad] = useState(false);
  useEffect(() => setBad(false), [src]);
  return (
    <div className={`poster ${className}`}>
      {src && !bad ? <img src={src} alt={label || `${title} 포스터`} loading="lazy" onError={() => setBad(true)} /> : (
        <div className="ph" role="img" aria-label={`${title} 포스터 없음`}><small>NOW SHOWING</small>{title}</div>
      )}
    </div>
  );
}

export function Sheet({ title, onClose, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    const el = ref.current;
    const first = el && el.querySelector('input, select, textarea, button');
    if (first) first.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; if (prev && prev.focus) prev.focus(); };
  }, []);
  return (
    <div className="backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="sheet" role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = useCallback((text, err = false) => {
    clearTimeout(timer.current);
    setToast({ text, err });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  const node = toast ? <div className={`toast ${toast.err ? 'err' : ''}`} role="status" aria-live="polite">{toast.text}</div> : null;
  return [node, show];
}

export function Loading({ text = '불러오는 중' }) {
  return <div className="loading"><span className="spin" aria-hidden="true" />{text}</div>;
}

export function Switch({ checked, onChange, label }) {
  return <button type="button" role="switch" aria-checked={checked} aria-label={label} className="switch" onClick={() => onChange(!checked)} />;
}
