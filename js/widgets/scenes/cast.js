(function (global) {
  const S = global.LKScene;
  const K = S.K;
  const f = S.f;

  function talk(x, y, text, tx, ty) {
    const lines = String(text).split('|').slice(0, 2);
    const fs = 16;
    const w = Math.max.apply(null, lines.map(function (l) { return Array.from(l).length; })) * fs + 22;
    const h = lines.length * 22 + 14;
    const bx = x - w / 2;
    const by = y - h;
    const tail = tx == null ? x : tx;
    const tip = ty == null ? by + h + 14 : ty;
    return `<g><rect x="${f(bx)}" y="${f(by)}" width="${f(w)}" height="${f(h)}" rx="11" fill="#fff" stroke="${K.ink}" stroke-width="1.6"/>
      <path d="M${f(tail - 8)} ${f(by + h - .5)} L${f(tail)} ${f(tip)} L${f(tail + 8)} ${f(by + h - .5)} Z" fill="#fff" stroke="${K.ink}" stroke-width="1.6"/>
      <rect x="${f(tail - 7)}" y="${f(by + h - 3)}" width="14" height="4" fill="#fff"/>
      ${lines.map(function (l, i) { return `<text x="${f(x)}" y="${f(by + 22 + i * 22)}" font-size="16" font-weight="750" fill="${K.ink}" text-anchor="middle">${l}</text>`; }).join('')}</g>`;
  }

  function lab(x, y, t, o) {
    o = o || {};
    return `<text x="${f(x)}" y="${f(y)}" font-size="${o.fs || 14}" font-weight="800" fill="${o.c || K.ink}" text-anchor="${o.anchor || 'middle'}" paint-order="stroke" stroke="${o.stroke || '#fff'}" stroke-width="3">${t}</text>`;
  }

  function glow(inner) { return `<g filter="url(#glow)">${inner}</g>`; }

  function faceLook(face) {
    const ink = K.ink;
    let s = '';
    if (face === 'dizzy') {
      s += `<path d="M-8 -4 q2 -3 4 0 q2 3 4 0" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
      s += `<path d="M4 -4 q2 -3 4 0 q2 3 4 0" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
    } else if (face === 'wow') {
      s += `<ellipse cx="-5" cy="-2" rx="1.6" ry="2" fill="${ink}"/><ellipse cx="5" cy="-2" rx="1.6" ry="2" fill="${ink}"/>`;
      s += `<path d="M-7 -6 L-3 -7.2 M7 -6 L3 -7.2" stroke="${ink}" stroke-width="1.2"/>`;
      s += `<ellipse cx="0" cy="6" rx="3.2" ry="2.6" fill="#E07A7A"/>`;
    } else if (face === 'worry') {
      s += `<circle cx="-5" cy="-1" r="1.2" fill="${ink}"/><circle cx="5" cy="-1" r="1.2" fill="${ink}"/>`;
      s += `<path d="M-7 -5 L-3 -6.2 M7 -5 L3 -6.2" stroke="${ink}" stroke-width="1.2"/>`;
      s += `<path d="M-3 6 Q0 4.4 3 6" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
    } else if (face === 'sad') {
      s += `<circle cx="-5" cy="-1" r="1.2" fill="${ink}"/><circle cx="5" cy="-1" r="1.2" fill="${ink}"/>`;
      s += `<path d="M-7 -4.5 L-3 -6 M7 -4.5 L3 -6" stroke="${ink}" stroke-width="1.2"/>`;
      s += `<path d="M-3.2 7 Q0 5 3.2 7" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
    } else if (face === 'yuck') {
      s += `<circle cx="-5" cy="-1" r="1.2" fill="${ink}"/><circle cx="5" cy="-1" r="1.2" fill="${ink}"/>`;
      s += `<path d="M-2 3 Q0 1 2 3" fill="none" stroke="${ink}" stroke-width="1.1"/>`;
      s += `<path d="M-3 7 Q0 5.2 3 7" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
    } else if (face === 'happy') {
      s += `<path d="M-7 -2 Q-5 -4 -3 -2" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
      s += `<path d="M3 -2 Q5 -4 7 -2" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
      s += `<path d="M-3.4 5 Q0 9 3.4 5" fill="none" stroke="${ink}" stroke-width="1.3"/>`;
    } else if (face === 'think') {
      s += `<circle cx="-5" cy="-1" r="1.2" fill="${ink}"/><circle cx="5" cy="-1" r="1.2" fill="${ink}"/>`;
      s += `<path d="M-7 -6 L-3 -5 M3 -6.4 L7 -4.6" stroke="${ink}" stroke-width="1.2"/>`;
      s += `<path d="M-2 6 L3 6" stroke="${ink}" stroke-width="1.2"/>`;
    } else {
      s += `<circle cx="-5" cy="-1" r="1.15" fill="${ink}"/><circle cx="5" cy="-1" r="1.15" fill="${ink}"/>`;
      s += `<path d="M-3 5.5 Q0 7.4 3 5.5" fill="none" stroke="${ink}" stroke-width="1.2"/>`;
    }
    s += `<circle cx="-8" cy="2" r="2.1" fill="#EFA8A0" opacity=".55"/><circle cx="8" cy="2" r="2.1" fill="#EFA8A0" opacity=".55"/>`;
    return s;
  }

  function arm(pose, side, top) {
    const ink = K.ink;
    const skin = K.skin;
    const s = side;
    const sleeve = top;
    if (pose === 'cheer' || pose === 'up') {
      return `<path d="M${-10 * s} -78 Q${-18 * s} -96 ${-8 * s} -108 L${-2 * s} -104 Q${-12 * s} -90 ${-6 * s} -74 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/>
        <circle cx="${-8 * s}" cy="-110" r="3.3" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
    }
    if (pose === 'point') {
      if (s < 0) return `<path d="M10 -76 Q16 -70 12 -58 L6 -60 Q10 -70 4 -74 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/><circle cx="13" cy="-56" r="3" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
      return `<path d="M10 -74 Q28 -70 40 -78 L36 -84 Q24 -76 8 -80 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/><circle cx="42" cy="-80" r="3.2" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
    }
    if (pose === 'lift') {
      return `<path d="M${8 * s} -70 Q${16 * s} -52 ${22 * s} -40 L${16 * s} -36 Q${10 * s} -50 ${4 * s} -66 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/>
        <circle cx="${22 * s}" cy="-38" r="3.2" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
    }
    if (pose === 'hold') {
      return `<path d="M${8 * s} -74 Q${14 * s} -60 ${6 * s} -52 L${1 * s} -56 Q${8 * s} -62 ${3 * s} -74 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/>
        <circle cx="${4 * s}" cy="-50" r="3.1" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
    }
    if (pose === 'paddle') {
      return `<path d="M${8 * s} -70 Q${24 * s} -60 ${30 * s} -48 L${24 * s} -44 Q${16 * s} -56 ${4 * s} -66 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/>
        <circle cx="${30 * s}" cy="-46" r="3" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
    }
    return `<path d="M${8 * s} -76 Q${16 * s} -64 ${14 * s} -48 L${8 * s} -48 Q${10 * s} -64 ${4 * s} -76 Z" fill="${sleeve}" stroke="${ink}" stroke-width="1"/>
      <circle cx="${14 * s}" cy="-46" r="3.1" fill="${skin}" stroke="${ink}" stroke-width=".8"/>`;
  }

  function kid(x, y, o) {
    o = o || {};
    const k = o.k == null ? 1 : o.k;
    const fl = o.flip ? -1 : 1;
    const top = o.top || '#2F9E8F';
    const topD = '#1E7568';
    const bottom = o.bottom || '#3A302A';
    const hair = o.hair || 'bob';
    const pose = o.pose || 'stand';
    const face = o.face || 'calm';
    const ink = K.ink;
    const skin = K.skin;
    let g = `<ellipse cx="0" cy="2" rx="18" ry="4.2" fill="rgba(74,59,48,.16)"/>`;
    if (pose === 'sit') {
      g += `<path d="M-6 -34 L-26 -12 L-10 -8 Z" fill="${bottom}" stroke="${ink}" stroke-width="1"/>`;
      g += `<path d="M4 -34 L24 -14 L10 -8 Z" fill="#2A221C" stroke="${ink}" stroke-width="1"/>`;
      g += `<path d="M-26 -12 L-16 -6 L-10 -10 Z" fill="#F7F4EF" stroke="${ink}" stroke-width="1"/>`;
      g += `<path d="M24 -14 L16 -6 L10 -10 Z" fill="#F4EFE6" stroke="${ink}" stroke-width="1"/>`;
    } else if (pose === 'paddle') {
      g += `<path d="M-12 -24 L-18 2 L-4 2 Z" fill="${bottom}"/>`;
      g += `<path d="M6 -24 L18 2 L4 2 Z" fill="#2A221C"/>`;
    } else {
      g += `<path d="M-9 -50 L-13 -8 L-2 -8 L-1 -50 Z" fill="${bottom}"/>`;
      g += `<path d="M1 -50 L2 -8 L13 -8 L9 -50 Z" fill="#2A221C"/>`;
      g += `<path d="M-15 -10 L-2 -5 L-1 -1 L-13 2 Z" fill="#F7F4EF" stroke="${ink}" stroke-width="1"/>`;
      g += `<path d="M2 -5 L15 -10 L13 2 L1 -1 Z" fill="#F4EFE6" stroke="${ink}" stroke-width="1"/>`;
    }
    if (o.skirt) {
      g += `<path d="M-18 -58 L-22 -16 L22 -16 L18 -58 Z" fill="${o.skirt}" stroke="${ink}" stroke-width="1.15"/>`;
      g += `<path d="M2 -56 L20 -16 L22 -16 L6 -56 Z" fill="rgba(0,0,0,.1)"/>`;
    }
    g += `<path d="M-15 -96 L-17 -52 Q0 -46 17 -52 L15 -96 Q0 -104 -15 -96 Z" fill="${top}" stroke="${ink}" stroke-width="1.2"/>`;
    g += `<path d="M2 -94 Q12 -90 15 -52 L4 -50 Q6 -80 2 -94 Z" fill="${topD}"/>`;
    g += arm(pose, -1, top) + arm(pose, 1, top);
    if (o.prop === 'backpack') {
      g += `<path d="M-12 -90 L-20 -78 L-18 -58 L-8 -62 L-8 -84 Z" fill="#C46A4A" stroke="${ink}" stroke-width="1"/>`;
      g += `<path d="M-18 -74 L-8 -70" stroke="#E7C07A" stroke-width="2"/>`;
    }
    g += `<rect x="-3.2" y="-104" width="6.4" height="8" rx="2" fill="${skin}"/>`;
    g += `<ellipse cx="0" cy="-112" rx="16" ry="17" fill="${skin}" stroke="${ink}" stroke-width="1.15"/>`;
    if (hair === 'long') {
      g += `<path d="M-16 -116 Q-20 -146 0 -148 Q20 -146 16 -116 L18 -78 Q12 -88 8 -76 L4 -92 Q2 -120 0 -122 Q-2 -120 -4 -92 L-8 -76 Q-12 -88 -18 -78 Z" fill="#2F2622"/>`;
    } else if (hair === 'short') {
      g += `<path d="M-15 -114 Q-16 -142 2 -144 Q18 -140 15 -112 Q8 -122 -2 -120 Q-12 -118 -15 -114 Z" fill="#2F2622"/>`;
      g += `<path d="M12 -128 Q22 -122 16 -112" fill="#2F2622"/>`;
    } else {
      g += `<path d="M-17 -112 Q-18 -144 0 -146 Q18 -144 17 -112 Q16 -98 12 -92 L6 -100 Q4 -122 0 -124 Q-4 -122 -6 -100 L-12 -92 Q-16 -98 -17 -112 Z" fill="#2F2622"/>`;
    }
    g += `<g transform="translate(0 -112)">${faceLook(face)}</g>`;
    if (o.glasses) {
      g += `<g fill="none" stroke="${ink}" stroke-width="1.25"><circle cx="-6.2" cy="-114" r="5.2"/><circle cx="6.2" cy="-114" r="5.2"/><path d="M-1 -114 L1 -114 M-11.4 -114 L-15 -112 M11.4 -114 L15 -112"/></g>`;
    }
    if (o.prop === 'phone') {
      g += `<g transform="translate(6 -48)"><rect x="-7" y="-12" width="14" height="24" rx="2.5" fill="#2B2622"/><rect x="-5.5" y="-9" width="11" height="16" rx="1" fill="#E7F6E4"/><text x="0" y="2" font-size="6" font-weight="800" fill="#2F9E8F" text-anchor="middle">+2%</text></g>`;
    }
    if (o.prop === 'basket') {
      g += `<g transform="translate(2 -40)"><path d="M-12 0 L-8 -14 L10 -14 L14 0 Z" fill="#E2CF7E" stroke="${ink}" stroke-width="1"/><path d="M-6 -14 Q1 -22 8 -14" fill="none" stroke="${ink}" stroke-width="1.2"/><path d="M-4 0 L-2 -14 M2 0 L2 -14 M7 0 L6 -14" stroke="#C4A574" stroke-width=".7"/></g>`;
    }
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(k * fl)} ${f(k)})">${g}</g>`;
  }

  function yin(x, y, o) {
    o = o || {};
    const k = o.k == null ? 1 : o.k;
    const face = o.face || 'calm';
    const ink = K.ink;
    let g = `<ellipse cx="2" cy="30" rx="26" ry="6" fill="rgba(74,59,48,.15)"/>`;
    g += `<circle cx="0" cy="0" r="30" fill="#7C6BD6" stroke="${ink}" stroke-width="1.4"/>`;
    g += `<ellipse cx="-8" cy="-8" rx="12" ry="8" fill="#B7A6F2" opacity=".65"/>`;
    g += `<path d="M22 -8 C34 -20 40 6 24 10" fill="#9B8CF0" stroke="${ink}" stroke-width="1"/>`;
    if (o.arm === 'point') g += `<path d="M20 8 Q34 2 42 -8" fill="none" stroke="#5E4EAE" stroke-width="6" stroke-linecap="round"/><circle cx="44" cy="-10" r="4" fill="#F4D3B5" stroke="${ink}" stroke-width=".8"/>`;
    if (o.arm === 'hold') g += `<path d="M18 10 Q28 16 26 26" fill="none" stroke="#5E4EAE" stroke-width="6" stroke-linecap="round"/><circle cx="26" cy="28" r="4" fill="#F4D3B5" stroke="${ink}" stroke-width=".8"/>`;
    const mouth = face === 'wow' ? `<ellipse cx="2" cy="10" rx="4" ry="3.2" fill="#5A478E"/>`
      : face === 'happy' ? `<path d="M-6 8 Q2 16 10 8" fill="none" stroke="${ink}" stroke-width="1.6"/>`
      : face === 'think' ? `<path d="M-2 10 L8 10" stroke="${ink}" stroke-width="1.5"/>`
      : face === 'worry' ? `<path d="M-4 12 Q2 8 8 12" fill="none" stroke="${ink}" stroke-width="1.5"/>`
      : `<path d="M-4 9 Q2 13 8 9" fill="none" stroke="${ink}" stroke-width="1.5"/>`;
    const brows = face === 'wow' || face === 'worry' ? `<path d="M-12 -6 L-4 -9 M10 -8 L16 -4" stroke="${ink}" stroke-width="1.4"/>` : '';
    g += `<ellipse cx="-7" cy="0" rx="4.2" ry="5" fill="#fff"/><ellipse cx="9" cy="-1" rx="4.2" ry="5" fill="#fff"/>`;
    g += `<circle cx="-6" cy="1" r="2" fill="${ink}"/><circle cx="10" cy="0" r="2" fill="${ink}"/>`;
    g += brows + mouth;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">${g}</g>`;
  }

  function trainCar(x, y, k) {
    k = k || 1;
    const ink = K.ink;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <rect x="0" y="-28" width="78" height="26" rx="4" fill="#C8463A" stroke="${ink}"/>
      <rect x="58" y="-40" width="28" height="16" rx="3" fill="#8E3F33" stroke="${ink}"/>
      <rect x="64" y="-36" width="16" height="8" fill="#C5D8E4" stroke="${ink}" stroke-width=".7"/>
      <rect x="8" y="-22" width="12" height="10" rx="1.5" fill="#F7F4EF" stroke="${ink}" stroke-width=".7"/>
      <rect x="26" y="-22" width="12" height="10" rx="1.5" fill="#F7F4EF" stroke="${ink}" stroke-width=".7"/>
      <circle cx="18" cy="2" r="7" fill="#4A3B30" stroke="${ink}"/><circle cx="18" cy="2" r="3" fill="#C4A574"/>
      <circle cx="62" cy="2" r="7" fill="#4A3B30" stroke="${ink}"/><circle cx="62" cy="2" r="3" fill="#C4A574"/>
      <path d="M86 -18 L98 -8 L86 -4 Z" fill="#6E655C"/>
    </g>`;
  }

  function rowboat(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <path d="M-46 0 Q-40 16 0 18 Q40 16 46 0 Q20 8 -20 8 Q-40 6 -46 0 Z" fill="#C4A574" stroke="${K.ink}" stroke-width="1.2"/>
      <path d="M-30 4 Q0 12 30 4" fill="none" stroke="#A8845A" stroke-width="2"/>
      <path d="M-8 -2 L34 -28" stroke="#7A5A3A" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M30 -30 L46 -24 L34 -22 Z" fill="#E7D3B0" stroke="${K.ink}" stroke-width=".8"/>
    </g>`;
  }

  function oxCart(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <ellipse cx="-28" cy="-16" rx="16" ry="10" fill="#C4A574" stroke="${K.ink}"/>
      <circle cx="-40" cy="-18" r="6" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".8"/>
      <path d="M-18 -10 L8 -8" stroke="#7A5A3A" stroke-width="2"/>
      <rect x="4" y="-22" width="36" height="16" fill="#E7D3B0" stroke="${K.ink}"/>
      <circle cx="14" cy="0" r="8" fill="#4A3B30" stroke="${K.ink}"/><circle cx="32" cy="0" r="8" fill="#4A3B30" stroke="${K.ink}"/>
    </g>`;
  }

  function horseRider(x, y, k) {
    k = k || 1;
    const ink = K.ink;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <ellipse cx="6" cy="4" rx="40" ry="4" fill="rgba(74,59,48,.16)"/>
      <path d="M36 -22 Q52 -10 42 4" fill="none" stroke="#5C4636" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="-6" y="-42" width="48" height="24" rx="12" fill="#8A6F57" stroke="${ink}" stroke-width="1.2"/>
      <path d="M-4 -34 Q-16 -58 -30 -52" fill="none" stroke="#6E5642" stroke-width="8" stroke-linecap="round"/>
      <circle cx="-32" cy="-54" r="9" fill="#6E5642" stroke="${ink}" stroke-width="1.1"/>
      <path d="M-36 -62 L-30 -72 L-26 -60 Z" fill="#5C4636" stroke="${ink}" stroke-width=".6"/>
      <circle cx="-35" cy="-54" r="1.3" fill="${ink}"/>
      <path d="M2 -18 L-2 6 M14 -18 L12 8 M28 -18 L30 8 M40 -18 L46 4" stroke="#5C4636" stroke-width="3.6" stroke-linecap="round"/>
      <path d="M10 -42 L8 -60 L24 -60 L22 -42 Z" fill="#8E3F33" stroke="${ink}" stroke-width=".8"/>
      <circle cx="16" cy="-68" r="7.5" fill="#F4D3B5" stroke="${ink}" stroke-width=".8"/>
      <path d="M10 -70 Q16 -80 22 -70 Q16 -74 10 -70 Z" fill="#2F2622"/>
      <rect x="24" y="-56" width="12" height="9" rx="1.4" fill="#E2CF7E" stroke="${ink}" stroke-width=".7"/>
    </g>`;
  }

  function magnifier(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <circle cx="0" cy="0" r="22" fill="rgba(180,220,230,.35)" stroke="${K.ink}" stroke-width="3"/>
      <path d="M16 16 L32 34" stroke="#7A5A3A" stroke-width="6" stroke-linecap="round"/>
    </g>`;
  }

  function scale(x, y, tilt) {
    const t = tilt || 0;
    return `<g>
      <path d="M${f(x - 28)} ${f(y)} L${f(x + 28)} ${f(y)} L${f(x + 18)} ${f(y + 10)} L${f(x - 18)} ${f(y + 10)} Z" fill="#C4A574" stroke="${K.ink}"/>
      <rect x="${f(x - 3)}" y="${f(y - 70)}" width="6" height="70" fill="#B48A5A" stroke="${K.ink}" stroke-width=".8"/>
      <g transform="rotate(${t} ${f(x)} ${f(y - 68)})">
        <rect x="${f(x - 78)}" y="${f(y - 72)}" width="156" height="6" rx="2" fill="#E2B43A" stroke="${K.ink}"/>
        <path d="M${f(x - 70)} ${f(y - 68)} L${f(x - 70)} ${f(y - 40)}" stroke="${K.ink}" stroke-width="1.2"/>
        <path d="M${f(x + 70)} ${f(y - 68)} L${f(x + 70)} ${f(y - 40)}" stroke="${K.ink}" stroke-width="1.2"/>
        <path d="M${f(x - 88)} ${f(y - 40)} Q${f(x - 70)} ${f(y - 28)} ${f(x - 52)} ${f(y - 40)}" fill="#E7D3B0" stroke="${K.ink}"/>
        <path d="M${f(x + 52)} ${f(y - 40)} Q${f(x + 70)} ${f(y - 28)} ${f(x + 88)} ${f(y - 40)}" fill="#E7D3B0" stroke="${K.ink}"/>
      </g>
    </g>`;
  }

  function battery(x, y, level) {
    const n = Math.max(0, Math.min(4, Math.round((level == null ? 1 : level) * 4)));
    let cells = '';
    const cols = ['#C8463A', '#E07A3D', '#E2B43A', '#3FA772'];
    for (let i = 0; i < 4; i++) {
      cells += `<rect x="${f(x + 6 + i * 16)}" y="${f(y + 8)}" width="12" height="22" rx="2" fill="${i < n ? cols[Math.min(3, n - 1)] : '#E7E0D6'}" stroke="${K.ink}" stroke-width=".6"/>`;
    }
    return `<g><rect x="${f(x)}" y="${f(y)}" width="74" height="38" rx="6" fill="#fff" stroke="${K.ink}" stroke-width="1.4"/>
      <rect x="${f(x + 74)}" y="${f(y + 12)}" width="6" height="14" rx="2" fill="${K.ink}"/>${cells}</g>`;
  }

  function jar(x, y, stacks, tag) {
    let coins = '';
    const n = stacks || 4;
    for (let i = 0; i < n; i++) {
      const cx = x - 16 + (i % 4) * 12;
      const cy = y + 28 - Math.floor(i / 4) * 10;
      coins += S.coin(cx, cy, 6);
    }
    return `<g>
      <path d="M${f(x - 28)} ${f(y - 20)} L${f(x - 34)} ${f(y + 36)} Q${f(x)} ${f(y + 48)} ${f(x + 34)} ${f(y + 36)} L${f(x + 28)} ${f(y - 20)} Z" fill="rgba(200,230,240,.35)" stroke="${K.ink}" stroke-width="1.4"/>
      <rect x="${f(x - 24)}" y="${f(y - 30)}" width="48" height="12" rx="3" fill="#D5E8F0" stroke="${K.ink}"/>
      ${coins}
      ${tag ? `<rect x="${f(x - 22)}" y="${f(y + 8)}" width="44" height="16" rx="3" fill="#fff" stroke="${K.ink}" stroke-width=".8"/><text x="${f(x)}" y="${f(y + 20)}" font-size="11" font-weight="800" fill="${K.ink}" text-anchor="middle">${tag}</text>` : ''}
    </g>`;
  }

  function piggy(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <ellipse cx="0" cy="0" rx="28" ry="18" fill="#F3B6C4" stroke="${K.ink}" stroke-width="1.2"/>
      <ellipse cx="22" cy="2" rx="8" ry="6" fill="#F7C9D4" stroke="${K.ink}" stroke-width=".8"/>
      <circle cx="24" cy="1" r="1.1" fill="${K.ink}"/><circle cx="28" cy="1" r="1.1" fill="${K.ink}"/>
      <path d="M-6 -16 L-2 -24 L4 -16" fill="#E892A8" stroke="${K.ink}" stroke-width=".7"/>
      <circle cx="-4" cy="-2" r="1.4" fill="${K.ink}"/>
      <rect x="-6" y="-20" width="10" height="4" rx="1" fill="#4A3B30"/>
    </g>`;
  }

  function bankbook(x, y) {
    return `<g><rect x="${f(x)}" y="${f(y)}" width="78" height="100" rx="3" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.3"/>
      <rect x="${f(x)}" y="${f(y)}" width="78" height="18" fill="#3D86D9"/>
      <text x="${f(x + 39)}" y="${f(y + 13)}" font-size="11" font-weight="800" fill="#fff" text-anchor="middle">存折</text>
      <text x="${f(x + 10)}" y="${f(y + 40)}" font-size="10" fill="#6E655C">余额</text>
      <text x="${f(x + 10)}" y="${f(y + 62)}" font-size="16" font-weight="800" fill="${K.ink}">10000.00</text>
    </g>`;
  }

  function bill(x, y) {
    return `<g><rect x="${f(x)}" y="${f(y)}" width="62" height="32" rx="3" fill="#F4C2D0" stroke="${K.ink}" stroke-width="1.1"/>
      <circle cx="${f(x + 16)}" cy="${f(y + 16)}" r="8" fill="none" stroke="#C8463A" stroke-width="1"/>
      <text x="${f(x + 42)}" y="${f(y + 20)}" font-size="12" font-weight="800" fill="#C8463A">100</text></g>`;
  }

  function riceBag(x, y) {
    return `<g><path d="M${f(x - 16)} ${f(y)} L${f(x - 12)} ${f(y - 36)} L${f(x + 12)} ${f(y - 36)} L${f(x + 16)} ${f(y)} Z" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.2"/>
      <rect x="${f(x - 10)}" y="${f(y - 28)}" width="20" height="12" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".6"/>
      <text x="${f(x)}" y="${f(y - 19)}" font-size="9" font-weight="800" fill="${K.ink}" text-anchor="middle">米</text></g>`;
  }

  function bowl(x, y, kind) {
    const food = kind === 'noodle'
      ? `<path d="M${f(x - 10)} ${f(y - 8)} q4 -6 8 0 q4 -6 8 0" fill="none" stroke="#E2CF7E" stroke-width="2"/>`
      : kind === 'fen'
        ? `<path d="M${f(x - 8)} ${f(y - 10)} l16 0 M${f(x - 6)} ${f(y - 6)} l12 0" stroke="#F7F4EF" stroke-width="2"/>`
        : `<ellipse cx="${f(x)}" cy="${f(y - 8)}" rx="10" ry="4" fill="#F7F4EF"/>`;
    return `<g><path d="M${f(x - 16)} ${f(y - 6)} Q${f(x)} ${f(y + 12)} ${f(x + 16)} ${f(y - 6)}" fill="#F4E7D4" stroke="${K.ink}" stroke-width="1.1"/>${food}</g>`;
  }

  function stove(x, y) {
    return `<g><rect x="${f(x)}" y="${f(y)}" width="120" height="28" rx="4" fill="#D9D3CB" stroke="${K.ink}"/>
      <circle cx="${f(x + 36)}" cy="${f(y + 8)}" r="10" fill="#4A3B30"/><circle cx="${f(x + 84)}" cy="${f(y + 8)}" r="10" fill="#4A3B30"/>
      <path d="M${f(x + 30)} ${f(y + 8)} q6 4 12 0 M${f(x + 78)} ${f(y + 8)} q6 4 12 0" fill="none" stroke="#E07A3D" stroke-width="1.4"/></g>`;
  }

  function mirror(x, y) {
    return `<g><circle cx="${f(x)}" cy="${f(y)}" r="22" fill="#E7F2F6" stroke="#C4A574" stroke-width="4"/>
      <rect x="${f(x - 3)}" y="${f(y + 20)}" width="6" height="16" fill="#C4A574" stroke="${K.ink}" stroke-width=".6"/></g>`;
  }

  function radiator(x, y) {
    let s = `<rect x="${f(x)}" y="${f(y)}" width="54" height="28" rx="2" fill="#E7E0D6" stroke="${K.ink}"/>`;
    for (let i = 0; i < 5; i++) s += `<rect x="${f(x + 6 + i * 9)}" y="${f(y + 4)}" width="5" height="20" fill="#F7F4EF" stroke="${K.ink}" stroke-width=".5"/>`;
    return s;
  }

  function bed(x, y, w) {
    w = w || 120;
    return `<g><rect x="${f(x)}" y="${f(y)}" width="${w}" height="28" rx="6" fill="#F7F4EF" stroke="${K.ink}"/>
      <rect x="${f(x + 6)}" y="${f(y - 16)}" width="28" height="18" rx="4" fill="#C5D8E4" stroke="${K.ink}" stroke-width=".8"/>
      <path d="M${f(x)} ${f(y + 28)} L${f(x - 4)} ${f(y + 40)} M${f(x + w)} ${f(y + 28)} L${f(x + w + 4)} ${f(y + 40)}" stroke="#7A5A3A" stroke-width="3"/></g>`;
  }

  function piano(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <path d="M-40 10 L-40 -20 L40 -28 L40 4 Z" fill="#2B2622" stroke="${K.ink}"/>
      <rect x="-36" y="-8" width="70" height="8" fill="#F7F4EF"/>
      <rect x="-30" y="-16" width="4" height="10" fill="#2B2622"/><rect x="-18" y="-16" width="4" height="10" fill="#2B2622"/><rect x="-4" y="-16" width="4" height="10" fill="#2B2622"/>
    </g>`;
  }

  function chalkboard(x, y, w, h) {
    return `<g><rect x="${f(x)}" y="${f(y)}" width="${w}" height="${h}" rx="4" fill="#2F6B4F" stroke="#5C4636" stroke-width="6"/>
      <rect x="${f(x - 6)}" y="${f(y + h)}" width="${w + 12}" height="8" fill="#C4A574"/></g>`;
  }

  function colorWheel(x, y, r) {
    const cols = ['#C8463A', '#E07A3D', '#E2B43A', '#C6B43A', '#8FBF4A', '#3FA772', '#2F9E8F', '#3D86D9', '#4C5FD6', '#7C6BD6', '#A85BB5', '#C45B8A'];
    let s = '';
    for (let i = 0; i < 12; i++) {
      const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2;
      const a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
      const x0 = x + Math.cos(a0) * r, y0 = y + Math.sin(a0) * r;
      const x1 = x + Math.cos(a1) * r, y1 = y + Math.sin(a1) * r;
      s += `<path d="M${f(x)} ${f(y)} L${f(x0)} ${f(y0)} A${r} ${r} 0 0 1 ${f(x1)} ${f(y1)} Z" fill="${cols[i]}" stroke="#fff" stroke-width="1"/>`;
    }
    s += `<circle cx="${f(x)}" cy="${f(y)}" r="8" fill="#fff" stroke="${K.ink}" stroke-width=".8"/>`;
    return s;
  }

  function album(x, y) {
    return `<g><rect x="${f(x)}" y="${f(y)}" width="70" height="52" rx="3" fill="#F3E7D3" stroke="${K.ink}"/>
      <rect x="${f(x + 6)}" y="${f(y + 6)}" width="26" height="20" fill="#C5D8E4" stroke="${K.ink}" stroke-width=".6"/>
      <rect x="${f(x + 36)}" y="${f(y + 6)}" width="26" height="20" fill="#E7D3B0" stroke="${K.ink}" stroke-width=".6"/>
      <text x="${f(x + 35)}" y="${f(y + 42)}" font-size="10" font-weight="700" fill="${K.ink}" text-anchor="middle">相册</text></g>`;
  }

  function trashCan(x, y) {
    return `<g><path d="M${f(x - 12)} ${f(y - 16)} L${f(x - 16)} ${f(y + 16)} L${f(x + 16)} ${f(y + 16)} L${f(x + 12)} ${f(y - 16)} Z" fill="#C5D0D6" stroke="${K.ink}"/>
      <rect x="${f(x - 16)}" y="${f(y - 22)}" width="32" height="6" rx="1" fill="#8A8178" stroke="${K.ink}" stroke-width=".7"/></g>`;
  }

  function domino(x, y, w, h) {
    return `<g><rect x="${f(x)}" y="${f(y)}" width="${w || 28}" height="${h || 48}" rx="3" fill="#F7F4EF" stroke="${K.ink}" stroke-width="1.3"/>
      <path d="M${f(x)} ${f(y + (h || 48) / 2)} L${f(x + (w || 28))} ${f(y + (h || 48) / 2)}" stroke="${K.ink}" stroke-width=".8"/></g>`;
  }

  function ropeBridge(x1, y1, x2, y2) {
    const mx = (x1 + x2) / 2, my = Math.max(y1, y2) + 28;
    let s = `<path d="M${f(x1)} ${f(y1)} Q${f(mx)} ${f(my)} ${f(x2)} ${f(y2)}" fill="none" stroke="#C4A574" stroke-width="3"/>`;
    s += `<path d="M${f(x1)} ${f(y1 - 16)} Q${f(mx)} ${f(my - 10)} ${f(x2)} ${f(y2 - 16)}" fill="none" stroke="#A8845A" stroke-width="2"/>`;
    for (let i = 1; i < 6; i++) {
      const t = i / 6;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t + Math.sin(Math.PI * t) * 22;
      s += `<path d="M${f(x)} ${f(y - 14)} L${f(x)} ${f(y)}" stroke="#7A5A3A" stroke-width="1.2"/>`;
      s += `<rect x="${f(x - 8)}" y="${f(y)}" width="16" height="4" fill="#C4A574" stroke="${K.ink}" stroke-width=".5"/>`;
    }
    return s;
  }

  function badge(x, y, t) {
    return `<g filter="url(#soft)"><circle cx="${f(x)}" cy="${f(y)}" r="28" fill="#F2B640" stroke="${K.ink}" stroke-width="1.4"/>
      <circle cx="${f(x)}" cy="${f(y)}" r="20" fill="#FFF6D8" stroke="${K.ink}" stroke-width=".8"/>
      <text x="${f(x)}" y="${f(y + 4)}" font-size="11" font-weight="800" fill="${K.ink}" text-anchor="middle">${t || '徽章'}</text></g>`;
  }

  function cargoShip(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <path d="M-50 8 L-40 22 L46 22 L58 8 Z" fill="#3D5A73" stroke="${K.ink}"/>
      <rect x="-20" y="-16" width="28" height="24" fill="#C8463A" stroke="${K.ink}" stroke-width=".8"/>
      <rect x="12" y="-8" width="22" height="16" fill="#E2B43A" stroke="${K.ink}" stroke-width=".8"/>
      <rect x="-8" y="-28" width="6" height="14" fill="#6E655C"/>
    </g>`;
  }

  function snowflake(x, y, k) {
    k = k || 1;
    let s = '';
    for (let i = 0; i < 6; i++) {
      const a = i * Math.PI / 3;
      s += `<path d="M0 0 L${f(Math.cos(a) * 14)} ${f(Math.sin(a) * 14)}" stroke="#7FB6CF" stroke-width="1.6" stroke-linecap="round"/>`;
    }
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">${s}</g>`;
  }

  function seesaw(x, y) {
    return `<g><polygon points="${f(x - 8)},${f(y)} ${f(x + 8)},${f(y)} ${f(x)},${f(y - 16)}" fill="#C4A574" stroke="${K.ink}"/>
      <rect x="${f(x - 70)}" y="${f(y - 22)}" width="140" height="8" rx="2" transform="rotate(-8 ${f(x)} ${f(y - 18)})" fill="#E7D3B0" stroke="${K.ink}"/></g>`;
  }

  function palaceBoat(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <path d="M-40 6 L-30 18 L36 18 L46 6 Z" fill="#8E3F33" stroke="${K.ink}"/>
      <path d="M-22 -16 Q0 -28 24 -16 L20 6 L-18 6 Z" fill="#F2B640" stroke="${K.ink}"/>
    </g>`;
  }

  function camel(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <path d="M-20 4 Q-16 -10 -6 -6 Q0 -20 10 -8 Q20 -4 22 6 Q8 2 -8 6 Q-16 8 -20 4 Z" fill="#C4A574" stroke="${K.ink}"/>
      <path d="M-22 -2 Q-30 -8 -24 2" fill="#E2CF7E" stroke="${K.ink}" stroke-width=".7"/>
      <path d="M-16 6 L-18 16 M-4 8 L-2 16 M10 6 L12 16 M20 6 L24 16" stroke="#A8845A" stroke-width="2" stroke-linecap="round"/>
    </g>`;
  }

  function lantern(x, y) {
    return `<g><path d="M${f(x)} ${f(y - 18)} L${f(x)} ${f(y - 12)}" stroke="${K.ink}" stroke-width="1"/>
      <path d="M${f(x - 8)} ${f(y - 12)} Q${f(x)} ${f(y + 10)} ${f(x + 8)} ${f(y - 12)} Z" fill="#C8463A" stroke="${K.ink}" stroke-width=".8"/>
      <path d="M${f(x)} ${f(y + 4)} L${f(x)} ${f(y + 12)}" stroke="#E2B43A" stroke-width="1"/></g>`;
  }

  function snake(x, y, k) {
    k = k || 1;
    return `<g transform="translate(${f(x)} ${f(y)}) scale(${k})">
      <path d="M-20 8 Q-8 -10 4 2 Q14 12 22 -2" fill="none" stroke="#3FA772" stroke-width="6" stroke-linecap="round"/>
      <circle cx="24" cy="-4" r="4" fill="#2F8A5B" stroke="${K.ink}" stroke-width=".7"/>
      <circle cx="23" cy="-5" r=".8" fill="${K.ink}"/>
    </g>`;
  }

  function lightCone(x, y, x2, y2, w) {
    return `<path d="M${f(x)} ${f(y)} L${f(x2 - w)} ${f(y2)} L${f(x2 + w)} ${f(y2)} Z" fill="rgba(242,182,64,.35)" stroke="#E2B43A" stroke-width="1"/>`;
  }

  function rainColumn(x, y, h) {
    return `<g><rect x="${f(x)}" y="${f(y - 120)}" width="28" height="120" rx="8" fill="rgba(200,230,240,.25)" stroke="${K.ink}" stroke-width="1.3"/>
      <rect x="${f(x + 3)}" y="${f(y - h)}" width="22" height="${f(h)}" rx="6" fill="#7FB6CF" opacity=".85"/></g>`;
  }

  function plankRoad(x, y) {
    let s = `<path d="M${f(x)} ${f(y + 40)} L${f(x + 16)} ${f(y - 70)} L${f(x + 70)} ${f(y - 90)} L${f(x + 54)} ${f(y + 10)} Z" fill="#8A6F57" stroke="${K.ink}"/>`;
    for (let i = 0; i < 6; i++) {
      const yy = y + 24 - i * 16;
      s += `<rect x="${f(x + 8 + i * 6)}" y="${f(yy)}" width="36" height="6" fill="#C4A574" stroke="${K.ink}" stroke-width=".6"/>`;
      s += `<path d="M${f(x + 10 + i * 6)} ${f(yy)} L${f(x + 4)} ${f(yy + 16)}" stroke="#5C4636" stroke-width="1.4"/>`;
    }
    return s;
  }

  function shipLock(x, y) {
    return `<g>
      <rect x="${f(x)}" y="${f(y)}" width="200" height="90" fill="#D5E8F0" stroke="${K.ink}"/>
      <rect x="${f(x + 96)}" y="${f(y - 8)}" width="8" height="106" fill="#8A8178" stroke="${K.ink}"/>
      <path d="M${f(x + 8)} ${f(y + 54)} L${f(x + 40)} ${f(y + 48)} L${f(x + 70)} ${f(y + 54)} L${f(x + 62)} ${f(y + 64)} L${f(x + 16)} ${f(y + 64)} Z" fill="#C8463A" stroke="${K.ink}" stroke-width=".7"/>
      <path d="M${f(x + 150)} ${f(y + 20)} L${f(x + 158)} ${f(y + 36)}" stroke="#3D86D9" stroke-width="2" marker-end=""/>
      <path d="M${f(x + 154)} ${f(y + 34)} L${f(x + 150)} ${f(y + 28)} L${f(x + 160)} ${f(y + 28)}" fill="#3D86D9"/>
    </g>`;
  }

  function riverProfile(x, y, w) {
    w = w || 260;
    return `<g><path d="M${f(x)} ${f(y)} L${f(x + 50)} ${f(y + 28)} L${f(x + 100)} ${f(y + 70)} L${f(x + w)} ${f(y + 78)} L${f(x + w)} ${f(y + 110)} L${f(x)} ${f(y + 110)} Z" fill="#C9A27E" stroke="${K.ink}"/>
      <path d="M${f(x + 4)} ${f(y + 6)} L${f(x + 52)} ${f(y + 32)} L${f(x + 102)} ${f(y + 66)} L${f(x + w - 8)} ${f(y + 74)}" fill="none" stroke="#3D86D9" stroke-width="3" stroke-linecap="round"/></g>`;
  }

  S.talk = talk;
  S.lab = lab;
  S.glow = glow;
  S.kid = kid;
  S.yin = yin;
  S.trainCar = trainCar;
  S.rowboat = rowboat;
  S.oxCart = oxCart;
  S.horseRider = horseRider;
  S.magnifier = magnifier;
  S.scale = scale;
  S.battery = battery;
  S.jar = jar;
  S.piggy = piggy;
  S.bankbook = bankbook;
  S.bill = bill;
  S.riceBag = riceBag;
  S.bowl = bowl;
  S.stove = stove;
  S.mirror = mirror;
  S.radiator = radiator;
  S.bed = bed;
  S.piano = piano;
  S.chalkboard = chalkboard;
  S.colorWheel = colorWheel;
  S.album = album;
  S.trashCan = trashCan;
  S.domino = domino;
  S.ropeBridge = ropeBridge;
  S.badge = badge;
  S.cargoShip = cargoShip;
  S.snowflake = snowflake;
  S.seesaw = seesaw;
  S.palaceBoat = palaceBoat;
  S.camel = camel;
  S.lantern = lantern;
  S.snake = snake;
  S.lightCone = lightCone;
  S.rainColumn = rainColumn;
  S.plankRoad = plankRoad;
  S.shipLock = shipLock;
  S.riverProfile = riverProfile;

  S.part('小满', kid(78, 112, { k: 0.72, pose: 'cheer', face: 'happy', prop: 'backpack' }), 'w2');
  S.part('小音', yin(80, 78, { k: 0.9, face: 'happy', arm: 'point' }), 'w2');
  S.part('火车头', trainCar(24, 78, 1), 'w2');
  S.part('小木船', rowboat(80, 70, 1), 'w2');
  S.part('牛车', oxCart(70, 78, 1), 'w2');
  S.part('骑马信使', horseRider(80, 78, 1.05), 'w2');
  S.part('放大镜', magnifier(70, 62, 1.1), 'w2');
  S.part('天平', scale(80, 100, -8), 'w2');
  S.part('电池', battery(42, 40, 0.5), 'w2');
  S.part('存钱罐', jar(80, 40, 6, '1000'), 'w2');
  S.part('储钱猪', piggy(80, 70, 1.2), 'w2');
  S.part('存折', bankbook(42, 12), 'w2');
  S.part('百元钞', bill(46, 46), 'w2');
  S.part('米袋', riceBag(80, 90), 'w2');
  S.part('碗', bowl(80, 70, 'noodle'), 'w2');
  S.part('灶台', stove(20, 50), 'w2');
  S.part('铜镜', mirror(80, 52), 'w2');
  S.part('暖气', radiator(52, 46), 'w2');
  S.part('床', bed(20, 50, 110), 'w2');
  S.part('钢琴', piano(80, 70, 1.1), 'w2');
  S.part('黑板', chalkboard(16, 20, 128, 70), 'w2');
  S.part('色轮', colorWheel(80, 60, 36), 'w2');
  S.part('相册', album(44, 32), 'w2');
  S.part('垃圾桶', trashCan(80, 64), 'w2');
  S.part('骨牌', domino(64, 30, 32, 56), 'w2');
  S.part('吊桥', ropeBridge(16, 40, 144, 50), 'w2');
  S.part('徽章', badge(80, 60, '第 1 周'), 'w2');
  S.part('货船', cargoShip(80, 70, 1.1), 'w2');
  S.part('雪花', snowflake(80, 60, 2), 'w2');
  S.part('跷跷板', seesaw(80, 80), 'w2');
  S.part('龙舟', palaceBoat(80, 70, 1.2), 'w2');
  S.part('骆驼', camel(80, 72, 1.4), 'w2');
  S.part('灯笼', lantern(80, 70), 'w2');
  S.part('蛇', snake(70, 70, 1.6), 'w2');
  S.part('雨量柱', rainColumn(66, 110, 70), 'w2');
  S.part('栈道', plankRoad(30, 40), 'w2');
  S.part('船闸', shipLock(8, 16), 'w2');
})(window);
