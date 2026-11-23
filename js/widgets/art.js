(function (global) {
  const INK = '#3A302A';
  const SKIN = '#F6D7BF';
  const HAIR = '#2F2622';
  const BLUSH = 'rgba(242,160,160,.55)';

  function S(tag, attrs, kids) {
    const n = LK.svg(tag, attrs);
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      if (typeof c === 'string' || typeof c === 'number') n.appendChild(document.createTextNode(String(c)));
      else n.appendChild(c);
    });
    return n;
  }
  function facePath(kind) {
    const eyes = {
      calm: 'M-7 -81 h2 M5 -81 h2',
      happy: 'M-8 -81 q2 2 4 0 M4 -81 q2 2 4 0',
      wow: '',
      worry: 'M-8 -84 l3 2 M8 -84 l-3 2 M-7 -80 h2 M5 -80 h2',
      sad: 'M-8 -84 l3 -1 M8 -84 l-3 -1 M-7 -79 h2 M5 -79 h2',
      angry: 'M-9 -85 l4 3 M9 -85 l-4 3 M-7 -79 h2 M5 -79 h2',
      fear: 'M-9 -86 l4 2 M9 -86 l-4 2',
      disgust: 'M-8 -82 h3 M6 -84 h2'
    };
    const mouth = {
      calm: 'M-3 -70 h6',
      happy: 'M-4 -70 q4 4 8 0',
      wow: 'M-2.2 -69 a2.2 2.6 0 1 0 4.4 0 a2.2 2.6 0 1 0 -4.4 0',
      worry: 'M-4 -69 q4 -3 8 0',
      sad: 'M-4 -68 q4 -3 8 0',
      angry: 'M-4 -68 h8',
      fear: 'M-2 -69 h4',
      disgust: 'M-3 -69 q3 2 5 -1'
    };
    return { eyes: eyes[kind] || eyes.calm, mouth: mouth[kind] || mouth.calm, kind: kind };
  }

  function addFace(g, kind) {
    const f = facePath(kind || 'calm');
    if (f.kind === 'wow' || f.kind === 'fear') {
      g.appendChild(S('circle', { cx: -6, cy: -80, r: f.kind === 'fear' ? 3.2 : 2.6, fill: '#fff', stroke: INK, 'stroke-width': 1.4 }));
      g.appendChild(S('circle', { cx: 6, cy: -80, r: f.kind === 'fear' ? 3.2 : 2.6, fill: '#fff', stroke: INK, 'stroke-width': 1.4 }));
      g.appendChild(S('circle', { cx: -5.4, cy: -79.4, r: 1.1, fill: INK }));
      g.appendChild(S('circle', { cx: 6.6, cy: -79.4, r: 1.1, fill: INK }));
    } else {
      g.appendChild(S('path', { d: f.eyes, fill: 'none', stroke: INK, 'stroke-width': 1.6, 'stroke-linecap': 'round' }));
    }
    g.appendChild(S('path', { d: f.mouth, fill: f.kind === 'wow' ? '#E07A6A' : 'none', stroke: INK, 'stroke-width': 1.5, 'stroke-linecap': 'round' }));
    g.appendChild(S('ellipse', { cx: -11, cy: -74, rx: 3.2, ry: 1.8, fill: BLUSH }));
    g.appendChild(S('ellipse', { cx: 11, cy: -74, rx: 3.2, ry: 1.8, fill: BLUSH }));
  }

  function hair(g, kind) {
    if (kind === 'bald') return;
    if (kind === 'bob') {
      g.appendChild(S('path', { d: 'M-16 -84 q0 -16 16 -16 q16 0 16 16 v8 q-2 10 -8 8 q-2 -8 -8 -6 q-6 -2 -8 6 q-6 2 -8 -8 z', fill: HAIR }));
    } else if (kind === 'short') {
      g.appendChild(S('path', { d: 'M-15 -82 q1 -18 15 -18 q14 0 15 18 q-4 4 -8 1 q-7 4 -14 0 q-4 3 -8 -1 z', fill: HAIR }));
    } else if (kind === 'bun') {
      g.appendChild(S('path', { d: 'M-14 -80 q0 -16 14 -16 q14 0 14 16 q-2 3 -6 1 q-8 3 -16 0 q-4 2 -6 -1 z', fill: HAIR }));
      g.appendChild(S('circle', { cx: 0, cy: -100, r: 6, fill: HAIR, stroke: INK, 'stroke-width': 1.4 }));
    } else if (kind === 'long') {
      g.appendChild(S('path', { d: 'M-16 -84 q0 -16 16 -16 q16 0 16 16 v28 q-6 4 -10 -2 v-16 h-12 v16 q-4 6 -10 2 z', fill: HAIR }));
    }
  }

  function hat(g, kind) {
    if (kind === 'mian') {
      g.appendChild(S('rect', { x: -16, y: -108, width: 32, height: 8, rx: 2, fill: '#2B2622' }));
      g.appendChild(S('path', { d: 'M-12 -100 v10 M-4 -100 v12 M4 -100 v12 M12 -100 v10', stroke: '#D9A441', 'stroke-width': 1.4 }));
    } else if (kind === 'crown') {
      g.appendChild(S('path', { d: 'M-14 -102 l4 8 h20 l4 -8 l-6 4 l-8 -8 l-8 8 z', fill: '#D9A441', stroke: INK, 'stroke-width': 1.4 }));
    } else if (kind === 'wusha') {
      g.appendChild(S('path', { d: 'M-22 -96 h44 l-8 6 h-28 z', fill: '#2B2622' }));
      g.appendChild(S('rect', { x: -8, y: -102, width: 16, height: 6, fill: '#2B2622' }));
    } else if (kind === 'douli') {
      g.appendChild(S('path', { d: 'M-20 -90 q20 -22 40 0 z', fill: '#E6D2A2', stroke: INK, 'stroke-width': 1.4 }));
    } else if (kind === 'helmet') {
      g.appendChild(S('path', { d: 'M-16 -84 q0 -22 16 -22 q16 0 16 22 v4 h-32 z', fill: '#8A8178', stroke: INK, 'stroke-width': 1.5 }));
    } else if (kind === 'fur') {
      g.appendChild(S('path', { d: 'M-16 -86 q0 -18 16 -20 q16 2 16 20 v6 h-32 z', fill: '#A6845A', stroke: INK, 'stroke-width': 1.5 }));
    } else if (kind === 'scholar') {
      g.appendChild(S('rect', { x: -14, y: -104, width: 28, height: 8, rx: 1, fill: '#2B2622' }));
    } else if (kind === 'rider') {
      g.appendChild(S('path', { d: 'M-14 -100 q14 -12 28 0 v8 h-28 z', fill: '#6E655C', stroke: INK, 'stroke-width': 1.4 }));
    } else if (kind === 'chef') {
      g.appendChild(S('path', { d: 'M-16 -96 h32 v8 h-32 z M-10 -96 q10 -16 20 0', fill: '#fff', stroke: INK, 'stroke-width': 1.4 }));
    } else if (kind === 'tophat') {
      g.appendChild(S('rect', { x: -10, y: -118, width: 20, height: 18, fill: '#C04A3A', stroke: INK, 'stroke-width': 1.3 }));
      g.appendChild(S('rect', { x: -16, y: -102, width: 32, height: 5, fill: '#C04A3A', stroke: INK, 'stroke-width': 1.2 }));
    }
  }

  function arms(g, pose) {
    const sw = { fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-linecap': 'round' };
    const map = {
      stand: 'M-12 -52 l-8 16 M12 -52 l8 16',
      point: 'M-12 -52 l-8 16 M10 -50 l22 -6',
      give: 'M-10 -50 l16 8 M10 -50 l-4 10',
      take: 'M-12 -50 q10 16 24 0',
      think: 'M-12 -52 l-6 16 M8 -50 l4 -16',
      head: 'M-12 -52 l-6 14 M6 -54 l2 -18',
      cheer: 'M-10 -54 l-10 -18 M10 -54 l10 -18',
      shrug: 'M-12 -52 l-12 -2 M12 -52 l12 -2',
      run: 'M-12 -52 l-10 10 M12 -50 l14 -8',
      sit: 'M-12 -40 l-8 8 M12 -40 l8 8',
      shake: 'M-12 -50 l-6 14 M12 -50 l6 14'
    };
    g.appendChild(S('path', Object.assign({ d: map[pose] || map.stand }, sw)));
    if (pose === 'point') g.appendChild(S('circle', { cx: 32, cy: -56, r: 2.2, fill: SKIN, stroke: INK, 'stroke-width': 1.2 }));
  }

  function legs(g, pose) {
    const sw = { fill: 'none', stroke: INK, 'stroke-width': 2, 'stroke-linecap': 'round' };
    if (pose === 'sit') g.appendChild(S('path', Object.assign({ d: 'M-8 -16 l-14 6 M8 -16 l14 6' }, sw)));
    else if (pose === 'run') g.appendChild(S('path', Object.assign({ d: 'M-6 -16 l-10 16 M6 -16 l12 10' }, sw)));
    else g.appendChild(S('path', Object.assign({ d: 'M-6 -16 l-2 16 M6 -16 l2 16' }, sw)));
  }

  function body(g, o) {
    const cloth = o.cloth || '#8FA7C9';
    const kind = o.body || 'modern';
    if (kind === 'robe') {
      g.appendChild(S('path', { d: 'M-16 -18 q-2 -36 4 -42 h24 q6 6 4 42 q-8 8 -16 6 q-8 2 -16 -6 z', fill: cloth, stroke: INK, 'stroke-width': 2 }));
      g.appendChild(S('path', { d: 'M-2 -58 l2 16 l2 -16', fill: 'none', stroke: INK, 'stroke-width': 1.4 }));
    } else if (kind === 'armor') {
      g.appendChild(S('path', { d: 'M-16 -16 q-2 -34 6 -42 h20 q8 8 6 42 q-8 6 -16 4 q-8 2 -16 -4 z', fill: cloth, stroke: INK, 'stroke-width': 2 }));
      g.appendChild(S('path', { d: 'M-10 -40 h20 M-8 -30 h16', stroke: '#D9A441', 'stroke-width': 1.5 }));
    } else if (kind === 'cat') {
      g.appendChild(S('ellipse', { cx: 0, cy: -28, rx: 22, ry: 16, fill: cloth || '#9A9A9A', stroke: INK, 'stroke-width': 2 }));
      g.appendChild(S('circle', { cx: 0, cy: -52, r: 14, fill: cloth || '#9A9A9A', stroke: INK, 'stroke-width': 2 }));
      g.appendChild(S('path', { d: 'M18 -24 q16 8 8 16', fill: 'none', stroke: '#fff', 'stroke-width': 3 }));
    } else if (kind === 'coat') {
      g.appendChild(S('path', { d: 'M-16 -14 q0 -40 6 -46 h20 q6 6 6 46 q-8 4 -16 2 q-8 2 -16 -2 z', fill: '#F7F4EF', stroke: INK, 'stroke-width': 2 }));
      g.appendChild(S('path', { d: 'M0 -58 v40', stroke: INK, 'stroke-width': 1.3 }));
      if (o.badge) {
        g.appendChild(S('rect', { x: 4, y: -50, width: 14, height: 10, rx: 2, fill: '#fff', stroke: INK, 'stroke-width': 1 }));
        g.appendChild(S('text', { x: 11, y: -42, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700, fill: INK }, [o.badge]));
      }
    } else {
      g.appendChild(S('path', { d: 'M-12 -20 q0 -32 4 -38 h16 q4 6 4 38 q-6 4 -12 2 q-6 2 -12 -2 z', fill: cloth, stroke: INK, 'stroke-width': 2 }));
      g.appendChild(S('path', { d: 'M-8 -16 h6 q2 16 -2 16 q-6 0 -4 -16 z M2 -16 h6 q2 16 -2 16 q-6 0 -4 -16 z', fill: o.bottom || '#3A302A', stroke: INK, 'stroke-width': 1.4 }));
    }
  }

  function person(parent, o) {
    const cast = (global.CAST && CAST[o.who]) || {};
    const spec = Object.assign({}, cast, o);
    if (spec.kind === 'mascot' || o.who === 'xiaoyin') return mascot(parent, o);
    const k = spec.k || 1;
    const flip = spec.flip ? -1 : 1;
    const px = spec.x <= 1 ? spec.x * (o.W || 340) : spec.x;
    const py = spec.y <= 1 ? spec.y * (o.H || 260) : spec.y;
    const root = S('g', { class: 'art-person', transform: 'translate(' + px + ' ' + py + ') scale(' + (flip * k) + ' ' + k + ')' });
    const bob = S('g', { class: spec.pose === 'shake' ? 'art-bob art-shake' : 'art-bob' });
    legs(bob, spec.pose || 'stand');
    body(bob, spec);
    arms(bob, spec.pose || 'stand');
    bob.appendChild(S('circle', { cx: 0, cy: -78, r: 18, fill: SKIN, stroke: INK, 'stroke-width': 2 }));
    addFace(bob, spec.face || 'calm');
    hair(bob, spec.hair || 'bob');
    if (spec.hat) hat(bob, spec.hat);
    if (spec.badge && spec.body !== 'coat') {
      bob.appendChild(S('rect', { x: -16, y: -118, width: 32, height: 12, rx: 3, fill: '#fff', stroke: INK, 'stroke-width': 1 }));
      bob.appendChild(S('text', { x: 0, y: -109, 'text-anchor': 'middle', 'font-size': 8, 'font-weight': 700, fill: INK }, [spec.badge]));
    }
    if (spec.glasses) {
      bob.appendChild(S('circle', { cx: -6, cy: -80, r: 4.2, fill: 'none', stroke: INK, 'stroke-width': 1.3 }));
      bob.appendChild(S('circle', { cx: 6, cy: -80, r: 4.2, fill: 'none', stroke: INK, 'stroke-width': 1.3 }));
      bob.appendChild(S('path', { d: 'M-2 -80 h4', stroke: INK, 'stroke-width': 1.2 }));
    }
    root.appendChild(bob);
    parent.appendChild(root);
    return root;
  }

  function mascot(parent, o) {
    const k = (o.k || 1) * 1.7;
    const px = o.x <= 1 ? o.x * (o.W || 340) : o.x;
    const py = o.y <= 1 ? o.y * (o.H || 260) : o.y;
    const id = 'yin' + Math.round(px) + '' + Math.round(py) + (o._n || 0);
    const root = S('g', { class: 'art-person art-yin', transform: 'translate(' + (px - 26 * k) + ' ' + (py - 62 * k) + ') scale(' + k + ')' });
    const defs = S('defs');
    const grad = S('linearGradient', { id: id, x1: '0', y1: '0', x2: '1', y2: '1' });
    grad.appendChild(S('stop', { offset: '0', 'stop-color': '#7C6BD6' }));
    grad.appendChild(S('stop', { offset: '1', 'stop-color': '#9B8CF0' }));
    defs.appendChild(grad);
    root.appendChild(defs);
    root.appendChild(S('circle', { cx: 26, cy: 42, r: 18, fill: 'url(#' + id + ')' }));
    root.appendChild(S('ellipse', { cx: 20, cy: 40, rx: 3.2, ry: 3.6, fill: '#fff' }));
    root.appendChild(S('ellipse', { cx: 31, cy: 38, rx: 3.2, ry: 3.6, fill: '#fff' }));
    root.appendChild(S('circle', { cx: 21, cy: 41, r: 1.4, fill: '#2B2622' }));
    root.appendChild(S('circle', { cx: 32, cy: 39, r: 1.4, fill: '#2B2622' }));
    root.appendChild(S('path', { d: 'M21 47 q5 3 9 0', fill: 'none', stroke: '#2B2622', 'stroke-width': 1.3, 'stroke-linecap': 'round' }));
    root.appendChild(S('path', { d: 'M42 16 v20', fill: 'none', stroke: '#7C6BD6', 'stroke-width': 3, 'stroke-linecap': 'round' }));
    root.appendChild(S('path', { d: 'M42 16 c7 1.5 14 7 12 14 c-1 4 -6 6 -12 3', fill: '#9B8CF0' }));
    parent.appendChild(root);
    return root;
  }

  function prop(parent, o) {
    const fn = props[o.what];
    if (!fn) return;
    const px = o.x <= 1 ? o.x * (o.W || 340) : o.x;
    const py = o.y <= 1 ? o.y * (o.H || 260) : o.y;
    const g = S('g', { transform: 'translate(' + px + ' ' + py + ') scale(' + (o.k || 1) + ')' });
    fn(g, o.state || {});
    parent.appendChild(g);
  }

  function stroke() { return { fill: 'none', stroke: INK, 'stroke-width': 1.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }; }

  const props = {
    mapScroll: function (g) {
      g.appendChild(S('rect', Object.assign({ x: -28, y: -18, width: 56, height: 36, rx: 4, fill: '#F3E6C8' }, stroke())));
      g.appendChild(S('path', Object.assign({ d: 'M-16 -6 q8 -8 16 0 q8 8 16 0' }, stroke())));
      g.appendChild(S('circle', { cx: 10, cy: 6, r: 3, fill: '#2F9E8F' }));
    },
    token: function (g) {
      g.appendChild(S('rect', { x: -10, y: -14, width: 20, height: 28, rx: 3, fill: '#F2D48A', stroke: INK, 'stroke-width': 1.5 }));
      g.appendChild(S('text', { x: 0, y: 4, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: INK }, ['封']));
    },
    castle: function (g, st) {
      g.appendChild(S('path', { d: 'M-16 10 v-16 h8 v-6 h8 v6 h8 v-6 h8 v6 h8 v16 z', fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.5 }));
      if (st.flag !== false) g.appendChild(S('path', { d: 'M8 -22 v-12 l10 4 l-10 3', fill: '#2F9E8F', stroke: INK, 'stroke-width': 1.2 }));
    },
    horse: function (g) {
      g.appendChild(S('path', { d: 'M-18 8 l4 -10 h16 l8 4 l6 -8 l4 2 l-4 8 h6 l-2 8 h-8 l-2 -6 h-10 l-2 6 h-8 z', fill: '#C9A27E', stroke: INK, 'stroke-width': 1.5 }));
    },
    boat: function (g) { g.appendChild(S('path', { d: 'M-24 4 q24 14 48 0 l-6 -6 h-36 z', fill: '#E7D7B8', stroke: INK, 'stroke-width': 1.5 })); },
    grainBoat: function (g) {
      props.boat(g);
      g.appendChild(S('rect', { x: -6, y: -10, width: 16, height: 10, fill: '#E6C36A', stroke: INK, 'stroke-width': 1.2 }));
    },
    grain: function (g) { g.appendChild(S('path', { d: 'M-12 8 q12 -22 24 0 z', fill: '#E6C36A', stroke: INK, 'stroke-width': 1.4 })); },
    coin: function (g) {
      g.appendChild(S('circle', { cx: 0, cy: 0, r: 10, fill: '#F2C14E', stroke: INK, 'stroke-width': 1.5 }));
      g.appendChild(S('rect', { x: -3, y: -3, width: 6, height: 6, fill: 'none', stroke: INK, 'stroke-width': 1.2 }));
    },
    purse: function (g) { g.appendChild(S('path', { d: 'M-12 10 q0 -16 12 -18 q12 2 12 18 z M-4 -8 h8', fill: '#C8664A', stroke: INK, 'stroke-width': 1.5 })); },
    jar: function (g, st) {
      g.appendChild(S('path', { d: 'M-12 -2 h24 l-2 16 h-20 z', fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.5 }));
      g.appendChild(S('rect', { x: -8, y: 2, width: 16, height: (st.level || 6), fill: '#7C6BD6', opacity: 0.8 }));
    },
    phone: function (g) { g.appendChild(S('rect', { x: -8, y: -14, width: 16, height: 28, rx: 3, fill: '#2B2622' })); g.appendChild(S('rect', { x: -6, y: -10, width: 12, height: 16, fill: '#D7E6F5' })); },
    card: function (g) { g.appendChild(S('rect', { x: -16, y: -10, width: 32, height: 20, rx: 3, fill: '#F2C14E', stroke: INK, 'stroke-width': 1.4 })); },
    bill: function (g) { g.appendChild(S('rect', { x: -14, y: -16, width: 28, height: 32, rx: 2, fill: '#fff', stroke: INK, 'stroke-width': 1.4 })); g.appendChild(S('path', { d: 'M-8 -6 h16 M-8 0 h16 M-8 6 h10', stroke: INK, 'stroke-width': 1.2 })); },
    key: function (g) { g.appendChild(S('circle', { cx: -6, cy: 0, r: 6, fill: 'none', stroke: '#D9A441', 'stroke-width': 2 })); g.appendChild(S('path', { d: 'M0 0 h16 v4 h-4 v3 h-3 v-3', fill: 'none', stroke: '#D9A441', 'stroke-width': 2 })); },
    top: function (g) { g.appendChild(S('path', { d: 'M-14 10 l4 -18 h20 l4 18 z', fill: '#E46A9C', stroke: INK, 'stroke-width': 1.4 })); },
    skirt: function (g) { g.appendChild(S('path', { d: 'M-16 12 l6 -16 h20 l6 16 z', fill: '#C8664A', stroke: INK, 'stroke-width': 1.4 })); },
    bag: function (g) { g.appendChild(S('rect', { x: -10, y: -6, width: 20, height: 16, rx: 3, fill: '#2F9E8F', stroke: INK, 'stroke-width': 1.4 })); },
    train: function (g) {
      g.appendChild(S('rect', { x: -28, y: -10, width: 18, height: 12, rx: 2, fill: '#2F9E8F', stroke: INK, 'stroke-width': 1.3 }));
      g.appendChild(S('rect', { x: -8, y: -10, width: 16, height: 12, rx: 2, fill: '#F4F7F6', stroke: INK, 'stroke-width': 1.3 }));
      g.appendChild(S('rect', { x: 10, y: -10, width: 16, height: 12, rx: 2, fill: '#F4F7F6', stroke: INK, 'stroke-width': 1.3 }));
      g.appendChild(S('circle', { cx: -22, cy: 4, r: 2, fill: INK }));
      g.appendChild(S('circle', { cx: 4, cy: 4, r: 2, fill: INK }));
      g.appendChild(S('circle', { cx: 20, cy: 4, r: 2, fill: INK }));
    },
    thermo: function (g) {
      g.appendChild(S('rect', { x: -4, y: -16, width: 8, height: 24, rx: 4, fill: '#fff', stroke: INK, 'stroke-width': 1.3 }));
      g.appendChild(S('rect', { x: -2, y: -2, width: 4, height: 8, fill: '#E0795B' }));
    },
    sun: function (g) { g.appendChild(S('circle', { cx: 0, cy: 0, r: 8, fill: '#FFD66B', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('path', { d: 'M0 -14 v4 M0 10 v4 M-14 0 h4 M10 0 h4', stroke: '#FFD66B', 'stroke-width': 1.5 })); },
    cloud: function (g) { g.appendChild(S('path', { d: 'M-16 4 a8 8 0 0 1 8 -10 a10 10 0 0 1 18 4 a7 7 0 0 1 2 6 z', fill: '#fff', stroke: INK, 'stroke-width': 1.4 })); },
    bridge: function (g) {
      g.appendChild(S('path', { d: 'M-30 8 l20 -16 h20 l20 16', fill: 'none', stroke: '#8A8178', 'stroke-width': 3 }));
      g.appendChild(S('path', { d: 'M-24 8 v10 M24 8 v10', stroke: '#8A8178', 'stroke-width': 1.4 }));
    },
    mouse: function (g) { g.appendChild(S('ellipse', { cx: 0, cy: 2, rx: 10, ry: 6, fill: '#E7D7C4', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('circle', { cx: 8, cy: 0, r: 1, fill: INK })); },
    heart: function (g) { g.appendChild(S('path', { d: 'M0 8 q-10 -8 -6 -14 q4 -4 6 0 q2 -4 6 0 q4 6 -6 14 z', fill: '#E0795B', stroke: INK, 'stroke-width': 1.2 })); },
    scroll: function (g) { g.appendChild(S('rect', { x: -16, y: -18, width: 32, height: 36, rx: 2, fill: '#F7F1E4', stroke: INK, 'stroke-width': 1.4 })); g.appendChild(S('path', { d: 'M-10 -8 h20 M-10 -2 h20 M-10 4 h14', stroke: '#A79E94', 'stroke-width': 1.2 })); },
    mic: function (g) { g.appendChild(S('rect', { x: -5, y: -16, width: 10, height: 16, rx: 5, fill: '#7C6BD6', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('path', { d: 'M-8 0 q8 10 16 0 M0 6 v8', fill: 'none', stroke: INK, 'stroke-width': 1.4 })); },
    cup: function (g) { g.appendChild(S('path', { d: 'M-8 -6 h14 l-2 14 h-10 z M6 -4 h4 q4 4 0 8 h-4', fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.4 })); },
    paper: function (g) { g.appendChild(S('rect', { x: -18, y: -22, width: 36, height: 44, rx: 2, fill: '#fff', stroke: INK, 'stroke-width': 1.5 })); g.appendChild(S('circle', { cx: 4, cy: 4, r: 3, fill: '#2F9E8F' })); },
    ball: function (g) { g.appendChild(S('circle', { cx: 0, cy: 0, r: 16, fill: '#1F6E84', stroke: INK, 'stroke-width': 1.5 })); g.appendChild(S('path', { d: 'M-16 0 h32 M0 -16 v32', stroke: '#FFD66B', 'stroke-width': 1.2 })); },
    steps: function (g) {
      g.appendChild(S('path', { d: 'M-28 16 h18 v-10 h16 v-10 h18 v-8 h10', fill: 'none', stroke: '#7A4E2D', 'stroke-width': 3, 'stroke-linejoin': 'round' }));
    },
    sign: function (g, st) {
      g.appendChild(S('rect', { x: -2, y: -6, width: 4, height: 22, fill: '#8A8178' }));
      g.appendChild(S('rect', { x: -26, y: -28, width: 52, height: 22, rx: 4, fill: '#fff', stroke: INK, 'stroke-width': 1.4 }));
      g.appendChild(S('text', { x: 0, y: -13, 'text-anchor': 'middle', 'font-size': 10, 'font-weight': 700, fill: INK }, [st.text || '']));
    },
    windows: function (g) {
      [[-46, '#EAF4F6', '山'], [0, '#F1D9A8', '坡'], [46, '#DCEBC8', '原']].forEach(function (w) {
        g.appendChild(S('rect', { x: w[0] - 18, y: -16, width: 36, height: 28, rx: 3, fill: w[1], stroke: INK, 'stroke-width': 1.3 }));
        g.appendChild(S('text', { x: w[0], y: 2, 'text-anchor': 'middle', 'font-size': 10, fill: INK }, [w[2]]));
      });
    },
    car: function (g) { g.appendChild(S('path', { d: 'M-22 4 h8 l6 -10 h16 l6 10 h8 v8 h-44 z', fill: '#8FA7C9', stroke: INK, 'stroke-width': 1.3 })); },
    house: function (g) { g.appendChild(S('path', { d: 'M-16 10 v-12 l16 -12 l16 12 v12 z', fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.3 })); },
    envelope: function (g) { g.appendChild(S('rect', { x: -18, y: -12, width: 36, height: 24, fill: '#fff', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('path', { d: 'M-18 -12 l18 12 l18 -12', fill: 'none', stroke: INK, 'stroke-width': 1.2 })); },
    snowball: function (g) { g.appendChild(S('circle', { cx: 0, cy: 4, r: 14, fill: '#fff', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('circle', { cx: 0, cy: -12, r: 8, fill: '#fff', stroke: INK, 'stroke-width': 1.3 })); },
    bowl: function (g) { g.appendChild(S('path', { d: 'M-16 -4 q16 16 32 0', fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.3 })); },
    apple: function (g) { g.appendChild(S('circle', { r: 12, fill: '#C8664A', stroke: INK, 'stroke-width': 1.2 })); },
    pool: function (g) { g.appendChild(S('rect', { x: -24, y: -8, width: 48, height: 20, rx: 6, fill: '#9FD0D8', stroke: INK, 'stroke-width': 1.3 })); },
    payslip: function (g) { g.appendChild(S('rect', { x: -16, y: -20, width: 32, height: 40, fill: '#fff', stroke: INK, 'stroke-width': 1.3 })); },
    priceTag: function (g) { g.appendChild(S('rect', { x: -16, y: -10, width: 32, height: 20, rx: 3, fill: '#F0C36B', stroke: INK, 'stroke-width': 1.2 })); },
    polaroid: function (g) { g.appendChild(S('rect', { x: -16, y: -20, width: 32, height: 40, fill: '#fff', stroke: INK, 'stroke-width': 1.2 })); g.appendChild(S('rect', { x: -12, y: -16, width: 24, height: 20, fill: '#E7D3B4' })); },
    filmStrip: function (g) { g.appendChild(S('rect', { x: -22, y: -10, width: 44, height: 20, fill: '#3A302A' })); },
    fish: function (g) { g.appendChild(S('ellipse', { cx: 0, cy: 0, rx: 16, ry: 8, fill: '#8FA7C9', stroke: INK, 'stroke-width': 1.2 })); },
    cake: function (g) { g.appendChild(S('rect', { x: -14, y: -6, width: 28, height: 16, fill: '#F3C1C9', stroke: INK, 'stroke-width': 1.2 })); },
    bus: function (g) { g.appendChild(S('rect', { x: -22, y: -10, width: 44, height: 22, rx: 4, fill: '#D9A441', stroke: INK, 'stroke-width': 1.2 })); },
    tub: function (g) { g.appendChild(S('path', { d: 'M-20 0 h40 v8 q0 8 -20 8 q-20 0 -20 -8 z', fill: '#EAF4F6', stroke: INK, 'stroke-width': 1.2 })); },
    bed: function (g) { g.appendChild(S('rect', { x: -22, y: -4, width: 44, height: 14, fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.2 })); },
    fridge: function (g) { g.appendChild(S('rect', { x: -12, y: -20, width: 24, height: 40, fill: '#EEF3F4', stroke: INK, 'stroke-width': 1.2 })); },
    piano: function (g) { g.appendChild(S('path', { d: 'M-20 8 h40 v-10 h-16 v-12 h-24 z', fill: '#3A302A' })); },
    poster: function (g) { g.appendChild(S('rect', { x: -12, y: -16, width: 24, height: 32, fill: '#F8EBDD', stroke: INK, 'stroke-width': 1.2 })); },
    chair: function (g) { g.appendChild(S('path', { d: 'M-12 10 v-16 h24 v16 M-8 10 v8 M8 10 v8', fill: 'none', stroke: INK, 'stroke-width': 1.4 })); },
    glasses: function (g) { g.appendChild(S('circle', { cx: -8, cy: 0, r: 6, fill: 'none', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('circle', { cx: 8, cy: 0, r: 6, fill: 'none', stroke: INK, 'stroke-width': 1.3 })); },
    pan: function (g) { g.appendChild(S('ellipse', { cx: -4, cy: 0, rx: 14, ry: 6, fill: '#8A8178', stroke: INK, 'stroke-width': 1.2 })); g.appendChild(S('line', { x1: 10, y1: 0, x2: 22, y2: 0, stroke: INK, 'stroke-width': 2 })); },
    fridgeMap: function (g) { g.appendChild(S('rect', { x: -10, y: -12, width: 20, height: 24, fill: '#E7F0F2', stroke: INK, 'stroke-width': 1.1 })); },
    mic: function (g) { g.appendChild(S('rect', { x: -6, y: -16, width: 12, height: 18, rx: 6, fill: '#3A302A' })); },
    phone: function (g) { g.appendChild(S('rect', { x: -7, y: -14, width: 14, height: 24, rx: 3, fill: '#3A302A' })); },
    cup: function (g) { g.appendChild(S('path', { d: 'M-8 -8 h16 l-2 16 h-12 z', fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.2 })); },
    top: function (g) { g.appendChild(S('path', { d: 'M-12 8 l4 -16 h16 l4 16 z', fill: '#C45C7A' })); },
    skirt: function (g) { g.appendChild(S('path', { d: 'M-8 -8 h16 l6 16 h-28 z', fill: '#3A302A' })); },
    bag: function (g) { g.appendChild(S('rect', { x: -12, y: -8, width: 24, height: 18, rx: 3, fill: '#C8664A', stroke: INK, 'stroke-width': 1.2 })); },
    heart: function (g) { g.appendChild(S('path', { d: 'M0 8 C-12 -4 -6 -12 0 -6 C6 -12 12 -4 0 8', fill: '#C45C7A' })); },
    cat: function (g) { g.appendChild(S('ellipse', { cx: 0, cy: 4, rx: 16, ry: 12, fill: '#9A9A9A', stroke: INK, 'stroke-width': 1.3 })); g.appendChild(S('circle', { cx: 0, cy: -8, r: 8, fill: '#9A9A9A', stroke: INK, 'stroke-width': 1.3 })); }
  };

  function bg(g, name, w, h) {
    const ink = { fill: 'none', stroke: INK, 'stroke-width': 1.2, 'stroke-linejoin': 'round' };
    if (name === 'palace') {
      g.appendChild(S('path', Object.assign({ d: 'M20 ' + (h - 40) + ' h' + (w - 40) + ' v-30 h-20 v-20 h-' + (w - 80) + ' v20 h-20 z' }, ink, { fill: '#F8EBDD' })));
    } else if (name === 'room') {
      g.appendChild(S('rect', { x: 16, y: 36, width: w - 32, height: h - 70, fill: '#F7F1E8', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'trainCar') {
      g.appendChild(S('rect', { x: 12, y: 28, width: w - 24, height: h - 48, rx: 8, fill: '#EEF3F4', stroke: INK, 'stroke-width': 1.2 }));
      g.appendChild(S('rect', { x: 28, y: 40, width: 50, height: 28, fill: '#D5E8EA', stroke: INK, 'stroke-width': 1 }));
    } else if (name === 'mountain') {
      g.appendChild(S('path', { d: 'M0 ' + (h - 30) + ' l' + (w * 0.4) + ' -80 l' + (w * 0.25) + ' 40 l' + (w * 0.35) + ' -30 v70 z', fill: '#E7D3B4', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'street') {
      g.appendChild(S('rect', { x: 0, y: h - 46, width: w, height: 46, fill: '#E7E2DA' }));
    } else if (name === 'lab' || name === 'office') {
      g.appendChild(S('rect', { x: 20, y: 40, width: w - 40, height: 14, fill: '#E7EEF2', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'sea') {
      g.appendChild(S('path', { d: 'M0 ' + (h - 50) + ' q40 -10 80 0 t80 0 t80 0 t80 0 v50 h-' + w + ' z', fill: '#D5E8EA' }));
    } else if (name === 'plain') {
      g.appendChild(S('path', { d: 'M0 ' + (h - 36) + ' h' + w + ' v36 h-' + w + ' z', fill: '#E7F0D8' }));
    } else if (name === 'road') {
      g.appendChild(S('path', { d: 'M0 ' + (h - 20) + ' q' + (w / 2) + ' -30 ' + w + ' 0 v20 h-' + w + ' z', fill: '#E6D7B8' }));
    } else if (name === 'wall') {
      g.appendChild(S('rect', { x: 10, y: 50, width: w - 20, height: 36, fill: '#E7D3B4', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'river') {
      g.appendChild(S('path', { d: 'M0 ' + (h - 40) + ' q60 -16 120 0 t120 0 t120 0 v40 h-' + w + ' z', fill: '#D5E8EA' }));
    } else if (name === 'exam') {
      g.appendChild(S('rect', { x: 30, y: h - 70, width: 70, height: 28, fill: '#F4E7D4', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'shop' || name === 'stage') {
      g.appendChild(S('rect', { x: 16, y: 24, width: w - 32, height: h - 40, rx: 8, fill: '#F8EBDD', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'desert') {
      g.appendChild(S('path', { d: 'M0 ' + (h - 30) + ' q40 -20 80 0 t80 0 t80 0 v30 h-' + w + ' z', fill: '#F3E0B5' }));
    } else if (name === 'forest') {
      g.appendChild(S('path', { d: 'M30 ' + (h - 20) + ' l20 -40 l20 40 z M70 ' + (h - 20) + ' l24 -50 l24 50 z', fill: '#6F9C86', stroke: INK, 'stroke-width': 1.2 }));
    } else if (name === 'kitchen' || name === 'bank' || name === 'bath') {
      g.appendChild(S('rect', { x: 16, y: 40, width: w - 32, height: 16, fill: name === 'bank' ? '#E7D3B4' : '#F4E7D4', stroke: INK, 'stroke-width': 1.2 }));
    }
  }

  function textEl(attrs, text) {
    return S('text', attrs, [text]);
  }

  function bubble(g, b, anchor) {
    const lines = String(b.text || '').split('|').slice(0, 2);
    const wide = Math.max.apply(null, lines.map(function (t) { return Math.min(9, Array.from(t).length); })) * 11 + 16;
    const h = lines.length * 14 + 10;
    const x = anchor.x - wide / 2;
    const y = anchor.y - h - 28;
    const node = S('g', { class: 'comic-bubble' });
    node.appendChild(S('rect', { x: x, y: y, width: wide, height: h, rx: 10, fill: '#fff', stroke: INK, 'stroke-width': 1.6 }));
    node.appendChild(S('path', { d: 'M' + (anchor.x - 4) + ' ' + (y + h) + ' l6 8 l8 -8 z', fill: '#fff', stroke: INK, 'stroke-width': 1.6 }));
    lines.forEach(function (line, i) {
      node.appendChild(textEl({ x: x + wide / 2, y: y + 16 + i * 14, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 650, fill: INK }, line));
    });
    g.appendChild(node);
  }

  function drawPanel(parent, panel, box, opts) {
    opts = opts || {};
    const x = box.x || 0;
    const y = box.y || 0;
    const w = box.w || 340;
    const h = box.h || 260;
    const g = S('g', { transform: 'translate(' + x + ' ' + y + ')' });
    g.appendChild(S('rect', { x: 0, y: 0, width: w, height: h, rx: 12, fill: panel.tint || '#FBF7F1' }));
    const scene = S('g');
    bg(scene, panel.bg || 'plain', w, h);
    g.appendChild(scene);
    (panel.props || []).forEach(function (p) {
      prop(g, Object.assign({ W: w, H: h }, p));
    });
    (panel.cast || []).forEach(function (c) {
      person(g, Object.assign({ W: w, H: h }, c));
    });
    if (!opts.nocaption && panel.caption) {
      const cap = S('g', { class: 'comic-caption' });
      const tw = Array.from(panel.caption).length * 11 + 14;
      cap.appendChild(S('rect', { x: 8, y: 8, width: tw, height: 20, fill: '#FFF0B8', stroke: INK, 'stroke-width': 1.5 }));
      cap.appendChild(textEl({ x: 15, y: 22, 'font-size': 11, 'font-weight': 650, fill: INK }, panel.caption));
      g.appendChild(cap);
    }
    if (!opts.nocaption && panel.sfx) {
      g.appendChild(textEl({ class: 'comic-sfx', x: w - 36, y: 36, 'font-size': 16, 'font-weight': 800, fill: '#C8664A', transform: 'rotate(-8 ' + (w - 36) + ' 36)' }, panel.sfx));
    }
    if (!opts.nocaption) {
      (panel.bubbles || []).forEach(function (b) {
        const who = (panel.cast || []).filter(function (c) { return c.who === b.who; })[0] || (panel.cast || [])[0];
        const ax = who ? (who.x <= 1 ? who.x * w : who.x) : w * 0.5;
        const ay = who ? (who.y <= 1 ? who.y * h : who.y) - 70 : 80;
        bubble(g, b, { x: ax, y: ay });
      });
    }
    const strokeW = opts.gold ? 3 : 2.5;
    const strokeC = opts.gold ? '#E2B43A' : INK;
    g.appendChild(S('rect', { x: 1.5, y: 1.5, width: w - 3, height: h - 3, rx: 12, fill: 'none', stroke: strokeC, 'stroke-width': strokeW }));
    parent.appendChild(g);
    return g;
  }

  const faces = ['calm', 'happy', 'wow', 'worry', 'sad', 'angry', 'fear', 'disgust'];
  const poses = ['stand', 'point', 'give', 'take', 'think', 'head', 'cheer', 'shrug', 'run', 'sit', 'shake'];
  const hats = ['mian', 'crown', 'wusha', 'douli', 'helmet', 'fur', 'scholar', 'rider', 'chef', 'tophat'];
  const bodies = ['robe', 'modern', 'coat', 'armor', 'cat'];
  const hairs = ['bob', 'short', 'bun', 'long', 'bald'];
  const bgs = ['palace', 'road', 'wall', 'river', 'mountain', 'sea', 'exam', 'room', 'street', 'lab', 'office', 'shop', 'trainCar', 'stage', 'plain', 'desert', 'forest', 'kitchen', 'bank', 'bath'];

  global.LKArt = {
    person: person,
    prop: prop,
    bg: bg,
    drawPanel: drawPanel,
    faces: faces,
    poses: poses,
    hats: hats,
    bodies: bodies,
    hairs: hairs,
    props: Object.keys(props),
    bgs: bgs
  };
})(window);
