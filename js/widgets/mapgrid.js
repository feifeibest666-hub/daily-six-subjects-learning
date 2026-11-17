(function (global) {
  function cellX(c) { return c * 10 + 5; }
  function cellY(r) { return r * 10 + 5; }

  function overlay() {
    const svg = LK.svg('svg', { class: 'map-overlay', viewBox: '0 0 100 80' });
    const bounds = LK.svg('g', { class: 'map-bounds' });
    function seg(x, y, x2, y2) {
      bounds.appendChild(LK.svg('line', {
        x1: x, y1: y, x2: x2, y2: y2,
        stroke: '#C8664A', 'stroke-width': '0.7', 'stroke-dasharray': '1.2 0.9', 'stroke-linecap': 'round'
      }));
    }
    seg(20, 30, 20, 40);
    seg(30, 30, 30, 40);
    seg(60, 10, 60, 30);
    seg(50, 40, 50, 60);
    const rivers = LK.svg('g', { class: 'map-rivers' });
    rivers.appendChild(LK.svg('path', {
      class: 'river-yellow',
      d: 'M25 35 C29 30 32 26 35 25 C40 24 43 25 45 25 C49 27 49 31 53 33 C57 34 61 35 66 35',
      fill: 'none', stroke: '#D4A017', 'stroke-width': '1.15', 'stroke-linecap': 'round'
    }));
    rivers.appendChild(LK.svg('path', {
      class: 'river-yangtze',
      d: 'M25 36 C28 41 32 44 35 45 C40 45 42 45 45 45 C50 45 52 45 55 45 C55 48 55 49 56 50 C60 50 63 50 65 49 C66 47 68 45 75 45 C80 45 82 48 86 54',
      fill: 'none', stroke: '#3D86D9', 'stroke-width': '1.15', 'stroke-linecap': 'round'
    }));
    svg.appendChild(bounds);
    svg.appendChild(rivers);
    return svg;
  }

  function mount(opts) {
    opts = opts || {};
    const layer = opts.layer || 'province';
    const root = LK.h('div', { class: 'map-block layer-' + layer });
    const grid = LK.h('div', { class: 'map-grid', role: 'group', 'aria-label': '中国省级区示意图' });
    const byId = {};
    PROVINCES.forEach(function (p) {
      const tile = LK.h('button', {
        class: 'tile' + (p.short.indexOf('/') < 0 && p.short.length > 1 ? ' tile-long' : ''),
        'data-id': p.id,
        'aria-label': p.name,
        style: { gridRow: String(p.r + 1), gridColumn: String(p.c + 1) }
      });
      const veil = LK.h('span', { class: 'tile-veil' });
      const face = p.short.indexOf('/') >= 0 ? p.short.split('/')[0] : p.short;
      const tx = LK.h('span', { class: 'tile-tx', text: face });
      tile.appendChild(veil);
      tile.appendChild(tx);
      if (layer === 'terrain') {
        tile.style.background = MAP_META.terrainColor[LKCatalog.terrainLevel(p.id)];
      }
      const lit = opts.lit && opts.lit(p.id);
      if (lit) {
        veil.style.opacity = '1';
        tile.classList.add('is-lit');
      }
      tile.addEventListener('click', function () {
        if (opts.onTap) opts.onTap(p, tile);
      });
      grid.appendChild(tile);
      byId[p.id] = tile;
    });
    const svg = overlay();
    svg.querySelector('.map-bounds').style.display = layer === 'terrain' ? '' : 'none';
    svg.querySelector('.map-rivers').style.display = layer === 'river' ? '' : 'none';
    const frame = LK.h('div', { class: 'map-frame' }, [grid, svg]);
    root.appendChild(frame);
    root.appendChild(LK.h('p', { class: 'map-note', text: '示意图，非实际边界' }));
    root._tiles = byId;
    return root;
  }

  function neighbors(id) {
    const p = LKCatalog.provinceById(id);
    if (!p) return [];
    return PROVINCES.filter(function (o) {
      return Math.abs(o.r - p.r) + Math.abs(o.c - p.c) === 1;
    });
  }

  global.LKMap = { mount: mount, neighbors: neighbors };
})(window);
