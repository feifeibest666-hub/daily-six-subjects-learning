(function (global) {
  const S = global.LKScene;
  const K = S.K, f = S.f, CN = S.CN, proj = S.proj, pathOf = S.pathOf;
  const kid = S.kid, yin = S.yin, talk = S.talk, lab = S.lab, glow = S.glow;
  const mountain = S.mountain, tree = S.tree, figure = S.figure, trainWindow = S.trainWindow;
  const river = function (pts) { return S.smooth ? S.smooth(pts, function (p) { return p; }) : ''; };

  function sky(c) { return `<rect width="340" height="260" fill="${c || '#EAF3F5'}"/>`; }
  function ground(y, c) { return `<rect y="${y}" width="340" height="${260 - y}" fill="${c || '#E4CFAE'}"/>`; }

  function h1(step) {
    if (step === 0) {
      return sky('#D7E8F2')
        + mountain(90, 130, 90, 78, { snow: true })
        + mountain(170, 128, 110, 92, { snow: true, c: '#B49A7C' })
        + mountain(260, 136, 80, 64, { snow: true })
        + `<path d="M190 96 L250 78 L320 110 L320 188 L190 188 Z" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.3"/>`
        + `<rect x="204" y="118" width="96" height="12" fill="#C8463A"/>`
        + `<rect x="236" y="70" width="36" height="16" rx="2" fill="#1E4E8C" stroke="${K.ink}"/>`
        + lab(254, 82, '拉萨', { fs: 13, c: '#fff', stroke: '#1E4E8C' })
        + ground(198, '#C9B59A')
        + `<g transform="translate(-20 176)">${S.trainCar(0, 0, 1.15)}</g>`
        + glow(`<rect x="198" y="146" width="92" height="22" rx="4" fill="#3D86D9" stroke="${K.ink}"/>` + lab(244, 162, '海拔 3650 米', { fs: 13, c: '#fff', stroke: '#3D86D9' }))
        + kid(118, 236, { pose: 'cheer', face: 'happy', prop: 'backpack', k: 0.72 })
        + talk(150, 150, '出发去上海！', 124, 168);
    }
    if (step === 1) {
      return sky('#E7EEF2')
        + trainWindow(28, 18, 250, 150)
        + `<g clip-path="url(#tw28x18)">`
        + mountain(80, 120, 70, 50, { snow: true })
        + `<path d="M160 40 L300 70 L300 150 L160 150 Z" fill="#C9A27E"/>`
        + `<path d="M168 90 L210 78 L248 96 L290 80 L290 150 L168 150 Z" fill="#A8845A"/>`
        + glow(`<path d="M160 40 L300 70 L300 150 L160 150 Z" fill="#E2B43A" opacity=".55"/>`)
        + `</g>`
        + `<rect x="188" y="168" width="130" height="10" rx="2" fill="#C4A574" stroke="${K.ink}" stroke-width=".8"/>`
        + kid(268, 248, { pose: 'point', face: 'wow', flip: true, k: 0.7 })
        + talk(210, 214, '山变成黄土了', 250, 200);
    }
    if (step === 2) {
      let towers = '';
      [[150, 70, 28, 110, '#C5D0D6'], [182, 40, 22, 140, '#8FA7C9'], [208, 78, 34, 102, '#E7D3B0'], [246, 24, 16, 156, '#C8463A'], [266, 58, 26, 122, '#D9D3CB'], [296, 48, 30, 132, '#7C6BD6']].forEach(function (t) {
        towers += `<rect x="${t[0]}" y="${t[1]}" width="${t[2]}" height="${t[3]}" fill="${t[4]}" stroke="${K.ink}" stroke-width=".7"/>`;
      });
      towers += `<circle cx="254" cy="18" r="10" fill="#C8463A" stroke="${K.ink}"/><rect x="252" y="28" width="4" height="36" fill="#8A8178"/>`;
      return sky('#F7E7D2') + towers + ground(190, '#B7C3A4')
        + `<rect x="28" y="58" width="86" height="28" rx="4" fill="#1E4E8C" stroke="${K.ink}"/>`
        + lab(71, 78, '上海站', { fs: 15, c: '#fff', stroke: '#1E4E8C' })
        + glow(`<rect x="28" y="96" width="118" height="34" rx="6" fill="#3D86D9" stroke="${K.ink}"/>` + lab(87, 118, '海拔 4 米', { fs: 15, c: '#fff', stroke: '#3D86D9' }))
        + kid(230, 236, { pose: 'hold', face: 'wow', prop: 'backpack', k: 0.74 })
        + talk(250, 150, '才 4 米？', 220, 168);
    }
    return sky('#FBF6EE')
      + `<rect x="28" y="16" width="230" height="176" rx="6" fill="#fff" stroke="${K.ink}" stroke-width="1.4"/>`
      + `<rect x="48" y="40" width="62" height="16" fill="#C9A27E" stroke="${K.ink}"/>`
      + `<rect x="110" y="78" width="62" height="16" fill="#E2CF7E" stroke="${K.ink}"/>`
      + `<rect x="172" y="116" width="62" height="16" fill="#9FBF74" stroke="${K.ink}"/>`
      + `<g transform="translate(46 18) scale(.32)">${S.trainCar(0, 0, 1)}</g>`
      + `<path d="M80 56 L110 78 L142 94 L172 116 L204 148" fill="none" stroke="${K.ink}" stroke-width="1.5" stroke-dasharray="4 3"/>`
      + lab(78, 34, '拉萨', { fs: 13 }) + lab(214, 156, '上海', { fs: 13 })
      + glow(`<text x="214" y="78" font-size="36" font-weight="800" fill="${K.ink}">?</text>`)
      + yin(300, 220, { face: 'think', arm: 'point', k: 0.7 })
      + talk(250, 188, '一共下了几级？', 286, 196);
  }

  function h2(step) {
    if (step === 0) {
      return sky('#EAF3F5')
        + `<rect y="118" width="340" height="100" fill="#7FB6CF"/>`
        + [128, 146, 168, 190].map(function (y) { return `<path d="M20 ${y} q16 -4 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0" fill="none" stroke="#fff" stroke-width="1.6"/>`; }).join('')
        + mountain(40, 118, 70, 40, { c: '#B7C3A4' }) + mountain(300, 116, 80, 46, { c: '#B7C3A4' })
        + tree(28, 124, 1.6) + tree(310, 122, 1.8)
        + [90, 160, 230].map(function (x) { return `<path d="M${x} 150 L${x + 28} 150" stroke="#fff" stroke-width="3" marker-end=""/><path d="M${x + 22} 146 L${x + 32} 150 L${x + 22} 154 Z" fill="#fff"/>`; }).join('')
        + `<g transform="translate(250 36)"><circle r="18" fill="#fff" stroke="${K.ink}"/><path d="M-12 0 H12 M0 -12 V12" stroke="${K.ink}"/><text x="0" y="-2" font-size="13" font-weight="800" text-anchor="middle">东</text><path d="M2 0 L12 0 L8 -4 M12 0 L8 4" fill="none" stroke="#C8463A" stroke-width="1.6"/></g>`
        + S.rowboat(168, 176, 1)
        + kid(156, 174, { pose: 'paddle', face: 'happy', k: 0.62 })
        + glow(S.rowboat(168, 176, 1))
        + talk(200, 130, '一江春水向东流', 160, 150);
    }
    if (step === 1) {
      const P = proj({ s: 3.6, dx: 70, dy: 28 });
      return sky('#F4EFE6')
        + `<rect x="70" y="16" width="250" height="180" rx="4" fill="#E7D3B0" stroke="${K.ink}"/>`
        + `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8" stroke="#8C7B6B"/>`
        + `<path d="${pathOf(CN.yangtze, P)}" fill="none" stroke="#3D86D9" stroke-width="2.4"/>`
        + `<path d="${pathOf(CN.yellow, P)}" fill="none" stroke="#3D86D9" stroke-width="2"/>`
        + glow(`<path d="M250 120 L270 116 L266 124 Z" fill="#C8463A"/><path d="M268 150 L286 146 L282 154 Z" fill="#C8463A"/>`)
        + yin(48, 220, { face: 'wow', arm: 'point', k: 0.7 })
        + talk(130, 210, '为什么不向西？', 70, 200);
    }
    if (step === 2) {
      return sky('#F6EFE4')
        + `<rect width="340" height="150" fill="#F3E6D4"/>`
        + `<rect x="20" y="24" width="40" height="28" fill="#C5D8E4" stroke="${K.ink}" stroke-width=".6"/>`
        + `<path d="M40 70 L90 150 L250 150 L300 70 Z" fill="#E7D3B0" stroke="${K.ink}"/>`
        + S.books(78, 168, 2)
        + kid(78, 236, { pose: 'lift', face: 'worry', k: 0.78 })
        + glow(S.books(78, 168, 2))
        + `<g transform="translate(86 118) rotate(-18)">${cup()}</g>`
        + talk(200, 90, '试试看！', 110, 140);
    }
    return sky('#F6EFE4')
      + `<path d="M40 86 L300 150 L300 162 L40 98 Z" fill="#D9B98A" stroke="${K.ink}"/>`
      + S.books(64, 150, 2)
      + `<path d="M70 92 L286 148" stroke="#3D86D9" stroke-width="4" stroke-linecap="round"/>`
      + `<ellipse cx="292" cy="210" rx="22" ry="8" fill="#F7F4EF" stroke="${K.ink}"/>`
      + `<path d="M286 156 L292 198" stroke="#3D86D9" stroke-width="2"/>`
      + kid(78, 236, { pose: 'point', face: 'wow', k: 0.72 })
      + yin(230, 70, { face: 'happy', k: 0.55 })
      + glow(`<path d="M70 92 L286 148" stroke="#3D86D9" stroke-width="4"/>`)
      + talk(250, 64, '全跑到低的那头！', 230, 78);
  }

  function cup() {
    return `<g><rect x="-10" y="-6" width="20" height="24" rx="2" fill="#F7F4EF" stroke="${K.ink}"/><path d="M-6 2 L6 2 L4 14 L-4 14 Z" fill="#7FB6CF"/><path d="M10 0 Q16 6 12 14" fill="none" stroke="${K.ink}"/></g>`;
  }

  function h3(step) {
    if (step === 0) {
      return sky('#F6EFE4')
        + `<rect x="24" y="20" width="14" height="200" fill="#C8463A"/><rect x="302" y="20" width="14" height="200" fill="#C8463A"/>`
        + ground(210, '#C4A574')
        + `<path d="M148 48 Q150 70 168 78 L300 78 L312 168 L156 168 Q140 150 148 48 Z" fill="#E7D3B0" stroke="${K.ink}"/>`
        + `<circle cx="176" cy="110" r="4" fill="${K.ink}"/>` + lab(176, 100, '镐京', { fs: 13 })
        + `<path d="M200 90 L300 96 L300 150 L210 150 Z" fill="#E7B2A8" opacity=".7"/>`
        + `<path d="M300 86 L328 100 L328 160 L300 150 Z" fill="#7FB6CF"/>`
        + figure(100, 228, { k: 0.95, robe: '#C8664A', hat: 'mian', right: 'point', face: 'calm' })
        + glow(`<path d="M200 90 L300 96 L300 150 L210 150 Z" fill="#E7B2A8" opacity=".55"/>`)
        + talk(160, 70, '地这么大！', 120, 150);
    }
    if (step === 1) {
      return sky('#EAF3F5')
        + `<path d="M40 200 Q120 160 180 120 T300 70" fill="none" stroke="#C4A574" stroke-width="16" stroke-linecap="round"/>`
        + mountain(250, 90, 90, 50, { c: '#B49A7C' })
        + S.oxCart(150, 150, 1.1)
        + yin(270, 200, { face: 'worry', arm: 'hold', k: 0.75 })
        + `<g transform="translate(292 168)"><rect x="-8" y="-16" width="16" height="26" rx="2" fill="#2B2622"/><rect x="-6" y="-13" width="12" height="18" fill="#F7F4EF"/><text x="0" y="-2" font-size="8" fill="#C8463A" text-anchor="middle">无信号</text><path d="M-4 4 L4 -4 M-4 -4 L4 4" stroke="#C8463A" stroke-width="1.2"/></g>`
        + glow(`<text x="292" y="158" font-size="13" font-weight="800" fill="#C8463A" text-anchor="middle">无信号</text>`)
        + talk(180, 120, '没信号，也没路', 250, 160);
    }
    if (step === 2) {
      return sky('#F7E7C8')
        + `<path d="M0 190 Q80 170 160 180 T340 160" fill="none" stroke="#C4A574" stroke-width="18"/>`
        + S.horseRider(170, 188, 1.15)
        + [40, 110, 200].map(function (x, i) { return i % 2 ? `<circle cx="${x}" cy="36" r="12" fill="#F7F4EF" stroke="${K.ink}"/>` : `<circle cx="${x}" cy="40" r="14" fill="#F2B640" stroke="${K.ink}"/>`; }).join('')
        + `<rect x="250" y="150" width="54" height="28" rx="3" fill="#E7D3B0" stroke="${K.ink}"/>`
        + glow(lab(277, 170, '30 天', { fs: 16 }))
        + talk(120, 120, '还没到……', 150, 150);
    }
    return sky('#F6EFE4')
      + `<rect x="24" y="20" width="14" height="200" fill="#C8463A"/><rect x="302" y="20" width="14" height="200" fill="#C8463A"/>`
      + ground(210, '#C4A574')
      + `<path d="M148 48 Q150 70 168 78 L300 78 L312 168 L156 168 Q140 150 148 48 Z" fill="#E7D3B0" stroke="${K.ink}"/>`
      + `<path d="M230 100 L300 108 L300 150 L236 146 Z" fill="#E7B2A8"/>`
      + [240, 258, 276, 294].map(function (x) { return `<path d="M${x} 118 L${x} 100 L${x + 10} 106 L${x} 112" fill="#2B2622"/>`; }).join('')
      + figure(96, 228, { k: 0.95, robe: '#C8664A', hat: 'mian', face: 'worry', right: 'hold' })
      + `<rect x="118" y="168" width="22" height="14" fill="#E7D3B0" stroke="${K.ink}" stroke-width=".7"/>`
      + yin(300, 70, { face: 'think', k: 0.55 })
      + glow([240, 258, 276, 294].map(function (x) { return `<path d="M${x} 118 L${x} 100 L${x + 10} 106 L${x} 112" fill="#2B2622"/>`; }).join(''))
      + talk(230, 48, '怎么管住几千里？', 290, 70);
  }

  function h4(step) {
    const ruler = `<rect x="16" y="108" width="308" height="28" rx="4" fill="#E7D3B0" stroke="${K.ink}"/>`
      + ['秦', '汉', '唐', '宋', '元', '明', '清'].map(function (t, i) {
        return lab(36 + i * 44, 127, t, { fs: 14 });
      }).join('');
    if (step === 0) {
      return sky('#F6EFE4')
        + `<path d="M0 36 Q170 8 340 36 L340 52 Q170 28 0 52 Z" fill="#2B2622"/>`
        + `<rect x="130" y="40" width="190" height="130" rx="4" fill="#F3E7D3" stroke="${K.ink}"/>`
        + `<path d="M150 70 L200 90 L250 68 L300 96 L290 140 L160 146 Z" fill="#2B2622" opacity=".85"/>`
        + S.flag(210, 120, '#2B2622', { ch: '秦', fs: 9 })
        + figure(78, 230, { k: 1, robe: '#2B2622', trim: '#C8463A', hat: 'mian', right: 'point' })
        + glow(`<path d="M150 70 L200 90 L250 68 L300 96 L290 140 L160 146 Z" fill="#2B2622" opacity=".35"/>`)
        + talk(150, 80, '天下归一！', 100, 150);
    }
    if (step === 1) {
      return sky('#FBF6EE') + ruler
        + glow(`<rect x="18" y="110" width="8" height="24" fill="#F2B640"/>`)
        + figure(48, 100, { k: 0.45, robe: '#2B2622', trim: '#C8463A', hat: 'mian' })
        + yin(270, 210, { face: 'wow', k: 0.7 })
        + talk(200, 180, '才 15 年？', 250, 190);
    }
    if (step === 2) {
      const hats = ['guan', 'wusha', 'wusha', 'wusha', 'bun'];
      const xs = [90, 140, 190, 250, 300];
      return sky('#FBF6EE') + ruler
        + glow(`<path d="M28 108 L320 108" stroke="#C8463A" stroke-width="3"/>`)
        + xs.map(function (x, i) { return figure(x, 188, { k: 0.35, hat: hats[i], robe: '#8E3F33', right: 'hold' }) + S.seal(x + 10, 150); }).join('')
        + lab(180, 70, '两千多年', { fs: 16 });
    }
    return sky('#FBF6EE') + ruler
      + `<path d="M28 122 L90 122" stroke="#C8463A" stroke-width="3"/>`
      + S.magnifier(120, 130, 1.3)
      + glow(`<g transform="translate(92 108)"><rect x="-16" y="-10" width="40" height="28" fill="#E7D3B0" stroke="${K.ink}"/><text x="4" y="8" font-size="13" font-weight="800" text-anchor="middle">？？制</text></g>`)
      + yin(250, 200, { face: 'think', arm: 'point', k: 0.75 })
      + talk(250, 120, '是什么制度？', 200, 150);
  }

  function h5(step) {
    if (step === 0) {
      return sky('#F6EFE4')
        + `<path d="M30 160 Q40 140 180 148 L200 210 L36 220 Z" fill="#C46A4A" stroke="${K.ink}"/>`
        + `<rect x="250" y="40" width="8" height="150" fill="#7A5A3A"/><ellipse cx="250" cy="36" rx="16" ry="8" fill="#F2B640" stroke="${K.ink}"/>`
        + kid(120, 214, { pose: 'sit', face: 'happy', prop: 'phone', k: 0.7 })
        + `<g transform="translate(210 24) scale(1.15)">${S.phone(0, 0).replace('3.00%', '+2.00%').replace('7 日年化', '年收益')}</g>`
        + glow(lab(256, 78, '+2.00%', { fs: 16, c: '#3FA772', stroke: '#FFF8EA' }))
        + talk(120, 120, '赚了 2%！', 130, 160);
    }
    if (step === 1) {
      return sky('#F7F4EF')
        + [0, 1, 2].map(function (r) { return `<rect x="24" y="${30 + r * 48}" width="150" height="40" fill="#E7D3B0" stroke="${K.ink}" stroke-width=".7"/>`; }).join('')
        + `<rect x="36" y="40" width="18" height="24" fill="#F7F4EF" stroke="${K.ink}" stroke-width=".6"/>`
        + `<rect x="70" y="96" width="28" height="18" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".6"/>`
        + glow(`<g><text x="40" y="168" font-size="14" fill="#8A8178" text-decoration="line-through">10.00</text><text x="100" y="172" font-size="16" font-weight="800" fill="#C8463A">10.30</text><text x="150" y="160" font-size="14" font-weight="800" fill="#C8463A">+3%</text></g>`)
        + kid(260, 236, { pose: 'hold', face: 'worry', prop: 'basket', k: 0.72 })
        + talk(250, 140, '东西贵了 3%', 240, 180);
    }
    if (step === 2) {
      return sky('#FBF6EE')
        + S.scale(172, 200, 8)
        + S.stack(100, 150, 3)
        + lab(100, 118, '收益 +2%', { fs: 13 })
        + S.riceBag(230, 168)
        + lab(236, 118, '物价 +3%', { fs: 13 })
        + yin(50, 80, { face: 'wow', k: 0.6 })
        + glow(lab(236, 118, '物价 +3%', { fs: 13 }))
        + talk(80, 50, '钱反而变少了？', 60, 80);
    }
    return sky('#F6EFE4')
      + kid(172, 236, { pose: 'hold', face: 'worry', k: 0.8 })
      + `<g transform="translate(28 70) scale(.62)">${S.product(0, 0, '产品甲', '1%', '3 个月', '#3D86D9')}</g>`
      + `<g transform="translate(200 70) scale(.62)">${S.product(0, 0, '产品乙', '3%', '1 年', '#E07A3D')}</g>`
      + glow(`<text x="172" y="48" font-size="28" font-weight="800" fill="${K.ink}" text-anchor="middle">? ? ?</text>`)
      + talk(172, 64, '这俩怎么比？', 172, 100);
  }

  function reg(name, fn) { S.register(name, function (st) { return fn(st.step || 0); }); }
  reg('hook.d03geo', h1);
  reg('hook.d04geo', h2);
  reg('hook.d02history', h3);
  reg('hook.d04history', h4);
  reg('hook.d09finance', h5);

  function hook6g(step) {
    if (step === 0) {
      return sky('#C9D6DE') + S.cliff(20, 20, 90, 200) + S.cliff(230, 20, 90, 200)
        + `<path d="M70 80 C120 140 200 100 270 180" fill="none" stroke="#fff" stroke-width="14"/>`
        + S.rowboat(170, 176, 0.8)
        + kid(168, 174, { pose: 'hold', face: 'wow', k: 0.55 })
        + glow(S.rowboat(170, 176, 0.8))
        + talk(200, 120, '好急！', 170, 150);
    }
    if (step === 1) {
      return sky('#F7C98A') + `<rect y="120" width="340" height="90" fill="#7FB6CF"/>`
        + `<path d="M0 150 Q40 140 80 150 T160 150 T240 150 T320 150" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2"/>`
        + mountain(60, 120, 100, 36, { c: '#C9A27E' })
        + kid(90, 230, { pose: 'stand', face: 'happy', k: 0.75 })
        + glow(`<rect y="120" width="340" height="40" fill="#7FB6CF" opacity=".01"/>` + `<path d="M0 150 Q80 142 160 150 T320 150" stroke="#fff" stroke-width="3" fill="none"/>`)
        + talk(160, 90, '好平啊', 110, 150);
    }
    if (step === 2) {
      return sky('#EFE6D6')
        + `<rect x="40" y="30" width="250" height="150" fill="#C4A574" stroke="${K.ink}"/>`
        + `<rect x="60" y="48" width="90" height="64" fill="#C9D6DE" stroke="${K.ink}"/>`
        + `<rect x="170" y="48" width="90" height="64" fill="#F7C98A" stroke="${K.ink}"/>`
        + kid(250, 240, { pose: 'point', face: 'think', flip: true, k: 0.7 })
        + glow(`<rect x="60" y="48" width="90" height="64" fill="none" stroke="#F2B640" stroke-width="3"/>`)
        + talk(140, 200, '同一条河？', 200, 190);
    }
    const P = proj({ s: 3.2, dx: 40, dy: 36 });
    return sky('#FBF6EE')
      + `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8" stroke="#8C7B6B"/>`
      + glow(`<path d="${pathOf(CN.yangtze.slice(0, 6), P)}" stroke="#C8463A" stroke-width="4" fill="none"/>`
        + `<path d="${pathOf(CN.yangtze.slice(5, 11), P)}" stroke="#E2B43A" stroke-width="4" fill="none"/>`
        + `<path d="${pathOf(CN.yangtze.slice(10), P)}" stroke="#3FA772" stroke-width="4" fill="none"/>`)
      + lab(80, 40, '上游', { fs: 13 }) + lab(160, 40, '中游', { fs: 13 }) + lab(250, 40, '下游', { fs: 13 })
      + `<g transform="translate(236 70)"><circle cx="0" cy="0" r="7" fill="none" stroke="${K.ink}" stroke-width="2"/><circle cx="16" cy="0" r="7" fill="none" stroke="${K.ink}" stroke-width="2"/><path d="M6 0 L10 0 M-8 6 L-16 16 M24 6 L32 16" stroke="${K.ink}" stroke-width="2"/></g>`
      + yin(300, 210, { face: 'happy', arm: 'hold', k: 0.6 })
      + talk(230, 200, '切成三段看', 280, 190);
  }

  function hook6h(step) {
    const names = ['三国', '西晋', '东晋', '十六国', '南朝', '北朝'];
    if (step === 0) {
      const row = names.map(function (n, i) {
        return figure(36 + i * 42, 180, { k: 0.42, hat: 'guan', robe: '#8E3F33' }) + lab(36 + i * 42, 200, n, { fs: 13 });
      }).join('');
      return sky('#FBF6EE') + row
        + kid(300, 230, { pose: 'hold', face: 'wow', k: 0.6 })
        + glow(names.map(function (n, i) { return lab(36 + i * 42, 200, n, { fs: 13 }); }).join(''))
        + talk(250, 80, '这么多？', 290, 150);
    }
    if (step === 1) {
      return sky('#F6EFE4') + names.map(function (n, i) {
        const x = 40 + (i * 47) % 200, y = 90 + (i % 3) * 40;
        return figure(x, y, { k: 0.36, hat: 'helmet', robe: '#7A5A44' }) + lab(x, y + 14, n, { fs: 11 });
      }).join('') + kid(280, 230, { pose: 'stand', face: 'dizzy', k: 0.7 })
        + glow(kid(280, 230, { pose: 'stand', face: 'dizzy', k: 0.7 }))
        + talk(200, 50, '我晕了', 260, 140);
    }
    if (step === 2) {
      const P = proj({ s: 3.4, dx: 50, dy: 30 });
      let bits = '';
      [[150, 70, '#C8463A'], [190, 60, '#3D86D9'], [170, 100, '#E2B43A'], [220, 80, '#7C6BD6'], [140, 110, '#3FA772'], [200, 120, '#E07A3D'], [240, 100, '#8FA7C9'], [160, 140, '#C4A574']].forEach(function (b) {
        bits += `<circle cx="${b[0]}" cy="${b[1]}" r="16" fill="${b[2]}" opacity=".85"/>`;
      });
      return sky('#EAF3F5') + `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8" stroke="#8C7B6B"/>` + bits
        + `<path d="M120 160 L300 170 L280 200 L100 190 Z" fill="#9FBF74" opacity=".8"/>`
        + yin(40, 210, { face: 'wow', arm: 'point', k: 0.65 })
        + glow(bits)
        + talk(120, 40, '它本来就乱', 70, 170);
    }
    return sky('#FBF6EE')
      + `<rect x="20" y="90" width="300" height="36" rx="4" fill="#E7D3B0" stroke="${K.ink}"/>`
      + `<rect x="24" y="94" width="70" height="28" fill="#C8463A"/><rect x="96" y="94" width="80" height="28" fill="#3D86D9"/><rect x="178" y="94" width="60" height="28" fill="#E2B43A"/><rect x="240" y="94" width="76" height="28" fill="#3FA772"/>`
      + glow(lab(170, 70, '220          589', { fs: 16 }))
      + yin(300, 210, { face: 'think', arm: 'point', k: 0.65 })
      + talk(160, 180, '整整 370 年', 270, 180);
  }

  function hook6f(step) {
    if (step === 0) {
      return sky('#FBF6EE')
        + S.piggy(90, 140, 1.1) + S.piggy(230, 140, 1.1)
        + lab(90, 170, '1000 元 · 10%', { fs: 13 }) + lab(230, 170, '1000 元 · 10%', { fs: 13 })
        + kid(40, 230, { hair: 'short', top: '#8FA7C9', glasses: true, pose: 'stand', face: 'calm', k: 0.62 })
        + kid(280, 230, { pose: 'stand', face: 'happy', k: 0.62 })
        + glow(S.piggy(90, 140, 1.1))
        + talk(120, 70, '一样的罐子', 90, 110);
    }
    if (step === 1) {
      return sky('#FBF6EE')
        + S.piggy(90, 150, 1) + S.piggy(240, 150, 1)
        + S.coin(70, 100, 8) + S.coin(250, 90, 8)
        + `<path d="M100 120 Q60 80 70 100" fill="none" stroke="${K.ink}" stroke-dasharray="3 2"/>`
        + `<path d="M230 110 Q250 70 250 90" fill="none" stroke="${K.ink}" stroke-dasharray="3 2"/>`
        + kid(40, 230, { hair: 'short', top: '#8FA7C9', glasses: true, k: 0.55, pose: 'hold' })
        + kid(300, 230, { k: 0.55, pose: 'point', face: 'happy' })
        + glow(S.coin(250, 90, 8))
        + talk(100, 50, '利息拿走花', 80, 100)
        + talk(250, 40, '利息放回去', 240, 80);
    }
    if (step === 2) {
      return sky('#F6EFE4')
        + lab(170, 36, '20 年后', { fs: 16 })
        + S.piggy(80, 150, 1) + lab(80, 180, '3000', { fs: 16 })
        + glow(S.piggy(230, 150, 1.7))
        + lab(230, 200, '6700 多', { fs: 16 })
        + kid(40, 236, { hair: 'short', top: '#8FA7C9', glasses: true, face: 'wow', k: 0.55 })
        + kid(300, 236, { face: 'wow', k: 0.55 });
    }
    return sky('#FBF6EE')
      + S.piggy(180, 160, 1.4)
      + S.magnifier(150, 120, 1.4)
      + glow(`<g transform="translate(168 130)">${S.coin(0, 0, 10)}${S.coin(16, 6, 5)}</g>`)
      + yin(60, 180, { face: 'wow', arm: 'point', k: 0.7 })
      + talk(90, 80, '利息生利息', 80, 140);
  }

  function hook6p(step) {
    if (step === 0) {
      let rain = '';
      for (let i = 0; i < 8; i++) rain += `<path d="M${24 + i * 40} 16 l-10 22" stroke="#9BB6C8" stroke-width="2" stroke-linecap="round"/>`;
      return sky('#1E3344')
        + `<rect x="250" y="24" width="64" height="46" fill="#7FB6CF" opacity=".45"/>`
        + rain
        + `<rect y="168" width="340" height="92" fill="#2A241E"/>`
        + S.bed(70, 176, 150)
        + kid(140, 214, { pose: 'sit', face: 'sad', k: 0.62 })
        + glow(kid(140, 214, { pose: 'sit', face: 'sad', k: 0.62 }))
        + talk(220, 80, '好难受……', 150, 150);
    }
    if (step === 1) {
      return sky('#FBF6EE')
        + `<ellipse cx="170" cy="70" rx="90" ry="40" fill="#fff" stroke="${K.ink}"/>`
        + ['恐惧', '厌恶', '悲伤'].map(function (t, i) {
          const x = 100 + i * 48, y = 52;
          return `<path d="M${x - 16} ${y} L${x - 18} ${y + 24} Q${x} ${y + 30} ${x + 18} ${y + 24} L${x + 16} ${y} Z" fill="rgba(214,232,240,.85)" stroke="${K.ink}"/><rect x="${x - 14}" y="${y - 6}" width="28" height="8" rx="2" fill="#D5E8F0" stroke="${K.ink}"/><text x="${x}" y="${y + 16}" font-size="11" font-weight="800" text-anchor="middle">${t}</text>`;
        }).join('')
        + `<path d="M200 100 Q230 120 246 140" fill="none" stroke="${K.ink}" stroke-width="1.6" stroke-dasharray="4 3"/>`
        + S.trashCan(250, 168)
        + kid(80, 240, { face: 'think', pose: 'hold', k: 0.65 })
        + glow(S.trashCan(250, 150))
        + talk(120, 180, '全扔掉多好', 100, 190);
    }
    if (step === 2) {
      return sky('#F6EFE4')
        + S.album(120, 70)
        + `<rect x="132" y="82" width="22" height="16" fill="#E07A3D"/>`
        + yin(60, 180, { face: 'happy', arm: 'hold', k: 0.75 })
        + glow(S.album(120, 70))
        + talk(140, 50, '看看祖先', 90, 140);
    }
    return sky('#C9D6A4')
      + S.snake(180, 140, 1.6)
      + figure(120, 200, { k: 0.7, robe: '#8A6F57', face: 'wow', right: 'up' })
      + kid(280, 230, { face: 'think', k: 0.55 })
      + glow(S.snake(180, 140, 1.6))
      + talk(240, 80, '怕，救了他？', 260, 160);
  }

  function hook6s(step) {
    const camelA = { top: '#E7D3B0', bottom: '#5C4636', hair: 'long' };
    if (step === 0) {
      return sky('#EAF3F5') + ground(200, '#C9B59A')
        + kid(90, 230, Object.assign({ pose: 'stand', face: 'calm', k: 0.75 }, camelA))
        + kid(230, 230, { top: '#C49A6C', bottom: '#C49A6C', pose: 'stand', face: 'calm', k: 0.75 })
        + yin(300, 80, { face: 'think', k: 0.5 })
        + glow(kid(230, 230, { top: '#C49A6C', bottom: '#C49A6C', k: 0.75 }))
        + talk(280, 50, '都是驼色？', 300, 70);
    }
    if (step === 1) {
      return sky('#F6EFE4')
        + `<rect x="150" y="20" width="160" height="200" rx="6" fill="#E7F2F6" stroke="#C4A574" stroke-width="6"/>`
        + kid(80, 230, { top: '#C49A6C', bottom: '#C49A6C', face: 'worry', k: 0.8 })
        + `<g transform="translate(230 150) scale(.7)" opacity=".85"><ellipse cx="0" cy="0" rx="40" ry="24" fill="#E2CF7E" stroke="${K.ink}"/></g>`
        + glow(`<ellipse cx="230" cy="150" rx="28" ry="16" fill="#E2CF7E" opacity=".5"/>`)
        + talk(90, 80, '我像面包？', 100, 140);
    }
    if (step === 2) {
      return sky('#FBF6EE')
        + yin(60, 180, { face: 'happy', arm: 'hold', k: 0.7 })
        + `<g transform="translate(140 40)">${S.phone(0, 0)}</g>`
        + glow(`<rect x="150" y="70" width="70" height="90" fill="#D9D3CB"/>`)
        + talk(80, 70, '黑白一看就懂', 120, 120);
    }
    return sky('#F7F4EF')
      + `<rect x="30" y="40" width="120" height="150" fill="#E7E0D6" stroke="${K.ink}"/>`
      + `<rect x="48" y="70" width="80" height="28" fill="#C9B59A"/><rect x="48" y="104" width="80" height="36" fill="#6E655C"/><rect x="48" y="146" width="80" height="16" fill="#F7F4EF"/>`
      + `<rect x="180" y="40" width="120" height="150" fill="#D9D3CB" stroke="${K.ink}"/>`
      + glow(`<rect x="200" y="80" width="80" height="70" fill="#A89880"/>`)
      + talk(170, 210, '差在哪？', 170, 220);
  }

  function hook7(step) {
    if (step === 0) {
      return sky('#FBF6EE')
        + `<rect x="20" y="110" width="300" height="16" rx="4" fill="#E7D3B0" stroke="${K.ink}"/>`
        + lab(170, 100, '公元元年', { fs: 14 })
        + lab(50, 150, '前 221 秦统一', { fs: 13 })
        + lab(270, 150, '220 东汉亡', { fs: 13 })
        + figure(48, 210, { k: 0.45, robe: '#2B2622', hat: 'mian', trim: '#C8463A' })
        + kid(250, 230, { face: 'think', k: 0.65 })
        + glow(lab(170, 100, '公元元年', { fs: 14 }))
        + talk(200, 50, '相加还是相减？', 230, 150);
    }
    if (step === 1) {
      return sky('#FBF6EE')
        + S.jar(60, 80, 4, '1000') + S.jar(150, 70, 6, '1100') + S.jar(250, 60, 8, '1210')
        + glow(S.jar(250, 60, 8, '1210'))
        + talk(180, 40, '利息生利息', 200, 70);
    }
    if (step === 2) {
      return sky('#C9D6DE')
        + S.ropeBridge(30, 80, 310, 90)
        + kid(150, 150, { face: 'worry', k: 0.5 })
        + kid(190, 156, { hair: 'short', top: '#8FA7C9', glasses: true, face: 'worry', k: 0.5 })
        + `<path d="M210 120 L230 110 L226 128" fill="none" stroke="#C8463A" stroke-width="1.5"/>`
        + glow(S.ropeBridge(30, 80, 310, 90))
        + talk(240, 50, '心跳好快', 200, 110);
    }
    return sky('#FBF6EE')
      + yin(80, 180, { face: 'happy', arm: 'hold', k: 0.8 })
      + glow(S.badge(190, 120, '第 1 周'))
      + S.star(170, 150, 6, '#F2B640') + S.star(190, 156, 6, '#F2B640') + S.star(210, 150, 6, '#F2B640')
      + talk(200, 50, '三题全对拿走！', 160, 90);
  }

  function hook8g(step) {
    if (step === 0) {
      let rain = '';
      for (let i = 0; i < 7; i++) rain += `<path d="M${30 + i * 46} 16 l-12 28" stroke="#7FB6CF" stroke-width="2.4" stroke-linecap="round"/>`;
      return sky('#B7D4E8') + rain + ground(180, '#9AA8B0')
        + S.thermo(36, 168, 0.85, '')
        + lab(78, 96, '32°C', { fs: 16 })
        + lab(286, 40, '7 月', { fs: 14 })
        + `<path d="M150 118 Q188 86 226 118 L188 118 Z" fill="#C8463A" stroke="${K.ink}"/>`
        + `<path d="M188 118 L188 168" stroke="${K.ink}" stroke-width="2.2"/>`
        + kid(168, 236, { pose: 'hold', face: 'worry', k: 0.7 })
        + `<path d="M148 168 q3 7 0 9" fill="none" stroke="#7FB6CF" stroke-width="2"/>`
        + glow(`<path d="M150 118 Q188 86 226 118 L188 118 Z" fill="#E07A3D" stroke="${K.ink}"/>`)
        + talk(250, 150, '又热又下雨', 190, 170);
    }
    if (step === 1) {
      return sky('#D5DDEA') + ground(180, '#C9B59A')
        + tree(40, 180, 1.4) 
        + S.thermo(40, 160, 0.2, '')
        + lab(80, 100, '−5°C', { fs: 16 })
        + lab(250, 40, '1 月', { fs: 14 })
        + kid(160, 230, { top: '#8FA7C9', bottom: '#3A302A', face: 'worry', k: 0.72 })
        + glow(lab(80, 100, '−5°C', { fs: 16 }))
        + talk(220, 120, '冷，还不下雨', 180, 160);
    }
    if (step === 2) {
      let pages = '';
      for (let i = 0; i < 12; i++) {
        const x = 14 + i * 26;
        const summer = i >= 5 && i <= 7;
        pages += `<rect x="${x}" y="70" width="24" height="70" fill="#fff" stroke="${K.ink}" stroke-width=".6"/>`
          + `<text x="${x + 12}" y="84" font-size="10" font-weight="800" text-anchor="middle" fill="${K.ink}">${i + 1}</text>`
          + (summer
            ? `<circle cx="${x + 8}" cy="100" r="6" fill="#F2B640" stroke="${K.ink}" stroke-width=".5"/><path d="M${x + 16} 108 q4 6 0 10 q-4 -2 0 -10" fill="#3D86D9"/>`
            : `<circle cx="${x + 12}" cy="108" r="3" fill="#E7D3B0"/>`);
      }
      return sky('#FBF6EE') + pages
        + glow(`<rect x="142" y="64" width="82" height="82" fill="none" stroke="#F2B640" stroke-width="3"/>`)
        + kid(250, 240, { pose: 'point', face: 'think', k: 0.55 })
        + talk(200, 30, '雨跟着热来？', 230, 90);
    }
    return sky('#EAF3F5')
      + `<rect y="176" width="200" height="84" fill="#E2CF7E"/>`
      + `<rect x="190" y="150" width="150" height="110" fill="#7FB6CF"/>`
      + yin(118, 148, { face: 'happy', k: 1.05 })
      + `<path d="M88 158 Q68 176 52 194" fill="none" stroke="#5E4EAE" stroke-width="7" stroke-linecap="round"/>`
      + `<circle cx="48" cy="198" r="5" fill="#F4D3B5" stroke="${K.ink}"/>`
      + `<path d="M24 210 Q40 186 58 210 Z" fill="#C4A574" stroke="${K.ink}"/><circle cx="36" cy="202" r="1.4" fill="#8A6F57"/><circle cx="46" cy="198" r="1.4" fill="#8A6F57"/>`
      + `<path d="M148 158 Q172 150 196 138" fill="none" stroke="#5E4EAE" stroke-width="7" stroke-linecap="round"/>`
      + `<circle cx="200" cy="134" r="5" fill="#F4D3B5" stroke="${K.ink}"/>`
      + `<path d="M186 128 L214 128 L208 108 L192 108 Z" fill="#C5D8E4" stroke="${K.ink}"/>`
      + `<ellipse cx="200" cy="118" rx="9" ry="3.5" fill="#7FB6CF"/>`
      + glow(`<path d="M24 210 Q40 186 58 210 Z" fill="#C4A574" stroke="${K.ink}"/>`
        + `<path d="M186 128 L214 128 L208 108 L192 108 Z" fill="#C5D8E4" stroke="${K.ink}"/>`)
      + talk(250, 46, '秘密在这儿', 200, 100);
  }

  function hook8h(step) {
    if (step === 0) {
      return sky('#FBF6EE')
        + `<rect x="30" y="80" width="40" height="70" fill="#F3E7D3" stroke="${K.ink}"/>` + lab(50, 120, '秦 15 年', { fs: 12 })
        + `<rect x="100" y="40" width="160" height="110" fill="#E7D3B0" stroke="${K.ink}"/>` + lab(180, 100, '汉约 400 年', { fs: 14 })
        + kid(280, 230, { pose: 'sit', face: 'calm', k: 0.6 })
        + glow(`<rect x="30" y="80" width="40" height="70" fill="none" stroke="#F2B640" stroke-width="3"/>`)
        + talk(200, 30, '秦短汉长', 160, 50);
    }
    if (step === 1) {
      return sky('#FBF6EE')
        + `<rect x="30" y="40" width="40" height="50" fill="#F3E7D3" stroke="${K.ink}"/>` + lab(50, 70, '秦 15 年', { fs: 11 })
        + `<rect x="90" y="20" width="150" height="70" fill="#E7D3B0" stroke="${K.ink}"/>` + lab(165, 60, '汉约 400 年', { fs: 13 })
        + `<rect x="30" y="140" width="55" height="60" fill="#F3E7D3" stroke="${K.ink}"/>` + lab(57, 174, '隋 37 年', { fs: 12 })
        + `<rect x="110" y="120" width="140" height="80" fill="#E7D3B0" stroke="${K.ink}"/>` + lab(180, 165, '唐近 300 年', { fs: 13 })
        + glow(`<rect x="30" y="140" width="55" height="60" fill="none" stroke="#F2B640" stroke-width="3"/>`)
        + talk(250, 40, '又一组', 80, 130);
    }
    if (step === 2) {
      return sky('#FBF6EE')
        + `<rect x="40" y="40" width="50" height="60" fill="#F3E7D3" stroke="${K.ink}"/><rect x="110" y="30" width="140" height="70" fill="#E7D3B0" stroke="${K.ink}"/>`
        + `<rect x="40" y="130" width="60" height="50" fill="#F3E7D3" stroke="${K.ink}"/><rect x="120" y="120" width="130" height="60" fill="#E7D3B0" stroke="${K.ink}"/>`
        + kid(280, 230, { pose: 'hold', face: 'think', k: 0.7 })
        + glow(kid(280, 230, { pose: 'hold', face: 'think', k: 0.7 }))
        + talk(200, 20, '好眼熟……', 250, 140);
    }
    return sky('#FBF6EE')
      + `<rect x="70" y="70" width="46" height="80" fill="#F3E7D3" stroke="${K.ink}"/>`
      + `<rect x="150" y="40" width="150" height="110" fill="#E7D3B0" stroke="${K.ink}"/>`
      + glow(`<rect x="66" y="66" width="54" height="88" fill="none" stroke="#F2B640" stroke-width="3"/><rect x="146" y="36" width="158" height="118" fill="none" stroke="#F2B640" stroke-width="3"/>`)
      + yin(40, 200, { face: 'happy', arm: 'point', k: 0.65 })
      + talk(200, 180, '短的接长的！', 80, 180);
  }

  function hook8f(step) {
    if (step === 0) {
      return sky('#FBF6EE') + S.bankbook(40, 40)
        + kid(200, 220, { face: 'happy', k: 0.7 })
        + glow(lab(78, 100, '10000.00', { fs: 14 }))
        + talk(220, 80, '一分没少', 180, 140);
    }
    if (step === 1) {
      let bowls = '';
      for (let i = 0; i < 6; i++) bowls += S.bowl(40 + i * 28, 150 - (i % 2) * 8, 'noodle');
      return sky('#F6EFE4') + bowls + lab(180, 50, '面 20 元', { fs: 16 }) + lab(180, 80, '500 碗', { fs: 16 }) + lab(260, 40, '去年', { fs: 14 })
        + glow(lab(180, 80, '500 碗', { fs: 16 }));
    }
    if (step === 2) {
      let bowls = '';
      for (let i = 0; i < 4; i++) bowls += S.bowl(50 + i * 36, 160, 'noodle');
      return sky('#F6EFE4') + bowls + lab(200, 50, '面 20.6 元', { fs: 16 }) + glow(lab(200, 90, '485 碗', { fs: 16 })) + lab(280, 40, '今年', { fs: 14 })
        + kid(280, 230, { face: 'wow', k: 0.6 })
        + talk(120, 30, '少了 15 碗！', 200, 80);
    }
    return sky('#FBF6EE') + S.bankbook(30, 50)
      + `<rect x="160" y="80" width="120" height="70" fill="none" stroke="#C9B59A" stroke-dasharray="4 3"/>`
      + glow(`<g transform="translate(175 90) scale(.8)">${S.bill(0, 0)}${S.bill(30, 16)}</g>`)
      + yin(40, 210, { face: 'think', arm: 'hold', k: 0.65 })
      + talk(200, 40, '钱在缩水', 160, 80);
  }

  function hook8p(step) {
    if (step === 0) {
      return sky('#2A2438')
        + `<rect x="180" y="40" width="140" height="160" fill="#1E3344"/>`
        + S.piano(230, 140, 0.8)
        + kid(80, 210, { pose: 'stand', face: 'calm', k: 0.7 })
        + `<ellipse cx="84" cy="128" rx="5" ry="4" fill="#E07A7A" stroke="${K.ink}" stroke-width=".6"/>`
        + `<path d="M70 118 Q84 108 96 120" fill="none" stroke="${K.ink}" stroke-width="1.2"/>`
        + glow(kid(80, 210, { pose: 'stand', face: 'calm', k: 0.7 }))
        + talk(140, 70, '一点不紧张', 90, 140);
    }
    if (step === 1) {
      return sky('#F6EFE4') + S.piano(120, 150, 1.2)
        + `<text x="40" y="80" font-size="20" fill="#C8463A">♪ ✕</text><text x="240" y="70" font-size="20" fill="#C8463A">♪ ✕</text>`
        + lab(170, 210, '观众皱眉', { fs: 13 })
        + glow(`<text x="200" y="50" font-size="16" font-weight="800" fill="#C8463A">又弹错了</text>`)
        + talk(80, 40, '又弹错了！', 140, 80);
    }
    if (step === 2) {
      return sky('#FBF6EE') + S.piano(120, 160, 1.1)
        + kid(70, 200, { face: 'worry', pose: 'hold', k: 0.6 })
        + `<text x="200" y="70" font-size="22" fill="#F2B640">♪ ♪</text>`
        + lab(250, 200, '鼓掌', { fs: 14 })
        + glow(`<text x="210" y="80" font-size="22" fill="#F2B640">♪</text>`)
        + talk(80, 50, '有点紧张……', 90, 120);
    }
    return sky('#FBF6EE') + S.chalkboard(40, 30, 200, 120)
      + `<path d="M70 120 Q120 40 170 90 Q210 130 230 100" fill="none" stroke="#F7F4EF" stroke-width="3"/>`
      + lab(80, 140, '第 1 次', { fs: 13, c: '#fff', stroke: '#2F6B4F' })
      + lab(160, 70, '第 2 次', { fs: 13, c: '#fff', stroke: '#2F6B4F' })
      + yin(280, 180, { face: 'happy', arm: 'point', k: 0.65 })
      + glow(`<path d="M70 120 Q120 40 170 90" fill="none" stroke="#F2B640" stroke-width="3"/>`)
      + talk(250, 40, '不多不少最好', 220, 80);
  }

  function hook8s(step) {
    if (step === 0) {
      return sky('#F7E7C8') + ground(190, '#C4A574')
        + tree(60, 190, 2.2) + tree(140, 200, 1.6)
        + `<circle cx="70" cy="120" r="10" fill="#E2B43A"/><circle cx="150" cy="140" r="8" fill="#E07A3D"/>`
        + kid(240, 230, { face: 'happy', k: 0.7 })
        + glow(`<circle cx="70" cy="120" r="10" fill="#E2B43A"/>`)
        + talk(240, 80, '好秋天', 230, 150);
    }
    if (step === 1) {
      return sky('#FBF6EE')
        + kid(150, 230, { top: '#E2B43A', bottom: '#E07A3D', face: 'happy', k: 0.9 })
        + `<path d="M128 150 Q150 138 172 152" stroke="#E7A04A" stroke-width="8" stroke-linecap="round"/>`
        + `<path d="M210 150 L228 150 L234 190 L204 190 Z" fill="#E07A3D" stroke="${K.ink}"/>`
        + `<path d="M210 150 Q222 138 234 150" fill="none" stroke="${K.ink}" stroke-width="1.4"/>`
        + glow(`<path d="M128 150 Q150 138 172 152" stroke="#E7A04A" stroke-width="8"/>`)
        + talk(250, 70, '我也来一套', 180, 130);
    }
    if (step === 2) {
      return sky('#F7E7C8') + tree(120, 200, 2.6)
        + kid(140, 230, { top: '#E2B43A', bottom: '#E07A3D', k: 0.75 })
        + yin(260, 160, { face: 'happy', arm: 'hold', k: 0.6 })
        + glow(kid(140, 230, { top: '#E2B43A', bottom: '#E07A3D', k: 0.75 }))
        + talk(260, 70, '融进去了！', 240, 120);
    }
    return sky('#FBF6EE') + S.colorWheel(150, 120, 70)
      + glow(`<path d="M150 120 L150 50 A70 70 0 0 1 210 120 Z" fill="#E2B43A" opacity=".85"/>`)
      + yin(280, 200, { face: 'point' === 'x' ? 'happy' : 'happy', arm: 'point', k: 0.65 })
      + talk(250, 40, '挨着的一家人', 200, 70);
  }

  function hook9g(step) {
    if (step === 0) {
      return sky('#D5DDEA')
        + `<rect x="210" y="28" width="96" height="72" fill="#E7F2F6" stroke="${K.ink}"/>`
        + S.snowflake(236, 52, 0.7) + S.snowflake(270, 70, 0.55) + S.snowflake(248, 84, 0.45)
        + S.radiator(48, 90)
        + S.bowl(86, 168, 'noodle')
        + kid(168, 228, { face: 'happy', pose: 'sit', k: 0.62 })
        + glow(S.bowl(86, 168, 'noodle'))
        + talk(250, 150, '面真香', 180, 170);
    }
    if (step === 1) {
      return sky('#F6EFE4')
        + `<rect x="200" y="30" width="90" height="70" fill="#C5D8E4" opacity=".6" stroke="${K.ink}"/>`
        + S.bowl(70, 168, 'rice')
        + kid(150, 220, { hair: 'short', top: '#8FA7C9', glasses: true, face: 'worry', k: 0.65 })
        + `<path d="M118 168 Q150 140 186 176 L176 200 L112 196 Z" fill="#C5D8E4" stroke="${K.ink}" opacity=".9"/>`
        + glow(S.bowl(70, 168, 'rice'))
        + talk(220, 140, '冷得发抖', 160, 160);
    }
    if (step === 2) {
      return sky('#FBF6EE')
        + S.bowl(80, 140, 'noodle') + S.bowl(220, 140, 'rice')
        + `<path d="M160 80 L160 180" stroke="${K.ink}" stroke-dasharray="4 3"/>`
        + yin(160, 200, { face: 'think', k: 0.55 })
        + glow(`<path d="M160 80 L160 180" stroke="#F2B640" stroke-width="2" stroke-dasharray="4 3"/>`)
        + talk(160, 40, '中间一条线', 160, 70);
    }
    const P = proj({ s: 3.5, dx: 36, dy: 30 });
    return sky('#EAF3F5')
      + `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8" stroke="#8C7B6B"/>`
      + glow(`<path d="${pathOf(CN.qinling, P)}" fill="none" stroke="#8A6F57" stroke-width="4"/>`
        + `<path d="${pathOf([[112, 33], [115, 33.2], [118, 33], [120, 33.4]], P)}" fill="none" stroke="#3D86D9" stroke-width="3"/>`)
      + yin(40, 210, { face: 'happy', arm: 'point', k: 0.65 })
      + talk(140, 30, '一座山一条河', 70, 160);
  }

  function hook9h(step) {
    if (step === 0) {
      return sky('#F7E7C8') + ground(196, '#C9B59A')
        + `<rect y="188" width="340" height="14" fill="#A89880"/>`
        + S.shop(40, 188, 64, '铺') + S.shop(250, 188, 70, '铺')
        + S.lantern(120, 70) + S.lantern(168, 58) + S.lantern(210, 74)
        + S.camel(150, 176, 1.05) + S.camel(210, 182, 0.85)
        + figure(70, 214, { k: 0.32, robe: '#8E3F33' }) + figure(100, 218, { k: 0.28 }) + figure(250, 216, { k: 0.3, robe: '#3D86D9' })
        + lab(250, 32, '开元 · 约 740 年', { fs: 14 })
        + kid(36, 236, { face: 'wow', k: 0.55 })
        + glow(S.camel(150, 176, 1.05))
        + talk(70, 80, '好热闹！', 50, 150);
    }
    if (step === 1) {
      return sky('#6E655C') + ground(196, '#4A3B30')
        + `<rect y="188" width="340" height="14" fill="#3A302A"/>`
        + `<path d="M30 188 L48 130 L90 188 Z" fill="#5C4636" stroke="${K.ink}"/><path d="M200 188 L230 110 L280 188 Z" fill="#2B2622" stroke="${K.ink}"/>`
        + `<path d="M48 130 L70 188 M230 110 L250 188" stroke="#2B2622" stroke-width="2"/>`
        + S.fire(120, 150, 1.2) + S.fire(240, 160, 0.8)
        + `<path d="M100 120 q8 -16 4 -28 M180 100 q6 -14 2 -24" fill="none" stroke="#6E655C" stroke-width="3"/>`
        + lab(250, 36, '755 年后', { fs: 14, c: '#fff', stroke: '#4A3B30' })
        + kid(40, 236, { face: 'worry', k: 0.5 })
        + glow(S.fire(120, 150, 1.2))
        + talk(160, 50, '怎么会这样？', 80, 140);
    }
    if (step === 2) {
      let steps = '';
      for (let i = 0; i < 5; i++) steps += `<rect x="${36 + i * 36}" y="${150 - i * 22}" width="40" height="${28 + i * 22}" fill="#C9B59A" stroke="${K.ink}" stroke-width=".6"/>`;
      return sky('#FBF6EE') + steps
        + `<g transform="translate(100 100) rotate(62) scale(1.35)"><path d="M-22 10 L-18 -16 L-8 0 L0 -26 L8 0 L18 -16 L22 10 Z" fill="#F2B640" stroke="${K.ink}"/><rect x="-22" y="10" width="44" height="8" fill="#E2B43A" stroke="${K.ink}"/><circle cx="-8" cy="-8" r="2.2" fill="#C8463A"/><circle cx="0" cy="-18" r="2.4" fill="#C8463A"/><circle cx="8" cy="-8" r="2.2" fill="#C8463A"/></g>`
        + `<path d="M196 36 Q160 70 124 110" fill="none" stroke="#C9B59A" stroke-width="2" stroke-dasharray="4 3"/>`
        + `<path d="M230 24 L270 8 L278 64 L232 78 Z" fill="rgba(74,59,48,.3)"/>`
        + glow(`<g transform="translate(100 100) rotate(62) scale(1.35)"><path d="M-22 10 L-18 -16 L0 -26 L18 -16 L22 10 Z" fill="#F2B640" stroke="${K.ink}"/></g>`)
        + talk(250, 160, '谁推的？', 250, 70);
    }
    const P = proj({ s: 3.3, dx: 40, dy: 36 });
    return sky('#EAF3F5')
      + `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8" stroke="#8C7B6B"/>`
      + S.fort(70, 90, 36, '#2B2622', { ch: '边' })
      + figure(110, 120, { k: 0.45, hat: 'helmet', robe: '#5C4636' })
      + yin(280, 200, { face: 'think', arm: 'point', k: 0.6 })
      + glow(figure(110, 120, { k: 0.45, hat: 'helmet', robe: '#5C4636' }))
      + talk(220, 40, '看边疆', 260, 150);
  }

  function hook9p(step) {
    if (step === 0) {
      return sky('#1E3344')
        + `<rect x="40" y="80" width="160" height="20" fill="#C4A574"/>`
        + kid(120, 200, { face: 'worry', pose: 'sit', k: 0.65 })
        + `<ellipse cx="124" cy="128" rx="5" ry="4" fill="#E07A7A"/>`
        + lab(250, 40, '22:00', { fs: 16, c: '#fff', stroke: '#1E3344' })
        + lab(250, 70, '第 1 周', { fs: 14, c: '#fff', stroke: '#1E3344' })
        + glow(lab(250, 70, '第 1 周', { fs: 14, c: '#fff', stroke: '#1E3344' }))
        + talk(80, 50, '好累', 110, 120);
    }
    if (step === 1) {
      let cups = '';
      for (let i = 0; i < 6; i++) cups += `<rect x="${40 + i * 18}" y="${120 - (i % 3) * 8}" width="14" height="16" rx="2" fill="#F7F4EF" stroke="${K.ink}" stroke-width=".6"/>`;
      return sky('#F6EFE4') + `<rect x="30" y="140" width="180" height="16" fill="#C4A574"/>` + cups
        + kid(220, 210, { face: 'calm', pose: 'point', k: 0.65 })
        + lab(260, 40, '第 3 周', { fs: 16 })
        + glow(cups)
        + talk(200, 70, '习惯了', 210, 130);
    }
    if (step === 2) {
      return sky('#F6EFE4') + S.bed(60, 140, 160)
        + kid(130, 168, { pose: 'sit', face: 'sad', k: 0.5 })
        + lab(250, 80, '38.5°C', { fs: 16 })
        + lab(250, 40, '第 5 周', { fs: 14 })
        + glow(lab(250, 80, '38.5°C', { fs: 16 }))
        + talk(80, 50, '怎么病了？', 120, 110);
    }
    return sky('#F6EFE4') + S.bed(40, 150, 140)
      + yin(230, 140, { face: 'worry', arm: 'hold', k: 0.7 })
      + glow(S.battery(200, 70, 0.25))
      + talk(200, 40, '真的适应了？', 230, 70);
  }

  function hook9s(step) {
    if (step === 0) {
      return sky('#FBF6EE')
        + `<rect x="40" y="80" width="90" height="60" fill="#C8463A" stroke="${K.ink}"/>`
        + kid(200, 220, { face: 'calm', pose: 'hold', k: 0.7 })
        + lab(250, 50, '30 秒', { fs: 16 })
        + glow(`<rect x="40" y="80" width="90" height="60" fill="#C8463A"/>`)
        + talk(220, 90, '盯 30 秒', 180, 140);
    }
    if (step === 1) {
      return sky('#F7F4EF')
        + `<rect x="140" y="30" width="160" height="140" fill="#F7F4EF" stroke="${K.ink}"/>`
        + kid(70, 220, { face: 'calm', pose: 'point', k: 0.7 })
        + lab(80, 50, '0', { fs: 20 })
        + glow(`<rect x="140" y="30" width="160" height="140" fill="#fff" stroke="#F2B640" stroke-width="3"/>`)
        + talk(80, 80, '看白墙……', 90, 140);
    }
    if (step === 2) {
      return sky('#F7F4EF')
        + `<rect x="120" y="30" width="180" height="160" fill="#F7F4EF" stroke="${K.ink}"/>`
        + glow(`<rect x="160" y="70" width="90" height="60" fill="#B7D7C8" opacity=".85"/>`)
        + kid(60, 220, { face: 'wow', k: 0.7 })
        + talk(80, 70, '绿色？！', 80, 140);
    }
    return sky('#FBF6EE') + S.colorWheel(150, 120, 72)
      + glow(`<path d="M150 50 A70 70 0 0 1 210 150 L150 120 Z" fill="#C8463A"/><path d="M150 190 A70 70 0 0 1 90 90 L150 120 Z" fill="#3FA772"/>`)
      + yin(280, 190, { face: 'happy', arm: 'point', k: 0.6 })
      + talk(250, 30, '眼睛在补色', 200, 60);
  }

  reg('hook.d06geo', hook6g);
  reg('hook.d06history', hook6h);
  reg('hook.d06finance', hook6f);
  reg('hook.d06psych', hook6p);
  reg('hook.d06fashion', hook6s);
  reg('hook.d07boss', hook7);
  reg('hook.d08geo', hook8g);
  reg('hook.d08history', hook8h);
  reg('hook.d08finance', hook8f);
  reg('hook.d08psych', hook8p);
  reg('hook.d08fashion', hook8s);
  reg('hook.d09geo', hook9g);
  reg('hook.d09history', hook9h);
  reg('hook.d09psych', hook9p);
  reg('hook.d09fashion', hook9s);
})(window);
