(function (global) {
  function star(on) {
    const svg = LK.svg('svg', { viewBox: '0 0 24 24', class: 'star-ico' + (on ? ' is-on' : ''), 'aria-hidden': 'true' });
    svg.appendChild(LK.svg('path', {
      d: 'M12 2.6l2.7 5.5 6.1.9-4.4 4.3 1 6.1L12 16.6 6.6 19.4l1-6.1L3.2 9l6.1-.9L12 2.6z',
      fill: on ? '#F2B640' : 'none',
      stroke: on ? '#E0A42E' : '#A79E94',
      'stroke-width': '1.6',
      'stroke-linejoin': 'round'
    }));
    return svg;
  }

  function stars(n, total) {
    const row = LK.h('span', { class: 'star-row', 'aria-label': n + ' 颗星' });
    for (let i = 0; i < (total || 3); i++) row.appendChild(star(i < n));
    return row;
  }

  function gear() {
    const svg = LK.svg('svg', { viewBox: '0 0 24 24', width: '22', height: '22', 'aria-hidden': 'true' });
    svg.appendChild(LK.svg('circle', { cx: '12', cy: '12', r: '3', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8' }));
    svg.appendChild(LK.svg('path', {
      d: 'M12 3.5v2.2M12 18.3V20.5M3.5 12h2.2M18.3 12H20.5M6 6l1.6 1.6M16.4 16.4 18 18M18 6l-1.6 1.6M7.6 16.4 6 18',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round'
    }));
    return svg;
  }

  function closeIcon() {
    const svg = LK.svg('svg', { viewBox: '0 0 24 24', width: '22', height: '22', 'aria-hidden': 'true' });
    svg.appendChild(LK.svg('path', {
      d: 'M6 6l12 12M18 6 6 18',
      fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', 'stroke-linecap': 'round'
    }));
    return svg;
  }

  function tabIcon(name) {
    const svg = LK.svg('svg', { viewBox: '0 0 24 24', width: '22', height: '22', 'aria-hidden': 'true' });
    const p = { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.7', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    if (name === 'today') {
      svg.appendChild(LK.svg('rect', Object.assign({ x: '4', y: '5', width: '16', height: '15', rx: '3' }, p)));
      svg.appendChild(LK.svg('path', Object.assign({ d: 'M8 3.5V7M16 3.5V7M4 10h16' }, p)));
    } else if (name === 'timeline') {
      svg.appendChild(LK.svg('path', Object.assign({ d: 'M4 12h16M7 12V7m5 5V5m5 7v-4' }, p)));
      svg.appendChild(LK.svg('circle', { cx: '7', cy: '7', r: '1.4', fill: 'currentColor' }));
      svg.appendChild(LK.svg('circle', { cx: '12', cy: '5', r: '1.4', fill: 'currentColor' }));
      svg.appendChild(LK.svg('circle', { cx: '17', cy: '8', r: '1.4', fill: 'currentColor' }));
    } else if (name === 'map') {
      svg.appendChild(LK.svg('path', Object.assign({ d: 'M4 7l5-2 6 2 5-2v12l-5 2-6-2-5 2V7z' }, p)));
      svg.appendChild(LK.svg('path', Object.assign({ d: 'M9 5v12M15 7v12' }, p)));
    } else {
      svg.appendChild(LK.svg('rect', Object.assign({ x: '5', y: '4', width: '14', height: '16', rx: '2' }, p)));
      svg.appendChild(LK.svg('path', Object.assign({ d: 'M8 8h8M8 12h8M8 16h5' }, p)));
    }
    return svg;
  }

  function book() {
    const svg = LK.svg('svg', { viewBox: '0 0 24 24', width: '16', height: '16', class: 'book-ico', 'aria-hidden': 'true' });
    const p = { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.75', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
    svg.appendChild(LK.svg('path', Object.assign({ d: 'M12 6.2C10.4 5.2 8.4 4.6 6 4.6H4v13.2h2.2c2 0 3.8.5 5.8 1.6 2-1.1 3.8-1.6 5.8-1.6H20V4.6h-2c-2.4 0-4.4.6-6 1.6z' }, p)));
    svg.appendChild(LK.svg('path', Object.assign({ d: 'M12 6.2v13.2' }, p)));
    return svg;
  }

  global.LKIcons = { star: star, stars: stars, gear: gear, closeIcon: closeIcon, tabIcon: tabIcon, book: book };
})(window);
