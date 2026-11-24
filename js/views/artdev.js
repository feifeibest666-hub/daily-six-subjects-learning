(function (global) {
  function cell(draw) {
    const svg = LK.svg('svg', { viewBox: '0 0 120 140', width: '72', height: '84' });
    svg.style.background = '#FBF7F1';
    svg.style.borderRadius = '8px';
    draw(svg);
    return svg;
  }

  function mount() {
    const state = LKStore.get();
    const on = (state.settings && state.settings.debug) || (location.search || '').indexOf('dev=1') >= 0;
    const screen = LK.h('div', { class: 'screen art-screen' });
    screen.appendChild(LK.h('h1', { class: 'card-h', text: '套件总览' }));
    if (!on) {
      screen.appendChild(LK.h('p', { class: 'empty', text: '测试开关没开。到设置里连点版本号，或在地址后加 ?dev=1。' }));
      return screen;
    }
    if (!global.LKArt) {
      screen.appendChild(LK.h('p', { text: '美术套件还没载入。' }));
      return screen;
    }
    function section(title, items, draw) {
      screen.appendChild(LK.h('h2', { class: 'set-label', text: title }));
      const row = LK.h('div', { class: 'art-grid' });
      items.forEach(function (name) {
        const fig = LK.h('figure', { class: 'art-cell' });
        fig.appendChild(cell(function (svg) { draw(svg, name); }));
        fig.appendChild(LK.h('figcaption', { text: name }));
        row.appendChild(fig);
      });
      screen.appendChild(row);
    }
    section('表情', LKArt.faces, function (svg, name) {
      LKArt.person(svg, { who: 'xiaoman', x: 60, y: 120, face: name, pose: 'stand', k: 0.9, W: 120, H: 140 });
    });
    section('手势', LKArt.poses, function (svg, name) {
      LKArt.person(svg, { who: 'xiaoman', x: 60, y: 124, face: 'happy', pose: name, k: 0.85, W: 120, H: 140 });
    });
    section('帽子', LKArt.hats, function (svg, name) {
      LKArt.person(svg, { who: 'kingWu', x: 60, y: 124, hat: name, face: 'calm', pose: 'stand', k: 0.8, W: 120, H: 140 });
    });
    section('身体', LKArt.bodies, function (svg, name) {
      LKArt.person(svg, { body: name, hair: 'bun', x: 60, y: 124, face: 'calm', pose: 'stand', k: 0.85, cloth: '#C8664A', W: 120, H: 140 });
    });
    section('道具', LKArt.props, function (svg, name) {
      LKArt.prop(svg, { what: name, x: 60, y: 70, k: 1.3, W: 120, H: 140 });
    });
    section('角色', Object.keys(global.CAST || {}), function (svg, name) {
      LKArt.person(svg, { who: name, x: 60, y: 124, face: 'happy', pose: 'stand', k: 0.7, W: 120, H: 140 });
    });
    section('背景', LKArt.bgs, function (svg, name) {
      LKArt.bg(svg, name, 120, 140);
    });
    if (global.LKScene && LKScene.parts && LKScene.parts.length) {
      const groups = [
        { title: '场景零件', id: 'kit-parts', items: LKScene.parts.filter(function (p) { return p.group !== 'w1' && p.group !== 'w2'; }) },
        { title: '第一波新零件', id: 'w1-parts', items: LKScene.parts.filter(function (p) { return p.group === 'w1'; }) },
        { title: '第二波新零件', id: 'w2-parts', items: LKScene.parts.filter(function (p) { return p.group === 'w2'; }) }
      ];
      groups.forEach(function (g) {
        if (!g.items.length) return;
        screen.appendChild(LK.h('h2', { class: 'set-label', text: g.title }));
        const row = LK.h('div', { class: 'art-grid', id: g.id });
        g.items.forEach(function (p) {
          const fig = LK.h('figure', { class: 'art-cell scene-cell' });
          const svg = LK.svg('svg', { viewBox: '0 0 160 120' });
          const body = typeof p.svg === 'function' ? p.svg() : p.svg;
          svg.innerHTML = LKScene.defs() + '<rect width="160" height="120" fill="#FBF6EE"/>' + body;
          fig.appendChild(svg);
          fig.appendChild(LK.h('figcaption', { text: p.name }));
          row.appendChild(fig);
        });
        screen.appendChild(row);
      });
    }
    return screen;
  }

  global.LKArtDev = { mount: mount };
})(window);
