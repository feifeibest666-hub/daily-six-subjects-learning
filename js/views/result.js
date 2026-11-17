(function (global) {
  function mount(day, subject) {
    let saved = null;
    try { saved = JSON.parse(sessionStorage.getItem('liuke.result') || 'null'); } catch (e) {}
    const id = LK.lessonId(day, subject);
    const rec = LKStore.get().lessons[id];
    if (!rec && !(saved && saved.day === day && saved.subject === subject)) {
      location.hash = '#/today';
      return LK.h('div', { class: 'screen' });
    }
    const stars = saved && saved.day === day && saved.subject === subject ? saved.stars : (rec.stars || 1);
    const correct = saved && saved.correct != null ? saved.correct : (rec.correct || 0);
    const total = saved && saved.total != null ? saved.total : (rec.total || 0);
    const ms = saved && saved.ms != null ? saved.ms : (rec.ms || 0);
    const mini = saved ? saved.mini : rec.mini;
    const first = saved ? saved.first : false;
    const boss = subject === 'boss';
    const sub = boss ? { name: 'Boss', color: '#C4842A', soft: '#FCF1DC' } : SUBJECTS[subject];
    const screen = LK.h('div', { class: 'screen result-screen' });
    screen.style.setProperty('--accent', sub.color);
    screen.appendChild(LKMascot.create(88));
    const row = LK.h('div', { class: 'result-stars' });
    for (let i = 0; i < 3; i++) {
      const holder = LK.h('span', { class: 'result-star' + (i < stars ? ' is-on' : '') });
      holder.appendChild(LKIcons.star(i < stars));
      if (i >= stars) holder.style.opacity = '1';
      row.appendChild(holder);
    }
    screen.appendChild(row);
    requestAnimationFrame(function () {
      const nodes = row.querySelectorAll('.result-star.is-on .star-ico');
      nodes.forEach(function (n, i) {
        n.style.opacity = '0';
        if (LKMotion.reduce()) {
          n.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, delay: 0, fill: 'forwards' });
          return;
        }
        n.animate(
          [
            { transform: 'scale(0) rotate(-30deg)', opacity: 0 },
            { transform: 'scale(1.25) rotate(0deg)', opacity: 1, offset: .7 },
            { transform: 'scale(1) rotate(0deg)', opacity: 1 }
          ],
          { duration: 420, delay: i * 180, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }
        );
      });
    });
    if (mini) screen.appendChild(LK.h('span', { class: 'mini-badge', text: '迷你' }));
    let retry = null;
    if (boss) {
      const perfect = !!(saved && saved.perfect);
      if (perfect) {
        const badge = LK.h('p', { class: 'badge-line', text: day === 14 ? '第 2 周徽章 · 第一期通关' : '第 1 周徽章' });
        screen.appendChild(badge);
        requestAnimationFrame(function () { LKMotion.pop(badge); });
      } else {
        const n = Math.max(0, total - correct);
        screen.appendChild(LK.h('p', { class: 'badge-miss', text: '差 ' + n + ' 题拿徽章' }));
        retry = LK.h('button', { class: 'btn btn-primary', text: '再挑战一次' });
        retry.addEventListener('click', function () {
          location.hash = '#/lesson/' + day + '/boss';
        });
      }
    }
    const stats = LK.h('ul', { class: 'stat-list' });
    stats.appendChild(LK.h('li', {}, [LK.h('span', { text: '答对' }), LK.h('b', { class: 'num', text: correct + ' / ' + total })]));
    stats.appendChild(LK.h('li', {}, [LK.h('span', { text: '用时' }), LK.h('b', { class: 'num', text: LK.formatDuration(ms) })]));
    if (!boss) {
      stats.appendChild(LK.h('li', {}, [
        LK.h('span', { text: first ? '新收集' : '图鉴' }),
        LK.h('b', { text: first ? '图鉴卡 1 张' : '图鉴卡已在册' })
      ]));
    }
    screen.appendChild(stats);
    if (retry) screen.appendChild(retry);
    const six = LKCatalog.sixDone(day);
    const next = LKCatalog.nextOpen(day, subject);
    if (six) {
      const b = LK.h('button', { class: 'btn btn-gold', text: '打开今日宝箱' });
      b.addEventListener('click', function () { location.hash = '#/chest/' + day; });
      screen.appendChild(b);
    } else if (next) {
      const b = LK.h('button', { class: 'btn btn-primary', text: '下一关：' + SUBJECTS[next].name });
      b.addEventListener('click', function () { location.hash = '#/lesson/' + day + '/' + next; });
      screen.appendChild(b);
    }
    const home = LK.h('button', { class: 'btn btn-secondary', text: '回首页' });
    home.addEventListener('click', function () { location.hash = '#/today'; });
    screen.appendChild(home);
    return screen;
  }

  global.LKResult = { mount: mount };
})(window);
