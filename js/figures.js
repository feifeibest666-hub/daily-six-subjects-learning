/* 图解都是示意，不是实拍，也不是精确地图。 */
(function () {
  const svg = (label, inner) =>
    `<svg viewBox="0 0 320 168" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">${inner}</svg>`;
  const T = '#241910';
  const M = '#7a6a5c';

  window.FIGURES = {
    contrast: svg('同一块灰放在黑底和白底上', `
      <rect x="16" y="28" width="136" height="112" rx="16" fill="#1c1c1c"/>
      <rect x="168" y="28" width="136" height="112" rx="16" fill="#f4f1ea" stroke="#e4d8c8"/>
      <rect x="54" y="62" width="60" height="60" rx="8" fill="#8e8e8e"/>
      <rect x="206" y="62" width="60" height="60" rx="8" fill="#8e8e8e"/>
      <text x="84" y="22" text-anchor="middle" font-size="12" fill="${M}">黑底上看着更亮</text>
      <text x="236" y="22" text-anchor="middle" font-size="12" fill="${M}">白底上看着更暗</text>`),

    'attention-color': svg('大面积中性色里只有一小块红', `
      <rect x="36" y="36" width="168" height="36" rx="8" fill="#d9d3cb"/>
      <rect x="36" y="80" width="168" height="52" rx="8" fill="#cfc6bb"/>
      <circle cx="242" cy="78" r="28" fill="#e24b4b"/>
      <text x="242" y="128" text-anchor="middle" font-size="12" fill="${M}">视线先到这里</text>
      <text x="36" y="26" font-size="12" fill="${M}">安静的大面积</text>`),

    'three-piles': svg('收入、利润、现金三个不同的数', `
      <rect x="28" y="48" width="72" height="88" rx="12" fill="#f3d48a"/>
      <rect x="124" y="78" width="72" height="58" rx="12" fill="#f0b429"/>
      <rect x="220" y="96" width="72" height="40" rx="12" fill="#e07a5f"/>
      <text x="64" y="42" text-anchor="middle" font-size="13" fill="${T}">收入</text>
      <text x="160" y="72" text-anchor="middle" font-size="13" fill="${T}">利润</text>
      <text x="256" y="90" text-anchor="middle" font-size="13" fill="${T}">现金</text>
      <text x="64" y="156" text-anchor="middle" font-size="12" fill="${M}">4000</text>
      <text x="160" y="156" text-anchor="middle" font-size="12" fill="${M}">700</text>
      <text x="256" y="156" text-anchor="middle" font-size="12" fill="${M}">变少</text>`),

    liangzhu: svg('余粮养活分工，组织变得更复杂', `
      <rect x="24" y="108" width="272" height="28" rx="8" fill="#e7d7b8"/>
      <text x="40" y="127" font-size="13" fill="${T}">余粮</text>
      <rect x="70" y="70" width="70" height="28" rx="8" fill="#d7c4a3"/>
      <text x="84" y="89" font-size="13" fill="${T}">分工</text>
      <rect x="150" y="36" width="120" height="28" rx="8" fill="#c47b5a"/>
      <text x="168" y="55" font-size="13" fill="#fff">水利 · 玉礼器</text>
      <path d="M40 108 V92 H105 V70 M140 84 H150 V64" stroke="${T}" fill="none" stroke-width="1.5"/>`),

    'coffee-order': svg("I'd like a latte, please", `
      <rect x="24" y="36" width="272" height="96" rx="18" fill="#fff" stroke="#eadfce"/>
      <text x="44" y="72" font-size="15" fill="#9aa">I'd like</text>
      <rect x="118" y="52" width="78" height="28" rx="14" fill="#3b82f6"/>
      <text x="157" y="71" text-anchor="middle" font-size="14" fill="#fff">a latte</text>
      <text x="208" y="72" font-size="15" fill="${T}">, please.</text>
      <text x="44" y="108" font-size="13" fill="${M}">我想要一杯拿铁。</text>`),

    contour: svg('等高线越密坡越陡', `
      <path d="M30 130 C80 130 90 40 160 40 C230 40 240 130 290 130" fill="none" stroke="#c4b6a4" stroke-width="8"/>
      <path d="M48 118 C90 118 100 58 160 58 C220 58 230 118 272 118" fill="none" stroke="#14b8a6" stroke-width="3"/>
      <path d="M70 104 C100 104 112 74 160 74 C208 74 220 104 250 104" fill="none" stroke="#0f766e" stroke-width="3"/>
      <text x="168" y="28" font-size="12" fill="${M}">线挤在一起 · 更陡</text>`),

    spotlight: svg('注意的光只照住正在数的东西', `
      <circle cx="160" cy="86" r="46" fill="#f6e27a" opacity=".9"/>
      <circle cx="70" cy="92" r="16" fill="#d7cfc3"/>
      <circle cx="248" cy="96" r="18" fill="#d7cfc3"/>
      <text x="160" y="91" text-anchor="middle" font-size="13" fill="${T}">正在数的</text>
      <text x="70" y="128" text-anchor="middle" font-size="11" fill="${M}">没照到</text>
      <text x="248" y="132" text-anchor="middle" font-size="11" fill="${M}">也没照到</text>`),

    'value-edge': svg('浅色上衣和深色裤子形成分界', `
      <path d="M118 28 h84 l16 46 v18 h-20 l8 62 h-92 l8-62 h-20 v-18 z" fill="#f4efe6" stroke="${T}" stroke-width="1.4"/>
      <path d="M122 96 h76 l10 48 h-96 z" fill="#2c2a28"/>
      <text x="40" y="70" font-size="12" fill="${M}">浅</text>
      <text x="40" y="130" font-size="12" fill="${M}">深</text>
      <text x="230" y="100" font-size="12" fill="#e24b4b">分界</text>`),

    interest: svg('3000 元年利率 2%，半年 30 元，一年 60 元', `
      <rect x="20" y="58" width="84" height="52" rx="12" fill="#fff4db" stroke="#f0b429"/>
      <text x="62" y="88" text-anchor="middle" font-size="16" fill="${T}">3000</text>
      <text x="128" y="80" font-size="12" fill="${M}">半年</text>
      <rect x="168" y="40" width="64" height="36" rx="10" fill="#f3d48a"/>
      <text x="200" y="63" text-anchor="middle" font-size="14" fill="${T}">+30</text>
      <text x="128" y="124" font-size="12" fill="${M}">一年</text>
      <rect x="168" y="100" width="64" height="36" rx="10" fill="#f0b429"/>
      <text x="200" y="123" text-anchor="middle" font-size="14" fill="${T}">+60</text>
      <text x="246" y="78" font-size="12" fill="${M}">下一轮从</text>
      <text x="246" y="96" font-size="12" fill="${T}">3030 起</text>`),

    dynasty: svg('夏、商、西周按顺序钉在时间线上', `
      <line x1="28" y1="84" x2="292" y2="84" stroke="#e7d3c4" stroke-width="4"/>
      <circle cx="62" cy="84" r="12" fill="#e2584d"/>
      <circle cx="160" cy="84" r="12" fill="#c44732"/>
      <circle cx="258" cy="84" r="12" fill="#8c2f27"/>
      <text x="62" y="58" text-anchor="middle" font-size="16" fill="${T}">夏</text>
      <text x="160" y="58" text-anchor="middle" font-size="16" fill="${T}">商</text>
      <text x="258" y="58" text-anchor="middle" font-size="16" fill="${T}">西周</text>
      <text x="62" y="118" text-anchor="middle" font-size="11" fill="${M}">世袭</text>
      <text x="160" y="118" text-anchor="middle" font-size="11" fill="${M}">甲骨·青铜</text>
      <text x="258" y="118" text-anchor="middle" font-size="11" fill="${M}">分封·礼</text>`),

    ticket: svg('Single or return', `
      <rect x="28" y="40" width="120" height="78" rx="14" fill="#e6f0ff" stroke="#3b82f6"/>
      <rect x="172" y="40" width="120" height="78" rx="14" fill="#fff" stroke="#d5e4fb"/>
      <text x="88" y="76" text-anchor="middle" font-size="16" fill="#1d4ed8">Single</text>
      <text x="88" y="98" text-anchor="middle" font-size="12" fill="${M}">单程</text>
      <text x="232" y="76" text-anchor="middle" font-size="16" fill="${T}">Return</text>
      <text x="232" y="98" text-anchor="middle" font-size="12" fill="${M}">往返</text>`),

    watershed: svg('山脊把雨水分向两条河', `
      <path d="M20 120 L160 36 L300 120" fill="#e7f6f3" stroke="#0f766e" stroke-width="2"/>
      <path d="M70 120 C90 90 120 100 150 120" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <path d="M170 120 C210 96 250 100 290 120" fill="none" stroke="#3b82f6" stroke-width="3"/>
      <text x="160" y="28" text-anchor="middle" font-size="12" fill="${M}">分水岭</text>
      <text x="78" y="146" font-size="12" fill="#1d4ed8">这条河</text>
      <text x="210" y="146" font-size="12" fill="#1d4ed8">另一条河</text>`),

    memory: svg('当时的版本和后来讲出来的版本', `
      <rect x="24" y="40" width="120" height="88" rx="12" fill="#f1ebff"/>
      <rect x="176" y="40" width="120" height="88" rx="12" fill="#fff" stroke="#ddd0f5"/>
      <text x="84" y="78" text-anchor="middle" font-size="14" fill="${T}">当时</text>
      <text x="84" y="100" text-anchor="middle" font-size="12" fill="${M}">看见的</text>
      <text x="236" y="72" text-anchor="middle" font-size="14" fill="${T}">后来</text>
      <text x="236" y="94" text-anchor="middle" font-size="12" fill="${M}">补上的</text>
      <text x="236" y="112" text-anchor="middle" font-size="12" fill="#8b5cf6">听说的</text>`),

    silhouette: svg('只有肩部放大，其余收着', `
      <path d="M104 78 q56 -52 112 0 l18 18 -28 10 6 62 h-104 l6-62 -28-10 z" fill="#3a342e"/>
      <circle cx="160" cy="42" r="16" fill="#f0c7a8"/>
      <text x="160" y="156" text-anchor="middle" font-size="12" fill="${M}">体积只放在肩</text>`),

    basket: svg('同一篮子午餐变贵，顿数变少', `
      <rect x="36" y="48" width="100" height="72" rx="12" fill="#fff4db" stroke="#f0b429"/>
      <text x="86" y="78" text-anchor="middle" font-size="14" fill="${T}">去年</text>
      <text x="86" y="100" text-anchor="middle" font-size="13" fill="${M}">11 顿</text>
      <rect x="184" y="48" width="100" height="72" rx="12" fill="#fde8e4" stroke="#e07a5f"/>
      <text x="234" y="78" text-anchor="middle" font-size="14" fill="${T}">今年</text>
      <text x="234" y="100" text-anchor="middle" font-size="13" fill="${M}">10 顿</text>
      <text x="160" y="28" text-anchor="middle" font-size="12" fill="${M}">同样 330 元</text>`),

    'spring-power': svg('周王名义还在，诸侯实际更大', `
      <rect x="110" y="24" width="100" height="36" rx="10" fill="#f6e4dc" stroke="#e7b2a8"/>
      <text x="160" y="47" text-anchor="middle" font-size="14" fill="${T}">周王</text>
      <rect x="28" y="96" width="72" height="40" rx="10" fill="#e2584d"/>
      <rect x="124" y="88" width="72" height="48" rx="10" fill="#c44732"/>
      <rect x="220" y="96" width="72" height="40" rx="10" fill="#e2584d"/>
      <text x="64" y="121" text-anchor="middle" font-size="13" fill="#fff">齐</text>
      <text x="160" y="117" text-anchor="middle" font-size="13" fill="#fff">晋</text>
      <text x="256" y="121" text-anchor="middle" font-size="13" fill="#fff">楚</text>`),

    'too-small': svg("It's too small", `
      <rect x="28" y="44" width="264" height="80" rx="16" fill="#fff" stroke="#eadfce"/>
      <text x="48" y="92" font-size="22" fill="${T}">It's too small.</text>`),

    cycle: svg('水蒸发成云，再变成雨落回地面', `
      <path d="M40 120 H280" stroke="#b9c8c4" stroke-width="2"/>
      <circle cx="70" cy="108" r="10" fill="#60a5fa"/>
      <path d="M70 90 C70 70 90 62 100 48" fill="none" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="160" cy="46" rx="36" ry="16" fill="#e2e8f0" stroke="#94a3b8"/>
      <path d="M200 56 C220 80 230 90 236 108" fill="none" stroke="#3b82f6" stroke-width="2"/>
      <text x="70" y="146" text-anchor="middle" font-size="12" fill="${M}">蒸发</text>
      <text x="160" y="28" text-anchor="middle" font-size="12" fill="${M}">云</text>
      <text x="236" y="146" text-anchor="middle" font-size="12" fill="${M}">雨</text>`),

    reinforce: svg('正强化和负强化都会让行为更常出现', `
      <rect x="20" y="36" width="130" height="56" rx="12" fill="#e5f6ec"/>
      <text x="85" y="60" text-anchor="middle" font-size="13" fill="${T}">正强化</text>
      <text x="85" y="78" text-anchor="middle" font-size="11" fill="${M}">好东西出现</text>
      <rect x="170" y="36" width="130" height="56" rx="12" fill="#e7f6f3"/>
      <text x="235" y="60" text-anchor="middle" font-size="13" fill="${T}">负强化</text>
      <text x="235" y="78" text-anchor="middle" font-size="11" fill="${M}">讨厌的被拿走</text>
      <text x="160" y="128" text-anchor="middle" font-size="13" fill="${T}">行为都更可能再来</text>
      <text x="160" y="150" text-anchor="middle" font-size="12" fill="${M}">惩罚则是让它变少</text>`),

    layers: svg('同色靠光泽和厚薄分层', `
      <rect x="78" y="36" width="164" height="28" rx="8" fill="#1f3d34"/>
      <rect x="92" y="70" width="148" height="28" rx="8" fill="#2f6b56"/>
      <rect x="106" y="104" width="132" height="28" rx="8" fill="#8fd0b8"/>
      <text x="40" y="56" font-size="12" fill="${M}">亮</text>
      <text x="40" y="90" font-size="12" fill="${M}">厚</text>
      <text x="40" y="124" font-size="12" fill="${M}">薄</text>`),

    'cost-lines': svg('固定成本是横线，变动成本随人数上升', `
      <line x1="40" y1="132" x2="292" y2="132" stroke="#e6d8c8"/>
      <line x1="40" y1="132" x2="40" y2="24" stroke="#e6d8c8"/>
      <line x1="40" y1="48" x2="280" y2="48" stroke="#f0b429" stroke-width="3"/>
      <line x1="40" y1="120" x2="280" y2="36" stroke="#c47b5a" stroke-width="3"/>
      <text x="200" y="42" font-size="12" fill="#a16207">固定 1200</text>
      <text x="196" y="108" font-size="12" fill="#9a3412">变动</text>`),

    seven: svg('西秦、东齐、南楚、东北燕，中间赵魏韩', `
      <text x="28" y="84" font-size="16" fill="#e2584d">秦</text>
      <text x="268" y="84" font-size="16" fill="#e2584d">齐</text>
      <text x="150" y="150" text-anchor="middle" font-size="16" fill="#e2584d">楚</text>
      <text x="230" y="36" font-size="16" fill="#e2584d">燕</text>
      <text x="150" y="84" text-anchor="middle" font-size="13" fill="${T}">赵 · 魏 · 韩</text>
      <text x="160" y="20" text-anchor="middle" font-size="11" fill="${M}">相对位置，不是精确国界</text>`),

    checkin: svg("I'd like to check in", `
      <rect x="24" y="40" width="272" height="88" rx="16" fill="#fff" stroke="#d5e4fb"/>
      <text x="44" y="78" font-size="16" fill="#1d4ed8">I'd like to</text>
      <text x="158" y="78" font-size="16" fill="${T}">check in.</text>
      <text x="44" y="108" font-size="13" fill="${M}">我想办理入住。</text>`),

    'weather-climate': svg('左边是明天下午，右边是许多年的冬天', `
      <rect x="20" y="36" width="130" height="100" rx="14" fill="#e7f6f3"/>
      <rect x="170" y="36" width="130" height="100" rx="14" fill="#dff3ef"/>
      <text x="85" y="72" text-anchor="middle" font-size="15" fill="${T}">明天下午</text>
      <text x="85" y="96" text-anchor="middle" font-size="13" fill="${M}">天气</text>
      <text x="235" y="72" text-anchor="middle" font-size="15" fill="${T}">许多个冬天</text>
      <text x="235" y="96" text-anchor="middle" font-size="13" fill="${M}">气候</text>`),

    anchor: svg('先看见 8000，6000 就被它拉着比较', `
      <text x="48" y="70" font-size="28" fill="#d7cfc3" text-decoration="line-through">8000</text>
      <text x="48" y="118" font-size="28" fill="${T}">6000</text>
      <text x="180" y="78" font-size="13" fill="${M}">锚在这里</text>
      <path d="M196 88 v24" stroke="#8b5cf6" stroke-width="2"/>
      <text x="180" y="128" font-size="13" fill="#8b5cf6">比较被它拉住</text>`),

    'one-hero': svg('只有上衣是主角，裤子退到后面', `
      <rect x="70" y="36" width="70" height="78" rx="12" fill="#7f1d3a"/>
      <rect x="160" y="48" width="90" height="96" rx="12" fill="#2a2624"/>
      <text x="105" y="132" text-anchor="middle" font-size="12" fill="#7f1d3a">主角</text>
      <text x="205" y="160" text-anchor="middle" font-size="12" fill="${M}">让路</text>`),

    breakeven: svg('10 份 120 元刚好填满 1200 元', `
      <rect x="36" y="28" width="120" height="116" rx="14" fill="none" stroke="#f0b429" stroke-width="2"/>
      ${Array.from({length: 10}, (_, i) => `<rect x="48" y="${124 - i * 10}" width="96" height="8" rx="2" fill="#f3d48a"/>`).join('')}
      <text x="190" y="70" font-size="14" fill="${T}">10 × 120</text>
      <text x="190" y="94" font-size="14" fill="${T}">= 1200</text>
      <text x="190" y="118" font-size="12" fill="${M}">刚好够本</text>`),

    dujiangyan: svg('鱼嘴把岷江分成内江和外江', `
      <path d="M160 16 C150 70 120 90 70 150" fill="none" stroke="#60a5fa" stroke-width="10"/>
      <path d="M160 16 C170 70 210 90 270 150" fill="none" stroke="#93c5fd" stroke-width="10"/>
      <circle cx="160" cy="78" r="8" fill="#e2584d"/>
      <text x="108" y="150" font-size="12" fill="#1d4ed8">内江</text>
      <text x="214" y="150" font-size="12" fill="#1d4ed8">外江</text>
      <text x="176" y="74" font-size="12" fill="${T}">鱼嘴</text>`),

    repair: svg("The air conditioner isn't working", `
      <rect x="24" y="44" width="272" height="80" rx="16" fill="#fff" stroke="#d5e4fb"/>
      <text x="40" y="80" font-size="15" fill="${T}">isn't working.</text>
      <text x="40" y="104" font-size="13" fill="${M}">现在没有正常运转</text>`),

    wind: svg('北风从北吹向南；40% 不是四成时间', `
      <path d="M160 28 v70" stroke="#0f766e" stroke-width="3"/>
      <path d="M148 86 l12 16 l12-16" fill="#0f766e"/>
      <text x="176" y="64" font-size="14" fill="${T}">北风</text>
      <text x="40" y="130" font-size="13" fill="${M}">从北来，往南去</text>
      <circle cx="250" cy="108" r="28" fill="#dff3ef" stroke="#14b8a6"/>
      <text x="250" y="113" text-anchor="middle" font-size="14" fill="${T}">40%</text>`),
  };
})();
