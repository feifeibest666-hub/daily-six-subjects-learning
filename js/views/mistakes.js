(function (global) {
  function mount(query) {
    query = query || {};
    const dueOnly = query.due === '1';
    const screen = LK.h('div', { class: 'screen mistakes-screen' });
    const back = LK.h('button', { class: 'icon-btn', 'aria-label': '返回' }, [LKIcons.closeIcon()]);
    back.addEventListener('click', function () { location.hash = dueOnly ? '#/today' : '#/cards'; });
    screen.appendChild(LK.h('header', { class: 'lesson-top' }, [
      back,
      LK.h('div', { class: 'top-kicker', text: dueOnly ? '先练错题' : '错题本' })
    ]));
    const state = LKStore.get();
    const keys = dueOnly ? LKCatalog.practiceKeys() : Object.keys(state.mistakes);
    if (!keys.length) {
      screen.appendChild(LK.h('p', { class: 'empty', text: '现在没有待回炉的题。已掌握 ' + state.mastered.length + ' 题。' }));
      return screen;
    }
    const groups = {};
    keys.forEach(function (key) {
      const subject = key.split('-')[1].split('#')[0];
      if (!groups[subject]) groups[subject] = [];
      groups[subject].push(key);
    });
    SUBJECT_ORDER.forEach(function (subject) {
      const list = groups[subject];
      if (!list) return;
      screen.appendChild(LK.h('h2', { class: 'group-title', style: { color: SUBJECTS[subject].color }, text: SUBJECTS[subject].name }));
      list.forEach(function (key) {
        const q = LKCatalog.findQuestion(key);
        const info = state.mistakes[key];
        if (!q) return;
        const wrongText = q.options[info.wrongPick] || '—';
        const rightText = q.options[q.answer];
        const due = info.due <= state.currentDay ? '今天这一关会遇到' : ('第 ' + info.due + ' 个学习日');
        const card = LK.h('article', { class: 'mistake' });
        card.appendChild(LK.h('p', { class: 'q-text', text: q.q }));
        card.appendChild(LK.h('p', { class: 'sheet-copy', text: '你当时选了：' + wrongText }));
        card.appendChild(LK.h('p', { class: 'sheet-copy', text: '参考答案：' + rightText }));
        card.appendChild(LK.h('p', { class: 'sheet-copy', text: '下次出现：' + due }));
        const practice = LK.h('div', { class: 'practice' });
        const btn = LK.h('button', { class: 'btn btn-secondary', text: '现在练一下' });
        btn.addEventListener('click', function () {
          practice.innerHTML = '';
          const presented = LKCatalog.present(q, LKStore.get().seed + '|practice|' + Date.now());
          practice.appendChild(LK.h('p', { class: 'q-text', text: presented.q }));
          presented.options.forEach(function (text, di) {
            const opt = LK.h('button', { class: 'opt', text: text });
            opt.addEventListener('click', function () {
              const ok = di === presented.answer;
              LKStore.grade(q.key, ok, presented.indexMap[di]);
              opt.classList.add(ok ? 'is-ok' : 'is-bad');
              if (!ok) LKMotion.shake(opt);
              else LKMotion.bounce(opt);
              practice.querySelectorAll('.opt').forEach(function (b) { b.disabled = true; });
              practice.appendChild(LK.h('p', { class: 'explain-why', text: (ok ? '对了。' : '差一点。') + q.why }));
              const more = dueOnly ? LKCatalog.practiceKeys().length : Object.keys(LKStore.get().mistakes).length;
              const next = LK.h('button', {
                class: 'btn btn-primary',
                text: more ? '下一题' : (dueOnly ? '回首页' : '回到列表')
              });
              next.addEventListener('click', function () {
                if (dueOnly) {
                  if (!LKCatalog.practiceKeys().length) location.hash = '#/today';
                  else LKRouter.go();
                  return;
                }
                location.hash = '#/mistakes';
                global.LKRouter.go && LKRouter.go();
              });
              practice.appendChild(next);
            });
            practice.appendChild(opt);
          });
        });
        card.appendChild(btn);
        card.appendChild(practice);
        screen.appendChild(card);
      });
    });
    screen.appendChild(LK.h('p', { class: 'map-note', text: '已掌握 ' + state.mastered.length + ' 题' }));
    return screen;
  }

  global.LKMistakes = { mount: mount };
})(window);
