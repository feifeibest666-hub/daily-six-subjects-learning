(function (global) {
  let seq = 0;

  function create(size) {
    const id = 'mh' + (++seq);
    const px = size || 64;
    const svg = LK.svg('svg', {
      class: 'mascot',
      viewBox: '0 0 64 64',
      width: px,
      height: px,
      'aria-hidden': 'true'
    });
    const defs = LK.svg('defs', {});
    const grad = LK.svg('linearGradient', { id: id, x1: '0', y1: '0', x2: '1', y2: '1' });
    grad.appendChild(LK.svg('stop', { offset: '0', 'stop-color': '#7C6BD6' }));
    grad.appendChild(LK.svg('stop', { offset: '1', 'stop-color': '#9B8CF0' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    const bob = LK.svg('g', { class: 'mascot-bob' });
    const head = LK.svg('g', { class: 'note-head' });
    head.appendChild(LK.svg('circle', { cx: '26', cy: '42', r: '18', fill: 'url(#' + id + ')' }));
    const eyeL = LK.svg('g', { class: 'eye-g' });
    eyeL.appendChild(LK.svg('ellipse', { cx: '20', cy: '40', rx: '3.3', ry: '3.8', fill: '#fff' }));
    eyeL.appendChild(LK.svg('circle', { cx: '21', cy: '41.2', r: '1.5', fill: '#2B2622' }));
    const eyeR = LK.svg('g', { class: 'eye-g' });
    eyeR.appendChild(LK.svg('ellipse', { cx: '31', cy: '38', rx: '3.3', ry: '3.8', fill: '#fff' }));
    eyeR.appendChild(LK.svg('circle', { cx: '32', cy: '39.2', r: '1.5', fill: '#2B2622' }));
    head.appendChild(eyeL);
    head.appendChild(eyeR);
    head.appendChild(LK.svg('path', {
      d: 'M21 47 q5 3.2 9 0',
      fill: 'none',
      stroke: '#2B2622',
      'stroke-width': '1.3',
      'stroke-linecap': 'round'
    }));
    const flag = LK.svg('g', { class: 'note-flag' });
    flag.appendChild(LK.svg('path', {
      d: 'M42 16 V36',
      fill: 'none',
      stroke: '#7C6BD6',
      'stroke-width': '3.2',
      'stroke-linecap': 'round'
    }));
    flag.appendChild(LK.svg('path', {
      d: 'M42 16c7 1.5 14 7 12.5 15c-.8 4.2-6 6.2-12.5 3.6',
      fill: '#9B8CF0'
    }));
    bob.appendChild(head);
    bob.appendChild(flag);
    svg.appendChild(bob);
    attachIdle(svg);
    return svg;
  }

  function blink(svg) {
    if (LKMotion.reduce()) return;
    svg.querySelectorAll('.eye-g').forEach(function (e) {
      e.animate(
        [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.1)', offset: .45 }, { transform: 'scaleY(1)' }],
        { duration: 160, easing: 'ease-in-out' }
      );
    });
  }

  function attachIdle(svg) {
    const tick = function () {
      if (!svg.isConnected) return;
      blink(svg);
      const wait = 3000 + Math.random() * 3000;
      svg._blinkTimer = setTimeout(tick, wait);
    };
    svg._blinkTimer = setTimeout(tick, 800 + Math.random() * 2200);
  }

  function flame() {
    const svg = LK.svg('svg', { class: 'flame', viewBox: '0 0 24 32', width: '22', height: '28', 'aria-hidden': 'true' });
    svg.appendChild(LK.svg('path', {
      d: 'M12 30c6 0 9-4.5 9-10.5C21 13 17 9.5 15 5c-1 4-3.2 6-5.2 7C11 6 9 2.5 6.2 1c0 5-3 8-4 12C.6 15.2.2 18 1.2 21.2 2.6 26 6.8 30 12 30z',
      fill: '#F2B640'
    }));
    svg.appendChild(LK.svg('path', {
      d: 'M12 28c2.8 0 4.6-2.4 4.6-5.6 0-2.6-1.6-4.4-2.8-7-1 2.6-2.2 3.6-3.2 3.6.2-2.8-.8-5-1.8-6.6-.2 2.6-1.8 4.4-2.2 7.2-.6 2.2-.4 4.2.6 5.8C8.2 27 10 28 12 28z',
      fill: '#E0795B'
    }));
    return svg;
  }

  global.LKMascot = { create: create, flame: flame, blink: blink };
})(window);
