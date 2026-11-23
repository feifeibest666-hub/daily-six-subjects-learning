(function (global) {
  const S = global.LKScene;
  const K = S.K, f = S.f, callout = S.callout;
  const mountain = S.mountain, tree = S.tree, house = S.house;
  const CN = S.CN, proj = S.proj, pathOf = S.pathOf, smooth = S.smooth;
  const board = S.board, books = S.books, riverRibbon = S.riverRibbon, trainWindow = S.trainWindow;
  const cliff = S.cliff, kettle = S.kettle, pinwheel = S.pinwheel, meter = S.meter, dam = S.dam;

  function paper(c) { return `<rect width="344" height="236" fill="${c || K.paper}"/>`; }
  function glow(inner) { return `<g filter="url(#glow)">${inner}</g>`; }
  function arrow(x1, y1, x2, y2, c) {
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const px = -uy, py = ux;
    return `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" fill="none" stroke="${c || K.ink}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M${f(x2)} ${f(y2)} L${f(x2 - ux * 8 + px * 4)} ${f(y2 - uy * 8 + py * 4)} L${f(x2 - ux * 8 - px * 4)} ${f(y2 - uy * 8 - py * 4)} Z" fill="${c || K.ink}"/>`;
  }
  function waves(x, y, n) {
    let s = '';
    for (let i = 0; i < (n || 3); i++) s += `<path d="M${f(x)} ${f(y + i * 6)} q7 -3 14 0 t14 0" fill="none" stroke="#fff" stroke-width="1.3"/>`;
    return s;
  }

  function counter() {
    return `<rect y="188" width="344" height="48" fill="#E4CFAE"/>
      <rect y="188" width="344" height="6" fill="#C9A87A"/>
      <path d="M0 214 H344" stroke="#C4A574" stroke-width="1"/>`;
  }
  function cupTilt(x, y, deg) {
    return `<g transform="translate(${f(x)} ${f(y)}) rotate(${deg})">
      <rect x="-13" y="-16" width="26" height="30" rx="3" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.2"/>
      <path d="M-9 -6 L9 -6 L7 12 L-7 12 Z" fill="#7FB6CF"/>
      <path d="M13 -8 Q20 -4 18 6" fill="none" stroke="${K.ink}" stroke-width="1.6"/>
    </g>`;
  }
  function dish(x, y) {
    return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="20" ry="5" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.1"/>
      <ellipse cx="${f(x)}" cy="${f(y + 1)}" rx="12" ry="2.4" fill="#D5E8F0"/>`;
  }
  function cuttingBoard(lowOnRight) {
    const left = lowOnRight ? [70, 170] : [70, 120];
    const right = lowOnRight ? [290, 120] : [290, 170];
    const bookX = lowOnRight ? 250 : 54;
    const bookY = 138;
    const pour = lowOnRight ? [268, 86, 28] : [86, 86, -36];
    const stream = lowOnRight
      ? [[262, 112], [214, 128], [150, 146], [96, 162], [72, 172]]
      : [[96, 112], [150, 128], [214, 146], [268, 162], [292, 174]];
    const drop = lowOnRight ? [64, 176] : [304, 180];
    let s = paper('#F6EFE4') + `<rect width="344" height="188" fill="#F3E6D4"/>` + counter();
    s += books(bookX, bookY, 3);
    s += board(left[0], left[1], right[0], right[1]);
    s += cupTilt(pour[0], pour[1], pour[2]);
    s += glow(riverRibbon(stream, 5));
    s += `<circle cx="${f(drop[0])}" cy="${f(drop[1])}" r="2.4" fill="#7FB6CF" stroke="${K.ink}" stroke-width=".6"/>`;
    s += dish(lowOnRight ? 60 : 300, lowOnRight ? 176 : 186);
    s += callout(left[0] + 8, left[1] - 6, lowOnRight ? 86 : 78, lowOnRight ? 196 : 78, lowOnRight ? '低' : '高', { anchor: 'middle', fs: 13 });
    s += callout(right[0] - 6, right[1] - 6, lowOnRight ? 300 : 292, lowOnRight ? 78 : 196, lowOnRight ? '高' : '低', { anchor: 'middle', fs: 13 });
    if (!lowOnRight) {
      s += arrow(118, 154, 108, 168, K.waterD);
      s += callout(108, 170, 132, 206, '重力', { anchor: 'start', fs: 12, c: K.waterD });
    } else {
      s += callout(268, 128, 250, 46, '这头垫高了', { anchor: 'end', fs: 12 });
    }
    return s;
  }

  function stairsRiver() {
    let s = `<rect width="344" height="236" fill="url(#sky)"/>` + S.stairs();
    const pts = [[102, 46], [112, 84], [168, 116], [214, 148], [270, 172], [322, 196]];
    s += glow(riverRibbon(pts, 6));
    s += mountain(96, 52, 36, 28, { snow: true, c: '#B49A7C', cd: '#977D63' });
    s += `<path d="M318 214 Q332 202 344 216 L344 236 L312 236 Z" fill="#A9D0DC"/>` + waves(322, 220, 2);
    s += callout(330, 216, 328, 46, '海', { anchor: 'end', fs: 13, c: K.waterD });
    return s;
  }

  function glass(x, y) {
    return `<g><path d="M${f(x - 11)} ${f(y - 26)} L${f(x - 7)} ${f(y)} L${f(x + 7)} ${f(y)} L${f(x + 11)} ${f(y - 26)} Z" fill="rgba(255,255,255,.45)" stroke="${K.ink}" stroke-width="1.2"/>
      <path d="M${f(x - 8)} ${f(y - 8)} L${f(x + 8)} ${f(y - 8)} L${f(x + 7)} ${f(y)} L${f(x - 7)} ${f(y)}" fill="#7FB6CF" opacity=".9"/></g>`;
  }
  function trainPour() {
    let s = paper('#E7D3B0');
    s += `<rect y="168" width="344" height="68" fill="#CDB892"/>`;
    s += trainWindow(110, 22, 200, 96);
    s += `<rect x="126" y="158" width="168" height="8" rx="2" fill="#A8845A" stroke="${K.ink}" stroke-width="1"/>`;
    s += glass(210, 198);
    s += `<g><rect x="196" y="128" width="16" height="22" rx="3" fill="#7FB6CF" stroke="${K.ink}" stroke-width="1.1"/>
      <path d="M212 136 Q224 132 226 144 Q218 148 212 142" fill="#F4D3B5" stroke="${K.ink}" stroke-width="1"/></g>`;
    s += glow(`<path d="M204 146 L216 146 L213 182 L207 182 Z" fill="#7FB6CF" stroke="#3E6F86" stroke-width="1"/>`);
    s += `<path d="M208 152 L210 174" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".85"/>`;
    s += arrow(292, 58, 328, 58, K.ink);
    s += callout(300, 52, 286, 22, '车往前开 →', { anchor: 'end', fs: 11 });
    s += callout(210, 164, 118, 228, '水还是竖直落下', { anchor: 'middle', fs: 12 });
    return s;
  }

  function through(pts, P) {
    const q = pts.map(P).map(function (a) { return a.map(Number); });
    let d = 'M' + q[0][0].toFixed(1) + ' ' + q[0][1].toFixed(1);
    for (let i = 0; i < q.length - 1; i++) {
      const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6, c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6, c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += 'C' + c1x.toFixed(1) + ' ' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ' ' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function chinaFlow() {
    const P = proj({ s: 4.95, dx: 16, dy: 6 });
    let s = `<rect width="344" height="236" fill="#EAF3F5"/>`;
    s += `<clipPath id="cna"><path d="${pathOf(CN.outline, P, true)}"/></clipPath>`;
    s += `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8"/>`;
    s += `<g clip-path="url(#cna)">`;
    s += `<path d="${pathOf(CN.line2.concat([[100, 20], [60, 20], [60, 56], [122.4, 56]]), P, true)}" fill="#E3C9A0"/>`;
    s += `<path d="${pathOf(CN.line1.concat([[98, 20], [60, 20], [60, 36.6]]), P, true)}" fill="#C9A27E"/>`;
    s += `</g>`;
    s += `<path d="${pathOf(CN.outline, P, true)}" fill="none" stroke="#8C7B6B" stroke-width="1.25" stroke-linejoin="round" stroke-linecap="round"/>`;
    const ty = P([121, 23.7]).map(Number), hn = P([109.6, 19.2]).map(Number);
    s += `<ellipse cx="${ty[0]}" cy="${ty[1]}" rx="2.4" ry="6.2" fill="#EEE3C8" stroke="#8C7B6B" stroke-width=".8"/>`;
    s += `<ellipse cx="${hn[0]}" cy="${hn[1]}" rx="5" ry="3.2" fill="#EEE3C8" stroke="#8C7B6B" stroke-width=".8"/>`;
    s += `<path d="${pathOf(CN.line1, P)}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round"/>`;
    s += `<path d="${pathOf(CN.line2, P)}" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 3" stroke-linecap="round"/>`;
    s += `<path d="${through(CN.yangtze, P)}" fill="none" stroke="${K.waterD}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>`;
    s += `<path d="${through(CN.yellow, P)}" fill="none" stroke="#C9A64A" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    const at = function (pt) { return P(pt).map(Number); };
    const yz = at(CN.yangtze[CN.yangtze.length - 1]);
    const yl = at(CN.yellow[CN.yellow.length - 1]);
    s += glow(arrow(yz[0] - 14, yz[1] + 1, yz[0] + 8, yz[1] - 1, K.gold) + arrow(yl[0] - 12, yl[1], yl[0] + 10, yl[1] - 2, K.gold));
    const midY = at(CN.yangtze[8]);
    const bend = at(CN.yellow[7]);
    s += callout(midY[0], midY[1], midY[0] + 4, midY[1] + 26, '长江', { anchor: 'middle', fs: 12, c: K.waterD });
    s += callout(bend[0], bend[1], bend[0] + 8, bend[1] - 22, '黄河', { anchor: 'start', fs: 12, c: '#8A6A28' });
    s += callout((yz[0] + yl[0]) / 2, (yz[1] + yl[1]) / 2, 312, 168, '入海', { anchor: 'end', fs: 12, c: K.waterD });
    const west = at([86, 33]);
    const east = at([118, 32]);
    s += `<text x="${f(west[0])}" y="${f(west[1])}" font-size="13" font-weight="800" fill="${K.ink}" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">西高</text>`;
    s += `<text x="${f(east[0] + 28)}" y="${f(east[1] + 28)}" font-size="13" font-weight="800" fill="${K.ink}" paint-order="stroke" stroke="#fff" stroke-width="3">东低</text>`;
    return s;
  }

  function falls(extra) {
    let s = paper('#F4EFE6');
    s += `<rect y="214" width="344" height="22" fill="#E7D7C0"/>`;
    s += cliff(80, 48, 120, 162);
    s += tree(118, 56, 1.7) + tree(148, 50, 1.5);
    const fall = [[200, 60], [204, 110], [214, 168], [236, 208]];
    s += riverRibbon(fall, 14);
    s += [194, 202, 210].map((x, i) => `<path d="M${x} 72 L${x + 18 + i} 206" stroke="#fff" stroke-width="1.5" opacity=".75" stroke-linecap="round"/>`).join('');
    s += `<ellipse cx="250" cy="206" rx="60" ry="9" fill="#7FB6CF" stroke="${K.waterD}" stroke-width="1.2"/>`;
    s += waves(214, 204, 2);
    return s + (extra || '');
  }
  function splashes() {
    const bits = [[228, 196], [242, 192], [258, 194], [270, 198], [236, 188], [264, 188]];
    return bits.map(([x, y]) => `<path d="M${x} ${y} q4 -6 8 0" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>`).join('');
  }
  function waterfall(step) {
    let s = falls();
    if (step === 0) {
      s += glow(splashes());
      s += `<rect x="62" y="58" width="6" height="140" rx="2" fill="#F3E7D3" stroke="${K.ink}" stroke-width=".8"/>`;
      for (let i = 0; i < 8; i++) s += `<path d="M62 ${f(64 + i * 16)} h6" stroke="${K.ink}" stroke-width=".7"/>`;
      s += callout(66, 120, 78, 64, '落差', { anchor: 'start', fs: 12 });
      s += callout(250, 198, 300, 168, '水潭', { anchor: 'end', fs: 12, c: K.waterD });
      return s;
    }
    const drops = [[214, 64, 8, '慢'], [220, 124, 18, '更快'], [236, 186, 30, '最快']];
    s += glow(drops.map(([x, y, len]) => arrow(x + 16, y - len, x + 16, y, K.gold)).join(''));
    drops.forEach(([x, y, len, name]) => {
      s += `<circle cx="${f(x)}" cy="${f(y)}" r="4" fill="#7FB6CF" stroke="${K.ink}" stroke-width=".8"/>`;
      s += callout(x + 16, y - len / 2, x + 36, y - len - 8, name, { anchor: 'start', fs: 12 });
    });
    return s;
  }

  function wheelScene(step) {
    const high = step >= 1;
    const wide = step === 2;
    const spout = high ? [200, 52] : [200, 110];
    const kx = spout[0] - 40, ky = spout[1] + 16;
    const lit = step === 0 ? 1 : (step === 1 ? 2 : 4);
    let s = paper('#FBF6EE');
    s += `<rect y="200" width="344" height="36" fill="#E4CFAE"/><rect y="200" width="344" height="5" fill="#C9A87A"/>`;
    s += `<rect x="226" y="168" width="6" height="32" fill="#7A5A3A"/>`;
    s += pinwheel(230, 158, 26);
    const arcs = step === 0 ? 1 : (step === 1 ? 2 : 3);
    for (let i = 0; i < arcs; i++) {
      s += `<path d="M248 ${142 - i * 8} q10 -6 8 6" fill="none" stroke="${K.ink}" stroke-width="1.3"/>`;
    }
    const streamW = wide ? 8 : 3.2;
    const pot = kettle(kx, ky, { k: 1, mouth: wide ? 11 : 5 });
    s += step === 1 ? glow(pot) : pot;
    if (wide) s += kettle(kx - 18, ky + 4, { k: 0.72, mouth: 7 });
    s += `<path d="M${spout[0]} ${spout[1]} Q${(spout[0] + 226) / 2} ${(spout[1] + 150) / 2} 224 146" fill="none" stroke="#7FB6CF" stroke-width="${streamW}" stroke-linecap="round"/>`;
    s += `<rect x="36" y="${high ? 48 : 108}" width="7" height="${high ? 152 : 92}" rx="2" fill="#F3E7D3" stroke="${K.ink}" stroke-width=".8"/>`;
    s += callout(40, high ? 90 : 140, 78, high ? 64 : 108, high ? '落差 2' : '落差 1', { anchor: 'start', fs: 12 });
    const meterSvg = meter(300, 108, 4, lit);
    s += (step === 0 || step === 2) ? glow(meterSvg) : meterSvg;
    s += callout(spout[0], spout[1] + 8, wide ? 168 : 154, high ? 28 : 78, wide ? '水量 2' : '水量 1', { anchor: 'end', fs: 12, c: K.waterD });
    s += callout(312, 150, 326, 214, step === 2 ? '水能 4 份' : (step === 1 ? '水能 2 份' : '水能 1 份'), { anchor: 'end', fs: 12 });
    return s;
  }

  function powerStation() {
    let s = paper('#F4EFE6');
    s += `<rect y="210" width="344" height="26" fill="#E7D7C0"/>`;
    s += dam({ ox: 4, oy: 8, sc: 1 });
    s += `<rect x="248" y="118" width="5" height="78" fill="#7A5A3A"/>`;
    s += `<rect x="286" y="108" width="5" height="88" fill="#7A5A3A"/>`;
    s += `<path d="M236 150 L250 122 L288 114 L318 132" fill="none" stroke="${K.ink}" stroke-width="1.4"/>`;
    [[300, 168], [322, 176], [284, 180]].forEach(([x, y]) => {
      s += house(x, y, 1.7);
      s += `<rect x="${f(x - 2)}" y="${f(y - 12)}" width="4" height="3.5" fill="#F2B640" stroke="${K.ink}" stroke-width=".5"/>`;
    });
    s += `<rect x="128" y="56" width="6" height="140" rx="2" fill="#F3E7D3" stroke="${K.ink}" stroke-width=".8"/>`;
    s += callout(96, 108, 86, 70, '水库', { anchor: 'start', fs: 12, c: K.waterD });
    s += callout(214, 184, 168, 214, '水轮机', { anchor: 'middle', fs: 11 });
    s += callout(246, 176, 268, 214, '发电机', { anchor: 'start', fs: 11 });
    s += callout(132, 100, 148, 58, '落差', { anchor: 'start', fs: 12 });
    return s;
  }

  function deckA(step) {
    if (step === 0) return cuttingBoard(false);
    if (step === 1) return stairsRiver();
    if (step === 2) return cuttingBoard(true);
    if (step === 3) return trainPour();
    return chinaFlow();
  }
  function deckB(step) {
    if (step === 0 || step === 1) return waterfall(step);
    if (step === 2) return wheelScene(0);
    if (step === 3) return wheelScene(1);
    if (step === 4) return wheelScene(2);
    return powerStation();
  }

  S.register('w1.A', function (state) { return deckA(state.step || 0); });
  S.register('w1.B', function (state) { return deckB(state.step || 0); });
})(window);
