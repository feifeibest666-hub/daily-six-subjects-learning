(function (global) {
  let aheadHidden = false;

  function mount() {
    const state = LKStore.get();
    const day = state.currentDay;
    const dobj = LKCatalog.dayObj(day);
    const review = dobj && dobj.type === 'review';
    const screen = LK.h('div', { class: 'screen today-screen' });
    const title = review ? (day === 14 ? '周复盘 · 第一期 Boss' : '周复盘 · 小 Boss') : LKCatalog.seasonLabel(day);

    const streakNum = LK.h('span', { class: 'num streak-num', text: String(state.streak.count || 0) });
    const flameBtn = LK.h('button', { class: 'flame-btn', 'aria-label': '连续打卡' }, [LKMascot.flame(), streakNum]);
    flameBtn.addEventListener('click', function () {
      const k = LKCatalog.aheadK(LKStore.get());
      let msg = '连续打卡 ' + (state.streak.count || 0) + ' 天。补签卡还剩 ' + state.streak.freezeLeft + ' 张。';
      if (k >= 1) msg += '今天还多学了 ' + k + ' 天。';
      LKSheet.toast(msg);
    });
    if (LKStore.consumeStreakBump()) LKMotion.flipNum(streakNum, String(state.streak.count || 0));

    const gear = LK.h('button', { class: 'icon-btn', 'aria-label': '设置' }, [LKIcons.gear()]);
    gear.addEventListener('click', function () { location.hash = '#/settings'; });

    const kicker = LK.h('div', { class: 'top-kicker' });
    const pick = LK.h('button', {
      class: 'kicker-pick',
      type: 'button',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      'aria-label': title + '，选择一天'
    }, [
      LK.h('span', { class: 'kicker-day', text: title }),
      LK.h('span', { class: 'kicker-caret', 'aria-hidden': 'true', text: '▾' })
    ]);
    pick.addEventListener('click', function () { openDayPicker(pick); });
    kicker.appendChild(pick);
    if (LKCatalog.learningAhead(state)) kicker.appendChild(LK.h('span', { class: 'ahead-tag', text: '提前学' }));
    screen.appendChild(LK.h('header', { class: 'topbar' }, [
      kicker,
      LK.h('div', { class: 'top-actions' }, [flameBtn, gear])
    ]));

    const bubble = LK.h('p', { class: 'bubble', text: LKCatalog.bubble(state) });
    screen.appendChild(LK.h('section', { class: 'greet' }, [LKMascot.create(64), bubble]));

    const done = LKCatalog.doneCount(day);
    screen.appendChild(ring(done));

    const chestOpen = !!state.dayCompletedDate[String(day)];
    if (done === 6 && !chestOpen) {
      const open = LK.h('button', { class: 'btn btn-gold', text: '打开今日宝箱' });
      open.addEventListener('click', function () { location.hash = '#/chest/' + day; });
      screen.appendChild(LK.h('div', { class: 'chest-cta' }, [open]));
    }
    if (chestOpen && day < 14) {
      const panel = aheadPanel(state);
      if (panel) screen.appendChild(panel);
    }
    if (chestOpen && day === 14) {
      screen.appendChild(LK.h('section', { class: 'finale' }, [
        LK.h('h2', { text: '第一期完结' }),
        LK.h('p', { text: '下一期内容制作中。已经学过的关卡，都可以回看。' })
      ]));
    }

    let bossCard = null;
    if (review && dobj.boss) {
      const bossRec = state.lessons[LK.lessonId(day, 'boss')];
      bossCard = LK.h('button', { class: 'boss-card will-stagger' }, [
        LK.h('span', { class: 'boss-kicker', text: '跨科 Boss' }),
        LK.h('span', { class: 'card-title', text: dobj.boss.title }),
        LK.h('span', { class: 'card-meta' }, [
          LK.h('span', { text: bossRec ? (state.badges.indexOf(day === 14 ? 'week2' : 'week1') >= 0 ? '周徽章到手' : '已挑战') : '开始挑战' }),
          LK.h('span', { class: 'go', text: '→' })
        ])
      ]);
      bossCard.addEventListener('click', function () { location.hash = '#/lesson/' + day + '/boss'; });
    }

    const grid = LK.h('div', { class: 'card-grid' });
    SUBJECT_ORDER.forEach(function (key) {
      const sub = SUBJECTS[key];
      const les = LKCatalog.lesson(day, key);
      const rec = state.lessons[LK.lessonId(day, key)];
      const card = LK.h('button', { class: 'subj-card will-stagger' });
      card.style.background = sub.soft;
      card.appendChild(LK.h('span', { class: 'ord', text: String(sub.order) }));
      card.appendChild(LK.h('span', { class: 'emo', text: sub.icon }));
      card.appendChild(LK.h('span', { class: 'subname', text: sub.name, style: { color: sub.color } }));
      card.appendChild(LK.h('span', { class: 'card-title', text: review ? '回炉' : (les ? les.title : '') }));
      const meta = LK.h('span', { class: 'card-meta' });
      meta.appendChild(LK.h('span', { text: review ? '3 题' : ('约 ' + (les ? les.minutes : sub.minutes) + ' 分钟') }));
      meta.appendChild(rec ? LKIcons.stars(rec.best || rec.stars || 1, 3) : LK.h('span', { class: 'go', text: '→' }));
      card.appendChild(meta);
      card.addEventListener('click', function () {
        LKStore.clearWelcome();
        location.hash = '#/lesson/' + day + '/' + key;
      });
      grid.appendChild(card);
    });
    if (bossCard) screen.appendChild(bossCard);
    screen.appendChild(grid);
    requestAnimationFrame(function () { LKMotion.stagger(screen.querySelectorAll('.will-stagger')); });

    const sw = LK.h('button', {
      class: 'switch' + (state.miniOn ? ' is-on' : ''),
      role: 'switch',
      'aria-checked': state.miniOn ? 'true' : 'false',
      'aria-label': '迷你模式'
    });
    sw.appendChild(LK.h('i'));
    sw.addEventListener('click', function () {
      const on = !LKStore.get().miniOn;
      LKStore.setMini(on);
      sw.classList.toggle('is-on', on);
      sw.setAttribute('aria-checked', on ? 'true' : 'false');
      bubble.textContent = LKCatalog.bubble(LKStore.get());
    });
    screen.appendChild(LK.h('div', { class: 'mini-row' }, [
      LK.h('span', { text: '今天太忙？迷你模式 8 分钟' }),
      sw
    ]));
    return screen;
  }

  function lessonBlurb(day) {
    return SUBJECT_ORDER.map(function (key) {
      const les = LKCatalog.lesson(day, key);
      return les && les.title ? les.title : SUBJECTS[key].name;
    }).join(' · ');
  }

  function dayScore(state, day) {
    let stars = 0;
    let done = 0;
    SUBJECT_ORDER.forEach(function (key) {
      const rec = state.lessons[LK.lessonId(day, key)];
      if (!rec) return;
      done += 1;
      stars += rec.best || rec.stars || 0;
    });
    return { stars: stars, done: done === SUBJECT_ORDER.length };
  }

  function openDayPicker(pick) {
    const state = LKStore.get();
    pick.setAttribute('aria-expanded', 'true');
    LKSheet.open(function (body, close) {
      body.appendChild(LK.h('h2', { class: 'sheet-title', id: 'day-pick-title', text: '选一天' }));
      const list = LK.h('div', { class: 'day-pick-list' });
      let current = null;
      for (let n = 1; n <= 14; n++) {
        const score = dayScore(state, n);
        const on = n === state.currentDay;
        const row = LK.h('button', {
          class: 'day-pick-row' + (on ? ' is-on' : ''),
          type: 'button'
        });
        if (on) row.setAttribute('aria-current', 'true');
        const main = LK.h('span', { class: 'day-pick-main' }, [
          LK.h('b', { class: 'num', text: '第 ' + n + ' 天' })
        ]);
        const mark = LK.h('span', { class: 'day-pick-mark' });
        if (score.done) mark.appendChild(LK.h('span', { class: 'day-pick-check', text: '✓' }));
        if (score.stars) {
          mark.appendChild(LK.h('span', { class: 'num', text: String(score.stars) }));
          mark.appendChild(LKIcons.star(true));
        }
        if (mark.childNodes.length) main.appendChild(mark);
        row.appendChild(main);
        row.appendChild(LK.h('span', { class: 'day-pick-titles', text: lessonBlurb(n) }));
        row.addEventListener('click', function () {
          if (n !== LKStore.get().currentDay) LKStore.jumpDay(n);
          close();
          LKRouter.go();
        });
        list.appendChild(row);
        if (on) current = row;
      }
      body.appendChild(list);
      if (current) requestAnimationFrame(function () { current.scrollIntoView({ block: 'nearest' }); });
    }, {
      tall: true,
      labelledBy: 'day-pick-title',
      returnFocus: pick,
      onClose: function () { pick.setAttribute('aria-expanded', 'false'); }
    });
  }

  function aheadPanel(state) {
    if (aheadHidden) return null;
    const day = state.currentDay;
    const k = LKCatalog.aheadK(state);
    const keys = LKCatalog.practiceKeys();
    const panel = LK.h('section', { class: 'ahead-panel' });
    panel.appendChild(LK.h('h2', { text: '第 ' + day + ' 天完成啦' }));
    panel.appendChild(LK.h('p', {
      class: 'ahead-sub',
      text: k >= 1
        ? ('今天已经多学了 ' + k + ' 天。')
        : ('想多学一点？可以继续第 ' + (day + 1) + ' 天，也可以明天再来。')
    }));
    const go = LK.h('button', { class: 'btn btn-primary', text: '继续学第 ' + (day + 1) + ' 天' });
    go.addEventListener('click', function () { continueAhead(k); });
    panel.appendChild(go);
    if (keys.length) {
      const practice = LK.h('button', { class: 'btn btn-secondary', text: '先练错题本（' + keys.length + ' 道）' });
      practice.addEventListener('click', function () { location.hash = '#/mistakes?due=1'; });
      panel.appendChild(practice);
    }
    const later = LK.h('button', { class: 'btn btn-ghost', text: '明天再来' });
    later.addEventListener('click', function () {
      aheadHidden = true;
      panel.remove();
    });
    panel.appendChild(later);
    requestAnimationFrame(function () { LKMotion.aheadIn(panel); });
    return panel;
  }

  function continueAhead(k) {
    const today = LK.todayStr();
    function go() {
      const circles = Array.prototype.slice.call(document.querySelectorAll('.today-screen .ring circle')).reverse();
      const label = document.querySelector('.today-screen .kicker-day');
      const nextDay = LKStore.get().currentDay + 1;
      if (label && !LKMotion.reduce()) {
        LKMotion.flipNum(label, label.textContent.replace(/第\s*\d+\s*天/, '第 ' + nextDay + ' 天'));
      }
      circles.forEach(function (c, i) {
        if (LKMotion.reduce()) {
          c.setAttribute('stroke', '#F4EEE6');
          return;
        }
        c.animate(
          [{ stroke: c.getAttribute('stroke') }, { stroke: '#F4EEE6' }],
          { duration: 80, delay: i * 40, fill: 'forwards' }
        );
      });
      setTimeout(function () {
        LKStore.learnAhead();
        LKRouter.go();
      }, LKMotion.reduce() ? 0 : 520);
    }
    const noted = LKStore.get().settings.aheadNoteDate;
    if (k >= 2 && noted !== today) {
      LKStore.setSetting('aheadNoteDate', today);
      LKSheet.confirm({
        title: '今天已经多学了 2 天',
        body: '新知识睡一觉更容易记牢。想继续也完全可以，或者先练一练错题本？',
        ok: '还是继续',
        cancel: '先歇一歇'
      }).then(function (yes) { if (yes) go(); });
      return;
    }
    go();
  }

  function ring(done) {
    const size = 120;
    const stroke = 12;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const gap = c * 0.018;
    const seg = c / 6 - gap;
    const svg = LK.svg('svg', { class: 'ring', viewBox: '0 0 120 120', width: '120', height: '120' });
    SUBJECT_ORDER.forEach(function (key, i) {
      const circle = LK.svg('circle', {
        cx: '60', cy: '60', r: String(r),
        fill: 'none',
        'stroke-width': String(stroke),
        'stroke-linecap': 'butt',
        'stroke-dasharray': seg + ' ' + (c - seg),
        'stroke-dashoffset': String(-i * (c / 6) + c / 4),
        stroke: i < done ? SUBJECTS[key].color : '#F4EEE6'
      });
      svg.appendChild(circle);
    });
    const wrap = LK.h('div', { class: 'ring-wrap' }, [
      svg,
      LK.h('div', { class: 'ring-label num' }, [
        LK.h('b', { text: String(done) }),
        LK.h('span', { text: ' / 6' })
      ])
    ]);
    return wrap;
  }

  global.LKToday = { mount: mount };
})(window);
