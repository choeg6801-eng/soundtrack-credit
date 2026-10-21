// 어디서·언제 봤는지 입력 (새 기록과 수정 화면에서 함께 사용)
import { WATCH_TYPES, PLATFORMS, PRECISIONS, yearOptions, todayStr } from '../lib/when.js';

export function WhenWhere({ s, set, releaseYear }) {
  const up = (k) => (e) => set((x) => ({ ...x, [k]: e && e.target ? e.target.value : e }));
  const years = yearOptions(releaseYear);
  const presets = PLATFORMS[s.type] || [];
  return (
    <>
      <div className="field">
        <span id="ww-type">어디서 봤나요?</span>
        <div className="seg seg3" role="group" aria-labelledby="ww-type" style={{ margin: 0 }}>
          {WATCH_TYPES.map(([k, label]) => <button type="button" key={k} aria-pressed={s.type === k} onClick={() => set((x) => ({ ...x, type: k, platform: k === x.type ? x.platform : '' }))}>{label}</button>)}
        </div>
      </div>

      {s.type === 'cinema' ? (
        <div className="grid2">
          <label className="field"><span>극장·상영관 (선택)</span><input className="input" value={s.theater} maxLength={60} onChange={up('theater')} placeholder="예: OO시네마 3관" /></label>
          <label className="field"><span>좌석 (선택)</span><input className="input mono" value={s.seat} maxLength={20} onChange={up('seat')} placeholder="F11" /></label>
        </div>
      ) : (
        <div className="field">
          <span id="ww-plat">{s.type === 'ott' ? '어떤 서비스로 봤나요? (선택)' : '어떻게 봤나요? (선택)'}</span>
          <div className="chips" role="group" aria-labelledby="ww-plat">
            {presets.map((p) => <button type="button" key={p} className="chip" aria-pressed={s.platform === p} onClick={() => set((x) => ({ ...x, platform: x.platform === p ? '' : p }))}>{p}</button>)}
          </div>
          <input className="input" style={{ marginTop: 10 }} aria-label="직접 입력" value={presets.includes(s.platform) ? '' : s.platform} maxLength={30} onChange={up('platform')} placeholder="목록에 없으면 직접 입력" />
        </div>
      )}

      <div className="field">
        <span id="ww-when">언제 봤나요? <small className="faint">기억나는 만큼만</small></span>
        <div className="chips" role="group" aria-labelledby="ww-when">
          {PRECISIONS.map(([k, label]) => <button type="button" key={k} className="chip" aria-pressed={s.prec === k} onClick={() => set((x) => ({ ...x, prec: k }))}>{label}</button>)}
        </div>
        <div style={{ marginTop: 10 }}>
          {s.prec === 'exact' && <input className="input" type="datetime-local" aria-label="본 날짜와 시간" value={s.dt} max={`${todayStr()}T23:59`} onChange={up('dt')} required />}
          {s.prec === 'day' && <input className="input" type="date" aria-label="본 날짜" value={s.day} max={todayStr()} onChange={up('day')} required />}
          {(s.prec === 'month' || s.prec === 'year') && (
            <div className="row">
              <select className="select" style={{ flex: '1 1 120px', width: 'auto' }} aria-label="본 연도" value={s.y} onChange={up('y')}>
                {(years.includes(s.y) ? years : [s.y, ...years]).map((y) => <option key={y} value={y}>{y}년</option>)}
              </select>
              {s.prec === 'month' && (
                <select className="select" style={{ flex: '1 1 100px', width: 'auto' }} aria-label="본 달" value={s.m} onChange={up('m')}>
                  {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((m) => <option key={m} value={m}>{m}월</option>)}
                </select>
              )}
            </div>
          )}
          {s.prec === 'unknown' && <p className="faint small" style={{ margin: 0 }}>괜찮아요. 티켓북에는 ‘언젠가’로 표시되고, 개봉 연도 근처에 정리돼요.</p>}
        </div>
      </div>
    </>
  );
}
