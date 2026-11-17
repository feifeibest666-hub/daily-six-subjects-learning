(function (global) {
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
      LKSheet.toast('连续打卡 ' + (state.streak.count || 0) + ' 天。补签卡还剩 ' + state.streak.freezeLeft + ' 张。');
    });
    if (LKStore.consumeStreakBump()) LKMotion.flipNum(streakNum, String(state.streak.count || 0));

    const gear = LK.h('button', { class: 'icon-btn', 'aria-label': '设置' }, [LKIcons.gear()]);
    gear.addEventListener('click', function () { location.hash = '#/settings'; });

    screen.appendChild(LK.h('header', { class: 'topbar' }, [
      LK.h('div', { class: 'top-kicker', text: title }),
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
      screen.appendChild(LK.h('p', { class: 'banner', text: '今日已完成，明天解锁第 ' + (day + 1) + ' 天' }));
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
