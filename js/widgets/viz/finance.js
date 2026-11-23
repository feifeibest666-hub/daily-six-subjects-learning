(function (global) {
  const GOLD = '#D99A2B';
  const INK = '#3A302A';
  const MUTED = '#6E655C';
  const BAD = '#C04A3A';
  const LINE = '#E7E0D6';
  const FONT = '-apple-system, "PingFang SC", "Noto Sans SC", sans-serif';

  function el(tag, attrs, text) {
    const n = LK.svg(tag, attrs || {});
    if (text != null) n.textContent = text;
    return n;
  }
  function T(g, x, y, value, size, fill, anchor) {
    g.appendChild(el('text', {
      x: x, y: y, 'text-anchor': anchor || 'middle', 'font-size': size || 12,
      'font-weight': 650, fill: fill || INK, 'font-family': FONT
    }, value));
  }
  function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
  function reg(type, box, draw) {
    LKStage.register(type, {
      viewBox: box,
      build: function () {},
      apply: function (svg, state, tween) { clear(svg); draw(svg, state || {}, tween == null ? 1 : tween); },
      anim: {
        grow: function (svg, t, state, api) { api.apply({ play: t }); },
        draw: function (svg, t, state, api) { api.apply({ play: t }); },
        sweep: function (svg, t, state, api) { api.apply({ play: t }); },
        main: function (svg, t, state, api) { api.apply({ play: t }); }
      }
    });
  }

  reg('columns', '0 0 300 190', function (g, state) {
    g.appendChild(el('rect', { width: 300, height: 190, fill: '#FCF1DC' }));
    const items = state.items || [];
    const play = state.play == null ? 1 : state.play;
    const vals = items.map(function (it) { return +it.value || 0; });
    let min = 0, max = 1;
    vals.forEach(function (v) { if (v < min) min = v; if (v > max) max = v; });
    const span = (max - min) || 1;
    const top = 18, bot = 142;
    const zero = bot - ((0 - min) / span) * (bot - top);
    const flash = state.flash || '';
    g.appendChild(el('line', { x1: 36, y1: zero, x2: 286, y2: zero, stroke: flash === 'zero' ? GOLD : INK, 'stroke-width': flash === 'zero' ? 4 : 1.5 }));
    if (min < 0) T(g, 28, zero + 4, '0', 11, MUTED, 'end');
    const slot = items.length ? 250 / items.length : 80;
    items.forEach(function (it, i) {
      const v = (+it.value || 0) * play;
      const h = Math.abs(v) / span * (bot - top);
      const x = 42 + i * slot + slot * 0.2;
      const w = slot * 0.6;
      const y = v >= 0 ? zero - h : zero;
      const hot = flash && String(it.label || '').indexOf(flash) >= 0;
      g.appendChild(el('rect', {
        x: x, y: y, width: w, height: Math.max(1, h), rx: 4,
        fill: v < 0 ? BAD : (it.color || GOLD),
        stroke: hot ? '#3A302A' : 'none', 'stroke-width': hot ? 3 : 0,
        opacity: flash && flash !== 'zero' && !hot ? 0.35 : 1
      }));
      let vy = v >= 0 ? y - 4 : y + h + 12;
      if (v < 0 && vy > 148) vy = y - 16;
      T(g, x + w / 2, vy, String(it.value), 12, INK);
      const label = String(it.label || '');
      T(g, x + w / 2, 162, label.slice(0, 6), 11, INK);
      if (label.length > 6) T(g, x + w / 2, 176, label.slice(6, 12), 11, INK);
    });
    if (state.avgLine) {
      const ay = bot - ((state.avgLine.value - min) / span) * (bot - top);
      g.appendChild(el('line', { x1: 36, y1: ay, x2: 270, y2: ay, stroke: MUTED, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }));
      T(g, 286, ay, state.avgLine.label || '', 11, MUTED, 'end');
    }
    if (state.unit) {
      const unit = String(state.unit).replace(/[（(。.].*$/, '').slice(0, 3);
      if (unit) T(g, 286, 14, unit, 11, MUTED, 'end');
    }
  });

  reg('line', '0 0 300 190', function (g, state) {
    g.appendChild(el('rect', { width: 300, height: 190, fill: '#FCF1DC' }));
    const series = state.series || [];
    const ticks = state.xTicks || [];
    let max = state.yMax || 1;
    series.forEach(function (s) { (s.points || []).forEach(function (p) { if (p > max) max = p; }); });
    max *= state.yMax ? 1 : 1.1;
    for (let i = 0; i < 4; i++) {
      const y = 20 + i * 32;
      g.appendChild(el('line', { x1: 36, y1: y, x2: 280, y2: y, stroke: LINE, 'stroke-width': 1 }));
      T(g, 32, y + 3, String(Math.round(max * (1 - i / 3))), 10, MUTED, 'end');
    }
    ticks.forEach(function (t, i) {
      const x = 46 + (ticks.length < 2 ? 0 : i * (220 / (ticks.length - 1)));
      T(g, x, 168, t, 10, MUTED);
    });
    const play = state.play == null ? 1 : state.play;
    series.forEach(function (s, si) {
      const pts = s.points || [];
      const shown = Math.max(1, Math.round(pts.length * play));
      let d = '';
      pts.slice(0, shown).forEach(function (p, i) {
        const x = 46 + (pts.length < 2 ? 0 : i * (220 / (pts.length - 1)));
        const y = 148 - (p / max) * 120;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1) + ' ';
        g.appendChild(el('circle', { cx: x, cy: y, r: 3, fill: s.color || (si ? MUTED : GOLD) }));
      });
      g.appendChild(el('path', {
        d: d, fill: 'none', stroke: s.color || (si ? MUTED : GOLD), 'stroke-width': 2.5,
        'stroke-dasharray': s.dashed || si ? '6 4' : null
      }));
      if (pts.length) T(g, 270, 30 + si * 16, (s.label || '') + ' ' + pts[pts.length - 1], 11, s.color || INK, 'end');
    });
  });

  reg('pie', '0 0 260 200', function (g, state) {
    g.appendChild(el('rect', { width: 260, height: 200, fill: '#FCF1DC' }));
    const slices = state.slices || [];
    const colors = ['#D99A2B', '#F0C36B', '#E8D9BF', '#C9A27E'];
    const sum = slices.reduce(function (a, s) { return a + (+s.value || 0); }, 0) || 1;
    const play = state.play == null ? 1 : state.play;
    let ang = -Math.PI / 2;
    const limit = play * Math.PI * 2;
    let drawn = 0;
    slices.forEach(function (s, i) {
      const sweep = (+s.value || 0) / sum * Math.PI * 2;
      const use = Math.max(0, Math.min(sweep, limit - drawn));
      if (use > 0.01) {
        const a0 = ang, a1 = ang + use;
        const large = use > Math.PI ? 1 : 0;
        const x0 = 100 + Math.cos(a0) * 72, y0 = 100 + Math.sin(a0) * 72;
        const x1 = 100 + Math.cos(a1) * 72, y1 = 100 + Math.sin(a1) * 72;
        const xi0 = 100 + Math.cos(a1) * 38, yi0 = 100 + Math.sin(a1) * 38;
        const xi1 = 100 + Math.cos(a0) * 38, yi1 = 100 + Math.sin(a0) * 38;
        g.appendChild(el('path', {
          d: 'M' + x0 + ' ' + y0 + ' A72 72 0 ' + large + ' 1 ' + x1 + ' ' + y1 + ' L' + xi0 + ' ' + yi0 + ' A38 38 0 ' + large + ' 0 ' + xi1 + ' ' + yi1 + ' Z',
          fill: s.color || colors[i % colors.length], stroke: '#fff', 'stroke-width': 2
        }));
        const mid = ang + use / 2;
        T(g, 188, 36 + i * 22, (s.label || '') + ' ' + s.value + '%', 11, INK, 'start');
      }
      ang += sweep;
      drawn += use;
    });
    if (state.center) T(g, 100, 104, state.center, 13, INK);
  });

  reg('grid100', '0 0 200 210', function (g, state) {
    const fill = state.fill || 0;
    const play = state.play == null ? 1 : state.play;
    const n = Math.round(fill * play);
    for (let i = 0; i < 100; i++) {
      const x = 16 + (i % 10) * 18;
      const y = 16 + Math.floor(i / 10) * 18;
      g.appendChild(el('circle', { cx: x, cy: y, r: 7, fill: i < n ? GOLD : LINE }));
    }
    T(g, 100, 200, state.label || ('100 格里涂了 ' + fill + ' 格'), 11, INK);
  });

  reg('balance', '0 0 300 210', function (g, state) {
    g.appendChild(el('rect', { width: 300, height: 210, fill: '#FCF1DC' }));
    function col(side, x) {
      const items = (side && side.items) || [];
      const sum = items.reduce(function (a, it) { return a + (+it.value || 0); }, 0) || 1;
      let y = 150;
      items.forEach(function (it, i) {
        const h = Math.max(12, (+it.value || 0) / sum * 110);
        y -= h;
        g.appendChild(el('rect', { x: x, y: y, width: 70, height: h, fill: i % 2 ? '#F0C36B' : GOLD }));
        T(g, x + 35, y + Math.min(h - 2, 16), (it.label || '') + ' ' + it.value, 10, '#fff');
      });
      T(g, x + 35, 172, (side && side.title) || '', 12, INK);
      T(g, x + 35, 188, String(sum), 11, MUTED);
    }
    col(state.left, 50);
    col(state.right, 180);
    T(g, 150, 100, '=', 20, INK);
    if (state.caption) T(g, 150, 24, state.caption, 12, MUTED);
  });

  reg('tri', '0 0 240 200', function (g, state) {
    g.appendChild(el('rect', { width: 240, height: 200, fill: '#FCF1DC' }));
    const corners = state.corners || ['甲', '乙', '丙'];
    const pts = [[120, 36], [36, 150], [204, 150]];
    const pick = state.pick || [];
    g.appendChild(el('path', { d: 'M120 36 L36 150 L204 150 Z', fill: 'none', stroke: LINE, 'stroke-width': 2 }));
    if (pick.length === 2) {
      g.appendChild(el('line', {
        x1: pts[pick[0]][0], y1: pts[pick[0]][1], x2: pts[pick[1]][0], y2: pts[pick[1]][1],
        stroke: GOLD, 'stroke-width': 3
      }));
    }
    pts.forEach(function (p, i) {
      const on = pick.indexOf(i) >= 0;
      g.appendChild(el('circle', { cx: p[0], cy: p[1], r: 24, fill: on ? GOLD : LINE }));
      T(g, p[0], p[1] + 4, corners[i] || '', 11, on ? '#fff' : MUTED);
    });
    if (state.note) T(g, 120, 186, state.note, 12, INK);
  });

  reg('tag', '0 0 280 160', function (g, state) {
    g.appendChild(el('rect', { x: 20, y: 16, width: 240, height: 120, rx: 12, fill: '#FCF1DC', stroke: GOLD, 'stroke-width': 1.5 }));
    T(g, 140, 46, state.title || '', 13, INK);
    T(g, 140, 86, state.big || '', 28, GOLD);
    T(g, 140, 112, state.small || '', 11, MUTED);
    if (state.stamp && (state.play == null || state.play > 0.6)) {
      g.appendChild(el('circle', { cx: 220, cy: 42, r: 22, fill: 'none', stroke: BAD, 'stroke-width': 2 }));
      T(g, 220, 46, state.stamp, 10, BAD);
    }
  });
})(window);
