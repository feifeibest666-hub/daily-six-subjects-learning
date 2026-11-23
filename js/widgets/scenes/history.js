(function (global) {
  const S = global.LKScene;
  const K = S.K, f = S.f, callout = S.callout, newRing = S.newRing;
  const figure = S.figure, flag = S.flag, fort = S.fort, palace = S.palace, bag = S.bag;
  const house = S.house, mountain = S.mountain;
  const CN = S.CN, proj = S.proj, pathOf = S.pathOf, smooth = S.smooth;
  const shop = S.shop, signpost = S.signpost, pedigree = S.pedigree;
  const office = S.office, calPage = S.calPage, rope = S.rope, load = S.load;
  const wall = S.wall, kasa = S.kasa, fire = S.fire, runner = S.runner;
  const RED = '#C8463A';

  function paper(c) { return `<rect width="344" height="236" fill="${c || '#FBF3E6'}"/>`; }
  function riverThrough(pts, P) {
    const q = pts.map(P).map(function (a) { return a.map(Number); });
    let d = 'M' + q[0][0].toFixed(1) + ' ' + q[0][1].toFixed(1);
    for (let i = 0; i < q.length - 1; i++) {
      const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
      d += 'C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1);
      d += ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1);
      d += ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d;
  }
  function glow(inner) { return `<g filter="url(#glow)">${inner}</g>`; }
  function cross(x, y) {
    return `<path d="M${f(x - 9)} ${f(y - 9)} L${f(x + 9)} ${f(y + 9)} M${f(x + 9)} ${f(y - 9)} L${f(x - 9)} ${f(y + 9)}" stroke="${RED}" stroke-width="3.2" stroke-linecap="round"/>`;
  }
  function tick(x, y) {
    return `<path d="M${f(x - 9)} ${f(y)} L${f(x - 2)} ${f(y + 8)} L${f(x + 12)} ${f(y - 9)}" fill="none" stroke="${K.gold}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  function ge(x, y) {
    return `<path d="M${f(x)} ${f(y)} L${f(x + 14)} ${f(y - 8)}" stroke="${K.ink}" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M${f(x + 14)} ${f(y - 8)} l5 -1 l-2 5 Z" fill="${K.ink}"/>`;
  }
  function zhouFlag(x, y, ch) {
    return flag(x, y, RED, { ch: ch || '周', tc: '#F2C14E', fs: 9 });
  }

  function north(mode) {
    const P = proj({ s: 10.5, lon0: 102, lat0: 43, dx: 70, dy: 20 });
    const pt = function (lon, lat) { return P([lon, lat]).map(Number); };
    const hao = pt(108.9, 34.3);
    const coast = pt(122.4, 37.4);
    let s = `<rect width="344" height="236" fill="#A9D0DC"/>`;
    s += `<clipPath id="hn"><path d="${pathOf(CN.outline, P, true)}"/></clipPath>`;
    s += `<path d="${pathOf(CN.outline, P, true)}" fill="#E9DFC7" stroke="#8C7B6B" stroke-width="1.2" stroke-linejoin="round"/>`;
    s += `<g clip-path="url(#hn)">`;
    s += `<rect x="0" y="0" width="${f(hao[0])}" height="236" fill="#E7B2A8" opacity=".42"/>`;
    if (mode === 0) s += `<rect x="${f(hao[0])}" y="0" width="360" height="236" fill="#F2B640" opacity=".34"/>`;
    s += `</g>`;
    s += `<path d="${riverThrough(CN.yellow, P)}" fill="none" stroke="#C9A64A" stroke-width="2.8" stroke-linecap="round"/>`;
    s += `<g transform="translate(${f(hao[0])} ${f(hao[1])}) scale(.5)">${palace(0, 0, { ch: '周', flag: RED, name: '', fs: 9, tc: '#F2C14E' })}</g>`;
    return { s: s, hao: hao, coast: coast, pt: pt };
  }

  function deckC(step) {
    if (step <= 2) return zhouMap(step);
    if (step === 3) return shops();
    return fork(step === 5);
  }

  function zhouMap(step) {
    const map = north(step === 0 ? 0 : 1);
    let s = map.s;
    const hao = map.hao, coast = map.coast;
    s += callout(hao[0], hao[1] - 28, hao[0], 46, '镐京（今西安附近）', { anchor: 'middle', fs: 11 });
    s += callout(coast[0], coast[1], 326, 58, '东边海边', { anchor: 'end', fs: 12 });
    if (step === 0) {
      s += glow(`<text x="198" y="156" font-size="12" font-weight="800" fill="#7A4E12" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">前 1046 年 新得的地</text>`);
      return s;
    }
    const dots = [];
    for (let i = 0; i < 6; i++) {
      const t = (i + 1) / 7;
      dots.push([hao[0] + (coast[0] - hao[0]) * t, hao[1] + (coast[1] - hao[1]) * t + Math.sin(t * 3) * 8]);
    }
    s += `<path d="M${f(hao[0] + 16)} ${f(hao[1] - 8)} L${dots.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join(' L')} L${f(coast[0])} ${f(coast[1])}" fill="none" stroke="${K.ink}" stroke-width="1.6" stroke-dasharray="5 4"/>`;
    dots.forEach(function (p) { s += `<circle cx="${f(p[0])}" cy="${f(p[1])}" r="3.2" fill="#fff" stroke="${K.ink}" stroke-width="1"/>`; });
    s += `<path d="M${f(coast[0])} ${f(coast[1] + 16)} Q${(hao[0] + coast[0]) / 2} ${coast[1] + 48} ${f(hao[0] + 10)} ${f(hao[1] + 18)}" fill="none" stroke="#C4B39A" stroke-width="1.5" stroke-dasharray="3 3"/>`;
    if (step === 1) {
      const mx = dots[2][0], my = dots[2][1] + 18;
      s += glow(figure(mx, my + 8, { k: 0.45, hat: 'bun', robe: '#8FA7C9', right: 'hold' }) + bag(mx + 10, my - 6, '信'));
      s += callout(dots[1][0], dots[1][1], 96, 196, '去：约 1 个月', { anchor: 'start', fs: 12 });
      s += callout(hao[0] + 20, hao[1] + 24, 168, 214, '回信：又 1 个月', { anchor: 'middle', fs: 12 });
      return s;
    }
    const crowd = [[176, 168], [198, 186], [214, 156], [246, 172], [268, 148], [236, 198]];
    crowd.forEach(function (p) {
      s += figure(p[0], p[1], { k: 0.38, hat: 'helmet', face: 'stern', robe: '#7A5A44', right: 'hold' }) + ge(p[0] + 8, p[1] - 16);
    });
    s += newRing(196, 168, 28);
    s += callout(230, 150, 250, 108, '原来服从商的人', { anchor: 'middle', fs: 12 });
    return s;
  }

  function shops() {
    let s = paper('#F6EFE4');
    s += `<rect y="198" width="344" height="38" fill="#E4CFAE"/>`;
    s += `<path d="M0 198 H344" stroke="#C9A87A" stroke-width="3"/>`;
    s += shop(36, 188, 80, '总店');
    s += figure(78, 186, { k: 0.5, hat: 'bun', robe: '#8FA7C9', face: 'worry' });
    const small = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) small.push([188 + col * 36, 86 + row * 46]);
    }
    small.forEach(function (p) { s += shop(p[0], p[1], 26, ''); });
    s += `<path d="M120 150 L176 112" fill="none" stroke="${K.ink}" stroke-width="1.6" stroke-dasharray="4 3"/>`;
    s += `<path d="M168 108 L178 114 L166 118" fill="none" stroke="${K.ink}" stroke-width="1.6"/>`;
    s += glow(figure(146, 156, { k: 0.42, hat: 'bun', right: 'hold' }) + bag(156, 142, '信'));
    s += callout(70, 150, 78, 78, '总店', { anchor: 'start', fs: 12 });
    s += callout(250, 70, 286, 28, '十几家分店', { anchor: 'end', fs: 12 });
    s += callout(148, 128, 150, 208, '一来一回两个月', { anchor: 'middle', fs: 11 });
    s += `<text x="132" y="96" font-size="11" font-weight="750" fill="${K.ink}">1000 多公里</text>`;
    return s;
  }

  function fork(chosen) {
    let s = paper('#F3E6D2');
    s += `<path d="M48 214 L172 128 L304 214" fill="none" stroke="#C4A574" stroke-width="16" stroke-linecap="round"/>`;
    s += `<path d="M48 214 L172 128 L304 214" fill="none" stroke="#E7D3B0" stroke-width="7" stroke-linecap="round"/>`;
    s += `<path d="M172 214 L172 118" fill="none" stroke="#C4A574" stroke-width="14" stroke-linecap="round"/>`;
    s += `<path d="M172 214 L172 118" fill="none" stroke="#E7D3B0" stroke-width="6" stroke-linecap="round"/>`;
    const ends = [
      { x: 78, y: 108, sign: '自己派人', pic: 'mail' },
      { x: 156, y: 46, sign: '原来的首领', pic: 'chief' },
      { x: 300, y: 86, sign: '兄弟、儿子、功臣', pic: 'kin' }
    ];
    ends.forEach(function (e, i) {
      const dim = chosen && i < 2;
      let pic = '';
      if (e.pic === 'mail') pic = figure(e.x, e.y + 36, { k: 0.4, hat: 'bun' }) + `<text x="${e.x}" y="${e.y + 48}" font-size="10" font-weight="700" fill="${K.ink}" text-anchor="middle">2 个月</text>`;
      if (e.pic === 'chief') pic = figure(e.x, e.y + 40, { k: 0.5, hat: 'guan', face: 'stern', robe: '#7A5A44' });
      if (e.pic === 'kin') {
        pic = [[-18, 0], [0, 6], [18, 0]].map(function (d, n) {
          const hat = n === 2 ? 'helmet' : 'bun';
          return figure(e.x + d[0], e.y + 46 + d[1], { k: 0.45, hat: hat, robe: n === 2 ? '#7A5A44' : '#8FA7C9' });
        }).join('');
        if (chosen) {
          pic += [[-18, 0], [0, 6], [18, 0]].map(function (d) {
            return zhouFlag(e.x + d[0] + 8, e.y + 20 + d[1], '周');
          }).join('');
        }
      }
      const pole = i === 2 ? 228 : e.x - 28;
      const block = signpost(pole, e.y + 8, e.sign) + pic + ((i < 2) ? cross(e.x + 24, e.y + 8) : (chosen ? glow(tick(e.x + 22, e.y + 6)) : ''));
      s += dim ? `<g opacity=".38">${block}</g>` : block;
    });
    s += figure(172, 214, { k: 0.85, hat: 'mian', face: chosen ? 'calm' : 'worry', robe: '#8E3F33', right: chosen ? 'point' : 'hold' });
    if (!chosen) s += newRing(172, 150, 26);
    else s += callout(210, 150, 250, 132, '周选了第三条', { anchor: 'start', fs: 12 });
    return s;
  }

  function deckD(step) {
    if (step === 0) return brothers();
    if (step === 1) return family();
    if (step === 2) return lands();
    if (step === 3) return company();
    if (step === 4) return lordThinks();
    return loosened();
  }

  function brothers() {
    let s = paper('#F6EFE4');
    s += `<path d="M70 168 L172 132 L274 168 L274 196 L70 196 Z" fill="#E4CFAE" stroke="${K.ink}" stroke-width="1.2"/>`;
    s += `<rect x="84" y="78" width="12" height="110" fill="${RED}"/>`;
    s += `<rect x="248" y="78" width="12" height="110" fill="${RED}"/>`;
    s += `<rect x="78" y="72" width="24" height="8" fill="#8E3F33"/>`;
    s += `<rect x="242" y="72" width="24" height="8" fill="#8E3F33"/>`;
    s += zhouFlag(96, 86, '周') + zhouFlag(242, 86, '周');
    s += figure(140, 200, { k: 0.9, hat: 'mian', robe: '#8E3F33', right: 'give', face: 'calm' });
    s += figure(204, 200, { k: 0.9, hat: 'guan', robe: '#7D8FB0', flip: true, right: 'give', face: 'calm' });
    s += glow(newRing(172, 168, 16));
    s += callout(140, 150, 78, 46, '天子', { anchor: 'start', fs: 13 });
    s += callout(204, 150, 286, 46, '诸侯', { anchor: 'end', fs: 13 });
    s += callout(172, 188, 172, 222, '第 1 代：亲兄弟', { anchor: 'middle', fs: 12 });
    return s;
  }

  function family() {
    let s = paper('#F6EFE4') + pedigree(70, 28, 260, 188);
    function link(x1, y1, x2, y2, w, dash) {
      return `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)}" fill="none" stroke="#8E3F33" stroke-width="${w}" ${dash || ''} stroke-linecap="round"/>`;
    }
    const gens = [
      { y: 108, lx: 128, rx: 272, k: 0.34, lh: 'mian', rh: 'guan', bar: 2.5, dash: '' },
      { y: 134, lx: 116, rx: 284, k: 0.3, lh: 'guan', rh: 'guan', bar: 1.7, dash: '' },
      { y: 160, lx: 122, rx: 278, k: 0.28, lh: 'guan', rh: 'bun', bar: 1.2, dash: 'stroke-dasharray="4 3"' },
      { y: 184, lx: 126, rx: 274, k: 0.26, lh: 'bun', rh: 'bun', bar: 0.9, dash: 'stroke-dasharray="3 3"' },
      { y: 208, lx: 130, rx: 270, k: 0.26, lh: 'bun', rh: 'bun', bar: 0.6, dash: 'stroke-dasharray="1.2 2.4"' }
    ];
    s += link(200, 72, gens[0].lx, gens[0].y - 16, 2.5);
    s += link(200, 72, gens[0].rx, gens[0].y - 16, 2.5);
    gens.forEach(function (g, i) {
      const shoulder = g.y - 18;
      s += link(g.lx, shoulder, g.rx, shoulder, g.bar, g.dash);
      if (i) {
        s += link(gens[i - 1].lx, gens[i - 1].y - 8, g.lx, shoulder, g.bar, g.dash);
        s += link(gens[i - 1].rx, gens[i - 1].y - 8, g.rx, shoulder, g.bar, g.dash);
      }
    });
    s += `<text x="200" y="36" font-size="12" font-weight="800" fill="${K.ink}" text-anchor="middle">周文王</text>`;
    s += figure(200, 78, { k: 0.46, hat: 'mian', robe: '#8E3F33', face: 'calm' });
    gens.forEach(function (g) {
      s += figure(g.lx, g.y, { k: g.k, hat: g.lh, robe: '#8E3F33', face: 'calm' });
      s += figure(g.rx, g.y, { k: g.k, hat: g.rh, robe: '#7D8FB0', face: 'calm' });
    });
    const last = gens[4];
    s += glow(newRing(last.lx, last.y - 16, 13) + newRing(last.rx, last.y - 16, 13));
    s += `<text x="96" y="98" font-size="11" font-weight="800" fill="${K.ink}" text-anchor="end">天子</text>`;
    s += `<text x="312" y="98" font-size="11" font-weight="800" fill="${K.ink}" text-anchor="start">诸侯</text>`;
    s += callout(150, 90, 92, 66, '亲兄弟', { anchor: 'end', fs: 12 });
    s += callout(200, gens[2].y - 16, 200, gens[2].y - 34, '堂兄弟', { anchor: 'middle', fs: 12 });
    s += callout(200, last.y - 8, 200, 228, '远亲', { anchor: 'middle', fs: 12 });
    return s;
  }

  function lands() {
    let s = paper('#F4EFE6');
    s += `<path d="M16 158 L34 122 L150 122 L168 158 Z" fill="#C4A574" stroke="${K.ink}" stroke-width="1"/>`;
    s += `<path d="M30 152 L46 128 L134 128 L150 152 Z" fill="#DDE8C4" stroke="${K.ink}" stroke-width="1"/>`;
    s += `<path d="M78 128 L88 152" stroke="#E7D3B0" stroke-width="4"/>`;
    s += `<path d="M98 142 L110 128 L122 142 L122 152 L98 152 Z" fill="#F4E7D4" stroke="${K.ink}" stroke-width="1"/>`;
    s += `<path d="M98 142 L110 128 L122 142 Z" fill="#C8463A" stroke="${K.ink}" stroke-width="1"/>`;
    s += `<g transform="translate(168 8) scale(.5 .62)">${S.plainBlock('plainR')}</g>`;
    const troops = [188, 214, 240, 266, 292].map(function (x) {
      return figure(x, 168, { k: 0.3, hat: 'helmet', robe: '#7A5A44', face: 'stern' });
    }).join('');
    s += glow(troops);
    s += callout(70, 150, 16, 78, '天子：地分出去了', { anchor: 'start', fs: 11 });
    s += callout(250, 150, 300, 196, '诸侯：开荒、添人、练兵', { anchor: 'end', fs: 11 });
    return s;
  }

  function company() {
    let s = paper('#E7EEF2');
    s += `<rect y="188" width="344" height="48" fill="#D5DDE3"/>`;
    s += office(24, 176, 60, '总部');
    s += office(196, 196, 108, '分公司');
    [214, 236, 258, 280].forEach(function (x) {
      s += runner(x, 186, '#3D86D9', { pose: 'stand' });
    });
    s += `<rect x="228" y="92" width="22" height="16" rx="2" fill="#F3E7D3" stroke="${K.ink}" stroke-width=".8"/>`;
    s += `<path d="M232 96 h14 M232 100 h14 M232 104 h10" stroke="#8C7B6B" stroke-width=".7"/>`;
    s += glow(calPage(132, 78, '春节'));
    s += callout(150, 120, 118, 48, '一年见一面', { anchor: 'middle', fs: 12 });
    s += callout(250, 108, 300, 36, '账自己管', { anchor: 'end', fs: 12 });
    s += callout(250, 168, 300, 214, '员工只认分公司老板', { anchor: 'end', fs: 11 });
    return s;
  }

  function lordThinks() {
    let s = paper('#F6EFE4');
    s += `<rect x="70" y="150" width="150" height="8" fill="#D9C3A0"/>`;
    s += `<rect x="86" y="158" width="118" height="46" fill="#EFE3CB" stroke="${K.ink}"/>`;
    s += `<path d="M78 160 Q140 142 202 160" fill="#8E3F33"/>`;
    s += `<ellipse cx="110" cy="198" rx="26" ry="7" fill="${RED}"/>`;
    s += figure(110, 206, { k: 0.9, hat: 'guan', robe: '#7D8FB0', face: 'worry', left: 'hold', right: 'hold' });
    s += bag(168, 188, '粟') + bag(188, 196, '粟') + bag(206, 186, '粟');
    [236, 262, 288].forEach(function (x) {
      s += figure(x, 206, { k: 0.48, hat: 'helmet', robe: '#7A5A44', face: 'stern' });
    });
    s += glow(`<g>${S.bubble(248, 96, '少交一点、少去一次', { cloud: true, fs: 12, tx: 160 })}
      <g transform="translate(214 62) scale(.62)">
        <rect x="0" y="18" width="36" height="10" rx="2" fill="#A8845A" stroke="${K.ink}" stroke-width=".8"/>
        <circle cx="8" cy="30" r="4" fill="#5A4636"/><circle cx="28" cy="30" r="4" fill="#5A4636"/>
        ${bag(10, 16, '粟')}${bag(22, 16, '粟')}${bag(34, 16, '粟')}
        ${cross(34, 10)}
      </g></g>`);
    s += callout(150, 168, 78, 78, '兵、粮、百姓都在我手里', { anchor: 'start', fs: 11 });
    return s;
  }

  function loosened() {
    let s = paper('#F6EFE4');
    s += fort(78, 168, 40, RED, { ch: '周', tc: '#F2C14E', fs: 9, name: '天子' });
    s += fort(250, 150, 70, RED, { ch: '周', tc: '#F2C14E', fs: 9, name: '诸侯' });
    s += zhouFlag(286, 118, '周') + zhouFlag(302, 128, '周');
    s += rope(108, 132, 230, 0.58);
    s += glow(newRing(176, 128, 14));
    [0, 1, 2].forEach(function (i) {
      const y = 196 - i * 14;
      s += `<rect x="${210 + i * 8}" y="${y}" width="${70 - i * 8}" height="12" fill="${i === 2 ? '#E4CFAE' : '#CDB892'}" stroke="${K.ink}" stroke-width=".7"/>`;
    });
    s += `<text x="246" y="222" font-size="11" font-weight="700" fill="${K.ink}" text-anchor="middle">第 1 代 → 第 5 代</text>`;
    s += callout(150, 118, 120, 40, '血缘：越来越细', { anchor: 'middle', fs: 12 });
    s += callout(250, 168, 320, 46, '实力：越来越强', { anchor: 'end', fs: 12 });
    return s;
  }

  function deckE(step) {
    if (step === 0) return fifteen();
    if (step === 1) return fourWorks();
    if (step === 2) return machine();
    if (step === 3) return rainRoad();
    return chenFork(step === 5);
  }

  function fifteen() {
    let s = paper('#F6EFE4');
    s += `<rect x="80" y="34" width="250" height="18" rx="4" fill="#E6D2A8" stroke="#C4A574"/>`;
    s += `<rect x="118" y="36" width="150" height="14" fill="#F2B640"/>`;
    s += `<text x="96" y="47" font-size="10" font-weight="750" fill="${K.ink}">前 221 统一</text>`;
    s += `<text x="276" y="47" font-size="10" font-weight="750" fill="${K.ink}">前 207 灭亡</text>`;
    s += `<text x="190" y="47" font-size="12" font-weight="800" fill="#7A4E12" text-anchor="middle">约 15 年</text>`;
    s += palace(210, 140);
    s += `<path d="M188 146 L204 132 L214 148" fill="none" stroke="#4A3B30" stroke-width="1.6"/>`;
    [[78, 210], [118, 214], [156, 208], [250, 214], [292, 210]].forEach(function (p) {
      s += figure(p[0], p[1], { k: 0.42, hat: 'bun', robe: '#9A8B76', face: 'worry' });
      s += `<g transform="translate(${p[0] + 8} ${p[1] - 12}) scale(.55)">${load(0, 0)}</g>`;
    });
    s += callout(150, 188, 70, 168, '用民力太狠', { anchor: 'start', fs: 12 });
    return s;
  }

  function fourWorks() {
    const P = proj({ s: 5.3, lon0: 74, lat0: 54, dx: 28, dy: 12 });
    const pt = function (lon, lat) { return P([lon, lat]).map(Number); };
    let s = `<rect width="344" height="236" fill="#EAF3F5"/>`;
    s += `<clipPath id="qinN"><path d="${pathOf(CN.outline, P, true)}"/></clipPath>`;
    s += `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8"/>`;
    s += `<g clip-path="url(#qinN)">`;
    s += `<path d="${pathOf(CN.line2.concat([[100, 20], [60, 20], [60, 56], [122.4, 56]]), P, true)}" fill="#E3C9A0"/>`;
    s += `<path d="${pathOf(CN.line1.concat([[98, 20], [60, 20], [60, 36.6]]), P, true)}" fill="#C9A27E"/>`;
    s += `</g>`;
    s += `<path d="${pathOf(CN.outline, P, true)}" fill="none" stroke="#8C7B6B" stroke-width="1.15" stroke-linejoin="round"/>`;
    const ty = P([121, 23.7]).map(Number), hn = P([109.6, 19.2]).map(Number);
    s += `<ellipse cx="${ty[0]}" cy="${ty[1]}" rx="2.2" ry="5.4" fill="#EEE3C8" stroke="#8C7B6B" stroke-width=".7"/>`;
    s += `<ellipse cx="${hn[0]}" cy="${hn[1]}" rx="4.4" ry="2.6" fill="#EEE3C8" stroke="#8C7B6B" stroke-width=".7"/>`;
    s += `<path d="${riverThrough(CN.yangtze, P)}" fill="none" stroke="${K.waterD}" stroke-width="2.2" stroke-linecap="round"/>`;
    s += `<path d="${riverThrough(CN.yellow, P)}" fill="none" stroke="#C9A64A" stroke-width="2.3" stroke-linecap="round"/>`;
    const northEdge = [[104.2, 40.8], [107, 42], [109.2, 42.6], [112, 43.6], [115, 42.4], [118, 40.8], [121.2, 40.2]].map(function (p) { return pt(p[0], p[1]); });
    s += wall(northEdge);
    const xy = pt(108.9, 34.3);
    s += `<g transform="translate(${f(xy[0])} ${f(xy[1])}) scale(.34)">${palace(0, 0, { name: '' })}</g>`;
    const tomb = pt(109.6, 34.2);
    s += mountain(tomb[0], tomb[1] + 10, 28, 16, { c: '#C4A574', cd: '#A8845A' });
    const hun = pt(112.4, 46.2);
    const yue = pt(112.2, 22.6);
    s += `<path d="M${f(xy[0])} ${f(xy[1] - 12)} L${f(hun[0])} ${f(hun[1] + 4)}" stroke="${RED}" stroke-width="2"/>`;
    s += `<path d="M${f(xy[0] + 2)} ${f(xy[1] + 8)} L${f(yue[0])} ${f(yue[1] - 4)}" stroke="${RED}" stroke-width="2"/>`;
    [[xy[0] - 14, xy[1] + 16], [xy[0] + 12, xy[1] + 18], [hun[0] - 14, hun[1] + 8], [hun[0] + 4, hun[1] + 12], [yue[0] - 12, yue[1] + 8], [yue[0] + 8, yue[1] + 12]].forEach(function (p) {
      s += figure(p[0], p[1], { k: 0.26, hat: 'bun', robe: '#9A8B76' });
    });
    s += callout(northEdge[3][0], northEdge[3][1], 248, 58, '长城', { anchor: 'end', fs: 12 });
    s += callout(xy[0] + 8, xy[1], 328, 118, '宫殿和陵墓：刑徒 70 多万', { anchor: 'end', fs: 11, isNew: true });
    s += callout(hun[0], hun[1], 86, 52, '击匈奴', { anchor: 'start', fs: 12, c: RED });
    s += callout(yue[0], yue[1], 78, 214, '征百越', { anchor: 'start', fs: 12, c: RED });
    return s;
  }

  function machine() {
    const jun = [[60, 84], [60, 162], [284, 84], [284, 162], [120, 202], [224, 202]];
    let s = paper('#F1EBDD');
    s += `<g transform="translate(34 24) scale(.8)">${S.commanderies({ envoy: false })}</g>`;
    s += wall([[40, 28], [120, 18], [210, 22], [310, 16]]);
    jun.forEach(function (p, i) {
      const x = 34 + p[0] * 0.8, y = 24 + p[1] * 0.8;
      let col = '';
      for (let n = 0; n < 3; n++) {
        const px = x + (170 - x) * 0.15 + n * 4;
        const py = y - 18 - n * 16;
        col += figure(px, py, { k: 0.28, hat: 'bun', robe: '#9A8B76' });
      }
      s += i === 2 ? glow(col) : col;
    });
    s += callout(172, 70, 250, 40, '命令直达每个县', { anchor: 'end', fs: 12 });
    s += callout(120, 40, 70, 58, '征人也格外快', { anchor: 'start', fs: 12 });
    return s;
  }

  function rainRoad() {
    let s = `<rect width="344" height="236" fill="#8E9AA6"/>`;
    for (let i = 0; i < 40; i++) {
      const x = (i * 37) % 360 - 10;
      const y = (i * 53) % 200;
      s += `<path d="M${f(x)} ${f(y)} l14 22" stroke="#fff" stroke-width="1.1" opacity=".5"/>`;
    }
    s += `<path d="M0 168 Q80 150 150 164 L150 210 Q80 196 0 210 Z" fill="#B59C7A"/>`;
    s += `<path d="M194 160 Q260 148 344 166 L344 214 Q260 198 194 208 Z" fill="#B59C7A"/>`;
    s += `<path d="M140 150 Q172 132 210 156 L214 214 Q170 200 136 214 Z" fill="#7FB6CF"/>`;
    s += glow(`<path d="M148 162 Q176 148 204 164" fill="none" stroke="${K.gold}" stroke-width="3" stroke-linecap="round"/>`);
    s += `<path d="M150 168 q8 -3 16 0 M156 182 q8 -3 16 0 M148 196 q8 -3 16 0" fill="none" stroke="#fff" stroke-width="1.3"/>`;
    for (let i = 0; i < 10; i++) {
      const x = 28 + (i % 5) * 22;
      const y = 196 + Math.floor(i / 5) * 16;
      s += figure(x, y, { k: 0.38, hat: 'bun', robe: '#6E6258', face: 'worry' });
      if (i === 1 || i === 4) s += kasa(x, y - 28);
    }
    s += signpost(236, 176, '渔阳 →');
    s += callout(48, 176, 78, 36, '大泽乡 · 前 209', { anchor: 'start', fs: 12 });
    s += callout(176, 156, 312, 96, '连日大雨，路断了', { anchor: 'end', fs: 12 });
    return s;
  }

  function chenRise() {
    let s = paper('#F6EFE4');
    s += `<path d="M24 196 Q140 168 220 148" fill="none" stroke="#E4CFAE" stroke-width="16" stroke-linecap="round"/>`;
    [[48, 86], [108, 64], [176, 52], [248, 70]].forEach(function (p) {
      s += `<g transform="translate(${p[0]} ${p[1]}) scale(.5)">${fort(0, 0, 40, '#8A8178', { ch: '' })}</g>`;
      s += fire(p[0] + 8, p[1] - 10, 0.75);
    });
    s += figure(168, 214, { k: 0.9, hat: 'bun', face: 'stern', robe: '#8C6B4A', right: 'up' });
    s += glow(zhouFlag(196, 148, '楚'));
    s += callout(196, 140, 286, 168, '前 209 起义', { anchor: 'end', fs: 12 });
    s += callout(140, 70, 168, 28, '各地纷纷响应', { anchor: 'middle', fs: 12 });
    return s;
  }

  function chenFork(rise) {
    if (rise) return chenRise();
    let s = paper('#E4E8EC');
    s += `<path d="M36 210 L172 120 L308 210" fill="none" stroke="#D7CBB4" stroke-width="26" stroke-linecap="round"/>`;
    s += `<path d="M172 214 L172 112" fill="none" stroke="#D7CBB4" stroke-width="20"/>`;
    s += signpost(56, 118, '误期') + `<rect x="78" y="108" width="6" height="28" fill="#7A5A3A"/><path d="M70 104 L100 116" stroke="#8A8178" stroke-width="3"/>` + cross(108, 100);
    s += signpost(146, 52, '逃跑') + figure(168, 92, { k: 0.4, hat: 'helmet' }) + figure(188, 96, { k: 0.4, hat: 'helmet' }) + cross(206, 58);
    if (!rise) {
      s += signpost(250, 86, '起来反抗');
      s += `<text x="292" y="78" font-size="22" font-weight="800" fill="${K.ink}">?</text>`;
    } else {
      s += signpost(250, 86, '起来反抗');
      s += zhouFlag(300, 70, '楚');
      s += figure(292, 118, { k: 0.48, hat: 'bun', right: 'up' });
      s += `<path d="M286 108 L286 92" stroke="#7A5A3A" stroke-width="2.4"/>`;
    }
    s += figure(172, 214, { k: 0.85, hat: 'bun', face: rise ? 'stern' : 'worry', robe: '#8C6B4A', right: rise ? 'up' : 'hold' });
    if (rise) {
      s += glow(zhouFlag(196, 150, '楚'));
      [[40, 70], [90, 48], [150, 36], [230, 40], [300, 28]].forEach(function (p) {
        s += `<g transform="translate(${p[0]} ${p[1]}) scale(.45)">${fort(0, 0, 36, '#8A8178', { ch: '' })}</g>`;
        s += fire(p[0] + 6, p[1] - 8, 0.7);
      });
      s += callout(196, 140, 250, 132, '前 209 起义', { anchor: 'start', fs: 12 });
      s += callout(160, 40, 120, 22, '各地纷纷响应', { anchor: 'middle', fs: 12 });
    } else {
      s += callout(90, 112, 86, 78, '斩', { anchor: 'start', fs: 13, c: RED });
      s += callout(176, 70, 150, 28, '抓到也斩', { anchor: 'middle', fs: 12, c: RED });
      s += callout(286, 100, 300, 132, '也许能活', { anchor: 'end', fs: 12 });
    }
    return s;
  }

  S.register('w1.C', function (state) { return deckC(state.step || 0); });
  S.register('w1.D', function (state) { return deckD(state.step || 0); });
  S.register('w1.E', function (state) { return deckE(state.step || 0); });
})(window);
