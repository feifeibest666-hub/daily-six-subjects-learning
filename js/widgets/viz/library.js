(function (global) {
  const INK = '#4A3B30';
  const FONT = '-apple-system, "PingFang SC", "HarmonyOS Sans SC", "Noto Sans SC", "Microsoft YaHei", sans-serif';
  const GEO = '#2F9E8F';
  const HIST = '#C8664A';
  const PSY = '#7C6BD6';
  const FASH = '#C45C7A';

  function svg(tag, attrs, text) {
    const n = LK.svg(tag, attrs || {});
    if (text != null) n.textContent = text;
    return n;
  }
  function T(g, x, y, value, size, fill, anchor) {
    g.appendChild(svg('text', {
      x: x, y: y, 'text-anchor': anchor || 'middle', 'font-size': size || 12,
      'font-weight': 650, fill: fill || INK, 'font-family': FONT
    }, value));
  }
  function clear(svgEl) { while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild); }
  function stepOf(state) { return state.step == null ? 1 : state.step; }
  function reg(type, box, draw) {
    LKStage.register(type, {
      viewBox: box,
      build: function (el) { el._ready = true; },
      apply: function (el, state, tween) { clear(el); draw(el, state || {}, tween == null ? 1 : tween); },
      anim: {
        main: function (el, t, state, api) { api.apply({ step: t > 0.66 ? 2 : (t > 0.33 ? 1 : 0), play: t }); },
        grow: function (el, t, state, api) { api.apply({ play: t }); },
        draw: function (el, t, state, api) { api.apply({ play: t }); },
        sweep: function (el, t, state, api) { api.apply({ play: t }); },
        ride: function (el, t, state, api) { api.apply({ play: t }); }
      }
    });
  }
  function bg(g, color) { g.appendChild(svg('rect', { width: 340, height: 220, fill: color || '#FBF6EE' })); }

  reg('tilemap', '0 0 340 220', function (g, state) {
    bg(g, '#FBF6EE');
    const list = global.PROVINCES || [];
    const on = state.on || [];
    const named = !!state.names;
    const all = state.step == null || state.step >= 1;
    list.forEach(function (p) {
      const x = 16 + p.c * 30;
      const y = 18 + p.r * 26;
      const listed = on.indexOf(p.id) >= 0;
      const hot = on.length ? (listed && (named || all)) : all;
      g.appendChild(svg('rect', {
        x: x, y: y, width: 26, height: 22, rx: 4,
        fill: hot ? GEO : '#E7E0D6', stroke: '#fff', 'stroke-width': 1
      }));
      const show = named ? (on.length ? listed : true) : state.step >= 2;
      if (show) {
        const word = named ? (p.short || '').split('/')[0].slice(0, 3) : (p.short || '').slice(0, 1);
        T(g, x + 13, y + 15, word, word.length > 1 ? 8 : 10, hot ? '#fff' : '#8A8178');
      }
    });
    T(g, 170, 208, state.caption || '34 个省级区', 12, '#6E655C');
  });

  reg('beam2', '0 0 340 200', function (g, state) {
    bg(g, '#F7F1E8');
    const ang = state.angle == null ? 55 : state.angle;
    const rad = ang * Math.PI / 180;
    const x = 170 + Math.cos(rad) * 90;
    const y = 36 + (1 - Math.sin(rad)) * 20;
    g.appendChild(svg('circle', { cx: x, cy: y, r: 14, fill: '#F0C36B' }));
    g.appendChild(svg('path', { d: 'M40 160 Q170 150 300 160', fill: 'none', stroke: '#C9A27E', 'stroke-width': 8 }));
    g.appendChild(svg('line', { x1: x, y1: y + 14, x2: 170, y2: 156, stroke: '#F0C36B', 'stroke-width': ang > 60 ? 10 : 18, 'stroke-linecap': 'round', opacity: 0.85 }));
    T(g, 170, 186, (state.label || '太阳高度') + ' ' + Math.round(ang) + '°', 13, INK);
  });

  reg('ridge2', '0 0 340 200', function (g, state) {
    bg(g, '#F4F7F2');
    g.appendChild(svg('path', { d: 'M20 150 L120 70 L220 150 L320 110', fill: '#E7D3B4', stroke: INK, 'stroke-width': 1.4 }));
    const winter = state.season !== 'summer';
    if (state.peak) T(g, 120, 46, state.peak, 13, INK);
    if (winter) {
      g.appendChild(svg('path', { d: 'M30 90 H110', stroke: '#8FA7C9', 'stroke-width': 3, 'marker-end': 'none' }));
      T(g, 70, 80, '冷空气', 11, '#3D86D9');
      T(g, 90, 130, state.north || '北 <0℃', 11, '#3D86D9');
      T(g, 180, 120, state.south || '南 >0℃', 11, '#C8664A');
    } else {
      g.appendChild(svg('ellipse', { cx: 150, cy: 58, rx: 22, ry: 12, fill: '#fff', stroke: '#8AA8B0', 'stroke-width': 1 }));
      T(g, 200, 90, '翻山后变干', 12, GEO);
      T(g, 90, 130, state.north || '山北', 11, '#3D86D9');
      T(g, 250, 120, state.south || '山南 · 先下雨', 11, '#C8664A');
    }
    T(g, 170, 186, winter ? '冬天：冷空气被山挡住' : '夏天：湿气爬坡下雨', 12, '#6E655C');
  });

  reg('seaLand', '0 0 340 200', function (g, state) {
    bg(g, '#F7F1E8');
    g.appendChild(svg('rect', { x: 24, y: 70, width: 120, height: 70, rx: 8, fill: '#E6D2A2' }));
    g.appendChild(svg('rect', { x: 180, y: 70, width: 130, height: 70, rx: 8, fill: '#9FD0D8' }));
    T(g, 84, 108, state.land || '沙', 14, INK);
    T(g, 245, 108, state.sea || '海', 14, INK);
    const hot = state.hot || 'land';
    T(g, 84, 58, hot === 'land' ? '热得快' : '凉得快', 12, '#C8664A');
    T(g, 245, 58, hot === 'sea' ? '热得慢' : '凉得慢', 12, '#3D86D9');
    if (state.wind) {
      g.appendChild(svg('path', { d: 'M150 40 H210', stroke: GEO, 'stroke-width': 2.4 }));
      T(g, 170, 32, '风从冷吹向热', 11, GEO);
    }
  });

  reg('sediment', '0 0 340 200', function (g, state) {
    bg(g, '#FBF7F1');
    g.appendChild(svg('rect', { x: 40, y: 36, width: 90, height: 120, rx: 8, fill: '#E7F0F2', stroke: INK, 'stroke-width': 1.4 }));
    const layers = state.layers == null ? 3 : state.layers;
    for (let i = 0; i < layers; i++) {
      g.appendChild(svg('rect', { x: 48, y: 120 - i * 16, width: 74, height: 12, fill: i % 2 ? '#C9A27E' : '#E3C9A0' }));
    }
    g.appendChild(svg('path', { d: 'M160 150 H300', stroke: '#5FA8C8', 'stroke-width': 8 }));
    g.appendChild(svg('rect', { x: 210, y: 118, width: 16, height: 40, fill: '#C9A27E' }));
    T(g, 250, 108, state.note || '沙沉下来，河床垫高', 12, INK);
  });

  reg('delta', '0 0 340 200', function (g, state) {
    bg(g, '#F4F7F2');
    g.appendChild(svg('rect', { x: 30, y: 30, width: 70, height: 90, rx: 6, fill: '#E7F0F2', stroke: INK, 'stroke-width': 1.2 }));
    g.appendChild(svg('rect', { x: 40, y: 88, width: 50, height: 18, fill: '#C9A27E' }));
    T(g, 65, 48, '泥水', 11, INK);
    g.appendChild(svg('path', { d: 'M160 40 C200 80 180 120 240 150 C200 130 190 90 160 40', fill: '#E3C9A0', stroke: GEO, 'stroke-width': 1.4 }));
    T(g, 230, 80, state.caption || '河口越长越大', 12, INK);
    T(g, 70, 130, '河', 11, '#1D4E89');
    T(g, 200, 150, '三角洲', 12, INK);
  });

  reg('soil', '0 0 340 200', function (g, state) {
    bg(g, '#F7F1E8');
    g.appendChild(svg('path', { d: 'M20 150 L90 80 L160 150 Z', fill: '#E6D2A2', stroke: INK, 'stroke-width': 1.2 }));
    g.appendChild(svg('path', { d: 'M180 150 L250 80 L320 150 Z', fill: '#C9D7A8', stroke: INK, 'stroke-width': 1.2 }));
    T(g, 90, 170, '没草：土被冲走', 12, '#7A4E2D');
    T(g, 250, 170, state.kind === 'black' ? '黑土：腐殖质' : '有草：土留得住', 12, '#3F6B4A');
  });

  reg('clocks', '0 0 340 200', function (g, state) {
    bg(g, '#152B3A');
    const names = state.names || ['乌鲁木齐', '北京', '上海'];
    const suns = state.suns || [28, 62, 80];
    names.forEach(function (name, i) {
      const x = 60 + i * 110;
      g.appendChild(svg('circle', { cx: x, cy: 78, r: 36, fill: '#1F6E84', stroke: '#9FE3DA', 'stroke-width': 2 }));
      g.appendChild(svg('line', { x1: x, y1: 78, x2: x, y2: 52, stroke: '#fff', 'stroke-width': 2 }));
      g.appendChild(svg('line', { x1: x, y1: 78, x2: x + 16, y2: 78, stroke: '#FFD66B', 'stroke-width': 2 }));
      T(g, x, 132, name, 12, '#E8F2F6');
      T(g, x, 150, '太阳 ' + suns[i] + '°', 11, '#FFD66B');
    });
  });

  reg('sundial', '0 0 340 200', function (g, state) {
    bg(g, '#FBF7F1');
    g.appendChild(svg('line', { x1: 170, y1: 150, x2: 170, y2: 70, stroke: INK, 'stroke-width': 3 }));
    g.appendChild(svg('line', { x1: 170, y1: 150, x2: 80, y2: 120, stroke: '#A79E94', 'stroke-width': 8, 'stroke-linecap': 'round' }));
    g.appendChild(svg('path', { d: 'M40 40 Q170 10 300 50', fill: 'none', stroke: '#F0C36B', 'stroke-width': 2 }));
    T(g, 170, 180, state.caption || '影子最短的时候是正午', 13, INK);
  });

  reg('gauge', '0 0 340 200', function (g, state) {
    bg(g, '#F7F1E8');
    const vals = state.values || [800, 400];
    const labels = state.labels || ['800 mm', '400 mm'];
    vals.forEach(function (v, i) {
      const x = 90 + i * 120;
      const h = Math.max(8, Math.min(120, v / 8));
      g.appendChild(svg('rect', { x: x, y: 30, width: 36, height: 130, rx: 8, fill: 'none', stroke: INK, 'stroke-width': 1.4 }));
      g.appendChild(svg('rect', { x: x + 4, y: 156 - h, width: 28, height: h, rx: 4, fill: i ? '#8FA7C9' : GEO }));
      T(g, x + 18, 180, labels[i], 12, INK);
    });
  });

  reg('cloudTrip', '0 0 340 200', function (g, state) {
    bg(g, '#EAF4F6');
    const n = 4;
    for (let i = 0; i < n; i++) {
      const x = 40 + i * 75;
      const r = 22 - i * 4;
      g.appendChild(svg('ellipse', { cx: x, cy: 70, rx: r + 8, ry: r * 0.6, fill: '#fff', stroke: '#8AA8B0', 'stroke-width': 1 }));
      g.appendChild(svg('rect', { x: x - 8, y: 120, width: 16, height: 40 - i * 8, fill: '#5FA8C8' }));
    }
    T(g, 170, 186, '越往西北，云越小，雨越少', 12, INK);
  });

  reg('tilt', '0 0 340 180', function (g, state) {
    bg(g, '#FBF7F1');
    const a = (state.angle == null ? 12 : state.angle) * Math.PI / 180;
    g.appendChild(svg('path', { d: 'M40 120 L300 120 L280 140 L60 140 Z', fill: '#E6D2A2', stroke: INK, 'stroke-width': 1.2, transform: 'rotate(' + (state.angle || 12) + ' 170 120)' }));
    T(g, 170, 40, '桌子垫高，水往低处流', 14, INK);
    T(g, 250, 100, '低', 13, GEO);
  });

  reg('drop', '0 0 340 200', function (g, state) {
    bg(g, '#F7F1E8');
    [80, 220].forEach(function (x, i) {
      const h = i ? 40 : 110;
      g.appendChild(svg('rect', { x: x, y: 150 - h, width: 50, height: h, fill: i ? '#EEE3C8' : '#C9A27E' }));
      g.appendChild(svg('circle', { cx: x + 25, cy: 150 - h - 16, r: 8, fill: '#5FA8C8' }));
      T(g, x + 25, 176, i ? '第三级：水花小' : '第一级：水花大', 11, INK);
    });
  });

  reg('tl', '0 0 340 160', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 160, fill: '#FBF6EE' }));
    const list = (global.DYNASTIES || []).slice(0, state.count || 22);
    const focus = state.focus || '';
    list.forEach(function (d, i) {
      const x = 8 + i * (320 / list.length);
      const w = Math.max(8, 320 / list.length - 2);
      const split = /三国|晋|十六|南北朝|五代/.test(d.name);
      g.appendChild(svg('rect', {
        x: x, y: 60, width: w, height: 28, rx: 2,
        fill: focus && d.name.indexOf(focus) >= 0 ? '#3A302A' : HIST,
        opacity: split ? 0.55 : 0.9
      }));
      if (i % 3 === 0) T(g, x + w / 2, 108, d.name.slice(0, 2), 9, INK);
    });
    T(g, 170, 28, state.caption || '从夏到清', 14, INK);
  });

  reg('cycle', '0 0 340 220', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 220, fill: '#FBF3EC' }));
    g.appendChild(svg('ellipse', { cx: 170, cy: 110, rx: 110, ry: 70, fill: 'none', stroke: '#E7D3B4', 'stroke-width': 8 }));
    const nodes = ['统一', '地方坐大', '分裂', '想再统一'];
    const pos = [[170, 36], [270, 110], [170, 184], [70, 110]];
    const at = state.at == null ? 0 : state.at % 4;
    pos.forEach(function (p, i) {
      g.appendChild(svg('circle', { cx: p[0], cy: p[1], r: 16, fill: i === at ? '#E2B43A' : '#fff', stroke: INK, 'stroke-width': 1.4 }));
      T(g, p[0], p[1] + 28, nodes[i], 11, INK);
    });
    const ball = pos[at];
    g.appendChild(svg('circle', { cx: ball[0], cy: ball[1], r: 7, fill: '#E2B43A', stroke: INK, 'stroke-width': 1 }));
    T(g, 170, 114, state.caption || '分合', 13, '#fff');
  });

  reg('histmap', '0 0 340 220', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 220, fill: '#F4EEE6' }));
    if (global.CN_GEO && global.LKCn && LKCn.paintMini) {
      const mini = svg('g', { transform: 'translate(40 16) scale(0.85)' });
      g.appendChild(mini);
      LKCn.paintMini(mini, { s: 5.2, dx: 0, dy: 0 });
    } else {
      g.appendChild(svg('path', { d: 'M80 40 L240 30 L270 90 L230 170 L100 160 Z', fill: '#E7D3B4', stroke: INK, 'stroke-width': 1.2 }));
    }
    T(g, 170, 208, state.caption || '都城和疆域', 13, INK);
  });

  reg('tree', '0 0 340 210', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 210, fill: '#FBF3EC' }));
    const rows = state.rows || ['天子', '诸侯', '卿大夫', '士'];
    rows.forEach(function (name, i) {
      if (state.step != null && i > state.step + 1) return;
      const y = 28 + i * 44;
      const n = i === 0 ? 1 : (i === 1 ? 2 : 3);
      for (let k = 0; k < n; k++) {
        const x = 170 - (n - 1) * 40 + k * 80;
        g.appendChild(svg('rect', { x: x - 28, y: y, width: 56, height: 26, rx: 8, fill: i === 0 ? HIST : '#F8EBDD', stroke: INK, 'stroke-width': 1.2 }));
        T(g, x, y + 17, i === 0 ? name : name, 11, i === 0 ? '#fff' : INK);
        if (i) g.appendChild(svg('line', { x1: 170, y1: y - 16, x2: x, y2: y, stroke: '#C9B8A4', 'stroke-width': 1.2 }));
      }
    });
  });

  reg('tug', '0 0 340 160', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 160, fill: '#FBF3EC' }));
    const u = state.pull == null ? 0.5 : state.pull;
    const x = 70 + u * 180;
    g.appendChild(svg('line', { x1: 40, y1: 80, x2: 300, y2: 80, stroke: '#C9B8A4', 'stroke-width': 4 }));
    g.appendChild(svg('circle', { cx: x, cy: 80, r: 10, fill: HIST }));
    T(g, 50, 40, '中央', 14, INK);
    T(g, 290, 40, '地方', 14, INK);
    T(g, 170, 130, u < 0.4 ? '权在中央' : (u > 0.6 ? '权在地方' : '两边拉着'), 13, '#6E655C');
  });

  reg('chain', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#FBF7F1' }));
    const nodes = state.nodes || ['因', '经过', '果'];
    const show = state.step == null ? nodes.length : Math.min(nodes.length, state.step + 1);
    nodes.forEach(function (name, i) {
      if (i >= show) return;
      const x = 30 + i * (280 / Math.max(1, nodes.length - 1));
      g.appendChild(svg('rect', { x: x - 28, y: 70, width: 64, height: 36, rx: 10, fill: '#fff', stroke: GEO, 'stroke-width': 1.6 }));
      T(g, x + 4, 92, String(name).slice(0, 6), 11, INK);
      if (i) g.appendChild(svg('line', { x1: x - 36, y1: 88, x2: x - 30, y2: 88, stroke: GEO, 'stroke-width': 2 }));
    });
  });

  reg('yearline', '0 0 340 140', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 140, fill: '#FBF3EC' }));
    g.appendChild(svg('line', { x1: 20, y1: 70, x2: 320, y2: 70, stroke: INK, 'stroke-width': 1.6 }));
    g.appendChild(svg('line', { x1: 190, y1: 50, x2: 190, y2: 90, stroke: HIST, 'stroke-width': 2 }));
    T(g, 190, 108, '公元元年', 11, HIST);
    T(g, 80, 58, state.left || '公元前', 12, INK);
    T(g, 270, 58, state.right || '公元后', 12, INK);
    if (state.bracket) T(g, 170, 28, state.bracket, 13, GEO);
  });

  reg('blocks', '0 0 340 200', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 200, fill: '#FCF1DC' }));
    const n = state.years == null ? 4 : state.years;
    for (let i = 0; i < n; i++) {
      const h = 18 + (state.compound ? i * 8 : 0);
      g.appendChild(svg('rect', { x: 70, y: 160 - i * 22, width: 70, height: 18, rx: 3, fill: i ? '#F0C36B' : '#D99A2B' }));
      if (state.compound) g.appendChild(svg('rect', { x: 200, y: 160 - i * (22 + i), width: 70, height: 16 + i * 2, rx: 3, fill: '#D99A2B' }));
    }
    T(g, 105, 184, '单利', 12, INK);
    if (state.compound) T(g, 235, 184, '复利', 12, INK);
  });

  reg('body3', '0 0 340 210', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 210, fill: '#F6F1FA' }));
    g.appendChild(svg('circle', { cx: 170, cy: 70, r: 22, fill: '#F6D7BF', stroke: INK, 'stroke-width': 1.6 }));
    g.appendChild(svg('path', { d: 'M150 96 h40 v50 h-40 z', fill: '#7C6BD6', opacity: 0.85 }));
    const zones = state.zones || ['心里', '身体', '外面'];
    [[70, 40], [170, 160], [270, 40]].forEach(function (p, i) {
      if (state.step != null && i > state.step) return;
      g.appendChild(svg('rect', { x: p[0] - 28, y: p[1], width: 56, height: 24, rx: 8, fill: '#fff', stroke: PSY, 'stroke-width': 1.4 }));
      T(g, p[0], p[1] + 16, zones[i] || '', 12, PSY);
    });
  });

  reg('wires', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#F6F1FA' }));
    const nodes = state.nodes || ['刺激', '身体', '感受'];
    nodes.forEach(function (name, i) {
      const x = 50 + i * 110;
      g.appendChild(svg('circle', { cx: x, cy: 80, r: 26, fill: '#fff', stroke: PSY, 'stroke-width': 2 }));
      T(g, x, 84, name, 12, INK);
      if (i) g.appendChild(svg('line', { x1: x - 70, y1: 80, x2: x - 30, y2: 80, stroke: PSY, 'stroke-width': 2 }));
    });
    T(g, 170, 150, state.note || '', 12, '#6E655C');
  });

  reg('curve2', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#F6F1FA' }));
    g.appendChild(svg('path', { d: 'M30 140 Q120 20 170 70 T310 150', fill: 'none', stroke: PSY, 'stroke-width': 3 }));
    const x = 40 + (state.x == null ? 0.45 : state.x) * 240;
    g.appendChild(svg('circle', { cx: x, cy: 78, r: 8, fill: '#E2B43A', stroke: INK, 'stroke-width': 1 }));
    T(g, 170, 168, '紧张太低或太高，都发挥不好', 12, INK);
  });

  reg('gas', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#F6F1FA' }));
    g.appendChild(svg('path', { d: 'M30 80 L70 120 L150 50 L230 50 L310 130', fill: 'none', stroke: PSY, 'stroke-width': 3 }));
    ['警觉', '抵抗', '衰竭'].forEach(function (name, i) { T(g, 70 + i * 90, 160, name, 12, INK); });
  });

  reg('process', '0 0 340 150', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 150, fill: '#F6F1FA' }));
    ['情境', '注意', '评价', '反应'].forEach(function (name, i) {
      const x = 30 + i * 80;
      const cut = state.cut === name;
      g.appendChild(svg('rect', { x: x, y: 50, width: 64, height: 32, rx: 8, fill: cut ? '#fff' : PSY }));
      T(g, x + 32, 70, name, 12, cut ? PSY : '#fff');
    });
    if (state.cut) T(g, 170, 120, '剪刀剪在「' + state.cut + '」', 13, HIST);
  });

  reg('abc', '0 0 340 160', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 160, fill: '#F6F1FA' }));
    [['A 事件', 40], ['B 信念', 140], ['C 感受', 240]].forEach(function (pair, i) {
      const open = state.step == null || state.step >= 1 || i !== 1;
      g.appendChild(svg('rect', { x: pair[1], y: 50, width: 70, height: 48, rx: 8, fill: open ? '#fff' : '#E4DCF5', stroke: PSY, 'stroke-width': 1.4 }));
      T(g, pair[1] + 35, 78, open || i !== 1 ? pair[0] : '?', 12, INK);
    });
  });

  reg('faces', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#FBF6EE' }));
    const names = state.names || ['喜', '怒', '哀', '惧', '厌', '惊'];
    names.forEach(function (name, i) {
      const x = 36 + (i % 6) * 52;
      g.appendChild(svg('circle', { cx: x, cy: 70, r: 20, fill: '#F6D7BF', stroke: INK, 'stroke-width': 1.3 }));
      T(g, x, 112, name, 12, INK);
    });
  });

  reg('appraise', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#F6F1FA' }));
    ['这对我意味着什么', '我应付得了吗'].forEach(function (q, i) {
      g.appendChild(svg('rect', { x: 30 + i * 150, y: 36, width: 130, height: 70, rx: 10, fill: '#fff', stroke: PSY, 'stroke-width': 1.4 }));
      T(g, 95 + i * 150, 64, q.slice(0, 6), 12, INK);
      T(g, 95 + i * 150, 86, state.answers ? state.answers[i] : '？', 12, PSY);
    });
  });

  reg('knobs', '0 0 340 200', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 200, fill: '#FDF2F5' }));
    const hue = state.hue == null ? 350 : state.hue;
    const lit = state.light == null ? 70 : state.light;
    g.appendChild(svg('rect', { x: 36, y: 28, width: 120, height: 120, rx: 12, fill: 'hsl(' + hue + ' 45% ' + lit + '%)' }));
    ['色相', '明度', '纯度'].forEach(function (name, i) {
      const y = 40 + i * 42;
      g.appendChild(svg('line', { x1: 190, y1: y, x2: 300, y2: y, stroke: '#E7C9D2', 'stroke-width': 4 }));
      g.appendChild(svg('circle', { cx: 210 + i * 30, cy: y, r: 8, fill: FASH }));
      T(g, 250, y + 18, name, 11, INK);
    });
  });

  reg('bw', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 170, height: 180, fill: '#F3C1C9' }));
    g.appendChild(svg('rect', { x: 170, width: 170, height: 180, fill: '#D9D4CF' }));
    T(g, 85, 96, '彩色', 16, '#fff');
    T(g, 255, 96, '黑白', 16, INK);
    T(g, 170, 160, state.caption || '先看亮和暗', 13, INK);
  });

  reg('wheelBuild', '0 0 340 210', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 210, fill: '#FDF2F5' }));
    const colors = ['#E24B4B', '#E8833A', '#E2B43A', '#7DBA6A', '#3FA7A0', '#3D86D9', '#7C6BD6', '#C45C7A'];
    const n = state.count == null ? 8 : state.count;
    for (let i = 0; i < n; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      g.appendChild(svg('circle', { cx: 170 + Math.cos(a) * 70, cy: 100 + Math.sin(a) * 70, r: 16, fill: colors[i % colors.length] }));
    }
    T(g, 170, 198, '色轮', 12, '#6E655C');
  });

  reg('outfit', '0 0 340 210', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 210, fill: '#FBF6EE' }));
    g.appendChild(svg('circle', { cx: 120, cy: 48, r: 16, fill: '#F6D7BF', stroke: INK, 'stroke-width': 1.3 }));
    g.appendChild(svg('rect', { x: 100, y: 68, width: 40, height: 36, rx: 6, fill: state.top || FASH }));
    g.appendChild(svg('rect', { x: 104, y: 108, width: 32, height: 40, rx: 4, fill: state.bottom || '#3A302A' }));
    T(g, 230, 80, state.note || '上衣、下装、小点缀', 13, INK);
    if (state.ratio) T(g, 230, 110, state.ratio, 14, FASH);
  });

  reg('afterimage', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 170, height: 180, fill: '#E24B4B' }));
    g.appendChild(svg('rect', { x: 170, width: 170, height: 180, fill: '#F4F7F2' }));
    g.appendChild(svg('rect', { x: 220, y: 60, width: 60, height: 60, fill: '#C9E6C0', opacity: 0.8 }));
    T(g, 85, 96, '盯着红', 16, '#fff');
    T(g, 250, 150, '白墙上偏绿', 13, '#3F6B4A');
  });

  reg('temp', '0 0 340 180', function (g, state) {
    g.appendChild(svg('rect', { width: 340, height: 180, fill: '#FDF2F5' }));
    g.appendChild(svg('rect', { x: 40, y: 40, width: 100, height: 80, rx: 10, fill: '#E24B4B' }));
    g.appendChild(svg('rect', { x: 190, y: 50, width: 90, height: 70, rx: 10, fill: '#3D86D9' }));
    T(g, 90, 150, '暖，往前', 13, '#E24B4B');
    T(g, 235, 150, '冷，往后', 13, '#3D86D9');
  });
})(window);
