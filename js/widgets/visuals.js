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

  function render(v) {
    if (!v) return null;
    if (v.type === 'swatches') return swatches(v);
    if (v.type === 'bars') return bars(v);
    if (v.type === 'ladder') return ladder(v);
    if (v.type === 'flow') return flow(v);
    if (v.type === 'wheel') return wheel(v);
    if (v.type === 'curve') return curve(v);
    return null;
  }

  global.LKVisuals = { render: render };
})(window);
