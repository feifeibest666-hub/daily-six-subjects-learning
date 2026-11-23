(function (global) {
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';

  function text(attrs, value) {
    const n = LK.svg('text', attrs);
    n.textContent = value;
    return n;
  }

  function collide(g, t, w, h) {
    const push = Math.max(0, Math.min(1, t));
    const x0 = 8 + push * (w * 0.28);
    g.appendChild(LK.svg('rect', { x: x0, y: h * 0.42, width: w * 0.28, height: h * 0.28, rx: 4, fill: '#C8664A' }));
    text({ x: x0 + w * 0.14, y: h * 0.6, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#fff', 'font-family': FONT }, '印度');
    const layers = 4;
    for (let i = 0; i < layers; i++) {
      const rise = push * (layers - i) * (h * 0.08);
      const y = h * 0.62 - i * 7 - rise;
      const ww = w * (0.62 - i * 0.06);
      g.appendChild(LK.svg('path', {
        d: 'M' + (w * 0.36) + ' ' + (y + 8) + ' Q' + (w * 0.5) + ' ' + (y - rise) + ' ' + (w * 0.36 + ww) + ' ' + (y + 10),
        fill: i === 0 ? '#C9A27E' : '#E3C9A0', stroke: '#7A4E2D', 'stroke-width': 1
      }));
    }
    g.appendChild(LK.svg('path', {
      d: 'M' + (x0 + w * 0.26) + ' ' + (h * 0.5) + ' h' + (10 + push * 16),
      fill: 'none', stroke: '#C8664A', 'stroke-width': 2, 'marker-end': 'none'
    }));
    text({ x: w * 0.5, y: 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#6E655C', 'font-family': FONT }, '约 5000 万年 → 今天');
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
    text({ x: w / 2, y: 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#6E655C', 'font-family': FONT }, '手边高，远处低');
  }

  function draw(g, mode, t, w, h) {
    while (g.firstChild) g.removeChild(g.firstChild);
    g.appendChild(LK.svg('rect', { width: w, height: h, rx: 10, fill: '#fff' }));
    if (mode === 'tablecloth') tablecloth(g, t, w, h);
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
