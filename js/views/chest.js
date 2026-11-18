(function (global) {
  function mount(day) {
    if (!LKCatalog.sixDone(day)) {
      location.hash = '#/today';
      return LK.h('div', { class: 'screen' });
    }
    const state = LKStore.get();
    const opened = !!state.dayCompletedDate[String(day)];
    const screen = LK.h('div', { class: 'screen chest-screen' });
    const stage = LK.h('div', { class: 'chest-stage' });
    const chest = LK.h('button', { class: 'chest', 'aria-label': '打开宝箱' });
    const lid = LK.h('span', { class: 'chest-lid' });
    const body = LK.h('span', { class: 'chest-body' }, [LK.h('i', { class: 'chest-lock' })]);
    chest.appendChild(lid);
    chest.appendChild(body);
    stage.appendChild(chest);
    const hint = LK.h('p', { class: 'chest-hint', text: opened ? '今日战报' : '点一下，打开今日宝箱' });
    screen.appendChild(hint);
    screen.appendChild(stage);
    const reportHost = LK.h('div', { class: 'report-host' });
    screen.appendChild(reportHost);

    function reportCard() {
      const st = LKStore.get();
      const card = LK.h('article', { class: 'report' });
      card.appendChild(LK.h('h2', { text: '今日战报' }));
      const ul = LK.h('ul', { class: 'report-takes' });
      let correct = 0;
      let total = 0;
      let ms = 0;
      let pins = 0;
      let places = 0;
      SUBJECT_ORDER.forEach(function (key) {
        const les = LKCatalog.lesson(day, key);
        const rec = st.lessons[LK.lessonId(day, key)];
        if (rec) {
          correct += rec.correct || 0;
          total += rec.total || 0;
          ms += rec.ms || 0;
        }
        if (les && les.pins) pins += les.pins.length;
        if (les && les.places) places += les.places.length;
        ul.appendChild(LK.h('li', {}, [
          LK.h('i', { class: 'dot', style: { background: SUBJECTS[key].color } }),
          LK.h('span', { text: les && les.take ? les.take : '' })
        ]));
      });
      card.appendChild(ul);
      const rate = total ? Math.round(correct / total * 100) : 0;
      card.appendChild(LK.h('p', { class: 'report-line' }, [document.createTextNode('总正确率 '), LK.h('b', { class: 'num', text: rate + '%' })]));
      card.appendChild(LK.h('p', { class: 'report-line' }, [document.createTextNode('总用时 '), LK.h('b', { class: 'num', text: LK.formatDuration(ms) })]));
      card.appendChild(LK.h('p', { class: 'report-line' }, [document.createTextNode('新钉上时间轴 '), LK.h('b', { class: 'num', text: pins + ' 处' })]));
      card.appendChild(LK.h('p', { class: 'report-line' }, [document.createTextNode('新点亮地图 '), LK.h('b', { class: 'num', text: places + ' 处' })]));
      card.appendChild(LK.h('p', { class: 'report-line' }, [document.createTextNode('连续打卡 '), LK.h('b', { class: 'num', text: (st.streak.count || 0) + ' 天' })]));
      if (st.badges.length) {
        card.appendChild(LK.h('p', { class: 'report-line', text: '徽章：' + st.badges.map(labelBadge).join('、') }));
      }
      const btn = LK.h('button', { class: 'btn btn-primary', text: day < 14 ? '回首页' : '明天见' });
      btn.addEventListener('click', function () { location.hash = '#/today'; });
      card.appendChild(btn);
      return card;
    }

    function labelBadge(id) {
      if (id === 'week1') return '第 1 周';
      if (id === 'week2') return '第 2 周';
      if (id === 'season1') return '第一期通关';
      return id;
    }

    function reveal(animate) {
      const card = reportCard();
      reportHost.appendChild(card);
      chest.disabled = true;
      hint.textContent = '今日战报';
      if (!animate || LKMotion.reduce()) {
        lid.style.transform = 'perspective(600px) rotateX(70deg) translateY(-6px)';
        card.style.opacity = '1';
        return;
      }
      card.style.opacity = '0';
      card.style.transformOrigin = 'center top';
      LKMotion.playChest(chest, lid, function () {
        card.style.opacity = '1';
        card.animate(
          [
            { transform: 'translateY(-72px) scale(.35)', opacity: 0, transformOrigin: 'center top' },
            { transform: 'translateY(8px) scale(1.04)', opacity: 1, offset: .72, transformOrigin: 'center top' },
            { transform: 'translateY(0) scale(1)', opacity: 1, transformOrigin: 'center top' }
          ],
          { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }
        );
      });
    }

    if (opened) reveal(false);
    else {
      chest.addEventListener('click', function () {
        LKStore.openChest(day);
        reveal(true);
      });
    }
    return screen;
  }

  global.LKChest = { mount: mount };
})(window);
