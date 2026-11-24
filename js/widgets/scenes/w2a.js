(function (global) {
  const S = global.LKScene;
  const K = S.K, f = S.f, CN = S.CN, proj = S.proj, pathOf = S.pathOf;
  const lab = S.lab, glow = S.glow, kid = S.kid, figure = S.figure, mountain = S.mountain, tree = S.tree;

  function bg(c) { return `<rect width="344" height="236" fill="${c || '#FBF6EE'}"/>`; }
  function land(P, fill) { return `<path d="${pathOf(CN.outline, P, true)}" fill="${fill || '#EEE3C8'}" stroke="#8C7B6B" stroke-width="1.05"/>`; }
  function reg(name, fn) { S.register(name, function (st) { return fn(st.step || 0); }); }

  function d6g1(step) {
    const P = proj({ s: 4.4, dx: 36, dy: 22 });
    if (step === 0) {
      const y25 = +P(CN.lat25[0])[1], y35 = +P(CN.lat35[0])[1];
      return bg('#EAF3F5') + land(P)
        + `<rect x="40" y="${y35}" width="270" height="${Math.max(8, y25 - y35)}" fill="#F2B640" opacity=".28"/>`
        + `<path d="${pathOf(CN.lat25, P)}" stroke="${K.ink}" stroke-dasharray="4 3" fill="none"/>`
        + `<path d="${pathOf(CN.lat35, P)}" stroke="${K.ink}" stroke-dasharray="4 3" fill="none"/>`
        + `<path d="${pathOf(CN.yangtze, P)}" stroke="#3D86D9" stroke-width="3.2" fill="none"/>`
        + glow(`<rect x="40" y="${y35}" width="270" height="${Math.max(8, y25 - y35)}" fill="#F2B640" opacity=".35"/>`)
        + lab(268, y35 + 4, '北纬 35°', { fs: 13 }) + lab(268, y25 + 16, '北纬 25°', { fs: 13 }) + lab(168, y25 + 28, '长江', { fs: 14, c: '#1E4E8C' });
    }
    if (step === 1) {
      return bg('#F7E7C8')
        + `<rect x="20" y="150" width="140" height="50" fill="#C9A27E"/>`
        + `<rect x="184" y="150" width="140" height="50" fill="#E7E0D6"/>`
        + `<circle cx="172" cy="48" r="18" fill="#F2B640" stroke="${K.ink}"/>`
        + [0, 1, 2, 3].map(function (i) { return `<path d="M${150 + i * 8} 66 L${70 + i * 16} 140" stroke="#E2B43A" stroke-width="2"/>`; }).join('')
        + [0, 1].map(function (i) { return `<path d="M${180 + i * 14} 66 L${230 + i * 30} 150" stroke="#E2B43A" stroke-width="1.2" opacity=".7"/>`; }).join('')
        + glow(S.thermo(80, 168, 0.65, '') + S.thermo(250, 168, 0.15, ''))
        + lab(90, 56, '+4°C', { fs: 16 }) + lab(260, 56, '−18°C', { fs: 16 })
        + lab(90, 190, '武汉 北纬 30°', { fs: 13 }) + lab(250, 190, '哈尔滨 北纬 46°', { fs: 13 });
    }
    if (step === 2) {
      return bg('#D5E8F0') + `<rect y="150" width="344" height="40" fill="#7FB6CF"/>` + `<rect y="190" width="344" height="46" fill="#C9B59A"/>`
        + tree(40, 190, 1.3) + tree(300, 188, 1.2)
        + S.cargoShip(170, 150, 1.1)
        + kid(70, 220, { k: 0.4, top: '#8FA7C9', bottom: '#3A302A' }) + kid(110, 222, { k: 0.4, top: '#C46A4A' })
        + glow(S.cargoShip(170, 150, 1.1))
        + lab(180, 40, '武汉 · 1 月 · +4°C', { fs: 15 });
    }
    if (step === 3) {
      return bg('#E7F2F6')
        + `<rect y="168" width="344" height="68" fill="#C9B59A"/>`
        + glow(`<rect y="156" width="344" height="22" fill="#F7F4EF" stroke="#9BB6C8"/>`)
        + `<path d="M20 164 Q80 156 140 166 T260 158 T340 168" fill="none" stroke="#9BB6C8" stroke-width="1.4"/>`
        + kid(80, 214, { k: 0.4 }) + kid(124, 218, { k: 0.38 }) + kid(168, 210, { k: 0.4, top: '#C8463A' })
        + `<path d="M240 196 L286 178 L308 204 Z" fill="#8A6F57" stroke="${K.ink}"/>`
        + lab(180, 40, '哈尔滨 · 1 月 · −18°C', { fs: 15 });
    }
    return bg('#EAF3F5') + land(P)
      + `<path d="${pathOf(CN.yangtze, P)}" stroke="#3D86D9" stroke-width="3" fill="none"/>`
      + glow(S.snowflake(120, 90, 1.4))
      + S.cargoShip(200, 150, 0.45) + S.cargoShip(230, 160, 0.4) + S.cargoShip(180, 168, 0.35)
      + lab(160, 40, '源头太高，也结冰', { fs: 14 });
  }

  function d6g2(step) {
    if (step === 0) {
      return bg('#F4EFE6') + S.riverProfile(40, 36, 270)
        + glow(`<path d="M44 42 L94 70 L144 112" fill="none" stroke="#F2B640" stroke-width="6"/>`)
        + lab(80, 36, '上游', { fs: 14 }) + lab(220, 150, '中下游', { fs: 14 }) + lab(300, 200, '海', { fs: 14 });
    }
    if (step === 1) {
      return bg('#C9D6DE') + S.cliff(16, 10, 100, 200) + S.cliff(230, 16, 100, 190)
        + `<path d="M120 40 C150 120 180 80 210 200" fill="none" stroke="#fff" stroke-width="12"/>`
        + glow(S.dam({ ox: 90, oy: 40, sc: 0.55 }))
        + lab(172, 36, '坡陡水急', { fs: 14 }) + lab(172, 210, '发电', { fs: 14 });
    }
    if (step === 2) {
      return bg('#EAF3F5') + `<rect y="120" width="344" height="50" fill="#7FB6CF"/>`
        + `<ellipse cx="70" cy="110" rx="40" ry="18" fill="#9CCBE0" stroke="${K.ink}"/>`
        + `<ellipse cx="270" cy="108" rx="46" ry="20" fill="#9CCBE0" stroke="${K.ink}"/>`
        + S.cargoShip(120, 130, 0.55) + S.cargoShip(180, 136, 0.5) + S.cargoShip(230, 128, 0.45)
        + glow(`<ellipse cx="70" cy="110" rx="40" ry="18" fill="none" stroke="#F2B640" stroke-width="3"/>`
          + `<ellipse cx="270" cy="108" rx="46" ry="20" fill="none" stroke="#F2B640" stroke-width="3"/>`)
        + lab(70, 80, '洞庭湖', { fs: 13 }) + lab(270, 76, '鄱阳湖', { fs: 13 }) + lab(172, 200, '坡缓水稳', { fs: 14 });
    }
    if (step === 3) {
      return bg('#FBF6EE')
        + `<path d="M40 120 C120 100 220 140 310 110" fill="none" stroke="#3D86D9" stroke-width="8"/>`
        + glow(`<path d="M300 116 L70 100" stroke="#C8463A" stroke-width="2.4" fill="none"/>`)
        + lab(300, 40, '水量全国第一', { fs: 13 })
        + S.snowflake(40, 70, 1.2) + `<path d="M28 58 L52 82 M52 58 L28 82" stroke="#C8463A" stroke-width="2"/>`
        + lab(60, 96, '不结冰', { fs: 13 })
        + `<rect x="140" y="160" width="28" height="36" rx="3" fill="#E7F2F6" stroke="${K.ink}"/><rect x="190" y="160" width="28" height="36" rx="3" fill="#C9A27E" stroke="${K.ink}"/>`
        + lab(154, 210, '长江', { fs: 13 }) + lab(204, 210, '黄河', { fs: 13 }) + lab(230, 180, '含沙少', { fs: 13 });
    }
    return bg('#D5E8F0') + S.shipLock(40, 50)
      + glow(`<path d="M70 130 L150 100" stroke="#F2B640" stroke-width="3" fill="none"/>`)
      + lab(200, 36, '三峡船闸', { fs: 15 }) + lab(250, 80, '灌水', { fs: 14 });
  }

  function d6h1(step) {
    const P = proj({ s: 8.2, lon0: 100, lat0: 40, dx: 40, dy: 28 });
    if (step === 0) {
      return bg('#C9D6DE') + `<rect x="0" y="0" width="70" height="236" fill="#8A6F57"/>`
        + lab(30, 80, '赤壁', { fs: 16, c: '#fff', stroke: '#8A6F57' })
        + glow(S.fire(160, 140, 1.8) + S.fire(200, 150, 1.4))
        + S.cargoShip(80, 160, 0.5) + S.cargoShip(110, 175, 0.4)
        + lab(180, 36, '208 年 赤壁', { fs: 16 });
    }
    if (step === 1) {
      return bg('#EAF3F5') + land(P) + `<path d="M40 40 L200 50 L220 140 L50 150 Z" fill="#8FA7C9" opacity=".55"/>`
        + glow(`<path d="M40 40 L200 50 L220 140 L50 150 Z" fill="#8FA7C9" opacity=".35"/>`)
        + S.flag(120, 90, '#3D86D9', { ch: '魏', fs: 9 })
        + lab(160, 36, '北方平原 · 人最多', { fs: 14 });
    }
    if (step === 2) {
      return bg('#EAF3F5') + land(P)
        + glow(`<path d="${pathOf(CN.yangtze, P)}" stroke="#F2B640" stroke-width="6" fill="none"/>`)
        + `<path d="M80 140 L240 160 L250 210 L70 200 Z" fill="#9FBF74" opacity=".7"/>`
        + S.flag(160, 180, '#3FA772', { ch: '吴', fs: 9 })
        + figure(100, 130, { k: 0.28, face: 'worry', robe: '#8FA7C9' }) + figure(130, 136, { k: 0.28, face: 'worry', robe: '#8FA7C9' })
        + lab(200, 36, '长江挡着', { fs: 16 });
    }
    if (step === 3) {
      return bg('#EAF3F5') + land(P)
        + mountain(150, 140, 50, 36, { snow: false }) + mountain(190, 150, 46, 30) + mountain(120, 160, 40, 28)
        + glow(mountain(160, 145, 70, 40, { c: '#E2B43A', cd: '#C49A6C' }))
        + `<ellipse cx="160" cy="155" rx="28" ry="14" fill="#E07A3D" opacity=".75"/>`
        + S.flag(160, 150, '#E07A3D', { ch: '蜀', fs: 8 })
        + lab(200, 36, '群山围着四川', { fs: 15 });
    }
    if (step === 4) {
      return bg('#8A6F57') + S.plankRoad(40, 30)
        + figure(90, 150, { k: 0.35, hat: 'helmet' }) + figure(120, 140, { k: 0.35, hat: 'helmet' }) + figure(150, 130, { k: 0.35, hat: 'helmet' })
        + `<rect x="180" y="40" width="140" height="36" rx="4" fill="#F3E7D3" stroke="${K.ink}"/>`
        + lab(250, 62, '蜀道之难', { fs: 14 })
        + glow(S.plankRoad(40, 30));
    }
    return bg('#EAF3F5') + land(P)
      + `<path d="${pathOf(CN.yangtze, P)}" stroke="#3D86D9" stroke-width="3" fill="none"/>`
      + glow(S.flag(80, 80, '#3D86D9', { ch: '魏', fs: 8 }) + S.flag(150, 160, '#E07A3D', { ch: '蜀', fs: 8 }) + S.flag(230, 170, '#3FA772', { ch: '吴', fs: 8 }))
      + lab(80, 40, '魏 220', { fs: 13 }) + lab(150, 40, '蜀 221', { fs: 13 }) + lab(240, 40, '吴 229', { fs: 13 });
  }

  function d6h2(step) {
    if (step === 0) {
      return bg('#F6EFE4')
        + figure(110, 200, { k: 1, hat: 'mian', robe: '#8E3F33', face: 'calm' })
        + `<rect x="180" y="40" width="140" height="100" fill="#F3E7D3" stroke="${K.ink}"/>`
        + glow(S.flag(240, 100, '#C8463A', { ch: '晋', fs: 10 }))
        + lab(250, 36, '266 建西晋', { fs: 14 }) + lab(250, 160, '280 灭吴', { fs: 14 });
    }
    if (step === 1) {
      return bg('#F4EFE6')
        + [40, 120, 200, 280].map(function (x) { return S.fort(x, 150, 40, '#8A6F57', { name: '' }) + `<rect x="${x - 6}" y="118" width="12" height="10" rx="2" fill="#C4A574" stroke="${K.ink}"/>`; }).join('')
        + figure(172, 210, { k: 0.7, hat: 'guan', robe: '#5C4636' })
        + glow(`<rect x="166" y="110" width="12" height="10" fill="#F2B640" stroke="${K.ink}"/>`)
        + lab(172, 36, '曹家王管得太严', { fs: 14 }) + lab(172, 56, '没人来救', { fs: 14 });
    }
    if (step === 2) {
      let kings = '';
      for (let i = 0; i < 8; i++) {
        const x = 36 + (i % 4) * 78, y = 90 + Math.floor(i / 4) * 80;
        kings += figure(x, y, { k: 0.36, hat: 'helmet', robe: '#8E3F33' }) + S.flag(x + 16, y - 10, '#C8463A', { ch: '王' });
      }
      return bg('#F6EFE4') + figure(40, 210, { k: 0.7, hat: 'mian', robe: '#8E3F33', right: 'give' }) + kings
        + glow(kings) + lab(200, 36, '大封宗室、给兵权', { fs: 15 });
    }
    if (step === 3) {
      return bg('#F6EFE4')
        + [50, 120, 190, 260].map(function (x) { return S.fort(x, 120, 36, '#C8463A', { ch: '晋' }); }).join('')
        + `<path d="M70 100 L110 90 M140 100 L170 80 M210 100 L240 90" stroke="${K.ink}" stroke-width="2"/>`
        + glow(S.fire(172, 180, 1.6))
        + lab(172, 36, '八王之乱', { fs: 15 }) + lab(172, 210, '316 西晋亡', { fs: 14 });
    }
    return bg('#FBF6EE') + S.seesaw(172, 160)
      + lab(70, 70, '管太死：外人夺权', { fs: 13 }) + lab(250, 120, '放太松：自家拆台', { fs: 13 })
      + lab(60, 200, '曹魏', { fs: 13 }) + lab(200, 40, '周', { fs: 13 }) + lab(250, 40, '汉初', { fs: 13 })
      + glow(lab(280, 190, '西晋', { fs: 16 }));
  }

  function d6f1(step) {
    if (step === 0) return bg() + S.jar(140, 70, 10, '1000') + glow(S.coin(200, 50, 10)) + lab(200, 36, '+100', { fs: 16 }) + lab(250, 90, '1100', { fs: 16 }) + lab(140, 210, '第 1 年', { fs: 14 });
    if (step === 1) return bg() + S.jar(70, 80, 8, '1000') + glow(S.jar(210, 60, 11, '1100')) + lab(250, 36, '+110', { fs: 16 }) + lab(210, 210, '第 2 年', { fs: 14 });
    return bg() + S.jar(40, 90, 6, '') + S.jar(130, 80, 8, '') + glow(S.jar(230, 50, 12, '1210'))
      + lab(250, 36, '+121', { fs: 16 }) + lab(230, 200, '1210 → 1331', { fs: 14 });
  }

  function d6p1(step) {
    if (step === 0) {
      return bg('#C9D6A4') + `<path d="M40 160 Q70 120 100 160" fill="#7FA65A"/>` + `<path d="M180 170 Q220 110 260 170" fill="#5E8A45"/>`
        + figure(120, 200, { k: 0.8, robe: '#8A6F57', face: 'wow' })
        + glow(S.snake(200, 150, 1.8))
        + S.fire(40, 190, 0.8)
        + lab(60, 40, '远古', { fs: 16 });
    }
    if (step === 1) {
      let people = '';
      for (let i = 0; i < 8; i++) people += figure(40 + (i % 4) * 28, 90 + Math.floor(i / 4) * 40, { k: 0.28, robe: '#8E3F33' });
      return bg() + people + figure(250, 120, { k: 0.4, robe: '#8A8178' }) + S.snake(280, 130, 1)
        + glow(`<path d="M240 140 L300 180" stroke="#C9B59A" stroke-width="3"/>`)
        + lab(80, 40, '怕蛇的', { fs: 14 }) + lab(260, 40, '不怕蛇的', { fs: 14 });
    }
    if (step === 2) {
      return bg('#F6EFE4')
        + `<rect y="168" width="344" height="68" fill="#E7D3B0"/>`
        + `<rect x="168" y="156" width="140" height="10" fill="#C4A574" stroke="${K.ink}"/>`
        + `<g transform="rotate(-32 118 214)">${kid(118, 214, { face: 'yuck', k: 0.92 })}</g>`
        + `<path d="M210 168 Q248 198 286 168" fill="#F4E7D4" stroke="${K.ink}" stroke-width="1.3"/>`
        + `<ellipse cx="248" cy="160" rx="22" ry="8" fill="#C9D6A4" stroke="${K.ink}"/>`
        + `<ellipse cx="238" cy="156" rx="6" ry="4" fill="#5E8A45"/><ellipse cx="256" cy="158" rx="5" ry="3" fill="#3FA772"/>`
        + `<path d="M230 140 q8 -16 0 -24 M252 136 q10 -18 2 -26" stroke="#3FA772" stroke-width="1.8" fill="none"/>`
        + `<ellipse cx="286" cy="148" rx="6" ry="3.5" fill="#2B2622"/><path d="M281 146 l-8 -4 M291 146 l8 -4" stroke="#2B2622" stroke-width="1.2"/>`
        + `<ellipse cx="300" cy="132" rx="5" ry="3" fill="#2B2622"/><path d="M296 130 l-7 -4 M304 130 l7 -4" stroke="#2B2622"/>`
        + glow(`<g transform="rotate(-32 118 214)">${kid(118, 214, { face: 'yuck', k: 0.92 })}</g>`);
    }
    const cells = [[8, 8], [176, 8], [8, 122], [176, 122]];
    const tags = ['恐惧 → 逃开', '厌恶 → 远离', '愤怒 → 护住', '悲伤 → 停下'];
    function fear(dim) {
      return `<g transform="translate(8 8) scale(1.35)">`
        + figure(40, 62, { k: 0.42, face: 'worry', robe: dim ? '#C9B59A' : '#8E3F33', right: 'point' })
        + (dim
          ? `<path d="M78 36 Q100 22 112 40" fill="none" stroke="#A89880" stroke-width="5" stroke-linecap="round"/>`
          : S.snake(96, 36, 0.9))
        + `</g>`;
    }
    function disgust(dim) {
      return `<path d="M16 58 L78 44" stroke="${dim ? '#A89880' : '#E7C3A8'}" stroke-width="10" stroke-linecap="round"/>`
        + `<circle cx="84" cy="42" r="8" fill="${dim ? '#C9B59A' : '#E7C3A8'}" stroke="${K.ink}"/>`
        + `<ellipse cx="118" cy="64" rx="28" ry="11" fill="${dim ? '#D9D3CB' : '#E7E0D6'}" stroke="${K.ink}"/>`
        + (dim ? '' : `<ellipse cx="108" cy="56" rx="6" ry="4" fill="#7FA65A"/><ellipse cx="124" cy="58" rx="5" ry="3" fill="#5E8A45"/>`);
    }
    function anger(dim) {
      return figure(48, 92, { k: 0.55, robe: dim ? '#C9B59A' : '#C8463A', left: 'up', right: 'up' })
        + `<path d="M86 70 L132 52 L140 78 L90 84 Z" fill="${dim ? '#D9D3CB' : '#E2CF7E'}" stroke="${K.ink}"/>`
        + (dim ? '' : `<circle cx="104" cy="64" r="6" fill="#C8463A"/><circle cx="118" cy="70" r="5" fill="#E07A3D"/><circle cx="108" cy="74" r="4" fill="#3FA772"/>`);
    }
    function sad(dim) {
      return kid(48, 96, { pose: 'sit', face: dim ? 'calm' : 'sad', k: 0.42, top: dim ? '#C9B59A' : '#8FA7C9' })
        + `<path d="M78 62 Q100 46 122 68" fill="none" stroke="${dim ? '#A89880' : '#E7C3A8'}" stroke-width="7" stroke-linecap="round"/>`
        + `<circle cx="124" cy="70" r="6" fill="${dim ? '#C9B59A' : '#E7C3A8'}" stroke="${K.ink}"/>`
        + (dim ? '' : figure(136, 96, { k: 0.36, robe: '#3D86D9' }));
    }
    const panes = [fear, disgust, anger, sad];
    function grid(on) {
      return cells.map(function (c, i) {
        const dim = i !== on;
        return `<rect x="${c[0]}" y="${c[1]}" width="160" height="106" rx="8" fill="${dim ? '#E7E0D6' : '#fff'}" stroke="${K.ink}"/>`
          + `<g transform="translate(${c[0]} ${c[1]})" opacity="${dim ? 0.55 : 1}">${panes[i](dim)}</g>`;
      }).join('')
        + glow(`<rect x="${cells[on][0]}" y="${cells[on][1]}" width="160" height="106" fill="none" stroke="#F2B640" stroke-width="3"/>`)
        + lab(cells[on][0] + 80, cells[on][1] + 16, tags[on], { fs: 13 });
    }
    if (step === 3) return bg() + grid(0);
    if (step === 4) return bg() + grid(1);
    if (step === 5) return bg() + grid(2);
    return bg() + grid(3);
  }

  function d8g1(step) {
    if (step === 0) {
      return bg('#F7E7C8') + `<circle cx="172" cy="36" r="16" fill="#F2B640" stroke="${K.ink}"/>`
        + `<rect x="0" y="150" width="170" height="86" fill="#E2CF7E"/>`
        + `<rect x="170" y="150" width="174" height="86" fill="#7FB6CF"/>`
        + S.thermo(60, 170, 0.9, '') + S.thermo(250, 180, 0.35, '')
        + kid(100, 220, { face: 'wow', pose: 'cheer', k: 0.55 })
        + glow(lab(70, 70, '45°C', { fs: 18 }))
        + lab(250, 70, '24°C', { fs: 16 }) + lab(172, 130, '中午', { fs: 14 });
    }
    if (step === 1) {
      return bg('#F2C48A') + `<circle cx="40" cy="80" r="18" fill="#E07A3D"/>`
        + `<rect x="0" y="150" width="170" height="86" fill="#C9A27E"/>`
        + `<rect x="170" y="150" width="174" height="86" fill="#5E9DBB"/>`
        + S.thermo(60, 170, 0.3, '') + S.thermo(250, 180, 0.4, '')
        + kid(250, 210, { pose: 'sit', face: 'happy', k: 0.5 })
        + glow(lab(70, 70, '20°C', { fs: 16 }) + lab(250, 70, '23°C', { fs: 16 }));
    }
    if (step === 2) {
      return bg() + `<rect x="30" y="80" width="120" height="100" fill="#E2CF7E" stroke="${K.ink}"/>`
        + `<rect x="30" y="80" width="120" height="10" fill="#C8463A"/>`
        + `<rect x="190" y="40" width="120" height="140" fill="#7FB6CF" stroke="${K.ink}"/>`
        + `<path d="M210 150 Q230 120 250 150 T290 140" fill="none" stroke="#fff" stroke-width="2"/>`
        + glow(`<rect x="30" y="80" width="120" height="10" fill="#C8463A"/>`)
        + lab(90, 40, '约 2 厘米', { fs: 14 }) + lab(250, 30, '热摊进很厚一层', { fs: 13 });
    }
    if (step === 3) {
      return bg('#F6EFE4') + S.stove(70, 176)
        + `<ellipse cx="106" cy="168" rx="16" ry="6" fill="#C5D0D6" stroke="${K.ink}"/>`
        + `<path d="M96 160 q6 -8 4 -14 M106 158 q4 -10 0 -16 M116 160 q-2 -8 4 -14" fill="none" stroke="#E07A3D" stroke-width="1.4"/>`
        + `<path d="M158 170 L164 142 L192 142 L198 170 Z" fill="#C5D0D6" stroke="${K.ink}"/>`
        + `<ellipse cx="178" cy="142" rx="16" ry="6" fill="#7FB6CF" stroke="${K.ink}"/>`
        + `<path d="M172 126 q4 -10 0 -16 M184 124 q5 -10 1 -16" fill="none" stroke="#9BB6C8" stroke-width="1.6"/>`
        + glow(`<ellipse cx="106" cy="168" rx="16" ry="6" fill="#C5D0D6" stroke="${K.ink}"/>`)
        + lab(100, 48, '1 分钟就烫', { fs: 14 })
        + lab(250, 48, '几分钟才冒气', { fs: 14 });
    }
    return bg()
      + `<rect x="20" y="70" width="140" height="80" fill="#C9A27E" stroke="${K.ink}"/>`
      + `<ellipse cx="90" cy="78" rx="22" ry="8" fill="#C5D0D6" stroke="${K.ink}"/>`
      + `<rect x="190" y="70" width="140" height="80" fill="#7FB6CF" stroke="${K.ink}"/>`
      + `<path d="M236 86 L276 86 L270 52 L242 52 Z" fill="#8A8178" stroke="${K.ink}"/>`
      + `<path d="M248 68 L264 68" stroke="#7FB6CF" stroke-width="5"/>`
      + glow(`<ellipse cx="90" cy="78" rx="22" ry="8" fill="none" stroke="#F2B640" stroke-width="3"/>`
        + `<path d="M236 86 L276 86 L270 52 L242 52 Z" fill="none" stroke="#F2B640" stroke-width="3"/>`)
      + lab(90, 180, '升温快、降温快', { fs: 14 }) + lab(260, 180, '升温慢、降温慢', { fs: 14 });
  }

  function d8g2(step) {
    const P = proj({ s: 4.2, dx: 20, dy: 30 });
    if (step === 0) {
      return bg('#F7E7C8') + land(P, '#E07A3D')
        + glow(`<path d="M40 80 L120 120 M60 100 L140 140" stroke="#3D86D9" stroke-width="3" fill="none"/>`)
        + lab(200, 40, '7 月', { fs: 16 }) + lab(80, 50, '低压', { fs: 16 }) + lab(160, 70, '海风', { fs: 14 });
    }
    if (step === 1) {
      return bg('#D5DDEA') + land(P, '#8FA7C9')
        + glow(`<path d="M160 120 L60 80" stroke="#3D86D9" stroke-width="3" fill="none"/>`)
        + lab(80, 50, '高', { fs: 20, c: '#1E4E8C' });
    }
    if (step === 2) {
      let pages = '';
      for (let m = 0; m < 12; m++) {
        const hot = m >= 5 && m <= 7 ? 14 : (m >= 3 && m <= 8 ? 8 : 4);
        const wet = m >= 5 && m <= 7 ? 12 : (m >= 4 && m <= 8 ? 6 : 3);
        const x = 20 + m * 26;
        pages += `<rect x="${x}" y="78" width="22" height="78" fill="#fff" stroke="${K.ink}" stroke-width=".6"/>`
          + `<circle cx="${x + 11}" cy="${148 - hot}" r="${hot / 2}" fill="#F2B640" stroke="${K.ink}" stroke-width=".5"/>`
          + `<path d="M${x + 11} ${156} q${wet / 2} ${wet} 0 ${wet + 4} q-${wet / 2} -2 0 -${wet + 4}" fill="#3D86D9"/>`;
      }
      return bg() + pages + glow(`<rect x="148" y="72" width="82" height="90" fill="none" stroke="#F2B640" stroke-width="3"/>`);
    }
    if (step === 3) {
      let rain = '';
      for (let i = 0; i < 8; i++) rain += `<path d="M${24 + i * 40} 24 l-8 22" stroke="#7FB6CF" stroke-width="2" stroke-linecap="round"/>`;
      return bg('#C9D6A4') + rain
        + S.fields('rice8', 120, 170, 80, 28, ['#7FB6CF', '#9FBF74', '#5E9DBB'], 3)
        + figure(240, 200, { hat: 'guan', robe: '#5C4636', face: 'happy', k: 0.7 })
        + glow(S.fields('rice8b', 120, 170, 80, 28, ['#7FB6CF', '#9FBF74'], 3))
        + lab(180, 36, '水稻 · 7 月', { fs: 16 });
    }
    return bg('#F7E7C8') + tree(70, 190, 2) + `<path d="M30 200 Q80 188 140 204" stroke="#C4A574" stroke-width="4" fill="none"/>`
      + `<circle cx="56" cy="46" r="16" fill="#F2B640" stroke="${K.ink}"/>`
      + lab(160, 40, '地中海', { fs: 16 }) + lab(250, 46, '7 月', { fs: 14 })
      + glow(`<g transform="translate(270 110)"><ellipse cx="0" cy="0" rx="28" ry="16" fill="#9BB6C8" stroke="${K.ink}"/><path d="M-8 8 l-4 14 M0 10 l0 16 M8 8 l4 14" stroke="#3D86D9" stroke-width="2"/><text y="40" font-size="13" font-weight="800" text-anchor="middle">1 月</text></g>`);
  }

  function d8h1(step) {
    const P = proj({ s: 4.6, dx: 30, dy: 24 });
    if (step === 0) {
      return bg('#EAF3F5') + land(P)
        + glow(`<path d="M120 150 C160 120 200 140 230 100" stroke="#3D86D9" stroke-width="4" fill="none"/>`)
        + `<path d="M200 60 L240 40 L250 50 M210 70 L248 48 M218 80 L256 56" stroke="#C8463A" stroke-width="2" fill="none"/>`
        + `<rect x="150" y="78" width="34" height="26" fill="#E7D3B0" stroke="${K.ink}"/>`
        + `<path d="M146 78 L167 58 L188 78" fill="#C8463A" stroke="${K.ink}"/>`
        + `<path d="M146 70 L188 86 M188 70 L146 86" stroke="#8A8178" stroke-width="1.2"/>`
        + lab(167, 54, '东都', { fs: 12 })
        + figure(60, 200, { k: 0.45, hat: 'mian', robe: '#8E3F33' })
        + lab(250, 150, '高句丽', { fs: 13 });
    }
    if (step === 1) {
      return bg('#C9D6A4') + `<rect x="40" y="80" width="180" height="80" fill="#7FA65A" opacity=".5" stroke="#5E8A45"/>`
        + S.house(80, 170, 1.4)
        + figure(120, 200, { k: 0.45, robe: '#C4A574' })
        + kid(200, 200, { k: 0.4 })
        + glow(`<path d="M220 180 L300 150" stroke="#C4A574" stroke-width="6"/>`)
        + figure(300, 160, { k: 0.35, hat: 'guan' });
    }
    if (step === 2) {
      return bg('#EFE6D6')
        + figure(120, 180, { k: 0.85, hat: 'guan', face: 'worry', robe: '#8A6F57' })
        + `<path d="M40 200 L120 120" stroke="#C4A574" stroke-width="8"/><path d="M200 200 L280 120" stroke="#C4A574" stroke-width="8"/>`
        + lab(60, 80, '留下', { fs: 16 }) + S.riceBag(70, 140)
        + glow(lab(260, 70, '投义军', { fs: 16 }) + S.fire(270, 130, 1));
    }
    if (step === 3) {
      let fires = '';
      for (let i = 0; i < 8; i++) fires += S.fire(50 + (i % 4) * 70, 80 + Math.floor(i / 4) * 70, 0.9);
      return bg('#EAF3F5') + land(P) + glow(fires) + lab(172, 36, '618 隋亡', { fs: 18 });
    }
    return bg()
      + `<path d="M40 80 C120 70 160 100 200 90" stroke="#3D86D9" stroke-width="6" fill="none"/>`
      + S.cargoShip(120, 90, 0.5)
      + lab(80, 50, '运河留下来了', { fs: 14 })
      + glow(`<path d="M230 60 L270 40 L300 80 L250 120 Z" fill="#C9B59A" stroke="${K.ink}" opacity=".7"/>`);
  }

  function d8h2(step) {
    if (step === 0) {
      return bg('#F6EFE4') + S.fort(80, 140, 70, '#C8463A', { ch: '唐', name: '长安' })
        + glow(S.flag(110, 80, '#C8463A', { ch: '唐', fs: 12 }))
        + `<path d="M160 160 C220 150 260 140 300 150" stroke="#3D86D9" stroke-width="4" fill="none"/>`
        + figure(200, 200, { k: 0.4, hat: 'guan' }) + figure(240, 206, { k: 0.4, hat: 'guan' })
        + lab(200, 36, '618 李渊建唐', { fs: 15 });
    }
    if (step === 1) {
      return bg('#F6EFE4') + figure(100, 200, { k: 0.9, hat: 'mian', robe: '#D9A441' })
        + S.mirror(210, 110)
        + glow(`<path d="M230 90 L270 70 L290 120 L240 130 Z" fill="#C9B59A" opacity=".8"/>`);
    }
    if (step === 2) {
      return bg('#EAF3F5') + `<rect y="120" width="344" height="80" fill="#7FB6CF"/>`
        + S.palaceBoat(170, 130, 1.4)
        + lab(80, 180, '百姓', { fs: 16 }) + lab(170, 110, '朝廷', { fs: 14, c: '#fff', stroke: '#8E3F33' })
        + glow(S.palaceBoat(170, 130, 1.4));
    }
    if (step === 3) {
      return bg('#EAF3F5') + `<path d="M0 140 Q40 100 80 150 T160 120 T240 160 T340 130 L340 236 L0 236 Z" fill="#5E9DBB"/>`
        + glow(`<g transform="rotate(-18 180 130)">${S.palaceBoat(180, 130, 1.3)}</g>`);
    }
    return bg('#C9D6A4') + figure(80, 190, { k: 0.6, robe: '#8A6F57' }) + S.bag(120, 160, '税')
      + glow(`<path d="M150 150 l20 16 M170 150 l-16 16" stroke="#C9B59A" stroke-width="2" stroke-dasharray="3 2"/>`)
      + lab(200, 40, '贞观之治', { fs: 16 });
  }

  function d8f1(step) {
    if (step === 0) {
      return bg() + S.riceBag(80, 150) + S.riceBag(230, 150)
        + lab(80, 50, '去年', { fs: 14 }) + lab(80, 180, '100 元', { fs: 16 })
        + glow(lab(230, 50, '今年', { fs: 14 }) + lab(230, 180, '103 元', { fs: 18 }));
    }
    if (step === 1) return bg('#F6EFE4') + kid(100, 180, { pose: 'hold', face: 'calm', k: 0.7 }) + glow(S.bill(180, 90)) + lab(210, 70, '100', { fs: 16 });
    if (step === 2) {
      return bg()
        + `<path d="M124 186 L138 78 L196 78 L210 186 Z" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.2"/>`
        + `<path d="M128 186 L146 108 L188 108 L206 186 Z" fill="#E2CF7E"/>`
        + `<path d="M140 78 L194 78 L188 108 L146 108 Z" fill="none" stroke="${K.ink}" stroke-dasharray="3 2"/>`
        + `<rect x="152" y="128" width="22" height="14" fill="#F2B640" stroke="${K.ink}" stroke-width=".6"/>`
        + lab(163, 138, '米', { fs: 11 })
        + glow(`<path d="M140 78 L194 78 L188 108 L146 108 Z" fill="none" stroke="#F2B640" stroke-width="2" stroke-dasharray="3 2"/>`)
        + lab(270, 120, '100 ÷ 103 ≈ 0.97', { fs: 14 });
    }
    return bg() + S.bill(80, 90) + glow(`<path d="M130 90 L146 122" stroke="#C9B59A" stroke-dasharray="3 2"/>`) + lab(220, 120, '≈ 去年 97 元', { fs: 16 });
  }

  function d8p1(step) {
    if (step === 0) {
      return bg('#F6EFE4') + kid(80, 180, { face: 'calm', k: 0.7 })
        + glow(S.lightCone(100, 90, 240, 160, 70))
        + S.phone(200, 120) + S.books(250, 160, 2)
        + lab(80, 40, '平静', { fs: 16 });
    }
    if (step === 1) {
      return bg('#F6EFE4') + kid(80, 180, { face: 'worry', k: 0.7 })
        + glow(S.lightCone(110, 90, 200, 150, 16))
        + lab(80, 40, '紧张', { fs: 16 });
    }
    if (step === 2) {
      return bg() + kid(100, 190, { pose: 'hold', face: 'worry', k: 0.75 })
        + `<rect x="180" y="120" width="28" height="40" rx="4" fill="#7FB6CF" stroke="${K.ink}"/>`
        + glow(S.lightCone(140, 90, 194, 120, 14))
        + lab(230, 150, '✓', { fs: 20, c: '#3FA772' });
    }
    if (step === 3) {
      return bg() + kid(80, 190, { face: 'worry', prop: 'phone', k: 0.65 })
        + ['粉丝', '措辞', '表情', '语气', '错字'].map(function (t, i) { return lab(160 + i * 30, 60 + (i % 2) * 20, t, { fs: 12 }); }).join('')
        + glow(S.lightCone(120, 90, 180, 70, 12))
        + lab(250, 160, '✕', { fs: 18, c: '#C8463A' });
    }
    return bg() + S.chalkboard(40, 30, 260, 150)
      + `<path d="M70 140 Q140 40 220 110" fill="none" stroke="#F7F4EF" stroke-width="3"/>`
      + `<path d="M70 150 Q120 70 180 120" fill="none" stroke="#F2B640" stroke-width="3"/>`
      + glow(`<path d="M70 150 Q120 70 180 120" fill="none" stroke="#F2B640" stroke-width="3"/>`)
      + lab(240, 50, '越紧张 →', { fs: 14, c: '#fff', stroke: '#2F6B4F' });
  }

  function d9g1(step) {
    const P = proj({ s: 4.5, dx: 28, dy: 26 });
    if (step === 0) {
      return bg('#EAF3F5') + land(P)
        + `<path d="${pathOf(CN.qinling, P)}" stroke="#8A6F57" stroke-width="3" fill="none"/>`
        + glow(`<path d="${pathOf(CN.rain800, P)}" stroke="#3D86D9" stroke-width="2.4" fill="none" stroke-dasharray="5 3"/>`)
        + lab(200, 36, '秦岭—淮河', { fs: 14 }) + lab(200, 56, '800 毫米线', { fs: 14 });
    }
    if (step === 1) {
      return bg() + mountain(172, 180, 160, 90, { c: '#8A6F57', cd: '#6E5642' })
        + `<path d="M40 80 L120 120" stroke="#3D86D9" stroke-width="3" fill="none"/>`
        + `<ellipse cx="90" cy="60" rx="30" ry="14" fill="#9BB6C8"/>`
        + glow(`<path d="M40 80 L110 130" stroke="#3D86D9" stroke-width="4" fill="none"/>`)
        + lab(70, 40, '南坡雨多', { fs: 14 }) + lab(260, 40, '北边雨少', { fs: 14 });
    }
    if (step === 2) {
      return bg() + S.rainColumn(180, 200, 80) + kid(120, 210, { k: 0.8, face: 'wow' })
        + `<rect x="230" y="70" width="8" height="130" fill="#E7D3B0" stroke="${K.ink}"/>`
        + glow(lab(260, 120, '80 厘米', { fs: 16 }));
    }
    if (step === 3) {
      return bg() + S.fields('pd', 90, 130, 70, 40, ['#7FB6CF', '#9FBF74', '#5E9DBB'], 3)
        + S.fields('wh', 250, 130, 70, 40, ['#E2CF7E', '#C4A574', '#D9B98A'], 9)
        + glow(lab(90, 50, '＞800', { fs: 16 }))
        + lab(250, 50, '＜800', { fs: 16 });
    }
    return bg('#EAF3F5') + land(P)
      + S.fields('dryN', 110, 78, 40, 16, ['#E2CF7E', '#D9B98A', '#C4A574'], 5)
      + S.fields('wetS', 210, 176, 46, 18, ['#7FB6CF', '#9FBF74', '#5E9DBB'], 3)
      + `<path d="${pathOf(CN.qinling, P)}" stroke="#8A6F57" stroke-width="4" fill="none"/>`
      + glow(`<path d="${pathOf(CN.qinling, P)}" stroke="#F2B640" stroke-width="3" fill="none"/>`)
      + lab(110, 48, '旱地', { fs: 14 }) + lab(210, 150, '水田', { fs: 14 });
  }

  function d9g2(step) {
    if (step === 0) {
      return bg() + `<path d="M20 150 L172 70 L324 150 L324 200 L20 200 Z" fill="#8A6F57" stroke="${K.ink}"/>`
        + `<path d="M20 150 L120 110 L172 150 Z" fill="#E7F2F6"/>`
        + `<path d="M172 150 L240 100 L324 150 Z" fill="#7FA65A"/>`
        + glow(`<path d="M150 80 L190 80 L172 60 Z" fill="#F2B640"/>`)
        + lab(80, 40, '挡冷', { fs: 16 }) + lab(260, 40, '挡湿', { fs: 16 });
    }
    if (step === 1) {
      return bg('#E7F2F6')
        + `<rect y="156" width="344" height="80" fill="#E4D2A8"/>`
        + `<rect x="16" y="128" width="120" height="18" rx="3" fill="#F7F4EF" stroke="#9BB6C8"/>`
        + S.fields('wf', 78, 198, 62, 26, ['#E2CF7E', '#D9B98A'], 4)
        + S.bowl(210, 186, 'noodle')
        + `<circle cx="262" cy="172" r="10" fill="#F7F4EF" stroke="${K.ink}"/><circle cx="276" cy="180" r="9" fill="#F4EFE6" stroke="${K.ink}"/><circle cx="250" cy="182" r="8" fill="#fff" stroke="${K.ink}"/>`
        + glow(S.fields('wfg', 78, 198, 62, 26, ['#E2CF7E', '#D9B98A'], 4))
        + lab(160, 36, '1 月 0°C 以下', { fs: 14 }) + lab(160, 60, '＜800 毫米', { fs: 14 });
    }
    if (step === 2) {
      return bg('#EAF3F5')
        + `<rect y="156" width="344" height="80" fill="#C9D6A4"/>`
        + `<path d="M16 140 Q70 128 130 142" fill="none" stroke="#3D86D9" stroke-width="6"/>`
        + S.fields('pf', 78, 198, 64, 26, ['#5E9DBB', '#9FBF74'], 2)
        + S.bowl(214, 186, 'rice') + S.bowl(268, 186, 'fen')
        + glow(S.bowl(214, 186, 'rice'))
        + lab(150, 36, '不结冰', { fs: 16 }) + lab(250, 36, '＞800 毫米', { fs: 14 });
    }
    if (step === 3) {
      const P = proj({ s: 36, lon0: 114.2, lat0: 35.3, dx: 16, dy: 12 });
      const wheat = `<g><path d="M0 16 Q-6 4 0 -8 Q6 4 0 16" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".6"/><path d="M0 16 L0 -2" stroke="#C4A574" stroke-width="1.2"/></g>`;
      const rice = `<g><path d="M0 14 Q8 4 2 -8" fill="none" stroke="#3FA772" stroke-width="1.4"/><ellipse cx="4" cy="-8" rx="3" ry="5" fill="#9FBF74" stroke="${K.ink}" stroke-width=".5"/></g>`;
      return bg('#EAF3F5')
        + `<path d="${pathOf(CN.anhui, P, true)}" fill="#F3E7D3" stroke="${K.ink}"/>`
        + `<path d="${pathOf(CN.jiangsu, P, true)}" fill="#E7D3B0" stroke="${K.ink}"/>`
        + glow(`<path d="${pathOf(CN.huai, P)}" fill="none" stroke="#3D86D9" stroke-width="4" stroke-linecap="round"/>`)
        + `<g transform="translate(70 48)">${wheat}</g><g transform="translate(150 42)">${wheat}</g>`
        + `<g transform="translate(90 168)">${rice}</g><g transform="translate(180 176)">${rice}</g>`
        + S.bowl(48, 70, 'noodle') + S.bowl(250, 190, 'rice')
        + lab(92, 150, '安徽', { fs: 14 }) + lab(210, 108, '江苏', { fs: 14 }) + lab(150, 78, '淮河', { fs: 14, c: '#1E4E8C' });
    }
    const P = proj({ s: 4.4, dx: 30, dy: 24 });
    const ear = `<g><path d="M0 18 Q-7 6 0 -10 Q7 6 0 18" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".7"/><path d="M0 18 L0 0" stroke="#C4A574"/></g>`;
    const stalk = `<g><path d="M0 16 Q8 4 2 -10" fill="none" stroke="#3FA772" stroke-width="1.5"/><ellipse cx="4" cy="-10" rx="3.2" ry="5" fill="#9FBF74" stroke="${K.ink}" stroke-width=".5"/></g>`;
    return bg('#EAF3F5') + land(P)
      + `<g transform="translate(70 70)">${ear}</g><g transform="translate(110 86)">${ear}</g>`
      + `<g transform="translate(200 168)">${stalk}</g><g transform="translate(250 180)">${stalk}</g>`
      + `<path d="${pathOf(CN.qinling, P)}" stroke="#8A6F57" stroke-width="3" fill="none"/>`
      + `<path d="${pathOf(CN.lat35, P)}" stroke="#7C6BD6" stroke-width="2" fill="none"/>`
      + glow(`<path d="${pathOf(CN.rain800, P)}" stroke="#3D86D9" stroke-width="2.5" fill="none" stroke-dasharray="4 3"/>`)
      + lab(90, 56, '麦', { fs: 16 }) + lab(230, 150, '稻', { fs: 16 });
  }

  function d9h1(step) {
    const P = proj({ s: 4.2, dx: 36, dy: 28 });
    if (step === 0) {
      let oldF = '', neu = '';
      for (let i = 0; i < 8; i++) oldF += S.fort(40 + i * 18, 70 + (i % 3) * 10, 16, '#8A8178', {});
      for (let i = 0; i < 12; i++) neu += S.fort(80 + (i % 4) * 50, 120 + Math.floor(i / 4) * 30, 18, '#C4A574', {});
      return bg('#EAF3F5') + land(P) + oldF + glow(neu) + lab(200, 36, '乱后、内地也设', { fs: 15 });
    }
    if (step === 1) {
      return bg('#F6EFE4') + figure(80, 190, { k: 0.85, hat: 'mian', face: 'worry', robe: '#8E3F33' })
        + `<rect x="160" y="80" width="80" height="40" fill="#E7E0D6" stroke="${K.ink}"/>`
        + figure(260, 190, { k: 0.7, hat: 'helmet', robe: '#5C4636' })
        + glow(S.seal(200, 70) + S.flag(230, 90, '#C8463A', { ch: '将' }));
    }
    if (step === 2) {
      return bg('#F4EFE6') + figure(140, 190, { k: 0.85, hat: 'helmet', robe: '#4A3B30', face: 'worry' })
        + S.flag(180, 140, '#2B2622', { ch: '叛' })
        + glow(`<path d="M200 160 L280 120" stroke="#F2B640" stroke-width="3"/>` + S.fort(290, 110, 30, '#8A6F57', {}));
    }
    if (step === 3) {
      return bg('#6E655C') + S.fort(80, 140, 60, '#4A3B30', { name: '长安' })
        + glow(S.fire(90, 100, 1.3))
        + figure(220, 180, { k: 0.55, hat: 'mian', robe: '#8E3F33' })
        + figure(260, 190, { k: 0.3 }) + figure(280, 196, { k: 0.28 });
    }
    let forts = '';
    const cols = ['#C8463A', '#3D86D9', '#E2B43A', '#3FA772', '#7C6BD6', '#E07A3D'];
    for (let i = 0; i < 12; i++) forts += S.fort(40 + (i % 4) * 75, 70 + Math.floor(i / 4) * 50, 22, cols[i % 6], {});
    return bg('#EAF3F5') + land(P) + glow(forts) + lab(250, 36, '几个 → 几十个', { fs: 15 });
  }

  function d9h2(step) {
    const pics = ['边', '剑', '财', '乱', '亡'];
    if (step === 0) {
      let row = '';
      pics.forEach(function (t, i) { row += S.domino(30 + i * 60, 80, 46, 90) + lab(53 + i * 60, 130, t, { fs: 16 }); });
      return bg() + row + glow(S.domino(30, 80, 46, 90));
    }
    if (step === 1) {
      const token = function (x, y, t) {
        return `<rect x="${x}" y="${y}" width="34" height="22" rx="3" fill="#F3E7D3" stroke="${K.ink}"/><text x="${x + 17}" y="${y + 16}" font-size="13" font-weight="800" text-anchor="middle">${t}</text>`;
      };
      return bg() + `<g transform="rotate(70 70 150)">${S.domino(40, 110, 36, 72)}</g>`
        + `<g transform="rotate(62 128 158)">${S.domino(98, 118, 36, 72)}</g>`
        + S.domino(168, 78, 40, 84)
        + figure(286, 200, { k: 0.78, hat: 'helmet', robe: '#5C4636', right: 'hold', left: 'hold' })
        + token(214, 46, '兵') + token(252, 46, '财') + token(233, 72, '地')
        + glow(figure(286, 200, { k: 0.78, hat: 'helmet', robe: '#5C4636', right: 'hold', left: 'hold' }));
    }
    if (step === 2) {
      let fallen = '';
      for (let i = 0; i < 5; i++) fallen += `<g transform="rotate(${70 - i * 4} ${40 + i * 58} 160)">${S.domino(20 + i * 58, 120, 36, 70)}</g>`;
      return bg() + glow(fallen) + lab(250, 40, '唐亡', { fs: 16 });
    }
    if (step === 3) {
      return bg() + ['周', '东汉', '唐'].map(function (t, i) {
        const x = 30 + i * 110;
        return `<rect x="${x}" y="40" width="96" height="150" rx="6" fill="#F6EFE4" stroke="${K.ink}"/>` + lab(x + 48, 64, t, { fs: 16 }) + figure(x + 48, 160, { k: 0.45, hat: 'helmet', right: 'hold' });
      }).join('') + glow(`<rect x="250" y="40" width="96" height="150" fill="none" stroke="#F2B640" stroke-width="3"/>`);
    }
    if (step === 4) {
      return bg('#2A2438') + figure(172, 90, { k: 0.45, hat: 'mian', robe: '#2B2622', right: 'point' })
        + `<path d="M188 70 L230 40" stroke="#F2B640" stroke-width="3" stroke-linecap="round"/>`
        + figure(60, 190, { k: 0.4, right: 'hold' }) + figure(130, 196, { k: 0.4 }) + figure(230, 190, { k: 0.4, right: 'hold' }) + figure(290, 198, { k: 0.4 })
        + `<rect x="40" y="150" width="22" height="14" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".6"/>`
        + glow(`<path d="M188 70 L230 40" stroke="#F2B640" stroke-width="3"/>`);
    }
    const names = ['梁', '唐', '晋', '汉', '周'];
    return bg() + `<rect x="28" y="168" width="288" height="16" rx="4" fill="#C9B59A" stroke="${K.ink}"/>`
      + names.map(function (t, i) {
        const x = 36 + i * 58;
        return `<path d="M${x + 16} 64 L${x + 16} 150" stroke="#5C4636" stroke-width="2"/>`
          + `<rect x="${x}" y="72" width="36" height="64" rx="2" fill="#8E3F33" stroke="${K.ink}"/>`
          + `<text x="${x + 18}" y="110" font-size="16" font-weight="800" fill="#F7F4EF" text-anchor="middle">${t}</text>`;
      }).join('')
      + glow(names.map(function (t, i) {
        const x = 36 + i * 58;
        return `<rect x="${x}" y="72" width="36" height="64" fill="none" stroke="#F2B640" stroke-width="2"/>`;
      }).join(''))
      + lab(48, 206, '907', { fs: 14 }) + lab(300, 206, '960', { fs: 14 })
      + lab(172, 40, '53 年 5 个朝代', { fs: 16 });
  }

  function d9p1(step) {
    if (step === 0) {
      return bg('#1E3344') + `<rect x="80" y="120" width="140" height="14" fill="#C4A574"/>`
        + kid(140, 160, { pose: 'sit', face: 'sad', k: 0.6 })
        + glow(S.battery(200, 40, 0.25))
        + lab(80, 40, '衰竭', { fs: 16, c: '#fff', stroke: '#1E3344' });
    }
    if (step === 1) {
      return bg('#C9D6A4') + kid(80, 180, { face: 'worry', k: 0.6 })
        + `<ellipse cx="40" cy="140" rx="20" ry="12" fill="#8A6F57"/>`
        + kid(220, 190, { pose: 'sit', face: 'calm', k: 0.55 })
        + glow(S.battery(250, 50, 1));
    }
    if (step === 2) {
      let days = '';
      for (let i = 0; i < 5; i++) days += `<rect x="${30 + i * 60}" y="40" width="48" height="70" fill="#fff" stroke="${K.ink}"/>` + lab(54 + i * 60, 130, ['80%', '60%', '40%', '30%', '20%'][i], { fs: 12 });
      return bg() + days + glow(S.battery(40, 160, 0.5));
    }
    if (step === 3) {
      return bg('#F6EFE4') + S.bed(40, 140, 160) + kid(110, 168, { pose: 'sit', face: 'sad', k: 0.45 })
        + lab(250, 80, '38.5°C', { fs: 16 })
        + glow(S.battery(230, 120, 0));
    }
    let week = '';
    for (let i = 0; i < 7; i++) week += `<rect x="${20 + i * 46}" y="70" width="40" height="60" fill="${i === 6 ? '#FFF6D8' : '#fff'}" stroke="${K.ink}"/>`;
    return bg() + week + glow(`<rect x="296" y="70" width="40" height="60" fill="#F2B640" opacity=".45"/>`) + S.battery(236, 156, 0.75);
  }

  function d9s1(step) {
    if (step === 0) {
      return bg() + `<rect x="40" y="80" width="80" height="60" fill="#C8463A" stroke="${K.ink}"/>`
        + `<rect x="180" y="40" width="120" height="140" fill="#F7F4EF" stroke="${K.ink}"/>`
        + glow(`<rect x="200" y="70" width="80" height="60" fill="#B7D7C8" opacity=".8"/>`)
        + kid(80, 210, { face: 'wow', k: 0.55 });
    }
    if (step === 1) {
      return bg() + S.colorWheel(172, 120, 80)
        + glow(`<path d="M172 40 A80 80 0 0 1 250 120 L172 120 Z" fill="#C8463A"/><path d="M172 200 A80 80 0 0 1 94 120 L172 120 Z" fill="#3FA772"/>`);
    }
    if (step === 2) {
      return bg('#F6EFE4') + kid(170, 220, { top: '#F7F4EF', skirt: '#2F5D4A', face: 'calm', k: 0.9 })
        + glow(`<circle cx="150" cy="150" r="5" fill="#C8463A"/><circle cx="190" cy="150" r="5" fill="#C8463A"/>`)
        + lab(170, 40, '白衬衫、墨绿半裙、红耳环', { fs: 13 });
    }
    return bg()
      + kid(80, 210, { top: '#C8463A', skirt: '#3FA772', k: 0.7 })
      + kid(240, 210, { top: '#F7F4EF', skirt: '#2F5D4A', k: 0.7 })
      + lab(80, 40, '一样大、一样鲜', { fs: 13 })
      + glow(lab(240, 40, '一方让步', { fs: 14 }));
  }

  reg('w2.d6g1', d6g1); reg('w2.d6g2', d6g2); reg('w2.d6h1', d6h1); reg('w2.d6h2', d6h2);
  reg('w2.d6f1', d6f1); reg('w2.d6p1', d6p1);
  reg('w2.d8g1', d8g1); reg('w2.d8g2', d8g2); reg('w2.d8h1', d8h1); reg('w2.d8h2', d8h2);
  reg('w2.d8f1', d8f1); reg('w2.d8p1', d8p1);
  reg('w2.d9g1', d9g1); reg('w2.d9g2', d9g2); reg('w2.d9h1', d9h1); reg('w2.d9h2', d9h2);
  reg('w2.d9p1', d9p1); reg('w2.d9s1', d9s1);
})(window);
