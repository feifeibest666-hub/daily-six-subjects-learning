(function (global) {
  const OUT = 'cubic-bezier(.22,1,.36,1)';
  const IN = 'cubic-bezier(.55,0,1,.45)';
  const INOUT = 'cubic-bezier(.65,0,.35,1)';
  const BACK = 'cubic-bezier(.34,1.56,.64,1)';
  const ANTICIP = 'cubic-bezier(.36,-0.4,.6,1)';

  function reduce() {
    const store = global.LKStore;
    const setting = store && store.get && store.get().settings.reduceMotion;
    const sys = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !!(setting || sys);
  }

  function syncRoot() {
    document.documentElement.classList.toggle('reduce', reduce());
  }

  let pressed = null;

  function pressDown(el) {
    if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.dataset.noPress === '1') return;
    pressed = el;
    if (el.classList.contains('opt') || el.classList.contains('swatch-opt') || el.classList.contains('listen-opt')) {
      el.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(.97)' }],
        { duration: 80, easing: OUT, fill: 'forwards' }
      );
      return;
    }
    if (reduce()) {
      el.animate([{ opacity: 1 }, { opacity: .72 }], { duration: 80, fill: 'forwards' });
      return;
    }
    el.animate(
      [{ transform: 'scale(1, 1)' }, { transform: 'scale(0.96, 0.92)' }],
      { duration: 80, easing: OUT, fill: 'forwards' }
    );
  }

  function pressUp() {
    const el = pressed;
    pressed = null;
    if (!el) return;
    if (el.classList.contains('opt') || el.classList.contains('swatch-opt') || el.classList.contains('listen-opt')) {
      if (reduce()) {
        el.animate([{ opacity: .7 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
        return;
      }
      el.animate(
        [{ transform: 'scale(.97)' }, { transform: 'scale(1)' }],
        { duration: 220, easing: BACK, fill: 'forwards' }
      );
      return;
    }
    if (reduce()) {
      el.animate([{ opacity: .72 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
      return;
    }
    el.animate(
      [
        { transform: 'scale(0.96, 0.92)' },
        { transform: 'scale(1, 1.04)', offset: .42 },
        { transform: 'scale(1, 0.99)', offset: .72 },
        { transform: 'scale(1, 1)' }
      ],
      { duration: 260, easing: BACK, fill: 'forwards' }
    );
  }

  function init() {
    syncRoot();
    document.addEventListener('pointerdown', function (e) {
      const el = e.target.closest && e.target.closest('button, a.tab, .pressable');
      if (el) pressDown(el);
    }, true);
    document.addEventListener('pointerup', pressUp, true);
    document.addEventListener('pointercancel', pressUp, true);
    if (global.matchMedia) {
      const mq = global.matchMedia('(prefers-reduced-motion: reduce)');
      if (mq.addEventListener) mq.addEventListener('change', syncRoot);
    }
  }

  function fade(el, from, to, ms) {
    return el.animate([{ opacity: from }, { opacity: to }], { duration: ms || 120, fill: 'forwards' }).finished;
  }

  function enter(el) {
    if (reduce()) return fade(el, 0, 1, 120);
    return el.animate(
      [{ transform: 'translateX(24px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }],
      { duration: 300, easing: OUT, fill: 'forwards' }
    ).finished;
  }

  function leave(el) {
    if (reduce()) return fade(el, 1, 0, 120);
    return el.animate(
      [{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(-12px)', opacity: 0 }],
      { duration: 180, easing: IN, fill: 'forwards' }
    ).finished;
  }

  function stagger(els, opts) {
    const list = Array.prototype.slice.call(els || []);
    const dur = (opts && opts.duration) || 360;
    const gap = (opts && opts.gap) || 60;
    const dy = (opts && opts.dy) || 16;
    list.forEach(function (el, i) {
      if (reduce()) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
        return;
      }
      el.animate(
        [{ transform: 'translateY(' + dy + 'px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
        { duration: dur, delay: i * gap, easing: OUT, fill: 'forwards' }
      );
    });
  }

  function shake(el) {
    if (!el) return;
    if (reduce()) {
      el.animate([{ opacity: 1 }, { opacity: .45 }, { opacity: 1 }], { duration: 120 });
      return;
    }
    el.animate(
      [
        { transform: 'translateX(0)', offset: 0 },
        { transform: 'translateX(-6px)', offset: .2 },
        { transform: 'translateX(6px)', offset: .4 },
        { transform: 'translateX(-4px)', offset: .6 },
        { transform: 'translateX(4px)', offset: .8 },
        { transform: 'translateX(0)', offset: 1 }
      ],
      { duration: 380, easing: 'linear' }
    );
  }

  function pop(el, ms) {
    if (!el) return;
    if (reduce()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
      return;
    }
    el.animate(
      [
        { transform: 'scale(0) rotate(-30deg)', opacity: 0 },
        { transform: 'scale(1.25) rotate(0deg)', opacity: 1, offset: .7 },
        { transform: 'scale(1) rotate(0deg)', opacity: 1 }
      ],
      { duration: ms || 420, easing: BACK, fill: 'forwards' }
    );
  }

  function bounce(el) {
    if (!el) return;
    if (reduce()) {
      el.animate([{ opacity: .65 }, { opacity: 1 }], { duration: 120 });
      return;
    }
    el.animate(
      [
        { transform: 'translateY(0) scaleY(1)' },
        { transform: 'translateY(-6px) scaleY(1.03)', offset: .45 },
        { transform: 'translateY(0) scaleY(1)' }
      ],
      { duration: 320, easing: BACK }
    );
  }

  function arcFly(fromEl, toEl, opts) {
    opts = opts || {};
    if (!fromEl || !toEl) return Promise.resolve();
    const a = fromEl.getBoundingClientRect();
    const b = toEl.getBoundingClientRect();
    const x0 = a.left + a.width / 2;
    const y0 = a.top + a.height / 2;
    const x1 = b.left + b.width / 2;
    const y1 = b.top + b.height / 2;
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2 - (opts.lift == null ? 120 : opts.lift);
    const owned = !opts.flyer;
    const flyer = opts.flyer || document.createElement('div');
    if (owned) {
      flyer.className = 'fly-star';
      flyer.textContent = opts.text || '★';
      document.body.appendChild(flyer);
    }
    const dur = opts.duration || 560;
    const scaleFrom = opts.scaleFrom == null ? 1 : opts.scaleFrom;
    const scaleTo = opts.scaleTo == null ? 0.6 : opts.scaleTo;
    if (reduce()) {
      flyer.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px) translate(-50%,-50%)';
      return flyer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120 }).finished.then(function () {
        flyer.remove();
      });
    }
    flyer.style.transform = 'translate(' + x0 + 'px,' + y0 + 'px) translate(-50%,-50%) scale(' + scaleFrom + ')';
    const t0 = performance.now();
    const ease = LK.ease.inout;
    return new Promise(function (resolve) {
      function frame(now) {
        const t = Math.min(1, (now - t0) / dur);
        const e = ease(t);
        const x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * cx + e * e * x1;
        const y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * cy + e * e * y1;
        const rot = (opts.rotate == null ? 200 : opts.rotate) * e;
        const sc = scaleFrom + (scaleTo - scaleFrom) * e;
        flyer.style.transform = 'translate(' + x + 'px,' + y + 'px) translate(-50%,-50%) rotate(' + rot + 'deg) scale(' + sc + ')';
        if (t < 1) requestAnimationFrame(frame);
        else { flyer.remove(); resolve(); }
      }
      requestAnimationFrame(frame);
    });
  }

  function confetti(originEl) {
    if (reduce() || !originEl) return;
    const r = originEl.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = r.top + r.height * 0.35;
    const colors = ['#E46A9C', '#C8664A', '#2F9E8F', '#D99A2B', '#7C6BD6', '#3D86D9', '#F2B640', '#E0795B'];
    const n = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < n; i++) {
      const p = document.createElement('i');
      p.className = 'confetti-bit';
      p.style.background = colors[i % colors.length];
      p.style.left = x + 'px';
      p.style.top = y + 'px';
      document.body.appendChild(p);
      const ang = -Math.PI * (0.2 + Math.random() * 0.7);
      const dir = i % 2 === 0 ? 1 : -1;
      const sp = 220 + Math.random() * 380;
      const vx = Math.cos(ang) * sp * dir * (0.45 + Math.random());
      const vy = -(240 + Math.random() * 420);
      const g = 980;
      const rot = Math.random() * 640 - 320;
      const t0 = performance.now();
      (function tick(now) {
        const sec = (now - t0) / 1000;
        const k = Math.min(1, (now - t0) / 1200);
        p.style.transform = 'translate(' + (vx * sec) + 'px,' + (vy * sec + 0.5 * g * sec * sec) + 'px) rotate(' + (rot * k) + 'deg)';
        p.style.opacity = String(1 - k);
        if (k < 1) requestAnimationFrame(tick);
        else p.remove();
      })(t0);
    }
  }

  function flip(el, swap) {
    if (!el) { swap(); return Promise.resolve(); }
    if (reduce()) {
      return fade(el, 1, 0, 120).then(function () {
        swap();
        return fade(el, 0, 1, 120);
      });
    }
    return el.animate(
      [{ transform: 'perspective(900px) rotateY(0deg) scale(1)' }, { transform: 'perspective(900px) rotateY(-6deg) scale(.98)' }],
      { duration: 120, easing: ANTICIP, fill: 'forwards' }
    ).finished.then(function () {
      return el.animate(
        [{ transform: 'perspective(900px) rotateY(-6deg) scale(.98)' }, { transform: 'perspective(900px) rotateY(90deg) scale(.98)' }],
        { duration: 160, easing: IN, fill: 'forwards' }
      ).finished;
    }).then(function () {
      swap();
      return el.animate(
        [{ transform: 'perspective(900px) rotateY(-90deg) scale(1)' }, { transform: 'perspective(900px) rotateY(0deg) scale(1)' }],
        { duration: 220, easing: OUT, fill: 'forwards' }
      ).finished;
    });
  }

  function stepIn(el) {
    if (!el) return;
    const bar = el.querySelector('.step-bar');
    if (reduce()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
      return;
    }
    el.animate(
      [
        { transform: 'translateY(10px) scale(.98)', opacity: 0 },
        { transform: 'translateY(0) scale(1)', opacity: 1 }
      ],
      { duration: 280, easing: OUT, fill: 'forwards' }
    );
    if (bar) {
      bar.animate(
        [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }],
        { duration: 240, delay: 80, easing: OUT, fill: 'forwards' }
      );
    }
  }

  function dim(el) {
    if (!el) return;
    el.classList.add('step-past');
  }

  function growX(el) {
    if (!el) return;
    el.style.transformOrigin = 'left center';
    if (reduce()) {
      el.style.transform = 'scaleX(1)';
      return;
    }
    el.animate(
      [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
      { duration: 300, delay: 80, easing: OUT, fill: 'forwards' }
    );
  }

  function revealRows(panel, opts) {
    opts = opts || {};
    if (!panel) return;
    const dur = opts.duration || 360;
    const delay = opts.delay || 0;
    function run() {
      panel.hidden = false;
      if (reduce()) {
        panel.style.gridTemplateRows = '1fr';
        panel.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
        return;
      }
      panel.animate(
        [{ gridTemplateRows: '0fr' }, { gridTemplateRows: '1fr' }],
        { duration: dur, easing: OUT, fill: 'forwards' }
      );
    }
    if (delay) setTimeout(run, delay);
    else run();
  }

  function pinDrop(el) {
    if (!el) return;
    if (reduce()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
      return;
    }
    el.animate(
      [
        { transform: 'translateY(-40px) scale(1, 1)', opacity: 0 },
        { transform: 'translateY(0) scale(1.2, .7)', opacity: 1, offset: .72 },
        { transform: 'translateY(0) scale(1, 1)', opacity: 1 }
      ],
      { duration: 440, easing: BACK, fill: 'forwards' }
    );
    const ripple = el.querySelector('.ripple');
    if (ripple) {
      ripple.animate(
        [{ transform: 'scale(.4)', opacity: .5 }, { transform: 'scale(1.6)', opacity: 0 }],
        { duration: 600, easing: OUT, fill: 'forwards' }
      );
    }
  }

  function lightTile(tile, neighbors) {
    if (!tile) return;
    const veil = tile.querySelector('.tile-veil');
    if (veil) {
      veil.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduce() ? 120 : 240, easing: OUT, fill: 'forwards' });
    }
    tile.classList.add('is-lit');
    if (reduce()) return;
    tile.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.12)', offset: .55 }, { transform: 'scale(1)' }],
      { duration: 300, easing: BACK }
    );
    (neighbors || []).forEach(function (n, i) {
      n.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.04)', offset: .5 }, { transform: 'scale(1)' }],
        { duration: 220, delay: 40 * (i + 1), easing: OUT }
      );
    });
  }

  function flipNum(el, text) {
    if (!el) return;
    if (reduce()) { el.textContent = text; return; }
    el.animate(
      [
        { transform: 'translateY(0)', opacity: 1 },
        { transform: 'translateY(-80%)', opacity: 0, offset: .45 },
        { transform: 'translateY(60%)', opacity: 0, offset: .55 },
        { transform: 'translateY(0)', opacity: 1 }
      ],
      { duration: 320, easing: BACK }
    );
    setTimeout(function () { el.textContent = text; }, 140);
  }

  function nod(svg) {
    if (!svg) return;
    const body = svg.querySelector('.mascot-bob') || svg;
    if (reduce()) {
      body.animate([{ opacity: .7 }, { opacity: 1 }], { duration: 120 });
      return;
    }
    body.animate(
      [
        { transform: 'translateY(0) rotate(0deg)' },
        { transform: 'translateY(4px) rotate(-6deg)', offset: .45 },
        { transform: 'translateY(0) rotate(0deg)' }
      ],
      { duration: 280, easing: INOUT }
    );
  }

  function rebound(el) {
    if (!el || reduce()) return;
    el.animate(
      [
        { transform: 'scale(0.96, 0.92)' },
        { transform: 'scale(1, 1.04)', offset: .42 },
        { transform: 'scale(1, 0.99)', offset: .72 },
        { transform: 'scale(1, 1)' }
      ],
      { duration: 260, easing: BACK }
    );
  }

  function partsIn(container) {
    if (!container) return;
    const parts = Array.prototype.slice.call(container.querySelectorAll(':scope > .k-part'));
    const check = container.querySelector(':scope > .check');
    parts.forEach(function (el, i) {
      el.style.opacity = '0';
      if (reduce()) {
        el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
        return;
      }
      el.animate(
        [{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
        { duration: 240, delay: i * 70, easing: OUT, fill: 'forwards' }
      );
      el.querySelectorAll('.derive-line').forEach(function (line, j) {
        line.animate(
          [{ transform: 'translateY(8px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
          { duration: 240, delay: i * 70 + j * 50, easing: OUT, fill: 'forwards' }
        );
      });
    });
    if (check) {
      check.style.opacity = '0';
      const lastStart = parts.length ? (parts.length - 1) * 70 + 240 : 0;
      const delay = reduce() ? 0 : lastStart + 120;
      if (reduce()) {
        check.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: delay, fill: 'forwards' });
      } else {
        check.animate(
          [
            { transform: 'translateY(10px) scale(.98)', opacity: 0 },
            { transform: 'translateY(0) scale(1)', opacity: 1 }
          ],
          { duration: 260, delay: delay, easing: BACK, fill: 'forwards' }
        );
      }
    }
  }

  function aheadIn(el) {
    if (!el) return;
    el.style.opacity = '0';
    if (reduce()) {
      el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
      return;
    }
    el.animate(
      [{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'translateY(0)', opacity: 1 }],
      { duration: 360, delay: 200, easing: OUT, fill: 'forwards' }
    );
  }

  function celebrateMascot(svg) {
    if (!svg) return;
    const body = svg.querySelector('.mascot-bob');
    const flag = svg.querySelector('.note-flag');
    if (!body) return;
    body.classList.add('no-bob');
    if (reduce()) {
      body.animate([{ opacity: .55 }, { opacity: 1 }], { duration: 120 });
      setTimeout(function () { body.classList.remove('no-bob'); }, 140);
      return;
    }
    body.animate(
      [
        { transform: 'translateY(0) scale(1, 1)', offset: 0 },
        { transform: 'translateY(2px) scale(1.06, .9)', offset: 100 / 520 },
        { transform: 'translateY(-14px) scale(.96, 1.08)', offset: 280 / 520 },
        { transform: 'translateY(0) scale(1.04, .92)', offset: 420 / 520 },
        { transform: 'translateY(0) scale(1, 1)', offset: 1 }
      ],
      { duration: 520, easing: BACK }
    );
    if (flag) {
      flag.animate(
        [
          { transform: 'rotate(0deg)', offset: 0 },
          { transform: 'rotate(-16deg)', offset: .55 },
          { transform: 'rotate(6deg)', offset: .82 },
          { transform: 'rotate(0deg)', offset: 1 }
        ],
        { duration: 580, delay: 60, easing: OUT }
      );
    }
    setTimeout(function () { body.classList.remove('no-bob'); }, 700);
  }

  async function playChest(chest, lid, spawnCard) {
    if (!chest || !lid) { if (spawnCard) spawnCard(); return; }
    if (reduce()) {
      lid.style.transform = 'perspective(600px) rotateX(70deg) translateY(-6px)';
      if (spawnCard) spawnCard();
      return;
    }
    await chest.animate(
      [
        { transform: 'rotate(0deg)' },
        { transform: 'rotate(-4deg)', offset: .25 },
        { transform: 'rotate(4deg)', offset: .5 },
        { transform: 'rotate(-4deg)', offset: .75 },
        { transform: 'rotate(0deg)' }
      ],
      { duration: 300, easing: 'linear' }
    ).finished;
    const lidAnim = lid.animate(
      [
        { transform: 'perspective(600px) rotateX(0deg) translateY(0px)' },
        { transform: 'perspective(600px) rotateX(78deg) translateY(-10px)', offset: .72 },
        { transform: 'perspective(600px) rotateX(70deg) translateY(-6px)' }
      ],
      { duration: 420, easing: BACK, fill: 'forwards' }
    );
    confetti(chest);
    await LK.wait(300);
    if (spawnCard) spawnCard();
    try { await lidAnim.finished; } catch (e) {}
  }

  global.LKMotion = {
    init: init,
    reduce: reduce,
    syncRoot: syncRoot,
    enter: enter,
    leave: leave,
    stagger: stagger,
    shake: shake,
    pop: pop,
    bounce: bounce,
    arcFly: arcFly,
    confetti: confetti,
    flip: flip,
    stepIn: stepIn,
    dim: dim,
    growX: growX,
    revealRows: revealRows,
    pinDrop: pinDrop,
    lightTile: lightTile,
    flipNum: flipNum,
    celebrateMascot: celebrateMascot,
    nod: nod,
    rebound: rebound,
    partsIn: partsIn,
    aheadIn: aheadIn,
    playChest: playChest
  };
})(window);
