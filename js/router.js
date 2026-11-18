(function (global) {
  const TOPS = { today: true, timeline: true, map: true, cards: true };

  function parse(hash) {
    const raw = (hash || '#/today').replace(/^#/, '');
    const qat = raw.indexOf('?');
    const path = qat >= 0 ? raw.slice(0, qat) : raw;
    const query = {};
    if (qat >= 0) {
      raw.slice(qat + 1).split('&').forEach(function (pair) {
        if (!pair) return;
        const bits = pair.split('=');
        query[decodeURIComponent(bits[0])] = decodeURIComponent(bits[1] || '');
      });
    }
    const parts = path.split('/').filter(Boolean);
    const name = parts[0] || 'today';
    return { name: name, day: parts[1] ? +parts[1] : null, subject: parts[2] || null, query: query };
  }

  function render(route) {
    if (route.name === 'today') return LKToday.mount();
    if (route.name === 'lesson') return LKLesson.mount(route.day, route.subject);
    if (route.name === 'result') return LKResult.mount(route.day, route.subject);
    if (route.name === 'chest') return LKChest.mount(route.day);
    if (route.name === 'timeline') return LKTimeline.mount();
    if (route.name === 'map') return LKMapView.mount();
    if (route.name === 'cards') return LKCards.mount();
    if (route.name === 'mistakes') return LKMistakes.mount(route.query || {});
    if (route.name === 'settings') return LKSettings.mount();
    if (route.name === 'review') return LKReview.mount(route.day, route.subject);
    return LKToday.mount();
  }

  let busy = false;
  let queued = false;
  async function go() {
    if (busy) { queued = true; return; }
    busy = true;
    const route = parse(location.hash);
    const stage = document.getElementById('stage');
    const tabs = document.getElementById('tabbar');
    let next;
    try {
      next = render(route);
    } catch (err) {
      console.error(err);
      next = LK.h('div', { class: 'screen' }, [
        LK.h('p', { class: 'empty', text: '这一页没能打开。' }),
        LK.h('button', { class: 'btn btn-primary', text: '回首页', onClick: function () { location.hash = '#/today'; } })
      ]);
    }
    const prev = stage.querySelector(':scope > .screen');
    if (prev) {
      try { await LKMotion.leave(prev); } catch (e) {}
      prev.remove();
    }
    stage.appendChild(next);
    const top = !!TOPS[route.name];
    tabs.classList.toggle('is-hidden', !top);
    next.classList.toggle('has-tab', top);
    tabs.querySelectorAll('a.tab').forEach(function (a) {
      a.classList.toggle('is-on', a.dataset.tab === route.name);
    });
    try { await LKMotion.enter(next); } catch (e) {}
    stage.scrollTop = 0;
    busy = false;
    if (queued) { queued = false; go(); }
  }

  function start() {
    window.addEventListener('hashchange', function () { go(); });
    if (!location.hash || location.hash === '#') location.hash = '#/today';
    else go();
  }

  global.LKRouter = { start: start, go: go };
})(window);
