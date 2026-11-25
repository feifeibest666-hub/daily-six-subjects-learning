(function (global) {
  const MIN = -2600;
  const MAX = 2000;
  const SCALES = [
    { id: 'millennium', label: '千年', px: 0.24, tick: 500 },
    { id: 'century', label: '百年', px: 1.05, tick: 100 },
    { id: 'decade', label: '十年', px: 3.4, tick: 20 }
  ];

  function lanes(list) {
    const items = list.slice().sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    const ends = [];
    items.forEach(function (d) {
      let lane = -1;
      for (let i = 0; i < ends.length; i++) {
        if (ends[i] <= d.start) { lane = i; break; }
      }
      if (lane < 0) { lane = ends.length; ends.push(d.end); }
      else ends[lane] = Math.max(ends[lane], d.end);
      d.lane = lane;
    });
    return items;
  }

  function mount() {
    const screen = LK.h('div', { class: 'screen timeline-screen' });
    screen.appendChild(LK.h('header', { class: 'topbar' }, [
      LK.h('div', { class: 'top-kicker', text: '时间轴' })
    ]));
    let scale = 0;
    const zoom = LK.h('div', { class: 'zoom-row' });
    const scroller = LK.h('div', { class: 'tl-scroll' });
    const canvas = LK.h('div', { class: 'tl-canvas' });
    const labels = LK.h('div', { class: 'tl-labels' }, [
      LK.h('span', { class: 'tl-lane-label is-cn', text: '中国' }),
      LK.h('span', { class: 'tl-lane-label is-world', text: '世界' })
    ]);
    scroller.appendChild(canvas);
    scroller.appendChild(labels);
    screen.appendChild(zoom);
    screen.appendChild(scroller);
    screen.appendChild(LK.h('p', { class: 'map-note', text: '上轨是中国，下轨是世界。虚线是还没学到的朝代。' }));

    let x = 0;
    let focused = false;
    let pointers = {};

    function latestLearnedYear() {
      let best = null;
      (DAYS || []).forEach(function (day) {
        if (!day.lessons) return;
        SUBJECT_ORDER.forEach(function (s) {
          const les = day.lessons[s];
          if (!les || !les.pins) return;
          les.pins.forEach(function (pin, i) {
            const pid = les.id + '#' + i;
            if (LKStore.get().pins.indexOf(pid) < 0) return;
            if (best == null || pin.year > best) best = pin.year;
          });
        });
      });
      return best == null ? -500 : best;
    }

    function focusLearned() {
      const sc = SCALES[scale];
      const view = scroller.clientWidth || 350;
      x = view / 2 - xOf(latestLearnedYear(), sc.px);
      clamp();
    }

    function xOf(year, px) { return (year - MIN) * px; }

    function draw() {
      const sc = SCALES[scale];
      const width = Math.ceil((MAX - MIN) * sc.px) + 40;
      canvas.style.width = width + 'px';
      canvas.innerHTML = '';
      const china = LK.h('div', { class: 'tl-china' });
      const axis = LK.h('div', { class: 'tl-axis' });
      const world = LK.h('div', { class: 'tl-world' });
      const dyns = lanes(DYNASTIES.map(function (d) { return Object.assign({}, d); }));
      dyns.forEach(function (d) {
        const learned = LKCatalog.dynastyLearned(d.name);
        const left = xOf(d.start, sc.px);
        const w = Math.max(8, xOf(d.end, sc.px) - left);
        const band = LK.h('button', {
          class: 'band' + (learned ? ' is-solid' : ' is-dashed'),
          style: { left: left + 'px', width: w + 'px', top: (52 + d.lane * 28) + 'px' }
        });
        band.textContent = w < 36 ? d.name.slice(0, 1) : (d.approx ? '约' + d.name : d.name);
        band.addEventListener('click', function () { openDynasty(d, learned); });
        china.appendChild(band);
      });
      (DAYS || []).forEach(function (day) {
        if (!day.lessons) return;
        SUBJECT_ORDER.forEach(function (s) {
          const les = day.lessons[s];
          if (!les || !les.pins) return;
          les.pins.forEach(function (pin, i) {
            const pid = les.id + '#' + i;
            if (LKStore.get().pins.indexOf(pid) < 0) return;
            if (pin.kind === 'dynasty') return;
            const host = pin.track === 'world' ? world : china;
            const pinEl = LK.h('button', {
              class: 'pin ' + (pin.track === 'world' ? 'is-world' : 'is-cn'),
              style: { left: xOf(pin.year, sc.px) + 'px', top: ((i % 2) * 18) + 'px' }
            });
            pinEl.appendChild(LK.h('span', { class: 'pin-label', text: pin.label }));
            pinEl.appendChild(LK.h('span', { class: 'pin-stem' }));
            const dot = LK.h('span', { class: 'pin-dot' }, [LK.h('i', { class: 'ripple' })]);
            pinEl.appendChild(dot);
            pinEl.addEventListener('click', function () { openPin(les, pin); });
            host.appendChild(pinEl);
            requestAnimationFrame(function () { LKMotion.pinDrop(dot); });
          });
        });
      });
      for (let y = Math.ceil(MIN / sc.tick) * sc.tick; y <= MAX; y += sc.tick) {
        const tick = LK.h('span', { class: 'tick', style: { left: xOf(y, sc.px) + 'px' } });
        tick.appendChild(LK.h('i'));
        tick.appendChild(LK.h('b', { class: 'num', text: LK.yearText(y) }));
        axis.appendChild(tick);
      }
      canvas.appendChild(china);
      canvas.appendChild(axis);
      canvas.appendChild(world);
      if (!focused) {
        focused = true;
        focusLearned();
      }
      clamp();
      canvas.style.transform = 'translateX(' + x + 'px)';
    }

    function clamp() {
      const width = canvas.offsetWidth;
      if (!width) return;
      const view = scroller.clientWidth || 350;
      const minX = Math.min(0, view - width - 8);
      x = LK.clamp(x, minX, 0);
    }

    function openDynasty(d, learned) {
      const dayNum = learned ? +learned.id.slice(1, 3) : (d.lesson ? +d.lesson.slice(1, 3) : 0);
      LKSheet.open(function (body) {
        body.appendChild(LK.h('h2', { class: 'sheet-title', text: (d.approx ? '约 ' : '') + d.name }));
        body.appendChild(LK.h('p', { class: 'sheet-copy num', text: LK.yearText(d.start) + ' — ' + LK.yearText(d.end) }));
        if (learned) {
          body.appendChild(LK.h('p', { class: 'sheet-copy', text: learned.take }));
          const btn = LK.h('button', { class: 'btn btn-primary', text: '回看这一关' });
          btn.addEventListener('click', function () { location.hash = '#/review/' + dayNum + '/history'; });
          body.appendChild(btn);
        } else {
          body.appendChild(LK.h('p', { class: 'sheet-copy', text: dayNum ? '还没学到。第 ' + dayNum + ' 天见。' : '还没学到。第 15 天以后接着讲。' }));
        }
      });
    }

    function openPin(les, pin) {
      const dayNum = +les.id.slice(1, 3);
      const subject = les.id.split('-')[1];
      LKSheet.open(function (body) {
        body.appendChild(LK.h('h2', { class: 'sheet-title', text: pin.label }));
        body.appendChild(LK.h('p', { class: 'sheet-copy num', text: LK.yearText(pin.year) }));
        body.appendChild(LK.h('p', { class: 'sheet-copy', text: les.take }));
        const btn = LK.h('button', { class: 'btn btn-primary', text: '回看这一关' });
        btn.addEventListener('click', function () { location.hash = '#/review/' + dayNum + '/' + subject; });
        body.appendChild(btn);
      });
    }

    SCALES.forEach(function (sc, i) {
      const b = LK.h('button', { class: 'zoom-btn' + (i === scale ? ' is-on' : ''), text: sc.label });
      b.addEventListener('click', function () {
        scale = i;
        zoom.querySelectorAll('.zoom-btn').forEach(function (n, k) { n.classList.toggle('is-on', k === scale); });
        draw();
      });
      zoom.appendChild(b);
    });

    let drag = null;
    let vel = 0;
    scroller.addEventListener('pointerdown', function (e) {
      pointers[e.pointerId] = e.clientX;
      drag = { x: e.clientX, origin: x, t: performance.now(), last: e.clientX };
      vel = 0;
      try { scroller.setPointerCapture(e.pointerId); } catch (err) {}
    });
    scroller.addEventListener('pointermove', function (e) {
      if (pointers[e.pointerId] != null) pointers[e.pointerId] = e.clientX;
      const ids = Object.keys(pointers);
      if (ids.length >= 2) {
        const dist = Math.abs(pointers[ids[0]] - pointers[ids[1]]);
        if (!scroller._pinch) scroller._pinch = dist;
        else if (dist > scroller._pinch * 1.28 && scale < 2) { scale += 1; scroller._pinch = dist; draw(); syncZoom(); }
        else if (dist < scroller._pinch * 0.78 && scale > 0) { scale -= 1; scroller._pinch = dist; draw(); syncZoom(); }
        return;
      }
      if (!drag) return;
      const now = performance.now();
      const dx = e.clientX - drag.last;
      const dt = Math.max(16, now - drag.t);
      vel = dx / dt;
      drag.last = e.clientX;
      drag.t = now;
      x = drag.origin + (e.clientX - drag.x);
      clamp();
      canvas.style.transform = 'translateX(' + x + 'px)';
    });
    function endPointer(e) {
      delete pointers[e.pointerId];
      if (Object.keys(pointers).length < 2) scroller._pinch = null;
      if (!drag) return;
      drag = null;
      const view = scroller.clientWidth || 350;
      const minX = Math.min(0, view - canvas.offsetWidth - 8);
      const dest = LK.clamp(x + vel * 420, minX, 0);
      const from = x;
      const t0 = performance.now();
      function frame(now) {
        const t = Math.min(1, (now - t0) / 600);
        const e = LK.ease.out(t);
        x = from + (dest - from) * e;
        canvas.style.transform = 'translateX(' + x + 'px)';
        if (t < 1) requestAnimationFrame(frame);
      }
      if (!LKMotion.reduce()) requestAnimationFrame(frame);
      else { x = dest; canvas.style.transform = 'translateX(' + x + 'px)'; }
    }
    scroller.addEventListener('pointerup', endPointer);
    scroller.addEventListener('pointercancel', endPointer);
    function syncZoom() {
      zoom.querySelectorAll('.zoom-btn').forEach(function (n, k) { n.classList.toggle('is-on', k === scale); });
    }
    draw();
    let settleTries = 0;
    function settle() {
      settleTries += 1;
      if ((!scroller.isConnected || !scroller.clientWidth || !canvas.offsetWidth) && settleTries < 40) {
        requestAnimationFrame(settle);
        return;
      }
      focusLearned();
      canvas.style.transform = 'translateX(' + x + 'px)';
    }
    requestAnimationFrame(settle);
    return screen;
  }

  global.LKTimeline = { mount: mount };
})(window);
