/* 사전 알림 신청 폼: 이메일·동의 확인 후 Supabase(waitlist 표)에 저장합니다.
   Supabase 가 아직 연결되지 않았으면 SC_FORM_ENDPOINT(예: Formspree)로 보내고, 그것도 없으면 안내만 보여 줍니다. */
(function () {
  'use strict';
  function msgBox(form) {
    var el = form.querySelector('.sc-join-msg');
    if (!el) {
      el = document.createElement('p');
      el.className = 'sc-join-msg';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      form.appendChild(el);
    }
    return el;
  }

  function send(form) {
    var email = form.querySelector('#fx-email');
    var agree = form.querySelector('#fx-agree');
    var box = msgBox(form);
    var value = (email.value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { box.textContent = '이메일 주소를 다시 확인해 주세요.'; email.focus(); return; }
    if (!agree.checked) { box.textContent = '이메일 수집·이용에 동의해 주세요.'; agree.focus(); return; }
    var choice = document.querySelector('#join strong');
    var payload = { email: value, choice: choice ? choice.textContent.slice(0, 120) : null, agreed: true };
    box.textContent = '보내는 중…';
    config().then(function (cfg) {
      if (cfg && cfg.supabaseUrl) {
        return fetch(cfg.supabaseUrl + '/rest/v1/rpc/join_waitlist', {
          method: 'POST',
          headers: { apikey: cfg.supabaseAnonKey, Authorization: 'Bearer ' + cfg.supabaseAnonKey, 'Content-Type': 'application/json' },
          body: JSON.stringify({ p_email: payload.email, p_choice: payload.choice })
        }).then(function (r) { return r.ok ? r.status : Promise.reject(r.status); });
      }
      var endpoint = window.SC_FORM_ENDPOINT;
      if (!endpoint) return 'later';
      return fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) })
        .then(function (r) { return r.ok ? r.status : Promise.reject(r.status); });
    }).then(function (status) {
      if (status === 'later') { box.textContent = '사전 알림 신청은 곧 열려요. 조금만 기다려 주세요.'; return; }
      box.textContent = '신청이 완료됐어요. 출시 소식을 가장 먼저 보내 드릴게요.';
      email.value = ''; agree.checked = false;
    }).catch(function () {
      box.textContent = '전송에 실패했어요. 잠시 후 다시 시도해 주세요.';
    });
  }

  var cfgPromise = null;
  function config() {
    if (!cfgPromise) {
      cfgPromise = fetch('/api/config').then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; });
    }
    return cfgPromise;
  }

  document.addEventListener('submit', function (e) {
    if (!e.target.closest('#join')) return;
    e.preventDefault();
    send(e.target);
  });
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('#join form button');
    if (btn) send(btn.closest('form'));
    /* 모바일 메뉴: 링크를 누르면 메뉴를 닫습니다. */
    if (e.target.closest('.fx-links.fx-open a')) {
      var menu = document.querySelector('.fx-menu-btn');
      if (menu) menu.click();
    }
    /* 페이지 안 이동 링크: 주소에 #앵커를 남기지 않고 부드럽게 이동합니다.
       (주소에 #voice 등이 남으면 새로고침할 때마다 그 위치로 자동 스크롤됩니다) */
    var link = e.target.closest('a[href^="#"]');
    if (link && !e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
      var id = link.getAttribute('href').slice(1);
      var target = id === 'top' || !id ? null : document.getElementById(id);
      e.preventDefault();
      var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    }
  });
})();
