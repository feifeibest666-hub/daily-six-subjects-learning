(function (global) {
  const BLUE = '#3D86D9';
  const ORANGE = '#E8833A';
  const GREEN = '#3FA772';
  const GREY = '#A79E94';
  const PURPLE = '#7C6BD6';
  const INK = '#3A302A';
  const FONT = '-apple-system, "PingFang SC", "Noto Sans SC", sans-serif';
  const ROLE = { who: BLUE, verb: ORANGE, what: GREEN, extra: GREY, help: PURPLE };

  function el(tag, attrs, text) {
    const n = LK.svg(tag, attrs || {});
    if (text != null) n.textContent = text;
    return n;
  }
  function T(g, x, y, value, size, fill) {
    g.appendChild(el('text', {
      x: x, y: y, 'text-anchor': 'middle', 'font-size': size || 12,
      'font-weight': 650, fill: fill || INK, 'font-family': FONT
    }, value));
  }
  function clear(svg) { while (svg.firstChild) svg.removeChild(svg.firstChild); }
  function reg(type, box, draw) {
    LKStage.register(type, {
      viewBox: box,
      build: function () {},
      apply: function (svg, state) { clear(svg); draw(svg, state || {}); },
      anim: { snap: function (svg, t, state, api) { api.apply({ play: t }); }, main: function (svg, t, state, api) { api.apply({ play: t }); } }
    });
  }
  function roleColor(role) { return ROLE[role] || BLUE; }

  reg('sentence', '0 0 340 200', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 200, fill: '#E3EFFC' }));
    const rows = state.rows || [];
    const play = state.play == null ? 1 : state.play;
    let y = 28;
    rows.forEach(function (row, r) {
      if (play < 0.4 && r > 0) return;
      const bricks = row.bricks || row;
      let x = 16;
      const rowTop = y;
      bricks.forEach(function (b) {
        const text = b.text || b.t || '';
        const w = Math.max(36, Array.from(text).length * 9 + 16);
        if (x > 16 && x + w > 324) { y += 40; x = 16; }
        g.appendChild(el('rect', { x: x, y: y, width: w, height: 28, rx: 8, fill: roleColor(b.role) }));
        T(g, x + w / 2, y + 18, text, 12, '#fff');
        x += w + 6;
      });
      if (row.mark === 'missing') T(g, 310, rowTop + 18, '✗', 16, '#C04A3A');
      if (row.note) T(g, 170, y + 44, row.note, 11, '#6E655C');
      y += 52;
    });
  });

  reg('tense', '0 0 340 160', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 160, fill: '#E3EFFC' }));
    g.appendChild(el('line', { x1: 24, y1: 80, x2: 316, y2: 80, stroke: INK, 'stroke-width': 1.6 }));
    const marks = state.marks || [{ x: 0.3, label: 'past' }, { x: 0.7, label: 'now' }];
    marks.forEach(function (m) {
      const x = 30 + m.x * 280;
      g.appendChild(el('circle', { cx: x, cy: 80, r: 7, fill: BLUE }));
      T(g, x, 108, m.label, 12, INK);
    });
    if (state.caption) T(g, 170, 36, state.caption, 13, INK);
  });

  reg('link', '0 0 340 150', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 150, fill: '#E3EFFC' }));
    const words = state.words || ['A', 'and', 'B'];
    words.forEach(function (w, i) {
      const x = 40 + i * 90;
      g.appendChild(el('rect', { x: x, y: 50, width: 70, height: 32, rx: 8, fill: i % 2 ? ORANGE : BLUE }));
      T(g, x + 35, 70, w, 12, '#fff');
    });
  });

  reg('mouth', '0 0 340 180', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 180, fill: '#E3EFFC' }));
    const shapes = state.shapes || ['张开', '合上'];
    shapes.forEach(function (name, i) {
      const x = 80 + i * 140;
      g.appendChild(el('ellipse', { cx: x, cy: 70, rx: 28, ry: name.indexOf('合') >= 0 ? 8 : 18, fill: '#F6D7BF', stroke: INK, 'stroke-width': 1.4 }));
      T(g, x, 130, name, 13, INK);
    });
  });

  reg('tone', '0 0 340 160', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 160, fill: '#E3EFFC' }));
    const rows = state.rows || [{ text: 'Is that Mochi?', dir: 'up' }, { text: 'That is Mochi.', dir: 'down' }];
    rows.forEach(function (row, i) {
      const y = 40 + i * 56;
      T(g, 120, y, row.text, 14, INK);
      const up = row.dir !== 'down';
      g.appendChild(el('path', {
        d: up ? 'M240 ' + (y) + ' q20 -18 36 0' : 'M240 ' + (y - 16) + ' q20 18 36 0',
        fill: 'none', stroke: BLUE, 'stroke-width': 2.4
      }));
      T(g, 300, y, up ? '↗' : '↘', 16, BLUE);
    });
  });

  reg('spell', '0 0 340 150', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 150, fill: '#E3EFFC' }));
    const parts = state.parts || ['c', 'a', 't'];
    parts.forEach(function (p, i) {
      const x = 30 + i * 48;
      g.appendChild(el('rect', { x: x, y: 50, width: 40, height: 40, rx: 8, fill: '#fff', stroke: BLUE, 'stroke-width': 1.6 }));
      T(g, x + 20, 76, p, 18, BLUE);
    });
  });

  reg('twopics', '0 0 340 180', function (g, state) {
    g.appendChild(el('rect', { width: 170, height: 180, fill: '#E3EFFC' }));
    g.appendChild(el('rect', { x: 170, width: 170, height: 180, fill: '#F7F1E8' }));
    T(g, 85, 90, state.left || 'A', 16, BLUE);
    T(g, 255, 90, state.right || 'B', 16, INK);
  });

  reg('beats', '0 0 340 200', function (g, state) {
    g.appendChild(el('rect', { width: 340, height: 200, fill: '#FDF2F5' }));
    const rows = state.rows || [{ word: 'SINGer', stress: 0 }];
    rows.forEach(function (row, r) {
      const parts = row.parts || String(row.word || '').split('-');
      const y = 36 + r * 40;
      parts.forEach(function (p, i) {
        const x = 40 + i * 70;
        const big = i === (row.stress || 0);
        g.appendChild(el('circle', { cx: x, cy: y, r: big ? 10 : 6, fill: big ? '#C45C7A' : '#E7C9D2' }));
        T(g, x + 28, y + 4, p, big ? 14 : 12, INK);
      });
    });
  });
})(window);
