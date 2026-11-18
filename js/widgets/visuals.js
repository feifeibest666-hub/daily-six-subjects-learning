(function (global) {
  function swatches(v) {
    const row = LK.h('div', { class: 'viz viz-swatches' });
    (v.colors || []).forEach(function (c, i) {
      const item = LK.h('div', { class: 'viz-swatch' }, [
        LK.h('i', { style: { background: c } }),
        v.labels && v.labels[i] ? LK.h('span', { text: v.labels[i] }) : null
      ]);
      row.appendChild(item);
    });
    return row;
  }

  function bars(v) {
    const items = v.items || [];
    const max = Math.max.apply(null, items.map(function (it) { return Math.abs(it.value); }).concat([1]));
    const box = LK.h('div', { class: 'viz viz-bars' });
    items.forEach(function (it) {
      const neg = it.value < 0;
      const row = LK.h('div', { class: 'viz-bar-row' }, [
        LK.h('span', { class: 'viz-bar-label', text: it.label }),
        LK.h('span', { class: 'viz-bar-track' }, [
          LK.h('i', {
            class: 'viz-bar-fill' + (neg ? ' is-neg' : ''),
            style: {
              width: Math.max(6, Math.round(Math.abs(it.value) / max * 100)) + '%',
              background: it.color || (neg ? 'var(--bad)' : 'var(--accent)')
            }
          })
        ]),
        LK.h('span', { class: 'num viz-bar-val', text: (it.value > 0 ? '+' : '') + it.value + (v.unit || '') })
      ]);
      box.appendChild(row);
    });
    return box;
  }

  function ladder(v) {
    const box = LK.h('div', { class: 'viz viz-ladder' });
    const heights = ['100%', '68%', '40%'];
    (v.steps || []).forEach(function (s, i) {
      box.appendChild(LK.h('div', { class: 'viz-ladder-step', style: { height: heights[i] || '40%' } }, [
        LK.h('b', { text: s.label }),
        LK.h('span', { text: s.sub || '' })
      ]));
    });
    return box;
  }

  function flow(v) {
    const box = LK.h('div', { class: 'viz viz-flow' });
    (v.nodes || []).forEach(function (n, i) {
      if (i) box.appendChild(LK.h('span', { class: 'viz-arrow', text: '→' }));
      box.appendChild(LK.h('span', { class: 'viz-node', text: n }));
    });
    return box;
  }

  function wheel(v) {
    const colors = v.colors || [];
    const hi = v.highlight || [];
    const svg = LK.svg('svg', { class: 'viz viz-wheel', viewBox: '0 0 200 200' });
    colors.forEach(function (color, i) {
      const a0 = (i / colors.length) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1) / colors.length) * Math.PI * 2 - Math.PI / 2;
      const hot = hi.indexOf(i) >= 0;
      const r = hot ? 96 : 86;
      const r0 = 36;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const p = [
        'M', 100 + Math.cos(a0) * r0, 100 + Math.sin(a0) * r0,
        'L', 100 + Math.cos(a0) * r, 100 + Math.sin(a0) * r,
        'A', r, r, 0, large, 1, 100 + Math.cos(a1) * r, 100 + Math.sin(a1) * r,
        'L', 100 + Math.cos(a1) * r0, 100 + Math.sin(a1) * r0,
        'A', r0, r0, 0, large, 0, 100 + Math.cos(a0) * r0, 100 + Math.sin(a0) * r0, 'Z'
      ].join(' ');
      svg.appendChild(LK.svg('path', { d: p, fill: color }));
    });
    svg.appendChild(LK.svg('circle', { cx: '100', cy: '100', r: '28', fill: '#fff' }));
    return svg;
  }

  function curve() {
    const svg = LK.svg('svg', { class: 'viz viz-curve', viewBox: '0 0 280 150' });
    svg.appendChild(LK.svg('path', {
      d: 'M28 128 H252',
      stroke: '#ECE4DA',
      'stroke-width': '2',
      fill: 'none'
    }));
    svg.appendChild(LK.svg('path', {
      d: 'M36 128 C70 128 78 28 140 28 C202 28 210 128 244 128',
      stroke: '#7C6BD6',
      'stroke-width': '3.5',
      fill: 'none',
      'stroke-linecap': 'round'
    }));
    svg.appendChild(LK.svg('circle', { cx: '140', cy: '28', r: '5', fill: '#F2B640' }));
    const wrap = LK.h('div', { class: 'viz-curve-wrap' }, [svg]);
    wrap.appendChild(LK.h('div', { class: 'viz-curve-labels' }, [
      LK.h('span', { text: '太松' }),
      LK.h('span', { text: '正好' }),
      LK.h('span', { text: '太紧' })
    ]));
    return wrap;
  }

  const GEO = '#2F9E8F';
  const GEO_SOFT = '#DFF4F0';
  const INK2 = 'var(--ink-2)';
  const LINE = 'var(--line)';

  function svgText(attrs, text) {
    const node = LK.svg('text', attrs);
    node.textContent = text;
    return node;
  }

  function geoSvg(viewBox) {
    return LK.svg('svg', { class: 'viz viz-geo', viewBox: viewBox, role: 'img' });
  }

  function gridViz(v) {
    const svg = geoSvg('0 0 240 170');
    const cols = v.cols || 6;
    const rows = v.rows || 4;
    const x0 = 30;
    const x1 = 230;
    const y0 = 10;
    const y1 = 140;
    const cw = (x1 - x0) / cols;
    const rh = (y1 - y0) / rows;
    for (let c = 0; c <= cols; c++) {
      const x = x0 + c * cw;
      svg.appendChild(LK.svg('line', { x1: x, y1: y0, x2: x, y2: y1, stroke: LINE, 'stroke-width': '1' }));
    }
    for (let r = 0; r <= rows; r++) {
      const y = y0 + r * rh;
      svg.appendChild(LK.svg('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: LINE, 'stroke-width': '1' }));
    }
    const dc = (v.dot && v.dot[0]) || 1;
    const dr = (v.dot && v.dot[1]) || 1;
    const cx = x0 + (dc - 0.5) * cw;
    const cy = y0 + (dr - 0.5) * rh;
    svg.appendChild(LK.svg('line', { x1: cx, y1: cy, x2: x0, y2: cy, stroke: GEO, 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
    svg.appendChild(LK.svg('line', { x1: cx, y1: cy, x2: cx, y2: y1, stroke: GEO, 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
    svg.appendChild(svgText({ x: cx, y: y1 + 14, 'text-anchor': 'middle', 'font-size': '12', fill: GEO, 'font-weight': '600' }, String(dc)));
    svg.appendChild(svgText({ x: x0 - 4, y: cy + 4, 'text-anchor': 'end', 'font-size': '12', fill: GEO, 'font-weight': '600' }, String(dr)));
    svg.appendChild(LK.svg('circle', { cx: cx, cy: cy, r: '6', fill: GEO }));
    if (v.dotLabel) svg.appendChild(svgText({ x: cx + 8, y: cy - 8, 'font-size': '13', fill: GEO, 'font-weight': '600' }, v.dotLabel));
    if (v.xLabel) svg.appendChild(svgText({ x: 130, y: 164, 'text-anchor': 'middle', 'font-size': '12', fill: INK2 }, v.xLabel));
    if (v.yLabel) svg.appendChild(svgText({ x: 12, y: 78, 'text-anchor': 'middle', 'font-size': '12', fill: INK2, transform: 'rotate(-90 12 78)' }, v.yLabel));
    return svg;
  }

  function globeLat(v) {
    const svg = geoSvg('0 0 240 200');
    svg.appendChild(LK.svg('circle', { cx: '120', cy: '100', r: '80', fill: GEO_SOFT, stroke: INK2, 'stroke-width': '1.5' }));
    svg.appendChild(LK.svg('line', { x1: '120', y1: '18', x2: '120', y2: '182', stroke: INK2, 'stroke-width': '1', 'stroke-dasharray': '4 3' }));
    svg.appendChild(svgText({ x: 128, y: 16, 'font-size': '12', fill: INK2 }, '北极'));
    svg.appendChild(svgText({ x: 128, y: 194, 'font-size': '12', fill: INK2 }, '南极'));
    svg.appendChild(LK.svg('line', { x1: '40', y1: '100', x2: '200', y2: '100', stroke: GEO, 'stroke-width': '2.5' }));
    svg.appendChild(svgText({ x: 46, y: 94, 'font-size': '12', fill: GEO, 'font-weight': '600' }, '赤道 0°'));
    (v.lines || []).forEach(function (deg) {
      if (!deg) return;
      const phi = deg * Math.PI / 180;
      const y = 100 - 80 * Math.sin(phi);
      const hw = 80 * Math.cos(phi);
      svg.appendChild(LK.svg('line', { x1: 120 - hw, y1: y, x2: 120 + hw, y2: y, stroke: INK2, 'stroke-width': '1' }));
      svg.appendChild(svgText({ x: Math.min(204, 120 + hw + 4), y: y + 4, 'font-size': '12', fill: INK2 }, '北纬 ' + deg + '°'));
    });
    if (v.angle) {
      const phi = v.angle * Math.PI / 180;
      const x2 = 120 + 80 * Math.cos(phi);
      const y2 = 100 - 80 * Math.sin(phi);
      svg.appendChild(LK.svg('line', { x1: '120', y1: '100', x2: '200', y2: '100', stroke: INK2, 'stroke-width': '1.5' }));
      svg.appendChild(LK.svg('line', { x1: '120', y1: '100', x2: x2, y2: y2, stroke: INK2, 'stroke-width': '1.5' }));
      const ax = 120 + 28 * Math.cos(phi);
      const ay = 100 - 28 * Math.sin(phi);
      svg.appendChild(LK.svg('path', {
        d: 'M 148 100 A 28 28 0 0 0 ' + ax + ' ' + ay,
        fill: 'none', stroke: GEO, 'stroke-width': '1.5'
      }));
      const mid = (v.angle / 2) * Math.PI / 180;
      svg.appendChild(svgText({
        x: 120 + 44 * Math.cos(mid),
        y: 100 - 44 * Math.sin(mid) + 4,
        'text-anchor': 'middle',
        'font-size': '13',
        fill: GEO,
        'font-weight': '600'
      }, v.angle + '°'));
    }
    return svg;
  }

  function polar(deg, r) {
    const rad = deg * Math.PI / 180;
    return [120 + r * Math.sin(rad), 120 + r * Math.cos(rad)];
  }

  function wedge(a0, a1, r) {
    const p0 = polar(a0, r);
    const p1 = polar(a1, r);
    const large = (a1 - a0) > 180 ? 1 : 0;
    return 'M 120 120 L ' + p0[0] + ' ' + p0[1] + ' A ' + r + ' ' + r + ' 0 ' + large + ' 0 ' + p1[0] + ' ' + p1[1] + ' Z';
  }

  function globeLon(v) {
    const svg = geoSvg('0 0 240 240');
    if (v.sectors) {
      const n = v.sectors;
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * 360;
        const a1 = ((i + 1) / n) * 360;
        svg.appendChild(LK.svg('path', {
          d: wedge(a0, a1, 90),
          fill: i % 2 === 0 ? GEO_SOFT : '#FFFFFF',
          stroke: i === 0 ? GEO : LINE,
          'stroke-width': i === 0 ? '2' : '1'
        }));
      }
      const mid = polar(360 / n / 2, 58);
      svg.appendChild(svgText({ x: mid[0] + 4, y: mid[1], 'font-size': '11', fill: GEO, 'font-weight': '600' }, '1 小时 = 15°'));
    }
    if (v.sun && !v.sectors) {
      svg.appendChild(LK.svg('circle', { cx: '120', cy: '120', r: '90', fill: GEO_SOFT }));
    }
    if (v.sun) {
      svg.appendChild(LK.svg('path', {
        d: 'M 120 30 A 90 90 0 0 0 120 210 Z',
        fill: 'rgba(43,38,34,.12)'
      }));
    }
    svg.appendChild(LK.svg('circle', { cx: '120', cy: '120', r: '90', fill: v.sectors || v.sun ? 'none' : GEO_SOFT, stroke: INK2, 'stroke-width': '1.5' }));
    const step = v.step || 0;
    if (step) {
      const hi = v.highlight || [];
      for (let deg = 0; deg < 360; deg += step) {
        const p = polar(deg, 90);
        const hot = hi.indexOf(deg) >= 0 || hi.indexOf(deg - 360) >= 0;
        svg.appendChild(LK.svg('line', {
          x1: '120', y1: '120', x2: p[0], y2: p[1],
          stroke: hot ? GEO : INK2,
          'stroke-width': hot ? '2.5' : '1'
        }));
      }
      const z = polar(0, 98);
      const o = polar(180, 98);
      svg.appendChild(svgText({ x: z[0], y: Math.min(232, z[1] + 12), 'text-anchor': 'middle', 'font-size': '11', fill: GEO, 'font-weight': '600' }, '0° 格林尼治'));
      svg.appendChild(svgText({ x: o[0], y: Math.max(14, o[1] - 6), 'text-anchor': 'middle', 'font-size': '11', fill: INK2 }, '180°'));
    }
    if (v.arrows) {
      const a = polar(0, 102);
      const b = polar(180, 102);
      svg.appendChild(LK.svg('path', {
        d: 'M ' + a[0] + ' ' + a[1] + ' A 102 102 0 0 0 ' + b[0] + ' ' + b[1],
        fill: 'none', stroke: GEO, 'stroke-width': '1.5'
      }));
      svg.appendChild(LK.svg('path', {
        d: 'M ' + a[0] + ' ' + a[1] + ' A 102 102 0 0 1 ' + b[0] + ' ' + b[1],
        fill: 'none', stroke: INK2, 'stroke-width': '1.5'
      }));
      svg.appendChild(svgText({ x: 168, y: 78, 'font-size': '11', fill: GEO, 'font-weight': '600' }, '东经 0～180°'));
      svg.appendChild(svgText({ x: 8, y: 78, 'font-size': '11', fill: INK2 }, '西经 0～180°'));
    }
    if (v.sun) {
      svg.appendChild(LK.svg('circle', { cx: '214', cy: '120', r: '12', fill: 'var(--gold)' }));
      [108, 120, 132].forEach(function (y) {
        svg.appendChild(LK.svg('line', { x1: '198', y1: y, x2: '176', y2: y, stroke: 'var(--gold)', 'stroke-width': '1.5' }));
      });
      const arcA = polar(20, 108);
      const arcB = polar(200, 108);
      svg.appendChild(LK.svg('path', {
        d: 'M ' + arcA[0] + ' ' + arcA[1] + ' A 108 108 0 1 0 ' + arcB[0] + ' ' + arcB[1],
        fill: 'none', stroke: GEO, 'stroke-width': '1.5'
      }));
      svg.appendChild(svgText({ x: 150, y: 28, 'font-size': '11', fill: GEO, 'font-weight': '600' }, '自西向东转'));
      svg.appendChild(svgText({ x: 126, y: 228, 'font-size': '12', fill: GEO, 'font-weight': '600' }, '日出'));
      svg.appendChild(svgText({ x: 126, y: 16, 'font-size': '12', fill: INK2 }, '日落'));
    }
    svg.appendChild(LK.svg('circle', { cx: '120', cy: '118', r: '18', fill: '#fff' }));
    svg.appendChild(svgText({ x: 120, y: 123, 'text-anchor': 'middle', 'font-size': '13', fill: GEO, 'font-weight': '600' }, '北极'));
    return svg;
  }

  function coordViz(v) {
    const svg = geoSvg('0 0 300 210');
    const x0 = 50;
    const x1 = 290;
    const y0 = 10;
    const y1 = 170;
    const lat0 = v.latRange[0];
    const lat1 = v.latRange[1];
    const lon0 = v.lonRange[0];
    const lon1 = v.lonRange[1];
    const step = v.step || 10;
    function X(lon) { return x0 + (lon - lon0) / (lon1 - lon0) * (x1 - x0); }
    function Y(lat) { return y0 + (lat1 - lat) / (lat1 - lat0) * (y1 - y0); }
    svg.appendChild(LK.svg('rect', { x: x0, y: y0, width: x1 - x0, height: y1 - y0, fill: '#fff', stroke: LINE }));
    for (let lat = lat0; lat <= lat1 + 0.1; lat += step) {
      const y = Y(lat);
      svg.appendChild(LK.svg('line', { x1: x0, y1: y, x2: x1, y2: y, stroke: LINE, 'stroke-width': '1' }));
      svg.appendChild(svgText({ x: x0 - 4, y: y + 4, 'text-anchor': 'end', 'font-size': '12', fill: INK2 }, String(lat) + '°'));
    }
    for (let lon = lon0; lon <= lon1 + 0.1; lon += step) {
      const x = X(lon);
      svg.appendChild(LK.svg('line', { x1: x, y1: y0, x2: x, y2: y1, stroke: LINE, 'stroke-width': '1' }));
      svg.appendChild(svgText({ x: x, y: y1 + 14, 'text-anchor': 'middle', 'font-size': '12', fill: INK2 }, String(lon) + '°'));
    }
    const p = v.point || { lat: lat0, lon: lon0, label: '' };
    const px = X(p.lon);
    const py = Y(p.lat);
    svg.appendChild(LK.svg('line', { x1: px, y1: py, x2: x0, y2: py, stroke: GEO, 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
    svg.appendChild(LK.svg('line', { x1: px, y1: py, x2: px, y2: y1, stroke: GEO, 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
    svg.appendChild(svgText({ x: x0 + 2, y: py - 4, 'font-size': '12', fill: GEO, 'font-weight': '600' }, '北纬 ' + p.lat + '°'));
    svg.appendChild(svgText({ x: px + 4, y: y1 - 4, 'font-size': '12', fill: GEO, 'font-weight': '600' }, '东经 ' + p.lon + '°'));
    svg.appendChild(LK.svg('circle', { cx: px, cy: py, r: '6', fill: GEO, stroke: '#fff', 'stroke-width': '2' }));
    if (p.label) svg.appendChild(svgText({ x: px + 10, y: py - 8, 'font-size': '13', fill: GEO, 'font-weight': '600' }, p.label));
    svg.appendChild(svgText({ x: x1 - 2, y: y0 + 14, 'text-anchor': 'end', 'font-size': '12', fill: INK2 }, '示意'));
    return svg;
  }

  function beamViz() {
    const svg = geoSvg('0 0 300 170');
    svg.appendChild(LK.svg('path', { d: 'M10 150 Q150 90 290 150 L290 162 L10 162 Z', fill: '#E3C9A0' }));
    svg.appendChild(LK.svg('path', { d: 'M70 10 L70 142 L100 142 L100 10 Z', fill: 'rgba(242,182,64,.4)' }));
    svg.appendChild(LK.svg('line', { x1: '70', y1: '10', x2: '70', y2: '142', stroke: 'var(--gold)', 'stroke-width': '1.5' }));
    svg.appendChild(LK.svg('line', { x1: '100', y1: '10', x2: '100', y2: '142', stroke: 'var(--gold)', 'stroke-width': '1.5' }));
    svg.appendChild(svgText({ x: 40, y: 24, 'font-size': '12', fill: INK2 }, '直射（低纬度）'));
    svg.appendChild(svgText({ x: 28, y: 158, 'font-size': '11', fill: INK2 }, '光斑小，热量集中'));
    svg.appendChild(LK.svg('path', { d: 'M190 10 L250 148 L286 148 L226 10 Z', fill: 'rgba(242,182,64,.4)' }));
    svg.appendChild(LK.svg('line', { x1: '190', y1: '10', x2: '250', y2: '148', stroke: 'var(--gold)', 'stroke-width': '1.5' }));
    svg.appendChild(LK.svg('line', { x1: '220', y1: '10', x2: '280', y2: '148', stroke: 'var(--gold)', 'stroke-width': '1.5' }));
    svg.appendChild(svgText({ x: 168, y: 24, 'font-size': '12', fill: INK2 }, '斜射（高纬度）'));
    svg.appendChild(svgText({ x: 188, y: 164, 'font-size': '11', fill: INK2 }, '光斑大，热量摊开'));
    return svg;
  }

  function ridgeViz(v) {
    const svg = geoSvg('0 0 300 180');
    svg.appendChild(LK.svg('line', { x1: '10', y1: '160', x2: '290', y2: '160', stroke: INK2, 'stroke-width': '1.5' }));
    svg.appendChild(LK.svg('path', { d: 'M100 160 L150 40 L200 160 Z', fill: '#E3C9A0', stroke: INK2, 'stroke-width': '1.5' }));
    svg.appendChild(svgText({ x: 150, y: 32, 'text-anchor': 'middle', 'font-size': '13', fill: GEO, 'font-weight': '600' }, v.label || ''));
    svg.appendChild(LK.svg('line', { x1: '20', y1: '140', x2: '98', y2: '140', stroke: INK2, 'stroke-width': '2' }));
    svg.appendChild(LK.svg('path', { d: 'M90 134 L98 140 L90 146', fill: 'none', stroke: INK2, 'stroke-width': '2' }));
    svg.appendChild(svgText({ x: 18, y: 132, 'font-size': '12', fill: INK2 }, '冬季冷空气'));
    svg.appendChild(LK.svg('line', { x1: '102', y1: '128', x2: '102', y2: '152', stroke: INK2, 'stroke-width': '2' }));
    svg.appendChild(svgText({ x: 106, y: 124, 'font-size': '12', fill: INK2 }, '挡住'));
    svg.appendChild(LK.svg('path', { d: 'M285 150 L212 150 L170 72', fill: 'none', stroke: GEO, 'stroke-width': '2' }));
    svg.appendChild(LK.svg('path', { d: 'M176 84 L170 72 L182 78', fill: 'none', stroke: GEO, 'stroke-width': '2' }));
    svg.appendChild(svgText({ x: 214, y: 144, 'font-size': '12', fill: GEO }, '夏季湿润气流'));
    [[180, 96], [190, 118], [200, 140]].forEach(function (p) {
      svg.appendChild(LK.svg('line', { x1: p[0], y1: p[1], x2: p[0], y2: p[1] + 10, stroke: GEO, 'stroke-width': '1.5', 'stroke-dasharray': '2 2' }));
    });
    svg.appendChild(svgText({ x: 206, y: 112, 'font-size': '12', fill: GEO }, '爬坡处下雨'));
    svg.appendChild(LK.svg('line', { x1: '145', y1: '45', x2: '80', y2: '90', stroke: GEO, 'stroke-width': '1.5', 'stroke-dasharray': '4 3' }));
    svg.appendChild(LK.svg('path', { d: 'M88 82 L80 90 L92 92', fill: 'none', stroke: GEO, 'stroke-width': '1.5' }));
    svg.appendChild(svgText({ x: 36, y: 84, 'font-size': '12', fill: GEO }, '翻过山后变干'));
    svg.appendChild(svgText({ x: 30, y: 175, 'font-size': '12', fill: INK2 }, v.left || ''));
    svg.appendChild(svgText({ x: 270, y: 175, 'text-anchor': 'end', 'font-size': '12', fill: INK2 }, v.right || ''));
    return svg;
  }

  function render(v) {
    if (!v) return null;
    if (v.type === 'swatches') return swatches(v);
    if (v.type === 'bars') return bars(v);
    if (v.type === 'ladder') return ladder(v);
    if (v.type === 'flow') return flow(v);
    if (v.type === 'wheel') return wheel(v);
    if (v.type === 'curve') return curve(v);
    if (v.type === 'grid') return gridViz(v);
    if (v.type === 'globe') return v.mode === 'lon' ? globeLon(v) : globeLat(v);
    if (v.type === 'coord') return coordViz(v);
    if (v.type === 'beam') return beamViz();
    if (v.type === 'ridge') return ridgeViz(v);
    return null;
  }

  global.LKVisuals = { render: render };
})(window);
