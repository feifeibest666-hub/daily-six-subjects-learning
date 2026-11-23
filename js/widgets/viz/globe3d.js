(function (global) {
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  const CX = 171;
  const CY = 132;
  const R0 = 112;

  function proj(lon, lat, L0, V, R) {
    const l = (lon - L0) * Math.PI / 180;
    const f = lat * Math.PI / 180;
    const v = V * Math.PI / 180;
    const x = R * Math.cos(f) * Math.sin(l);
    const y = -R * (Math.sin(f) * Math.cos(v) - Math.cos(f) * Math.cos(l) * Math.sin(v));
    const z = Math.cos(f) * Math.cos(l) * Math.cos(v) + Math.sin(f) * Math.sin(v);
    return { x: CX + x, y: CY + y, z: z };
  }

  function text(attrs, value) {
    const n = LK.svg('text', attrs);
    n.textContent = value;
    return n;
  }

  function ring(lat, L0, V, R, front) {
    let d = '';
    let pen = false;
    for (let lon = -180; lon <= 180; lon += 4) {
      const q = proj(lon, lat, L0, V, R);
      const ok = front ? q.z >= -0.02 : q.z < -0.02;
      if (!ok) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + q.x.toFixed(1) + ' ' + q.y.toFixed(1);
      pen = true;
    }
    return d;
  }

  function meridian(lon, L0, V, R) {
    let d = '';
    let pen = false;
    for (let lat = -80; lat <= 80; lat += 4) {
      const q = proj(lon, lat, L0, V, R);
      if (q.z < -0.02) { pen = false; continue; }
      d += (pen ? 'L' : 'M') + q.x.toFixed(1) + ' ' + q.y.toFixed(1);
      pen = true;
    }
    return d;
  }

  function landPath(L0, V, R) {
    const G = global.CN_GEO;
    if (!G) return '';
    let d = '';
    let pen = false;
    G.outline.forEach(function (p) {
      const q = proj(p[0], p[1], L0, V, R);
      if (q.z < -0.05) { pen = false; return; }
      d += (pen ? 'L' : 'M') + q.x.toFixed(1) + ' ' + q.y.toFixed(1);
      pen = true;
    });
    return d;
  }

  function build(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const defs = LK.svg('defs');
    const sea = LK.svg('radialGradient', { id: 'seaGrad', cx: '40%', cy: '38%', r: '70%' });
    sea.appendChild(LK.svg('stop', { offset: '0', 'stop-color': '#5FB7C9' }));
    sea.appendChild(LK.svg('stop', { offset: '0.6', 'stop-color': '#2F8DA3' }));
    sea.appendChild(LK.svg('stop', { offset: '1', 'stop-color': '#1F6E84' }));
    defs.appendChild(sea);
    const clip = LK.svg('clipPath', { id: 'globeClip' });
    clip.appendChild(LK.svg('circle', { cx: CX, cy: CY, r: R0 }));
    defs.appendChild(clip);
    svg.appendChild(defs);
    svg.appendChild(LK.svg('rect', { width: 342, height: 300, fill: '#152B3A' }));
    [[28, 36], [70, 22], [300, 40], [318, 90], [40, 250], [300, 240], [250, 28], [20, 160]].forEach(function (p) {
      svg.appendChild(LK.svg('circle', { cx: p[0], cy: p[1], r: 1.2, fill: '#fff', opacity: 0.7 }));
    });
    svg.appendChild(LK.svg('circle', { cx: CX, cy: CY, r: R0 + 8, fill: '#1F6E84', opacity: 0.35 }));
    svg.appendChild(LK.svg('circle', { class: 'sea', cx: CX, cy: CY, r: R0, fill: 'url(#seaGrad)' }));
    svg.appendChild(LK.svg('g', { class: 'graticule', 'clip-path': 'url(#globeClip)' }));
    svg.appendChild(LK.svg('g', { class: 'land', 'clip-path': 'url(#globeClip)' }));
    svg.appendChild(LK.svg('g', { class: 'marks' }));
    svg.appendChild(LK.svg('g', { class: 'angle' }));
    svg.appendChild(text({ x: CX, y: 292, 'text-anchor': 'middle', 'font-size': 11, fill: '#9FB4C4', 'font-family': FONT }, '单指左右拖，转地球'));
    svg.addEventListener('pointerdown', function (ev) {
      svg._drag = { x: ev.clientX, L0: svg._L0 || 105 };
      svg.setPointerCapture && svg.setPointerCapture(ev.pointerId);
    });
    svg.addEventListener('pointermove', function (ev) {
      if (!svg._drag) return;
      const d = (svg._drag.x - ev.clientX) * 0.4;
      svg._L0 = svg._drag.L0 + d;
      if (svg._redraw) svg._redraw();
    });
    svg.addEventListener('pointerup', function () {
      if (!svg._drag) return;
      const reduced = global.LKMotion && LKMotion.reduce();
      svg._drag = null;
      if (reduced || !svg._redraw) return;
      const start = svg._L0;
      const vel = 8;
      const t0 = performance.now();
      function glide(now) {
        const u = Math.min(1, (now - t0) / 600);
        svg._L0 = start + vel * (1 - u) * (1 - u);
        svg._redraw();
        if (u < 1) requestAnimationFrame(glide);
      }
      requestAnimationFrame(glide);
    });
  }

  function apply(svg, state, tween) {
    if (!svg.querySelector('.sea')) build(svg);
    const polar = state.polar || (state.V != null && state.V >= 80);
    if (polar) { drawPolar(svg, state, tween); return; }
    const R = state.R || R0;
    const V = state.V == null ? 12 : state.V;
    const cityLon = state.cityLon == null ? 116.4 : state.cityLon;
    let L0 = state.L0;
    if (L0 == null) L0 = state.turn ? (cityLon - 72) : (state.centerLon == null ? 105 : state.centerLon);
    if (svg._drag) L0 = svg._L0;
    else svg._L0 = L0;
    svg._redraw = function () { apply(svg, Object.assign({}, state, { lockL0: false }), 1); };
    const grat = svg.querySelector('.graticule');
    grat.innerHTML = '';
    [-60, -30, 0, 30, 60].forEach(function (lat) {
      grat.appendChild(LK.svg('path', { d: ring(lat, L0, V, R, true), fill: 'none', stroke: '#fff', 'stroke-width': 0.7, opacity: 0.32 }));
    });
    for (let lon = -180; lon < 180; lon += 30) {
      grat.appendChild(LK.svg('path', { d: meridian(lon, L0, V, R), fill: 'none', stroke: '#fff', 'stroke-width': 0.7, opacity: 0.28 }));
    }
    const land = svg.querySelector('.land');
    land.innerHTML = '';
    const d = landPath(L0, V, R);
    if (d) land.appendChild(LK.svg('path', { d: d, fill: '#E9D9B0', stroke: '#CDB98A', 'stroke-width': 1.1, 'stroke-linejoin': 'round' }));
    const marks = svg.querySelector('.marks');
    marks.innerHTML = '';
    const ang = svg.querySelector('.angle');
    ang.innerHTML = '';
    const eq = state.equator == null ? 1 : state.equator;
    if (eq) {
      marks.appendChild(LK.svg('path', {
        d: ring(0, L0, V, R, true), fill: 'none', stroke: '#FFD66B', 'stroke-width': 2.6,
        pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': String(1 - (tween == null ? 1 : Math.max(tween, eq === 1 ? 1 : tween)))
      }));
      marks.appendChild(LK.svg('path', { d: ring(0, L0, V, R, false), fill: 'none', stroke: '#FFD66B', 'stroke-width': 1.2, 'stroke-dasharray': '4 3', opacity: 0.7 }));
      const q = proj(L0 - 40, 0, L0, V, R);
      if (q.z > 0) chip(marks, q.x - 36, q.y + 16, '赤道 0°', '#FFD66B', '#3A302A');
    }
    if (state.parallel) {
      const lat = state.parallel;
      marks.appendChild(LK.svg('path', {
        d: ring(lat, L0, V, R, true), fill: 'none', stroke: '#9FE3DA', 'stroke-width': 2.6,
        pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': String(1 - (tween || 1))
      }));
      marks.appendChild(LK.svg('path', { d: ring(lat, L0, V, R, false), fill: 'none', stroke: '#9FE3DA', 'stroke-width': 1.3, 'stroke-dasharray': '3 3', opacity: 0.8 }));
      chip(marks, 18, CY - 10, (lat >= 0 ? '北纬 ' : '南纬 ') + Math.abs(Math.round(lat)) + '° 一圈', '#14343A', '#9FE3DA');
    }
    if (state.latTag) chip(marks, 18, 78, state.latTag, state.latTag.indexOf('南') === 0 ? '#5A3040' : '#14343A', state.latTag.indexOf('南') === 0 ? '#F3B6C8' : '#9FE3DA');
    if (state.hemis) {
      textAt(marks, CX, CY - 36, '北半球', '#D7F4EF');
      textAt(marks, CX, CY + 48, '南半球', '#F8D5DE');
    }
    if (state.angle != null) drawAngle(ang, state, L0, V, R);
    if (state.greenwich) {
      marks.appendChild(LK.svg('path', { d: meridian(0, L0, V, R), fill: 'none', stroke: '#FFD66B', 'stroke-width': 2.4 }));
      chip(marks, CX - 20, 36, '格林尼治 0°', '#FFD66B', '#3A302A');
    }
    if (state.city) {
      const lon = state.cityLon == null ? 116.4 : state.cityLon;
      const lat = state.cityLat == null ? 40 : state.cityLat;
      const q = proj(lon, lat, L0, V, R);
      if (q.z > -0.05) {
        marks.appendChild(LK.svg('circle', { cx: q.x, cy: q.y, r: 4.5, fill: '#E35D5D', stroke: '#fff', 'stroke-width': 1.5 }));
        chip(marks, q.x - 18, q.y - 22, state.cityName || '北京', '#fff', '#2B2622');
      }
    }
    const np = proj(L0, 78, L0, V, R);
    if (np.z > 0) textAt(marks, np.x, np.y - 8, '北极', '#E8F2F6');
    if (state.gridFade) {
      const grid = LK.svg('g', { opacity: state.gridFade });
      for (let i = 0; i <= 6; i++) {
        grid.appendChild(LK.svg('line', { x1: 40 + i * 44, y1: 36, x2: 40 + i * 44, y2: 230, stroke: '#9FE3DA', 'stroke-width': 0.8, opacity: 0.7 }));
      }
      for (let j = 0; j <= 4; j++) {
        grid.appendChild(LK.svg('line', { x1: 40, y1: 36 + j * 48, x2: 304, y2: 36 + j * 48, stroke: '#9FE3DA', 'stroke-width': 0.8, opacity: 0.7 }));
      }
      marks.appendChild(grid);
    }
  }

  function textAt(g, x, y, value, fill) {
    g.appendChild(text({ x: x, y: y, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 650, fill: fill || '#fff', 'font-family': FONT }, value));
  }

  function chip(g, x, y, label, bg, fg) {
    const w = Array.from(label).length * 12 + 16;
    const node = LK.svg('g', {});
    node.appendChild(LK.svg('rect', { x: x, y: y - 14, width: w, height: 22, rx: 11, fill: bg }));
    node.appendChild(text({ x: x + w / 2, y: y + 2, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: fg, 'font-family': FONT }, label));
    g.appendChild(node);
  }

  function drawAngle(g, state, L0, V, R) {
    const lon = state.cityLon == null ? 116.4 : state.cityLon;
    const lat = state.angle;
    const eq = proj(lon, 0, L0, V, R);
    const city = proj(lon, lat, L0, V, R);
    g.appendChild(LK.svg('path', { d: 'M' + CX + ' ' + CY + ' L' + eq.x.toFixed(1) + ' ' + eq.y.toFixed(1), stroke: '#FFD66B', 'stroke-width': 1.6 }));
    g.appendChild(LK.svg('path', { d: 'M' + CX + ' ' + CY + ' L' + city.x.toFixed(1) + ' ' + city.y.toFixed(1), stroke: '#fff', 'stroke-width': 1.8 }));
    g.appendChild(LK.svg('circle', { cx: CX, cy: CY, r: 3.5, fill: '#fff' }));
    const a0 = Math.atan2(eq.y - CY, eq.x - CX);
    const a1 = Math.atan2(city.y - CY, city.x - CX);
    const r = 34;
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
    const sweep = a1 < a0 ? 0 : 1;
    const x0 = CX + r * Math.cos(a0);
    const y0 = CY + r * Math.sin(a0);
    const x1 = CX + r * Math.cos(a1);
    const y1 = CY + r * Math.sin(a1);
    g.appendChild(LK.svg('path', {
      d: 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + large + ' ' + sweep + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1),
      fill: 'none', stroke: '#FFD66B', 'stroke-width': 2
    }));
    textAt(g, (x0 + x1) / 2 + 10, (y0 + y1) / 2, Math.abs(Math.round(lat)) + '°', '#FFD66B');
    textAt(g, CX - 28, CY + 16, '地心', '#E8F2F6');
  }

  function drawPolar(svg, state, tween) {
    const marks = svg.querySelector('.marks');
    const grat = svg.querySelector('.graticule');
    const land = svg.querySelector('.land');
    const ang = svg.querySelector('.angle');
    if (grat) grat.innerHTML = '';
    if (land) land.innerHTML = '';
    if (marks) marks.innerHTML = '';
    if (ang) ang.innerHTML = '';
    const g = marks;
    g.appendChild(LK.svg('circle', { cx: CX, cy: CY, r: R0, fill: '#1F6E84', stroke: '#9FE3DA', 'stroke-width': 1.2 }));
    for (let deg = 0; deg < 360; deg += 30) {
      const a = (deg - 90) * Math.PI / 180;
      g.appendChild(LK.svg('line', {
        x1: CX, y1: CY,
        x2: CX + R0 * Math.cos(a), y2: CY + R0 * Math.sin(a),
        stroke: '#fff', 'stroke-width': 0.7, opacity: 0.35
      }));
    }
    [40, 70].forEach(function (rr) {
      g.appendChild(LK.svg('circle', { cx: CX, cy: CY, r: rr, fill: 'none', stroke: '#fff', 'stroke-width': 0.7, opacity: 0.3 }));
    });
    function pt(deg) {
      const a = deg * Math.PI / 180;
      return [CX + (R0 - 8) * Math.cos(a), CY - (R0 - 8) * Math.sin(a)];
    }
    function arc(from, to, color) {
      const steps = 28;
      const span = (to - from) * (tween == null ? 1 : tween);
      let d = '';
      for (let i = 0; i <= steps; i++) {
        const deg = from + span * (i / steps);
        const p = pt(deg);
        d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      }
      g.appendChild(LK.svg('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }));
    }
    const east = state.east || 0;
    const west = state.west || 0;
    if (east) arc(0, east, '#3FA772');
    if (west) arc(0, -west, '#C9C2B8');
    textAt(g, CX + R0 + 16, CY + 4, '0°', '#fff');
    textAt(g, CX - R0 - 18, CY + 4, '180°', '#FFD66B');
    if (east) textAt(g, CX + 28, CY - 48, '东经', '#3FA772');
    if (west) textAt(g, CX + 28, CY + 56, '西经', '#E7E1D8');
    textAt(g, CX, CY + 4, '北极', '#E8F2F6');
  }

  LKStage.register('globe3d', {
    viewBox: '0 0 342 300',
    build: build,
    apply: apply,
    anim: {
      spin: function (svg, t, state, api) {
        api.apply({ L0: (state.centerLon || 105) + t * 40, equator: t > 0.15 ? 1 : 0 });
      },
      eastSweep: function (svg, t, state, api) {
        api.apply({ polar: 1, east: Math.round(180 * t), west: state.west || 0 });
      },
      westSweep: function (svg, t, state, api) {
        api.apply({ polar: 1, east: 180, west: Math.round(180 * t) });
      }
    }
  });
})(window);
