(function (global) {
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  const NAMES = {
    kunlun: '昆仑山', qilian: '祁连山', hengduan: '横断山', daxinganling: '大兴安岭',
    taihang: '太行山', wushan: '巫山', xuefeng: '雪峰山', qinling: '秦岭',
    tianshan: '天山', himalaya: '喜马拉雅', yanshan: '燕山',
    tarim: '塔里木盆地', junggar: '准噶尔盆地', qaidam: '柴达木盆地', sichuan: '四川盆地',
    dongbei: '东北平原', huabei: '华北平原', changjiang: '长江中下游平原',
    qingzang: '青藏高原', neimenggu: '内蒙古高原', huangtu: '黄土高原', yungui: '云贵高原',
    lhasa: '拉萨', shanghai: '上海', lanzhou: '兰州', zhengzhou: '郑州', beijing: '北京'
  };
  const TIPS = {
    taihang: '西：黄土高原｜东：华北平原',
    qingzang: '第一级 · 4000 米以上',
    qaidam: '四周高、中间低，仍在第一级',
    tarim: '四周高、中间低的盆地',
    junggar: '四周高、中间低的盆地',
    sichuan: '脸盆坐在第二级台阶上',
    dongbei: '又低又平的平原',
    huabei: '又低又平，铺到海边',
    changjiang: '又低又平的平原'
  };

  function geo() { return global.CN_GEO; }

  function projector(s, dx, dy) {
    return function (lon, lat) {
      return [(lon - 72.5) * 0.82 * s + dx, (54.5 - lat) * s + dy];
    };
  }

  function pathOf(pts, P, close) {
    if (!pts || !pts.length) return '';
    let d = '';
    pts.forEach(function (p, i) {
      const q = P(p[0], p[1]);
      d += (i ? 'L' : 'M') + q[0].toFixed(1) + ' ' + q[1].toFixed(1);
    });
    if (close) d += 'Z';
    return d;
  }

  function smooth(pts, P) {
    if (!pts || pts.length < 2) return pathOf(pts, P, false);
    const q = pts.map(function (p) { return P(p[0], p[1]); });
    let d = 'M' + q[0][0].toFixed(1) + ' ' + q[0][1].toFixed(1);
    for (let i = 0; i < q.length - 1; i++) {
      const a = q[i];
      const b = q[i + 1];
      const mx = (a[0] + b[0]) / 2;
      const my = (a[1] + b[1]) / 2;
      d += 'Q' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
    }
    const last = q[q.length - 1];
    d += 'L' + last[0].toFixed(1) + ' ' + last[1].toFixed(1);
    return d;
  }

  function centerOf(unit) {
    if (!unit) return null;
    if (unit.c) return unit.c;
    if (unit.label && unit.label.length === 2 && typeof unit.label[0] === 'number') return unit.label;
    if (unit.pts && unit.pts.length) {
      let x = 0;
      let y = 0;
      unit.pts.forEach(function (p) { x += p[0]; y += p[1]; });
      return [x / unit.pts.length, y / unit.pts.length];
    }
    return null;
  }

  function pointOf(G, id) {
    if (G.ranges && G.ranges[id]) return G.ranges[id];
    if (G.cities && G.cities[id]) return G.cities[id];
    const bags = [G.plateaus, G.basins, G.plains];
    for (let i = 0; i < bags.length; i++) {
      if (bags[i] && bags[i][id]) return centerOf(bags[i][id]);
    }
    return null;
  }

  function ellipse(unit, P) {
    if (!unit) return '';
    if (unit.pts) return pathOf(unit.pts, P, true);
    const c = P(unit.c[0], unit.c[1]);
    const rx = unit.rx * 0.82 * (P.s || 6.55);
    const ry = unit.ry * (P.s || 6.55);
    return 'M' + (c[0] - rx).toFixed(1) + ' ' + c[1].toFixed(1) + ' a' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 1 0 ' + (rx * 2).toFixed(1) + ' 0 a' + rx.toFixed(1) + ' ' + ry.toFixed(1) + ' 0 1 0 ' + (-rx * 2).toFixed(1) + ' 0';
  }

  function text(attrs, value) {
    const n = LK.svg('text', attrs);
    n.textContent = value;
    return n;
  }

  function chip(parent, x, y, label, color, opts) {
    opts = opts || {};
    const w = Math.max(44, Array.from(label).length * 11 + 12);
    let cx = x;
    let cy = y;
    if (cy - 10 < 6) cy = 16;
    if (cy + 12 > 258) cy = 246;
    if (cx - w / 2 < 6) cx = 6 + w / 2;
    if (cx + w / 2 > 334) cx = 334 - w / 2;
    const g = LK.svg('g', { class: 'cn-chip', transform: 'translate(' + cx.toFixed(1) + ' ' + cy.toFixed(1) + ')' });
    g.appendChild(LK.svg('rect', {
      x: -w / 2, y: -10, width: w, height: 20, rx: 10,
      fill: opts.pending ? '#F4F0EA' : '#fff', stroke: opts.pending ? '#D9D0C6' : 'transparent', 'stroke-width': 1
    }));
    g.appendChild(text({
      x: 0, y: 4, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 650,
      fill: opts.pending ? '#A79E94' : (color || '#5B4330'), 'font-family': FONT
    }, label));
    parent.appendChild(g);
    return g;
  }

  function build(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const G = geo();
    const s = 6.55;
    const P = projector(s, 6, 8);
    P.s = s;
    svg._P = P;
    const defs = LK.svg('defs');
    const clip = LK.svg('clipPath', { id: 'cnClip' });
    clip.appendChild(LK.svg('path', { d: pathOf(G.outline, P, true) }));
    defs.appendChild(clip);
    const hatch = LK.svg('pattern', { id: 'cnHatch', width: 6, height: 6, patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' });
    hatch.appendChild(LK.svg('line', { x1: 0, y1: 0, x2: 0, y2: 6, stroke: '#B88A5E', 'stroke-width': 1.4, opacity: 0.55 }));
    defs.appendChild(hatch);
    svg.appendChild(defs);
    svg.appendChild(LK.svg('rect', { x: 0, y: 0, width: 342, height: 268, fill: '#EAF4F6' }));
    const land = LK.svg('g', { 'clip-path': 'url(#cnClip)' });
    land.appendChild(LK.svg('path', { class: 'step3', d: pathOf(G.outline, P, true), fill: '#EEE3C8' }));
    const step2 = G.line2.concat([[100, 20], [60, 20], [60, 56], G.line2[0]]);
    land.appendChild(LK.svg('path', { class: 'step2', d: pathOf(step2, P, true), fill: '#E3C9A0' }));
    const step1 = G.line1.concat([[98, 18], [70, 18], [70, 36.8]]);
    land.appendChild(LK.svg('path', { class: 'step1', d: pathOf(step1, P, true), fill: '#C9A27E' }));
    land.appendChild(LK.svg('path', { class: 'step1h', d: pathOf(step1, P, true), fill: 'url(#cnHatch)' }));
    svg.appendChild(land);
    svg.appendChild(LK.svg('path', { d: pathOf(G.outline, P, true), fill: 'none', stroke: '#8C7B6B', 'stroke-width': 1.2, 'stroke-linejoin': 'round' }));
    const tw = P(G.islands.taiwan.c[0], G.islands.taiwan.c[1]);
    const hn = P(G.islands.hainan.c[0], G.islands.hainan.c[1]);
    svg.appendChild(LK.svg('ellipse', { class: 'isle', cx: tw[0], cy: tw[1], rx: 3.2, ry: 8, fill: '#EEE3C8', stroke: '#8C7B6B', 'stroke-width': 1 }));
    svg.appendChild(LK.svg('ellipse', { class: 'isle', cx: hn[0], cy: hn[1], rx: 8, ry: 4.6, fill: '#EEE3C8', stroke: '#8C7B6B', 'stroke-width': 1 }));
    const units = LK.svg('g', { class: 'units' });
    svg.appendChild(units);
    const rivers = LK.svg('g', { class: 'rivers' });
    Object.keys(G.rivers).forEach(function (name) {
      const color = name === 'yellow' ? '#C9A64A' : (name === 'canal' ? '#3D86D9' : '#5FA8C8');
      rivers.appendChild(LK.svg('path', {
        class: 'river-' + name, d: smooth(G.rivers[name], P), fill: 'none', stroke: color,
        'stroke-width': 1.6, 'stroke-linecap': 'round', opacity: 0, pathLength: 1
      }));
    });
    svg.appendChild(rivers);
    const lines = LK.svg('g', { class: 'lines' });
    function line(name, pts, color, width) {
      const d = smooth(pts, P);
      lines.appendChild(LK.svg('path', { class: name + '-under', d: d, fill: 'none', stroke: '#fff', 'stroke-width': width + 3.5, 'stroke-linecap': 'round', opacity: 0 }));
      const p = LK.svg('path', {
        class: name, d: d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round',
        pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1
      });
      lines.appendChild(p);
    }
    line('line1', G.line1, '#7A4E2D', 3);
    line('line2', G.line2, '#2F9E8F', 3.5);
    line('qinhuai', G.qinhuai, '#3D86D9', 2.4);
    svg.appendChild(lines);
    svg.appendChild(LK.svg('g', { class: 'labels' }));
    svg.appendChild(LK.svg('g', { class: 'cities' }));
    svg.appendChild(LK.svg('g', { class: 'hot' }));
    svg.appendChild(LK.svg('g', { class: 'inset' }));
    svg.appendChild(text({ x: 318, y: 250, 'text-anchor': 'middle', 'font-size': 11, fill: '#7FA9B3', 'font-family': FONT }, '海'));
    svg.appendChild(text({ x: 8, y: 14, 'font-size': 10, fill: '#8AA8B0', 'font-family': FONT }, '示意图'));
    const pen = LK.svg('circle', { class: 'pen', r: 5, fill: '#fff', stroke: '#2F9E8F', 'stroke-width': 2.5, opacity: 0 });
    svg.appendChild(pen);
    svg._pen = pen;
  }

  function show(el, on) { if (el) el.style.opacity = on ? '1' : '0'; }

  function lineProgress(mode, tween) {
    if (mode === 'off' || mode == null || mode === 0) return 0;
    if (mode === 'drawn' || mode === 'on') return 1;
    if (mode === 'partial') return 0.46 * (tween == null ? 1 : Math.max(tween, 0.15));
    if (mode === 'drawing') return Math.max(0.08, tween || 0);
    if (typeof mode === 'number') return mode;
    return 0;
  }

  function apply(svg, state, tween) {
    if (!svg._P) build(svg);
    const G = geo();
    const P = svg._P;
    const steps = state.steps === 'off' ? [] : (state.steps || []);
    ['step3', 'step2', 'step1', 'step1h'].forEach(function (cls, i) {
      const want = (i === 0 && steps.indexOf(3) >= 0) || (i === 1 && steps.indexOf(2) >= 0) || (i > 1 && steps.indexOf(1) >= 0);
      const node = svg.querySelector('.' + cls);
      if (!node) return;
      node.style.opacity = want ? String(tween == null ? 1 : Math.max(tween, 0.2)) : '0';
    });
    const focus = state.focus || [];
    const focused = focus.length > 0;
    const units = svg.querySelector('.units');
    units.innerHTML = '';
    function unitOn(kind, id) {
      if (!focused) return state.units === 'all' || (state.labels || []).indexOf(id) >= 0 || (state.showUnits || []).indexOf(kind + ':' + id) >= 0;
      return focus.indexOf(kind + ':' + id) >= 0 || focus.indexOf(id) >= 0;
    }
    function drawUnit(kind, id, unit, fill) {
      const on = unitOn(kind, id);
      if (!on && state.units !== 'all') return;
      const g = LK.svg('g', { opacity: focused && !on ? 0.45 : 1 });
      const d = ellipse(unit, P);
      g.appendChild(LK.svg('path', { d: d, fill: fill, stroke: on && focused ? '#2F9E8F' : 'rgba(90,70,50,.35)', 'stroke-width': on && focused ? 2 : 1 }));
      if (kind === 'basin') {
        const c = P(unit.c[0], unit.c[1]);
        g.appendChild(LK.svg('ellipse', { cx: c[0], cy: c[1], rx: unit.rx * 0.45 * 0.82 * P.s, ry: unit.ry * 0.45 * P.s, fill: 'none', stroke: '#C9A27E', 'stroke-width': 1 }));
      }
      if (kind === 'plain') {
        const c = unit.c ? P(unit.c[0], unit.c[1]) : P(unit.pts[0][0], unit.pts[0][1]);
        for (let i = -1; i <= 1; i++) {
          g.appendChild(LK.svg('line', { x1: c[0] - 10, y1: c[1] + i * 3, x2: c[0] + 10, y2: c[1] + i * 3, stroke: '#7FA36A', 'stroke-width': 1 }));
        }
      }
      units.appendChild(g);
    }
    Object.keys(G.basins).forEach(function (id) { drawUnit('basin', id, G.basins[id], '#F1D9A8'); });
    Object.keys(G.plains).forEach(function (id) { drawUnit('plain', id, G.plains[id], '#DCEBC8'); });
    if (focused) {
      Object.keys(G.plateaus).forEach(function (id) {
        if (focus.indexOf('plateau:' + id) < 0 && focus.indexOf(id) < 0) return;
        const u = G.plateaus[id];
        if (!u.c) return;
        const c = P(u.c[0], u.c[1]);
        units.appendChild(LK.svg('ellipse', {
          cx: c[0], cy: c[1], rx: (u.rx || 3) * 0.82 * P.s, ry: (u.ry || 1.4) * P.s,
          fill: 'none', stroke: '#7A4E2D', 'stroke-width': 1.4, 'stroke-dasharray': '3 2'
        }));
      });
    }
    const rivers = state.rivers || {};
    svg.querySelectorAll('.rivers path').forEach(function (p) {
      const name = (p.getAttribute('class') || '').replace('river-', '');
      const mode = rivers[name];
      p.style.opacity = mode && mode !== 'off' ? (mode === 'flow' ? '0.9' : '0.55') : '0';
    });
    const lineState = state.lines || {};
    ['line1', 'line2', 'qinhuai'].forEach(function (name) {
      const p = svg.querySelector('path.' + name);
      const under = svg.querySelector('path.' + name + '-under');
      const prog = lineProgress(lineState[name], tween);
      if (p) p.setAttribute('stroke-dashoffset', String(1 - prog));
      if (under) under.style.opacity = prog > 0.02 ? '0.9' : '0';
      if (name === 'qinhuai' && p) p.setAttribute('stroke-dasharray', lineState[name] && lineState[name] !== 'off' ? '0.04 0.025' : '1');
    });
    const drawing = lineState.line2 === 'drawing' || lineState.line2 === 'partial' || lineState.line1 === 'drawing';
    const pen = svg._pen;
    if (pen) {
      const which = lineState.line2 === 'drawing' || lineState.line2 === 'partial' ? 'line2' : 'line1';
      const p = svg.querySelector('path.' + which);
      if (drawing && p && p.getTotalLength) {
        const len = p.getTotalLength();
        const prog = lineProgress(lineState[which], tween);
        const pt = p.getPointAtLength(Math.max(0.01, Math.min(0.98, prog)) * len);
        pen.setAttribute('cx', pt.x);
        pen.setAttribute('cy', pt.y);
        pen.style.opacity = prog > 0.02 && prog < 0.98 ? '1' : '0';
      } else pen.style.opacity = '0';
    }
    const labels = svg.querySelector('.labels');
    labels.innerHTML = '';
    const shown = state.labels || [];
    const pending = state.pending || [];
    function place(id, color, pend) {
      const pt = pointOf(G, id);
      if (!pt) return;
      const q = P(pt[0], pt[1]);
      const name = (NAMES[id] || id) + (pend ? ' · 待画' : '');
      chip(labels, q[0], q[1] - 12, name, color, { pending: pend });
    }
    shown.forEach(function (id) {
      const color = id === 'taihang' || id === 'daxinganling' || id === 'wushan' || id === 'xuefeng' ? '#2F9E8F' : '#7A4E2D';
      place(id, color, false);
    });
    pending.forEach(function (id) { place(id, '#A79E94', true); });
    const cities = svg.querySelector('.cities');
    cities.innerHTML = '';
    (state.cities || []).forEach(function (id) {
      const c = G.cities[id];
      if (!c) return;
      const q = P(c[0], c[1]);
      cities.appendChild(LK.svg('circle', { cx: q[0], cy: q[1], r: 3.5, fill: '#2F9E8F', stroke: '#fff', 'stroke-width': 1.5 }));
    });
    const hot = svg.querySelector('.hot');
    hot.innerHTML = '';
    const spots = (state.hotspots || []).concat(state.hotspot ? [state.hotspot] : []);
    spots.forEach(function (id) { addHot(svg, id); });
    if (state.hotspot && (tween == null || tween >= 0.98)) openHot(svg, state.hotspot, true);
    const inset = svg.querySelector('.inset');
    inset.innerHTML = '';
    if (state.inset === 'profile') drawInset(inset, state.insetMark || 2);
    svg._hot = state.hotspot || '';
  }

  function addHot(svg, id) {
    const G = geo();
    const P = svg._P;
    const pt = pointOf(G, id);
    if (!pt) return;
    const q = P(pt[0], pt[1]);
    const hit = LK.svg('rect', {
      x: q[0] - 22, y: q[1] - 22, width: 44, height: 44, fill: 'transparent',
      'data-hot': id, 'data-label': NAMES[id] || id, 'data-tip': TIPS[id] || (NAMES[id] || id)
    });
    svg.querySelector('.hot').appendChild(hit);
  }

  function openHot(svg, id, instant) {
    const old = svg.querySelector('.bubble');
    if (old) old.remove();
    const hit = svg.querySelector('[data-hot="' + id + '"]');
    if (!hit) return;
    const x = +hit.getAttribute('x') + 22;
    const y = +hit.getAttribute('y') + 22;
    const tip = hit.getAttribute('data-tip') || '';
    const label = hit.getAttribute('data-label') || '';
    const lines = tip && tip !== label ? tip.split('｜') : [];
    const w = Math.max(96, Array.from(label).length * 14 + 20, lines.reduce(function (m, t) {
      return Math.max(m, Array.from(t).length * 11 + 20);
    }, 0));
    const h = 22 + lines.length * 14;
    const g = LK.svg('g', { class: 'bubble', transform: 'translate(' + x + ' ' + (y - 36) + ')' });
    g.appendChild(LK.svg('path', { d: 'M0 -6 L0 30', fill: 'none', stroke: '#4A3B30', 'stroke-width': 1.2 }));
    g.appendChild(LK.svg('rect', { x: -w / 2, y: -h - 6, width: w, height: h, rx: 10, fill: '#fff', stroke: '#4A3B30', 'stroke-width': 1.2 }));
    g.appendChild(text({ x: 0, y: -h + 12, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: '#4A3B30', 'font-family': FONT }, label));
    lines.forEach(function (line, i) {
      g.appendChild(text({ x: 0, y: -h + 26 + i * 13, 'text-anchor': 'middle', 'font-size': 11, fill: '#4A3B30', 'font-family': FONT }, line));
    });
    svg.appendChild(g);
    if (!instant && global.LKMotion && !LKMotion.reduce()) {
      g.animate([{ transform: 'translate(' + x + 'px,' + (y - 36) + 'px) scale(.6)' }, { transform: 'translate(' + x + 'px,' + (y - 36) + 'px) scale(1)' }], { duration: 220, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    }
  }

  function drawInset(g, mark) {
    const x = 8;
    const y = 196;
    g.appendChild(LK.svg('rect', { x: x, y: y, width: 196, height: 64, rx: 10, fill: '#fff' }));
    g.appendChild(text({ x: x + 8, y: y + 14, 'font-size': 10, fill: '#6E655C', 'font-family': FONT }, '剖面：拉萨 → 上海（西 → 东）'));
    const gy = y + 48;
    g.appendChild(LK.svg('path', { d: 'M' + (x + 8) + ' ' + (y + 28) + ' L' + (x + 52) + ' ' + (y + 28) + ' L' + (x + 70) + ' ' + (y + 40) + ' L' + (x + 188) + ' ' + (gy) + ' L' + (x + 8) + ' ' + gy + ' Z', fill: '#E3C9A0' }));
    g.appendChild(LK.svg('path', { d: 'M' + (x + 8) + ' ' + (y + 22) + ' L' + (x + 48) + ' ' + (y + 22) + ' L' + (x + 48) + ' ' + gy + ' L' + (x + 8) + ' ' + gy + ' Z', fill: '#C9A27E' }));
    g.appendChild(LK.svg('circle', { cx: x + 70, cy: y + 40, r: 4, fill: mark === 2 ? '#2F9E8F' : '#7A4E2D', stroke: '#fff', 'stroke-width': 1.4 }));
    g.appendChild(text({ x: x + 70, y: gy + 11, 'text-anchor': 'middle', 'font-size': 9, fill: '#2F9E8F', 'font-weight': 700, 'font-family': FONT }, '坎②'));
  }

  function paintMini(g, opts) {
    const G = geo();
    const s = opts.s || 2.55;
    const P = projector(s, opts.dx || 4, opts.dy || 6);
    P.s = s;
    g.appendChild(LK.svg('path', { d: pathOf(G.outline, P, true), fill: '#EEE3C8', stroke: '#8C7B6B', 'stroke-width': 0.8 }));
    const step2 = G.line2.concat([[100, 20], [60, 20], [60, 56], G.line2[0]]);
    const step1 = G.line1.concat([[98, 18], [70, 18], [70, 36.8]]);
    const clipId = 'mini' + Math.round(Math.random() * 1e6);
    const defs = LK.svg('defs');
    const clip = LK.svg('clipPath', { id: clipId });
    clip.appendChild(LK.svg('path', { d: pathOf(G.outline, P, true) }));
    defs.appendChild(clip);
    g.appendChild(defs);
    const land = LK.svg('g', { 'clip-path': 'url(#' + clipId + ')' });
    land.appendChild(LK.svg('path', { d: pathOf(step2, P, true), fill: '#E3C9A0' }));
    land.appendChild(LK.svg('path', { d: pathOf(step1, P, true), fill: '#C9A27E' }));
    g.appendChild(land);
    if (opts.route) {
      const ids = opts.route.split('>');
      const pts = ids.map(function (id) { return G.cities[id]; }).filter(Boolean);
      g.appendChild(LK.svg('path', { d: pathOf(pts, P, false), fill: 'none', stroke: '#2F9E8F', 'stroke-width': 1.6, 'stroke-linecap': 'round' }));
      pts.forEach(function (p, i) {
        const q = P(p[0], p[1]);
        g.appendChild(LK.svg('circle', { cx: q[0], cy: q[1], r: i === pts.length - 1 ? 2.4 : 2, fill: i === 0 ? '#7A4E2D' : '#2F9E8F' }));
      });
    }
    return P;
  }

  LKStage.register('cnmap', { viewBox: '0 0 342 268', build: build, apply: apply, openHot: openHot, anim: {} });
  global.LKCn = { paintMini: paintMini, projector: projector, pathOf: pathOf, names: NAMES };
})(window);
