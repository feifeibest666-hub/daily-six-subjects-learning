(function (global) {
  function build(svg) { svg._built = true; }

  function apply(svg, state, tween, ctx) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const panels = (ctx && ctx.visual && ctx.visual.panels) || [];
    const sheet = ctx && ctx.sheet;
    const nocap = ctx && ctx.nocaption;
    const sceneName = ctx && ctx.visual && ctx.visual.scene;
    if (sceneName && global.LKScene) {
      if (sheet) {
        svg.setAttribute('viewBox', '0 0 700 540');
        let html = '';
        panels.slice(0, 4).forEach(function (panel, i) {
          const col = i % 2;
          const row = Math.floor(i / 2);
          const x = 8 + col * 348;
          const y = 8 + row * 266;
          const step = panel && panel.step != null ? panel.step : i;
          html += '<svg x="' + x + '" y="' + y + '" width="332" height="250" viewBox="0 0 340 260">' + LKScene.draw(sceneName, { step: step }) + '</svg>';
        });
        svg.innerHTML = html;
        return;
      }
      svg.setAttribute('viewBox', '0 0 340 260');
      const panel = panels[ctx.index] || panels[0] || {};
      const step = panel.step != null ? panel.step : (ctx.index || 0);
      svg.innerHTML = LKScene.draw(sceneName, { step: step });
      if (tween < 1 && ctx && !ctx.reduced) svg.setAttribute('opacity', String(0.4 + 0.6 * tween));
      return;
    }
    if (!panels.length || !global.LKArt) return;
    if (sheet) {
      svg.setAttribute('viewBox', '0 0 700 540');
      const gap = 16;
      const pw = 332;
      const ph = 250;
      panels.slice(0, 4).forEach(function (panel, i) {
        const col = i % 2;
        const row = Math.floor(i / 2);
        LKArt.drawPanel(svg, panel, {
          x: 8 + col * (pw + gap),
          y: 8 + row * (ph + gap),
          w: pw,
          h: ph
        }, { nocaption: nocap, gold: i === (ctx.index || 0) });
      });
      return;
    }
    svg.setAttribute('viewBox', '0 0 340 260');
    const panel = panels[ctx.index] || panels[0];
    const g = LKArt.drawPanel(svg, panel, { x: 0, y: 0, w: 340, h: 260 }, { nocaption: nocap, gold: false });
    if (tween < 1 && ctx && !ctx.reduced) g.setAttribute('opacity', String(0.4 + 0.6 * tween));
  }

  LKStage.register('comic', { viewBox: '0 0 340 260', build: build, apply: apply, anim: {} });
})(window);
