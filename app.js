/* Generated from the Soundtrack Credit F1 design. Edit and regenerate, or edit here directly. */
(function () {
'use strict';
var h = SC.h;

/* ── Poster ── */
class Comp_Poster extends SC.DCLogic {
  renderVals() {
    const k = this.props.kind ?? 'sea';
    const src = this.props.src ?? '';
    const hasSrc = !!src;
    const h = this.props.h ?? '340px';
    const label = this.props.label ?? '푸른 여름의 끝';
    return {
      label,
      src,
      alt: `${label} 포스터`,
      hasSrc,
      showLabel: !hasSrc && !this.props.bare,
      rootStyle: `position: relative; display: block; width: 100%; height: ${h}; overflow: hidden; border-radius: inherit; background: #0B0A08; color: #FFF6E6; font-family: 'Nanum Myeongjo', serif`,
      isSea: !hasSrc && k === 'sea',
      isJazz: !hasSrc && k === 'jazz',
      isLighthouse: !hasSrc && k === 'lighthouse',
      isDesert: !hasSrc && k === 'desert',
      isSnow: !hasSrc && k === 'snow',
      isForest: !hasSrc && k === 'forest',
      isNeon: !hasSrc && k === 'neon'
    };
  }
}
Comp_Poster.defaults = {"kind": "sea", "label": "푸른 여름의 끝", "h": "340px", "src": "", "bare": false};
Comp_Poster.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      (v.hasSrc) ? [h("img", {"src": v.src, "alt": v.alt, "style": "position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block"})] : null,
      (v.isSea) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "노을 지는 바다와 방파제 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-sea-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#1B2A4A"}),
              h("stop", {"offset": "0.5", "stop-color": "#B9563A"}),
              h("stop", {"offset": "0.7", "stop-color": "#F2B45A"})),
            h("linearGradient", {"id": "pst-sea-water", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#2A3557"}),
              h("stop", {"offset": "1", "stop-color": "#0C1426"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-sea-sky)"}),
          h("circle", {"cx": "132", "cy": "214", "r": "44", "fill": "#FFD994"}),
          h("circle", {"cx": "132", "cy": "214", "r": "62", "fill": "#FFD994", "opacity": "0.18"}),
          h("rect", {"y": "214", "width": "240", "height": "126", "fill": "url(#pst-sea-water)"}),
          h("path", {"d": "M96 226h72M108 236h48M88 248h84M114 260h36M100 274h60", "stroke": "#F7C673", "stroke-width": "2", "stroke-linecap": "round", "opacity": "0.75"}),
          h("path", {"d": "M0 262h150v7H0z", "fill": "#070B16"}),
          h("path", {"d": "M150 262h6v40h-6z", "fill": "#070B16"}),
          h("rect", {"x": "120", "y": "242", "width": "5", "height": "20", "rx": "2", "fill": "#070B16"}),
          h("circle", {"cx": "122.5", "cy": "239", "r": "4", "fill": "#070B16"}),
          h("path", {"d": "M40 70c6-4 12-4 18 0M60 60c5-3 10-3 15 0", "stroke": "#0E1730", "stroke-width": "2", "fill": "none", "stroke-linecap": "round"}))] : null,
      (v.isJazz) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "달 뜬 밤의 재즈 바 골목 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-jazz-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#0A0F26"}),
              h("stop", {"offset": "1", "stop-color": "#2B1E46"})),
            h("radialGradient", {"id": "pst-jazz-glow", "cx": "0.5", "cy": "0.5", "r": "0.5"},
              h("stop", {"offset": "0", "stop-color": "#F2B45A", "stop-opacity": "0.55"}),
              h("stop", {"offset": "1", "stop-color": "#F2B45A", "stop-opacity": "0"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-jazz-sky)"}),
          h("circle", {"cx": "178", "cy": "72", "r": "24", "fill": "#F5DDA6"}),
          h("circle", {"cx": "188", "cy": "64", "r": "22", "fill": "#121634"}),
          h("circle", {"cx": "40", "cy": "40", "r": "1.4", "fill": "#F5DDA6"}),
          h("circle", {"cx": "96", "cy": "58", "r": "1.2", "fill": "#F5DDA6"}),
          h("circle", {"cx": "140", "cy": "30", "r": "1.4", "fill": "#F5DDA6"}),
          h("circle", {"cx": "70", "cy": "96", "r": "1", "fill": "#F5DDA6"}),
          h("path", {"d": "M0 150h50v190H0z", "fill": "#070A18"}),
          h("path", {"d": "M44 120h60v220H44z", "fill": "#0C1024"}),
          h("path", {"d": "M150 170h90v170h-90z", "fill": "#070A18"}),
          h("path", {"d": "M100 196h56v144h-56z", "fill": "#0A0D1F"}),
          h("g", {"fill": "#F2B45A"},
            h("rect", {"x": "56", "y": "140", "width": "10", "height": "12", "rx": "1"}),
            h("rect", {"x": "80", "y": "140", "width": "10", "height": "12", "rx": "1", "opacity": "0.4"}),
            h("rect", {"x": "56", "y": "170", "width": "10", "height": "12", "rx": "1", "opacity": "0.5"}),
            h("rect", {"x": "80", "y": "200", "width": "10", "height": "12", "rx": "1"}),
            h("rect", {"x": "166", "y": "190", "width": "10", "height": "12", "rx": "1", "opacity": "0.6"}),
            h("rect", {"x": "196", "y": "190", "width": "10", "height": "12", "rx": "1"}),
            h("rect", {"x": "196", "y": "220", "width": "10", "height": "12", "rx": "1", "opacity": "0.4"}),
            h("rect", {"x": "12", "y": "170", "width": "10", "height": "12", "rx": "1", "opacity": "0.7"})),
          h("ellipse", {"cx": "128", "cy": "300", "rx": "90", "ry": "40", "fill": "url(#pst-jazz-glow)"}),
          h("rect", {"x": "112", "y": "250", "width": "32", "height": "50", "rx": "16", "fill": "#F2B45A", "opacity": "0.9"}),
          h("path", {"d": "M100 248h56", "stroke": "#F2B45A", "stroke-width": "3"}))] : null,
      (v.isLighthouse) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "안개 낀 바다 위 등대 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-lh-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#0B2229"}),
              h("stop", {"offset": "1", "stop-color": "#2E5A5C"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-lh-sky)"}),
          h("path", {"d": "M160 92L-10 40v110z", "fill": "#F7D48C", "opacity": "0.28"}),
          h("path", {"d": "M160 92L250 60v70z", "fill": "#F7D48C", "opacity": "0.14"}),
          h("path", {"d": "M0 250c40-10 70-6 100 2s70 6 140-8v96H0z", "fill": "#0A1C21"}),
          h("path", {"d": "M120 300l20-70h50l30 70z", "fill": "#071417"}),
          h("path", {"d": "M150 230l8-120h14l8 120z", "fill": "#EDE4D3"}),
          h("path", {"d": "M152 196h26v12h-26zM155 150h20v10h-20z", "fill": "#B9563A"}),
          h("rect", {"x": "154", "y": "84", "width": "22", "height": "18", "rx": "2", "fill": "#F7D48C"}),
          h("path", {"d": "M150 84h30l-15-14z", "fill": "#071417"}),
          h("path", {"d": "M0 270h240", "stroke": "#F7D48C", "stroke-width": "1", "opacity": "0.3"}),
          h("path", {"d": "M20 284h50M120 290h60", "stroke": "#BFD6D4", "stroke-width": "1.5", "opacity": "0.35", "stroke-linecap": "round"}))] : null,
      (v.isDesert) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "붉은 사막과 국도 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-ds-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#F6CF86"}),
              h("stop", {"offset": "1", "stop-color": "#E0784A"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-ds-sky)"}),
          h("circle", {"cx": "150", "cy": "120", "r": "52", "fill": "#FFF1CC"}),
          h("path", {"d": "M0 196c50-26 100-24 140-6s70 14 100 0v150H0z", "fill": "#C2603A"}),
          h("path", {"d": "M0 236c60-30 120-10 160 6s60 4 80-6v104H0z", "fill": "#93402A"}),
          h("path", {"d": "M0 284c70-18 140 4 240-14v70H0z", "fill": "#5E261A"}),
          h("path", {"d": "M118 340L132 236h4l20 104z", "fill": "#2E140E"}),
          h("path", {"d": "M134 250v10M136 276v12M139 306v14", "stroke": "#F6CF86", "stroke-width": "2"}),
          h("path", {"d": "M60 80c8-5 16-5 24 0", "stroke": "#7A3A22", "stroke-width": "2", "fill": "none", "stroke-linecap": "round"}))] : null,
      (v.isSnow) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "눈 내리는 기차역 플랫폼 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-sn-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#5D7290"}),
              h("stop", {"offset": "1", "stop-color": "#C9D5E2"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-sn-sky)"}),
          h("path", {"d": "M0 200h240v12H0z", "fill": "#2A3242"}),
          h("rect", {"x": "20", "y": "146", "width": "200", "height": "56", "rx": "10", "fill": "#2C3546"}),
          h("g", {"fill": "#F7D48C"},
            h("rect", {"x": "34", "y": "160", "width": "24", "height": "18", "rx": "3"}),
            h("rect", {"x": "68", "y": "160", "width": "24", "height": "18", "rx": "3"}),
            h("rect", {"x": "102", "y": "160", "width": "24", "height": "18", "rx": "3", "opacity": "0.5"}),
            h("rect", {"x": "136", "y": "160", "width": "24", "height": "18", "rx": "3"}),
            h("rect", {"x": "170", "y": "160", "width": "24", "height": "18", "rx": "3", "opacity": "0.6"})),
          h("path", {"d": "M0 212h240v128H0z", "fill": "#E9EEF4"}),
          h("path", {"d": "M0 236h240", "stroke": "#B9C4D2", "stroke-width": "2"}),
          h("path", {"d": "M60 238v60M180 238v60", "stroke": "#3A4456", "stroke-width": "4"}),
          h("path", {"d": "M50 238h20v-8H50zM170 238h20v-8h-20z", "fill": "#3A4456"}),
          h("rect", {"x": "110", "y": "250", "width": "6", "height": "22", "rx": "2", "fill": "#2A3242"}),
          h("circle", {"cx": "113", "cy": "246", "r": "4.5", "fill": "#2A3242"}),
          h("g", {"fill": "#FFFFFF"},
            h("circle", {"cx": "20", "cy": "30", "r": "2"}),
            h("circle", {"cx": "70", "cy": "60", "r": "1.6"}),
            h("circle", {"cx": "120", "cy": "24", "r": "2.2"}),
            h("circle", {"cx": "180", "cy": "50", "r": "1.8"}),
            h("circle", {"cx": "220", "cy": "90", "r": "2"}),
            h("circle", {"cx": "40", "cy": "110", "r": "1.6"}),
            h("circle", {"cx": "150", "cy": "100", "r": "2"}),
            h("circle", {"cx": "95", "cy": "130", "r": "1.4"}),
            h("circle", {"cx": "200", "cy": "130", "r": "1.6"}),
            h("circle", {"cx": "30", "cy": "290", "r": "1.8"}),
            h("circle", {"cx": "140", "cy": "300", "r": "1.6"}),
            h("circle", {"cx": "210", "cy": "280", "r": "2"})))] : null,
      (v.isForest) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "햇살 드는 여름 숲길 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-fr-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#F3E3B0"}),
              h("stop", {"offset": "1", "stop-color": "#9DB37A"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-fr-sky)"}),
          h("path", {"d": "M120 0L60 340h40L120 60z", "fill": "#FFF4CF", "opacity": "0.35"}),
          h("path", {"d": "M150 0L120 340h30z", "fill": "#FFF4CF", "opacity": "0.25"}),
          h("path", {"d": "M-10 120l40-90 40 90zM20 170l50-110 50 110z", "fill": "#3E5B33"}),
          h("path", {"d": "M150 150l45-110 45 110zM180 200l40-90 40 90z", "fill": "#2F4A28"}),
          h("path", {"d": "M0 210c60-20 120-16 240-6v136H0z", "fill": "#5C7A3E"}),
          h("path", {"d": "M100 340c10-50 20-90 20-130h6c4 40 14 80 26 130z", "fill": "#D9C28A"}),
          h("rect", {"x": "114", "y": "248", "width": "6", "height": "20", "rx": "2", "fill": "#2A3A20"}),
          h("circle", {"cx": "117", "cy": "244", "r": "4.5", "fill": "#2A3A20"}),
          h("g", {"fill": "#FFF4CF"},
            h("circle", {"cx": "70", "cy": "200", "r": "1.6"}),
            h("circle", {"cx": "160", "cy": "180", "r": "1.4"}),
            h("circle", {"cx": "190", "cy": "230", "r": "1.8"}),
            h("circle", {"cx": "40", "cy": "250", "r": "1.4"})))] : null,
      (v.isNeon) ? [h("svg", {"viewBox": "0 0 240 340", "preserveAspectRatio": "xMidYMid slice", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "role": "img", "aria-label": "비 내리는 네온 거리 일러스트"},
          h("defs", {},
            h("linearGradient", {"id": "pst-ne-sky", "x1": "0", "y1": "0", "x2": "0", "y2": "1"},
              h("stop", {"offset": "0", "stop-color": "#140B22"}),
              h("stop", {"offset": "1", "stop-color": "#3A1636"}))),
          h("rect", {"width": "240", "height": "340", "fill": "url(#pst-ne-sky)"}),
          h("path", {"d": "M0 90h70v250H0zM170 70h70v270h-70z", "fill": "#0B0614"}),
          h("rect", {"x": "14", "y": "120", "width": "44", "height": "16", "rx": "8", "fill": "none", "stroke": "#FF7AA8", "stroke-width": "2.5"}),
          h("rect", {"x": "182", "y": "110", "width": "46", "height": "18", "rx": "4", "fill": "none", "stroke": "#F2B45A", "stroke-width": "2.5"}),
          h("path", {"d": "M190 150h30M190 162h20", "stroke": "#F2B45A", "stroke-width": "2", "opacity": "0.6"}),
          h("path", {"d": "M0 270h240v70H0z", "fill": "#120A1C"}),
          h("path", {"d": "M20 290h40M100 300h60M180 288h40", "stroke": "#FF7AA8", "stroke-width": "2", "opacity": "0.5", "stroke-linecap": "round"}),
          h("path", {"d": "M90 310h20M150 320h30", "stroke": "#F2B45A", "stroke-width": "2", "opacity": "0.5", "stroke-linecap": "round"}),
          h("path", {"d": "M110 268c0-16 8-26 18-26s18 10 18 26z", "fill": "#F2B45A", "opacity": "0.9"}),
          h("path", {"d": "M128 242v-6", "stroke": "#F2B45A", "stroke-width": "2"}),
          h("rect", {"x": "120", "y": "268", "width": "5", "height": "18", "rx": "2", "fill": "#0B0614"}),
          h("rect", {"x": "131", "y": "268", "width": "5", "height": "18", "rx": "2", "fill": "#0B0614"}),
          h("g", {"stroke": "#B9A6D9", "stroke-width": "1", "opacity": "0.45"},
            h("path", {"d": "M30 20l-6 18M80 40l-6 18M130 10l-6 18M200 30l-6 18M110 70l-6 18M60 100l-6 18M150 120l-6 18M220 150l-6 18M90 170l-6 18"})))] : null,
      (v.showLabel) ? [h("div", {"style": "position: absolute; left: 0; right: 0; bottom: 0; padding: 18% 9% 9%; background: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.72))"},
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.22em; opacity: 0.8"},
            "A FILM · 예시"),
          h("div", {"style": "margin-top: 4px; font-weight: 800; font-size: 17px; line-height: 1.25"},
            (v.label ?? "")))] : null);
};

/* ── Recorder ── */
class Comp_Recorder extends SC.DCLogic {
  constructor(props) {
    super(props);
    this.state = { recording: false, seconds: 30, done: false };
    this.timer = null;
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const dark = (this.props.mode ?? 'dark') === 'dark';
    const { recording, seconds, done } = this.state;
    const fg = dark ? '#F3EBDD' : '#16130F';
    const muted = dark ? '#B8AE9C' : '#5C554A';
    const off = dark ? '#3A3328' : '#DCCFB7';
    const heights = [16, 30, 22, 46, 28, 58, 20, 38, 64, 34, 26, 50, 18, 42, 60, 30, 22, 48, 36, 56, 24, 40, 28, 14, 34, 22, 44, 18];
    const lit = Math.round(((30 - seconds) / 30) * heights.length);
    const bars = heights.map((h, i) => ({
      style: `display: block; flex: 1 1 0; height: ${h}px; border-radius: 3px; background: ${i < lit || (done && !recording) ? accent : off}`
    }));
    const toggle = () => {
      if (this.state.recording) {
        clearInterval(this.timer);
        this.timer = null;
        this.setState({ recording: false, done: true });
        return;
      }
      this.setState({ recording: true, seconds: 30, done: false });
      this.timer = setInterval(() => {
        const s = this.state.seconds - 1;
        if (s <= 0) {
          clearInterval(this.timer);
          this.timer = null;
          this.setState({ seconds: 0, recording: false, done: true });
        } else {
          this.setState({ seconds: s });
        }
      }, 1000);
    };
    return {
      movie: this.props.movie ?? '푸른 여름의 끝',
      muted,
      rootStyle: `width: 100%; box-sizing: border-box; padding: 32px; border-radius: 28px; background: ${dark ? '#14120E' : '#FFFFFF'}; border: 1px solid ${dark ? '#2E281F' : '#E3D8C4'}; color: ${fg}; font-family: 'IBM Plex Sans KR', sans-serif`,
      statusLabel: recording ? '● 녹음 중' : (done ? '저장 완료 ✓' : '대기 중'),
      statusStyle: `padding: 6px 12px; border-radius: 999px; background: ${recording ? accent : (dark ? '#24201A' : '#F5EFE4')}; color: ${recording ? '#16130F' : muted}`,
      bars,
      toggle,
      secondsText: String(seconds).padStart(2, '0'),
      hint: recording ? '말씀하세요. 다시 누르면 멈춰요.' : (done ? '다시 누르면 새로 녹음해요.' : '버튼을 눌러 직접 체험해 보세요.'),
      buttonLabel: recording ? '녹음 멈추기' : '30초 녹음 시작',
      buttonStyle: `flex: none; width: 80px; height: 80px; border-radius: 50%; border: 2px solid ${accent}; background: transparent; cursor: pointer; display: flex; align-items: center; justify-content: center`,
      buttonDot: recording
        ? `display: block; width: 26px; height: 26px; border-radius: 5px; background: ${accent}`
        : `display: block; width: 38px; height: 38px; border-radius: 50%; background: ${accent}`,
      transcriptBox: `margin-top: 24px; padding: 18px; border-radius: 18px; background: ${dark ? '#0A0907' : '#F5EFE4'}`,
      transcript: done
        ? '“마지막 파도 소리에서 숨이 멎었다. 엔딩 곡이 끝날 때까지 일어날 수가 없었어.”'
        : '말한 내용이 여기에 텍스트로 나타납니다.'
    };
  }
}
Comp_Recorder.defaults = {"accent": "#E9B04A", "mode": "dark", "movie": "푸른 여름의 끝"};
Comp_Recorder.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      h("div", {"style": "display: flex; justify-content: space-between; align-items: center; gap: 12px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.12em"},
        h("span", {"style": "color: "+(v.muted ?? "")},
          "VOICE NOTE · ",
          (v.movie ?? "")),
        h("span", {"style": v.statusStyle},
          (v.statusLabel ?? ""))),
      h("div", {"style": "margin-top: 26px; display: flex; align-items: center; gap: 4px; height: 72px", "aria-hidden": "true"},
        (v.bars || []).map((b, $i_b) => [h("span", {"style": b?.style})])),
      h("div", {"style": "margin-top: 24px; display: flex; align-items: center; justify-content: space-between; gap: 16px"},
        h("div", {},
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 42px; line-height: 1"},
            "0:",
            (v.secondsText ?? "")),
          h("div", {"style": "margin-top: 6px; font-size: 13px; color: "+(v.muted ?? "")},
            (v.hint ?? ""))),
        h("button", {"onClick": v.toggle, "aria-label": v.buttonLabel, "style": v.buttonStyle},
          h("span", {"style": v.buttonDot}))),
      h("div", {"style": v.transcriptBox},
        h("div", {"style": "font-size: 12px; letter-spacing: 0.12em; color: "+(v.muted ?? "")},
          "자동 변환 텍스트"),
        h("p", {"style": "margin: 10px 0 0; font-family: 'Nanum Myeongjo', serif; font-size: 17px; line-height: 1.75"},
          (v.transcript ?? ""))));
};

/* ── Configurator ── */
class Comp_Configurator extends SC.DCLogic {
  constructor(props) {
    super(props);
    this.state = { model: 'ring', color: 'amber', size: 'M', engrave: '' };
  }
  report(next) {
    const s = { ...this.state, ...next };
    const colorName = s.color === 'amber' ? '앰버 골드' : '시네마틱 블랙';
    const text = s.model === 'ring' ? `시네마 링 · ${colorName} · ${s.size}` : `티켓 태그 · ${colorName}`;
    const full = s.engrave ? `${text} · 각인 “${s.engrave}”` : text;
    if (typeof this.props.onSummary === 'function') this.props.onSummary(full);
  }
  set(next) {
    this.setState(next);
    this.report(next);
  }
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const dark = (this.props.mode ?? 'light') === 'dark';
    const { model, color, size, engrave } = this.state;
    const ink = dark ? '#F3EBDD' : '#16130F';
    const line = dark ? '#3A3328' : '#E3D8C4';
    const card = dark ? '#14120E' : '#FFFFFF';
    const soft = dark ? '#1E1B16' : '#FBF8F2';
    const metal = color === 'amber'
      ? 'conic-gradient(from 200deg, #8A5A12, #F6D48A, #C88A2A, #FFF1C8, #B07420, #E9B04A, #8A5A12)'
      : 'conic-gradient(from 200deg, #15130F, #4A443A, #1E1B16, #7A7262, #2A2620, #3A352D, #15130F)';
    const ringPx = size === 'S' ? 210 : size === 'M' ? 240 : 270;
    const sel = (on) => `border: 1.5px solid ${on ? ink : line}; background: ${on ? ink : soft}; color: ${on ? (dark ? '#16130F' : '#F5EFE4') : ink}`;
    const models = [{ id: 'ring', label: '시네마 링', sub: '손끝에 끼는 입장권' }, { id: 'tag', label: '티켓 태그', sub: '가방에 거는 키링' }].map((m) => ({
      ...m, pressed: m.id === model ? 'true' : 'false', pick: () => this.set({ model: m.id }),
      style: `padding: 16px; border-radius: 16px; ${sel(m.id === model)}; text-align: left; font-family: inherit; cursor: pointer`
    }));
    const colors = [{ id: 'black', label: '시네마틱 블랙', bg: 'linear-gradient(145deg, #4A443A, #15130F)' }, { id: 'amber', label: '앰버 골드', bg: 'linear-gradient(145deg, #F6D48A, #B07420)' }].map((c) => {
      const on = c.id === color;
      return { label: c.label, pressed: on ? 'true' : 'false', pick: () => this.set({ color: c.id }),
        style: `width: 52px; height: 52px; border-radius: 50%; padding: 4px; border: 2px solid ${on ? ink : 'transparent'}; background: transparent; cursor: pointer`,
        swatch: `display: block; width: 100%; height: 100%; border-radius: 50%; background: ${c.bg}` };
    });
    const sizes = ['S', 'M', 'L'].map((s) => ({ label: s, pressed: s === size ? 'true' : 'false', pick: () => this.set({ size: s }),
      style: `min-width: 56px; min-height: 44px; border-radius: 999px; ${sel(s === size)}; font-size: 15px; font-weight: 500; font-family: inherit; cursor: pointer` }));
    const colorName = color === 'amber' ? '앰버 골드' : '시네마틱 블랙';
    const base = model === 'ring' ? `시네마 링 · ${colorName} · ${size}` : `티켓 태그 · ${colorName}`;
    return {
      rootStyle: `width: 100%; display: flex; flex-wrap: wrap; gap: 24px; align-items: stretch; color: ${ink}; font-family: 'IBM Plex Sans KR', sans-serif`,
      panelStyle: `flex: 1 1 380px; min-width: 0; border-radius: 30px; background: ${card}; border: 1px solid ${line}; padding: 32px; box-sizing: border-box; display: flex; flex-direction: column; gap: 24px`,
      isRing: model === 'ring', isTag: model === 'tag',
      modelCode: model === 'ring' ? 'MODEL R · RING' : 'MODEL T · TAG',
      colorName,
      ringOuter: `width: ${ringPx}px; height: ${ringPx}px; border-radius: 50%; background: ${metal}; display: flex; align-items: center; justify-content: center; box-shadow: 0 40px 80px rgba(0,0,0,0.6)`,
      ringInner: `width: ${ringPx - 58}px; height: ${ringPx - 58}px; border-radius: 50%; background: #0E0C09; box-shadow: inset 0 10px 24px rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center`,
      engraveOnRing: `font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.1em; color: ${color === 'amber' ? '#E9B04A' : '#B8AE9C'}; max-width: 80%; text-align: center`,
      engraveText: engrave || 'SOUNDTRACK CREDIT',
      tagStyle: `position: relative; width: 176px; height: 250px; border-radius: 18px; background: ${color === 'amber' ? 'linear-gradient(150deg, #FBE3A6, #E9B04A 45%, #9C6618)' : 'linear-gradient(150deg, #5A5446, #22201A 50%, #0E0D0A)'}; color: ${color === 'amber' ? '#16130F' : accent}; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 4px; padding-bottom: 24px; box-sizing: border-box; box-shadow: 0 40px 80px rgba(0,0,0,0.6); transform: rotate(-6deg)`,
      models, colors, sizes,
      engrave,
      onEngrave: (e) => this.set({ engrave: String(e.target.value).slice(0, 12) }),
      inputStyle: `width: 100%; box-sizing: border-box; min-height: 52px; padding: 0 16px; border-radius: 14px; border: 1.5px solid ${line}; background: ${soft}; color: ${ink}; font-size: 16px; font-family: 'IBM Plex Mono', monospace`,
      summary: engrave ? `${base} · 각인 “${engrave}”` : base,
      summaryBox: `margin-top: auto; padding-top: 20px; border-top: 1px solid ${line}`,
      ctaStyle: `display: inline-flex; align-items: center; min-height: 52px; padding: 0 24px; border-radius: 999px; background: ${dark ? accent : '#16130F'}; color: ${dark ? '#16130F' : '#F5EFE4'}; text-decoration: none; font-weight: 600`
    };
  }
}
Comp_Configurator.defaults = {"accent": "#E9B04A", "mode": "light"};
Comp_Configurator.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      h("div", {"style": "flex: 1 1 520px; min-width: 0; min-height: 520px; border-radius: 30px; background: #0E0C09; position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 30px; overflow: hidden"},
        h("div", {"style": "position: absolute; left: 50%; top: 0; width: 380px; height: 100%; margin-left: -190px; background: linear-gradient(rgba(233,176,74,0.18), rgba(233,176,74,0) 70%)", "aria-hidden": "true"}),
        h("div", {"style": "position: absolute; left: 50%; top: 50%; width: 420px; height: 420px; margin: -230px 0 0 -210px; border-radius: 50%; border: 1px solid #221E18", "aria-hidden": "true"}),
        h("span", {"style": "position: absolute; left: 24px; top: 22px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; color: #8F8676"},
          (v.modelCode ?? "")),
        h("span", {"style": "position: absolute; right: 24px; top: 22px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.14em; color: #8F8676"},
          (v.colorName ?? "")),
        h("div", {"style": "position: relative"},
          (v.isRing) ? [h("div", {"style": v.ringOuter},
              h("div", {"style": v.ringInner},
                h("span", {"style": v.engraveOnRing},
                  (v.engraveText ?? ""))))] : null,
          (v.isTag) ? [h("div", {"style": v.tagStyle},
              h("span", {"style": "position: absolute; top: 16px; left: 50%; margin-left: -12px; width: 24px; height: 24px; border-radius: 50%; background: #0E0C09; box-shadow: inset 0 2px 4px rgba(0,0,0,0.6)"}),
              h("span", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 32px"},
                "SC"),
              h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.24em"},
                "ADMIT ONE"),
              h("span", {"style": "margin-top: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; opacity: 0.85"},
                (v.engraveText ?? "")))] : null),
        h("div", {"style": "width: 220px; height: 16px; border-radius: 50%; background: #000000; opacity: 0.6", "aria-hidden": "true"})),
      h("div", {"style": v.panelStyle},
        h("fieldset", {"style": "margin: 0; padding: 0; border: none"},
          h("legend", {"style": "font-size: 13px; font-weight: 600; margin-bottom: 12px"},
            "모델"),
          h("div", {"style": "display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px"},
            (v.models || []).map((m, $i_m) => [h("button", {"onClick": m?.pick, "aria-pressed": m?.pressed, "style": m?.style},
                h("span", {"style": "display: block; font-weight: 600; font-size: 16px"},
                  (m?.label ?? "")),
                h("span", {"style": "display: block; margin-top: 4px; font-size: 12px; opacity: 0.75"},
                  (m?.sub ?? "")))]))),
        h("fieldset", {"style": "margin: 0; padding: 0; border: none"},
          h("legend", {"style": "font-size: 13px; font-weight: 600; margin-bottom: 12px"},
            "컬러 · ",
            (v.colorName ?? "")),
          h("div", {"style": "display: flex; gap: 12px"},
            (v.colors || []).map((c, $i_c) => [h("button", {"onClick": c?.pick, "aria-pressed": c?.pressed, "aria-label": c?.label, "style": c?.style},
                h("span", {"style": c?.swatch}))]))),
        (v.isRing) ? [h("fieldset", {"style": "margin: 0; padding: 0; border: none"},
            h("legend", {"style": "font-size: 13px; font-weight: 600; margin-bottom: 12px"},
              "사이즈 (예시)"),
            h("div", {"style": "display: flex; gap: 8px"},
              (v.sizes || []).map((s, $i_s) => [h("button", {"onClick": s?.pick, "aria-pressed": s?.pressed, "style": s?.style},
                  (s?.label ?? ""))])))] : null,
        h("div", {},
          h("label", {"for": "cfg-engrave", "style": "display: block; font-size: 13px; font-weight: 600; margin-bottom: 10px"},
            "각인 문구 ",
            h("span", {"style": "font-weight: 400; opacity: 0.7"},
              "· 최대 12자")),
          h("input", {"id": "cfg-engrave", "type": "text", "maxlength": "12", "value": v.engrave, "onChange": v.onEngrave, "placeholder": "예: 첫 관람 2026.10", "style": v.inputStyle})),
        h("div", {"style": v.summaryBox},
          h("div", {"style": "font-size: 13px; opacity: 0.75"},
            (v.summary ?? "")),
          h("div", {"style": "margin-top: 6px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between"},
            h("span", {"style": "display: flex; flex-direction: column"},
              h("span", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 26px"},
                "월 10,000원"),
              h("span", {"style": "font-size: 12px; opacity: 0.7"},
                "멤버십 가입 시 기기 1개 포함")),
            h("a", {"href": "#join", "style": v.ctaStyle},
              "이 구성으로 알림 받기")))));
};

/* ── Recommender ── */
class Comp_Recommender extends SC.DCLogic {
  constructor(props) {
    super(props);
    this.state = { picked: [0, 1], sounds: [] };
  }
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const dark = (this.props.mode ?? 'dark') === 'dark';
    const fg = dark ? '#F3EBDD' : '#16130F';
    const muted = dark ? '#CFC5B3' : '#3A352C';
    const line = dark ? '#2E281F' : '#E3D8C4';
    const soft = dark ? '#1E1B16' : '#F5EFE4';
    const ink = dark ? '#F3EBDD' : '#16130F';
    const ALL = [
      { title: '라라랜드', kind: 'jazz', src: 'posters/la-la-land.jpg', genre: '음악', moods: ['아련함', '설렘'], sound: '재즈', place: '도시', ost: 'City of Stars' },
      { title: '비긴 어게인', kind: 'neon', src: 'posters/begin-again.jpg', genre: '음악', moods: ['설렘', '청량'], sound: '팝', place: '도시', ost: 'Lost Stars' },
      { title: '어바웃 타임', kind: 'sea', src: 'posters/about-time.jpg', genre: '로맨스', moods: ['포근함', '아련함'], sound: '팝', place: '바다', ost: 'How Long Will I Love You' },
      { title: '트루먼 쇼', kind: 'sea', src: 'posters/truman-show.jpg', genre: '드라마', moods: ['그리움', '경이'], sound: '피아노', place: '바다', ost: 'Truman Sleeps' },
      { title: '쥬라기 월드', kind: 'forest', src: 'posters/jurassic-world.jpg', genre: '어드벤처', moods: ['긴장', '경이'], sound: '오케스트라', place: '정글', ost: 'Welcome to Jurassic World' },
      { title: '원스', kind: 'jazz', src: 'posters/once.jpg', genre: '음악', moods: ['아련함', '설렘'], sound: '어쿠스틱', place: '도시', ost: 'Falling Slowly' },
      { title: '싱 스트리트', kind: 'neon', src: 'posters/sing-street.jpg', genre: '음악', moods: ['설렘', '청량'], sound: '신스', place: '도시', ost: 'Drive It Like You Stole It' },
      { title: '위플래쉬', kind: 'jazz', src: 'posters/whiplash.jpg', genre: '음악', moods: ['긴장'], sound: '재즈', place: '도시', ost: 'Whiplash' },
      { title: '노팅 힐', kind: 'neon', src: 'posters/notting-hill.jpg', genre: '로맨스', moods: ['설렘', '포근함'], sound: '팝', place: '도시', ost: 'She' },
      { title: '미드나잇 인 파리', kind: 'jazz', src: 'posters/midnight-in-paris.jpg', genre: '로맨스', moods: ['아련함', '설렘'], sound: '재즈', place: '도시', ost: 'Si Tu Vois Ma Mère' },
      { title: '비포 선라이즈', kind: 'jazz', src: 'posters/before-sunrise.jpg', genre: '로맨스', moods: ['설렘', '아련함'], sound: '어쿠스틱', place: '도시', ost: 'Come Here' },
      { title: '인터스텔라', kind: 'snow', src: 'posters/interstellar.jpg', genre: 'SF', moods: ['경이', '그리움'], sound: '오케스트라', place: '자연', ost: 'Cornfield Chase' },
      { title: '업', kind: 'forest', src: 'posters/up.jpg', genre: '애니메이션', moods: ['아련함', '포근함'], sound: '오케스트라', place: '자연', ost: 'Married Life' },
      { title: '토이 스토리', kind: 'forest', src: 'posters/toy-story.jpg', genre: '애니메이션', moods: ['포근함', '설렘'], sound: '팝', place: '동네', ost: "You've Got a Friend in Me" },
      { title: '탑건: 매버릭', kind: 'sea', src: 'posters/top-gun-maverick.jpg', genre: '어드벤처', moods: ['긴장', '경이'], sound: '팝', place: '바다', ost: 'Hold My Hand' }
    ];
    const W = ALL;
    const { picked, sounds: pref } = this.state;
    const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

    const watched = W.map((m, i) => {
      const on = picked.includes(i);
      return {
        ...m,
        pressed: on ? 'true' : 'false',
        aria: `${m.title} ${on ? '선택 해제' : '선택'}`,
        toggle: () => this.setState({ picked: toggleIn(this.state.picked, i) }),
        style: `position: relative; display: block; width: 100%; padding: 4px; border-radius: 14px; border: 2px solid ${on ? accent : 'transparent'}; background: transparent; cursor: pointer; opacity: ${on ? 1 : 0.55}`,
        badge: `position: absolute; top: 10px; right: 10px; width: 24px; height: 24px; border-radius: 50%; background: ${accent}; color: #16130F; font-size: 13px; font-weight: 700; display: ${on ? 'flex' : 'none'}; align-items: center; justify-content: center`
      };
    });
    const sounds = ['피아노', '재즈', '오케스트라', '어쿠스틱', '팝', '신스'].map((s) => {
      const on = pref.includes(s);
      return { label: s, pressed: on ? 'true' : 'false', toggle: () => this.setState({ sounds: toggleIn(this.state.sounds, s) }),
        style: `min-height: 44px; padding: 0 18px; border-radius: 999px; border: 1.5px solid ${on ? ink : line}; background: ${on ? ink : 'transparent'}; color: ${on ? (dark ? '#16130F' : '#F5EFE4') : fg}; font-size: 14px; font-family: inherit; cursor: pointer` };
    });

    const seen = picked.map((i) => W[i]);
    const MAX = 3 * 2 + 2 + 2 + 1.5 + 2;
    const remaining = ALL.filter((c, idx) => !picked.includes(idx));
    const scored = remaining.map((c) => {
      let best = -1, bestW = null, bestShared = null;
      for (const w of seen) {
        const sharedMoods = c.moods.filter((m) => w.moods.includes(m));
        const s = sharedMoods.length * 3 + (c.sound === w.sound ? 2 : 0) + (c.genre === w.genre ? 2 : 0) + (c.place === w.place ? 1.5 : 0);
        if (s > best) { best = s; bestW = w; bestShared = { moods: sharedMoods, sound: c.sound === w.sound, genre: c.genre === w.genre, place: c.place === w.place }; }
      }
      const bonus = pref.includes(c.sound) ? 2 : 0;
      const score = best + bonus;
      const reasons = [];
      if (bestShared) {
        bestShared.moods.forEach((m) => reasons.push({ text: `${m} 무드` }));
        if (bestShared.sound) reasons.push({ text: `${c.sound} OST` });
        if (bestShared.genre) reasons.push({ text: `같은 ${c.genre} 장르` });
        if (bestShared.place) reasons.push({ text: `${c.place} 촬영지` });
      }
      if (bonus) reasons.push({ text: `끌리는 소리 · ${c.sound}` });
      return { ...c, score, because: bestW ? `‘${bestW.title}’의 여운을 좋아했다면` : '', reasons: reasons.length ? reasons : [{ text: '새로운 결의 추천' }] };
    }).sort((a, b) => b.score - a.score).slice(0, 4);

    const recs = scored.map((r, i) => {
      const pct = Math.round(Math.min(98, 40 + (58 * r.score) / MAX));
      const rs = r.reasons.map((x) => x.text);
      return { ...r, r1: rs[0], r2: rs[1] || '', r3: rs[2] || '', has2: rs.length > 1, has3: rs.length > 2, rank: i + 1, pct, bar: `width: ${pct}%; height: 4px; border-radius: 2px; background: ${accent}` };
    });

    const moodCount = {};
    seen.forEach((w) => w.moods.forEach((m) => { moodCount[m] = (moodCount[m] || 0) + 1; }));
    const topMood = Object.keys(moodCount).sort((a, b) => moodCount[b] - moodCount[a])[0];
    const mixNames = { 아련함: '아련한 여름밤', 설렘: '두근거리는 밤 산책', 고독: '혼자 걷는 새벽', 포근함: '담요 속 겨울', 청량: '창문 연 오후', 그리움: '돌아오는 길', 나른함: '새벽 세 시', 긴장: '숨죽인 복도', 경이: '모험이 시작되는 밤' };
    const trackNames = [...seen.map((w) => w.ost), ...recs.map((r) => r.ost)].slice(0, 4);

    return {
      accent, muted,
      accentText: dark ? accent : '#7A4E0C',
      rootStyle: `width: 100%; display: flex; flex-wrap: wrap; gap: 28px; align-items: stretch; color: ${fg}; font-family: 'IBM Plex Sans KR', sans-serif`,
      resultCol: `flex: 1 1 460px; min-width: 0; box-sizing: border-box; padding: 28px; border-radius: 28px; background: #14120E; color: #F3EBDD; border: 1px solid #2E281F; display: flex; flex-direction: column; gap: 16px`,
      howBox: `padding: 18px 20px; border-radius: 18px; background: ${soft}; border: 1px solid ${line}`,
      pickedCount: picked.length,
      watched, sounds,
      empty: picked.length === 0 || remaining.length === 0,
      hasRecs: picked.length > 0 && remaining.length > 0,
      remainCount: remaining.length,
      emptyText: remaining.length === 0 ? '목록의 영화를 모두 보셨네요!\n새 크레딧이 쌓이면 다음 추천을 찾아 드릴게요.' : '왼쪽에서 본 영화를 한 편 이상 골라 주세요.\n그날의 여운과 닮은 영화를 찾아 드릴게요.',
      recs,
      mixName: `${mixNames[topMood] || '여운'} 믹스`,
      tracks: trackNames.map((n, i) => ({ no: String(i + 1).padStart(2, '0'), name: n }))
    };
  }
}
Comp_Recommender.defaults = {"accent": "#E9B04A", "mode": "dark"};
Comp_Recommender.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      h("div", {"style": "flex: 1 1 440px; min-width: 0; display: flex; flex-direction: column; gap: 28px"},
        h("div", {},
          h("div", {"style": "display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap"},
            h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.accentText ?? "")},
              "STEP 1 · 내가 본 영화"),
            h("div", {"style": "font-size: 13px; color: "+(v.muted ?? "")},
              (v.pickedCount ?? ""),
              "편 선택 · 여러 편 고를수록 정확해져요")),
          h("div", {"role": "group", "aria-label": "내가 본 영화 선택", "class": "rc-grid", "style": "margin-top: 14px; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px"},
            (v.watched || []).map((w, $i_w) => [h("button", {"onClick": w?.toggle, "aria-pressed": w?.pressed, "aria-label": w?.aria, "style": w?.style},
                h("span", {"style": "display: block; border-radius: 10px; overflow: hidden"},
                  h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": w?.kind, "label": w?.title, "src": w?.src, "h": "148px"}))),
                h("span", {"style": w?.badge, "aria-hidden": "true"},
                  "✓"))]))),
        h("div", {},
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.accentText ?? "")},
            "STEP 2 · 오늘 끌리는 소리 ",
            h("span", {"style": "color: "+(v.muted ?? "")},
              "(선택)")),
          h("div", {"role": "group", "aria-label": "끌리는 소리 선택", "style": "margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px"},
            (v.sounds || []).map((s, $i_s) => [h("button", {"onClick": s?.toggle, "aria-pressed": s?.pressed, "style": s?.style},
                (s?.label ?? ""))]))),
        h("div", {"style": v.howBox},
          h("div", {"style": "font-size: 13px; font-weight: 600"},
            "추천은 이렇게 계산돼요"),
          h("p", {"style": "margin: 8px 0 0; font-size: 13px; line-height: 1.75; color: "+(v.muted ?? "")},
            "고른 영화와 후보 영화의 무드(×3), OST 스타일(×2), 장르(×2), 촬영지 풍경(×1.5)이 얼마나 겹치는지 점수를 매기고, 끌리는 소리를 고르면 가산점을 더해요. 실제 서비스에서는 여기에 30초 보이스 감상평의 단어와 톤도 함께 반영됩니다."))),
      h("div", {"style": v.resultCol},
        h("div", {"style": "display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap"},
          h("div", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 24px"},
            "당신의 여운과 닮은 다음 영화"),
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #B8AE9C"},
            "안 본 ",
            (v.remainCount ?? ""),
            "편 중에서 · 예시")),
        (v.empty) ? [h("div", {"style": "padding: 40px 20px; border-radius: 18px; border: 1px dashed #3A3328; text-align: center; color: #B8AE9C; font-size: 15px; line-height: 1.7; white-space: pre-line"},
            (v.emptyText ?? ""))] : null,
        (v.hasRecs) ? [h("ol", {"style": "margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 12px"},
            (v.recs || []).map((r, $i_r) => [h("li", {"style": "display: flex; gap: 16px; padding: 14px; border-radius: 18px; background: #1B1812; align-items: stretch"},
                h("div", {"style": "flex: none; width: 78px; border-radius: 10px; overflow: hidden"},
                  h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": r?.kind, "label": r?.title, "src": r?.src, "bare": true, "h": "112px"}))),
                h("div", {"style": "flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; gap: 8px"},
                  h("div", {"style": "display: flex; justify-content: space-between; gap: 10px; align-items: baseline"},
                    h("span", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 18px"},
                      (r?.rank ?? ""),
                      ". ",
                      (r?.title ?? "")),
                    h("span", {"style": "flex: none; font-family: 'IBM Plex Mono', monospace; font-size: 13px; color: "+(v.accent ?? "")},
                      (r?.pct ?? ""),
                      "%")),
                  h("div", {"style": "height: 4px; border-radius: 2px; background: #3A3328"},
                    h("div", {"style": r?.bar})),
                  h("div", {"style": "font-size: 12px; color: #B8AE9C"},
                    (r?.because ?? "")),
                  h("div", {"style": "display: flex; flex-wrap: wrap; gap: 6px"},
                    h("span", {"style": "padding: 4px 10px; border-radius: 999px; background: #2A251D; font-size: 12px; color: #E3D8C4"},
                      (r?.r1 ?? "")),
                    (r?.has2) ? [h("span", {"style": "padding: 4px 10px; border-radius: 999px; background: #2A251D; font-size: 12px; color: #E3D8C4"},
                        (r?.r2 ?? ""))] : null,
                    (r?.has3) ? [h("span", {"style": "padding: 4px 10px; border-radius: 999px; background: #2A251D; font-size: 12px; color: #E3D8C4"},
                        (r?.r3 ?? ""))] : null)))])), h("div", {"style": "padding: 18px; border-radius: 18px; background: "+(v.accent ?? "")+"; color: #16130F"},
            h("div", {"style": "display: flex; justify-content: space-between; align-items: baseline; gap: 10px; flex-wrap: wrap"},
              h("span", {"style": "font-weight: 700; font-size: 16px"},
                "‘",
                (v.mixName ?? ""),
                "’ 플레이리스트"),
              h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px"},
                "12곡 · 약 46분")),
            h("ol", {"style": "margin: 12px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(180px, 100%), 1fr)); gap: 6px 16px; font-size: 13px"},
              (v.tracks || []).map((k, $i_k) => [h("li", {"style": "display: flex; gap: 8px"},
                  h("span", {"style": "font-family: 'IBM Plex Mono', monospace; opacity: 0.7"},
                    (k?.no ?? "")),
                  h("span", {},
                    (k?.name ?? "")))]),
              h("li", {"style": "opacity: 0.75"},
                "+ 8곡 더")))] : null));
};

/* ── Pricing ── */
class Comp_Pricing extends SC.DCLogic {
  constructor(props) {
    super(props);
    this.state = { yearly: false };
  }
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const dark = (this.props.mode ?? 'dark') === 'dark';
    const yearly = this.state.yearly;
    const fg = dark ? '#F3EBDD' : '#16130F';
    const muted = dark ? '#CFC5B3' : '#3A352C';
    const pill = (on) => `min-height: 40px; padding: 0 16px; border-radius: 999px; border: none; background: ${on ? accent : 'transparent'}; color: ${on ? '#16130F' : '#CFC5B3'}; font-size: 14px; font-weight: 600; font-family: inherit; cursor: pointer`;
    const features = [
      { title: '시네마 링 또는 티켓 태그 1개', sub: '가입 시 원하는 모델·컬러로 제공, 각인 포함' },
      { title: '무제한 크레딧 기록', sub: '포스터·날씨·좌석·OST·촬영지를 클라우드에 보관' },
      { title: '30초 보이스 감상평', sub: '육성 원본 + 자동 텍스트 변환' },
      { title: 'OST · 촬영지 연동', sub: '대표곡 재생과 명장면 촬영지 지도' },
      { title: '취향 추천 & 월간 플레이리스트', sub: '매달 12곡, 내 여운과 닮은 다음 영화' },
      { title: '상영 모드', sub: '어두운 상영관에 맞춘 앱 화면·알림 차단' },
      { title: '연말 시네마 리포트', sub: '한 해의 관람 기록을 한 장의 크레딧으로' },
      { title: '크레딧 내보내기', sub: '언제든 이미지·PDF로 저장 (해지 후에도)' }
    ];
    const perks = [
      { title: '첫 달 무료', sub: '정식 출시 후 첫 1개월 멤버십 요금을 받지 않아요.' },
      { title: '각인 무료 업그레이드', sub: '링 안쪽·태그 앞면에 최대 12자까지 새겨 드려요.' },
      { title: '프리미어 넘버 각인', sub: '선착순 1,000명에게 No.0001–1000 고유 번호를 새겨 드려요.' },
      { title: '한정 컬러 우선 배송', sub: '앰버 골드 초도 물량을 신청 순서대로 먼저 보내 드려요.' }
    ].map((p, i) => ({ ...p, no: i + 1, style: `display: flex; gap: 14px; align-items: flex-start; padding: 16px; border-radius: 16px; background: ${dark ? '#1B1812' : '#FFFFFF'}; border: 1px solid ${dark ? '#2E281F' : '#E3D8C4'}` }));
    return {
      accent, muted,
      accentText: dark ? accent : '#7A4E0C',
      rootStyle: `width: 100%; display: flex; flex-wrap: wrap; gap: 24px; align-items: stretch; color: ${fg}; font-family: 'IBM Plex Sans KR', sans-serif`,
      earlyStyle: `flex: 1 1 340px; min-width: 0; box-sizing: border-box; padding: 32px; border-radius: 30px; background: ${dark ? '#0F0D0A' : '#EDE4D4'}; border: 1px solid ${dark ? '#2E281F' : '#DCCFB7'}`,
      setMonthly: () => this.setState({ yearly: false }),
      setYearly: () => this.setState({ yearly: true }),
      monthlyPressed: yearly ? 'false' : 'true',
      yearlyPressed: yearly ? 'true' : 'false',
      monthlyBtn: pill(!yearly),
      yearlyBtn: pill(yearly),
      price: yearly ? '100,000원' : '10,000원',
      per: yearly ? '/ 년' : '/ 월',
      priceNote: yearly ? '12개월을 10개월 요금으로 · 월 약 8,333원 꼴 (부가세 포함)' : '부가세 포함 · 언제든 해지할 수 있어요',
      features, perks
    };
  }
}
Comp_Pricing.defaults = {"accent": "#E9B04A", "mode": "dark"};
Comp_Pricing.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      h("article", {"style": "flex: 1.3 1 460px; min-width: 0; box-sizing: border-box; padding: 36px; border-radius: 30px; background: #14120E; color: #F3EBDD; border: 1px solid "+(v.accent ?? "")+"; position: relative; overflow: hidden"},
        h("div", {"style": "position: absolute; right: -60px; top: -60px; width: 220px; height: 220px; border-radius: 50%; border: 26px solid "+(v.accent ?? "")+"; opacity: 0.14", "aria-hidden": "true"}),
        h("div", {"style": "display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 14px"},
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.accent ?? "")},
            "SOUNDTRACK CREDIT MEMBERSHIP"),
          h("div", {"role": "group", "aria-label": "결제 주기", "style": "display: flex; gap: 4px; padding: 4px; border-radius: 999px; background: #0A0907; border: 1px solid #2E281F"},
            h("button", {"onClick": v.setMonthly, "aria-pressed": v.monthlyPressed, "style": v.monthlyBtn},
              "월간"),
            h("button", {"onClick": v.setYearly, "aria-pressed": v.yearlyPressed, "style": v.yearlyBtn},
              "연간 ",
              h("span", {"style": "font-size: 11px; opacity: 0.85"},
                "2개월 무료")))),
        h("div", {"style": "margin-top: 26px; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap"},
          h("span", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 60px; line-height: 1"},
            (v.price ?? "")),
          h("span", {"style": "font-size: 17px; color: #CFC5B3"},
            (v.per ?? ""))),
        h("p", {"style": "margin: 10px 0 0; font-size: 14px; color: #B8AE9C"},
          (v.priceNote ?? "")),
        h("ul", {"style": "margin: 28px 0 0; padding: 0; list-style: none; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr)); gap: 14px 24px; font-size: 15px"},
          (v.features || []).map((f, $i_f) => [h("li", {"style": "display: flex; gap: 12px; align-items: flex-start"},
              h("span", {"style": "flex: none; width: 22px; height: 22px; margin-top: 1px; border-radius: 50%; background: "+(v.accent ?? "")+"; display: flex; align-items: center; justify-content: center", "aria-hidden": "true"},
                h("svg", {"width": "11", "height": "11", "viewBox": "0 0 12 12"},
                  h("path", {"d": "M2 6.2 4.8 9 10 3", "fill": "none", "stroke": "#16130F", "stroke-width": "1.8"}))),
              h("span", {},
                h("span", {"style": "display: block; font-weight: 600"},
                  (f?.title ?? "")),
                h("span", {"style": "display: block; margin-top: 2px; font-size: 13px; color: #B8AE9C; line-height: 1.6"},
                  (f?.sub ?? ""))))])),
        h("div", {"style": "margin-top: 30px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center"},
          h("a", {"href": "#join", "style": "display: inline-flex; align-items: center; min-height: 54px; padding: 0 28px; border-radius: 999px; background: "+(v.accent ?? "")+"; color: #16130F; text-decoration: none; font-weight: 700"},
            "사전 알림 신청하고 혜택 받기"),
          h("span", {"style": "font-size: 13px; color: #B8AE9C"},
            "언제든 해지 · 해지해도 크레딧은 내보내기 가능"))),
      h("aside", {"style": v.earlyStyle},
        h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.accentText ?? "")},
          "EARLY BIRD · 사전 알림 신청자 혜택"),
        h("h3", {"style": "margin: 12px 0 0; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 26px; line-height: 1.35"},
          "먼저 신청한 관객에게",
          h("br", {}),
          "먼저 드리는 크레딧"),
        h("ol", {"style": "margin: 24px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 14px"},
          (v.perks || []).map((p, $i_p) => [h("li", {"style": p?.style},
              h("span", {"style": "flex: none; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 22px; color: "+(v.accentText ?? "")+"; width: 28px"},
                (p?.no ?? "")),
              h("span", {},
                h("span", {"style": "display: block; font-weight: 700; font-size: 16px"},
                  (p?.title ?? "")),
                h("span", {"style": "display: block; margin-top: 4px; font-size: 13px; line-height: 1.6; color: "+(v.muted ?? "")},
                  (p?.sub ?? ""))))])),
        h("p", {"style": "margin: 20px 0 0; font-size: 12px; line-height: 1.6; color: "+(v.muted ?? "")},
          "혜택은 정식 출시 후 첫 결제 시 적용됩니다. 세부 조건은 출시 공지에서 안내드려요.")));
};

/* ── ModeSpec ── */
class Comp_ModeSpec extends SC.DCLogic {
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const dark = (this.props.mode ?? 'dark') === 'dark';
    const fg = dark ? '#F3EBDD' : '#16130F';
    const muted = dark ? '#CFC5B3' : '#3A352C';
    const line = dark ? '#2E281F' : '#E3D8C4';
    const card = dark ? '#14120E' : '#FFFFFF';
    const rows = [
      { k: '화면 밝기', a: '최저 밝기로 고정, 밝기 조절 잠금', b: '기기 설정을 따름' },
      { k: '색 온도', a: '앰버 톤 필터로 푸른빛 최소화', b: '기본 색상' },
      { k: '알림 · 진동', a: '모든 알림·진동·소리 차단', b: '평소대로' },
      { k: '녹음 · 카메라', a: '상영 중 잠금, 엔딩 크레딧 시작 후 녹음만 열림', b: '모든 기능 사용' },
      { k: '전환 방식', a: '예매 시간과 극장 위치로 자동 전환, 수동 전환 가능', b: '상영 종료 후 자동 복귀' },
      { k: '조작', a: '큰 버튼 하나만 남긴 최소 화면', b: '전체 메뉴' }
    ];
    const dot = `flex: none; width: 7px; height: 7px; margin-top: 8px; border-radius: 50%; background: ${accent}`;
    return {
      accent, muted, line, card,
      accentText: dark ? accent : '#7A4E0C',
      rootStyle: `width: 100%; display: flex; flex-direction: column; gap: 44px; color: ${fg}; font-family: 'IBM Plex Sans KR', sans-serif`,
      rows, dot
    };
  }
}
Comp_ModeSpec.defaults = {"accent": "#E9B04A", "mode": "dark"};
Comp_ModeSpec.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      h("div", {"style": "display: flex; flex-wrap: wrap; gap: 28px; align-items: stretch"},
        h("div", {"style": "flex: 0 1 420px; min-width: 0; margin: 0 auto; display: flex; gap: 18px; justify-content: center"},
          h("figure", {"style": "margin: 0; flex: 1 1 0; max-width: 200px"},
            h("div", {"style": "height: 400px; border-radius: 34px; border: 7px solid #2A251D; background: #050403; padding: 22px 14px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; color: #C9965A"},
              h("div", {"style": "display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em"},
                h("span", {},
                  "상영 모드"),
                h("span", {},
                  "알림 꺼짐")),
              h("div", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 15px; color: #B8875A"},
                "라라랜드"),
              h("div", {"style": "font-size: 10px; color: #8A6A44"},
                "3관 F11 · 19:40 상영 중"),
              h("div", {"style": "flex: 1 1 auto; display: flex; align-items: center; justify-content: center"},
                h("div", {"style": "width: 92px; height: 92px; border-radius: 50%; border: 1.5px dashed #5A4430; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 10px; line-height: 1.5; color: #8A6A44"},
                  "기록 잠금",
                  h("br", {}),
                  "크레딧 후 열림")),
              h("div", {"style": "padding: 10px; border-radius: 12px; background: #120E0A; font-size: 10px; text-align: center; color: #8A6A44"},
                "엔딩 크레딧이 시작되면 진동 없이 알려 드려요")),
            h("figcaption", {"style": "margin-top: 12px; text-align: center; font-size: 13px; font-weight: 600"},
              "상영 모드")),
          h("figure", {"style": "margin: 0; flex: 1 1 0; max-width: 200px"},
            h("div", {"style": "height: 400px; border-radius: 34px; border: 7px solid #D9CCB3; background: #FBF8F2; padding: 22px 14px; box-sizing: border-box; display: flex; flex-direction: column; gap: 12px; color: #16130F"},
              h("div", {"style": "display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: 0.1em; color: #5C554A"},
                h("span", {},
                  "라이트 모드"),
                h("span", {},
                  "21:58")),
              h("div", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 15px"},
                "라라랜드"),
              h("div", {"style": "font-size: 10px; color: #5C554A"},
                "상영 종료 · 여운을 남겨 보세요"),
              h("div", {"style": "flex: 1 1 auto; display: flex; align-items: center; justify-content: center"},
                h("div", {"style": "width: 92px; height: 92px; border-radius: 50%; border: 2px solid "+(v.accent ?? "")+"; display: flex; align-items: center; justify-content: center"},
                  h("div", {"style": "width: 56px; height: 56px; border-radius: 50%; background: "+(v.accent ?? "")}))),
              h("div", {"style": "padding: 10px; border-radius: 12px; background: #16130F; color: #F5EFE4; font-size: 10px; text-align: center"},
                "♪ City of Stars")),
            h("figcaption", {"style": "margin-top: 12px; text-align: center; font-size: 13px; font-weight: 600"},
              "라이트 모드"))),
        h("div", {"style": "flex: 1 1 520px; min-width: 0"},
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.accentText ?? "")},
            "APP SCREEN MODES · 사양"),
          h("h3", {"style": "margin: 10px 0 18px; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 26px; line-height: 1.35"},
            "옆 사람의 몰입을 지키는 상영 모드"),
          h("div", {"style": "overflow-x: auto; border-radius: 20px; border: 1px solid "+(v.line ?? "")+"; background: "+(v.card ?? "")},
            h("table", {"style": "width: 100%; min-width: 520px; border-collapse: collapse; font-size: 14px"},
              h("thead", {},
                h("tr", {"style": "text-align: left"},
                  h("th", {"scope": "col", "style": "padding: 14px 18px; font-weight: 500; color: "+(v.muted ?? "")+"; border-bottom: 1px solid "+(v.line ?? "")+"; width: 22%"},
                    "항목"),
                  h("th", {"scope": "col", "style": "padding: 14px 18px; font-weight: 700; border-bottom: 1px solid "+(v.line ?? "")+"; background: #14120E; color: "+(v.accent ?? "")},
                    "상영 모드"),
                  h("th", {"scope": "col", "style": "padding: 14px 18px; font-weight: 700; border-bottom: 1px solid "+(v.line ?? "")},
                    "라이트 모드"))),
              h("tbody", {},
                (v.rows || []).map((r, $i_r) => [h("tr", {},
                    h("th", {"scope": "row", "style": "padding: 14px 18px; text-align: left; font-weight: 600; border-bottom: 1px solid "+(v.line ?? "")+"; vertical-align: top"},
                      (r?.k ?? "")),
                    h("td", {"style": "padding: 14px 18px; border-bottom: 1px solid "+(v.line ?? "")+"; background: #14120E; color: #E3D8C4; line-height: 1.6; vertical-align: top"},
                      (r?.a ?? "")),
                    h("td", {"style": "padding: 14px 18px; border-bottom: 1px solid "+(v.line ?? "")+"; color: "+(v.muted ?? "")+"; line-height: 1.6; vertical-align: top"},
                      (r?.b ?? "")))])))))),
      h("div", {},
        h("div", {"style": "display: flex; flex-wrap: wrap; justify-content: space-between; align-items: baseline; gap: 12px"},
          h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.accentText ?? "")},
            "SUPPORTED · 지원 범위"),
          h("div", {"style": "font-size: 13px; color: "+(v.muted ?? "")},
            "정식 출시 시점 기준 지원 예정")),
        h("div", {"style": "margin-top: 16px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr)); gap: 14px"},
          h("article", {"style": "padding: 24px; border-radius: 22px; background: "+(v.card ?? "")+"; border: 1px solid "+(v.line ?? "")},
            h("h4", {"style": "margin: 0 0 14px; font-size: 17px; font-weight: 700"},
              "티켓"),
            h("ul", {"style": "margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px"},
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "멀티플렉스 키오스크 발권 티켓"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "종이 티켓의 바코드 스캔"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "모바일 티켓"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "예매 앱의 QR·바코드 화면 또는 캡처 이미지"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "독립·예술영화관 종이 티켓"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "바코드가 있는 경우 자동 인식"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "바코드가 없는 티켓 · 해외 극장"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "영화 검색 후 직접 입력"))))),
          h("article", {"style": "padding: 24px; border-radius: 22px; background: "+(v.card ?? "")+"; border: 1px solid "+(v.line ?? "")},
            h("h4", {"style": "margin: 0 0 14px; font-size: 17px; font-weight: 700"},
              "기기"),
            h("ul", {"style": "margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px"},
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "iOS 16 이상"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "iPhone XS 이후 모델"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "Android 10 이상"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "NFC를 지원하는 스마트폰"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "링 · 태그 인식"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "스마트폰 NFC로 태그, 별도 충전 필요 없음"))))),
          h("article", {"style": "padding: 24px; border-radius: 22px; background: "+(v.card ?? "")+"; border: 1px solid "+(v.line ?? "")},
            h("h4", {"style": "margin: 0 0 14px; font-size: 17px; font-weight: 700"},
              "기록 데이터"),
            h("ul", {"style": "margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px"},
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "포스터 · 장르 · 줄거리"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "영화 정보 데이터베이스 연동"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "날씨"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "관람 시각 기준 기상 정보 자동 기록"))),
              h("li", {"style": "display: flex; gap: 10px; font-size: 14px; line-height: 1.6"},
                h("span", {"style": v.dot}),
                h("span", {},
                  h("span", {"style": "display: block"},
                    "OST · 촬영지"),
                  h("span", {"style": "display: block; font-size: 12px; color: "+(v.muted ?? "")},
                    "공개 정보 기반, 일부 작품은 제공되지 않을 수 있음"))))))));
};

/* ── Report ── */
class Comp_Report extends SC.DCLogic {
  constructor(props) {
    super(props);
    this.state = { story: false };
  }
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const dark = (this.props.mode ?? 'dark') === 'dark';
    const story = this.state.story;
    const fg = dark ? '#F3EBDD' : '#16130F';
    const muted = dark ? '#CFC5B3' : '#3A352C';
    const line = dark ? '#2E281F' : '#E3D8C4';
    const pill = (on) => `min-height: 40px; padding: 0 16px; border-radius: 999px; border: none; background: ${on ? accent : 'transparent'}; color: ${on ? '#16130F' : fg}; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer`;
    const stats = [
      { k: '가장 많이 느낀 무드', v: '아련함' },
      { k: '올해의 OST', v: 'City of Stars' },
      { k: '가장 자주 앉은 자리', v: 'G열 가운데' },
      { k: '비 오는 날 본 영화', v: '6편' },
      { k: '남긴 보이스', v: '23개 · 11분 30초' },
      { k: '가 본 촬영지', v: '3곳' }
    ];
    const counts = [1, 2, 2, 1, 3, 1, 2, 4, 2, 3, 1, 1];
    const months = counts.map((c, i) => ({ label: String(i + 1), bar: `width: 100%; max-width: 26px; height: ${(c / 4) * 84}px; border-radius: 6px 6px 2px 2px; background: ${c === 4 ? accent : '#4A4235'}` }));
    return {
      accent, muted, line,
      rootStyle: `width: 100%; display: flex; flex-wrap: wrap; gap: 28px; align-items: center; color: ${fg}; font-family: 'IBM Plex Sans KR', sans-serif`,
      pillBg: dark ? '#14120E' : '#FFFFFF',
      stats, months,
      setFeed: () => this.setState({ story: false }),
      setStory: () => this.setState({ story: true }),
      feedPressed: story ? 'false' : 'true',
      storyPressed: story ? 'true' : 'false',
      feedBtn: pill(!story),
      storyBtn: pill(story),
      posterH: story ? '480px' : '340px',
      cardStyle: `position: relative; width: 100%; max-width: ${story ? 270 : 340}px; aspect-ratio: ${story ? '9 / 16' : '1 / 1'}; border-radius: 22px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.4)`
    };
  }
}
Comp_Report.defaults = {"accent": "#E9B04A", "mode": "dark"};
Comp_Report.prototype.__tpl = function (v) {
  return h("div", {"style": v.rootStyle},
      h("article", {"style": "flex: 1.4 1 520px; min-width: 0; box-sizing: border-box; padding: 34px; border-radius: 30px; background: #0E0C09; color: #F3EBDD; border: 1px solid #2E281F"},
        h("div", {"style": "display: flex; justify-content: space-between; gap: 12px; flex-wrap: wrap; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em"},
          h("span", {"style": "color: "+(v.accent ?? "")},
            "2026 · YOUR YEAR IN CREDITS"),
          h("span", {"style": "color: #B8AE9C"},
            "예시 리포트")),
        h("h3", {"style": "margin: 14px 0 0; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: clamp(26px, 3vw, 34px); line-height: 1.3"},
          "올해 당신은 23편의 영화와",
          h("br", {}),
          "23번의 여운을 남겼어요"),
        h("div", {"style": "margin-top: 26px; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr)); gap: 12px"},
          (v.stats || []).map((s, $i_s) => [h("div", {"style": "padding: 16px; border-radius: 16px; background: #1B1812"},
              h("div", {"style": "font-size: 12px; color: #B8AE9C"},
                (s?.k ?? "")),
              h("div", {"style": "margin-top: 6px; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 20px; line-height: 1.3"},
                (s?.v ?? "")))])),
        h("div", {"style": "margin-top: 26px"},
          h("div", {"style": "font-size: 13px; color: #B8AE9C"},
            "월별 관람"),
          h("div", {"style": "margin-top: 12px; display: flex; align-items: flex-end; gap: 6px; height: 110px", "role": "img", "aria-label": "월별 관람 편수: 1월 1편, 2월 2편, 3월 2편, 4월 1편, 5월 3편, 6월 1편, 7월 2편, 8월 4편, 9월 2편, 10월 3편, 11월 1편, 12월 1편"},
            (v.months || []).map((m, $i_m) => [h("div", {"style": "flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end"},
                h("div", {"style": m?.bar}),
                h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 10px; color: #8F8676"},
                  (m?.label ?? "")))])))),
      h("aside", {"style": "flex: 1 1 320px; min-width: 0; display: flex; flex-direction: column; gap: 16px; align-items: center"},
        h("div", {"role": "group", "aria-label": "공유 카드 비율", "style": "display: flex; gap: 4px; padding: 4px; border-radius: 999px; background: "+(v.pillBg ?? "")+"; border: 1px solid "+(v.line ?? "")},
          h("button", {"onClick": v.setFeed, "aria-pressed": v.feedPressed, "style": v.feedBtn},
            "피드 1:1"),
          h("button", {"onClick": v.setStory, "aria-pressed": v.storyPressed, "style": v.storyBtn},
            "스토리 9:16")),
        h("div", {"style": v.cardStyle},
          h("div", {"style": "position: absolute; inset: 0", "aria-hidden": "true"},
            h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": "jazz", "label": "라라랜드", "src": "posters/la-la-land.jpg", "h": v.posterH}))),
          h("div", {"style": "position: absolute; inset: 0; background: linear-gradient(rgba(10,9,7,0.15), rgba(10,9,7,0.92) 62%)"}),
          h("div", {"style": "position: relative; height: 100%; box-sizing: border-box; padding: 22px; display: flex; flex-direction: column; justify-content: flex-end; color: #F3EBDD"},
            h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: "+(v.accent ?? "")},
              "MY CREDIT · 2026.09.27"),
            h("div", {"style": "margin-top: 8px; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 22px; line-height: 1.3"},
              "“마지막 5분, 둘의 눈빛만으로",
              h("br", {}),
              "다 설명됐다.”"),
            h("div", {"style": "margin-top: 10px; font-size: 11px; color: #CFC5B3"},
              "라라랜드 · 3관 F11 · 맑음 21° · ♪ City of Stars"),
            h("div", {"style": "margin-top: 12px; display: flex; flex-wrap: wrap; gap: 4px 8px; font-size: 10px; color: "+(v.accent ?? "")},
              "#시네필기록 #영화OST여운 #영화촬영지성지순례 #디지털티켓북 #나만의영화관"),
            h("div", {"style": "margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(243,235,221,0.2); font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 12px"},
              "Soundtrack Credit"))),
        h("p", {"style": "margin: 0; max-width: 320px; text-align: center; font-size: 13px; line-height: 1.6; color: "+(v.muted ?? "")},
          "크레딧 한 장을 SNS용 카드로 바로 만들어요. 감상평 한 줄과 해시태그가 자동으로 들어갑니다.")));
};

/* ── Main ── */
class Comp_Main extends SC.DCLogic {
  constructor(props) {
    super(props);
    this.state = { mode: null, cur: 0, playing: false, t: 0, step: 0, tab: '전체', picked: 0, summary: '시네마 링 · 앰버 골드 · M', openFaq: 0, menu: false, bgm: false };
    this.timer = null;
    this.bgm = null;
  }
  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
    this.killBgm();
  }
  // BGM: 브라우저에서 실시간 합성하는 오리지널 앰비언트 (외부 음원 없음)
  startBgm(dark) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = new AC();
    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0, now);
    master.gain.linearRampToValueAtTime(0.26, now + 2.5);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(dark ? 900 : 2200, now);
    filter.Q.value = 0.6;
    const delay = ctx.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const fb = ctx.createGain(); fb.gain.value = 0.35;
    const wet = ctx.createGain(); wet.gain.value = 0.4;
    delay.connect(fb); fb.connect(delay); delay.connect(wet); wet.connect(master);
    filter.connect(master);
    master.connect(ctx.destination);
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const chords = [[48, 52, 55, 59, 62], [45, 48, 52, 55, 59], [41, 45, 48, 52, 55], [43, 50, 52, 57]];
    let ci = 0;
    const playChord = (t) => {
      const notes = chords[ci % chords.length]; ci += 1;
      notes.forEach((m, i) => {
        ['triangle', 'sawtooth'].forEach((type, j) => {
          const o = ctx.createOscillator();
          o.type = type; o.frequency.value = mtof(m); o.detune.value = j ? 6 : -4;
          const g = ctx.createGain();
          const peak = (j ? 0.018 : 0.05) / (1 + i * 0.15);
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(peak, t + 2.2);
          g.gain.setValueAtTime(peak, t + 6.5);
          g.gain.linearRampToValueAtTime(0, t + 9.5);
          o.connect(g); g.connect(filter);
          o.start(t); o.stop(t + 9.6);
        });
      });
    };
    const scale = [72, 74, 76, 79, 81, 84];
    const bell = (t) => {
      const o = ctx.createOscillator();
      o.type = 'sine'; o.frequency.value = mtof(scale[Math.floor(Math.random() * scale.length)]);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.04, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      o.connect(g); g.connect(master); g.connect(delay);
      o.start(t); o.stop(t + 1.9);
    };
    let next = now + 0.1;
    playChord(next); next += 8;
    const tick = setInterval(() => {
      if (ctx.currentTime > next - 1) { playChord(next); next += 8; }
      if (Math.random() < 0.45) bell(ctx.currentTime + 0.05 + Math.random() * 0.3);
    }, 700);
    this.bgm = { ctx, master, filter, tick };
    return true;
  }
  stopBgm() {
    const b = this.bgm;
    if (!b) return;
    this.bgm = null;
    clearInterval(b.tick);
    const t = b.ctx.currentTime;
    b.master.gain.cancelScheduledValues(t);
    b.master.gain.setValueAtTime(b.master.gain.value, t);
    b.master.gain.linearRampToValueAtTime(0, t + 1.2);
    setTimeout(() => { try { b.ctx.close(); } catch (e) {} }, 1400);
  }
  killBgm() {
    const b = this.bgm;
    if (!b) return;
    this.bgm = null;
    clearInterval(b.tick);
    try { b.ctx.close(); } catch (e) {}
  }
  renderVals() {
    const accent = this.props.accent ?? '#E9B04A';
    const mode = this.state.mode ?? (this.props.startMode ?? 'dark');
    const dark = mode === 'dark';
    const { cur, playing, t, step, tab, picked } = this.state;
    const T = dark
      ? { bg: '#0A0907', fg: '#F3EBDD', muted: '#CFC5B3', card: '#14120E', soft: '#1E1B16', line: '#2E281F', band: '#0F0D0A', accentText: accent, hl: '#1B1812', inv: '#F3EBDD', invFg: '#16130F', invTrack: '#DCCFB7', ticket: '#FBF6EC', ticketLine: '#FBF6EC', posterShadow: '0 50px 100px rgba(0,0,0,0.7)' }
      : { bg: '#F5EFE4', fg: '#16130F', muted: '#3A352C', card: '#FFFFFF', soft: '#F5EFE4', line: '#E3D8C4', band: '#EDE4D4', accentText: '#7A4E0C', hl: '#FBF6EC', inv: '#16130F', invFg: '#F3EBDD', invTrack: '#3A3328', ticket: '#FFFFFF', ticketLine: '#DCCFB7', posterShadow: '0 40px 80px rgba(60,40,10,0.25)' };
    const TRACK = 214;
    const movies = [
      { title: '라라랜드', kind: 'jazz', src: 'posters/la-la-land.jpg', cat: '음악', genre: '뮤지컬 · 로맨스', mood: '꿈결 같은 아련함', date: '2026.09.27', seatOnly: 'F11', weather: '맑음 21°', seat: 'F11 · 맑음', ost: 'City of Stars', ostShort: 'City of Stars', place: 'LA 그리피스 파크 전망대 길', voice: '마지막 5분, 둘의 눈빛만으로 다 설명됐다.' },
      { title: '비긴 어게인', kind: 'neon', src: 'posters/begin-again.jpg', cat: '음악', genre: '음악 · 드라마', mood: '다시 시작하는 설렘', date: '2026.08.14', seatOnly: 'E07', weather: '비 24°', seat: 'E07 · 비', ost: 'Lost Stars', ostShort: 'Lost Stars', place: '뉴욕 맨해튼 거리와 옥상', voice: '이어폰 하나 나눠 끼고 밤거리를 걷고 싶어졌다.' },
      { title: '어바웃 타임', kind: 'sea', src: 'posters/about-time.jpg', cat: '로맨스', genre: '로맨스 · 판타지', mood: '포근한 행복', date: '2026.06.02', seatOnly: 'H09', weather: '흐림 19°', seat: 'H09 · 흐림', ost: 'How Long Will I Love You', ostShort: 'How Long Will I Love You', place: '영국 콘월 해변', voice: '평범한 오늘을 한 번 더 살아 보고 싶어졌다.' },
      { title: '트루먼 쇼', kind: 'sea', src: 'posters/truman-show.jpg', cat: '드라마', genre: '드라마 · SF', mood: '벅찬 해방감', date: '2026.04.15', seatOnly: 'G12', weather: '맑음 16°', seat: 'G12 · 맑음', ost: 'Truman Sleeps', ostShort: 'Truman Sleeps', place: '미국 플로리다 시사이드', voice: '문을 열고 나가는 뒷모습에서 숨이 멎었다.' },
      { title: '쥬라기 월드', kind: 'forest', src: 'posters/jurassic-world.jpg', cat: '어드벤처', genre: '액션 · 어드벤처', mood: '숨 막히는 경이', date: '2026.03.08', seatOnly: 'J14', weather: '황사 12°', seat: 'J14 · 황사', ost: 'Welcome to Jurassic World', ostShort: 'Welcome to Jurassic World', place: '하와이 카우아이 · 오아후', voice: '테마곡이 흐르자 어린 시절로 돌아갔다.' },
      { title: '원스', kind: 'jazz', src: 'posters/once.jpg', cat: '음악', genre: '음악 · 로맨스', mood: '서툰 고백의 아련함', date: '2026.02.14', seatOnly: 'D06', weather: '눈 -1°', seat: 'D06 · 눈', ost: 'Falling Slowly', ostShort: 'Falling Slowly', place: '아일랜드 더블린 그래프턴 스트리트', voice: '피아노 가게 장면에서 같이 숨을 참았다.' },
      { title: '싱 스트리트', kind: 'neon', src: 'posters/sing-street.jpg', cat: '음악', genre: '음악 · 성장', mood: '청춘의 설렘', date: '2026.01.24', seatOnly: 'G05', weather: '맑음 2°', seat: 'G05 · 맑음', ost: 'Drive It Like You Stole It', ostShort: 'Drive It Like You Stole It', place: '아일랜드 더블린', voice: '극장을 나오자마자 밴드를 하고 싶어졌다.' },
      { title: '위플래쉬', kind: 'jazz', src: 'posters/whiplash.jpg', cat: '음악', genre: '음악 · 드라마', mood: '숨 막히는 긴장', date: '2025.12.06', seatOnly: 'E10', weather: '흐림 3°', seat: 'E10 · 흐림', ost: 'Whiplash', ostShort: 'Whiplash', place: '미국 로스앤젤레스 (극 중 뉴욕)', voice: '마지막 9분 동안 손에 땀이 멈추지 않았다.' },
      { title: '노팅 힐', kind: 'neon', src: 'posters/notting-hill.jpg', cat: '로맨스', genre: '로맨스 · 코미디', mood: '수줍은 설렘', date: '2025.11.15', seatOnly: 'H07', weather: '비 11°', seat: 'H07 · 비', ost: 'She', ostShort: 'She', place: '영국 런던 포토벨로 로드', voice: '서점 문 종소리가 계속 귀에 맴돈다.' },
      { title: '미드나잇 인 파리', kind: 'jazz', src: 'posters/midnight-in-paris.jpg', cat: '로맨스', genre: '로맨스 · 판타지', mood: '낭만의 향수', date: '2025.10.31', seatOnly: 'F09', weather: '비 14°', seat: 'F09 · 비', ost: 'Si Tu Vois Ma Mère', ostShort: 'Si Tu Vois Ma Mère', place: '파리 생테티엔뒤몽 성당 계단', voice: '비 오는 파리를 걷는 상상만으로 행복했다.' },
      { title: '비포 선라이즈', kind: 'jazz', src: 'posters/before-sunrise.jpg', cat: '로맨스', genre: '로맨스 · 드라마', mood: '하룻밤의 설렘', date: '2025.09.20', seatOnly: 'G08', weather: '맑음 22°', seat: 'G08 · 맑음', ost: 'Come Here', ostShort: 'Come Here', place: '오스트리아 빈 프라터 대관람차', voice: '음반 가게의 그 침묵이 대사보다 컸다.' },
      { title: '인터스텔라', kind: 'snow', src: 'posters/interstellar.jpg', cat: 'SF', genre: 'SF · 드라마', mood: '광활한 경이', date: '2025.08.30', seatOnly: 'I13', weather: '맑음 29°', seat: 'I13 · 맑음', ost: 'Cornfield Chase', ostShort: 'Cornfield Chase', place: '아이슬란드 스비나펠스요쿨 빙하', voice: '오르간 소리에 몸이 의자에 붙어 버렸다.' },
      { title: '업', kind: 'forest', src: 'posters/up.jpg', cat: '애니메이션', genre: '애니메이션 · 모험', mood: '눈물 나는 포근함', date: '2025.07.19', seatOnly: 'E04', weather: '소나기 27°', seat: 'E04 · 소나기', ost: 'Married Life', ostShort: 'Married Life', place: '가상의 파라다이스 폭포', voice: '첫 10분 만에 울 줄은 몰랐다.' },
      { title: '토이 스토리', kind: 'forest', src: 'posters/toy-story.jpg', cat: '애니메이션', genre: '애니메이션 · 가족', mood: '어린 시절의 포근함', date: '2025.06.07', seatOnly: 'C03', weather: '맑음 25°', seat: 'C03 · 맑음', ost: "You've Got a Friend in Me", ostShort: "You've Got a Friend in Me", place: '앤디의 방 (애니메이션)', voice: '집에 가서 오래된 장난감 상자를 열어 봤다.' },
      { title: '탑건: 매버릭', kind: 'sea', src: 'posters/top-gun-maverick.jpg', cat: '어드벤처', genre: '액션 · 드라마', mood: '심장 뛰는 벅참', date: '2025.05.24', seatOnly: 'K15', weather: '맑음 24°', seat: 'K15 · 맑음', ost: 'Hold My Hand', ostShort: 'Hold My Hand', place: '미국 샌디에이고 노스아일랜드 해군기지', voice: '엔딩 크레딧까지 박수 치고 싶었다.' }
    ];
    const stop = () => { if (this.timer) { clearInterval(this.timer); this.timer = null; } };
    const togglePlay = () => {
      if (this.state.playing) { stop(); this.setState({ playing: false }); return; }
      this.setState({ playing: true });
      this.timer = setInterval(() => {
        const n = this.state.t + 1;
        if (n >= TRACK) { stop(); this.setState({ t: 0, playing: false }); } else { this.setState({ t: n }); }
      }, 1000);
    };
    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    const thumbs = movies.slice(0, 5).map((m, i) => {
      const on = i === cur;
      return { title: m.title, kind: m.kind, src: m.src, pressed: on ? 'true' : 'false',
        pick: () => { stop(); this.setState({ cur: i, t: 0, playing: false }); },
        style: `display: block; width: 100%; padding: 4px; border-radius: 14px; border: 2px solid ${on ? accent : 'transparent'}; background: transparent; cursor: pointer; opacity: ${on ? 1 : 0.6}` };
    });
    const setMode = (m) => {
      if (this.bgm) {
        const f = this.bgm.filter.frequency;
        const t0 = this.bgm.ctx.currentTime;
        f.cancelScheduledValues(t0);
        f.setValueAtTime(f.value, t0);
        f.linearRampToValueAtTime(m === 'dark' ? 900 : 2200, t0 + 1.5);
      }
      this.setState({ mode: m });
    };
    const bgmOn = this.state.bgm;
    const toggleBgm = () => {
      if (this.state.bgm) { this.stopBgm(); this.setState({ bgm: false }); return; }
      if (this.startBgm(dark)) this.setState({ bgm: true });
    };
    const pillBtn = (on) => `min-height: 40px; padding: 0 14px; border-radius: 999px; border: none; background: ${on ? (dark ? accent : '#16130F') : 'transparent'}; color: ${on ? (dark ? '#16130F' : '#F5EFE4') : T.muted}; font-size: 13px; font-weight: 600; font-family: inherit; cursor: pointer`;

    const stepData = [
      { title: '티켓 태그', tag: 'SCENE 01 · 시각·공간', desc: '키오스크·종이·모바일 티켓 바코드를 스캔하면 관람 날짜, 실시간 날씨, 좌석, 포스터가 자동 저장됩니다.' },
      { title: '오디오 & 로케이션', tag: 'SCENE 02 · 청각·여행', desc: '대표 OST가 다시 흐르고, 명장면이 탄생한 실제 촬영지가 지도로 연동됩니다.' },
      { title: '30초 보이스 레코딩', tag: 'SCENE 03 · 감정', desc: '엔딩 크레딧이 시작되면 열리는 녹음 버튼. 30초 목소리가 텍스트와 함께 기록됩니다.' },
      { title: '취향 확장', tag: 'SCENE 04 · 추천', desc: '본 영화와 감상평을 바탕으로 무드가 닮은 영화와 12곡 플레이리스트를 추천합니다.' }
    ];
    const steps = stepData.map((s, i) => {
      const on = i === step;
      const onBg = dark ? '#F3EBDD' : '#16130F';
      const onFg = dark ? '#16130F' : '#F3EBDD';
      return { ...s, no: '0' + (i + 1), selected: on ? 'true' : 'false', pick: () => this.setState({ step: i }),
        style: `display: flex; gap: 18px; align-items: flex-start; width: 100%; padding: 22px 24px; border-radius: 20px; border: 1px solid ${on ? onBg : T.line}; background: ${on ? onBg : T.card}; color: ${on ? onFg : T.fg}; text-align: left; font-family: inherit; cursor: pointer`,
        numStyle: `flex: none; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 26px; line-height: 1; color: ${on ? (dark ? '#7A4E0C' : accent) : T.accentText}` };
    });

    const tabs = ['전체', '음악', '로맨스', '드라마', 'SF', '애니메이션', '어드벤처'].map((x) => {
      const on = x === tab;
      return { label: x, pressed: on ? 'true' : 'false', pick: () => this.setState({ tab: x }), style: pillBtn(on) + '; min-height: 44px; padding: 0 18px; font-size: 14px' };
    });
    const cards = movies.map((m, i) => ({ ...m, i }))
      .filter((m) => tab === '전체' || m.cat === tab)
      .map((m) => {
        const on = m.i === picked;
        return { title: m.title, kind: m.kind, src: m.src, date: m.date, genre: m.genre, pressed: on ? 'true' : 'false', pick: () => this.setState({ picked: m.i }),
          style: `display: block; width: 100%; padding: 10px; border-radius: 18px; border: 1.5px solid ${on ? accent : 'transparent'}; background: ${on ? T.card : 'transparent'}; text-align: left; font-family: inherit; cursor: pointer` };
      });

    const faqList = [
      { q: '멤버십 요금에는 무엇이 포함되나요?', a: '월 10,000원(부가세 포함)에 링 또는 태그 1개, 무제한 크레딧 기록, OST·촬영지 연동, 30초 보이스, 취향 추천과 매달 12곡 플레이리스트, 연말 리포트가 모두 포함돼요. 연간 결제는 100,000원으로 2개월이 무료예요.' },
      { q: '해지하면 기록은 어떻게 되나요?', a: '언제든 해지할 수 있고, 해지 전후 모두 크레딧을 이미지·PDF로 내보낼 수 있어요. 해지 후 보관 기간은 이용약관에서 안내드릴 예정이에요.' },
      { q: '어떤 티켓을 지원하나요?', a: '멀티플렉스 키오스크 발권 티켓, 예매 앱의 모바일 티켓(QR·바코드), 바코드가 있는 독립·예술영화관 종이 티켓을 지원할 예정이에요. 바코드가 없거나 해외 극장 티켓은 영화 검색 후 직접 입력할 수 있어요.' },
      { q: '상영 중에 녹음되지는 않나요?', a: '상영 모드에서는 녹음과 카메라가 잠겨 있어요. 엔딩 크레딧이 시작된 뒤에만 녹음 버튼이 열리고, 영화 소리가 아닌 내 목소리 감상평만 남기도록 안내해요.' },
      { q: '추천은 어떻게 만들어지나요?', a: '내가 기록한 영화의 무드, OST 스타일, 장르, 촬영지 풍경과 보이스 감상평의 단어·톤을 비교해 닮은 작품을 찾아요. 추천마다 왜 골랐는지 이유를 함께 보여 드려요.' },
      { q: '링과 태그는 무엇이 다른가요?', a: '링은 손에 끼고 극장에 가는 웨어러블, 태그는 가방이나 다이어리에 거는 티켓 모양 키링이에요. 둘 다 충전이 필요 없고 기록 기능은 같아요.' },
      { q: '사전 알림 혜택은 언제 적용되나요?', a: '정식 출시 후 첫 결제 시 첫 달 무료와 각인 무료가 적용되고, 프리미어 넘버는 신청 순서대로 선착순 1,000명에게 새겨 드려요.' }
    ];
    const faqs = faqList.map((f, i) => {
      const open = this.state.openFaq === i;
      return { ...f, open, expanded: open ? 'true' : 'false', toggle: () => this.setState({ openFaq: open ? -1 : i }), iconStyle: `flex: none; font-size: 26px; line-height: 1; color: ${T.accentText}; transform: rotate(${open ? 45 : 0}deg)` };
    });

    return {
      accent, T, first: movies[0],
      modeName: mode,
      kicker: dark ? 'NOW SHOWING · 상영 모드' : 'LIGHTS ON · 라이트 모드',
      toggleMenu: () => this.setState({ menu: !this.state.menu }),
      menuExpanded: this.state.menu ? 'true' : 'false',
      menuIcon: this.state.menu ? 'M4 4l10 10M14 4L4 14' : 'M3 5h12M3 9h12M3 13h12',
      linksClass: this.state.menu ? 'fx-links fx-open' : 'fx-links',
      toggleBgm,
      bgmPressed: bgmOn ? 'true' : 'false',
      bgmAria: bgmOn ? '배경 음악 끄기' : '배경 음악 켜기',
      eqClass: bgmOn ? 'fx-eq on' : 'fx-eq',
      bgmTitle: bgmOn ? '여운 테마 재생 중' : 'BGM 켜기',
      bgmSub: bgmOn ? (dark ? '상영 모드 · 깊고 낮게' : '라이트 모드 · 밝고 맑게') : '오리지널 앰비언트 · 자동 재생 안 함',
      bgmFloat: `display: inline-flex; align-items: center; gap: 12px; min-height: 52px; padding: 0 18px; border-radius: 999px; border: 1px solid ${bgmOn ? accent : T.line}; background: ${T.card}; color: ${T.fg}; font-family: inherit; cursor: pointer; box-shadow: 0 12px 30px rgba(0,0,0,0.3)`,
      setDark: () => setMode('dark'),
      setLight: () => setMode('light'),
      toggleMode: () => setMode(dark ? 'light' : 'dark'),
      darkPressed: dark ? 'true' : 'false',
      lightPressed: dark ? 'false' : 'true',
      darkBtn: pillBtn(dark),
      lightBtn: pillBtn(!dark),
      switchLabel: dark ? '상영관 불 켜기' : '다시 불 끄기',
      switchStyle: `display: inline-flex; align-items: center; gap: 12px; min-height: 56px; padding: 0 24px 0 10px; border-radius: 999px; border: 1px solid ${T.line}; background: ${T.card}; color: ${T.fg}; font-size: 16px; font-family: inherit; cursor: pointer`,
      switchTrack: `position: relative; display: block; width: 52px; height: 32px; border-radius: 999px; background: ${dark ? '#2A251D' : accent}`,
      switchKnob: `position: absolute; top: 4px; left: ${dark ? 4 : 24}px; width: 24px; height: 24px; border-radius: 50%; background: ${dark ? '#8F8676' : '#16130F'}; transition: left .3s ease`,
      interText: dark ? '크레딧이 끝났어요. 불을 켜 볼까요?' : '불이 켜졌어요. 다시 어둡게 볼 수도 있어요.',
      cur: movies[cur], curIndex: String(cur + 1).padStart(2, '0'), thumbs,
      playing, notPlaying: !playing, togglePlay,
      playLabel: playing ? 'OST 일시정지' : 'OST 재생',
      timeNow: fmt(t),
      progressStyle: `width: ${(t / TRACK) * 100}%; height: 4px; border-radius: 2px; background: ${accent}`,
      steps, show0: step === 0, show1: step === 1, show2: step === 2, show3: step === 3,
      tabs, cards, cardCount: cards.length,
      sel: { ...movies[picked], no: String(picked + 1).padStart(3, '0') },
      setSummary: (s) => this.setState({ summary: s }),
      summary: this.state.summary,
      faqs
    };
  }
}
Comp_Main.defaults = {"accent": "#E9B04A", "startMode": "dark"};
Comp_Main.prototype.__tpl = function (v) {
  return h("div", {"class": "fx-fade fx-root", "style": "background: "+(v.T?.bg ?? "")+"; color: "+(v.T?.fg ?? "")+"; font-family: 'IBM Plex Sans KR', sans-serif; min-height: 100vh"},
      h("div", {"style": "position: fixed; right: 16px; bottom: 16px; z-index: 50"},
        h("button", {"onClick": v.toggleBgm, "aria-pressed": v.bgmPressed, "aria-label": v.bgmAria, "style": v.bgmFloat},
          h("span", {"class": v.eqClass, "style": "display: flex; align-items: flex-end; gap: 3px; height: 14px", "aria-hidden": "true"},
            h("span", {"style": "background: "+(v.accent ?? "")}),
            h("span", {"style": "background: "+(v.accent ?? "")}),
            h("span", {"style": "background: "+(v.accent ?? "")}),
            h("span", {"style": "background: "+(v.accent ?? "")})),
          h("span", {"style": "display: flex; flex-direction: column; align-items: flex-start; line-height: 1.25"},
            h("span", {"style": "font-size: 13px; font-weight: 600"},
              (v.bgmTitle ?? "")),
            h("span", {"class": "fx-bgm-sub", "style": "font-size: 11px; opacity: 0.7"},
              (v.bgmSub ?? ""))))),
      h("header", {"style": "max-width: 1280px; margin: 0 auto; padding: 22px 24px"},
        h("div", {"class": "fx-fade fx-navbar", "style": "display: flex; flex-wrap: wrap; gap: 12px 16px; align-items: center; justify-content: space-between; padding: 10px 10px 10px 22px; border-radius: 999px; background: "+(v.T?.card ?? "")+"; border: 1px solid "+(v.T?.line ?? "")},
          h("a", {"href": "#top", "style": "display: flex; align-items: center; gap: 12px; text-decoration: none; color: "+(v.T?.fg ?? "")},
            h("svg", {"width": "30", "height": "30", "viewBox": "0 0 34 34", "aria-hidden": "true"},
              h("circle", {"cx": "17", "cy": "17", "r": "15", "fill": "none", "stroke": v.accent, "stroke-width": "2"}),
              h("circle", {"cx": "17", "cy": "17", "r": "6", "fill": v.accent})),
            h("span", {"style": "font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 19px"},
              "Soundtrack Credit")),
          h("button", {"class": "fx-menu-btn", "onClick": v.toggleMenu, "aria-expanded": v.menuExpanded, "aria-controls": "fx-links", "aria-label": "메뉴 열기", "style": "width: 44px; height: 44px; align-items: center; justify-content: center; border-radius: 50%; border: 1px solid "+(v.T?.line ?? "")+"; background: transparent; color: "+(v.T?.fg ?? "")+"; cursor: pointer"},
            h("svg", {"width": "18", "height": "18", "viewBox": "0 0 18 18", "aria-hidden": "true"},
              h("path", {"d": v.menuIcon, "fill": "none", "stroke": "currentColor", "stroke-width": "1.8", "stroke-linecap": "round"}))),
          h("nav", {"id": "fx-links", "class": v.linksClass, "aria-label": "주요 메뉴", "style": "display: flex; flex-wrap: wrap; gap: 20px; align-items: center; font-size: 15px"},
            h("a", {"href": "#how", "style": "color: "+(v.T?.muted ?? "")+"; text-decoration: none"},
              "사용 방법"),
            h("a", {"href": "#recommend", "style": "color: "+(v.T?.muted ?? "")+"; text-decoration: none"},
              "취향 추천"),
            h("a", {"href": "#voice", "style": "color: "+(v.T?.muted ?? "")+"; text-decoration: none"},
              "녹음 체험"),
            h("a", {"href": "#shop", "style": "color: "+(v.T?.muted ?? "")+"; text-decoration: none"},
              "링 & 태그"),
            h("a", {"href": "#pricing", "style": "color: "+(v.T?.muted ?? "")+"; text-decoration: none"},
              "멤버십"),
            h("a", {"href": "/app/", "style": "color: "+(v.T?.accentText ?? "")+"; text-decoration: none; font-weight: 600"},
              "로그인"),
            h("div", {"role": "group", "aria-label": "화면 모드", "style": "display: flex; gap: 4px; padding: 4px; border-radius: 999px; background: "+(v.T?.soft ?? "")},
              h("button", {"onClick": v.setDark, "aria-pressed": v.darkPressed, "style": v.darkBtn},
                "상영 모드"),
              h("button", {"onClick": v.setLight, "aria-pressed": v.lightPressed, "style": v.lightBtn},
                "라이트 모드")),
            h("a", {"href": "#join", "style": "color: #16130F; background: "+(v.accent ?? "")+"; padding: 0 22px; border-radius: 999px; text-decoration: none; font-weight: 600"},
              "사전 알림")))),
      h("section", {"id": "top", "style": "max-width: 1280px; margin: 0 auto; padding: 60px 24px 90px"},
        h("div", {"class": "fx-gap", "style": "display: flex; flex-wrap: wrap; gap: 64px; align-items: center"},
          h("div", {"style": "flex: 1 1 520px; min-width: 0"},
            h("p", {"style": "margin: 0 0 26px; display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px; border-radius: 999px; border: 1px solid "+(v.T?.line ?? "")+"; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.T?.accentText ?? "")},
              h("span", {"style": "width: 7px; height: 7px; border-radius: 50%; background: "+(v.accent ?? "")}),
              (v.kicker ?? "")),
            h("h1", {"style": "margin: 0; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: clamp(44px, 6.2vw, 94px); line-height: 1.1; letter-spacing: -0.025em"},
              "불이 켜져도,",
              h("br", {}),
              "여운은 ",
              h("span", {"style": "color: "+(v.T?.accentText ?? "")},
                "꺼지지 않게.")),
            h("p", {"style": "margin: 30px 0 0; max-width: 520px; font-size: 19px; line-height: 1.8; color: "+(v.T?.muted ?? "")},
              "막 내려간 스크린의 여운과 OST를 영원히 재생하는 기록. 링을 한 번 태그하면 포스터·OST·촬영지·나의 목소리가 한 장의 크레딧으로 남고, 그 여운을 닮은 다음 영화까지 찾아 드려요."),
            h("div", {"style": "margin-top: 36px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center"},
              h("a", {"href": "/app/", "style": "display: inline-flex; align-items: center; gap: 10px; min-height: 56px; padding: 0 28px; background: "+(v.accent ?? "")+"; color: #16130F; border-radius: 999px; font-weight: 700; text-decoration: none; font-size: 16px"},
                "월 10,000원으로 시작하기"),
              h("button", {"onClick": v.toggleMode, "aria-pressed": v.lightPressed, "style": v.switchStyle},
                h("span", {"style": v.switchTrack},
                  h("span", {"style": v.switchKnob})),
                h("span", {},
                  (v.switchLabel ?? "")))),
            h("ul", {"style": "margin: 30px 0 0; padding: 0; list-style: none; display: flex; flex-wrap: wrap; gap: 10px 22px; font-size: 14px; color: "+(v.T?.muted ?? "")},
              h("li", {"style": "display: flex; align-items: center; gap: 8px"},
                h("span", {"style": "width: 6px; height: 6px; border-radius: 50%; background: "+(v.accent ?? "")}),
                "사전 알림 시 첫 달 무료"),
              h("li", {"style": "display: flex; align-items: center; gap: 8px"},
                h("span", {"style": "width: 6px; height: 6px; border-radius: 50%; background: "+(v.accent ?? "")}),
                "링 또는 태그 1개 포함"),
              h("li", {"style": "display: flex; align-items: center; gap: 8px"},
                h("span", {"style": "width: 6px; height: 6px; border-radius: 50%; background: "+(v.accent ?? "")}),
                "언제든 해지"))),
          h("div", {"style": "flex: 1 1 460px; min-width: 0; display: flex; justify-content: center"},
            h("div", {"class": "fx-stage", "style": "position: relative; width: 500px; max-width: 100%; height: 620px"},
              h("div", {"class": "fx-deco", "aria-hidden": "true", "style": "position: absolute; right: -60px; top: -30px; width: 480px; height: 480px; border-radius: 50%; background: radial-gradient(circle, rgba(233,176,74,0.22), rgba(233,176,74,0) 65%)"}),
              h("div", {"class": "fx-deco", "style": "position: absolute; right: 4px; top: 0; font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.2em; color: "+(v.T?.muted ?? "")},
                "NOW SHOWING · ",
                (v.curIndex ?? ""),
                " / 05"),
              h("div", {"style": "position: absolute; right: 0; top: 30px; width: 316px; height: 448px; border-radius: 20px; overflow: hidden; outline: 1px solid rgba(233,176,74,0.55); outline-offset: 8px; box-shadow: "+(v.T?.posterShadow ?? "")},
                h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": v.cur?.kind, "label": v.cur?.title, "src": v.cur?.src, "h": "448px"}))),
              h("div", {"style": "position: absolute; left: 0; top: 150px; width: 214px; border-radius: 14px; background: "+(v.T?.ticket ?? "")+"; color: #16130F; border: 1px solid "+(v.T?.ticketLine ?? "")+"; box-shadow: 0 24px 50px rgba(0,0,0,0.35); transform: rotate(-3deg)"},
                h("div", {"style": "padding: 16px 18px 14px"},
                  h("div", {"style": "display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.16em; color: #6B6253"},
                    h("span", {},
                      "ADMIT ONE"),
                    h("span", {},
                      "SCANNED")),
                  h("div", {"style": "margin-top: 10px; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 17px; line-height: 1.3"},
                    (v.cur?.title ?? "")),
                  h("div", {"style": "margin-top: 12px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; font-size: 11px"},
                    h("div", {},
                      h("div", {"style": "color: #6B6253"},
                        "좌석"),
                      h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-weight: 500; font-size: 18px"},
                        (v.cur?.seatOnly ?? ""))),
                    h("div", {},
                      h("div", {"style": "color: #6B6253"},
                        "날씨"),
                      h("div", {"style": "font-weight: 600; font-size: 13px; margin-top: 3px"},
                        (v.cur?.weather ?? "")))),
                  h("div", {"style": "margin-top: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: #6B6253"},
                    (v.cur?.date ?? ""),
                    " · 19:40")),
                h("div", {"style": "position: relative; height: 0; border-top: 2px dashed #CFC2A9; margin: 0 14px"},
                  h("span", {"style": "position: absolute; left: -24px; top: -10px; width: 18px; height: 18px; border-radius: 50%; background: "+(v.T?.bg ?? "")}),
                  h("span", {"style": "position: absolute; right: -24px; top: -10px; width: 18px; height: 18px; border-radius: 50%; background: "+(v.T?.bg ?? "")})),
                h("div", {"style": "padding: 12px 18px 14px; display: flex; align-items: flex-end; gap: 2px; height: 30px", "aria-hidden": "true"},
                  h("span", {"style": "width: 2px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 4px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 1px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 3px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 1px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 5px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 2px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 1px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 3px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 2px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 4px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 1px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 2px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 5px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 1px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 3px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 2px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 1px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 4px; height: 30px; background: #16130F"}),
                  h("span", {"style": "width: 2px; height: 30px; background: #16130F"}))),
              h("div", {"style": "position: absolute; left: 36px; bottom: 0; width: 420px; max-width: 92%; padding: 16px; border-radius: 22px; background: "+(v.T?.inv ?? "")+"; color: "+(v.T?.invFg ?? "")+"; box-shadow: 0 30px 60px rgba(0,0,0,0.4)"},
                h("div", {"style": "display: flex; align-items: center; gap: 14px"},
                  h("div", {"style": "flex: none; width: 52px; height: 52px; border-radius: 10px; overflow: hidden"},
                    h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": v.cur?.kind, "label": v.cur?.title, "src": v.cur?.src, "bare": true, "h": "52px"}))),
                  h("div", {"style": "flex: 1 1 auto; min-width: 0"},
                    h("div", {"style": "font-size: 12px; opacity: 0.7"},
                      "대표 OST"),
                    h("div", {"style": "font-size: 15px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis"},
                      (v.cur?.ost ?? ""))),
                  h("button", {"onClick": v.togglePlay, "aria-label": v.playLabel, "style": "flex: none; width: 48px; height: 48px; border-radius: 50%; border: none; background: "+(v.accent ?? "")+"; cursor: pointer; display: flex; align-items: center; justify-content: center"},
                    (v.playing) ? [h("svg", {"width": "14", "height": "14", "viewBox": "0 0 14 14", "aria-hidden": "true"},
                        h("rect", {"x": "3", "y": "2", "width": "3", "height": "10", "fill": "#16130F"}),
                        h("rect", {"x": "8", "y": "2", "width": "3", "height": "10", "fill": "#16130F"}))] : null,
                    (v.notPlaying) ? [h("svg", {"width": "14", "height": "14", "viewBox": "0 0 14 14", "aria-hidden": "true"},
                        h("path", {"d": "M3 1.5v11l9-5.5z", "fill": "#16130F"}))] : null)),
                h("div", {"style": "margin-top: 14px; display: flex; align-items: center; gap: 10px"},
                  h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.7"},
                    (v.timeNow ?? "")),
                  h("div", {"style": "flex: 1 1 auto; height: 4px; border-radius: 2px; background: "+(v.T?.invTrack ?? "")},
                    h("div", {"style": v.progressStyle})),
                  h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.7"},
                    "3:34")),
                h("p", {"style": "margin: 12px 0 0; padding-top: 12px; border-top: 1px solid "+(v.T?.invTrack ?? "")+"; font-family: 'Nanum Myeongjo', serif; font-size: 14px; line-height: 1.6"},
                  "“",
                  (v.cur?.voice ?? ""),
                  "” ",
                  h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 11px; opacity: 0.6"},
                    "VOICE 0:30"))))))),
      h("section", {"class": "fx-tight", "style": "max-width: 1280px; margin: 0 auto; padding: 0 24px 90px"},
        h("div", {"class": "fx-fade", "style": "padding: 18px; border-radius: 24px; background: "+(v.T?.card ?? "")+"; border: 1px solid "+(v.T?.line ?? "")+"; display: flex; flex-wrap: wrap; gap: 18px; align-items: center"},
          h("div", {"style": "flex: 0 0 auto; padding: 0 8px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.16em; color: "+(v.T?.muted ?? "")},
            "MY CREDITS",
            h("br", {}),
            h("span", {"style": "color: "+(v.T?.accentText ?? "")},
              "넘겨 보기")),
          h("div", {"role": "group", "aria-label": "크레딧 선택", "class": "fx-shows", "style": "flex: 1 1 520px; min-width: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 12px"},
            (v.thumbs || []).map((t, $i_t) => [h("button", {"onClick": t?.pick, "aria-pressed": t?.pressed, "aria-label": (t?.title ?? "")+" 보기", "style": t?.style},
                h("span", {"style": "display: block; border-radius: 10px; overflow: hidden"},
                  h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": t?.kind, "label": t?.title, "src": t?.src, "bare": true, "h": "104px"}))))])))),
      h("section", {"aria-label": "엔딩 크레딧", "class": "fx-flush", "style": "position: relative; height: 400px; overflow: hidden; background: #000000; color: #F3EBDD"},
        h("div", {"style": "position: absolute; left: 0; right: 0; top: 0; height: 110px; background: linear-gradient(#000000, rgba(0,0,0,0)); z-index: 1"}),
        h("div", {"style": "position: absolute; left: 0; right: 0; bottom: 0; height: 110px; background: linear-gradient(rgba(0,0,0,0), #000000); z-index: 1"}),
        h("div", {"class": "fx-roll", "style": "display: flex; flex-direction: column; gap: 38px; padding: 56px 24px; text-align: center; font-family: 'Nanum Myeongjo', serif"},
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "DIRECTED BY"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "그날의 당신")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "ORIGINAL SOUNDTRACK"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "귓가에 남은 그 선율")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "FILMED ON LOCATION"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "언젠가 꼭 가 볼 그곳")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "NEXT FEATURE"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "여운을 닮은 다음 영화")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: "+(v.accent ?? "")},
              "AND THEN"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700; color: "+(v.accent ?? "")},
              "불이 켜집니다")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "DIRECTED BY"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "그날의 당신")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "ORIGINAL SOUNDTRACK"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "귓가에 남은 그 선율")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "FILMED ON LOCATION"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "언젠가 꼭 가 볼 그곳")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: #B8AE9C"},
              "NEXT FEATURE"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700"},
              "여운을 닮은 다음 영화")),
          h("div", {},
            h("div", {"style": "font-size: 12px; letter-spacing: 0.26em; color: "+(v.accent ?? "")},
              "AND THEN"),
            h("div", {"style": "margin-top: 8px; font-size: 30px; font-weight: 700; color: "+(v.accent ?? "")},
              "불이 켜집니다")))),
      h("section", {"class": "fx-tight", "style": "max-width: 1280px; margin: 0 auto; padding: 72px 24px 0"},
        h("div", {"class": "fx-fade", "style": "border-radius: 28px; border: 1px dashed "+(v.T?.line ?? "")+"; padding: 26px 32px; display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: space-between"},
          h("div", {},
            h("div", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 12px; letter-spacing: 0.18em; color: "+(v.T?.accentText ?? "")},
              "INTERMISSION"),
            h("div", {"style": "margin-top: 6px; font-family: 'Nanum Myeongjo', serif; font-size: 24px; font-weight: 700"},
              (v.interText ?? ""))),
          h("button", {"onClick": v.toggleMode, "aria-pressed": v.lightPressed, "style": v.switchStyle},
            h("span", {"style": v.switchTrack},
              h("span", {"style": v.switchKnob})),
            h("span", {},
              (v.switchLabel ?? ""))))),
      h("section", {"style": "max-width: 1280px; margin: 0 auto; padding: 100px 24px 120px"},
        h("div", {"style": "display: flex; flex-wrap: wrap; gap: 32px; justify-content: space-between; align-items: flex-end; margin-bottom: 48px"},
          h("h2", {"style": "margin: 0; flex: 1 1 560px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
            "영화는 끝났는데,",
            h("br", {}),
            "기록은 영수증처럼 지워지고 있었습니다."),
          h("p", {"style": "margin: 0; flex: 1 1 320px; max-width: 420px; font-size: 16px; line-height: 1.8; color: "+(v.T?.muted ?? "")},
            "엔딩 크레딧까지 자리를 지키는 관객들에게 들은 두 가지 고민에서 시작했어요.")),
        h("div", {"style": "display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap: 18px"},
          h("figure", {"class": "fx-fade", "style": "margin: 0; padding: 32px; border-radius: 24px; background: "+(v.T?.card ?? "")+"; border: 1px solid "+(v.T?.line ?? "")},
            h("div", {"style": "height: 120px; border-radius: 12px; background: #FBF8F2; padding: 18px 20px; box-sizing: border-box; font-family: 'IBM Plex Mono', monospace; transform: rotate(-1.5deg)", "aria-hidden": "true"},
              h("div", {"style": "font-size: 10px; color: #D4CCBD"},
                "CINEMA · 3관"),
              h("div", {"style": "margin-top: 10px; font-size: 16px; color: #DDD5C7"},
                "라 라 랜 _"),
              h("div", {"style": "margin-top: 10px; font-size: 11px; color: #E6E0D4"},
                "2 0 2 _ . _ 0 . 1 _")),
            h("figcaption", {"style": "margin-top: 22px; font-family: 'Nanum Myeongjo', serif; font-size: 18px; line-height: 1.7"},
              "“종이 티켓 글자가 지워지면서 그날의 감정까지 휘발돼요.”")),
          h("figure", {"class": "fx-fade", "style": "margin: 0; padding: 32px; border-radius: 24px; background: "+(v.T?.card ?? "")+"; border: 1px solid "+(v.T?.line ?? "")},
            h("div", {"style": "height: 120px; display: flex; flex-wrap: wrap; gap: 8px; align-content: center", "aria-hidden": "true"},
              h("span", {"style": "padding: 10px 14px; border-radius: 12px; background: "+(v.T?.soft ?? "")+"; font-size: 13px; color: "+(v.T?.muted ?? "")},
                "♪ 음악 앱 속 OST"),
              h("span", {"style": "padding: 10px 14px; border-radius: 12px; background: "+(v.T?.soft ?? "")+"; font-size: 13px; color: "+(v.T?.muted ?? "")},
                "⌖ 블로그 속 촬영지"),
              h("span", {"style": "padding: 10px 14px; border-radius: 12px; background: "+(v.T?.soft ?? "")+"; font-size: 13px; color: "+(v.T?.muted ?? "")},
                "✎ 메모장 속 감상")),
            h("figcaption", {"style": "margin-top: 22px; font-family: 'Nanum Myeongjo', serif; font-size: 18px; line-height: 1.7"},
              "“OST와 촬영지를 한 번에 모아 볼 나만의 공간이 아쉬워요.”")),
          h("figure", {"style": "margin: 0; padding: 32px; border-radius: 24px; background: "+(v.accent ?? "")+"; color: #16130F"},
            h("div", {"style": "height: 120px; display: flex; align-items: center; font-family: 'Nanum Myeongjo', serif; font-weight: 800; font-size: 32px; line-height: 1.22"},
              "그래서,",
              h("br", {}),
              "한 장의 크레딧."),
            h("figcaption", {"style": "margin-top: 22px; font-size: 15px; line-height: 1.8; font-weight: 500"},
              "티켓·포스터·OST·촬영지·목소리를 한 편 단위로 묶고, 그 여운에서 다음 영화를 찾아 드려요.")))),
      h("section", {"id": "how", "class": "fx-fade", "style": "background: "+(v.T?.band ?? "")+"; padding: 120px 24px"},
        h("div", {"style": "max-width: 1280px; margin: 0 auto"},
          h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
            "HOW IT WORKS · 눌러서 미리 보기"),
          h("h2", {"style": "margin: 18px 0 52px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
            "상영관을 나서는 네 개의 장면"),
          h("div", {"style": "display: flex; flex-wrap: wrap; gap: 32px; align-items: stretch"},
            h("div", {"role": "tablist", "aria-label": "사용 단계", "style": "flex: 1 1 380px; min-width: 0; display: flex; flex-direction: column; gap: 10px"},
              (v.steps || []).map((s, $i_s) => [h("button", {"role": "tab", "aria-selected": s?.selected, "onClick": s?.pick, "style": s?.style},
                  h("span", {"style": s?.numStyle},
                    (s?.no ?? "")),
                  h("span", {"style": "flex: 1 1 auto; min-width: 0"},
                    h("span", {"style": "display: block; font-size: 19px; font-weight: 600"},
                      (s?.title ?? "")),
                    h("span", {"style": "display: block; margin-top: 4px; font-size: 12px; letter-spacing: 0.1em; opacity: 0.7"},
                      (s?.tag ?? "")),
                    h("span", {"style": "display: block; margin-top: 10px; font-size: 15px; line-height: 1.7; opacity: 0.88"},
                      (s?.desc ?? ""))))])),
            h("div", {"role": "tabpanel", "class": "fx-panel", "style": "flex: 1 1 540px; min-width: 0; min-height: 520px; border-radius: 28px; background: #0E0C09; color: #F3EBDD; padding: 36px; box-sizing: border-box; display: flex; align-items: center; justify-content: center"},
              (v.show0) ? [h("div", {"style": "display: flex; flex-wrap: wrap; gap: 24px; align-items: center; justify-content: center"},
                  h("div", {"style": "width: 170px; border-radius: 14px; overflow: hidden"},
                    h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": v.first?.kind, "label": v.first?.title, "src": v.first?.src, "h": "242px"}))),
                  h("ul", {"style": "margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; font-size: 14px; min-width: 200px"},
                    h("li", {"style": "padding: 14px 16px; border-radius: 12px; background: #1B1812; display: flex; justify-content: space-between; gap: 16px"},
                      h("span", {"style": "color: #B8AE9C"},
                        "관람일"),
                      h("span", {},
                        (v.first?.date ?? ""))),
                    h("li", {"style": "padding: 14px 16px; border-radius: 12px; background: #1B1812; display: flex; justify-content: space-between; gap: 16px"},
                      h("span", {"style": "color: #B8AE9C"},
                        "날씨"),
                      h("span", {},
                        (v.first?.weather ?? ""))),
                    h("li", {"style": "padding: 14px 16px; border-radius: 12px; background: #1B1812; display: flex; justify-content: space-between; gap: 16px"},
                      h("span", {"style": "color: #B8AE9C"},
                        "좌석"),
                      h("span", {},
                        "3관 ",
                        (v.first?.seatOnly ?? ""))),
                    h("li", {"style": "padding: 14px 16px; border-radius: 12px; background: "+(v.accent ?? "")+"; color: #16130F; font-weight: 600; text-align: center"},
                      "스캔 완료 · 자동 저장")))] : null,
              (v.show1) ? [h("div", {"style": "width: 100%; max-width: 460px"},
                  h("div", {"style": "position: relative; height: 280px; border-radius: 18px; background: #1B1812; overflow: hidden"},
                    h("svg", {"viewBox": "0 0 460 280", "preserveAspectRatio": "none", "style": "position: absolute; inset: 0; width: 100%; height: 100%", "aria-hidden": "true"},
                      h("g", {"stroke": "#26221B"},
                        h("path", {"d": "M0 56H460M0 112H460M0 168H460M0 224H460M92 0V280M184 0V280M276 0V280M368 0V280"})),
                      h("path", {"d": "M-10 170C90 140 160 190 250 150S400 90 470 120", "fill": "none", "stroke": "#2A251D", "stroke-width": "18", "stroke-linecap": "round"}),
                      h("path", {"d": "M40 240C120 200 150 160 230 150S350 80 400 60", "fill": "none", "stroke": v.accent, "stroke-width": "2", "stroke-dasharray": "7 7"}),
                      h("circle", {"cx": "400", "cy": "60", "r": "10", "fill": v.accent}),
                      h("circle", {"cx": "400", "cy": "60", "r": "22", "fill": "none", "stroke": v.accent, "opacity": "0.4"}),
                      h("circle", {"cx": "40", "cy": "240", "r": "6", "fill": v.accent})),
                    h("div", {"style": "position: absolute; right: 14px; top: 90px; padding: 10px 14px; border-radius: 12px; background: #F3EBDD; color: #16130F"},
                      h("div", {"style": "font-size: 13px; font-weight: 700"},
                        "그리피스 파크 전망대 길"),
                      h("div", {"style": "font-size: 11px; color: #5C554A"},
                        "라라랜드 · 노을 속 탭댄스 장면"))),
                  h("div", {"style": "margin-top: 14px; padding: 14px; border-radius: 16px; background: #1B1812; display: flex; align-items: center; gap: 14px"},
                    h("span", {"style": "flex: none; width: 44px; height: 44px; border-radius: 50%; background: "+(v.accent ?? "")+"; display: flex; align-items: center; justify-content: center", "aria-hidden": "true"},
                      h("svg", {"width": "14", "height": "14", "viewBox": "0 0 14 14"},
                        h("rect", {"x": "3", "y": "2", "width": "3", "height": "10", "fill": "#16130F"}),
                        h("rect", {"x": "8", "y": "2", "width": "3", "height": "10", "fill": "#16130F"}))),
                    h("div", {"style": "flex: 1 1 auto; min-width: 0"},
                      h("div", {"style": "font-size: 14px; font-weight: 500"},
                        "City of Stars"),
                      h("div", {"style": "margin-top: 8px; height: 4px; border-radius: 2px; background: #3A3228"},
                        h("div", {"style": "width: 46%; height: 4px; border-radius: 2px; background: "+(v.accent ?? "")})))))] : null,
              (v.show2) ? [h("div", {"style": "text-align: center"},
                  h("div", {"style": "margin: 0 auto; width: 160px; height: 160px; border-radius: 50%; border: 1px solid #3A3328; display: flex; align-items: center; justify-content: center"},
                    h("div", {"style": "width: 120px; height: 120px; border-radius: 50%; border: 2px solid "+(v.accent ?? "")+"; display: flex; align-items: center; justify-content: center"},
                      h("div", {"style": "width: 76px; height: 76px; border-radius: 50%; background: "+(v.accent ?? "")}))),
                  h("p", {"style": "margin: 20px 0 0; font-size: 14px; color: #B8AE9C"},
                    "상영 중에는 잠겨 있다가, 엔딩 크레딧이 시작되면 열려요"),
                  h("a", {"href": "#voice", "style": "display: inline-flex; align-items: center; margin-top: 18px; min-height: 48px; padding: 0 22px; border-radius: 999px; border: 1px solid "+(v.accent ?? "")+"; color: "+(v.accent ?? "")+"; text-decoration: none"},
                    "아래에서 직접 녹음해 보기"))] : null,
              (v.show3) ? [h("div", {"style": "text-align: center"},
                  h("div", {"style": "display: flex; gap: 12px; justify-content: center"},
                    h("div", {"style": "width: 110px; border-radius: 12px; overflow: hidden; transform: rotate(-5deg)"},
                      h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": "jazz", "label": "원스", "src": "posters/once.jpg", "h": "158px"}))),
                    h("div", {"style": "width: 110px; border-radius: 12px; overflow: hidden; transform: translateY(-10px)"},
                      h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": "neon", "label": "싱 스트리트", "src": "posters/sing-street.jpg", "h": "158px"}))),
                    h("div", {"style": "width: 110px; border-radius: 12px; overflow: hidden; transform: rotate(5deg)"},
                      h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": "jazz", "label": "미드나잇 인 파리", "src": "posters/midnight-in-paris.jpg", "h": "158px"})))),
                  h("a", {"href": "#recommend", "style": "display: inline-flex; align-items: center; margin-top: 28px; min-height: 48px; padding: 0 22px; border-radius: 999px; background: "+(v.accent ?? "")+"; color: #16130F; text-decoration: none; font-weight: 600"},
                    "내 취향으로 추천 받아 보기"))] : null)))),
      h("section", {"id": "recommend", "style": "max-width: 1280px; margin: 0 auto; padding: 120px 24px"},
        h("div", {"style": "display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: flex-end; margin-bottom: 44px"},
          h("div", {},
            h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
              "NEXT FEATURE · 취향 추천"),
            h("h2", {"style": "margin: 18px 0 0; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
              "내가 본 영화로 찾는",
              h("br", {}),
              "다음 영화")),
          h("p", {"style": "margin: 0; max-width: 440px; font-size: 16px; line-height: 1.8; color: "+(v.T?.muted ?? "")},
            "본 영화를 골라 보세요. 무드와 OST, 촬영지 풍경이 닮은 작품을 이유와 함께 추천하고, 그 여운으로 12곡짜리 플레이리스트를 만들어 드려요.")),
        h(Comp_Recommender, Object.assign({}, Comp_Recommender.defaults, {"accent": v.accent, "mode": v.modeName}))),
      h("section", {"id": "voice", "class": "fx-fade", "style": "background: "+(v.T?.band ?? "")+"; padding: 120px 24px"},
        h("div", {"style": "max-width: 1280px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 56px; align-items: center"},
          h("div", {"style": "flex: 1 1 420px; min-width: 0"},
            h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
              "TRY IT · 30 SECONDS"),
            h("h2", {"style": "margin: 18px 0 20px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 52px); line-height: 1.28"},
              "글로 다듬기 전의 떨림은",
              h("br", {}),
              "목소리에만 남아요"),
            h("p", {"style": "margin: 0; font-size: 17px; line-height: 1.85; color: "+(v.T?.muted ?? "")},
              "엔딩 크레딧이 올라가면 링을 톡. 30초 동안 떠오르는 대로 말하면 육성 원본과 텍스트 변환본이 함께 크레딧에 붙고, 그 단어와 톤이 다음 추천에 반영돼요.")),
          h("div", {"style": "flex: 1 1 480px; min-width: 0"},
            h(Comp_Recorder, Object.assign({}, Comp_Recorder.defaults, {"accent": v.accent, "mode": v.modeName, "movie": v.cur?.title}))))),
      h("section", {"id": "gallery", "style": "max-width: 1280px; margin: 0 auto; padding: 120px 24px"},
        h("div", {"style": "display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: flex-end"},
          h("div", {},
            h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
              "MY CREDIT GALLERY"),
            h("h2", {"style": "margin: 18px 0 0; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
              "쌓일수록 내가 보이는 갤러리"),
            h("p", {"style": "margin: 12px 0 0; font-size: 15px; color: "+(v.T?.muted ?? "")},
              "지금까지 남긴 크레딧 ",
              (v.cardCount ?? ""),
              "편 · 포스터를 누르면 그날의 기록이 열려요")),
          h("div", {"role": "group", "aria-label": "장르 필터", "class": "fx-fade", "style": "display: flex; flex-wrap: wrap; gap: 6px; padding: 5px; border-radius: 999px; background: "+(v.T?.card ?? "")+"; border: 1px solid "+(v.T?.line ?? "")},
            (v.tabs || []).map((g, $i_g) => [h("button", {"onClick": g?.pick, "aria-pressed": g?.pressed, "style": g?.style},
                (g?.label ?? ""))]))),
        h("div", {"style": "margin-top: 48px; display: flex; flex-wrap: wrap; gap: 30px; align-items: stretch"},
          h("div", {"style": "flex: 1 1 560px; min-width: 0; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(140px, 100%), 1fr)); gap: 16px"},
            (v.cards || []).map((c, $i_c) => [h("button", {"onClick": c?.pick, "aria-pressed": c?.pressed, "aria-label": (c?.title ?? "")+" 크레딧 열기", "style": c?.style},
                h("span", {"style": "display: block; border-radius: 12px; overflow: hidden"},
                  h(Comp_Poster, Object.assign({}, Comp_Poster.defaults, {"kind": c?.kind, "label": c?.title, "src": c?.src, "h": "200px"}))),
                h("span", {"style": "display: flex; flex-direction: column; gap: 3px; margin-top: 10px; font-size: 12px; color: "+(v.T?.muted ?? "")},
                  h("span", {"style": "font-family: 'IBM Plex Mono', monospace; font-size: 11px"},
                    (c?.date ?? "")),
                  h("span", {"style": "font-weight: 600; color: "+(v.T?.fg ?? "")},
                    (c?.title ?? "")),
                  h("span", {},
                    (c?.genre ?? ""))))])),
          h("article", {"style": "flex: 1 1 340px; min-width: 0; border-radius: 28px; background: #14120E; color: #F3EBDD; border: 1px solid #26221B; padding: 32px; display: flex; flex-direction: column; gap: 16px"},
            h("div", {"style": "display: flex; justify-content: space-between; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: #B8AE9C"},
              h("span", {},
                "CREDIT ",
                (v.sel?.no ?? "")),
              h("span", {},
                (v.sel?.date ?? ""))),
            h("h3", {"style": "margin: 0; font-family: 'Nanum Myeongjo', serif; font-size: 30px; font-weight: 800"},
              (v.sel?.title ?? "")),
            h("div", {"style": "font-size: 14px; color: "+(v.accent ?? "")},
              (v.sel?.genre ?? ""),
              " · ",
              (v.sel?.mood ?? "")),
            h("dl", {"style": "margin: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; font-size: 14px"},
              h("div", {"style": "padding: 14px; border-radius: 14px; background: #0A0907"},
                h("dt", {"style": "font-size: 12px; color: #B8AE9C"},
                  "좌석 · 날씨"),
                h("dd", {"style": "margin: 4px 0 0"},
                  (v.sel?.seat ?? ""))),
              h("div", {"style": "padding: 14px; border-radius: 14px; background: #0A0907"},
                h("dt", {"style": "font-size: 12px; color: #B8AE9C"},
                  "대표 OST"),
                h("dd", {"style": "margin: 4px 0 0"},
                  (v.sel?.ostShort ?? ""))),
              h("div", {"style": "padding: 14px; border-radius: 14px; background: #0A0907; grid-column: 1 / -1"},
                h("dt", {"style": "font-size: 12px; color: #B8AE9C"},
                  "촬영지"),
                h("dd", {"style": "margin: 4px 0 0"},
                  (v.sel?.place ?? "")))),
            h("p", {"style": "margin: 0; padding: 16px; border-radius: 16px; border: 1px solid #3A3328; font-family: 'Nanum Myeongjo', serif; font-size: 16px; line-height: 1.7"},
              "“",
              (v.sel?.voice ?? ""),
              "”"),
            h("p", {"style": "margin: auto 0 0; font-size: 12px; color: #B8AE9C"},
              "예시 데이터입니다.")))),
      h("section", {"class": "fx-fade", "style": "background: "+(v.T?.band ?? "")+"; padding: 120px 24px"},
        h("div", {"style": "max-width: 1280px; margin: 0 auto"},
          h("div", {"style": "display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: flex-end; margin-bottom: 44px"},
            h("div", {},
              h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
                "YEAR IN CREDITS · 공유 카드"),
              h("h2", {"style": "margin: 18px 0 0; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
                "한 해의 여운을",
                h("br", {}),
                "한 장의 엔딩 크레딧으로")),
            h("p", {"style": "margin: 0; max-width: 420px; font-size: 16px; line-height: 1.8; color: "+(v.T?.muted ?? "")},
              "12월이 되면 올해의 무드, 가장 많이 들은 OST, 자주 앉은 자리까지 정리한 리포트를 보내 드려요. 크레딧 한 장은 언제든 SNS 카드로 만들 수 있어요.")),
          h(Comp_Report, Object.assign({}, Comp_Report.defaults, {"accent": v.accent, "mode": v.modeName})))),
      h("section", {"id": "shop", "style": "max-width: 1280px; margin: 0 auto; padding: 120px 24px"},
        h("div", {"style": "display: flex; flex-wrap: wrap; gap: 24px; justify-content: space-between; align-items: flex-end; margin-bottom: 44px"},
          h("div", {},
            h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
              "CHOOSE YOUR ADMIT ONE"),
            h("h2", {"style": "margin: 18px 0 0; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
              "나만의 입장권 고르기")),
          h("p", {"style": "margin: 0; max-width: 420px; font-size: 16px; line-height: 1.8; color: "+(v.T?.muted ?? "")},
            "멤버십에 포함된 기기를 골라 보세요. 모델과 컬러, 사이즈를 정하고 첫 관람의 날짜나 이름을 새길 수 있어요.")),
        h(Comp_Configurator, Object.assign({}, Comp_Configurator.defaults, {"accent": v.accent, "mode": v.modeName, "onSummary": v.setSummary}))),
      h("section", {"id": "pricing", "class": "fx-fade", "style": "background: "+(v.T?.band ?? "")+"; padding: 120px 24px"},
        h("div", {"style": "max-width: 1280px; margin: 0 auto"},
          h("div", {"style": "text-align: center; margin-bottom: 48px"},
            h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
              "MEMBERSHIP"),
            h("h2", {"style": "margin: 18px auto 0; max-width: 760px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
              "영화 한 편 값보다 적게,",
              h("br", {}),
              "한 달의 여운을 전부")),
          h(Comp_Pricing, Object.assign({}, Comp_Pricing.defaults, {"accent": v.accent, "mode": v.modeName})))),
      h("section", {"id": "spec", "style": "max-width: 1280px; margin: 0 auto; padding: 120px 24px"},
        h("div", {"style": "margin-bottom: 44px"},
          h("p", {"style": "margin: 0; font-size: 13px; letter-spacing: 0.26em; color: "+(v.T?.accentText ?? "")+"; font-weight: 600"},
            "IN THE THEATER"),
          h("h2", {"style": "margin: 18px 0 0; font-family: 'Nanum Myeongjo', serif; font-size: clamp(32px, 4vw, 54px); line-height: 1.28"},
            "상영관 안에서도, 밖에서도")),
        h(Comp_ModeSpec, Object.assign({}, Comp_ModeSpec.defaults, {"accent": v.accent, "mode": v.modeName}))),
      h("section", {"style": "max-width: 1280px; margin: 0 auto; padding: 0 24px 100px"},
        h("h2", {"style": "margin: 0 0 32px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(30px, 3.6vw, 46px); line-height: 1.3"},
          "기록하는 방법, 무엇이 다를까요"),
        h("div", {"class": "fx-fade", "style": "overflow-x: auto; border-radius: 24px; border: 1px solid "+(v.T?.line ?? "")+"; background: "+(v.T?.card ?? "")},
          h("table", {"style": "width: 100%; min-width: 640px; border-collapse: collapse; font-size: 15px"},
            h("thead", {},
              h("tr", {"style": "text-align: left"},
                h("th", {"scope": "col", "style": "padding: 22px 24px; font-weight: 500; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "기록 항목"),
                h("th", {"scope": "col", "style": "padding: 22px 24px; font-weight: 500; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "종이 티켓"),
                h("th", {"scope": "col", "style": "padding: 22px 24px; font-weight: 500; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "사진·메모 앱"),
                h("th", {"scope": "col", "style": "padding: 22px 24px; font-weight: 700; color: #16130F; background: "+(v.accent ?? "")+"; border-bottom: 1px solid "+(v.accent ?? "")},
                  "Soundtrack Credit"))),
            h("tbody", {},
              h("tr", {},
                h("th", {"scope": "row", "style": "padding: 18px 24px; text-align: left; font-weight: 500; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "시간이 지나도 선명함"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "글자가 바램"),
                h("td", {"style": "padding: 18px 24px; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "✓"),
                h("td", {"style": "padding: 18px 24px; background: "+(v.T?.hl ?? "")+"; font-weight: 600; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "✓ 클라우드 보관 + 내보내기")),
              h("tr", {},
                h("th", {"scope": "row", "style": "padding: 18px 24px; text-align: left; font-weight: 500; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "날짜·날씨·좌석 자동 기록"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "일부만"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "직접 입력"),
                h("td", {"style": "padding: 18px 24px; background: "+(v.T?.hl ?? "")+"; font-weight: 600; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "✓ 스캔 한 번")),
              h("tr", {},
                h("th", {"scope": "row", "style": "padding: 18px 24px; text-align: left; font-weight: 500; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "OST · 촬영지 연동"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "—"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "따로 검색"),
                h("td", {"style": "padding: 18px 24px; background: "+(v.T?.hl ?? "")+"; font-weight: 600; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "✓ 자동 연동")),
              h("tr", {},
                h("th", {"scope": "row", "style": "padding: 18px 24px; text-align: left; font-weight: 500; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "목소리 감상평"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "—"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")+"; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "따로 녹음"),
                h("td", {"style": "padding: 18px 24px; background: "+(v.T?.hl ?? "")+"; font-weight: 600; border-bottom: 1px solid "+(v.T?.line ?? "")},
                  "✓ 30초 + 텍스트")),
              h("tr", {},
                h("th", {"scope": "row", "style": "padding: 18px 24px; text-align: left; font-weight: 500"},
                  "취향 기반 추천"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")},
                  "—"),
                h("td", {"style": "padding: 18px 24px; color: "+(v.T?.muted ?? "")},
                  "—"),
                h("td", {"style": "padding: 18px 24px; background: "+(v.T?.hl ?? "")+"; font-weight: 600"},
                  "✓ 영화 + 12곡 플레이리스트")))))),
      h("section", {"id": "faq", "style": "max-width: 900px; margin: 0 auto; padding: 0 24px 120px"},
        h("h2", {"style": "margin: 0 0 28px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(30px, 3.6vw, 44px)"},
          "자주 묻는 질문"),
        h("div", {"style": "display: flex; flex-direction: column; gap: 10px"},
          (v.faqs || []).map((f, $i_f) => [h("div", {"class": "fx-fade", "style": "border-radius: 18px; background: "+(v.T?.card ?? "")+"; border: 1px solid "+(v.T?.line ?? "")+"; padding: 0 24px"},
              h("button", {"onClick": f?.toggle, "aria-expanded": f?.expanded, "style": "width: 100%; min-height: 68px; padding: 18px 0; display: flex; justify-content: space-between; align-items: center; gap: 16px; background: transparent; border: none; color: "+(v.T?.fg ?? "")+"; font-size: 17px; font-family: inherit; text-align: left; cursor: pointer"},
                h("span", {},
                  (f?.q ?? "")),
                h("span", {"style": f?.iconStyle},
                  "+")),
              (f?.open) ? [h("p", {"style": "margin: 0 0 22px; font-size: 15px; line-height: 1.8; color: "+(v.T?.muted ?? "")},
                  (f?.a ?? ""))] : null)]))),
      h("section", {"id": "join", "style": "background: #0A0907; color: #F3EBDD; padding: 120px 24px; text-align: center"},
        h("p", {"style": "margin: 0; font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: 0.2em; color: "+(v.accent ?? "")},
          "NEXT SCREENING · 불이 다시 꺼지면"),
        h("h2", {"style": "margin: 20px auto 0; max-width: 860px; font-family: 'Nanum Myeongjo', serif; font-size: clamp(34px, 4.6vw, 62px); line-height: 1.22"},
          "다음 엔딩 크레딧이 올라갈 때,",
          h("br", {}),
          "당신의 기록도 함께."),
        h("p", {"style": "margin: 22px auto 0; max-width: 640px; font-size: 16px; line-height: 1.8; color: #CFC5B3"},
          "선택한 구성 ",
          h("strong", {"style": "color: "+(v.accent ?? "")},
            (v.summary ?? "")),
          h("br", {}),
          "멤버십 월 10,000원 · 사전 알림 신청자는 첫 달 무료와 각인 무료, 선착순 1,000명 프리미어 넘버까지"),
        h("form", {"style": "margin: 40px auto 0; max-width: 540px; text-align: left"},
          h("div", {"style": "display: flex; flex-wrap: wrap; gap: 10px; padding: 8px; border-radius: 999px; background: #14120E; border: 1px solid #3A3328"},
            h("label", {"for": "fx-email", "style": "position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0)"},
              "이메일 주소"),
            h("input", {"id": "fx-email", "type": "email", "placeholder": "이메일 주소", "style": "flex: 1 1 240px; min-width: 0; min-height: 50px; padding: 0 18px; border: none; border-radius: 999px; background: transparent; color: #F3EBDD; font-size: 16px; font-family: inherit"}),
            h("button", {"type": "button", "style": "min-height: 50px; padding: 0 26px; border: none; border-radius: 999px; background: "+(v.accent ?? "")+"; color: #16130F; font-size: 16px; font-weight: 700; font-family: inherit; cursor: pointer"},
              "알림 받기")),
          h("label", {"for": "fx-agree", "style": "margin-top: 14px; display: flex; gap: 10px; align-items: flex-start; font-size: 13px; line-height: 1.6; color: #B8AE9C; cursor: pointer"},
            h("input", {"id": "fx-agree", "type": "checkbox", "style": "width: 20px; height: 20px; margin: 1px 0 0; accent-color: #E9B04A; flex: none"}),
            "(필수) 출시 알림 발송을 위한 이메일 수집·이용에 동의합니다. ",
            h("a", {"href": "/privacy.html", "style": "color: #E3D8C4"},
              "개인정보처리방침")))),
      h("footer", {"id": "privacy", "style": "background: #0A0907; border-top: 1px solid #1E1B16; padding: 44px 24px 96px"},
        h("div", {"style": "max-width: 1280px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 28px; justify-content: space-between; font-size: 13px; color: #B8AE9C; line-height: 1.8"},
          h("div", {},
            h("div", {"style": "font-family: 'Nanum Myeongjo', serif; color: #F3EBDD; font-weight: 700; font-size: 17px"},
              "Soundtrack Credit"),
            h("div", {"style": "margin-top: 6px"},
              "#시네필기록 #영화OST여운 #영화촬영지성지순례 #디지털티켓북 #나만의영화관")),
          h("div", {},
            h("div", {},
              "[상호] · 대표 [대표자명] · 사업자등록번호 [000-00-00000]"),
            h("div", {},
              "통신판매업 신고 [제0000-지역-0000호] · [주소] · [고객센터 이메일]"),
            h("div", {"style": "margin-top: 4px; display: flex; gap: 16px"},
              h("a", {"href": "/terms.html", "style": "display: inline-flex; align-items: center; min-height: 44px; color: #E3D8C4"},
                "이용약관"),
              h("a", {"href": "/privacy.html", "style": "display: inline-flex; align-items: center; min-height: 44px; color: #E3D8C4"},
                "개인정보처리방침"))))));
};

SC.mount(h(Comp_Main, Object.assign({}, Comp_Main.defaults)), document.getElementById('app'));
window.dispatchEvent(new Event('sc:mounted'));
})();
