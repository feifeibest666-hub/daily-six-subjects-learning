(function (global) {
  const types = {};
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  const BG = {
    cnmap: '#EAF4F6',
    profileTrip: '#F7F1E8',
    plates: '#F7F1E8',
    globe3d: '#152B3A',
    grid: '#F4EEE6',
    comic: '#FBF7F1'
  };

  function register(type, def) { types[type] = def; }
  function has(type) { return !!types[type]; }

  function merge(a, b) {
    const o = {};
    if (a) Object.keys(a).forEach(function (k) { o[k] = a[k]; });
    if (!b) return o;
    Object.keys(b).forEach(function (k) {
      const bv = b[k];
      const av = o[k];
      if (bv && typeof bv === 'object' && !Array.isArray(bv) && av && typeof av === 'object' && !Array.isArray(av)) o[k] = merge(av, bv);
      else o[k] = bv;
    });
    return o;
  }

  function framesOf(visual) {
    if (!visual) return [];
    if (visual.panels && visual.panels.length) return visual.panels;
    return visual.frames || [];
  }

  function stateAt(visual, index) {
    let s = merge({}, visual.base || {});
    const frames = framesOf(visual);
    for (let i = 0; i <= index && i < frames.length; i++) s = merge(s, frames[i].set || {});
    return s;
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>]/g, function (c) {
      return c === '&' ? '&amp;' : (c === '<' ? '&lt;' : '&gt;');
    });
  }

  function capHtml(s) {
    return esc(s).replace(/\*\*([^*]+)\*\*/g, '<b class="cap-key">$1</b>');
  }

  function nocaption() {
    const q = (global.location && (location.search + location.hash)) || '';
    return q.indexOf('nocaption=1') >= 0;
  }

  function reducedNow(opts) {
    if (opts && opts.reduced != null) return !!opts.reduced;
    return !!(global.LKMotion && LKMotion.reduce && LKMotion.reduce());
  }

  function paras(step, frames) {
    const slots = [];
    function push(key, label, text, extra) {
      if (text == null || text === '') return;
      slots.push({ key: key, label: label, text: text, extra: extra || '' });
    }
    push('idea', '白话', step.idea);
    push('why', '为什么', step.why);
    push('example', step.exLabel || '举个例子', step.example);
    (step.derive || []).forEach(function (line, i) {
      slots.push({ key: 'derive', index: i, label: '推一下', text: line, extra: ' k-derive' });
    });
    if (step.formula) push('formula', '', step.formula, ' formula num');
    push('takeaway', '一句话', step.takeaway, ' k-take');
    const list = frames && frames.length ? frames : [{}];
    const n = list.length;
    const assigned = [];
    for (let i = 0; i < n; i++) assigned.push([]);
    const used = [];
    function take(pred) {
      for (let i = 0; i < slots.length; i++) {
        if (used[i]) continue;
        if (pred(slots[i])) { used[i] = true; return slots[i]; }
      }
      return null;
    }
    list.forEach(function (f, i) {
      const has = f && Object.prototype.hasOwnProperty.call(f, 'para');
      const p = has ? f.para : undefined;
      if (!has) {
        if (i === 0) { const s = take(function (x) { return x.key === 'idea'; }); if (s) assigned[i].push(s); }
        else if (i === 1) { const s = take(function (x) { return x.key === 'why'; }); if (s) assigned[i].push(s); }
        else if (i === 2) { const s = take(function (x) { return x.key === 'example'; }); if (s) assigned[i].push(s); }
        else if (i === n - 1) { const s = take(function (x) { return x.key === 'takeaway'; }); if (s) assigned[i].push(s); }
        else {
          const a = take(function (x) { return x.key === 'derive'; });
          const b = take(function (x) { return x.key === 'derive'; });
          if (a) assigned[i].push(a);
          if (b) assigned[i].push(b);
        }
        return;
      }
      if (p == null || p === 'none') return;
      const keys = Array.isArray(p) ? p : [p];
      keys.forEach(function (key) {
        if (key === 'derive') {
          const a = take(function (x) { return x.key === 'derive'; });
          if (a) assigned[i].push(a);
        } else {
          const s = take(function (x) { return x.key === key; });
          if (s) assigned[i].push(s);
        }
      });
    });
    slots.forEach(function (s, i) { if (!used[i]) assigned[n - 1].push(s); });
    return assigned;
  }

  function materialize(visual) {
    if (!visual || !visual.recall || !global.LKCatalog) return visual;
    const bits = String(visual.recall).split('#');
    const lesson = LKCatalog.lessonById(bits[0]);
    const step = lesson && lesson.steps && lesson.steps[+bits[1] || 0];
    if (!step || !step.visual || step.visual.recall) return visual;
    const src = materialize(step.visual);
    return {
      type: src.type,
      stage: src.stage,
      base: src.base,
      frames: src.frames,
      panels: src.panels,
      hotspots: src.hotspots,
      recallOf: visual.recall
    };
  }

  function mount(el, visual, opts) {
    opts = opts || {};
    visual = materialize(visual) || visual;
    const reduced = reducedNow(opts);
    const typeName = visual.type || (visual.panels ? 'comic' : '');
    const def = types[typeName];
    function frameList() { return framesOf(live.visual); }
    const box = LK.h('div', { class: 'stage-box' + (opts.poster ? ' is-poster' : ''), 'data-type': typeName });
    const stage = LK.h('div', { class: 'viz-stage' });
    stage.style.background = BG[typeName] || 'var(--soft)';
    const svg = LK.svg('svg', {
      viewBox: (def && def.viewBox) || '0 0 342 260',
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      focusable: 'false'
    });
    svg.style.fontFamily = FONT;
    if (nocaption()) svg.classList.add('is-nocaption');
    stage.appendChild(svg);
    const toggle = LK.h('div', { class: 'comic-toggle', hidden: true });
    const scrub = LK.h('div', { class: 'stage-scrub', hidden: true });
    const scrubVal = LK.h('span', { class: 'scrub-val' });
    const range = LK.h('input', { type: 'range', min: '0', max: '1000', value: '0', 'aria-label': '拖动进度' });
    const ticks = LK.h('div', { class: 'scrub-ticks' });
    scrub.appendChild(scrubVal);
    scrub.appendChild(range);
    scrub.appendChild(ticks);
    const ctrl = LK.h('div', { class: 'stage-ctrl' });
    const prev = LK.h('button', { class: 'stage-btn stage-prev', type: 'button', 'aria-label': '上一帧', text: '‹' });
    const dots = LK.h('div', { class: 'stage-dots' });
    const next = LK.h('button', { class: 'stage-btn stage-next', type: 'button', 'aria-label': '下一帧' });
    next.innerHTML = '<span aria-hidden="true">›</span>';
    ctrl.appendChild(prev);
    ctrl.appendChild(dots);
    ctrl.appendChild(next);
    const cap = LK.h('p', { class: 'stage-cap', 'aria-live': 'polite' });
    box.appendChild(toggle);
    box.appendChild(stage);
    box.appendChild(scrub);
    box.appendChild(ctrl);
    box.appendChild(cap);
    el.appendChild(box);

    let index = 0;
    let built = false;
    let destroyed = false;
    let playing = false;
    let raf = 0;
    let holdTimer = 0;
    let held = false;
    let sheet = false;
    let seenEnd = false;
    let current = merge({}, visual.base || {});
    const live = { visual: visual, opts: opts };

    function ctx(frame) {
      return {
        frame: frame,
        index: index,
        visual: live.visual,
        reduced: reduced,
        sheet: sheet,
        nocaption: nocaption()
      };
    }

    function stop() {
      playing = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function ensure() {
      if (built || !def) return;
      built = true;
      if (def.viewBox) svg.setAttribute('viewBox', def.viewBox);
      if (def.build) def.build(svg, live.visual.base || {}, live.visual);
    }

    function paintDots() {
      dots.innerHTML = '';
      const n = Math.max(1, frameList().length);
      for (let i = 0; i < n; i++) {
        const b = LK.h('button', {
          class: 'stage-dot' + (i === index ? ' is-now' : '') + (i < index ? ' is-seen' : ''),
          type: 'button',
          'aria-label': '第 ' + (i + 1) + ' 帧'
        });
        b.addEventListener('click', function () { go(i); });
        dots.appendChild(b);
      }
    }

    function labelOf(scrub, value) {
      if (!scrub) return '';
      if (scrub.format) return scrub.format(value);
      if (Math.abs(value) >= 100) return String(Math.round(value));
      if (scrub.unit === '°') {
        const n = Math.round(value);
        return (n < 0 ? '南纬 ' : '北纬 ') + Math.abs(n) + '°';
      }
      return String(Math.round(value * 100) / 100);
    }

    function showScrub(frame, state) {
      const sc = frame && frame.scrub;
      if (!sc || opts.poster) { scrub.hidden = true; return; }
      scrub.hidden = false;
      const from = sc.from == null ? 0 : sc.from;
      const to = sc.to == null ? 1 : sc.to;
      const cur = state[sc.key];
      const u = to === from ? 0 : (cur == null ? 0 : (cur - from) / (to - from));
      range.value = String(Math.round(Math.max(0, Math.min(1, u)) * 1000));
      scrubVal.textContent = labelOf(sc, cur == null ? from : cur);
      ticks.innerHTML = '';
      (sc.tickLabels || []).forEach(function (name) {
        ticks.appendChild(LK.h('span', { text: name }));
      });
      range.oninput = function () {
        const t = (+range.value) / 1000;
        const val = from + (to - from) * t;
        current = merge(current, {});
        current[sc.key] = val;
        scrubVal.textContent = labelOf(sc, val);
        if (def && def.apply) def.apply(svg, current, 1, ctx(frame));
      };
      range.onchange = function () {
        if (!sc.ticks || !sc.ticks.length || reduced) return;
        const t = (+range.value) / 1000;
        const val = from + (to - from) * t;
        let best = sc.ticks[0];
        let bd = Infinity;
        sc.ticks.forEach(function (tick) {
          const d = Math.abs(tick - val);
          if (d < bd) { bd = d; best = tick; }
        });
        const start = val;
        const t0 = performance.now();
        function snap(now) {
          const u2 = Math.min(1, (now - t0) / 160);
          const e = reduced ? 1 : (1 - Math.pow(1 - u2, 3));
          const v = start + (best - start) * e;
          current[sc.key] = v;
          const uu = to === from ? 0 : (v - from) / (to - from);
          range.value = String(Math.round(uu * 1000));
          scrubVal.textContent = labelOf(sc, v);
          if (def && def.apply) def.apply(svg, current, 1, ctx(frame));
          if (u2 < 1 && !reduced) requestAnimationFrame(snap);
        }
        requestAnimationFrame(snap);
      };
    }

    function applyAt(state, tween, frame) {
      if (def && def.apply) def.apply(svg, state, tween, ctx(frame));
    }

    function tweenTo(frame) {
      const from = merge({}, svg._shown || {});
      const to = current;
      if (reduced || opts.poster) {
        applyAt(to, 1, frame);
        svg._shown = merge({}, to);
        return;
      }
      const t0 = performance.now();
      function loop(now) {
        if (destroyed || !svg.isConnected) return;
        const u = Math.min(1, (now - t0) / 320);
        const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
        applyAt(to, e, frame);
        if (def && def.blend) def.blend(svg, from, to, e);
        if (u < 1) raf = requestAnimationFrame(loop);
        else svg._shown = merge({}, to);
      }
      stop();
      raf = requestAnimationFrame(loop);
    }

    function runPlay(frame) {
      if (!frame || !frame.play || !def || !def.anim || !def.anim[frame.play]) return;
      const fn = def.anim[frame.play];
      if (reduced || opts.poster) {
        fn(svg, 1, current, { apply: function (partial) {
          current = merge(current, partial);
          applyAt(current, 1, frame);
        }, reduced: true });
        svg._shown = merge({}, current);
        return;
      }
      const dur = frame.dur || 1600;
      const t0 = performance.now();
      playing = true;
      next.setAttribute('aria-label', '暂停');
      next.innerHTML = '<span aria-hidden="true">❚❚</span>';
      function loop(now) {
        if (!playing || destroyed || !svg.isConnected) return;
        const t = Math.min(1, (now - t0) / dur);
        fn(svg, t, current, { apply: function (partial) {
          current = merge(current, partial);
          applyAt(current, 1, frame);
          showScrub(frame, current);
        }, reduced: false });
        if (t < 1) raf = requestAnimationFrame(loop);
        else {
          playing = false;
          svg._shown = merge({}, current);
          next.setAttribute('aria-label', '播放');
          next.innerHTML = '<span aria-hidden="true">▶</span>';
        }
      }
      raf = requestAnimationFrame(loop);
    }

    function syncToggle() {
      const comic = typeName === 'comic';
      if (!comic) { toggle.hidden = true; return; }
      toggle.hidden = !seenEnd;
      toggle.innerHTML = '';
      if (!seenEnd) return;
      ['单格', '整页'].forEach(function (name, i) {
        const on = (i === 1) === sheet;
        const b = LK.h('button', { class: 'comic-mode' + (on ? ' is-on' : ''), type: 'button', text: name });
        b.addEventListener('click', function () {
          sheet = i === 1;
          applyAt(current, 1, frameList()[index] || {});
          syncToggle();
        });
        toggle.appendChild(b);
      });
    }

    function show(i, mode) {
      if (!frameList().length) return;
      index = Math.max(0, Math.min(frameList().length - 1, i));
      ensure();
      stop();
      const frame = frameList()[index] || {};
      current = stateAt(live.visual, index);
      if (index === frameList().length - 1) seenEnd = true;
      const hookLike = typeName === 'comic' && frameList().every(function (f) { return !f || f.para == null; });
      if (hookLike && index === frameList().length - 1 && !opts.poster) sheet = true;
      cap.innerHTML = capHtml(frame.cap || '');
      svg.setAttribute('aria-label', frame.cap || live.visual.type || '');
      paintDots();
      const playable = frame.play && !reduced && !opts.poster;
      next.setAttribute('aria-label', playable ? '播放' : '下一帧');
      next.innerHTML = playable ? '<span aria-hidden="true">▶</span>' : '<span aria-hidden="true">›</span>';
      prev.disabled = index === 0;
      if (frame.play) runPlay(frame);
      else if (mode === 'jump' || reduced || opts.poster) {
        applyAt(current, 1, frame);
        svg._shown = merge({}, current);
      } else tweenTo(frame);
      showScrub(frame, current);
      syncToggle();
      if (frame.hotspot && def && def.openHot) def.openHot(svg, frame.hotspot, reduced || opts.poster);
      if (live.opts.onFrame) live.opts.onFrame(index, { last: index === frameList().length - 1, frame: frame });
    }

    function go(i) { show(i, 'tween'); }
    function goNext() {
      if (index < frameList().length - 1) { go(index + 1); return; }
      if (live.opts.onPastEnd) live.opts.onPastEnd();
    }

    prev.addEventListener('click', function () { if (index > 0) go(index - 1); });

    function armHold() {
      held = false;
      clearTimeout(holdTimer);
      holdTimer = setTimeout(function () {
        held = true;
        stop();
        seenEnd = true;
        show(frameList().length - 1, 'jump');
        if (live.opts.onExpandAll) live.opts.onExpandAll();
      }, 600);
    }
    function clearHold() { clearTimeout(holdTimer); }
    next.addEventListener('pointerdown', armHold);
    next.addEventListener('pointerup', clearHold);
    next.addEventListener('pointerleave', clearHold);
    next.addEventListener('click', function () {
      if (held) { held = false; return; }
      const frame = frameList()[index] || {};
      if (frame.play && !reduced && !opts.poster) {
        if (playing) { stop(); next.setAttribute('aria-label', '播放'); next.innerHTML = '<span aria-hidden="true">▶</span>'; return; }
        runPlay(frame);
        return;
      }
      goNext();
    });

    svg.addEventListener('click', function (ev) {
      const hit = ev.target.closest ? ev.target.closest('[data-hot]') : null;
      if (!hit || !def || !def.openHot) return;
      def.openHot(svg, hit.getAttribute('data-hot'), false);
      box.dispatchEvent(new CustomEvent('lk-hot', { bubbles: true, detail: { id: hit.getAttribute('data-hot'), label: hit.getAttribute('data-label') || '' } }));
    });

    function onScroll() {
      if (!stage.isConnected) return;
      const top = stage.getBoundingClientRect().top;
      stage.classList.toggle('is-mini', top <= 53 && top >= 40);
    }
    global.addEventListener('scroll', onScroll, { passive: true });

    const api = {
      root: box,
      svg: svg,
      go: go,
      next: goNext,
      prev: function () { if (index > 0) go(index - 1); },
      play: function () { runPlay(frameList()[index]); },
      pause: stop,
      scrubTo: function (t) {
        const frame = frameList()[index] || {};
        const sc = frame.scrub;
        if (!sc) return;
        const from = sc.from == null ? 0 : sc.from;
        const to = sc.to == null ? 1 : sc.to;
        current[sc.key] = from + (to - from) * t;
        applyAt(current, 1, frame);
        showScrub(frame, current);
      },
      load: function (nextVisual, nextOpts) {
        live.visual = materialize(nextVisual) || nextVisual;
        if (nextOpts) live.opts = Object.assign({}, live.opts, nextOpts);
        built = false;
        svg._shown = merge({}, current);
        const vb = types[live.visual.type] && types[live.visual.type].viewBox;
        if (vb) svg.setAttribute('viewBox', vb);
        if (def && def.build) def.build(svg, live.visual.base || {}, live.visual);
        built = true;
        seenEnd = false;
        sheet = false;
        show(0, reduced ? 'jump' : 'tween');
      },
      destroy: function () {
        destroyed = true;
        stop();
        global.removeEventListener('scroll', onScroll);
        if (box.parentNode) box.parentNode.removeChild(box);
      },
      index: function () { return index; }
    };
    box._api = api;

    const start = opts.start != null ? opts.start : 0;
    queueMicrotask(function () {
      if (destroyed) return;
      show(start, (reduced || opts.poster) ? 'jump' : 'tween');
    });
    return api;
  }

  function poster(el, visual, opts) {
    const vis = materialize(visual) || visual;
    const frames = framesOf(vis);
    return mount(el, vis, Object.assign({}, opts || {}, {
      poster: true,
      reduced: true,
      start: Math.max(0, frames.length - 1)
    }));
  }

  function roll(el, from, to, ms, reduced) {
    if (!el) return;
    if (reduced) { el.textContent = String(Math.round(to)); return; }
    const t0 = performance.now();
    function loop(now) {
      const u = Math.min(1, (now - t0) / (ms || 400));
      el.textContent = String(Math.round(from + (to - from) * u));
      if (u < 1) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  global.LKStage = {
    register: register,
    has: has,
    mount: mount,
    poster: poster,
    merge: merge,
    stateAt: stateAt,
    paras: paras,
    framesOf: framesOf,
    materialize: materialize,
    font: FONT,
    roll: roll,
    nocaption: nocaption
  };
})(window);
