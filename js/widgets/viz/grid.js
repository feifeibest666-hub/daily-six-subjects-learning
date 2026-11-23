(function (global) {
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  const GEO = '#2F9E8F';

  function text(attrs, value) {
    const n = LK.svg('text', attrs);
    n.textContent = value;
    return n;
  }

  function build(svg, base) {
    svg._base = base || {};
  }

  function apply(svg, state, tween) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(LK.svg('rect', { width: 342, height: 220, fill: '#F4EEE6' }));
    const paper = LK.svg('g', { opacity: state.paper == null ? 1 : state.paper });
    paper.appendChild(LK.svg('rect', { x: 46, y: 18, width: 250, height: 170, rx: 6, fill: '#fff', stroke: '#E4D8C8', 'stroke-width': 1.2 }));
    svg.appendChild(paper);
    if (!state.grid) return;
    const cols = state.cols || 6;
    const rows = state.rows || 4;
    const x0 = 70;
    const y0 = 36;
    const x1 = 270;
    const y1 = 156;
    const cw = (x1 - x0) / cols;
    const rh = (y1 - y0) / rows;
    const g = LK.svg('g', { opacity: tween || 1 });
    for (let c = 0; c <= cols; c++) {
      const x = x0 + c * cw;
      g.appendChild(LK.svg('line', { x1: x, y1: y0, x2: x, y2: y1, stroke: '#E4D8C8', 'stroke-width': 1 }));
    }
    for (let r = 0; r <= rows; r++) {
      const y = y0 + r * rh;
      g.appendChild(LK.svg('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: '#E4D8C8', 'stroke-width': 1 }));
    }
    svg.appendChild(g);
    if (state.labels) {
      svg.appendChild(text({ x: 170, y: 196, 'text-anchor': 'middle', 'font-size': 12, fill: '#6E655C', 'font-family': FONT }, state.xLabel || '第几列'));
      svg.appendChild(text({ x: 28, y: 100, 'text-anchor': 'middle', 'font-size': 12, fill: '#6E655C', 'font-family': FONT, transform: 'rotate(-90 28 100)' }, state.yLabel || '第几行'));
    }
    if (!state.dot) return;
    const dc = state.dot[0];
    const dr = state.dot[1];
    const cx = x0 + (dc - 0.5) * cw;
    const cy = y0 + (dr - 0.5) * rh;
    svg.appendChild(LK.svg('line', { x1: cx, y1: cy, x2: x0, y2: cy, stroke: GEO, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }));
    svg.appendChild(LK.svg('line', { x1: cx, y1: cy, x2: cx, y2: y1, stroke: GEO, 'stroke-width': 1.5, 'stroke-dasharray': '4 3' }));
    svg.appendChild(LK.svg('circle', { cx: cx, cy: cy, r: 6, fill: GEO }));
    svg.appendChild(text({ x: cx + 10, y: cy - 8, 'font-size': 13, 'font-weight': 700, fill: GEO, 'font-family': FONT }, state.dotLabel || ''));
    if (state.globe) {
      const globe = LK.svg('g', { opacity: state.globe * (tween || 1) });
      globe.appendChild(LK.svg('circle', { cx: 171, cy: 110, r: 70, fill: '#1F6E84' }));
      globe.appendChild(LK.svg('ellipse', { cx: 171, cy: 110, rx: 70, ry: 24, fill: 'none', stroke: '#FFD66B', 'stroke-width': 1.6 }));
      globe.appendChild(LK.svg('path', { d: 'M171 40 v140 M101 110 h140', fill: 'none', stroke: '#9FE3DA', 'stroke-width': 1 }));
      svg.appendChild(globe);
    }
  }

  LKStage.register('grid', { viewBox: '0 0 342 220', build: build, apply: apply, anim: {} });
})(window);
