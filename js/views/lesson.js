(function (global) {
  function blocked(text) {
    const screen = LK.h('div', { class: 'screen' });
    screen.appendChild(LK.h('p', { class: 'empty', text: text }));
    screen.appendChild(LK.h('button', {
      class: 'btn btn-primary',
      text: '回首页',
      onClick: function () { location.hash = '#/today'; }
    }));
    return screen;
  }

  function mount(day, subject) {
    const les = LKCatalog.lesson(day, subject);
    if (!les) return blocked('没有这一关。');
    const state = LKStore.get();
    if (day > state.currentDay && !state.settings.debug) return blocked('这一天还没解锁。');
    const sub = subject === 'boss'
      ? { name: '跨科 Boss', color: '#C4842A', soft: '#FCF1DC' }
      : SUBJECTS[subject];

    const draft = state.draft && state.draft.id === les.id ? state.draft : null;
    const useMini = draft ? !!draft.mini : (!!state.miniOn && !les.boss);

    let quiz;
    if (draft && draft.quizKeys && draft.quizKeys.length) {
      quiz = draft.quizKeys.map(function (key) {
        const q = LKCatalog.findQuestion(key);
        return q ? LKCatalog.present(Object.assign({ review: key.indexOf(les.id) !== 0 }, q), state.seed) : null;
      }).filter(Boolean);
    } else {
      quiz = LKCatalog.buildQuiz(les, useMini);
    }
    if (!quiz.length) quiz = [{ key: les.id + '#x', q: '今天先回忆一句带走的话。', options: ['先记住带走的那一句', '跳过不看', '以后再说'], answer: 0, why: '回炉是为了把本周的话再站稳一次。', indexMap: [0, 1, 2] }];

    let phase = draft ? draft.phase : (les.boss ? 'intro' : (les.review ? 'recall' : 'hook'));
    let step = draft ? draft.step || 0 : 0;
    let qi = draft ? draft.qi || 0 : 0;
    let wrongs = draft ? draft.wrongs || 0 : 0;
    let correct = draft ? draft.correct || 0 : 0;
    let litStars = Math.min(3, correct);
    const elapsedBase = draft ? draft.elapsed || 0 : 0;
    const started = Date.now();
    if (qi >= quiz.length && phase === 'quiz') phase = les.boss ? 'intro' : 'take';

    const screen = LK.h('div', { class: 'screen lesson-screen' });
    screen.style.setProperty('--accent', sub.color);
    screen.style.setProperty('--soft', sub.soft);

    const segHost = LK.h('div', { class: 'seg-host' });
    const starHost = LK.h('div', { class: 'star-slot' });
    const mascotWrap = LK.h('div', { class: 'lesson-mascot' }, [LKMascot.create(40)]);
    const closeBtn = LK.h('button', { class: 'icon-btn', 'aria-label': '关闭' }, [LKIcons.closeIcon()]);
    const header = LK.h('header', { class: 'lesson-top' }, [closeBtn, segHost, starHost, mascotWrap]);
    const phaseBody = LK.h('div', { class: 'phase-body' });
    const footBtn = LK.h('button', { class: 'btn btn-primary', text: '继续' });
    const foot = LK.h('footer', { class: 'lesson-foot' }, [footBtn]);
    screen.appendChild(header);
    screen.appendChild(phaseBody);
    screen.appendChild(foot);

    function shownStars() {
      return litStars;
    }

    function segmentCount() {
      if (les.boss) return 1 + quiz.length;
      if (les.review) return 1 + quiz.length + 1;
      if (useMini) return 2 + quiz.length + 1;
      return 1 + (les.steps ? les.steps.length : 0) + (les.interaction ? 1 : 0) + quiz.length + 1;
    }

    function segmentIndex() {
      if (les.boss) return phase === 'intro' ? 0 : Math.min(segmentCount() - 1, 1 + qi);
      if (les.review) {
        if (phase === 'recall') return 0;
        if (phase === 'quiz') return 1 + qi;
        return segmentCount() - 1;
      }
      if (phase === 'hook') return 0;
      if (phase === 'steps') return 1 + step;
      let base = 1 + (useMini ? 1 : (les.steps || []).length);
      if (!useMini && les.interaction) {
        if (phase === 'interact') return base;
        base += 1;
      }
      if (phase === 'quiz') return base + qi;
      return segmentCount() - 1;
    }

    function paintChrome() {
      segHost.innerHTML = '';
      const total = segmentCount();
      const cur = segmentIndex();
      const row = LK.h('div', { class: 'segs', 'aria-hidden': 'true' });
      for (let i = 0; i < total; i++) {
        const seg = LK.h('span', { class: 'seg' + (i < cur ? ' is-done' : '') + (i === cur ? ' is-now' : '') });
        const fill = LK.h('i', { class: 'seg-fill' });
        if (i < cur) fill.style.transform = 'scaleX(1)';
        seg.appendChild(fill);
        row.appendChild(seg);
      }
      segHost.appendChild(row);
      starHost.innerHTML = '';
      starHost.appendChild(LKIcons.stars(shownStars(), 3));
    }

    function setAction(opts) {
      if (!opts || opts.hidden) {
        footBtn.hidden = true;
        return;
      }
      footBtn.hidden = false;
      footBtn.textContent = opts.label || '继续';
      footBtn.disabled = !!opts.disabled;
      footBtn.onclick = function () {
        if (footBtn.disabled) return;
        if (opts.onClick) opts.onClick();
      };
    }

    function saveDraft() {
      LKStore.setDraft({
        id: les.id,
        phase: phase,
        step: step,
        qi: qi,
        wrongs: wrongs,
        correct: correct,
        mini: useMini,
        elapsed: Date.now() - started + elapsedBase,
        quizKeys: quiz.map(function (q) { return q.key; })
      });
    }

    function finishLesson() {
      const ms = Date.now() - started + elapsedBase;
      const stars = LKCatalog.starsFor(wrongs);
      const badges = [];
      if (les.boss && wrongs === 0) {
        if (day === 7) badges.push('week1');
        if (day === 14) { badges.push('week2'); badges.push('season1'); }
      }
      const info = LKStore.completeLesson({
        id: les.id,
        day: day,
        stars: stars,
        ms: ms,
        mini: useMini,
        correct: correct,
        total: quiz.length,
        isBoss: !!les.boss,
        bossPerfect: !!(les.boss && wrongs === 0),
        pinIds: (les.pins || []).map(function (_, i) { return les.id + '#' + i; }),
        placeIds: (les.places || []).map(function (p) { return p.layer + ':' + p.id; }),
        badges: badges
      });
      try {
        sessionStorage.setItem('liuke.result', JSON.stringify({
          day: day,
          subject: subject,
          stars: stars,
          correct: correct,
          total: quiz.length,
          ms: ms,
          mini: useMini,
          first: info.first,
          boss: !!les.boss,
          perfect: !!(les.boss && wrongs === 0)
        }));
      } catch (e) {}
    }

    function goResult() {
      location.hash = '#/result/' + day + '/' + subject;
    }

    function stepNode(s, i, current) {
      const node = LK.h('button', {
        class: 'step' + (current ? ' is-current' : ' step-past'),
        'data-no-press': current ? null : '1'
      });
      if (!current) node.type = 'button';
      const bar = LK.h('i', { class: 'step-bar' });
      if (!current) bar.style.transform = 'scaleY(1)';
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
      if (!current) {
        node.addEventListener('click', function () { node.classList.toggle('is-open'); });
      }
      return node;
    }

    function showHook() {
      phase = 'hook';
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card hook-card' });
      card.appendChild(LK.h('span', { class: 'tag', text: sub.name }));
      card.appendChild(LK.h('p', { class: 'hook-text', text: les.hook }));
      phaseBody.appendChild(card);
      setAction({
        label: '开始',
        onClick: function () {
          LKMotion.flip(card, function () {
            phase = 'steps';
            step = 0;
            fillSteps(card, false);
          });
        }
      });
      paintChrome();
      saveDraft();
    }

    function showSteps(index, animate) {
      phase = 'steps';
      step = index;
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card' });
      phaseBody.appendChild(card);
      fillSteps(card, animate);
    }

    function fillSteps(card, animate) {
      const n = useMini ? 1 : (les.steps || []).length;
      card.className = 'stage-card';
      card.innerHTML = '';
      card.appendChild(LK.h('h2', { class: 'card-h', text: les.title }));
      const list = LK.h('div', { class: 'step-list' });
      for (let i = 0; i <= step && i < n; i++) list.appendChild(stepNode(les.steps[i], i, i === step));
      card.appendChild(list);
      phaseBody.appendChild(card);
      if (animate) {
        const cur = list.querySelector('.is-current');
        LKMotion.stepIn(cur);
      } else {
        const bar = list.querySelector('.is-current .step-bar');
        if (bar) bar.style.transform = 'scaleY(1)';
      }
      function onNext() {
        if (step < n - 1) {
          const prev = list.querySelector('.is-current');
          if (prev) {
            prev.classList.remove('is-current');
            LKMotion.dim(prev);
          }
          step += 1;
          const node = stepNode(les.steps[step], step, true);
          list.appendChild(node);
          LKMotion.stepIn(node);
          paintChrome();
          saveDraft();
          setFoot();
          return;
        }
        if (!useMini && les.interaction) showInteract();
        else showQuiz();
      }
      function setFoot() {
        const last = step >= n - 1;
        setAction({ label: last ? '我懂了，去练一练' : ('下一步（' + (step + 1) + '/' + n + '）'), onClick: onNext });
      }
      setFoot();
      paintChrome();
      saveDraft();
    }

    function showInteract() {
      phase = 'interact';
      phaseBody.innerHTML = '';
      setAction({ hidden: true });
      const holder = LK.h('div', { class: 'stage-card inter-card' });
      phaseBody.appendChild(holder);
      const node = LKInteract.mount(les.interaction, {
        onDone: function () { showQuiz(); },
        setAction: setAction
      });
      holder.appendChild(node);
      paintChrome();
      saveDraft();
    }

    function showRecall() {
      phase = 'recall';
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card' });
      card.appendChild(LK.h('span', { class: 'tag', text: sub.name }));
      card.appendChild(LK.h('h2', { class: 'card-h', text: '本周带走' }));
      const ul = LK.h('ul', { class: 'take-list' });
      (les.takes || []).forEach(function (t) { ul.appendChild(LK.h('li', { text: t })); });
      card.appendChild(ul);
      phaseBody.appendChild(card);
      setAction({ label: '开始做题', onClick: showQuiz });
      paintChrome();
      saveDraft();
    }

    function showIntro() {
      phase = 'intro';
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card hook-card' });
      card.appendChild(LK.h('span', { class: 'tag', text: '跨科 Boss' }));
      card.appendChild(LK.h('h2', { class: 'card-h', text: les.title }));
      card.appendChild(LK.h('p', { class: 'hook-text', text: les.intro }));
      phaseBody.appendChild(card);
      setAction({ label: '开始挑战', onClick: showQuiz });
      paintChrome();
      saveDraft();
    }

    function showQuiz() {
      phase = 'quiz';
      if (qi >= quiz.length) {
        if (les.boss) { finishLesson(); goResult(); return; }
        showTake();
        return;
      }
      const q = quiz[qi];
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card q-card' });
      if (q.review || les.review) card.appendChild(LK.h('span', { class: 'tag', text: '回炉' }));
      card.appendChild(LK.h('p', { class: 'q-text', text: q.q }));
      const list = LK.h('div', { class: 'opt-list' });
      const explain = LK.h('div', { class: 'explain', hidden: true });
      const clip = LK.h('div', { class: 'explain-clip' });
      const kicker = LK.h('p', { class: 'explain-k' });
      clip.appendChild(kicker);
      clip.appendChild(LK.h('p', { class: 'explain-why', text: q.why }));
      explain.appendChild(clip);
      let answered = false;
      q.options.forEach(function (text, di) {
        const btn = LK.h('button', { class: 'opt', text: text });
        btn.addEventListener('click', function () {
          if (answered) return;
          answered = true;
          const ok = di === q.answer;
          if (ok) correct += 1;
          else wrongs += 1;
          LKStore.grade(q.key, ok, q.indexMap[di]);
          list.querySelectorAll('.opt').forEach(function (o) { o.disabled = true; });
          if (ok) {
            btn.classList.add('is-ok');
            LKMotion.bounce(card);
            LKMotion.celebrateMascot(mascotWrap.querySelector('.mascot'));
            kicker.textContent = '对了';
            const fly = LKMotion.arcFly(btn, starHost, { text: '★' });
            Promise.resolve(fly).then(function () {
              litStars = Math.min(3, correct);
              starHost.innerHTML = '';
              starHost.appendChild(LKIcons.stars(litStars, 3));
              const newest = starHost.querySelectorAll('.star-ico')[litStars - 1];
              if (newest) LKMotion.pop(newest);
              const fill = segHost.querySelector('.seg.is-now .seg-fill');
              LKMotion.growX(fill);
            });
          } else {
            btn.classList.add('is-bad');
            LKMotion.shake(btn);
            kicker.textContent = '差一点';
            setTimeout(function () {
              const good = list.querySelectorAll('.opt')[q.answer];
              if (!good) return;
              good.classList.add('is-reveal');
              if (!LKMotion.reduce()) {
                good.animate(
                  [{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }],
                  { duration: 220, easing: 'cubic-bezier(.34,1.56,.64,1)' }
                );
              }
            }, 200);
          }
          LKMotion.revealRows(explain, ok ? null : { delay: 250, duration: 420 });
          paintChrome();
          qi += 1;
          saveDraft();
          qi -= 1;
          setAction({
            label: '继续',
            onClick: function () {
              qi += 1;
              if (qi < quiz.length) showQuiz();
              else if (les.boss) { finishLesson(); goResult(); }
              else showTake();
            }
          });
        });
        list.appendChild(btn);
      });
      card.appendChild(list);
      card.appendChild(explain);
      phaseBody.appendChild(card);
      setAction({ hidden: true });
      paintChrome();
      saveDraft();
    }

    function showTake() {
      phase = 'take';
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card take-card' });
      card.appendChild(LK.h('span', { class: 'tag', text: '今日带走' }));
      card.appendChild(LK.h('p', { class: 'take-text', text: les.take || '今天这一关先到这里。' }));
      if (les.tts && les.tts.length) {
        const box = LK.h('div', { class: 'tts-list' });
        les.tts.forEach(function (line) {
          if (!LK.canSpeak()) {
            box.appendChild(LK.h('p', { class: 'listen-text', text: line }));
            return;
          }
          const b = LK.h('button', { class: 'tts-btn', text: '▶  ' + line });
          b.addEventListener('click', function () {
            if (!LK.speak(line, LKStore.get().settings.ttsRate || 0.9)) {
              b.replaceWith(LK.h('p', { class: 'listen-text', text: line }));
              return;
            }
            b.classList.add('is-speaking');
            setTimeout(function () { b.classList.remove('is-speaking'); }, 1500);
          });
          box.appendChild(b);
        });
        card.appendChild(box);
      }
      if (les.pins && les.pins.length) {
        const preview = LK.h('div', { class: 'pin-preview' });
        preview.appendChild(LK.h('span', { class: 'preview-k', text: '已钉上时间轴' }));
        les.pins.slice(0, 4).forEach(function (p) {
          const pin = LK.h('span', { class: 'mini-pin' }, [
            LK.h('i', { class: 'ripple' }),
            LK.h('b', { text: p.label })
          ]);
          preview.appendChild(pin);
          requestAnimationFrame(function () { LKMotion.pinDrop(pin); });
        });
        card.appendChild(preview);
      }
      if (les.places && les.places.length) {
        const names = les.places.map(function (p) { return p.label; }).join('、');
        card.appendChild(LK.h('p', { class: 'place-preview', text: '已点亮地图 · ' + names }));
      }
      phaseBody.appendChild(card);
      setAction({
        label: '收下这张卡',
        onClick: function () {
          finishLesson();
          const target = document.querySelector('[data-tab="cards"]') || footBtn;
          const rect = card.getBoundingClientRect();
          const clone = card.cloneNode(true);
          clone.classList.add('fly-card');
          clone.style.position = 'fixed';
          clone.style.left = '0';
          clone.style.top = '0';
          clone.style.width = rect.width + 'px';
          clone.style.margin = '0';
          clone.style.zIndex = '80';
          clone.style.pointerEvents = 'none';
          document.body.appendChild(clone);
          const flight = LKMotion.arcFly(card, target, {
            flyer: clone,
            scaleTo: 0.3,
            rotate: 12,
            duration: 640,
            lift: 110
          });
          card.style.visibility = 'hidden';
          Promise.resolve(flight).then(function () {
            if (target.animate && !LKMotion.reduce()) {
              target.animate(
                [
                  { transform: 'translateY(0)' },
                  { transform: 'translateY(-6px)', offset: .45 },
                  { transform: 'translateY(0)' }
                ],
                { duration: 280, easing: 'cubic-bezier(.34,1.56,.64,1)' }
              );
            }
            const tabs = document.getElementById('tabbar');
            if (tabs) tabs.classList.remove('is-hidden');
            goResult();
          });
        }
      });
      paintChrome();
    }

    closeBtn.addEventListener('click', function () {
      LKSheet.confirm({
        title: '先离开这一关？',
        body: '进度会保存',
        ok: '先离开',
        cancel: '继续学习'
      }).then(function (yes) {
        if (!yes) return;
        saveDraft();
        location.hash = '#/today';
      });
    });

    if (phase === 'hook') showHook();
    else if (phase === 'steps') showSteps(step, false);
    else if (phase === 'interact') showInteract();
    else if (phase === 'recall') showRecall();
    else if (phase === 'intro') showIntro();
    else if (phase === 'quiz') showQuiz();
    else showTake();

    return screen;
  }

  global.LKLesson = { mount: mount };
})(window);
