(function (global) {
  function build(svg) { svg._built = true; }

  function apply(svg, state, tween, ctx) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    const panels = (ctx && ctx.visual && ctx.visual.panels) || [];
    const sheet = ctx && ctx.sheet;
    const nocap = ctx && ctx.nocaption;
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
