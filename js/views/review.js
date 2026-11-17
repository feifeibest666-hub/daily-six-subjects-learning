(function (global) {
  function mount(day, subject) {
    const les = LKCatalog.lesson(day, subject);
    if (!les || subject === 'boss') {
      location.hash = '#/today';
      return LK.h('div', { class: 'screen' });
    }
    const sub = SUBJECTS[subject];
    const screen = LK.h('div', { class: 'screen review-screen' });
    screen.style.setProperty('--accent', sub.color);
    const back = LK.h('button', { class: 'icon-btn', 'aria-label': '返回' }, [LKIcons.closeIcon()]);
    back.addEventListener('click', function () {
      if (history.length > 1) history.back();
      else location.hash = '#/today';
    });
    screen.appendChild(LK.h('header', { class: 'lesson-top' }, [
      back,
      LK.h('div', { class: 'top-kicker', text: sub.name + ' · 回看' })
    ]));
    const card = LK.h('article', { class: 'stage-card' });
    card.appendChild(LK.h('h2', { class: 'card-h', text: les.review ? '本周回炉' : les.title }));
    if (les.take) card.appendChild(LK.h('p', { class: 'take-text', text: les.take }));
    if (les.takes) {
      const ul = LK.h('ul', { class: 'take-list' });
      les.takes.forEach(function (t) { ul.appendChild(LK.h('li', { text: t })); });
      card.appendChild(ul);
    }
    if (les.steps) {
      const list = LK.h('div', { class: 'step-list' });
      les.steps.forEach(function (s, i) {
        const node = LK.h('div', { class: 'step is-open' });
        const bar = LK.h('i', { class: 'step-bar' });
        bar.style.transform = 'scaleY(1)';
        node.appendChild(bar);
        node.appendChild(LK.h('span', { class: 'step-no', text: String(i + 1) }));
        const box = LK.h('span', { class: 'step-body' });
        box.appendChild(LK.h('span', { class: 'step-text', text: s.text }));
        if (s.formula) box.appendChild(LK.h('span', { class: 'formula num', text: s.formula }));
        if (s.visual) {
          const viz = LKVisuals.render(s.visual);
          if (viz) box.appendChild(viz);
        }
        node.appendChild(box);
        list.appendChild(node);
      });
      card.appendChild(list);
    }
    const redo = LK.h('button', { class: 'btn btn-primary', text: '重做这一关' });
    redo.addEventListener('click', function () {
      const draft = LKStore.get().draft;
      if (draft && draft.id === les.id) LKStore.clearDraft();
      location.hash = '#/lesson/' + day + '/' + subject;
    });
    card.appendChild(redo);
    screen.appendChild(card);
    return screen;
  }

  global.LKReview = { mount: mount };
})(window);
