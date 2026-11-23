(function (global) {
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';

  function text(attrs, value) {
    const n = LK.svg('text', attrs);
    n.textContent = value;
    return n;
  }
  function label(g, attrs, value) { g.appendChild(text(attrs, value)); }

  function mesa(g, x, y, w, h, fill) {
    const top = y - h;
    g.appendChild(LK.svg('path', {
      d: 'M' + x + ' ' + y + ' L' + (x + 6) + ' ' + top + ' L' + (x + w - 4) + ' ' + top + ' L' + (x + w) + ' ' + y + ' Z',
      fill: fill, stroke: '#7A4E2D', 'stroke-width': 1.2, 'stroke-linejoin': 'round'
    }));
  }

  function indiaBlock(g, x, y, w, h) {
    g.appendChild(LK.svg('rect', { x: x, y: y, width: w, height: h, rx: 3, fill: '#C8664A' }));
    label(g, { x: x + w / 2, y: y + h / 2 + 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#fff', 'font-family': FONT }, '印度');
  }

  function arrow(g, x1, y, x2, color, sw) {
    g.appendChild(LK.svg('path', {
      d: 'M' + x1 + ' ' + y + ' H' + (x2 - 7) + ' M' + (x2 - 8) + ' ' + (y - 4) + ' L' + x2 + ' ' + y + ' L' + (x2 - 8) + ' ' + (y + 4),
      fill: 'none', stroke: color, 'stroke-width': sw || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    }));
  }

  function steps(g, t, w, h) {
    const push = Math.max(0, Math.min(1, t == null ? 1 : t));
    label(g, { x: 8, y: 16, 'font-size': 11, 'font-weight': 700, fill: '#3A302A', 'font-family': FONT }, '为什么一级往下？');
    label(g, { x: 8, y: 30, 'font-size': 10, fill: '#6E655C', 'font-family': FONT }, '越往东，推力越弱，抬得越低');
    const base = h - 22;
    const gap = 6;
    const bw = Math.max(22, (w - 78) / 3 - gap);
    const x0 = 52;
    const highs = [0.46, 0.30, 0.16].map(function (k) { return 8 + (h * k - 8) * (0.35 + 0.65 * push); });
    const fills = ['#C4A574', '#D7C4A3', '#E7D7B0'];
    indiaBlock(g, 6, base - 28, 28, 28);
    arrow(g, 36, base - 16, x0 - 2, '#C8664A', 2.4);
    label(g, { x: 40, y: base - 22, 'font-size': 10, 'font-weight': 700, fill: '#C8664A', 'font-family': FONT }, '推');
    highs.forEach(function (hh, i) {
      const x = x0 + i * (bw + gap);
      mesa(g, x, base, bw, hh, fills[i]);
      label(g, { x: x + bw / 2, y: base + 14, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#5B4330', 'font-family': FONT }, ['一级', '二级', '三级'][i]);
    });
    [0.9, 0.55, 0.28].forEach(function (op, i) {
      const y = base - highs[0] - 8 - i * 0;
      const x1 = x0 + bw + 4 + i * 18;
      arrow(g, x1, base - 10 - i * 8, x1 + 16, '#C8664A', 1.6);
      g.lastChild.setAttribute('opacity', String(op * push));
    });
  }

  function collide(g, t, w, h) {
    const push = Math.max(0, Math.min(1, t == null ? 1 : t));
    label(g, { x: w / 2, y: 18, 'text-anchor': 'middle', 'font-size': 13, fill: '#6E655C', 'font-family': FONT }, push < 0.45 ? '约 5000 万年前' : '今天');
    const base = h - 28;
    const bw = (w - 120) / 3;
    const x0 = 70;
    const highs = [0.5, 0.32, 0.16].map(function (k) { return 10 + (h * k) * (0.25 + 0.75 * push); });
    indiaBlock(g, 12, base - 36, 40, 36);
    arrow(g, 54, base - 18, x0 - 4, '#C8664A', 2.6);
    label(g, { x: 58, y: base - 26, 'font-size': 12, 'font-weight': 700, fill: '#C8664A', 'font-family': FONT }, '推');
    ['#C4A574', '#D7C4A3', '#E7D7B0'].forEach(function (fill, i) {
      const x = x0 + i * (bw + 8);
      mesa(g, x, base, bw, highs[i], fill);
      label(g, { x: x + bw / 2, y: base + 16, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#5B4330', 'font-family': FONT }, ['一级', '二级', '三级'][i]);
    });
    arrow(g, x0 + bw + 10, base - highs[1] - 6, x0 + bw * 2, '#C8664A', 1.8);
    g.lastChild.setAttribute('opacity', String(0.45 + 0.4 * (1 - push)));
  }

  function tablecloth(g, t, w, h) {
    const push = Math.max(0, Math.min(1, t));
    g.appendChild(LK.svg('rect', { x: 10, y: h * 0.72, width: w - 20, height: 8, fill: '#E7D7C0' }));
    const folds = 5;
    let d = 'M16 ' + (h * 0.72);
    for (let i = 0; i < folds; i++) {
      const x = 16 + (w - 32) * (i + 1) / folds;
      const amp = (1 - i / folds) * push * 36;
      d += ' Q' + (x - 16) + ' ' + (h * 0.72 - amp) + ' ' + x + ' ' + (h * 0.72);
    }
    g.appendChild(LK.svg('path', { d: d, fill: 'none', stroke: '#C9A27E', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    const hand = 18 + push * 10;
    g.appendChild(LK.svg('ellipse', { cx: hand, cy: h * 0.5, rx: 12, ry: 8, fill: '#F6D7BF', stroke: '#3A302A', 'stroke-width': 1.4 }));
    if (push > 0.72) {
      g.appendChild(LK.svg('path', {
        d: 'M20 ' + (h * 0.55) + ' L' + (w * 0.35) + ' ' + (h * 0.3) + ' L' + (w * 0.62) + ' ' + (h * 0.5) + ' L' + (w - 16) + ' ' + (h * 0.68),
        fill: 'none', stroke: '#2F9E8F', 'stroke-width': 2, opacity: (push - 0.72) / 0.28
      }));
    }
    label(g, { x: w / 2, y: 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#6E655C', 'font-family': FONT }, '手边高，远处低');
  }

  function draw(g, mode, t, w, h) {
    while (g.firstChild) g.removeChild(g.firstChild);
    g.appendChild(LK.svg('rect', { width: w, height: h, rx: 10, fill: '#fff' }));
    if (mode === 'tablecloth') tablecloth(g, t, w, h);
    else if (mode === 'steps') steps(g, t, w, h);
    else collide(g, t, w, h);
  }

  function build(svg) { svg._ready = true; }
  function apply(svg, state) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(LK.svg('rect', { width: 342, height: 200, fill: '#F7F1E8' }));
    const g = LK.svg('g', { transform: 'translate(16 16)' });
    svg.appendChild(g);
    const t = state.push == null ? 1 : state.push;
    draw(g, state.mode || 'collide', t, 310, 168);
  }

  LKStage.register('plates', {
    viewBox: '0 0 342 200',
    build: build,
    apply: apply,
    anim: {
      push: function (svg, t, state, api) { api.apply({ push: t }); }
    }
  });
  global.LKPlates = { draw: draw };
})(window);
