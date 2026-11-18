(function (global) {
  function mount() {
    const screen = LK.h('div', { class: 'screen cards-screen' });
    let filter = 'fashion';
    const head = LK.h('header', { class: 'topbar' });
    head.appendChild(LK.h('div', { class: 'top-kicker', text: '图鉴' }));
    const n = Object.keys(LKStore.get().mistakes).length;
    const link = LK.h('button', { class: 'text-btn', text: '错题本 (' + n + ')' });
    link.addEventListener('click', function () { location.hash = '#/mistakes'; });
    head.appendChild(link);
    screen.appendChild(head);
    const pills = LK.h('div', { class: 'pills' });
    const grid = LK.h('div', { class: 'gcard-grid' });
    SUBJECT_ORDER.forEach(function (key) {
      const b = LK.h('button', { class: 'pill' + (key === filter ? ' is-on' : ''), text: SUBJECTS[key].name });
      b.style.setProperty('--pill', SUBJECTS[key].color);
      b.addEventListener('click', function () {
        filter = key;
        pills.querySelectorAll('.pill').forEach(function (p) { p.classList.toggle('is-on', p === b); });
        render();
      });
      pills.appendChild(b);
    });
    screen.appendChild(pills);
    screen.appendChild(grid);

    function render() {
      const st = LKStore.get();
      grid.innerHTML = '';
      for (let day = 1; day <= 14; day++) {
        const les = LKCatalog.lesson(day, filter);
        if (!les) continue;
        const got = !!st.lessons[les.id];
        const card = LK.h('button', { class: 'gcard' + (got ? '' : ' is-locked') });
        card.appendChild(LK.h('i', { class: 'gcard-edge', style: { background: got ? SUBJECTS[filter].color : '#E4DCD2' } }));
        card.appendChild(LK.h('b', { text: got ? (les.review ? '本周回炉' : les.title) : '？' }));
        card.appendChild(LK.h('small', { text: '第 ' + day + ' 天' }));
        card.addEventListener('click', function () { openCard(day, filter, les, got); });
        grid.appendChild(card);
      }
    }

    function openCard(day, subject, les, got) {
      const future = day > LKStore.get().currentDay;
      LKSheet.open(function (body) {
        body.appendChild(LK.h('h2', { class: 'sheet-title', text: got ? (les.review ? '本周回炉' : les.title) : '还没收集到' }));
        body.appendChild(LK.h('p', { class: 'sheet-copy', text: SUBJECTS[subject].name + ' · 第 ' + day + ' 天' }));
        if (future) {
          body.appendChild(LK.h('p', { class: 'sheet-copy', text: '第 ' + day + ' 天还没解锁。' }));
          return;
        }
        if (!got) {
          body.appendChild(LK.h('p', { class: 'sheet-copy', text: '去第 ' + day + ' 天的' + SUBJECTS[subject].name + '看看。' }));
          const go = LK.h('button', { class: 'btn btn-primary', text: '去学习' });
          go.addEventListener('click', function () { location.hash = '#/lesson/' + day + '/' + subject; });
          body.appendChild(go);
          return;
        }
        if (les.take) body.appendChild(LK.h('p', { class: 'sheet-copy', text: les.take }));
        if (les.review && les.takes) {
          const ul = LK.h('ul', { class: 'take-list' });
          les.takes.forEach(function (t) { ul.appendChild(LK.h('li', { text: t })); });
          body.appendChild(ul);
        }
        if (les.steps) {
          const ol = LK.h('ol', { class: 'step-sum' });
          les.steps.forEach(function (s) { ol.appendChild(LK.h('li', { text: LK.stepSummary(s) })); });
          body.appendChild(ol);
        }
        const redo = LK.h('button', { class: 'btn btn-primary', text: '重做这一关' });
        redo.addEventListener('click', function () { location.hash = '#/lesson/' + day + '/' + subject; });
        body.appendChild(redo);
      });
    }

    render();
    return screen;
  }

  global.LKCards = { mount: mount };
})(window);
