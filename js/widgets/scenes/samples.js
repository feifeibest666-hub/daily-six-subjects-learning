(function (global) {
  const S = global.LKScene;
  const K = S.K, f = S.f, callout = S.callout, newRing = S.newRing, mountain = S.mountain;
  const tree = S.tree, house = S.house, city = S.city, fields = S.fields, figure = S.figure, bubble = S.bubble;
  const coin = S.coin, stack = S.stack, product = S.product, ruler = S.ruler, runner = S.runner;
  const stopwatch = S.stopwatch, phone = S.phone, flag = S.flag, fort = S.fort, palace = S.palace;
  const seal = S.seal, tally = S.tally, bag = S.bag, floor = S.floor, tag = S.tag;
  const CN = S.CN, proj = S.proj, pathOf = S.pathOf, smooth = S.smooth;
  const QIN = '#2B2622', RED = '#C8463A';
const stairs = S.stairs;
const plainBlock = S.plainBlock;
  const GOLD = '#D99A2B', A = '#3D86D9', Bc = '#C8664A';

function basinBlock(o) {
  o = o || {};
  let s = '';
  const prof = [[24, 156], [46, 128], [70, 146], [100, 162], [244, 162], [274, 146], [298, 128], [320, 156]];
  const bottom = 222;
  // back sky/ground plane
  s += `<path d="M24 156 L24 74 Q172 40 320 74 L320 156 Z" fill="#D9C39A"/>`;
  // back mountain ring (far, smaller, lighter)
  [[52, 92, 46, 34], [92, 80, 54, 42], [136, 72, 56, 40], [182, 70, 60, 46], [228, 74, 56, 40], [272, 84, 52, 38], [306, 96, 40, 30]].forEach(([x, y, w, h], i) => s += mountain(x, y + 10, w, h, { snow: h > 41, c: '#B49A7C', cd: '#977D63', skew: (i % 2 ? 4 : -3) }));
  // side ridges
  [[40, 132, 40, 40], [62, 116, 44, 40], [300, 132, 40, 40], [280, 116, 44, 40]].forEach(([x, y, w, h]) => s += mountain(x, y, w, h, {}));
  // basin floor
  s += `<ellipse cx="172" cy="128" rx="104" ry="36" fill="#B9CF8E"/>`;
  s += fields('bf', 172, 128, 98, 31, null, 11);
  s += `<ellipse cx="172" cy="128" rx="104" ry="36" fill="none" stroke="#8FAE6A" stroke-width="1.5"/>`;
  // river (Min / Tuo) across the floor, exits through the gorge on the right
  s += `<path d="M104 104 C130 112 150 120 170 132 C196 146 232 148 262 140 C282 134 300 140 320 150" fill="none" stroke="#fff" stroke-width="5"/><path d="M104 104 C130 112 150 120 170 132 C196 146 232 148 262 140 C282 134 300 140 320 150" fill="none" stroke="${K.waterD}" stroke-width="3"/>`;
  [[132, 124], [214, 120], [236, 136], [118, 140]].forEach(([x, y]) => s += tree(x, y, 1));
  if (o.city !== false) s += city(150, 124, '成都');
  // front cut face with strata following the profile
  const top = prof.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  s += `<path d="${top} L320 ${bottom} L24 ${bottom} Z" fill="${K.soil1}"/>`;
  const band = (dy, c) => `<path d="${prof.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + (Math.min(bottom, p[1] + dy + (p[1] < 150 ? (150 - p[1]) * .35 : 0)))).join(' ')} L320 ${bottom} L24 ${bottom} Z" fill="${c}"/>`;
  s += band(18, K.soil2) + band(36, K.soil3);
  // front ridge mountains sitting on the profile peaks
  s += mountain(46, 130, 52, 36, {}) + mountain(298, 130, 52, 36, { skew: 3 });
  s += `<path d="${top}" fill="none" stroke="${K.ink}" stroke-width="1.6"/>`;
  s += `<path d="M24 156 L24 ${bottom} L320 ${bottom} L320 156" fill="none" stroke="${K.ink}" stroke-width="1.3"/>`;
  return s;
}
function washbasin(cx, cy, k) {
  return `<g transform="translate(${cx} ${cy}) scale(${k})">
  <ellipse cx="0" cy="40" rx="38" ry="7" fill="rgba(74,59,48,.16)"/>
  <path d="M-58 0 Q-50 38 -26 40 L26 40 Q50 38 58 0 Z" fill="#E8EEF1" stroke="${K.ink}" stroke-width="1.4"/>
  <path d="M-46 8 Q-40 30 -22 32 L22 32 Q40 30 46 8" fill="none" stroke="#C4D0D6" stroke-width="5"/>
  <ellipse cx="0" cy="0" rx="58" ry="17" fill="#F7FAFB" stroke="${K.ink}" stroke-width="1.4"/>
  <ellipse cx="0" cy="2" rx="50" ry="13" fill="url(#basin)"/>
  <ellipse cx="0" cy="6" rx="34" ry="7.5" fill="url(#waterG)" opacity=".85"/>
  <path d="M-20 5 Q-8 2 6 4" stroke="#fff" stroke-width="1.4" fill="none" opacity=".8"/>
  <ellipse cx="0" cy="0" rx="58" ry="17" fill="none" stroke="#5E9DBB" stroke-width="2.2"/></g>`;
}
function bowlOnStep(isNew) {
  // small basin cut into step-2 top face
  let s = `<ellipse cx="178" cy="111" rx="34" ry="8.5" fill="#9A7048"/><ellipse cx="178" cy="112.5" rx="28" ry="6" fill="#B9CF8E"/>`;
  s += mountain(152, 112, 18, 12, {}) + mountain(166, 107, 20, 13, {}) + mountain(194, 107, 20, 13, {}) + mountain(206, 112, 18, 12, {});
  s += `<ellipse cx="178" cy="112.5" rx="24" ry="4.6" fill="#B9CF8E"/>`;
  if (isNew) s += newRing(178, 110, 42);
  return s;
}
function chinaPoster() {
  const P = proj({ s: 4.95, dx: 6, dy: 4 });
  let s = `<rect width="344" height="236" fill="#EAF3F5"/>`;
  s += `<clipPath id="cnc"><path d="${pathOf(CN.outline, P, true)}"/></clipPath>`;
  s += `<path d="${pathOf(CN.outline, P, true)}" fill="#EEE3C8"/>`;
  s += `<g clip-path="url(#cnc)"><path d="${pathOf(CN.line2.concat([[100, 20], [60, 20], [60, 56], [122.4, 56]]), P, true)}" fill="#E3C9A0"/><path d="${pathOf(CN.line1.concat([[98, 20], [60, 20], [60, 36.6]]), P, true)}" fill="#C9A27E"/></g>`;
  s += `<path d="${pathOf(CN.outline, P, true)}" fill="none" stroke="#8C7B6B" stroke-width="1"/>`;
  const ty = P([121, 23.7]), hn = P([109.6, 19.2]);
  s += `<ellipse cx="${ty[0]}" cy="${ty[1]}" rx="2.2" ry="6" fill="#EEE3C8" stroke="#8C7B6B" stroke-width=".8"/><ellipse cx="${hn[0]}" cy="${hn[1]}" rx="4.6" ry="3" fill="#EEE3C8" stroke="#8C7B6B" stroke-width=".8"/>`;
  s += `<path d="${smooth(CN.yangtze, P)}" fill="none" stroke="${K.waterD}" stroke-width="1.3" opacity=".7"/><path d="${smooth(CN.yellow, P)}" fill="none" stroke="#C9A64A" stroke-width="1.3" opacity=".7"/>`;
  // plains (green, highlighted)
  const ell = (lon, lat, rx, ry, rot) => { const c = P([lon, lat]); return `<ellipse cx="${c[0]}" cy="${c[1]}" rx="${rx}" ry="${ry}" transform="rotate(${rot || 0} ${c[0]} ${c[1]})" fill="#9FC46E" stroke="#5E8A3A" stroke-width="1.4"/>`; };
  s += ell(125, 45.6, 11, 15, -15) + ell(116.2, 36.4, 10, 13) + `<path d="${pathOf([[112, 30.8], [114.3, 31.2], [116.5, 31.2], [118.5, 32.2], [121, 32], [121.4, 31], [119.5, 30.6], [116.5, 29.3], [114, 29.6], [112, 29.6]], P, true)}" fill="#9FC46E" stroke="#5E8A3A" stroke-width="1.4"/>`;
  // basins as small bowls
  [[83.5, 39.4, '塔里木'], [86.5, 45.2, '准噶尔'], [94.6, 37.3, '柴达木'], [105.2, 30.2, '四川']].forEach(([lon, lat, n]) => { const c = P([lon, lat]).map(Number); s += `<path d="M${c[0] - 9} ${c[1] - 2} Q${c[0]} ${c[1] + 8} ${c[0] + 9} ${c[1] - 2}" fill="#E8D4A8" stroke="#8C6B48" stroke-width="1.3"/><ellipse cx="${c[0]}" cy="${c[1] - 2}" rx="9" ry="2.6" fill="#F3E6C6" stroke="#8C6B48" stroke-width="1"/><text x="${c[0]}" y="${c[1] + 15}" font-size="9" font-weight="650" fill="#6B4E32" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="2.6">${n}</text>`; });
  // vignettes
  function vig(cx, cy, r, inner, label, ax, ay) {
    return `<path d="M${ax} ${ay} L${cx} ${cy}" stroke="#5E8A3A" stroke-width="1.2"/><g filter="url(#soft)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#5E8A3A" stroke-width="1.6"/></g>${inner}<rect x="${cx - 44}" y="${cy + r - 6}" width="88" height="17" rx="8.5" fill="#5E8A3A"/><text x="${cx}" y="${cy + r + 6}" font-size="10.5" font-weight="700" fill="#fff" text-anchor="middle">${label}</text>`;
  }
  const db = P([125, 45.6]).map(Number), hb = P([116.2, 36.4]).map(Number), cj = P([117, 30.8]).map(Number);
  // 东北: black soil + corn + snow
  let i1 = `<clipPath id="v1"><circle cx="298" cy="40" r="25"/></clipPath><g clip-path="url(#v1)"><rect x="270" y="14" width="56" height="52" fill="#EAF3F5"/><rect x="270" y="46" width="56" height="20" fill="#3E3128"/><path d="M270 50 L326 50" stroke="#5A4636" stroke-width="2"/>${[284, 296, 308].map(x => `<path d="M${x} 48 L${x} 26" stroke="#7FA65A" stroke-width="2"/><ellipse cx="${x + 3}" cy="33" rx="2.6" ry="6" fill="#E9C94E"/><path d="M${x} 38 q-6 -4 -8 -10 M${x} 30 q6 -4 7 -10" stroke="#7FA65A" stroke-width="1.6" fill="none"/>`).join('')}<text x="317" y="26" font-size="10" fill="#9FB8C4">❄</text></g>`;
  s += vig(298, 40, 25, i1, '东北平原 黑土', db[0] + 8, db[1] - 6);
  // 华北: wheat
  let i2 = `<clipPath id="v2"><circle cx="300" cy="112" r="25"/></clipPath><g clip-path="url(#v2)"><rect x="272" y="86" width="56" height="52" fill="#F6EED2"/>${[282, 290, 298, 306, 314].map((x, j) => `<path d="M${x} 136 L${x + 1} ${104 + j % 2 * 3}" stroke="#C9A64A" stroke-width="1.4"/><ellipse cx="${x + 1}" cy="${102 + j % 2 * 3}" rx="2.4" ry="6" fill="#E2B94A"/>`).join('')}</g>`;
  s += vig(300, 112, 25, i2, '华北平原 小麦', hb[0] + 8, hb[1]);
  // 长江中下游: paddies + lake + boat
  let i3 = `<clipPath id="v3"><circle cx="292" cy="182" r="25"/></clipPath><g clip-path="url(#v3)"><rect x="264" y="156" width="56" height="52" fill="#CFE6B4"/><path d="M264 190 Q292 182 320 194 L320 208 L264 208Z" fill="${K.water}"/>${[0, 1, 2].map(j => `<path d="M${270 + j * 16} 168 l12 0 l0 12 l-12 0 z" fill="#A9C77E" stroke="#E9F2DA" stroke-width="1"/>`).join('')}<path d="M284 196 l16 0 l-3 4 l-10 0 z" fill="#8A5E3C"/><path d="M292 196 L292 186 L299 194" fill="#F3E7D3" stroke="#8A5E3C" stroke-width=".8"/></g>`;
  s += vig(292, 182, 25, i3, '长江中下游 水稻', cj[0] + 10, cj[1] + 2);
  s += `<text x="16" y="226" font-size="10" fill="#8C7B6B">示意图 · 绿色 = 三大平原（都在第三级）· 碗 = 盆地</text>`;
  return s;
}


const B = basinBlock();
const geoSlides = [
  { svg: `<rect width="344" height="236" fill="url(#sky)"/>${washbasin(84, 118, 1.05)}
      <g transform="translate(150 40) scale(.56)">${basinBlock({ city: false })}</g>
      <path d="M150 128 q10 -16 24 -8" fill="none" stroke="${K.ink}" stroke-width="1.6" stroke-dasharray="4 3"/><path d="M170 116 l6 4 l-7 3" fill="none" stroke="${K.ink}" stroke-width="1.6"/>
      <text x="84" y="190" font-size="12.5" font-weight="700" fill="${K.ink}" text-anchor="middle">脸盆</text><text x="84" y="206" font-size="10.5" fill="#6E655C" text-anchor="middle">盆沿高，盆底低</text>
      <text x="246" y="190" font-size="12.5" font-weight="700" fill="${K.ink}" text-anchor="middle">盆地</text><text x="246" y="206" font-size="10.5" fill="#6E655C" text-anchor="middle">四周是山，中间是平地</text>`,
    cap: '<b>盆地</b>：四周高、中间低，像一只脸盆。', para: '<span class="lb">为什么</span>一级台阶的台面并不是一马平川，上面也有高有低。<b>盆地</b>是"四周高、中间低"的地形，像一只脸盆。' },
  { svg: `<rect width="344" height="236" fill="url(#sky)"/>${B}
      ${callout(60, 116, 64, 34, '边上一圈山 2000～3000 米', { anchor: 'start', c: '#7A4E2D' })}
      ${callout(200, 132, 232, 196, '盆底约 500 米，种满庄稼', { anchor: 'middle', c: '#4E7A32', isNew: true })}
      ${callout(300, 146, 330, 104, '河从山缺口流出', { anchor: 'end', c: K.waterD })}`,
    cap: '把<b>四川盆地</b>切开看：一圈山，围着一块平地。', para: '<span class="lb">白话</span>第二级海拔约 1000～2000 米，大高原、大盆地多。四川盆地、塔里木盆地、准噶尔盆地都在这一级。', folded: '已读：为什么（点开回看）' },
  { svg: `<rect width="344" height="236" fill="url(#sky)"/>${stairs()}${bowlOnStep(true)}
      ${callout(178, 104, 196, 30, '四川盆地：盆底再低，也坐在第二级', { anchor: 'middle', c: '#7A4E2D', isNew: true })}`,
    cap: '盆底再低，它也还在<b>第二级</b>台阶上。', para: '<span class="lb">打个比方</span>判断一块地形属于哪一级，要看它整个坐在哪一级台阶上。就像把脸盆放在二楼：盆底再低，它也还在二楼。', folded: '已读：为什么 · 白话' },
  { svg: `<rect width="344" height="236" fill="url(#sky)"/>${plainBlock()}
      ${callout(72, 92, 40, 30, '太行山', { anchor: 'start', c: '#7A4E2D' })}
      ${callout(190, 140, 150, 218, '华北平原：又低又平，多在 50 米以下', { anchor: 'middle', c: '#4E7A32', isNew: true })}
      ${callout(222, 128, 236, 32, '黄河', { anchor: 'middle', c: '#A0843E' })}
      ${callout(316, 132, 334, 214, '海', { anchor: 'end', c: K.waterD })}`,
    cap: '<b>平原</b>：又低又平，一直铺到海边。', para: '<span class="lb">白话</span>第三级多在 500 米以下，主要是平原和丘陵。站在华北平原上往东看，地平平地一直铺到海边。', folded: '已读：为什么 · 白话 · 打个比方' },
  { svg: chinaPoster(),
    cap: '三大平原都在第三级；四个盆地里，三个在第二级，柴达木在第一级。', para: '<span class="lb">举个例子</span>第三级有东北平原、华北平原、长江中下游平原和东南丘陵。<br><span class="lb">一句话</span><b>第二级多高原和盆地，第三级多平原和丘陵；盆地看它坐在哪一级。</b>', folded: '已读：为什么 · 白话 · 打个比方' }
];

const fill3 = Array.from({ length: 12 }, (_, m) => m < 3 ? '#D7E7F8' : '#fff');
const fill12 = Array.from({ length: 12 }, () => '#F8DCD3');
const S1 = `<rect width="344" height="236" fill="#FFFBF3"/>
  ${product(14, 28, '产品甲', '1%', '3 个月', A)}${product(180, 28, '产品乙', '3%', '1 年', Bc)}
  <text x="172" y="72" font-size="15" font-weight="800" fill="#6E655C" text-anchor="middle">vs</text>
  <text x="20" y="128" font-size="10.5" fill="${A}" font-weight="700">甲只存 3 个月</text>${ruler(20, 136, 304, { fill: fill3 })}
  <text x="20" y="186" font-size="10.5" fill="${Bc}" font-weight="700">乙存满一年</text>${ruler(20, 194, 304, { fill: fill12 })}`;
const finSlides = [
  { svg: S1, cap: '甲：3 个月赚 1%；乙：1 年赚 3%。哪个更好？', para: '<span class="lb">卡 4 · 白话</span>一个 3 个月赚 1%，一个 1 年赚 3%。直接比 1 和 3，是不公平的。' },
  { svg: `<rect width="344" height="236" fill="#F1F6EC"/>
      <path d="M0 150 L344 150 L344 236 L0 236Z" fill="#D9744E"/><path d="M0 150 L344 150" stroke="#fff" stroke-width="2"/><path d="M0 192 L344 192" stroke="#fff" stroke-width="2"/>
      ${[40, 120, 200, 280].map(x => `<path d="M${x} 236 L${x + 14} 150" stroke="#E79270" stroke-width="1"/>`).join('')}
      <path d="M24 175 L110 175" stroke="${A}" stroke-width="3" stroke-dasharray="6 4"/>${runner(118, 186, A)}${stopwatch(44, 118, '小 A 跑 3 分钟', A)}
      <path d="M24 217 L300 217" stroke="${Bc}" stroke-width="3" stroke-dasharray="6 4"/>${runner(306, 228, Bc)}${stopwatch(196, 118, '小 B 跑 12 分钟', Bc)}
      ${bubble(196, 52, '小 B 跑得远，|就是跑得快？', { tail: 200, tx: 214 })}`,
    cap: '像比赛跑：一个跑 3 分钟，一个跑 12 分钟。', para: '<span class="lb">卡 4 · 举个例子</span>只比谁跑得远，不公平。要都换成"每分钟跑多远"。比收益也一样：先换成同一段时间。' },
  { svg: `<rect width="344" height="236" fill="#FFFBF3"/>
      <text x="64" y="21" font-size="12.5" font-weight="800" fill="#2B2622">把"一年"当成一把尺子</text>
      ${ruler(20, 40, 304)}
      ${[0, 1, 2, 3].map(i => `<g ${i === 3 ? 'filter="url(#glow)"' : ''}><rect x="${20 + i * 76 + 2}" y="96" width="72" height="34" rx="8" fill="${i === 0 ? '#D7E7F8' : '#EEF5FC'}" stroke="${A}" stroke-width="1.6" ${i ? 'stroke-dasharray="5 3"' : ''}/><text x="${20 + i * 76 + 38}" y="112" font-size="10" fill="${A}" text-anchor="middle">第 ${i + 1} 个 3 个月</text><text x="${20 + i * 76 + 38}" y="125" font-size="12" font-weight="800" fill="${A}" text-anchor="middle">+1%</text></g>`).join('')}
      ${[0, 1, 2, 3].map(i => `<path d="M${20 + i * 76 + 38} 95 L${20 + i * 76 + 38} 70" stroke="${A}" stroke-width="1.4"/>`).join('')}
      <g filter="url(#soft)"><rect x="54" y="152" width="236" height="44" rx="12" fill="#2B2622"/></g>
      <text x="172" y="180" font-size="17" font-weight="800" fill="#fff" text-anchor="middle" font-family="sans-serif">1% × 4 ≈ <tspan fill="#F2C14E">4%</tspan> / 年</text>`,
    cap: '一年里能放下 4 个"3 个月"，每段赚 1%。', para: '<span class="lb">卡 5 · 推一下</span>一年有 4 个 3 个月。每 3 个月赚 1%。一年约 1% × 4 = 4%。', folded: '已读：卡 4（点开回看）' },
  { svg: `<rect width="344" height="236" fill="#FFFBF3"/>
      <text x="64" y="21" font-size="12.5" font-weight="800" fill="#2B2622">都换成"一年赚多少"，再比</text>
      <path d="M60 196 L320 196" stroke="${K.ink}" stroke-width="1.4"/>${[0, 1, 2, 3, 4].map(v => `<text x="52" y="${196 - v * 32 + 4}" font-size="10" fill="#A79E94" text-anchor="end">${v}%</text><path d="M60 ${196 - v * 32} L320 ${196 - v * 32}" stroke="#EFE6D6" stroke-width="1"/>`).join('')}
      <rect x="100" y="${196 - 4 * 32}" width="62" height="${4 * 32}" rx="6" fill="${A}"/><text x="131" y="${196 - 4 * 32 - 8}" font-size="15" font-weight="800" fill="${A}" text-anchor="middle">约 4%</text><text x="131" y="214" font-size="11.5" font-weight="700" fill="#2B2622" text-anchor="middle">产品甲（年化）</text>
      <rect x="216" y="${196 - 3 * 32}" width="62" height="${3 * 32}" rx="6" fill="${Bc}"/><text x="247" y="${196 - 3 * 32 - 8}" font-size="15" font-weight="800" fill="${Bc}" text-anchor="middle">3%</text><text x="247" y="214" font-size="11.5" font-weight="700" fill="#2B2622" text-anchor="middle">产品乙</text>
      <g filter="url(#glow)"><circle cx="160" cy="70" r="16" fill="#F2C14E"/></g><text x="160" y="75" font-size="13" font-weight="800" fill="#7A4E12" text-anchor="middle">赢</text>`,
    cap: '同一把"一年"的尺子上：甲约 4%，比乙的 3% 高。', para: '<span class="lb">卡 5 · 一句话</span><b>年化 = 换成"一年赚多少"，时长不同也能比。</b>', folded: '已读：卡 4 · 卡 5 白话 · 推一下' },
  { svg: `<rect width="344" height="236" fill="#FFFBF3"/>${phone(14, 30)}
      <g><rect x="124" y="34" width="206" height="44" rx="10" fill="#FCEBE4" stroke="#E0795B" stroke-width="1.3"/><text x="227" y="53" font-size="11.5" font-weight="700" fill="#B5584A" text-anchor="middle">误会：存 7 天就赚 3% = 300 元？</text><path d="M140 48 L314 66" stroke="#E0795B" stroke-width="2.4"/><text x="227" y="71" font-size="10" fill="#B5584A" text-anchor="middle">不是</text></g>
      <text x="126" y="102" font-size="11.5" font-weight="800" fill="#2B2622">真相：按这 7 天的赚法，一年约 3%</text>
      ${Array.from({ length: 7 }, (_, i) => `<rect x="${128 + i * 28}" y="112" width="24" height="24" rx="5" fill="#fff" stroke="#D9C9AA"/><text x="${140 + i * 28}" y="128" font-size="9.5" fill="#6E655C" text-anchor="middle">${i + 1}日</text>${stack(140 + i * 28, 160, 1)}`).join('')}
      <text x="128" y="186" font-size="10.5" fill="#6E655C">每天约 0.82 元</text>
      <g filter="url(#glow)"><rect x="210" y="176" width="120" height="40" rx="10" fill="#2B2622"/></g><text x="270" y="192" font-size="10.5" fill="#F3E7D3" text-anchor="middle">存 7 天，约拿到</text><text x="270" y="209" font-size="15" font-weight="800" fill="#F2C14E" text-anchor="middle">5.75 元</text>`,
    cap: '广告上的"7 日年化 3%"：是换算成一年，不是 7 天就赚 3%。', para: '<span class="lb">卡 6 · 推一下</span>1 万元存满一年，约得 10000 × 3% = 300 元；一天约 300 ÷ 365 ≈ 0.82 元；存 7 天：0.82 × 7 ≈ 5.75 元。<br><span class="lb">一句话</span><b>年化是换算出来的尺子；存多久，才拿多久的份。</b>', folded: '已读：卡 4 · 卡 5' }
];

const H1 = `${floor('#F6EADB')}<rect x="0" y="168" width="344" height="68" fill="#D8BE98"/>${[0, 1, 2, 3, 4, 5, 6].map(i => `<path d="M${i * 60 - 20} 236 L${i * 60 + 10} 168" stroke="#C7AA80" stroke-width="1"/>`).join('')}
  ${[40, 304].map(x => `<rect x="${x - 7}" y="20" width="14" height="150" fill="#B5584A"/><rect x="${x - 10}" y="160" width="20" height="10" fill="#8E3F33"/>`).join('')}
  <rect x="122" y="118" width="100" height="58" rx="4" fill="#8E3F33" stroke="${K.ink}"/><rect x="128" y="112" width="88" height="10" rx="3" fill="#6E3028"/>
  ${figure(172, 146, { k: .9, robe: QIN, trim: RED, belt: '#C99A3A', hat: 'mian', face: 'calm', left: 'hold', right: 'hold' })}<text x="172" y="168" font-size="11" font-weight="800" fill="#F2C14E" text-anchor="middle">秦始皇</text>
  ${figure(80, 214, { k: .92, robe: '#7D8FB0', hat: 'guan', beard: true, right: 'point', face: 'calm' })}${tag(80, 230, '丞相 王绾')}
  ${figure(266, 214, { k: .92, robe: '#8C6E9A', hat: 'guan', flip: true, right: 'point', face: 'stern' })}${tag(266, 230, '廷尉 李斯')}
  ${bubble(80, 104, '燕、齐、楚太远，|派皇子去当王！', { fs: 10.5, tail: 84 })}${bubble(266, 104, '周朝的亲戚，|后来互相打仗！', { fs: 10.5, tail: 262 })}`;

function gen(x, label, c1, c2, rel, o) {
  o = o || {};
  return `<g><rect x="${x}" y="22" width="104" height="186" rx="10" fill="#fff" stroke="#E7D8C2"/>
  <text x="${x + 52}" y="40" font-size="11.5" font-weight="800" fill="#B5584A" text-anchor="middle">${label}</text>
  ${fort(x + 52, 88, 34, RED, { ch: '王', tc: '#fff', name: '天子' })}
  <path d="M${x + 40} 102 L${x + 26} 140" stroke="${o.tie || RED}" stroke-width="${o.w || 2.6}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/><path d="M${x + 64} 102 L${x + 78} 140" stroke="${o.tie || RED}" stroke-width="${o.w || 2.6}" ${o.dash ? `stroke-dasharray="${o.dash}"` : ''}/>
  ${fort(x + 24, 170, 28, c1)}${fort(x + 80, 170, 28, c2)}
  <text x="${x + 52}" y="198" font-size="9.5" fill="#6E655C" text-anchor="middle">${rel}</text>${o.extra || ''}</g>`;
}
const H2 = `${floor()}${gen(8, '第 1 代', RED, RED, '亲兄弟，一条心')}
  ${gen(120, '第 3 代', '#D98B6A', '#C27BA0', '堂兄弟，见得少', { w: 1.6, dash: '5 3', tie: '#D9A79E' })}
  ${gen(232, '第 8 代', '#4F86C6', '#5A9A5A', '早不认得了', { w: 0, extra: `<g filter="url(#glow)"><path d="M273 150 L291 166 M291 150 L273 166" stroke="#5A4636" stroke-width="3" stroke-linecap="round"/></g><text x="282" y="144" font-size="9" font-weight="800" fill="#B5413A" text-anchor="middle">互相打</text><path d="M262 114 L270 122 L264 128 L272 136" fill="none" stroke="#B5413A" stroke-width="1.6"/><path d="M302 114 L294 122 L300 128 L292 136" fill="none" stroke="#B5413A" stroke-width="1.6"/>` })}`;

const H3 = S.commanderies();

const H4 = `${floor('#F3EEE2')}
  <path d="M0 150 Q120 132 344 158 L344 236 L0 236Z" fill="#DCCFA8"/><path d="M150 140 Q170 120 200 140 Q186 132 176 136Z" fill="#B8A57E"/>${mountain(172, 146, 60, 38, { c: '#BBA07E', cd: '#9C8264' })}
  ${fort(58, 160, 40, QIN, { ch: '秦', name: '甲县' })}${fort(290, 166, 40, QIN, { ch: '秦', name: '乙县 · 千里外' })}
  <path d="M84 120 Q172 40 262 118" fill="none" stroke="${K.gold}" stroke-width="2.4" stroke-dasharray="6 4"/><path d="M254 112 L263 120 L251 122" fill="none" stroke="${K.gold}" stroke-width="2.4"/>
  <g filter="url(#glow)">${figure(172, 94, { k: .62, robe: '#5E6E8C', hat: 'guan', beard: true, right: 'hold' })}</g>${bag(186, 92, '书')}
  ${callout(172, 54, 172, 26, '干几年就调走：在哪儿都扎不下根', { anchor: 'middle', isNew: true, fs: 10 })}
  ${figure(28, 214, { k: .55, robe: '#9FB5CF', hat: 'bun', face: 'worry' })}<g><rect x="42" y="176" width="92" height="22" rx="11" fill="#fff" stroke="#C8463A"/><text x="88" y="191" font-size="10" font-weight="700" fill="#B5413A" text-anchor="middle">儿子接班？不行</text></g>`;

const H5 = `${floor('#F6EEE0')}
  <rect x="96" y="86" width="152" height="10" fill="#D9C3A0" stroke="${K.ink}"/><rect x="104" y="40" width="136" height="46" fill="#EFE3CB" stroke="${K.ink}"/><path d="M90 42 Q172 22 254 42 L244 30 Q172 14 100 30 Z" fill="${QIN}"/><text x="172" y="68" font-size="12" font-weight="800" fill="${K.ink}" text-anchor="middle">某某郡 · 郡府</text>
  <path d="M172 96 L172 214" stroke="#B5584A" stroke-width="1.6" stroke-dasharray="5 4"/>
  ${figure(110, 196, { k: .9, robe: '#5E6E8C', hat: 'guan', beard: true, right: 'give' })}${seal(137, 167)}${tag(110, 214, '郡守：管百姓、收税')}
  ${figure(234, 196, { k: .9, robe: '#7A5A44', hat: 'helmet', flip: true, right: 'give', face: 'stern' })}${tally(206, 166)}${tag(234, 214, '郡尉：管兵')}
  <text x="137" y="150" font-size="9" fill="#C8463A" font-weight="700" text-anchor="middle">官印</text><text x="206" y="186" font-size="9" fill="#9A6E1E" font-weight="700" text-anchor="middle">虎符</text>
  <g filter="url(#glow)">${bag(36, 156, '俸')}${bag(308, 156, '俸')}</g>
  ${callout(36, 116, 18, 104, '工资：皇帝发', { isNew: true, fs: 9.5 })}${callout(308, 116, 326, 104, '工资：皇帝发', { anchor: 'end', isNew: true, fs: 9.5 })}`;

const H6 = `${floor()}<rect x="10" y="12" width="158" height="212" rx="12" fill="#FFF4EC" stroke="#E7C7B8"/><rect x="176" y="12" width="158" height="212" rx="12" fill="#EEF2F6" stroke="#C3CEDA"/>
  <text x="89" y="34" font-size="14" font-weight="800" fill="#B5584A" text-anchor="middle">分封</text><text x="255" y="34" font-size="14" font-weight="800" fill="#3E5470" text-anchor="middle">郡县</text>
  ${fort(89, 112, 30, RED, { ch: '王', tc: '#fff' })}${[[38, 92], [140, 92], [52, 150], [126, 150]].map(([x, y]) => `<path d="M89 100 L${x} ${y}" stroke="#D9A79E" stroke-width="1.4" stroke-dasharray="4 3"/><path d="M${x} ${y} l${x < 89 ? -8 : 8} ${y < 112 ? -4 : 4}" stroke="#B5413A" stroke-width="1.8"/>${fort(x, y + 10, 20, ['#4F86C6', '#5A9A5A', '#C27BA0', '#D98B6A'][(x + y) % 4])}`).join('')}
  ${palace(255, 110)}${[[204, 76], [306, 76], [210, 160], [300, 160]].map(([x, y]) => `<path d="M${x} ${y} L255 100" stroke="#3E5470" stroke-width="1.6"/><path d="M${x + (255 - x) * .72} ${y + (100 - y) * .72} l${x < 255 ? 2 : -2} ${y < 100 ? 6 : -6}" stroke="#3E5470" stroke-width="1.6"/>${fort(x, y + 8, 20, QIN, { ch: '秦' })}`).join('')}
  <text x="89" y="190" font-size="11" font-weight="800" fill="#B5584A" text-anchor="middle">靠血缘 · 权在地方</text><text x="89" y="208" font-size="9.5" fill="#8A5A4E" text-anchor="middle">亲戚越传越远</text>
  <text x="255" y="190" font-size="11" font-weight="800" fill="#3E5470" text-anchor="middle">靠制度 · 权在中央</text><text x="255" y="208" font-size="9.5" fill="#4E607A" text-anchor="middle">换了人，规矩不变</text>`;

const histSlides = [
  { svg: H1, cap: '朝堂上吵起来：远方要不要分给皇子当王？', para: '<span class="lb">卡 2 · 白话</span>王绾说：燕、齐、楚离咸阳太远，不派皇子去当王，管不住。李斯反对：周朝分封的亲戚，后来互相打成了仇人。秦始皇选了李斯。' },
  { svg: H2, cap: '分封：亲戚一代代变远，最后成了对手。', para: '<span class="lb">卡 2 · 为什么</span>分出去的地，传给自己的儿子孙子。几代以后，大家只认自己的小国，不认天子。', folded: '已读：卡 2 白话' },
  { svg: H3, cap: '郡县：各地的官都是皇帝派去的。', para: '<span class="lb">卡 3 · 白话</span>全国分成 36 郡，郡下面再分县。郡守、县令由皇帝任命，可以调走，不能传给儿子。<br><span class="lb">打个比方</span>分封像加盟店，店是老板自己的；郡县像直营店，店长是总部派的。', folded: '已读：卡 2' },
  { svg: H4, cap: '不世袭、常调动：官在一个地方扎不下根。', para: '<span class="lb">卡 4 · 举个例子</span>一个县令在甲县干了几年，就被调到千里外的乙县。他的儿子不能接他的班。地方就不会变成谁家的。', folded: '已读：卡 2 · 卡 3' },
  { svg: H5, cap: '工资皇帝发；管百姓和管兵，分给两个人。', para: '<span class="lb">卡 4 · 为什么</span>官拿的是皇帝发的俸禄，就得听皇帝的。郡守管百姓和收税，郡尉管兵；调兵要有虎符。一个人想造反，手里也没兵。', folded: '已读：卡 2 · 卡 3 · 卡 4 例子' },
  { svg: H6, cap: '分封靠血缘，会变淡；郡县靠制度，不会。', para: '<span class="lb">卡 5 · 一句话</span><b>分封把权分给亲戚，权在地方；郡县把权收回中央，靠制度管人。血缘会变淡，制度不会。</b>', folded: '已读：卡 2 – 卡 4' }
];

  function capOf(html) {
    return String(html || '').replace(/<b>/g, '**').replace(/<\/b>/g, '**').replace(/<[^>]+>/g, '');
  }
  geoSlides.forEach(function (sl, i) { S.register('s14.geo.' + (i + 1), function () { return sl.svg; }); });
  finSlides.forEach(function (sl, i) { S.register('s14.fin.' + (i + 1), function () { return sl.svg; }); });
  histSlides.forEach(function (sl, i) { S.register('s14.hist.' + (i + 1), function () { return sl.svg; }); });
  S.sampleCaps = {
    geo: geoSlides.map(function (sl) { return capOf(sl.cap); }),
    fin: finSlides.map(function (sl) { return capOf(sl.cap); }),
    hist: histSlides.map(function (sl) { return capOf(sl.cap); })
  };
  S.part('脸盆', washbasin(80, 78, 0.85));
  S.part('盆地', '<g transform="translate(8 8) scale(.42)">' + basinBlock({ city: false }) + '</g>');
})(window);
