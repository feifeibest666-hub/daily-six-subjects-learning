(function (global) {
  function mount() {
    const state = LKStore.get();
    const screen = LK.h('div', { class: 'screen map-screen' });
    screen.appendChild(LK.h('header', { class: 'topbar' }, [
      LK.h('div', { class: 'top-kicker', text: '地图 · 中国' })
    ]));
    const tabs = LK.h('div', { class: 'layer-tabs' });
    const host = LK.h('div', { class: 'map-host' });
    let layer = 'province';
    ['province', 'terrain', 'river'].forEach(function (key) {
      const unlock = MAP_META.unlock[key];
      const locked = state.currentDay < unlock;
      const btn = LK.h('button', {
        class: 'layer-tab' + (key === layer ? ' is-on' : '') + (locked ? ' is-locked' : ''),
        text: MAP_META.layerName[key] + (locked ? ' · 第 ' + unlock + ' 天解锁' : '')
      });
      btn.disabled = false;
      btn.addEventListener('click', function () {
        if (locked) {
          LKSheet.toast('第 ' + unlock + ' 天解锁「' + MAP_META.layerName[key] + '」。');
          return;
        }
        layer = key;
        tabs.querySelectorAll('.layer-tab').forEach(function (n) {
          n.classList.toggle('is-on', n === btn);
        });
        render();
      });
      tabs.appendChild(btn);
    });
    if (state.currentDay < MAP_META.unlock.province) layer = 'province';
    screen.appendChild(tabs);
    screen.appendChild(host);

    function lit(id) { return LKCatalog.learnedProvince(id); }

    function render() {
      host.innerHTML = '';
      const locked = state.currentDay < MAP_META.unlock[layer];
      if (locked) {
        host.appendChild(LK.h('p', { class: 'empty', text: '这一层第 ' + MAP_META.unlock[layer] + ' 天解锁。' }));
      }
      const map = LKMap.mount({
        layer: locked ? 'province' : layer,
        lit: locked ? function () { return false; } : lit,
        onTap: function (p) {
          const prov = p;
          LKSheet.open(function (body) {
            body.appendChild(LK.h('h2', { class: 'sheet-title', text: prov.name }));
            body.appendChild(LK.h('p', { class: 'sheet-copy', text: '简称 ' + prov.short + ' · 省会 ' + prov.capital }));
            if (MAP_META.cross.indexOf(prov.id) >= 0) {
              body.appendChild(LK.h('p', { class: 'sheet-copy', text: '跨阶梯' }));
            }
            const level = LKCatalog.terrainLevel(prov.id);
            if (layer === 'terrain' && !locked) {
              body.appendChild(LK.h('p', { class: 'sheet-copy', text: '地形上落在第 ' + level + ' 级阶梯。' }));
            }
            const lines = LKCatalog.knowledgeFor(prov.id);
            if (!lines.length) body.appendChild(LK.h('p', { class: 'sheet-copy', text: '还没有相关知识点。' }));
            lines.forEach(function (line) {
              body.appendChild(LK.h('p', { class: 'sheet-copy' }, [
                LK.h('b', { text: SUBJECTS[line.subject].name + ' · 第 ' + line.day + ' 天' }),
                document.createTextNode(' ' + line.text)
              ]));
            });
          });
        }
      });
      if (locked) map.classList.add('is-dim');
      host.appendChild(map);
    }
    render();
    return screen;
  }

  global.LKMapView = { mount: mount };
})(window);
