(function (global) {
// s14 picture-book kit: concrete, hand-drawn-looking flat illustration helpers (SVG strings).
const K = {
  ink: '#4A3B30', paper: '#FBF6EE', shade: 'rgba(74,59,48,.14)', hi: 'rgba(255,255,255,.35)',
  snow: '#F7F4EF', rock: '#A88B6E', rockD: '#8A6F57', high: '#C9A27E', mid: '#DDBF8F', plain: '#B9CF8E', plainD: '#9FBF74',
  wheat: '#E2CF7E', rice: '#A9C77E', water: '#7FB6CF', waterD: '#5E9DBB', sea: '#A9D0DC', soil1: '#C49A6C', soil2: '#B0855A', soil3: '#9A7048',
  gold: '#F2B640', new: '#F2B640',
  skin: '#F4D3B5', hair: '#2F2622', robe: '#8FA7C9', wood: '#7A5A3A', leaf: '#7FA65A', leaf2: '#95BC6E',
  roof: '#B5584A', wall: '#F3E7D3', red: '#C8463A', qin: '#2B2622'
};
const f = n => (+n).toFixed(1);
function defs(extra) {
  return `<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAF3F5"/><stop offset="1" stop-color="#FBF6EE"/></linearGradient>
  <linearGradient id="basin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E9EEF0"/><stop offset="1" stop-color="#C9D3D8"/></linearGradient>
  <linearGradient id="waterG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9CCBE0"/><stop offset="1" stop-color="#6FA9C6"/></linearGradient>
  <filter id="soft"><feDropShadow dx="0" dy="1.5" stdDeviation="1.6" flood-color="#4A3B30" flood-opacity=".22"/></filter>
  <filter id="glow"><feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#F2B640" flood-opacity=".9"/></filter>
  <pattern id="paper" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#FBF6EE"/><circle cx="2" cy="3" r=".5" fill="#EADFCF"/><circle cx="6" cy="6" r=".4" fill="#EFE5D6"/></pattern>
  ${extra || ''}</defs>`;
}
// label with leader line; tone: 'ink' | color
function callout(x, y, lx, ly, text, o) {
  o = o || {}; const c = o.c || K.ink, w = text.length * (o.fs || 11.5) + 14, h = 22;
  const bx = o.anchor === 'end' ? lx - w : (o.anchor === 'middle' ? lx - w / 2 : lx);
  return `<g ${o.isNew ? 'filter="url(#glow)"' : ''}><path d="M${f(x)} ${f(y)} L${f(lx + (o.anchor === 'end' ? -2 : (o.anchor === 'middle' ? 0 : 2)))} ${f(ly)}" stroke="${c}" stroke-width="1.2" fill="none"/><circle cx="${f(x)}" cy="${f(y)}" r="2.6" fill="${c}"/>
  <rect x="${f(bx)}" y="${f(ly - h / 2)}" width="${f(w)}" height="${h}" rx="6" fill="${o.fill || '#fff'}" stroke="${c}" stroke-width="1.2"/>
  <text x="${f(bx + w / 2)}" y="${f(ly + 4)}" font-size="${o.fs || 11.5}" font-weight="650" fill="${o.tc || c}" text-anchor="middle">${text}</text></g>`;
}
function newRing(x, y, r) { return `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="none" stroke="${K.gold}" stroke-width="2.5" stroke-dasharray="5 4"/>`; }
function star(x, y, r, c) { let d = ''; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; d += (i ? 'L' : 'M') + f(x + rr * Math.cos(a)) + ' ' + f(y + rr * Math.sin(a)); } return `<path d="${d}Z" fill="${c}"/>`; }
// ---------- terrain pieces ----------
// mountain: base center x, base y, width, height, snow?
function mountain(x, y, w, h, o) {
  o = o || {}; const c = o.c || K.rock, cd = o.cd || K.rockD;
  const L = x - w / 2, R = x + w / 2, tx = x + (o.skew || 0), ty = y - h;
  let s = `<path d="M${f(L)} ${f(y)} L${f(tx)} ${f(ty)} L${f(R)} ${f(y)} Z" fill="${c}"/>`;
  s += `<path d="M${f(tx)} ${f(ty)} L${f(R)} ${f(y)} L${f(tx + w * .08)} ${f(y)} Z" fill="${cd}"/>`;
  if (o.snow) s += `<path d="M${f(tx - w * .13)} ${f(ty + h * .26)} L${f(tx)} ${f(ty)} L${f(tx + w * .13)} ${f(ty + h * .26)} L${f(tx + w * .05)} ${f(ty + h * .2)} L${f(tx)} ${f(ty + h * .3)} L${f(tx - w * .05)} ${f(ty + h * .2)} Z" fill="${K.snow}"/>`;
  return s;
}
function tree(x, y, k, c) { k = k || 1; return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><rect x="-.8" y="-3" width="1.6" height="4" fill="${K.wood}"/><circle cx="0" cy="-6" r="4" fill="${c || K.leaf}"/><circle cx="1.3" cy="-7" r="2" fill="${K.leaf2}"/></g>`; }
function house(x, y, k) { k = k || 1; return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><rect x="-4" y="-5" width="8" height="5" fill="${K.wall}" stroke="${K.ink}" stroke-width=".6"/><path d="M-5 -5 L0 -9 L5 -5Z" fill="${K.roof}" stroke="${K.ink}" stroke-width=".6"/></g>`; }
function city(x, y, name, o) { o = o || {}; return `<g>${house(x - 5, y, 1)}${house(x + 3, y + 2, 1.15)}${house(x + 9, y - 1, .9)}<text x="${f(x + 2)}" y="${f(y + 13)}" font-size="10" font-weight="700" fill="${K.ink}" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">${name}</text></g>`; }
// patchwork fields inside an ellipse (clipped)
function fields(id, cx, cy, rx, ry, cols, seed) {
  let s = `<clipPath id="${id}"><ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}"/></clipPath><g clip-path="url(#${id})">`;
  const pal = cols || [K.wheat, K.rice, '#C8D98F', '#D9C27A', '#B4CC86'];
  let r = seed || 7; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  let row = 0;
  for (let gy = cy - ry; gy < cy + ry; gy += 7, row++) {
    let gx = cx - rx - (row % 2) * 7;
    while (gx < cx + rx) { const w = 9 + Math.floor(rnd() * 10); s += `<path d="M${f(gx + 2.5)} ${f(gy)} l${w} 0 l-2.5 7 l-${w} 0 Z" fill="${pal[Math.floor(rnd() * pal.length)]}" stroke="#F4EBD0" stroke-width=".7"/>`; gx += w; }
  }
  return s + '</g>';
}
// ---------- people (picture-book figures, ~1:4.5 head ratio) ----------
function figure(x, y, o) {
  o = o || {}; const k = o.k || 1, robe = o.robe || K.robe, trim = o.trim || K.wall, skin = K.skin, hair = K.hair;
  const fl = o.flip ? -1 : 1;
  let g = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * fl)} ${f(k)})" stroke-linejoin="round" stroke-linecap="round">`;
  // shadow
  g += `<ellipse cx="0" cy="1" rx="15" ry="3" fill="rgba(74,59,48,.18)"/>`;
  // robe (wide hem) with trim
  g += `<path d="M-9 -44 Q-15 -20 -16 0 L16 0 Q15 -20 9 -44 Z" fill="${robe}" stroke="${K.ink}" stroke-width="1.3"/>`;
  g += `<path d="M-16 0 L16 0 L15.4 -4 L-15.4 -4 Z" fill="${trim}" opacity=".9"/>`;
  g += `<path d="M-6 -44 L3 -30 L0 0" fill="none" stroke="${trim}" stroke-width="2.4"/><path d="M-6 -44 L3 -30 L0 0" fill="none" stroke="${K.ink}" stroke-width=".7" opacity=".5"/>`;
  g += `<path d="M-10 -26 L10 -26" stroke="${o.belt || '#3A302A'}" stroke-width="2.4"/>`;
  g += `<path d="M2 -44 Q10 -22 9 0" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="6"/>`;
  // sleeves/arms by pose
  const arm = (side, pose) => {
    const s = side; // 1 right, -1 left
    if (pose === 'up') return `<path d="M${9 * s} -42 Q${20 * s} -50 ${22 * s} -62" fill="none" stroke="${robe}" stroke-width="7"/><path d="M${9 * s} -42 Q${20 * s} -50 ${22 * s} -62" fill="none" stroke="${K.ink}" stroke-width="1.1" opacity=".55"/><circle cx="${22 * s}" cy="-64" r="2.8" fill="${skin}" stroke="${K.ink}" stroke-width=".9"/>`;
    if (pose === 'point') return `<path d="M${9 * s} -42 Q${22 * s} -40 ${30 * s} -46" fill="none" stroke="${robe}" stroke-width="7"/><path d="M${9 * s} -42 Q${22 * s} -40 ${30 * s} -46" fill="none" stroke="${K.ink}" stroke-width="1.1" opacity=".55"/><circle cx="${32 * s}" cy="-47" r="2.8" fill="${skin}" stroke="${K.ink}" stroke-width=".9"/>`;
    if (pose === 'give') return `<path d="M${9 * s} -42 Q${20 * s} -32 ${28 * s} -32" fill="none" stroke="${robe}" stroke-width="7"/><path d="M${9 * s} -42 Q${20 * s} -32 ${28 * s} -32" fill="none" stroke="${K.ink}" stroke-width="1.1" opacity=".55"/><circle cx="${30 * s}" cy="-32" r="2.8" fill="${skin}" stroke="${K.ink}" stroke-width=".9"/>`;
    if (pose === 'hold') return `<path d="M${9 * s} -42 Q${14 * s} -30 ${4 * s} -28" fill="none" stroke="${robe}" stroke-width="7"/><path d="M${9 * s} -42 Q${14 * s} -30 ${4 * s} -28" fill="none" stroke="${K.ink}" stroke-width="1.1" opacity=".55"/>`;
    return `<path d="M${9 * s} -42 Q${14 * s} -26 ${12 * s} -16" fill="none" stroke="${robe}" stroke-width="7"/><path d="M${9 * s} -42 Q${14 * s} -26 ${12 * s} -16" fill="none" stroke="${K.ink}" stroke-width="1.1" opacity=".55"/><circle cx="${12 * s}" cy="-14" r="2.6" fill="${skin}" stroke="${K.ink}" stroke-width=".9"/>`;
  };
  g += arm(-1, o.left) + arm(1, o.right);
  // neck + head
  g += `<rect x="-2.5" y="-48" width="5" height="5" fill="${skin}"/>`;
  g += `<ellipse cx="0" cy="-57" rx="9.5" ry="10.5" fill="${skin}" stroke="${K.ink}" stroke-width="1.2"/>`;
  g += `<path d="M-9.6 -58 Q-9 -69 0 -69 Q9 -69 9.6 -58 Q5 -63 0 -63.5 Q-5 -63 -9.6 -58Z" fill="${hair}"/>`;
  if (!o.hat || o.hat === 'bun') g += `<circle cx="0" cy="-70" r="4" fill="${hair}"/>`;
  // face
  const mood = o.face || 'calm';
  g += `<circle cx="-3.4" cy="-56" r="1.1" fill="${K.ink}"/><circle cx="3.4" cy="-56" r="1.1" fill="${K.ink}"/>`;
  if (mood === 'stern') g += `<path d="M-5.5 -59.5 L-1.8 -58.6 M5.5 -59.5 L1.8 -58.6" stroke="${K.ink}" stroke-width="1"/><path d="M-2.2 -50.5 L2.2 -50.5" stroke="${K.ink}" stroke-width="1"/>`;
  else if (mood === 'worry') g += `<path d="M-5.5 -59.6 L-2 -60.4 M5.5 -59.6 L2 -60.4" stroke="${K.ink}" stroke-width="1"/><path d="M-2 -50 Q0 -51.6 2 -50" fill="none" stroke="${K.ink}" stroke-width="1"/>`;
  else g += `<path d="M-2.2 -51.2 Q0 -49.6 2.2 -51.2" fill="none" stroke="${K.ink}" stroke-width="1"/>`;
  g += `<circle cx="-6" cy="-52.5" r="1.8" fill="#EFA8A0" opacity=".5"/><circle cx="6" cy="-52.5" r="1.8" fill="#EFA8A0" opacity=".5"/>`;
  if (o.beard) g += `<path d="M-4 -48.5 Q0 -42 4 -48.5" fill="${hair}"/><path d="M-4.5 -51.5 Q-2 -52.5 0 -51.8 Q2 -52.5 4.5 -51.5" fill="none" stroke="${hair}" stroke-width="1.1"/>`;
  // hats
  if (o.hat === 'mian') g += `<rect x="-13" y="-74" width="26" height="3.6" rx="1" fill="#2B2622"/><rect x="-6" y="-71" width="12" height="4" fill="#2B2622"/>${[-11, -7, -3, 1, 5, 9].map(t => `<line x1="${t + 1}" y1="-70.4" x2="${t + 1}" y2="-63" stroke="#E3B340" stroke-width=".9"/><circle cx="${t + 1}" cy="-62.6" r=".9" fill="#E3B340"/>`).join('')}`;
  if (o.hat === 'guan') g += `<path d="M-6 -67 L-4 -76 L5 -76 L6 -67 Z" fill="#2B2622"/><path d="M-8 -66.5 L8 -66.5" stroke="#2B2622" stroke-width="2"/>`;
  if (o.hat === 'wusha') g += `<path d="M-8 -64 Q-8 -73 0 -73 Q8 -73 8 -64 Z" fill="#2B2622"/><path d="M-8 -66 L-17 -68 M8 -66 L17 -68" stroke="#2B2622" stroke-width="2.4"/>`;
  if (o.hat === 'helmet') g += `<path d="M-10.5 -60 Q-10 -73 0 -73 Q10 -73 10.5 -60 L7 -62 L-7 -62 Z" fill="#8A8178" stroke="${K.ink}" stroke-width="1"/><path d="M0 -73 L0 -79" stroke="#B5413A" stroke-width="2.4"/>`;
  g += '</g>';
  return g;
}
function bubble(x, y, text, o) {
  o = o || {}; const lines = text.split('|'), fs = o.fs || 11.5, w = Math.max(...lines.map(l => l.length)) * fs + 16, h = lines.length * (fs + 4) + 10;
  const bx = x - w / 2, by = y - h, tx = o.tail != null ? o.tail : x;
  if (o.cloud) {
    const tip = o.tx != null ? o.tx : tx;
    return `<g filter="url(#soft)"><rect x="${f(bx)}" y="${f(by)}" width="${f(w)}" height="${f(h)}" rx="16" fill="#fff" stroke="${K.ink}" stroke-width="1.2"/>
    <circle cx="${f(tx - 8)}" cy="${f(by + h + 7)}" r="5.5" fill="#fff" stroke="${K.ink}" stroke-width="1.1"/>
    <circle cx="${f(tip)}" cy="${f(by + h + 16)}" r="3.4" fill="#fff" stroke="${K.ink}" stroke-width="1"/></g>
    ${lines.map((l, i) => `<text x="${f(x)}" y="${f(by + 16 + i * (fs + 4))}" font-size="${fs}" font-weight="650" fill="${K.ink}" text-anchor="middle">${l}</text>`).join('')}`;
  }
  return `<g filter="url(#soft)"><rect x="${f(bx)}" y="${f(by)}" width="${f(w)}" height="${f(h)}" rx="9" fill="#fff" stroke="${K.ink}" stroke-width="1.2"/><path d="M${f(tx - 5)} ${f(by + h - .6)} L${f(o.tx != null ? o.tx : tx)} ${f(by + h + 9)} L${f(tx + 5)} ${f(by + h - .6)}" fill="#fff" stroke="${K.ink}" stroke-width="1.2"/><rect x="${f(tx - 4.4)}" y="${f(by + h - 2.4)}" width="8.8" height="3" fill="#fff"/></g>
  ${lines.map((l, i) => `<text x="${f(x)}" y="${f(by + 15 + i * (fs + 4))}" font-size="${fs}" font-weight="650" fill="${K.ink}" text-anchor="middle">${l}</text>`).join('')}`;
}

const CN = {
  outline: [[122.5,53.5],[126,52.8],[127.5,49.8],[130.5,48.5],[132.5,47.7],[134.7,48.3],[133.5,46],[131.5,45],[131,43],[130.6,42.4],[128,41.5],[126,40.8],[124.3,39.9],[122.2,40.5],[121.2,38.8],[121.9,40.9],[120.5,40.2],[119.5,39.8],[118,39.1],[117.7,38.9],[118.5,38],[118.9,37.5],[119.5,37.2],[120.7,37.8],[122.5,37.4],[121,36.5],[120.3,36],[119.3,35],[120.3,34.3],[120.9,32.6],[121.9,31.7],[121.9,30.9],[121,30.3],[122,29.9],[121.6,28.7],[120.7,27.9],[119.6,26.6],[119.5,25.4],[118.1,24.5],[116.6,23.3],[114.3,22.4],[113.5,22.2],[112,21.7],[110.4,21.2],[110.2,20.3],[109.7,21.5],[108.4,21.6],[108,21.5],[106.7,22],[105.8,22.9],[104,22.7],[103,22.5],[102.2,22.4],[101.6,21.2],[100.2,21.5],[99.2,22.1],[99.5,23],[98.7,24.1],[97.6,23.9],[97.5,25.3],[98.6,27.4],[97.6,28.3],[96.5,29],[95.3,28.2],[94,27.6],[92,26.9],[88.8,27.3],[88.1,27.9],[86,27.9],[84,28.6],[82,30],[81,30.3],[79,31],[78.7,32.5],[79.4,34],[78,35.5],[76,35.8],[75,36.8],[74.6,37.3],[73.6,39.4],[74,40],[75.6,40.6],[76.8,41],[78.4,41.4],[80.2,42.1],[80.8,43.2],[80.2,44.9],[82.5,45.2],[83,47.2],[85.6,47.1],[87.3,49.1],[88.8,48.1],[90.8,46.2],[90.9,45.3],[93.5,44.9],[95.4,44.2],[96.4,42.7],[100,42.6],[101.8,42.5],[105,41.6],[107,42],[109.2,42.5],[111.8,43.7],[111.4,44.4],[113.6,44.8],[116,45.7],[117.5,46.6],[119.7,46.7],[119.9,47.6],[115.5,47.9],[117.4,49.6],[119.2,50.3],[120.8,52.6]],
  line1: [[75.5,36.6],[80,36.2],[86,36.4],[90,36.9],[94,38.6],[98,39.4],[101,38],[103,36],[102.6,33],[102.2,30],[101.2,27.6],[99.4,25.2],[98.4,24]],
  line2: [[122.4,53],[121.4,51],[120,48],[119,45],[117.2,42.5],[115.6,40.5],[114,37.5],[113,35.3],[111.4,32.6],[110.5,31.2],[110.6,28.2],[110,26],[108.4,24.2],[106.6,22.6]],
  yangtze: [[91,33.5],[95,33],[97.5,31.5],[99.5,28],[100.3,26.5],[102.5,26.2],[104.6,28.8],[106.5,29.6],[108.5,30.6],[111.3,30.7],[112.5,30],[114.3,30.6],[116.2,29.7],[118.5,31.3],[119.5,32.2],[121.5,31.6]],
  yellow: [[96,35],[98.5,34.8],[101.5,33.8],[102.5,35.5],[103.8,36.1],[106,37.5],[106.8,39.5],[109,40.6],[111.2,40.3],[110.6,38.3],[110.4,35],[111.5,34.7],[113.6,34.8],[114.4,34.8],[116.9,36.6],[118.9,37.6]],
  qinling: [[104,33.5],[107,33.8],[110,33.7],[113,32.6],[116,32.7],[119,33.2],[120.5,33.5]],
  rain800: [[104,33],[107,33.3],[110,33.2],[113,32.6],[116,32.7],[119,33.2],[120.5,33.5]],
  lat25: [[97,25],[124,25]],
  lat35: [[90,35],[126,35]],
  anhui: [[115.4,34.2],[116.2,34.6],[117.4,34.4],[118.2,33.6],[118.8,32.6],[118.6,31.2],[118.2,30.2],[117.2,29.8],[116.4,30],[115.8,30.6],[115.2,31.6],[115.2,33],[115.4,34.2]],
  jiangsu: [[116.6,34.6],[118.2,34.8],[119.4,34.6],[120.6,34],[121.4,32.6],[121.8,32],[120.8,31.6],[119.6,31.4],[118.8,31.8],[118.2,32.4],[117.2,33],[116.4,33.8],[116.6,34.6]]
};
function proj(o) {
  const s = o.s, x0 = o.lon0 || 72.5, y0 = o.lat0 || 54.5;
  return function (p) { return [((p[0] - x0) * 0.82 * s + (o.dx || 0)).toFixed(1), ((y0 - p[1]) * s + (o.dy || 0)).toFixed(1)]; };
}
function pathOf(pts, P, close) { return pts.map((p, i) => (i ? 'L' : 'M') + P(p).join(' ')).join(' ') + (close ? 'Z' : ''); }
function smooth(pts, P) {
  const q = pts.map(P).map(a => a.map(Number));
  let d = 'M' + q[0].join(' ');
  for (let i = 1; i < q.length - 1; i++) {
    const mx = (q[i][0] + q[i + 1][0]) / 2, my = (q[i][1] + q[i + 1][1]) / 2;
    d += ' Q' + q[i].join(' ') + ' ' + mx.toFixed(1) + ' ' + my.toFixed(1);
  }
  return d + ' L' + q[q.length - 1].join(' ');
}


function coin(x, y, r) { return `<g><ellipse cx="${x}" cy="${y + 1.5}" rx="${r}" ry="${r * .9}" fill="#B9802A"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${r * .9}" fill="#F2C14E" stroke="#B9802A" stroke-width="1"/><text x="${x}" y="${y + r * .38}" font-size="${r * 1.05}" font-weight="800" fill="#B9802A" text-anchor="middle">¥</text></g>`; }
function stack(x, y, n) { let s = ''; for (let i = 0; i < n; i++) s += `<ellipse cx="${x}" cy="${y - i * 4 + 1.6}" rx="11" ry="4" fill="#B9802A"/><ellipse cx="${x}" cy="${y - i * 4}" rx="11" ry="4" fill="#F2C14E" stroke="#B9802A" stroke-width=".8"/>`; return s; }
function product(x, y, name, rate, dur, c, o) {
  o = o || {};
  return `<g filter="url(#soft)"><rect x="${x}" y="${y}" width="150" height="76" rx="12" fill="#fff"/></g>
  <rect x="${x}" y="${y}" width="150" height="22" rx="12" fill="${c}"/><rect x="${x}" y="${y + 12}" width="150" height="10" fill="${c}"/>
  <text x="${x + 12}" y="${y + 15.5}" font-size="11.5" font-weight="700" fill="#fff">${name}</text>
  ${coin(x + 134, y + 11, 6.5)}
  <text x="${x + 12}" y="${y + 52}" font-size="24" font-weight="800" fill="${c}" font-family="sans-serif">+${rate}</text>
  <text x="${x + 80}" y="${y + 46}" font-size="10.5" fill="#6E655C">存</text><text x="${x + 80}" y="${y + 62}" font-size="13" font-weight="700" fill="#2B2622">${dur}</text>`;
}
// 12-month calendar ruler
function ruler(x, y, w, o) {
  o = o || {}; const cw = w / 12; let s = `<rect x="${x - 4}" y="${y - 4}" width="${w + 8}" height="34" rx="8" fill="#FFF8EA" stroke="#E2D2B4"/>`;
  for (let m = 0; m < 12; m++) {
    const fill = (o.fill && o.fill[m]) || '#fff';
    s += `<rect x="${x + m * cw + 1}" y="${y}" width="${cw - 2}" height="26" rx="4" fill="${fill}" stroke="#D9C9AA" stroke-width=".8"/><rect x="${x + m * cw + 1}" y="${y}" width="${cw - 2}" height="6" rx="2" fill="#E46A5A" opacity=".8"/><text x="${x + m * cw + cw / 2}" y="${y + 20}" font-size="9.5" fill="#6E655C" text-anchor="middle">${m + 1}月</text>`;
  }
  return s;
}
function runner(x, y, c, o) {
  o = o || {};
  if (o.pose === 'stand') {
    return `<g transform="translate(${x} ${y})" stroke-linecap="round" stroke-linejoin="round">
    <ellipse cx="0" cy="2" rx="12" ry="2.4" fill="rgba(74,59,48,.18)"/>
    <path d="M-3 -28 L-8 -2" stroke="#3A302A" stroke-width="4.5"/>
    <path d="M-1 -28 L7 -2" stroke="#3A302A" stroke-width="4.5"/>
    <path d="M-1 -46 L-1 -28" stroke="${c}" stroke-width="10"/>
    <path d="M-2 -42 L-12 -34" stroke="#F4D3B5" stroke-width="3.2"/>
    <path d="M0 -42 L11 -34" stroke="#F4D3B5" stroke-width="3.2"/>
    <circle cx="0" cy="-54" r="6.5" fill="#F4D3B5" stroke="${K.ink}" stroke-width="1"/>
    <path d="M-5.2 -56 Q-3 -62 2 -61 Q7 -60 6.4 -54 Q2 -58 -5.2 -56Z" fill="#2F2622"/>
    <text x="0" y="-68" font-size="11" font-weight="700" fill="${c}" text-anchor="middle">${o.name || ''}</text></g>`;
  }
  return `<g transform="translate(${x} ${y})" stroke-linecap="round" stroke-linejoin="round">
  <ellipse cx="0" cy="2" rx="14" ry="2.6" fill="rgba(74,59,48,.18)"/>
  <path d="M-2 -22 L-12 -10 L-8 0" fill="none" stroke="#3A302A" stroke-width="4.5"/><path d="M-2 -22 L8 -12 L16 -14" fill="none" stroke="#3A302A" stroke-width="4.5"/>
  <path d="M-1 -40 L-3 -22" stroke="${c}" stroke-width="9"/>
  <path d="M-1 -38 L-12 -30 L-16 -36" fill="none" stroke="#F4D3B5" stroke-width="3.4"/><path d="M0 -38 L10 -32 L16 -38" fill="none" stroke="#F4D3B5" stroke-width="3.4"/>
  <circle cx="1" cy="-48" r="6.5" fill="#F4D3B5" stroke="${K.ink}" stroke-width="1"/><path d="M-5.4 -50 Q-4 -56 2 -55.6 Q7 -55 7 -49 Q3 -53 -5.4 -50Z" fill="#2F2622"/>
  <text x="0" y="-62" font-size="11" font-weight="700" fill="${c}" text-anchor="middle">${o.name || ''}</text></g>`;
}
function stopwatch(x, y, t, c) { return `<g><circle cx="${x}" cy="${y}" r="13" fill="#fff" stroke="${K.ink}" stroke-width="1.4"/><rect x="${x - 3}" y="${y - 18}" width="6" height="4" rx="1" fill="${K.ink}"/><path d="M${x} ${y} L${x} ${y - 8}" stroke="${c}" stroke-width="2"/><path d="M${x} ${y} L${x + 6} ${y + 3}" stroke="${K.ink}" stroke-width="1.4"/><text x="${x + 18}" y="${y + 4}" font-size="12" font-weight="700" fill="${c}">${t}</text></g>`; }
function phone(x, y) {
  return `<g filter="url(#soft)"><rect x="${x}" y="${y}" width="92" height="168" rx="14" fill="#2B2622"/></g><rect x="${x + 5}" y="${y + 9}" width="82" height="150" rx="9" fill="#FFF8EA"/>
  <rect x="${x + 34}" y="${y + 3}" width="24" height="3" rx="1.5" fill="#555"/>
  <text x="${x + 46}" y="${y + 30}" font-size="9.5" fill="#6E655C" text-anchor="middle">零钱宝</text>
  <text x="${x + 46}" y="${y + 60}" font-size="25" font-weight="800" fill="#E46A5A" text-anchor="middle" font-family="sans-serif">3.00%</text>
  <text x="${x + 46}" y="${y + 76}" font-size="10" font-weight="700" fill="#2B2622" text-anchor="middle">7 日年化</text>
  <rect x="${x + 14}" y="${y + 126}" width="64" height="22" rx="11" fill="#E46A5A"/><text x="${x + 46}" y="${y + 141}" font-size="10.5" fill="#fff" font-weight="700" text-anchor="middle">存 1 万</text>`;
}

const QIN = '#2B2622';
const RED = '#C8463A';
function flag(x, y, c, o) {
  o = o || {};
  if (o.fs && o.fs > 7) {
    const fs = o.fs;
    return `<path d="M${x} ${y} L${x} ${y - 36}" stroke="#5A4636" stroke-width="1.6"/><path d="M${x} ${y - 34} L${x + 28} ${y - 30} L${x + 28} ${y - 12} L${x} ${y - 16} Z" fill="${c}" stroke="${K.ink}" stroke-width=".9"/>${o.ch ? `<text x="${x + 14}" y="${y - 19}" font-size="${fs}" font-weight="800" fill="${o.tc || '#F2C14E'}" text-anchor="middle">${o.ch}</text>` : ''}`;
  }
  return `<path d="M${x} ${y} L${x} ${y - 22}" stroke="#5A4636" stroke-width="1.4"/><path d="M${x} ${y - 22} Q${x + 8} ${y - 25} ${x + 15} ${y - 21} L${x + 15} ${y - 13} Q${x + 8} ${y - 17} ${x} ${y - 14} Z" fill="${c}" stroke="${K.ink}" stroke-width=".8"/>${o.ch ? `<text x="${x + 7.5}" y="${y - 15.4}" font-size="6.5" font-weight="800" fill="${o.tc || '#F2C14E'}" text-anchor="middle">${o.ch}</text>` : ''}`;
}
function fort(x, y, w, c, o) {
  o = o || {}; const h = w * .55; let cren = '';
  for (let i = 0; i < 5; i++) cren += `<rect x="${f(x - w / 2 + i * w / 4.5)}" y="${f(y - h - 4)}" width="${f(w / 9)}" height="4.5" fill="#D9C3A0" stroke="${K.ink}" stroke-width=".7"/>`;
  return `<g><ellipse cx="${x}" cy="${y + 1.5}" rx="${w * .62}" ry="3" fill="rgba(74,59,48,.16)"/>${cren}<rect x="${f(x - w / 2)}" y="${f(y - h)}" width="${w}" height="${f(h)}" fill="#E6D3B3" stroke="${K.ink}" stroke-width="1"/><path d="M${f(x - w / 2)} ${f(y - h * .45)} L${f(x + w / 2)} ${f(y - h * .45)}" stroke="#CDB58F" stroke-width="1"/><path d="M${f(x - w * .12)} ${y} L${f(x - w * .12)} ${f(y - h * .5)} Q${x} ${f(y - h * .7)} ${f(x + w * .12)} ${f(y - h * .5)} L${f(x + w * .12)} ${y} Z" fill="#6E5440"/>${flag(x + w * .2, y - h - 4, c, o)}${o.name ? `<text x="${x}" y="${y + 13}" font-size="9.5" font-weight="700" fill="${K.ink}" text-anchor="middle">${o.name}</text>` : ''}</g>`;
}
function palace(x, y, o) {
  o = o || {};
  const ch = o.ch || '秦';
  const fc = o.flag || QIN;
  const name = o.name == null ? '咸阳' : o.name;
  const flagOpts = o.fs ? { ch: ch, tc: o.tc || '#F2C14E', fs: o.fs } : { ch: ch };
  const nameSvg = name ? `<text x="${x}" y="${y + 15}" font-size="11" font-weight="800" fill="${K.ink}" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">${name}</text>` : '';
  return `<g><ellipse cx="${x}" cy="${y + 2}" rx="40" ry="4" fill="rgba(74,59,48,.18)"/><rect x="${x - 34}" y="${y - 8}" width="68" height="8" fill="#D9C3A0" stroke="${K.ink}"/><rect x="${x - 26}" y="${y - 24}" width="52" height="16" fill="#B5584A" stroke="${K.ink}"/>${[-18, -6, 6, 18].map(d => `<rect x="${x + d - 1.5}" y="${y - 24}" width="3" height="16" fill="#8E3F33"/>`).join('')}<path d="M${x - 38} ${y - 23} Q${x} ${y - 34} ${x + 38} ${y - 23} L${x + 30} ${y - 32} Q${x} ${y - 40} ${x - 30} ${y - 32} Z" fill="${QIN}"/>${flag(x + 2, y - 38, fc, flagOpts)}${nameSvg}</g>`;
}
function seal(x, y) { return `<g><rect x="${x - 6}" y="${y - 6}" width="12" height="12" rx="2" fill="#C8463A" stroke="${K.ink}" stroke-width=".8"/><path d="M${x - 3} ${y - 6} Q${x} ${y - 12} ${x + 3} ${y - 6}" fill="#C8463A" stroke="${K.ink}" stroke-width=".8"/><text x="${x}" y="${y + 3}" font-size="7" font-weight="800" fill="#fff" text-anchor="middle">印</text></g>`; }
function tally(x, y) { return `<g><path d="M${x - 11} ${y + 3} Q${x - 9} ${y - 7} ${x} ${y - 6} Q${x + 9} ${y - 7} ${x + 11} ${y - 2} L${x + 13} ${y - 6} L${x + 12} ${y + 4} Z" fill="#C99A3A" stroke="${K.ink}" stroke-width=".8"/><circle cx="${x + 8}" cy="${y - 3}" r=".9" fill="${K.ink}"/><path d="M${x - 6} ${y - 4} L${x - 4} ${y} M${x} ${y - 5} L${x + 2} ${y - 1}" stroke="#7A5A1E" stroke-width="1"/></g>`; }
function bag(x, y, t) { return `<g><path d="M${x - 9} ${y} Q${x - 11} ${y - 12} ${x - 4} ${y - 15} L${x + 4} ${y - 15} Q${x + 11} ${y - 12} ${x + 9} ${y} Z" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".9"/><path d="M${x - 4} ${y - 15} L${x - 2} ${y - 19} L${x + 2} ${y - 19} L${x + 4} ${y - 15}" fill="#D9BF62" stroke="${K.ink}" stroke-width=".8"/><text x="${x}" y="${y - 4}" font-size="7" font-weight="800" fill="#7A5A1E" text-anchor="middle">${t || '粟'}</text></g>`; }

function floor(c) { return `<rect width="344" height="236" fill="${c || '#FBF3E6'}"/>`; }
function tag(x, y, t, c) { return `<text x="${x}" y="${y}" font-size="10.5" font-weight="800" fill="${c || K.ink}" text-anchor="middle" paint-order="stroke" stroke="#fff" stroke-width="3">${t}</text>`; }

function brain(x, y, k) {
  k = k || 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
    <ellipse cx="0" cy="2" rx="22" ry="6" fill="${K.shade}"/>
    <path d="M-16 -2 C-22 -18 -8 -26 0 -22 C8 -26 22 -18 16 -2 C18 8 8 14 0 12 C-8 14 -18 8 -16 -2Z" fill="#F3D5D0" stroke="${K.ink}" stroke-width="1.3"/>
    <path d="M0 -20 L0 10" fill="none" stroke="${K.ink}" stroke-width="1"/>
    <path d="M-10 -12 Q-4 -8 -8 -2 M8 -14 Q4 -6 10 -4 M-6 2 Q-2 6 2 2" fill="none" stroke="${K.red}" stroke-width="1.1" stroke-linecap="round"/>
  </g>`;
}
function heart(x, y, k, c) {
  k = k || 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})"><path d="M0 8 C-14 0 -16 -12 -8 -16 C-2 -18 0 -12 0 -12 C0 -12 2 -18 8 -16 C16 -12 14 0 0 8Z" fill="${c || K.red}" stroke="${K.ink}" stroke-width="1.2"/></g>`;
}
function thermo(x, y, level, label) {
  const h = 18 + (level || 0.5) * 36;
  const word = label === undefined ? '体温' : label;
  return `<g>
    <rect x="${f(x - 5)}" y="${f(y - 70)}" width="10" height="62" rx="5" fill="#fff" stroke="${K.ink}" stroke-width="1.3"/>
    <rect x="${f(x - 3)}" y="${f(y - 8 - h + 18)}" width="6" height="${f(h)}" rx="3" fill="${K.red}"/>
    <circle cx="${f(x)}" cy="${f(y)}" r="9" fill="${K.red}" stroke="${K.ink}" stroke-width="1.2"/>
    ${word ? `<text x="${f(x + 16)}" y="${f(y - 40)}" font-size="11" font-weight="700" fill="${K.ink}">${word}</text>` : ''}
  </g>`;
}
function hanger(x, y, c) {
  return `<g>
    <path d="M${f(x)} ${f(y - 28)} q6 0 6 6 q0 4 -6 4" fill="none" stroke="${K.ink}" stroke-width="1.4"/>
    <path d="M${f(x - 22)} ${f(y)} L${f(x)} ${f(y - 16)} L${f(x + 22)} ${f(y)} Z" fill="${c || K.robe}" stroke="${K.ink}" stroke-width="1.2"/>
    <path d="M${f(x - 22)} ${f(y)} L${f(x + 22)} ${f(y)}" stroke="${K.ink}" stroke-width="1.4"/>
  </g>`;
}
function swatch(x, y, c) {
  return `<g>
    <path d="M${f(x)} ${f(y)} l28 -6 l6 22 l-28 8 Z" fill="${c || K.gold}" stroke="${K.ink}" stroke-width="1.1"/>
    <path d="M${f(x + 6)} ${f(y + 2)} l16 -3" stroke="rgba(255,255,255,.7)" stroke-width="2"/>
  </g>`;
}
function sun(x, y, r) {
  let s = `<circle cx="${f(x)}" cy="${f(y)}" r="${r || 16}" fill="${K.gold}" stroke="${K.ink}" stroke-width="1.2"/>`;
  for (let i = 0; i < 8; i++) {
    const a = i * Math.PI / 4;
    s += `<line x1="${f(x + Math.cos(a) * 20)}" y1="${f(y + Math.sin(a) * 20)}" x2="${f(x + Math.cos(a) * 28)}" y2="${f(y + Math.sin(a) * 28)}" stroke="${K.gold}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  return s;
}
function clockFace(x, y, hh, mm, label, c) {
  const ha = (-Math.PI / 2) + (hh % 12 + mm / 60) * Math.PI / 6;
  const ma = (-Math.PI / 2) + mm * Math.PI / 30;
  return `<g>
    <circle cx="${f(x)}" cy="${f(y)}" r="28" fill="#fff" stroke="${K.ink}" stroke-width="1.6"/>
    <circle cx="${f(x)}" cy="${f(y)}" r="2" fill="${K.ink}"/>
    <line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.cos(ha) * 12)}" y2="${f(y + Math.sin(ha) * 12)}" stroke="${c || K.ink}" stroke-width="2.4" stroke-linecap="round"/>
    <line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.cos(ma) * 18)}" y2="${f(y + Math.sin(ma) * 18)}" stroke="${K.ink}" stroke-width="1.4" stroke-linecap="round"/>
    <text x="${f(x)}" y="${f(y + 42)}" font-size="11" font-weight="700" fill="${K.ink}" text-anchor="middle">${label || ''}</text>
  </g>`;
}
function boat(x, y, k) {
  k = k || 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
    <path d="M-18 0 L18 0 L12 8 L-12 8 Z" fill="${K.wood}" stroke="${K.ink}" stroke-width="1"/>
    <path d="M0 0 L0 -16 L10 -4 Z" fill="${K.wall}" stroke="${K.ink}" stroke-width=".8"/>
  </g>`;
}
function rain(x, y) {
  let s = '';
  for (let i = 0; i < 5; i++) s += `<line x1="${f(x + i * 7)}" y1="${f(y)}" x2="${f(x + i * 7 - 3)}" y2="${f(y + 10)}" stroke="${K.waterD}" stroke-width="1.4" stroke-linecap="round"/>`;
  return s;
}
function cloud(x, y) {
  return `<g fill="#fff" stroke="${K.ink}" stroke-width="1.1"><ellipse cx="${f(x)}" cy="${f(y)}" rx="16" ry="9"/><ellipse cx="${f(x - 12)}" cy="${f(y + 2)}" rx="10" ry="7"/><ellipse cx="${f(x + 12)}" cy="${f(y + 2)}" rx="11" ry="7"/></g>`;
}

function drawItem(it) {
  const k = it.k, x = it.x, y = it.y, o = it;
  if (k === 'mtn') return mountain(x, y, o.w || 72, o.h || 48, { snow: o.snow, c: o.c, cd: o.cd, skew: o.skew });
  if (k === 'tree') return tree(x, y, o.sc || 1, o.c);
  if (k === 'house') return house(x, y, o.sc || 1);
  if (k === 'city') return city(x, y, o.name || '');
  if (k === 'river') {
    const d = o.d || ('M' + f(x - 78) + ' ' + f(y) + ' C' + f(x - 24) + ' ' + f(y + 20) + ' ' + f(x + 28) + ' ' + f(y - 16) + ' ' + f(x + 86) + ' ' + f(y + 8));
    return `<path d="${d}" fill="none" stroke="#fff" stroke-width="7"/><path d="${d}" fill="none" stroke="${K.waterD}" stroke-width="3.2"/>`;
  }
  if (k === 'sea') {
    if (x == null) return `<path d="M236 148 Q270 136 344 150 L344 236 L220 236 Q228 190 236 148Z" fill="${K.sea}"/>` + [0, 1, 2].map(i => `<path d="M${300 + i * 8} ${170 + i * 16} q6 -4 12 0" fill="none" stroke="#fff" stroke-width="1.3"/>`).join('');
    return `<path d="M${f(x - 36)} ${f(y - 8)} Q${f(x + 10)} ${f(y - 22)} ${f(x + 48)} ${f(y)} L${f(x + 48)} ${f(y + 36)} L${f(x - 36)} ${f(y + 36)} Z" fill="${K.sea}"/>` + `<path d="M${f(x - 16)} ${f(y + 8)} q8 -3 16 0 M${f(x)} ${f(y + 18)} q8 -3 16 0" fill="none" stroke="#fff" stroke-width="1.3"/>`;
  }
  if (k === 'fields') return fields(o.id || ('fd' + Math.round(x) + Math.round(y)), x, y, o.rx || 54, o.ry || 18, o.cols || null, o.seed || 5);
  if (k === 'fig') return figure(x, y, Object.assign({}, o, { k: o.sc || 0.72 }));
  if (k === 'fort') return fort(x, y, o.w || 36, o.c || K.qin, { ch: o.ch, name: o.name, tc: o.tc });
  if (k === 'palace') return palace(x, y);
  if (k === 'flag') return flag(x, y, o.c || K.qin, { ch: o.ch, tc: o.tc });
  if (k === 'coin') return coin(x, y, o.r || 14);
  if (k === 'stack') return stack(x, y, o.n || 4);
  if (k === 'product') return product(x, y, o.name || '产品', o.rate || '1%', o.dur || '1 年', o.c || '#3D86D9');
  if (k === 'ruler') return ruler(x, y, o.w || 280, { fill: o.fill });
  if (k === 'runner') return runner(x, y, o.c || K.ink, { name: o.name || '' });
  if (k === 'watch') return stopwatch(x, y, o.t || '', o.c || K.ink);
  if (k === 'phone') return phone(x, y);
  if (k === 'seal') return seal(x, y);
  if (k === 'tally') return tally(x, y);
  if (k === 'bag') return bag(x, y, o.ink || '粟');
  if (k === 'brain') return brain(x, y, o.sc || 1);
  if (k === 'heart') return heart(x, y, o.sc || 1, o.c);
  if (k === 'thermo') return thermo(x, y, o.level);
  if (k === 'hanger') return hanger(x, y, o.c);
  if (k === 'swatch') return swatch(x, y, o.c);
  if (k === 'sun') return sun(x, y, o.r);
  if (k === 'clock') return clockFace(x, y, o.hh || 12, o.mm || 0, o.name || '', o.c);
  if (k === 'boat') return boat(x, y, o.sc || 1);
  if (k === 'rain') return rain(x, y);
  if (k === 'cloud') return cloud(x, y);
  if (k === 'wheat') return `<g>${[0,1,2,3].map(i => `<path d="M${f(x + i*6)} ${f(y)} L${f(x + i*6)} ${f(y - 22)}" stroke="${K.wheat}" stroke-width="1.6"/><ellipse cx="${f(x + i*6)}" cy="${f(y - 24)}" rx="2.2" ry="5" fill="${K.gold}"/>`).join('')}</g>`;
  if (k === 'rice') return `<g>${[0,1,2].map(i => `<rect x="${f(x + i*12)}" y="${f(y - 10)}" width="10" height="10" fill="${K.rice}" stroke="#E7F2D4" stroke-width=".8"/>`).join('')}</g>`;
  if (k === 'wall') return mountain(x, y, o.w || 120, o.h || 70, { snow: true, c: K.rock, cd: K.rockD });
  if (k === 'fall') return `<path d="M${f(x)} ${f(y)} C${f(x - 10)} ${f(y + 28)} ${f(x + 12)} ${f(y + 48)} ${f(x - 2)} ${f(y + 74)}" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round"/><path d="M${f(x)} ${f(y)} C${f(x - 10)} ${f(y + 28)} ${f(x + 12)} ${f(y + 48)} ${f(x - 2)} ${f(y + 74)}" fill="none" stroke="${K.water}" stroke-width="6" stroke-linecap="round"/>`;
  if (k === 'moon') return `<circle cx="${f(x)}" cy="${f(y)}" r="14" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.1"/><circle cx="${f(x + 6)}" cy="${f(y - 2)}" r="11" fill="${o.night || '#1E3344'}"/>`;
  return '';
}

function stairs(o) {
  o = o || {};
  let s = '';
  // three stepped blocks (oblique): top faces + front faces
  const st = [ { x0: 20, x1: 128, top: 70, c: K.high, h: '4000 米以上', n: '第一级' }, { x0: 128, x1: 232, top: 124, c: K.mid, h: '1000～2000 米', n: '第二级' }, { x0: 232, x1: 330, top: 170, c: K.plain, h: '多在 500 米以下', n: '第三级' } ];
  const dz = 26, base = 222;
  st.forEach((t, i) => {
    s += `<path d="M${t.x0} ${t.top} L${t.x0 + dz} ${t.top - dz * .6} L${t.x1 + dz} ${t.top - dz * .6} L${t.x1} ${t.top} Z" fill="${t.c}" stroke="${K.ink}" stroke-width="1.2"/>`;
    s += `<path d="M${t.x0} ${t.top} L${t.x1} ${t.top} L${t.x1} ${base} L${t.x0} ${base} Z" fill="${[K.soil3, K.soil2, K.soil1][i]}" stroke="${K.ink}" stroke-width="1.2"/>`;
    s += `<path d="M${t.x0} ${t.top + 12} L${t.x1} ${t.top + 12}" stroke="rgba(255,255,255,.18)" stroke-width="6"/>`;
    s += `<text x="${(t.x0 + t.x1) / 2}" y="${t.top + 28}" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${t.n}</text><text x="${(t.x0 + t.x1) / 2}" y="${t.top + 44}" font-size="10.5" fill="#fff" text-anchor="middle" opacity=".92">${t.h}</text>`;
  });
  // snowy peaks on step 1, loess on 2, fields on 3
  s += mountain(52, 64, 34, 26, { snow: true, c: '#B49A7C', cd: '#977D63' }) + mountain(84, 60, 40, 32, { snow: true, c: '#B49A7C', cd: '#977D63' }) + mountain(116, 56, 30, 22, { snow: true, c: '#B49A7C', cd: '#977D63' });
  [[262, 160], [286, 158], [310, 156]].forEach(([x, y]) => s += tree(x, y, .9));
  s += house(300, 165, .9);
  return s;
}
function plainBlock(id) {
  const cid = id || 'pt';
  let s = '';
  // top surface (flat), oblique parallelogram
  s += `<path d="M18 168 L70 62 L330 62 L330 168 Z" fill="#C8D98F"/>`;
  s += `<clipPath id="${cid}"><path d="M18 168 L70 62 L300 62 L300 168 Z"/></clipPath><g clip-path="url(#${cid})">`;
  let r = 3; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280;
  for (let y = 62; y < 168; y += 9) for (let x = 0; x < 320; x += 18) { const sk = (168 - y) * .49; s += `<path d="M${f(x + sk)} ${y} l18 0 l-4.4 9 l-18 0 Z" fill="${[K.wheat, '#D7CB7E', '#C2D48A', K.wheat, '#BFD086'][Math.floor(rnd() * 5)]}" stroke="#EFE4C2" stroke-width=".5"/>`; }
  s += `</g>`;
  // sea on the right
  s += `<path d="M300 62 L330 62 L330 168 L300 168 Q292 140 302 116 Q290 90 300 62Z" fill="${K.sea}"/>`;
  [[312, 90], [318, 120], [310, 148]].forEach(([x, y]) => s += `<path d="M${x - 6} ${y} q3 -3 6 0 q3 3 6 0" fill="none" stroke="#fff" stroke-width="1.2"/>`);
  // Taihang wall on the left/back
  [[64, 76, 44, 40], [90, 68, 50, 46], [52, 104, 46, 40], [40, 132, 44, 36], [30, 160, 40, 30]].forEach(([x, y, w, h]) => s += mountain(x, y, w, h, { c: '#B49A7C', cd: '#977D63' }));
  // Yellow River with levees, villages, roads
  const river = 'M96 92 C140 102 170 118 200 124 C232 130 262 118 302 112';
  s += `<path d="${river}" fill="none" stroke="#B9A06A" stroke-width="10"/><path d="${river}" fill="none" stroke="#CDB173" stroke-width="5"/>`;
  [[132, 140], [176, 92], [236, 150], [258, 90], [150, 158]].forEach(([x, y]) => s += house(x, y, 1) + house(x + 8, y + 2, .9));
  s += `<path d="M110 160 L290 78" stroke="#EFE4C2" stroke-width="2" stroke-dasharray="1 0"/>`;
  [[122, 120], [210, 104], [270, 140], [190, 150]].forEach(([x, y]) => s += tree(x, y, .9));
  // front face (thin, flat)
  s += `<path d="M18 168 L330 168 L330 196 L18 196 Z" fill="${K.soil1}" stroke="${K.ink}" stroke-width="1.2"/><path d="M18 182 L330 182" stroke="${K.soil2}" stroke-width="6"/>`;
  s += `<path d="M18 168 L330 168" stroke="${K.ink}" stroke-width="1.6"/>`;
  return s;
}
function commanderies(o) {
  o = o || {};
  const jun = [[60, 84], [60, 162], [284, 84], [284, 162], [120, 202], [224, 202]];
  let s = `${floor('#F1EBDD')}
  ${jun.map(([x, y]) => `<path d="M172 118 L${x} ${y}" stroke="#D9C3A0" stroke-width="6" stroke-linecap="round"/><path d="M172 118 L${x} ${y}" stroke="#EFE3CB" stroke-width="2.4" stroke-dasharray="4 4"/>`).join('')}
  ${jun.map(([x, y]) => `<g><rect x="${x - 30}" y="${y - 20}" width="60" height="36" rx="7" fill="#E9F0DC" stroke="#9DB27C"/>${house(x - 16, y + 10, .9)}${house(x + 18, y + 10, .9)}${fort(x, y + 8, 22, QIN, { ch: '秦' })}<text x="${x}" y="${y + 26}" font-size="9" font-weight="700" fill="#5A7040" text-anchor="middle" paint-order="stroke" stroke="#F1EBDD" stroke-width="3">郡</text></g>`).join('')}
  ${palace(172, 128)}`;
  if (o.envoy !== false) {
    s += `
  <g filter="url(#glow)">${figure(236, 104, { k: .5, robe: QIN, hat: 'guan', right: 'give' })}</g>
  <path d="M248 88 Q262 82 268 72" fill="none" stroke="${K.gold}" stroke-width="2" stroke-dasharray="4 3"/><path d="M264 70 L269 70 L268 76" fill="none" stroke="${K.gold}" stroke-width="2"/>
  ${callout(236, 80, 236, 24, '皇帝派官：每郡都插“秦”旗', { anchor: 'middle', isNew: true, fs: 10 })}`;
  }
  return s;
}

function board(x1, y1, x2, y2) {
  const ox = -16, oy = -24, thick = 8;
  let s = `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} L${f(x2)} ${f(y2 + thick)} L${f(x1)} ${f(y1 + thick)} Z" fill="#B48A5A" stroke="${K.ink}" stroke-width="1.2"/>`;
  s += `<path d="M${f(x1)} ${f(y1)} L${f(x2)} ${f(y2)} L${f(x2 + ox)} ${f(y2 + oy)} L${f(x1 + ox)} ${f(y1 + oy)} Z" fill="#D9B98A" stroke="${K.ink}" stroke-width="1.2"/>`;
  for (let i = 1; i <= 3; i++) {
    const t = i / 4;
    const ax = x1 + ox * t, ay = y1 + oy * t, bx = x2 + ox * t, by = y2 + oy * t;
    s += `<path d="M${f(ax + 12)} ${f(ay + 1)} L${f(bx - 12)} ${f(by + 1)}" stroke="#C4A574" stroke-width="1.1" fill="none"/>`;
  }
  return s;
}
function books(x, y, n) {
  const colors = ['#C8463A', '#3D86D9', '#E2B43A'];
  let s = '';
  const count = n || 3;
  for (let i = 0; i < count; i++) {
    const yy = y - (count - 1 - i) * 7;
    s += `<rect x="${f(x)}" y="${f(yy)}" width="34" height="7" rx="1.2" fill="${colors[i % 3]}" stroke="${K.ink}" stroke-width=".9"/>`;
    s += `<rect x="${f(x + 1)}" y="${f(yy + 1)}" width="4" height="5" fill="rgba(255,255,255,.45)"/>`;
  }
  return s;
}
function riverRibbon(pts, w) {
  w = w || 6;
  const d = pts.map((p, i) => (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join(' ');
  return `<path d="${d}" fill="none" stroke="#7FB6CF" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
}
function trainWindow(x, y, w, h) {
  const id = 'tw' + Math.round(x) + 'x' + Math.round(y);
  let s = `<g><rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="18" fill="#C9D6DE" stroke="#8A8178" stroke-width="7"/>`;
  s += `<clipPath id="${id}"><rect x="${f(x + 8)}" y="${f(y + 8)}" width="${f(w - 16)}" height="${f(h - 16)}" rx="12"/></clipPath><g clip-path="url(#${id})">`;
  const bands = ['#C9B59A', '#C5D6A4', '#9BB6C8'];
  bands.forEach((c, i) => {
    const yy = y + 6 + i * ((h - 8) / 3);
    s += `<path d="M${f(x - 4)} ${f(yy + 10)} L${f(x + w + 4)} ${f(yy - 8)} L${f(x + w + 4)} ${f(yy + (h / 3) + 6)} L${f(x - 4)} ${f(yy + (h / 3) + 22)} Z" fill="${c}"/>`;
  });
  for (let i = 0; i < 6; i++) {
    const yy = y + 18 + i * ((h - 24) / 6);
    s += `<path d="M${f(x + 14)} ${f(yy + 8)} L${f(x + w - 18)} ${f(yy - 6)}" stroke="rgba(255,255,255,.72)" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  s += '</g></g>';
  return s;
}
function cliff(x, y, w, h) {
  let s = `<path d="M${f(x)} ${f(y + 22)} L${f(x + w * .7)} ${f(y)} L${f(x + w)} ${f(y + 10)} L${f(x + w)} ${f(y + h)} L${f(x)} ${f(y + h)} Z" fill="#A88B6E" stroke="${K.ink}" stroke-width="1.3"/>`;
  s += `<path d="M${f(x + w * .7)} ${f(y)} L${f(x + w)} ${f(y + 10)} L${f(x + w)} ${f(y + h)} L${f(x + w * .62)} ${f(y + h * .35)} Z" fill="#8A6F57"/>`;
  [0.38, 0.58, 0.78].forEach((t, i) => {
    const yy = y + 16 + (h - 20) * t;
    s += `<path d="M${f(x + 6)} ${f(yy)} L${f(x + w - 8)} ${f(yy - 8)}" stroke="${[K.soil1, K.soil2, K.soil3][i]}" stroke-width="8" fill="none" stroke-linecap="round"/>`;
  });
  s += `<path d="M${f(x - 4)} ${f(y + 24)} L${f(x + w * .7)} ${f(y)} L${f(x + w + 6)} ${f(y + 12)} L${f(x + w * .15)} ${f(y + 20)} Z" fill="#B9CF8E" stroke="${K.ink}" stroke-width="1.1"/>`;
  return s;
}
function kettle(x, y, o) {
  if (typeof o === 'number') o = { k: o };
  o = o || {};
  const k = o.k || 1;
  const mouth = o.mouth == null ? 5 : o.mouth;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})" stroke-linejoin="round">
    <ellipse cx="0" cy="20" rx="24" ry="5" fill="rgba(74,59,48,.16)"/>
    <path d="M-18 16 Q-22 -6 0 -16 Q22 -6 18 16 Z" fill="#C8664A" stroke="${K.ink}" stroke-width="1.3"/>
    <path d="M-8 4 Q-6 -4 0 -2 Q6 -4 8 4" fill="#A84E38" opacity=".35"/>
    <path d="M-18 6 Q-30 4 -30 14 Q-30 20 -18 16" fill="none" stroke="${K.ink}" stroke-width="2.6"/>
    <path d="M16 -2 Q34 -10 40 -16" fill="none" stroke="#C8664A" stroke-width="${mouth}" stroke-linecap="round"/>
    <path d="M16 -2 Q34 -10 40 -16" fill="none" stroke="${K.ink}" stroke-width="1.1" stroke-linecap="round"/>
    <ellipse cx="0" cy="-14" rx="9" ry="3.2" fill="#F3E7D3" stroke="${K.ink}" stroke-width="1"/>
    <path d="M-4 -14 Q0 -22 4 -14" fill="none" stroke="${K.ink}" stroke-width="1.2"/>
  </g>`;
}
function pinwheel(x, y, r, colors) {
  colors = colors || ['#C8463A', '#F2B640', '#3D86D9', '#7FA65A'];
  let s = `<g transform="translate(${f(x)} ${f(y)})">`;
  for (let i = 0; i < 4; i++) {
    const a = -Math.PI / 2 + i * Math.PI / 2;
    const x2 = Math.cos(a) * r, y2 = Math.sin(a) * r;
    const x3 = Math.cos(a + 0.85) * r * 0.62, y3 = Math.sin(a + 0.85) * r * 0.62;
    s += `<path d="M0 0 Q${f(x3)} ${f(y3)} ${f(x2)} ${f(y2)} Q${f(x3 * .25)} ${f(y3 * .25)} 0 0 Z" fill="${colors[i]}" stroke="${K.ink}" stroke-width=".9"/>`;
  }
  s += `<circle r="3.4" fill="#FBF6EE" stroke="${K.ink}" stroke-width="1.3"/></g>`;
  return s;
}
function meter(x, y, n, lit) {
  let s = '';
  const h = 18, gap = 4;
  for (let i = 0; i < n; i++) {
    const yy = y + (n - 1 - i) * (h + gap);
    const on = i < lit;
    s += `<rect x="${f(x)}" y="${f(yy)}" width="26" height="${h}" rx="5" fill="${on ? '#F2B640' : '#fff'}" stroke="${K.ink}" stroke-width="1.3"/>`;
  }
  return s;
}
function dam(o) {
  o = o || {};
  const ox = o.ox || 0, oy = o.oy || 0, sc = o.sc || 1;
  let s = `<g transform="translate(${f(ox)} ${f(oy)}) scale(${sc})">`;
  s += `<defs><linearGradient id="resv${Math.round(ox)}${Math.round(oy)}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9D0DC"/><stop offset="1" stop-color="#5E9DBB"/></linearGradient></defs>`;
  s += `<path d="M18 78 L148 72 L156 198 L36 206 Q16 150 18 78Z" fill="url(#resv${Math.round(ox)}${Math.round(oy)})" stroke="${K.ink}" stroke-width="1"/>`;
  s += `<path d="M24 92 Q80 88 140 84" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>`;
  s += `<path d="M142 58 L196 52 L214 206 L132 210 Z" fill="#CFC8BE" stroke="${K.ink}" stroke-width="1.4"/>`;
  s += `<path d="M156 78 L188 74" stroke="#B7B0A6" stroke-width="3"/>`;
  s += `<path d="M70 168 L198 186" fill="none" stroke="#8A8178" stroke-width="9" stroke-linecap="round"/>`;
  s += `<path d="M70 168 L198 186" fill="none" stroke="#7FB6CF" stroke-width="4.5" stroke-linecap="round"/>`;
  s += `<rect x="186" y="164" width="62" height="42" rx="3" fill="#F3E7D3" stroke="${K.ink}" stroke-width="1.2"/>`;
  s += `<path d="M186 164 L217 154 L248 164" fill="#8E3F33" stroke="${K.ink}" stroke-width="1"/>`;
  s += pinwheel(214, 184, 14, ['#C8463A', '#F2B640', '#3D86D9', '#7FA65A']);
  s += `<rect x="232" y="174" width="14" height="20" rx="4" fill="#8A8178" stroke="${K.ink}" stroke-width="1"/>`;
  s += `<circle cx="239" cy="184" r="3" fill="#F2C14E" stroke="${K.ink}" stroke-width=".6"/>`;
  s += '</g>';
  return s;
}
function shop(x, y, w, label) {
  const h = Math.max(36, w * 0.72);
  const roof = w * 0.22;
  let s = `<g><path d="M${f(x - 4)} ${f(y - h)} L${f(x + w / 2)} ${f(y - h - roof)} L${f(x + w + 4)} ${f(y - h)} L${f(x + w)} ${f(y - h + 6)} L${f(x)} ${f(y - h + 6)} Z" fill="#8E3F33" stroke="${K.ink}" stroke-width="1.1"/>`;
  s += `<rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" fill="#F3E7D3" stroke="${K.ink}" stroke-width="1.2"/>`;
  if (w >= 30 && label) {
    s += `<rect x="${f(x + w * .08)}" y="${f(y - h + 5)}" width="${f(w * .84)}" height="14" rx="2" fill="#C8463A"/>`;
    s += `<text x="${f(x + w / 2)}" y="${f(y - h + 16)}" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">${label}</text>`;
  }
  const dw = Math.max(8, Math.min(16, w * 0.28));
  s += `<rect x="${f(x + w / 2 - dw)}" y="${f(y - dw * 1.35)}" width="${f(dw)}" height="${f(dw * 1.35)}" fill="#8A6248" stroke="${K.ink}" stroke-width=".8"/>`;
  s += `<rect x="${f(x + w / 2)}" y="${f(y - dw * 1.35)}" width="${f(dw)}" height="${f(dw * 1.35)}" fill="#6E4E32" stroke="${K.ink}" stroke-width=".8"/>`;
  s += '</g>';
  return s;
}
function signpost(x, y, text) {
  const w = Math.max(64, text.length * 12 + 18);
  return `<g><rect x="${f(x - 2.2)}" y="${f(y - 52)}" width="4.4" height="52" rx="1" fill="#7A5A3A" stroke="${K.ink}" stroke-width=".7"/>
    <path d="M${f(x + 2)} ${f(y - 48)} L${f(x + w)} ${f(y - 54)} L${f(x + w - 10)} ${f(y - 30)} L${f(x + 2)} ${f(y - 26)} Z" fill="#E7D3B0" stroke="${K.ink}" stroke-width="1.2"/>
    <text x="${f(x + w / 2 - 2)}" y="${f(y - 35)}" font-size="11" font-weight="750" fill="${K.ink}" text-anchor="middle">${text}</text></g>`;
}
function pedigree(x, y, w, h) {
  let s = '<g>';
  const n = 14;
  const gap = w / n;
  for (let i = 0; i < n; i++) {
    s += `<rect x="${f(x + i * gap + 1)}" y="${f(y)}" width="${f(gap - 2)}" height="${f(h)}" rx="3" fill="${i % 2 ? '#E8D5AC' : '#F0E0BE'}" stroke="#C4A574" stroke-width=".7"/>`;
  }
  s += `<path d="M${f(x - 2)} ${f(y + h * .2)} L${f(x + w + 2)} ${f(y + h * .2)}" stroke="#6B4A2E" stroke-width="2.4" stroke-linecap="round"/>`;
  s += `<path d="M${f(x - 2)} ${f(y + h * .78)}" L${f(x + w + 2)} ${f(y + h * .78)}" stroke="#6B4A2E" stroke-width="2.4" stroke-linecap="round"/>`;
  s += '</g>';
  return s;
}
function office(x, y, w, label) {
  const h = w * 1.25;
  const cols = Math.max(2, Math.round(w / 16));
  const rows = Math.max(3, Math.round(h / 16));
  let s = `<g><rect x="${f(x)}" y="${f(y - h)}" width="${f(w)}" height="${f(h)}" rx="2" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.3"/>`;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cw = (w - 10) / cols, rh = (h - 14) / rows;
      s += `<rect x="${f(x + 5 + c * cw + 1)}" y="${f(y - h + 6 + r * rh + 1)}" width="${f(cw - 3)}" height="${f(rh - 3)}" rx="1" fill="#C5D8E4" stroke="#7E9AAB" stroke-width=".6"/>`;
    }
  }
  if (label) s += `<text x="${f(x + w / 2)}" y="${f(y + 13)}" font-size="11" font-weight="800" fill="${K.ink}" text-anchor="middle">${label}</text>`;
  s += '</g>';
  return s;
}
function calPage(x, y, text) {
  return `<g filter="url(#soft)"><rect x="${f(x)}" y="${f(y)}" width="58" height="68" rx="4" fill="#fff" stroke="${K.ink}" stroke-width="1.2"/>
    <path d="M${f(x)} ${f(y + 16)} L${f(x)} ${f(y + 4)} Q${f(x)} ${f(y)} ${f(x + 4)} ${f(y)} L${f(x + 54)} ${f(y)} Q${f(x + 58)} ${f(y)} ${f(x + 58)} ${f(y + 4)} L${f(x + 58)} ${f(y + 16)} Z" fill="#C8463A"/>
    <circle cx="${f(x + 16)}" cy="${f(y + 1)}" r="2.2" fill="${K.ink}"/><circle cx="${f(x + 42)}" cy="${f(y + 1)}" r="2.2" fill="${K.ink}"/>
    <text x="${f(x + 29)}" y="${f(y + 44)}" font-size="14" font-weight="800" fill="${K.ink}" text-anchor="middle">${text}</text></g>`;
}
function rope(x1, y, x2, fray) {
  const fx = x1 + (x2 - x1) * (fray == null ? 0.55 : fray);
  let s = `<path d="M${f(x1)} ${f(y - 4)} Q${f((x1 + fx) / 2)} ${f(y + 7)} ${f(fx - 4)} ${f(y - 1)}" fill="none" stroke="#C4A574" stroke-width="4.4" stroke-linecap="round"/>`;
  s += `<path d="M${f(x1)} ${f(y + 4)} Q${f((x1 + fx) / 2)} ${f(y - 7)} ${f(fx - 2)} ${f(y + 2)}" fill="none" stroke="#A8845A" stroke-width="3.4" stroke-linecap="round"/>`;
  [[-6, -7], [2, -2], [8, 6], [14, 1], [4, 8]].forEach((p, i) => {
    s += `<path d="M${f(fx - 2)} ${f(y)} q${6 + i} ${p[1]} ${16 + p[0]} ${p[1] * 1.3}" fill="none" stroke="${i % 2 ? '#A8845A' : '#C4A574'}" stroke-width="1.15" stroke-linecap="round"/>`;
  });
  return s;
}
function load(x, y) {
  return `<g><path d="M${f(x - 7)} ${f(y)} Q${f(x)} ${f(y - 16)} ${f(x + 7)} ${f(y)}" fill="none" stroke="#7A5A3A" stroke-width="1.4"/>
    <rect x="${f(x - 12)}" y="${f(y - 8)}" width="24" height="16" rx="2" fill="#C4B49A" stroke="${K.ink}" stroke-width="1.1"/>
    <path d="M${f(x - 12)} ${f(y)}" L${f(x + 12)} ${f(y)}" stroke="#A89880" stroke-width="1"/>
    <path d="M${f(x - 6)} ${f(y - 8)} L${f(x - 4)} ${f(y + 8)} M${f(x + 5)} ${f(y - 8)} L${f(x + 3)} ${f(y + 8)}" stroke="#8E7E68" stroke-width=".8"/></g>`;
}
function wall(pts) {
  if (!pts || pts.length < 2) return '';
  const d = pts.map((p, i) => (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1])).join(' ');
  let mer = '';
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const seg = 4;
    for (let s = 0; s < seg; s++) {
      const t = (s + 0.2) / seg;
      const x = a[0] + (b[0] - a[0]) * t;
      const y = a[1] + (b[1] - a[1]) * t;
      mer += `<rect x="${f(x - 3.5)}" y="${f(y - 9)}" width="7" height="9" fill="#D9CDB8" stroke="${K.ink}" stroke-width=".7"/>`;
    }
  }
  return `<path d="${d}" fill="none" stroke="#B8A58A" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>${mer}<path d="${d}" fill="none" stroke="#8A6F57" stroke-width="1.3" stroke-linejoin="round"/>`;
}
function kasa(x, y) {
  return `<g><path d="M${f(x)} ${f(y - 7)} L${f(x - 16)} ${f(y + 2)} L${f(x + 16)} ${f(y + 2)} Z" fill="#E2CF7E" stroke="${K.ink}" stroke-width="1.1"/>
    <path d="M${f(x - 8)} ${f(y - 1)} L${f(x)} ${f(y - 6)} L${f(x + 8)} ${f(y - 1)}" fill="none" stroke="#C4A574" stroke-width=".8"/>
    <path d="M${f(x)} ${f(y - 7)} L${f(x)} ${f(y + 2)}" stroke="#C4A574" stroke-width=".7"/></g>`;
}
function fire(x, y, k) {
  k = k || 1;
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
    <path d="M0 4 C-10 -4 -8 -18 0 -26 C8 -18 10 -4 0 4Z" fill="#C8463A"/>
    <path d="M0 4 C-6 -2 -5 -12 0 -18 C5 -12 6 -2 0 4Z" fill="#E07A3D"/>
    <path d="M0 3 C-3 -1 -2 -7 0 -11 C2 -7 3 -1 0 3Z" fill="#F2B640"/>
  </g>`;
}

const scenes = {};
const mem = {};
const parts = [];
function register(name, fn) { scenes[name] = fn; }
function part(name, svg, group) { parts.push({ name: name, svg: svg, group: group || '' }); }
function draw(name, state) {
  const fn = scenes[name];
  const body = fn ? fn(state || {}) : `<rect width="344" height="236" fill="${K.paper}"/>`;
  if (body.indexOf('id="sky"') >= 0) return body;
  return defs() + body;
}
function remember(id, i) {
  if (id == null) return;
  mem[id] = i;
  if (global.LKStore && LKStore.noteDeck) LKStore.noteDeck(id, i);
}
function recall(id) {
  if (Object.prototype.hasOwnProperty.call(mem, id)) return mem[id];
  const saved = global.LKStore && LKStore.deckPos && LKStore.deckPos(id);
  if (saved != null) { mem[id] = saved; return saved; }
  return null;
}

part('山', mountain(80, 100, 78, 58, { snow: true }));
part('树', tree(78, 96, 2.2));
part('房子', house(80, 96, 2.4));
part('城', city(70, 88, '城'));
part('人', figure(80, 112, { k: 1.15, hat: 'guan', robe: K.robe, right: 'point' }));
part('城楼', fort(80, 96, 54, K.qin, { ch: '秦', name: '' }));
part('宫殿', palace(80, 100));
part('旗', flag(70, 100, K.red, { ch: '秦' }));
part('印', seal(78, 70));
part('虎符', tally(80, 72));
part('粮袋', bag(80, 78, '俸'));
part('金币', coin(80, 64, 18));
part('一叠钱', stack(80, 86, 5));
part('心', heart(80, 70, 2.2));
part('脑', brain(80, 72, 1.5));
part('温度计', thermo(70, 96, 0.7));
part('衣架', hanger(80, 88, K.robe));
part('色卡', swatch(60, 70, K.gold));
part('太阳', sun(80, 64, 18));
part('船', boat(80, 78, 1.8));
part('砧板', board(36, 86, 146, 100), 'w1');
part('书', books(62, 72, 3), 'w1');
part('河流带', riverRibbon([[24, 40], [56, 66], [96, 48], [136, 78]], 8), 'w1');
part('车窗', trainWindow(24, 22, 112, 68), 'w1');
part('悬崖', cliff(30, 24, 92, 70), 'w1');
part('水壶', kettle(52, 58, { k: 1.05, mouth: 6 }), 'w1');
part('风车', pinwheel(80, 62, 28), 'w1');
part('能量格', meter(66, 18, 4, 2), 'w1');
part('大坝', dam({ ox: 16, oy: 12, sc: 0.4 }), 'w1');
part('店铺', shop(40, 100, 72, '总店'), 'w1');
part('路牌', signpost(36, 104, '渔阳'), 'w1');
part('族谱', pedigree(12, 10, 136, 96), 'w1');
part('楼房', office(52, 90, 48, '总部'), 'w1');
part('台历', calPage(50, 18, '春节'), 'w1');
part('绳子', rope(18, 62, 118, 0.62), 'w1');
part('石块', load(80, 64), 'w1');
part('长城', wall([[12, 78], [48, 40], [96, 56], [148, 28]]), 'w1');
part('斗笠', kasa(80, 58), 'w1');
part('火', fire(80, 78, 1.6), 'w1');

global.LKScene = {
  K: K, f: f, defs: defs, callout: callout, newRing: newRing, star: star,
  mountain: mountain, tree: tree, house: house, city: city, fields: fields, figure: figure, bubble: bubble,
  coin: coin, stack: stack, product: product, ruler: ruler, runner: runner, stopwatch: stopwatch, phone: phone,
  flag: flag, fort: fort, palace: palace, seal: seal, tally: tally, bag: bag, floor: floor, tag: tag,
  brain: brain, heart: heart, thermo: thermo, hanger: hanger, swatch: swatch, sun: sun, clockFace: clockFace, boat: boat,
  stairs: stairs, plainBlock: plainBlock, commanderies: commanderies,
  board: board, books: books, riverRibbon: riverRibbon, trainWindow: trainWindow,
  cliff: cliff, kettle: kettle, pinwheel: pinwheel, meter: meter, dam: dam,
  shop: shop, signpost: signpost, pedigree: pedigree, office: office, calPage: calPage, rope: rope,
  load: load, wall: wall, kasa: kasa, fire: fire,
  CN: CN, proj: proj, pathOf: pathOf, smooth: smooth,
  drawItem: drawItem, register: register, part: part, draw: draw, scenes: scenes, parts: parts,
  remember: remember, recall: recall
};
})(window);
