/* 소개 페이지에서 바로 로그인·회원가입 → 성공하면 내 티켓북(/app/)으로 이동합니다.
   로그인 정보는 앱과 같은 형식으로 저장해서, 앱에서 다시 로그인할 필요가 없어요. */
(function () {
  'use strict';
  var SESSION_KEY = 'sc.session';
  var PKCE_KEY = 'sc.pkce';
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var ERR = {
    invalid_credentials: '이메일 또는 비밀번호가 맞지 않아요.',
    invalid_grant: '이메일 또는 비밀번호가 맞지 않아요.',
    email_not_confirmed: '메일함에서 가입 확인 링크를 먼저 눌러 주세요.',
    user_already_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
    email_exists: '이미 가입된 이메일이에요. 로그인해 주세요.',
    weak_password: '비밀번호는 8자 이상, 영문과 숫자를 섞어 주세요.',
    over_email_send_rate_limit: '메일을 너무 자주 요청했어요. 잠시 후 다시 시도해 주세요.',
    over_request_rate_limit: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.',
    email_provider_disabled: '지금은 이메일 가입을 받지 않고 있어요.',
    signup_disabled: '지금은 신규 가입을 받지 않고 있어요.'
  };

  function loggedIn() {
    try { var s = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); return !!(s && s.refresh_token); } catch (e) { return false; }
  }
  var cfgP = null;
  function config() {
    if (!cfgP) cfgP = fetch('/api/config').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    return cfgP;
  }
  function saveSession(d) {
    var exp = d.expires_at || Math.floor(Date.now() / 1000) + Number(d.expires_in || 3600);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ access_token: d.access_token, refresh_token: d.refresh_token, expires_at: exp, user: d.user })); } catch (e) { /* 저장 불가 */ }
  }
  function pkce() {
    var abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    var buf = new Uint8Array(56); crypto.getRandomValues(buf);
    var v = Array.prototype.map.call(buf, function (b) { return abc[b % abc.length]; }).join('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)).then(function (d) {
      var bin = String.fromCharCode.apply(null, new Uint8Array(d));
      try { localStorage.setItem(PKCE_KEY, JSON.stringify({ v: v, t: 'signup', at: Date.now() })); } catch (e) { /* 무시 */ }
      return { code_challenge: btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''), code_challenge_method: 's256' };
    });
  }
  function call(cfg, path, body) {
    return fetch(cfg.supabaseUrl + path, {
      method: 'POST',
      headers: { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    }).then(function (r) { return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) { d = null; } return { ok: r.ok, data: d || {} }; }); });
  }
  function errText(d, fallback) {
    var code = d.error_code || d.code || d.error || '';
    return ERR[code] || d.msg || d.error_description || fallback;
  }

  /* ── 화면 ─────────────────────────────── */
  var css = '' +
    '.scl-back{position:fixed;inset:0;z-index:200;background:rgba(5,4,3,.72);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}' +
    '.scl{width:100%;max-width:420px;max-height:calc(100vh - 32px);overflow:auto;background:#14120E;color:#F3EBDD;border:1px solid #3A3328;border-radius:24px;padding:28px 24px;box-shadow:0 30px 80px rgba(0,0,0,.6);font-family:"IBM Plex Sans KR",system-ui,sans-serif;word-break:keep-all}' +
    '.scl h2{margin:6px 0 18px;font-family:"Nanum Myeongjo",serif;font-size:26px;line-height:1.3}' +
    '.scl .k{margin:0;font-family:"IBM Plex Mono",monospace;font-size:12px;letter-spacing:.16em;color:#E9B04A}' +
    '.scl .seg{display:grid;grid-template-columns:1fr 1fr;padding:4px;border-radius:999px;background:#0A0907;border:1px solid #2C2720;margin-bottom:18px}' +
    '.scl .seg button{min-height:44px;border:0;border-radius:999px;background:transparent;color:#BDB3A1;font:inherit;font-weight:600;cursor:pointer}' +
    '.scl .seg button[aria-pressed="true"]{background:#E9B04A;color:#16130F}' +
    '.scl label{display:block;font-size:13px;color:#BDB3A1;margin:0 0 12px}' +
    '.scl input{display:block;width:100%;box-sizing:border-box;margin-top:6px;min-height:50px;padding:0 16px;border-radius:14px;border:1px solid #3E372C;background:#0A0907;color:#F3EBDD;font:inherit;font-size:16px}' +
    '.scl input:focus{outline:none;border-color:#E9B04A;box-shadow:0 0 0 3px rgba(233,176,74,.18)}' +
    '.scl .go{width:100%;min-height:52px;margin-top:6px;border:0;border-radius:999px;background:#E9B04A;color:#16130F;font:inherit;font-size:16px;font-weight:700;cursor:pointer}' +
    '.scl .go:disabled{opacity:.6;cursor:wait}' +
    '.scl .msg{min-height:20px;margin:12px 0 0;font-size:14px;line-height:1.6;color:#EE8467}' +
    '.scl .msg.ok{color:#E9B04A}' +
    '.scl .links{display:flex;flex-wrap:wrap;gap:6px 16px;margin-top:14px;font-size:13px}' +
    '.scl .links a{color:#E3D8C4;display:inline-flex;align-items:center;min-height:44px}' +
    '.scl .x{float:right;width:44px;height:44px;margin:-14px -10px 0 0;border:0;background:transparent;color:#BDB3A1;font-size:26px;cursor:pointer;border-radius:50%}' +
    '.scl .fine{font-size:12px;color:#968C7A;margin:8px 0 0;line-height:1.6}' +
    '.scl .fine a{color:#E3D8C4}';

  var root = null, lastFocus = null;
  function close() {
    if (!root) return;
    root.remove(); root = null;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function open() {
    if (root) return;
    lastFocus = document.activeElement;
    if (!document.getElementById('scl-css')) { var st = document.createElement('style'); st.id = 'scl-css'; st.textContent = css; document.head.appendChild(st); }
    root = document.createElement('div');
    root.className = 'scl-back';
    root.innerHTML =
      '<div class="scl" role="dialog" aria-modal="true" aria-labelledby="scl-h">' +
      '<button type="button" class="x" aria-label="닫기">×</button>' +
      '<p class="k">MY TICKET BOOK</p><h2 id="scl-h">나의 티켓북 열기</h2>' +
      '<div class="seg" role="group" aria-label="로그인 또는 가입"><button type="button" data-tab="in" aria-pressed="true">로그인</button><button type="button" data-tab="up" aria-pressed="false">회원가입</button></div>' +
      '<form novalidate>' +
      '<label>이메일<input type="email" name="email" autocomplete="email" inputmode="email" placeholder="you@example.com" required></label>' +
      '<label><span class="pwl">비밀번호</span><input type="password" name="pw" autocomplete="current-password" required></label>' +
      '<button class="go" type="submit">로그인</button>' +
      '<p class="fine up-only" hidden>가입하면 <a href="/terms.html" target="_blank" rel="noopener">이용약관</a>과 <a href="/privacy.html" target="_blank" rel="noopener">개인정보처리방침</a>에 동의하는 것으로 봅니다.</p>' +
      '<p class="msg" role="status" aria-live="polite"></p>' +
      '</form>' +
      '<div class="links"><a href="/app/">비밀번호 없이 메일 링크로 로그인</a><a href="/app/">비밀번호를 잊었어요</a></div>' +
      '</div>';
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';

    var tab = 'in';
    var form = root.querySelector('form');
    var msg = root.querySelector('.msg');
    var go = root.querySelector('.go');
    var pw = form.elements.pw;
    function setTab(t) {
      tab = t;
      root.querySelectorAll('.seg button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-tab') === t)); });
      go.textContent = t === 'in' ? '로그인' : '가입하고 시작하기';
      root.querySelector('.pwl').textContent = t === 'in' ? '비밀번호' : '비밀번호 (8자 이상, 영문+숫자)';
      pw.setAttribute('autocomplete', t === 'in' ? 'current-password' : 'new-password');
      root.querySelector('.up-only').hidden = t !== 'up';
      msg.textContent = ''; msg.className = 'msg';
    }
    root.querySelectorAll('.seg button').forEach(function (b) { b.addEventListener('click', function () { setTab(b.getAttribute('data-tab')); }); });
    root.querySelector('.x').addEventListener('click', close);
    root.addEventListener('mousedown', function (e) { if (e.target === root) close(); });
    document.addEventListener('keydown', onKey);
    function onKey(e) {
      if (!root) { document.removeEventListener('keydown', onKey); return; }
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') { // 대화상자 안에서만 이동
        var f = root.querySelectorAll('button, input, a[href]');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    setTimeout(function () { form.elements.email.focus(); }, 30);

    config().then(function (cfg) {
      if (cfg && cfg.supabaseUrl) return;
      // 서버가 아직 연결되지 않은 경우: 체험 모드 안내
      root.querySelector('.seg').remove(); form.remove(); root.querySelector('.links').remove();
      var p = document.createElement('div');
      p.innerHTML = '<p style="color:#BDB3A1;line-height:1.7;margin:0 0 16px">지금은 체험 모드예요. 로그인 없이 이 브라우저에서 바로 써 볼 수 있어요.</p><a class="go" href="/app/" style="display:flex;align-items:center;justify-content:center;text-decoration:none">체험 시작하기</a>';
      root.querySelector('.scl').appendChild(p);
      p.querySelector('a').focus();
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (form.elements.email.value || '').trim();
      var pass = pw.value || '';
      msg.className = 'msg';
      if (!EMAIL.test(email)) { msg.textContent = '이메일 주소를 확인해 주세요.'; return; }
      if (tab === 'up' && (pass.length < 8 || !/[A-Za-z]/.test(pass) || !/\d/.test(pass))) { msg.textContent = '비밀번호는 8자 이상, 영문과 숫자를 섞어 주세요.'; return; }
      if (tab === 'in' && !pass) { msg.textContent = '비밀번호를 입력해 주세요.'; return; }
      go.disabled = true; msg.textContent = '잠시만요…';
      config().then(function (cfg) {
        if (!cfg || !cfg.supabaseUrl) { location.href = '/app/'; return null; }
        if (tab === 'in') return call(cfg, '/auth/v1/token?grant_type=password', { email: email, password: pass });
        return pkce().then(function (p) {
          return call(cfg, '/auth/v1/signup?redirect_to=' + encodeURIComponent(location.origin + '/app/'), { email: email, password: pass, code_challenge: p.code_challenge, code_challenge_method: p.code_challenge_method });
        });
      }).then(function (r) {
        if (!r) return;
        go.disabled = false;
        if (!r.ok) { msg.textContent = errText(r.data, tab === 'in' ? '로그인하지 못했어요.' : '가입하지 못했어요.'); return; }
        if (r.data.access_token) { saveSession(r.data); msg.className = 'msg ok'; msg.textContent = '티켓북을 여는 중…'; location.href = '/app/'; return; }
        var ids = r.data.identities || (r.data.user && r.data.user.identities);
        if (Array.isArray(ids) && ids.length === 0) { msg.textContent = ERR.user_already_exists; return; }
        msg.className = 'msg ok';
        msg.textContent = email + ' 로 가입 확인 메일을 보냈어요. 메일의 링크를 누르면 바로 시작돼요.';
      }).catch(function () { go.disabled = false; msg.textContent = '인터넷 연결을 확인해 주세요.'; });
    });
  }

  // 소개 페이지의 "로그인 / 시작하기" 버튼: 로그인 상태면 바로 티켓북, 아니면 로그인 창
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-sc-login]');
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    if (loggedIn()) { location.href = '/app/'; return; }
    open();
  }, true);

  window.SC_openLogin = open;
})();
