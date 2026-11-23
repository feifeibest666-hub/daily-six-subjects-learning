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

  function refList(ref) {
    if (ref == null) return [];
    return Array.isArray(ref) ? ref.slice() : [ref];
  }

  function glen(s) { return Array.from(String(s || '')).length; }

  function mount(day, subject) {
    const les = LKCatalog.lesson(day, subject);
    if (!les) return blocked('没有这一关。');
    const opened = LKStore.get();
    const draftPeek = opened.draft && opened.draft.id === les.id ? opened.draft : null;
    if (subject === 'english' && !draftPeek && les.day > 1 && global.LKStore.dueWords) {
      const due = LKStore.dueWords(les.day).slice(0, 4);
      if (due.length) les.steps = [{ kind: 'warmup', title: '回顾 · 听音认词', words: due }].concat(les.steps || []);
    }
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
    if (!quiz.length) quiz = [{ key: les.id + '#x', q: '今天先回忆一句带走的话。', options: ['先记住带走的那一句', '跳过不看', '以后再说'], answer: 0, why: '回炉是为了把本周的话再站稳一次。', indexMap: [0, 1, 2], ref: null }];

    let phase = draft ? draft.phase : (les.boss ? 'intro' : (les.review ? 'recall' : 'hook'));
    let step = draft ? draft.step || 0 : 0;
    let stepGen = 0;
    let qi = draft ? draft.qi || 0 : 0;
    let wrongs = draft ? draft.wrongs || 0 : 0;
    let correct = draft ? draft.correct || 0 : 0;
    let litStars = Math.min(3, correct);
    const elapsedBase = draft ? draft.elapsed || 0 : 0;
    const started = Date.now();
    let paused = 0;
    let pauseAt = 0;
    const checks = draft && draft.checks ? draft.checks : {};
    let frameCtl = null;
    let liveStage = null;
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

    function shownStars() { return litStars; }

    function richMode() {
      return !!(les.steps && les.steps[0] && les.steps[0].title);
    }

    function visibleCount() {
      const steps = les.steps || [];
      if (!useMini) return steps.length;
      for (let i = 0; i < steps.length; i++) {
        if (steps[i].check) return i + 1;
      }
      return Math.min(1, steps.length);
    }

    if (phase === 'steps') step = Math.min(step, Math.max(0, visibleCount() - 1));

    function segmentCount() {
      if (les.boss) return 1 + quiz.length;
      if (les.review) return 1 + quiz.length + 1;
      const inter = !useMini && les.interaction ? 1 : 0;
      return 1 + visibleCount() + inter + quiz.length + 1;
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
      let base = 1 + visibleCount();
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

    function elapsed() {
      const hold = pauseAt ? (Date.now() - pauseAt) : 0;
      return Date.now() - started - paused - hold + elapsedBase;
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
        elapsed: elapsed(),
        checks: checks,
        quizKeys: quiz.map(function (q) { return q.key; })
      });
    }

    function finishLesson() {
      const ms = elapsed();
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

    function appendRich(el, text) { el.appendChild(LK.rich(text || '')); }

    function textBlock(kicker, text, extra) {
      const part = LK.h('div', { class: 'k-part' + (extra || '') });
      if (kicker) part.appendChild(LK.h('span', { class: 'k-k', text: kicker }));
      const p = LK.h('p', { class: 'k-p' });
      appendRich(p, text);
      part.appendChild(p);
      return part;
    }

    function renderBody(s, host) {
      if (s.title) {
        if (s.idea) host.appendChild(textBlock('白话', s.idea));
        if (s.why) host.appendChild(textBlock('为什么', s.why));
        if (s.example) host.appendChild(textBlock(s.exLabel || '举个例子', s.example));
        if (s.derive && s.derive.length) {
          const part = LK.h('div', { class: 'k-part k-derive' });
          part.appendChild(LK.h('span', { class: 'k-k', text: '推一下' }));
          s.derive.forEach(function (line, i) {
            const p = LK.h('p', { class: 'derive-line' });
            p.appendChild(document.createTextNode((i + 1) + '. '));
            p.appendChild(LK.rich(line));
            part.appendChild(p);
          });
          host.appendChild(part);
        }
        if (s.formula) host.appendChild(LK.h('div', { class: 'k-part formula num', text: s.formula }));
        if (s.visual) {
          const viz = LKVisuals.render(s.visual);
          if (viz) host.appendChild(LK.h('div', { class: 'k-part' }, [viz]));
        }
        if (s.takeaway) host.appendChild(textBlock('一句话', s.takeaway, ' k-take'));
      } else {
        host.appendChild(textBlock('', s.text || ''));
        if (s.formula) host.appendChild(LK.h('div', { class: 'k-part formula num', text: s.formula }));
        if (s.visual) {
          const viz = LKVisuals.render(s.visual);
          if (viz) host.appendChild(LK.h('div', { class: 'k-part' }, [viz]));
        }
      }
    }

    function mountCheck(s, index, parent, onSettled) {
      if (!s.check) return;
      const check = s.check;
      const map = LK.shuffleIdx(check.options.length, state.seed + '|' + les.id + '|chk|' + index);
      const answerDisplay = map.indexOf(check.answer);
      const block = LK.h('div', { class: 'check' });
      block.appendChild(LK.h('span', { class: 'check-k', text: '小检查' }));
      const q = LK.h('p', { class: 'check-q' });
      appendRich(q, check.q);
      block.appendChild(q);
      const side = check.options.every(function (t) { return glen(t) <= 8; });
      const opts = LK.h('div', { class: 'check-opts' + (side ? ' is-row' : '') });
      const explain = LK.h('div', { class: 'explain', hidden: true });
      const clip = LK.h('div', { class: 'explain-clip' });
      const why = LK.h('p', { class: 'explain-why' });
      clip.appendChild(why);
      explain.appendChild(clip);
      const buttons = [];
      map.forEach(function (src, di) {
        const btn = LK.h('button', { class: 'check-opt', type: 'button', text: check.options[src] });
        btn.addEventListener('click', function () {
          if (checks[index] != null) return;
          checks[index] = di;
          settle(di, true);
          saveDraft();
          if (onSettled) onSettled(true);
        });
        opts.appendChild(btn);
        buttons.push(btn);
      });
      block.appendChild(opts);
      block.appendChild(explain);
      parent.appendChild(block);

      function settle(di, animate) {
        const ok = di === answerDisplay;
        buttons.forEach(function (b) { b.disabled = true; });
        const picked = buttons[di];
        if (ok && picked) {
          picked.classList.add('is-ok');
          const mark = LK.h('i', { class: 'check-mark', text: '✓', 'aria-hidden': 'true' });
          picked.appendChild(mark);
            if (animate) {
            LKMotion.pop(mark, 300);
            LKMotion.nod(mascotWrap.querySelector('.mascot'));
          }
          why.textContent = '对！' + check.why;
        } else {
          if (picked) {
            picked.classList.add('is-bad');
            if (animate) LKMotion.shake(picked);
          }
          const good = buttons[answerDisplay];
          const reveal = function () { if (good) good.classList.add('is-ok'); };
          if (animate) setTimeout(reveal, 200);
          else reveal();
          why.textContent = '没关系，再看一眼：' + check.why;
        }
        if (animate) LKMotion.revealRows(explain, ok ? null : { delay: 250, duration: 360 });
        else {
          explain.hidden = false;
          explain.style.gridTemplateRows = '1fr';
        }
      }

      if (checks[index] != null) settle(+checks[index], false);
    }

    function foldLabel(s) {
      if (s.title) return s.title;
      const chars = Array.from(s.text || LK.stepSummary(s) || '');
      if (chars.length <= 14) return chars.join('');
      return chars.slice(0, 14).join('') + '…';
    }

    function foldLine(s, i) {
      const row = LK.h('div', { class: 'card-fold' });
      row.appendChild(LK.h('span', { class: 'step-no', text: String(i + 1) }));
      row.appendChild(LK.h('span', { class: 'fold-title', text: foldLabel(s) }));
      if (s.title && s.takeaway) row.appendChild(LK.h('span', { class: 'fold-take', text: s.takeaway }));
      return row;
    }

    function showHook() {
      phase = 'hook';
      phaseBody.innerHTML = '';
      releaseStage();
      const card = LK.h('div', { class: 'stage-card hook-card' });
      card.appendChild(LK.h('span', { class: 'tag', text: sub.name }));
      if (les.hookComic && global.LKStage && LKStage.has('comic')) {
        const host = LK.h('div', { class: 'stage-host' });
        const text = LK.h('p', { class: 'hook-text', hidden: true, text: les.hook });
        card.appendChild(host);
        card.appendChild(text);
        phaseBody.appendChild(card);
        const comic = Object.assign({ type: 'comic' }, les.hookComic);
        const api = LKStage.mount(host, comic, {
          subject: sub,
          onFrame: function (i, meta) {
            const last = meta.last;
            text.hidden = !last;
            setAction({
              label: last ? '开始' : '下一格',
              onClick: function () {
                if (!last) api.next();
                else LKMotion.flip(card, function () {
                  phase = 'steps';
                  step = 0;
                  showSteps(0, false);
                });
              }
            });
          }
        });
      } else {
        card.appendChild(LK.h('p', { class: 'hook-text', text: les.hook }));
        phaseBody.appendChild(card);
        setAction({
          label: '开始',
          onClick: function () {
            LKMotion.flip(card, function () {
              phase = 'steps';
              step = 0;
              showSteps(0, false);
            });
          }
        });
      }
      paintChrome();
      saveDraft();
    }

    function showSteps(index, animate) {
      phase = 'steps';
      const prev = step;
      step = index;
      stepGen += 1;
      if (richMode() && animate && index === prev + 1 && phaseBody.querySelector('.kcard.is-current')) {
        advanceRich(stepGen);
        return;
      }
      phaseBody.innerHTML = '';
      const card = LK.h('div', { class: 'stage-card' });
      phaseBody.appendChild(card);
      if (richMode()) fillRich(card, animate);
      else fillLegacy(card, animate);
    }

    function isFramed(v) {
      if (!v || !global.LKStage) return false;
      if (v.recall) return true;
      const frames = v.frames || v.panels;
      return !!(frames && frames.length >= 2 && LKStage.has(v.type || 'comic'));
    }

    function releaseStage() {
      if (liveStage && liveStage.api) liveStage.api.destroy();
      liveStage = null;
      frameCtl = null;
    }

    function paraBlock(slot) {
      if (slot.key === 'formula') return LK.h('div', { class: 'k-part formula num', text: slot.text });
      const part = LK.h('div', { class: 'k-part' + (slot.extra || '') });
      if (slot.label) part.appendChild(LK.h('span', { class: 'k-k', text: slot.label }));
      const p = LK.h('p', { class: slot.key === 'derive' ? 'derive-line' : 'k-p' });
      if (slot.key === 'derive') p.appendChild(document.createTextNode((slot.index + 1) + '. '));
      p.appendChild(LK.rich(slot.text));
      part.appendChild(p);
      return part;
    }

    function mountFramed(s, index, current) {
      const visual = s.visual;
      const frames = visual.frames || visual.panels || [];
      const plan = LKStage.paras(s, frames);
      const stageHost = LK.h('div', { class: 'stage-host' });
      const fold = LK.h('button', { class: 'read-fold', type: 'button', hidden: true });
      const foldClip = LK.h('div', { class: 'read-clip' });
      const foldInner = LK.h('div', { class: 'read-inner' });
      foldClip.appendChild(foldInner);
      foldClip.style.gridTemplateRows = '0fr';
      const paraHost = LK.h('div', { class: 'frame-paras' });
      const checkHost = LK.h('div', { class: 'frame-check', hidden: true });
      current.appendChild(stageHost);
      current.appendChild(fold);
      current.appendChild(foldClip);
      current.appendChild(paraHost);
      current.appendChild(checkHost);
      mountCheck(s, index, checkHost, function () {
        wireFoot(index);
        LKMotion.rebound(footBtn);
      });
      let openRead = false;
      let showAll = false;
      let api = null;

      function paintParas(i) {
        paraHost.innerHTML = '';
        foldInner.innerHTML = '';
        if (showAll) {
          fold.hidden = true;
          foldClip.hidden = true;
          plan.forEach(function (group) {
            group.forEach(function (slot) { paraHost.appendChild(paraBlock(slot)); });
          });
          checkHost.hidden = !s.check;
          return;
        }
        const seen = [];
        for (let k = 0; k < i; k++) (plan[k] || []).forEach(function (slot) { seen.push(slot); });
        const labels = [];
        seen.forEach(function (slot) {
          if (slot.label && labels.indexOf(slot.label) < 0) labels.push(slot.label);
        });
        fold.hidden = labels.length === 0;
        fold.textContent = labels.join(' · ') + '（已读，点开回看）';
        seen.forEach(function (slot) { foldInner.appendChild(paraBlock(slot)); });
        (plan[i] || []).forEach(function (slot) { paraHost.appendChild(paraBlock(slot)); });
        checkHost.hidden = !(i >= frames.length - 1 && s.check);
      }

      fold.addEventListener('click', function () {
        openRead = !openRead;
        if (LKMotion.reduce()) {
          foldClip.style.gridTemplateRows = openRead ? '1fr' : '0fr';
          return;
        }
        foldClip.animate(
          [{ gridTemplateRows: openRead ? '0fr' : '1fr' }, { gridTemplateRows: openRead ? '1fr' : '0fr' }],
          { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
        );
      });

      function onFrame(i) {
        paintParas(showAll ? frames.length - 1 : i);
        frameCtl = {
          next: function () { if (api) api.next(); },
          done: function () { return showAll || i >= frames.length - 1; }
        };
        wireFoot(index);
      }

      const opts = {
        subject: sub,
        onFrame: onFrame,
        onExpandAll: function () {
          showAll = true;
          paintParas(frames.length - 1);
          frameCtl = { next: function () {}, done: function () { return true; } };
          wireFoot(index);
        }
      };
      const same = liveStage && visual.stage && liveStage.id === visual.stage && liveStage.type === visual.type && liveStage.api && liveStage.api.root;
      if (same) {
        stageHost.appendChild(liveStage.api.root);
        api = liveStage.api;
        api.load(visual, opts);
      } else {
        if (liveStage && liveStage.api) liveStage.api.destroy();
        api = LKStage.mount(stageHost, visual, opts);
        liveStage = { id: visual.stage || '', type: visual.type, api: api };
      }
      frameCtl = {
        next: function () { if (api) api.next(); },
        done: function () { return false; }
      };
    }

    function makeCurrent(index) {
      const s = les.steps[index];
      const current = LK.h('article', { class: 'kcard is-current' });
      const titleRow = LK.h('div', { class: 'kcard-h' });
      titleRow.appendChild(LK.h('span', { class: 'step-no', text: String(index + 1) }));
      titleRow.appendChild(LK.h('h3', { text: s.title || '' }));
      if (s.review) titleRow.appendChild(LK.h('span', { class: 'tag', text: '回顾' }));
      current.appendChild(titleRow);
      if (s.kind && global.LKEnglish) {
        frameCtl = null;
        if (liveStage && liveStage.api) { liveStage.api.destroy(); liveStage = null; }
        s._ready = false;
        LKEnglish.mount(current, s, les, {
          onReady: function () {
            s._ready = true;
            wireFoot(index);
          }
        });
        if (s.check) {
          mountCheck(s, index, current, function () {
            wireFoot(index);
            LKMotion.rebound(footBtn);
          });
        }
      } else if (isFramed(s.visual)) mountFramed(s, index, current);
      else {
        frameCtl = null;
        if (liveStage && liveStage.api) { liveStage.api.destroy(); liveStage = null; }
        renderBody(s, current);
        mountCheck(s, index, current, function () {
          wireFoot(index);
          LKMotion.rebound(footBtn);
        });
      }
      return current;
    }

    function wireFoot(index) {
      const s = les.steps[index];
      if (s && s.kind && !s._ready) {
        setAction({ label: '先完成这张', disabled: true, onClick: function () {} });
        return;
      }
      if (frameCtl && !frameCtl.done()) {
        setAction({ label: '下一帧', disabled: false, onClick: function () { frameCtl.next(); } });
        return;
      }
      const n = visibleCount();
      const need = s.check && checks[index] == null;
      const last = index >= n - 1;
      setAction({
        label: need ? '先答上面的小问题' : (last ? '我懂了，去练一练' : ('下一张（' + (index + 1) + '/' + n + '）')),
        disabled: !!need,
        onClick: function () {
          if (s.check && checks[index] == null) return;
          if (index < n - 1) showSteps(index + 1, true);
          else if (!useMini && les.interaction) showInteract();
          else showQuiz();
        }
      });
    }

    function revealCurrent(current, animate) {
      wireFoot(step);
      paintChrome();
      saveDraft();
      if (!animate) return;
      LKMotion.partsIn(current);
      const behavior = LKMotion.reduce() ? 'auto' : 'smooth';
      requestAnimationFrame(function () { current.scrollIntoView({ behavior: behavior, block: 'start' }); });
    }

    function fillRich(card, animate) {
      const n = visibleCount();
      card.className = 'stage-card';
      card.innerHTML = '';
      const head = LK.h('div', { class: 'k-head' });
      head.appendChild(LK.h('h2', { class: 'card-h', text: les.title }));
      card.appendChild(head);
      const list = LK.h('div', { class: 'card-stack' });
      for (let i = 0; i < step && i < n; i++) list.appendChild(foldLine(les.steps[i], i));
      const current = makeCurrent(step);
      list.appendChild(current);
      card.appendChild(list);
      revealCurrent(current, animate);
    }

    function advanceRich(gen) {
      const current = phaseBody.querySelector('.kcard.is-current');
      if (!current) return;
      const clip = LK.h('div', { class: 'peek-clip' });
      const inner = LK.h('div', { class: 'peek-inner' });
      while (current.children.length > 1) inner.appendChild(current.children[1]);
      clip.appendChild(inner);
      current.appendChild(clip);
      clip.style.gridTemplateRows = '1fr';
      setAction({ label: '下一张', disabled: true, onClick: function () {} });
      function finish() {
        if (gen !== stepGen || !current.isConnected) return;
        const stack = current.parentNode;
        const fold = foldLine(les.steps[step - 1], step - 1);
        current.replaceWith(fold);
        const next = makeCurrent(step);
        stack.appendChild(next);
        revealCurrent(next, true);
      }
      const reduce = LKMotion.reduce();
      const fade = inner.animate([{ opacity: 1 }, { opacity: 0 }], { duration: reduce ? 120 : 140, fill: 'forwards' });
      if (reduce) {
        fade.finished.then(finish, function () {});
        return;
      }
      const drop = clip.animate(
        [{ gridTemplateRows: '1fr' }, { gridTemplateRows: '0fr' }],
        { duration: 280, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
      );
      drop.finished.then(finish, function () {});
    }

    function fillLegacy(card, animate) {
      const n = visibleCount();
      card.className = 'stage-card';
      card.innerHTML = '';
      card.appendChild(LK.h('h2', { class: 'card-h', text: les.title }));
      const list = LK.h('div', { class: 'step-list' });
      for (let i = 0; i <= step && i < n; i++) list.appendChild(legacyNode(les.steps[i], i, i === step));
      card.appendChild(list);
      if (animate) {
        const cur = list.querySelector('.is-current');
        LKMotion.stepIn(cur);
      } else {
        const bar = list.querySelector('.is-current .step-bar');
        if (bar) bar.style.transform = 'scaleY(1)';
      }
      const s = les.steps[step];
      function onNext() {
        if (s.check && checks[step] == null) return;
        if (step < n - 1) {
          showSteps(step + 1, true);
          return;
        }
        if (!useMini && les.interaction) showInteract();
        else showQuiz();
      }
      function setFoot() {
        const need = s.check && checks[step] == null;
        const last = step >= n - 1;
        setAction({
          label: need ? '先答上面的小问题' : (last ? '我懂了，去练一练' : ('下一步（' + (step + 1) + '/' + n + '）')),
          disabled: !!need,
          onClick: onNext
        });
      }
      setFoot();
      paintChrome();
      saveDraft();
    }

    function legacyNode(s, i, current) {
      const node = LK.h('div', { class: 'step' + (current ? ' is-current' : ' step-past') });
      const bar = LK.h('i', { class: 'step-bar' });
      if (!current) bar.style.transform = 'scaleY(1)';
      node.appendChild(bar);
      node.appendChild(LK.h('span', { class: 'step-no', text: String(i + 1) }));
      const box = LK.h('span', { class: 'step-body' });
      const text = LK.h('span', { class: 'step-text' });
      appendRich(text, s.text || s.idea || '');
      box.appendChild(text);
      if (s.formula) box.appendChild(LK.h('span', { class: 'formula num', text: s.formula }));
      if (s.visual) {
        const viz = LKVisuals.render(s.visual);
        if (viz) box.appendChild(viz);
      }
      if (current) {
        mountCheck(s, i, box, function () {
          const need = s.check && checks[i] == null;
          const last = i >= visibleCount() - 1;
          setAction({
            label: need ? '先答上面的小问题' : (last ? '我懂了，去练一练' : ('下一步（' + (i + 1) + '/' + visibleCount() + '）')),
            disabled: !!need,
            onClick: function () {
              if (s.check && checks[i] == null) return;
              if (i < visibleCount() - 1) showSteps(i + 1, true);
              else if (!useMini && les.interaction) showInteract();
              else showQuiz();
            }
          });
          LKMotion.rebound(footBtn);
        });
      }
      node.appendChild(box);
      return node;
    }

    function peekButton(getTarget, hint) {
      const btn = LK.h('button', { class: 'peek-btn', type: 'button' });
      btn.appendChild(LKIcons.book());
      btn.appendChild(LK.h('span', { text: '回看讲解' }));
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        openLookback(getTarget(), btn);
      });
      if (hint && !state.settings.peekHintShown) {
        LKStore.setSetting('peekHintShown', true);
        state.settings.peekHintShown = true;
        if (!LKMotion.reduce()) {
          btn.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.06)', offset: .5 }, { transform: 'scale(1)' }],
            { duration: 420, delay: 600, easing: 'cubic-bezier(.34,1.56,.64,1)' }
          );
        }
      }
      return btn;
    }

    function sourceOf(q) {
      if (les.boss) {
        const part = les.parts && les.parts[qi];
        const ref = part && part.ref;
        return { lesson: ref && LKCatalog.lessonById(ref.lesson), steps: ref && ref.step, from: true };
      }
      if (q && (q.review || (q.key && q.key.indexOf(les.id) !== 0))) {
        const id = String(q.key || '').split('#')[0];
        return { lesson: LKCatalog.lessonById(id), steps: q.ref, from: true };
      }
      const warm = les.steps && les.steps[0] && les.steps[0].kind === 'warmup';
      function shift(ref) {
        if (!warm || ref == null) return ref;
        if (Array.isArray(ref)) return ref.map(function (n) { return typeof n === 'number' ? n + 1 : n; });
        return typeof ref === 'number' ? ref + 1 : ref;
      }
      if (phase === 'interact') return { lesson: les, steps: shift(les.interaction && les.interaction.ref), from: false };
      return { lesson: les, steps: shift(q ? q.ref : null), from: false };
    }

    function openLookback(target, opener) {
      if (!target || !target.lesson || !(target.lesson.steps && target.lesson.steps.length)) return;
      pauseAt = Date.now();
      const src = target.lesson;
      const srcSub = SUBJECTS[src.subject] || sub;
      const refs = refList(target.steps);
      const openRefs = refs.length ? refs : [0];
      const titleId = 'peek-title';
      const rec = LKStore.get().lessons[src.id];
      let cutoff = -1;
      if ((rec && rec.mini) || (useMini && src.id === les.id)) {
        cutoff = 0;
        for (let i = 0; i < src.steps.length; i++) {
          if (src.steps[i].check) { cutoff = i; break; }
        }
      }
      LKSheet.open(function (body, close) {
        body.style.setProperty('--accent', srcSub.color);
        body.style.setProperty('--soft', srcSub.soft);
        const head = LK.h('div', { class: 'peek-head' });
        head.appendChild(LK.h('i', { class: 'peek-dot', style: { background: srcSub.color } }));
        const titles = LK.h('div', { class: 'peek-titles' });
        titles.appendChild(LK.h('p', {
          class: 'peek-k',
          text: (target.from ? '来自' : '') + '第 ' + src.day + ' 天 · ' + srcSub.name
        }));
        titles.appendChild(LK.h('h2', { class: 'peek-h', id: titleId, text: src.title || '' }));
        head.appendChild(titles);
        const x = LK.h('button', { class: 'icon-btn', 'data-sheet-close': '1', 'aria-label': '关闭' }, [LKIcons.closeIcon()]);
        x.addEventListener('click', close);
        head.appendChild(x);
        body.appendChild(head);
        const scroll = LK.h('div', { class: 'peek-scroll' });
        if (src.hook) scroll.appendChild(LK.h('p', { class: 'peek-hook', text: src.hook }));
        src.steps.forEach(function (s, i) {
          scroll.appendChild(peekCard(s, i, openRefs.indexOf(i) >= 0, cutoff >= 0 && i > cutoff, srcSub));
        });
        if (src.take) scroll.appendChild(LK.h('p', { class: 'peek-take', text: '今日带走：' + src.take }));
        body.appendChild(scroll);
        const footBar = LK.h('div', { class: 'peek-foot' });
        const back = LK.h('button', { class: 'btn btn-primary', text: '回到题目' });
        back.addEventListener('click', close);
        footBar.appendChild(back);
        body.appendChild(footBar);
        const first = scroll.querySelector('.peek-card.is-ref') || scroll.querySelector('.peek-card');
        const reduce = LKMotion.reduce();
        setTimeout(function () {
          if (!first || !first.isConnected) return;
          first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
          if (reduce) return;
          first.animate(
            [{ backgroundColor: '#ffffff' }, { backgroundColor: srcSub.soft }],
            { duration: 240, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
          );
          const tag = first.querySelector('.peek-rel');
          if (tag) {
            tag.animate(
              [{ transform: 'scale(.8)' }, { transform: 'scale(1)' }],
              { duration: 220, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'forwards' }
            );
          }
        }, reduce ? 0 : 380);
      }, {
        tall: true,
        labelledBy: titleId,
        returnFocus: opener,
        onClose: function () {
          if (pauseAt) {
            paused += Date.now() - pauseAt;
            pauseAt = 0;
          }
          saveDraft();
        }
      });
    }

    function peekCard(s, i, opened, skipped, srcSub) {
      const card = LK.h('article', { class: 'peek-card' + (opened ? ' is-ref' : '') });
      if (opened) card.style.background = srcSub.soft;
      const fold = LK.h('button', { class: 'card-fold', type: 'button' });
      fold.appendChild(LK.h('span', { class: 'step-no', text: String(i + 1) }));
      fold.appendChild(LK.h('span', { class: 'fold-title', text: foldLabel(s) }));
      if (s.title && s.takeaway) fold.appendChild(LK.h('span', { class: 'fold-take', text: s.takeaway }));
      if (opened) fold.appendChild(LK.h('span', { class: 'peek-rel', text: '和这题有关' }));
      card.appendChild(fold);
      const clip = LK.h('div', { class: 'peek-clip' });
      const inner = LK.h('div', { class: 'peek-inner' });
      if (skipped) inner.appendChild(LK.h('span', { class: 'tag', text: '迷你模式时跳过了' }));
      if (isFramed(s.visual) && global.LKStage) {
        const holder = LK.h('div', { class: 'peek-poster' });
        inner.appendChild(holder);
        LKStage.poster(holder, s.visual, { subject: srcSub, reduced: true });
      }
      renderBody(s, inner);
      if (s.check) {
        inner.appendChild(LK.h('p', {
          class: 'peek-check',
          text: '小检查：' + s.check.q + ' → ' + s.check.options[s.check.answer]
        }));
      }
      clip.appendChild(inner);
      clip.style.gridTemplateRows = opened ? '1fr' : '0fr';
      card.appendChild(clip);
      let isOpen = opened;
      fold.addEventListener('click', function () {
        isOpen = !isOpen;
        if (LKMotion.reduce()) {
          clip.style.gridTemplateRows = isOpen ? '1fr' : '0fr';
          return;
        }
        clip.animate(
          [{ gridTemplateRows: isOpen ? '0fr' : '1fr' }, { gridTemplateRows: isOpen ? '1fr' : '0fr' }],
          { duration: 360, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
        );
      });
      return card;
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
      const prompt = node.querySelector('.inter-prompt');
      if (prompt) {
        const row = LK.h('div', { class: 'q-row' });
        prompt.parentNode.insertBefore(row, prompt);
        row.appendChild(prompt);
        row.appendChild(peekButton(function () { return sourceOf(null); }, false));
      }
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
      (les.takes || []).forEach(function (t, i) {
        const li = LK.h('li');
        const srcDay = (les.week || [])[i];
        const src = srcDay && LKCatalog.lessonById(LK.lessonId(srcDay, les.subject));
        const vis = src && src.steps && src.steps.filter(function (st) { return st.visual; }).pop();
        if (vis && global.LKStage) {
          const thumb = LK.h('div', { class: 'take-thumb' });
          li.appendChild(thumb);
          LKStage.poster(thumb, vis.visual, { subject: SUBJECTS[les.subject] });
        }
        li.appendChild(document.createTextNode(t));
        ul.appendChild(li);
      });
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
      if (les.hookComic && global.LKStage && LKStage.has('comic')) {
        const host = LK.h('div', { class: 'stage-host' });
        card.appendChild(host);
        card.appendChild(LK.h('p', { class: 'hook-text', text: les.intro }));
        phaseBody.appendChild(card);
        LKStage.mount(host, Object.assign({ type: 'comic' }, les.hookComic), { subject: sub, onFrame: function () {} });
      } else {
        card.appendChild(LK.h('p', { class: 'hook-text', text: les.intro }));
        phaseBody.appendChild(card);
      }
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
      const row = LK.h('div', { class: 'q-row' });
      row.appendChild(LK.h('p', { class: 'q-text' }));
      row.lastChild.appendChild(LK.rich(q.q));
      if (q.visual && global.LKStage) {
        const host = LK.h('div', { class: 'stage-host' });
        card.appendChild(host);
        LKStage.poster(host, q.visual, { subject: sub });
      }
      if (q.audio) {
        const silent = !global.LKSpeech || LKSpeech.status() === 'none';
        if (silent) {
          card.appendChild(LK.h('p', { class: 'q-audio-text', text: '读一读：' + q.audio }));
        } else {
          const play = LK.h('button', { class: 'say-btn', type: 'button', text: '听题' });
          play.addEventListener('click', function () { LKSpeech.say(q.audio, { speed: 'normal' }); });
          row.appendChild(play);
        }
      }
      row.appendChild(peekButton(function () { return sourceOf(q); }, qi === 0));
      card.appendChild(row);
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
