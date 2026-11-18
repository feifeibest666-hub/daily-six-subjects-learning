(function (global) {
  function h(tag, attrs, children) {
    const n = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      const v = attrs[k];
      if (v == null || v === false) return;
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(n.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') n.addEventListener(k.slice(2).toLowerCase(), v);
      else n.setAttribute(k, v === true ? '' : String(v));
    });
    if (tag === 'button' && !attrs.type) n.type = 'button';
    (Array.isArray(children) ? children : []).forEach(function (c) {
      if (c == null || c === false) return;
      if (typeof c === 'string' || typeof c === 'number') n.appendChild(document.createTextNode(String(c)));
      else n.appendChild(c);
    });
    return n;
  }

  function svgEl(tag, attrs, children) {
    const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function pad2(n) { return String(n).padStart(2, '0'); }

  function lessonId(day, subject) {
    return 'd' + pad2(day) + '-' + subject;
  }

  function todayStr(d) {
    const x = d || new Date();
    return x.getFullYear() + '-' + pad2(x.getMonth() + 1) + '-' + pad2(x.getDate());
  }

  function parseDate(s) {
    const p = s.split('-').map(Number);
    return new Date(p[0], p[1] - 1, p[2]);
  }

  function addDays(s, n) {
    const d = parseDate(s);
    d.setDate(d.getDate() + n);
    return todayStr(d);
  }

  function isSunday(s) { return parseDate(s).getDay() === 0; }

  function missedDayList(last, today) {
    const out = [];
    if (!last || !today || last >= today) return out;
    let c = addDays(last, 1);
    while (c < today) {
      if (!isSunday(c)) out.push(c);
      c = addDays(c, 1);
    }
    return out;
  }

  function formatDuration(ms) {
    const s = Math.max(0, Math.round((ms || 0) / 1000));
    return Math.floor(s / 60) + ' 分 ' + (s % 60) + ' 秒';
  }

  function fmtNum(n) {
    if (typeof n === 'string') return n;
    if (!isFinite(n)) return '—';
    const r = Math.round(n * 100) / 100;
    if (Math.abs(r - Math.round(r)) < 1e-9) return String(Math.round(r));
    return String(r);
  }

  function hashStr(s) {
    let hsh = 2166136261;
    const str = String(s);
    for (let i = 0; i < str.length; i++) {
      hsh ^= str.charCodeAt(i);
      hsh = Math.imul(hsh, 16777619);
    }
    return hsh >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function shuffleIdx(n, seed) {
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(i);
    const rnd = mulberry32(hashStr(seed));
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr;
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  function rich(text) {
    const frag = document.createDocumentFragment();
    String(text == null ? '' : text).split('**').forEach(function (part, i) {
      if (!part) return;
      if (i % 2 === 1) frag.appendChild(h('strong', { class: 'term', text: part }));
      else frag.appendChild(document.createTextNode(part));
    });
    return frag;
  }

  function stepSummary(s) {
    if (!s) return '';
    if (s.title) return s.title + (s.takeaway ? '：' + s.takeaway : '');
    return s.text || '';
  }

  function bezier(x1, y1, x2, y2) {
    const cx = 3 * x1;
    const bx = 3 * (x2 - x1) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    function sampleX(u) { return ((ax * u + bx) * u + cx) * u; }
    function sampleY(u) { return ((ay * u + by) * u + cy) * u; }
    function sampleDX(u) { return (3 * ax * u + 2 * bx) * u + cx; }
    return function (t) {
      let u = t;
      for (let i = 0; i < 6; i++) {
        const z = sampleX(u) - t;
        const d = sampleDX(u);
        if (Math.abs(d) < 1e-6) break;
        u -= z / d;
      }
      u = clamp(u, 0, 1);
      return sampleY(Math.max(0, Math.min(1, u)));
    };
  }

  const ease = {
    out: bezier(.22, 1, .36, 1),
    in: bezier(.55, 0, 1, .45),
    inout: bezier(.65, 0, .35, 1),
    back: bezier(.34, 1.56, .64, 1)
  };

  function yearText(y) {
    if (y < 0) return '前' + Math.abs(y);
    return String(y);
  }

  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function canSpeak() {
    if (global.__ttsBroken) return false;
    return typeof global.speechSynthesis !== 'undefined' && typeof global.SpeechSynthesisUtterance !== 'undefined';
  }

  function speak(text, rate) {
    if (!canSpeak()) return false;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'en-US';
      u.rate = rate || 0.9;
      u.onerror = function () { global.__ttsBroken = true; };
      global.speechSynthesis.cancel();
      global.speechSynthesis.speak(u);
      return true;
    } catch (e) {
      global.__ttsBroken = true;
      return false;
    }
  }

  global.LK = {
    h: h,
    svg: svgEl,
    pad2: pad2,
    lessonId: lessonId,
    todayStr: todayStr,
    addDays: addDays,
    isSunday: isSunday,
    missedDayList: missedDayList,
    formatDuration: formatDuration,
    fmtNum: fmtNum,
    hashStr: hashStr,
    shuffleIdx: shuffleIdx,
    clamp: clamp,
    rich: rich,
    stepSummary: stepSummary,
    ease: ease,
    yearText: yearText,
    wait: wait,
    canSpeak: canSpeak,
    speak: speak
  };
})(window);
