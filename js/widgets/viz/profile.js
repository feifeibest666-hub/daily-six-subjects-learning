(function (global) {
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  const PROFILE = [[0, 3650], [0.08, 3900], [0.15, 4700], [0.20, 4500], [0.27, 4200], [0.30, 3000], [0.33, 2000], [0.38, 1500], [0.47, 1300], [0.56, 1150], [0.62, 1000], [0.65, 600], [0.69, 250], [0.74, 100], [0.86, 40], [1, 4]];
  const STATIONS = [{ x: 0.03, name: '拉萨', m: 3650 }, { x: 0.38, name: '兰州', m: 1500 }, { x: 0.76, name: '郑州', m: 100 }, { x: 0.99, name: '上海', m: 4 }];

  function text(attrs, value) {
    const n = LK.svg('text', attrs);
    n.textContent = value;
    return n;
  }

  function altAt(x) {
    for (let i = 0; i < PROFILE.length - 1; i++) {
      const a = PROFILE[i];
      const b = PROFILE[i + 1];
      if (x >= a[0] && x <= b[0]) {
        const u = (x - a[0]) / (b[0] - a[0] || 1);
        return a[1] + (b[1] - a[1]) * u;
      }
    }
    return PROFILE[PROFILE.length - 1][1];
  }

  function X(t) { return 28 + t * 300; }
  function Y(m) { return 150 - (m / 4800) * 120; }

  function groundPath(to) {
    let d = '';
    PROFILE.forEach(function (p) {
      if (to != null && p[0] > to + 0.001) return;
      d += (d ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1);
    });
    if (to != null) d += 'L' + X(to).toFixed(1) + ' ' + Y(altAt(to)).toFixed(1);
    return d;
  }

  function slope(x) {
    const a = altAt(Math.max(0, x - 0.015));
    const b = altAt(Math.min(1, x + 0.015));
    const dx = X(x + 0.015) - X(x - 0.015);
    const dy = Y(b) - Y(a);
    return Math.atan2(dy, dx) * 180 / Math.PI;
  }

  function build(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    svg.appendChild(LK.svg('rect', { width: 342, height: 330, fill: '#F7F1E8' }));
    text({ x: 8, y: 14, 'font-size': 10, fill: '#8A8178', 'font-family': FONT }, '侧面看（高度放大了约 300 倍）');
    [0, 1000, 2000, 3000, 4000].forEach(function (m) {
      const y = Y(m);
      svg.appendChild(LK.svg('line', { x1: 26, y1: y, x2: 332, y2: y, stroke: '#E6DCCE', 'stroke-width': 1 }));
      svg.appendChild(text({ x: 4, y: y + 3, 'font-size': 9, fill: '#A79E94', 'font-family': FONT }, m === 0 ? '0' : (m / 1000) + 'k'));
    });
    svg.appendChild(LK.svg('path', { class: 'band1', d: 'M28 ' + Y(4700) + ' L' + X(0.33) + ' ' + Y(4700) + ' L' + X(0.33) + ' 156 L28 156 Z', fill: '#C9A27E', opacity: 0.85 }));
    svg.appendChild(LK.svg('path', { class: 'band2', d: 'M' + X(0.33) + ' 156 L' + X(0.33) + ' ' + Y(2000) + ' L' + X(0.66) + ' ' + Y(600) + ' L' + X(0.66) + ' 156 Z', fill: '#E3C9A0', opacity: 0.9 }));
    svg.appendChild(LK.svg('path', { class: 'band3', d: 'M' + X(0.66) + ' 156 L' + X(0.66) + ' ' + Y(250) + ' L332 156 Z', fill: '#EEE3C8' }));
    svg.appendChild(LK.svg('path', { class: 'ground-rest', fill: 'none', stroke: '#C9C2B8', 'stroke-width': 1.5, 'stroke-dasharray': '3 3' }));
    svg.appendChild(LK.svg('path', { class: 'ground-done', fill: 'none', stroke: '#2F9E8F', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    svg.appendChild(LK.svg('g', { class: 'stations' }));
    svg.appendChild(LK.svg('g', { class: 'train' }));
    svg.appendChild(LK.svg('g', { class: 'badge' }));
    const mini = LK.svg('g', { class: 'mini', transform: 'translate(8 188)' });
    mini.appendChild(LK.svg('rect', { width: 168, height: 132, rx: 10, fill: '#fff' }));
    mini.appendChild(text({ x: 8, y: 16, 'font-size': 10, fill: '#6E655C', 'font-family': FONT }, '在地图上：同一趟车'));
    mini.appendChild(LK.svg('g', { class: 'mini-map', transform: 'translate(8 22)' }));
    svg.appendChild(mini);
    const plate = LK.svg('g', { class: 'plate', transform: 'translate(180 188)' });
    svg.appendChild(plate);
    svg.appendChild(text({ x: 250, y: 176, 'text-anchor': 'middle', 'font-size': 9, fill: '#A79E94', 'font-family': FONT }, '西 → 东 · 约 4400 km'));
  }

  function train(g, x, y, rot) {
    g.innerHTML = '';
    const node = LK.svg('g', { transform: 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + rot.toFixed(1) + ')' });
    [[-20, '#2F9E8F'], [-2, '#F4F7F6'], [14, '#F4F7F6']].forEach(function (car) {
      node.appendChild(LK.svg('rect', { x: car[0], y: -12, width: 16, height: 10, rx: 2, fill: car[1], stroke: '#3A302A', 'stroke-width': 1 }));
    });
    g.appendChild(node);
  }

  function badge(g, m, drop) {
    g.innerHTML = '';
    const node = LK.svg('g', { transform: 'translate(236 28)' });
    node.appendChild(LK.svg('rect', { width: 96, height: 36, rx: 8, fill: '#2B2622' }));
    node.appendChild(text({ x: 48, y: 13, 'text-anchor': 'middle', 'font-size': 10, fill: '#E7E1D8', 'font-family': FONT }, '海拔表'));
    node.appendChild(text({ class: 'alt-num', x: 48, y: 28, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#fff', 'font-family': FONT }, Math.round(m) + ' m'));
    g.appendChild(node);
  }

  function apply(svg, state) {
    if (!svg.querySelector('.train')) build(svg);
    const p = state.progress == null ? 0 : state.progress;
    const rest = svg.querySelector('.ground-rest');
    const done = svg.querySelector('.ground-done');
    rest.setAttribute('d', groundPath(1));
    done.setAttribute('d', groundPath(p));
    const stations = svg.querySelector('.stations');
    stations.innerHTML = '';
    STATIONS.forEach(function (s) {
      const on = p + 0.02 >= s.x;
      stations.appendChild(LK.svg('circle', { cx: X(s.x), cy: Y(s.m), r: 4, fill: on ? '#2F9E8F' : '#fff', stroke: '#2F9E8F', 'stroke-width': 1.6 }));
      stations.appendChild(text({ x: X(s.x), y: Y(s.m) - 8, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: '#3A302A', 'font-family': FONT }, s.name));
      if (on) stations.appendChild(text({ x: X(s.x), y: Y(s.m) + 14, 'text-anchor': 'middle', 'font-size': 9, fill: '#6E655C', 'font-family': FONT }, s.m + ' m'));
    });
    if (p > 0.12) stations.appendChild(text({ x: X(0.15), y: Y(4700) - 8, 'text-anchor': 'middle', 'font-size': 9, fill: '#7A4E2D', 'font-family': FONT }, '唐古拉山口 5000+'));
    [{ x: 0.30, name: '坎①', color: '#7A4E2D' }, { x: 0.65, name: '坎②', color: '#2F9E8F' }].forEach(function (k) {
      if (p + 0.01 < k.x && !state.showKans) return;
      stations.appendChild(text({ x: X(k.x), y: Y(altAt(k.x)) - 16, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: k.color, 'font-family': FONT }, k.name));
    });
    const y = Y(altAt(p));
    train(svg.querySelector('.train'), X(p), y, slope(p));
    const prev = state.dropFrom == null ? altAt(p) : state.dropFrom;
    badge(svg.querySelector('.badge'), altAt(p), state.dropFrom != null ? altAt(p) - prev : 0);
    const map = svg.querySelector('.mini-map');
    map.innerHTML = '';
    const route = p < 0.2 ? 'lhasa' : (p < 0.55 ? 'lhasa>lanzhou' : (p < 0.9 ? 'lhasa>lanzhou>zhengzhou' : 'lhasa>lanzhou>zhengzhou>shanghai'));
    if (global.LKCn) LKCn.paintMini(map, { s: 2.2, dx: 2, dy: 4, route: route });
    const plate = svg.querySelector('.plate');
    if (global.LKPlates) LKPlates.draw(plate, 'collide', state.plates == null ? 0 : state.plates, 156, 132);
    if (state.brackets) {
      const b = svg.querySelector('.brackets') || LK.svg('g', { class: 'brackets' });
      if (!b.parentNode) svg.appendChild(b);
      b.innerHTML = '';
      [[0.08, 0.38, '−2150'], [0.4, 0.74, '−1400'], [0.76, 0.99, '−96']].forEach(function (br) {
        b.appendChild(text({ x: (X(br[0]) + X(br[1])) / 2, y: 168, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#2F9E8F', 'font-family': FONT }, br[2]));
      });
    }
  }

  function ride(svg, t, state, api) {
    const from = state.from == null ? 0 : state.from;
    const to = state.to == null ? 1 : state.to;
    const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    api.apply({ progress: from + (to - from) * e, dropFrom: altAt(from) });
  }

  LKStage.register('profileTrip', {
    viewBox: '0 0 342 330',
    build: build,
    apply: apply,
    anim: { ride: ride }
  });
})(window);
