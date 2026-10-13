/* 사전 알림 신청 폼: 이메일·동의 확인 후 SC_FORM_ENDPOINT로 전송합니다. */
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
    var endpoint = window.SC_FORM_ENDPOINT;
    if (!endpoint) { box.textContent = '사전 알림 신청은 곧 열려요. 조금만 기다려 주세요.'; return; }
    var choice = document.querySelector('#join strong');
    box.textContent = '보내는 중…';
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ email: value, choice: choice ? choice.textContent : '', agreed: true })
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      box.textContent = '신청이 완료됐어요. 출시 소식을 가장 먼저 보내 드릴게요.';
      email.value = ''; agree.checked = false;
    }).catch(function () {
      box.textContent = '전송에 실패했어요. 잠시 후 다시 시도해 주세요.';
    });
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
  });
})();
