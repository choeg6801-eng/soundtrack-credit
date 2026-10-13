/*
 * Soundtrack Credit — tiny UI runtime (no dependencies).
 * h() builds virtual nodes; components re-render on setState and the DOM is
 * patched in place, so inputs keep focus and timers/audio keep running.
 */
(function () {
  'use strict';
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function flatten(list, out) {
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c == null || c === false || c === true) continue;
      if (Array.isArray(c)) flatten(c, out);
      else out.push(typeof c === 'object' ? c : String(c));
    }
    return out;
  }

  function h(type, props) {
    var kids = flatten(Array.prototype.slice.call(arguments, 2), []);
    return { type: type, props: props || {}, children: kids };
  }

  /* ── component base ─────────────────────────────── */
  var queue = [];
  var scheduled = false;
  function flush() {
    scheduled = false;
    var q = queue; queue = [];
    for (var i = 0; i < q.length; i++) { var c = q[i]; c._queued = false; if (c._mounted) rerender(c); }
  }
  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (partial) {
    var next = typeof partial === 'function' ? partial(this.state, this.props) : partial;
    this.state = Object.assign({}, this.state, next);
    if (!this._queued) { this._queued = true; queue.push(this); }
    if (!scheduled) { scheduled = true; Promise.resolve().then(flush); }
  };
  DCLogic.prototype.forceUpdate = function () { this.setState({}); };
  DCLogic.prototype.render = function () { return this.__tpl(this.renderVals()); };

  function rerender(comp) {
    var next;
    try { next = comp.render(); } catch (e) { console.error(e); return; }
    var parent = comp._dom && comp._dom.parentNode;
    var dom = patch(parent, comp._dom, comp._vnode, next, comp._svg);
    comp._vnode = next;
    comp._dom = dom;
  }

  /* ── props ──────────────────────────────────────── */
  function eventName(dom, key) {
    var name = key.slice(2).toLowerCase();
    if (name === 'change' && dom.tagName === 'INPUT' && (dom.type === 'text' || dom.type === 'range' || dom.type === 'email')) name = 'input';
    return name;
  }
  function setProp(dom, key, value, old, svg) {
    if (key === 'key') return;
    if (key[0] === 'o' && key[1] === 'n') {
      var ev = eventName(dom, key);
      dom._h = dom._h || {};
      if (!dom._h[ev] && typeof value === 'function') {
        dom.addEventListener(ev, function (e) { var f = dom._h[ev]; if (f) f(e); });
      }
      dom._h[ev] = typeof value === 'function' ? value : null;
      return;
    }
    if (key === 'value' && !svg) { if (dom.value !== String(value == null ? '' : value)) dom.value = value == null ? '' : value; return; }
    if (key === 'checked') { dom.checked = !!value; return; }
    if (typeof value === 'boolean' && key.slice(0, 5) === 'aria-') { dom.setAttribute(key, String(value)); return; }
    if (value == null || value === false) { dom.removeAttribute(key); return; }
    dom.setAttribute(key, value === true ? '' : value);
  }
  function setProps(dom, props, oldProps, svg) {
    var k;
    for (k in oldProps) if (!(k in props)) setProp(dom, k, null, oldProps[k], svg);
    for (k in props) if (props[k] !== oldProps[k] || k === 'value') setProp(dom, k, props[k], oldProps[k], svg);
  }

  /* ── create / patch / remove ────────────────────── */
  function create(v, svg) {
    if (typeof v === 'string') return document.createTextNode(v);
    if (typeof v.type === 'function') {
      var comp = new v.type(v.props);
      comp.props = v.props;
      var out = comp.render();
      comp._svg = svg;
      comp._vnode = out;
      comp._dom = create(out, svg);
      comp._mounted = true;
      v._comp = comp;
      if (comp.componentDidMount) Promise.resolve().then(function () { comp.componentDidMount(); });
      return comp._dom;
    }
    var isSvg = svg || v.type === 'svg';
    var dom = isSvg ? document.createElementNS(SVG_NS, v.type) : document.createElement(v.type);
    setProps(dom, v.props, {}, isSvg);
    var childSvg = isSvg && v.type !== 'foreignObject';
    for (var i = 0; i < v.children.length; i++) dom.appendChild(create(v.children[i], childSvg));
    return dom;
  }

  function unmount(v) {
    if (!v || typeof v === 'string') return;
    if (v._comp) {
      var c = v._comp; c._mounted = false;
      if (c.componentWillUnmount) { try { c.componentWillUnmount(); } catch (e) { console.error(e); } }
      unmount(c._vnode);
      return;
    }
    for (var i = 0; i < v.children.length; i++) unmount(v.children[i]);
  }

  function patch(parent, dom, oldV, newV, svg) {
    if (typeof oldV === 'string' && typeof newV === 'string') {
      if (oldV !== newV) dom.nodeValue = newV;
      return dom;
    }
    if (typeof oldV === 'string' || typeof newV === 'string' || oldV.type !== newV.type) {
      var fresh = create(newV, svg);
      unmount(oldV);
      if (parent) parent.replaceChild(fresh, dom);
      return fresh;
    }
    if (typeof newV.type === 'function') {
      var comp = oldV._comp;
      newV._comp = comp;
      comp.props = newV.props;
      var out = comp.render();
      comp._dom = patch(parent, comp._dom, comp._vnode, out, svg);
      comp._vnode = out;
      return comp._dom;
    }
    var isSvg = svg || newV.type === 'svg';
    setProps(dom, newV.props, oldV.props, isSvg);
    var childSvg = isSvg && newV.type !== 'foreignObject';
    var oc = oldV.children, nc = newV.children, nodes = Array.prototype.slice.call(dom.childNodes);
    var n = Math.max(oc.length, nc.length);
    for (var i = 0; i < n; i++) {
      if (i >= nc.length) { unmount(oc[i]); dom.removeChild(nodes[i]); }
      else if (i >= oc.length) dom.appendChild(create(nc[i], childSvg));
      else patch(dom, nodes[i], oc[i], nc[i], childSvg);
    }
    return dom;
  }

  function mount(vnode, container) {
    container.textContent = '';
    container.appendChild(create(vnode, false));
  }

  window.SC = { h: h, DCLogic: DCLogic, mount: mount };
})();
