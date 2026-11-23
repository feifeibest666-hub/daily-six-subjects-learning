(function (global) {
  function wordSpans(en, onWord) {
    const span = LK.h('span', { class: 'en' });
    const text = String(en || '');
    const toks = global.LKSpeech ? LKSpeech.tokens(text) : [];
    let at = 0;
    toks.forEach(function (t, i) {
      if (t.start > at) span.appendChild(document.createTextNode(text.slice(at, t.start)));
      const w = LK.h('span', { class: 'w', text: t.w });
      w.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (onWord) onWord(t.w, w, i);
      });
      span.appendChild(w);
      at = t.end;
    });
    if (at < text.length) span.appendChild(document.createTextNode(text.slice(at)));
    return span;
  }

  function speakWord(word, node) {
    if (!global.LKSpeech || LKSpeech.status() === 'none') return;
    LKSpeech.say(word, { speed: 'slow' });
    if (node && node.animate) node.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 180, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  }

  function inline(en) {
    return wordSpans(en, function (word, node) { speakWord(word, node); });
  }

  function line(en, opts) {
    opts = opts || {};
    const row = LK.h('div', { class: 'say-line' });
    const who = opts.who || 'N';
    const dot = LK.h('i', { class: 'say-who say-' + who });
    row.appendChild(dot);
    const words = wordSpans(en, function (word, node) { speakWord(word, node); });
    row.appendChild(words);
    if (LKSpeech.status() !== 'none') {
      [['slow', '慢'], ['normal', '常']].forEach(function (pair) {
        const b = LK.h('button', { class: 'say-btn', type: 'button', text: pair[1] });
        b.addEventListener('click', function () {
          const nodes = words.querySelectorAll('.w');
          LKSpeech.say(en, {
            speed: pair[0],
            who: who,
            onWord: function (i) {
              nodes.forEach(function (n, k) { n.classList.toggle('is-on', k === i); });
            },
            onEnd: function () { nodes.forEach(function (n) { n.classList.remove('is-on'); }); }
          });
        });
        row.appendChild(b);
      });
    }
    if (opts.zh) {
      const zh = LK.h('p', { class: 'say-zh', hidden: true, text: opts.zh });
      const eye = LK.h('button', { class: 'say-btn', type: 'button', text: '译' });
      eye.addEventListener('click', function () { zh.hidden = !zh.hidden; });
      row.appendChild(eye);
      const wrap = LK.h('div', { class: 'say-block' });
      wrap.appendChild(row);
      wrap.appendChild(zh);
      return wrap;
    }
    return row;
  }

  function mount(host, step, les, ctx) {
    const kind = step.kind;
    const box = LK.h('div', { class: 'en-card' });
    host.appendChild(box);
    let done = false;
    function finish() {
      if (done) return;
      done = true;
      ctx.onReady();
    }
    if (kind === 'story-listen') {
      box.appendChild(LK.h('p', { class: 'k-p', text: step.idea || '先别看字，看着图听。' }));
      const play = LK.h('button', { class: 'btn btn-primary', type: 'button', text: '听故事' });
      box.appendChild(play);
      play.addEventListener('click', function () {
        const lines = (les.story && les.story.lines) || [];
        if (LKSpeech.status() === 'none') { finish(); return; }
        LKSpeech.sayLines(lines, { speed: 'slow', onEnd: finish });
      });
      if (step.check) box.appendChild(LK.h('p', { class: 'sheet-copy', text: '听完后做上面的小检查。' }));
    } else if (kind === 'words') {
      const heard = {};
      (les.words || []).forEach(function (w) {
        const row = LK.h('div', { class: 'word-row' });
        row.appendChild(LK.h('span', { class: 'word-pic', text: w.pic || '•' }));
        const mid = LK.h('div');
        mid.appendChild(LK.h('strong', { text: w.w }));
        mid.appendChild(LK.h('p', { class: 'sheet-copy', text: (w.ipa ? '/' + w.ipa + '/ ' : '') + (w.zh || '') }));
        row.appendChild(mid);
        const b = LK.h('button', { class: 'say-btn', type: 'button', text: '听' });
        b.addEventListener('click', function () {
          heard[w.w] = true;
          if (global.LKSpeech) LKSpeech.say(w.w, { speed: 'slow' });
          if (Object.keys(heard).length >= (les.words || []).length || LKSpeech.status() === 'none') {
            if (global.LKStore && LKStore.learnWords) LKStore.learnWords(les.id, les.words, les.day);
            finish();
          }
        });
        row.appendChild(b);
        box.appendChild(row);
      });
      if (!les.words || !les.words.length || (global.LKSpeech && LKSpeech.status() === 'none')) finish();
    } else if (kind === 'story-read') {
      const all = LK.h('button', { class: 'btn btn-secondary', type: 'button', text: '播放全部' });
      box.appendChild(all);
      (les.story && les.story.lines || []).forEach(function (ln) { box.appendChild(line(ln.en, { who: ln.who, zh: ln.zh })); });
      let plays = 0;
      all.addEventListener('click', function () {
        plays = 3;
        LKSpeech.sayLines(les.story.lines, { speed: 'normal', onEnd: finish });
      });
      box.addEventListener('click', function (ev) {
        if (ev.target.classList && ev.target.classList.contains('say-btn')) {
          plays += 1;
          if (plays >= 3) finish();
        }
      });
    } else if (kind === 'drill') {
      const frame = step.frame || '';
      const slots = step.slots || {};
      const keys = Object.keys(slots);
      const pick = {};
      keys.forEach(function (k) { pick[k] = 0; });
      const shown = LK.h('p', { class: 'en drill-sentence' });
      const zh = LK.h('p', { class: 'say-zh', text: '' });
      const count = LK.h('p', { class: 'sheet-copy', text: '0/' + (step.need || 3) });
      box.appendChild(shown);
      box.appendChild(zh);
      box.appendChild(count);
      const seen = {};
      function paint() {
        let en = frame;
        let z = step.zh || '';
        keys.forEach(function (k) {
          const item = slots[k][pick[k]] || { en: '', zh: '' };
          en = en.replace('{' + k + '}', item.en);
          z = z.replace('{' + k + '}', item.zh || '');
        });
        shown.innerHTML = '';
        shown.appendChild(inline(en));
        zh.textContent = z;
        return en;
      }
      keys.forEach(function (k) {
        const row = LK.h('div', { class: 'pill-row' });
        (slots[k] || []).forEach(function (item, i) {
          const pill = LK.h('button', { class: 'opt', type: 'button', text: (item.pic || '') + ' ' + item.en });
          pill.addEventListener('click', function () {
            pick[k] = i;
            if (step.linked && keys[1]) pick[keys[1]] = i % (slots[keys[1]] || []).length;
            const en = paint();
            const id = keys.map(function (key) { return pick[key]; }).join('-');
            seen[id] = true;
            count.textContent = Object.keys(seen).length + '/' + (step.need || 3);
            if (global.LKSpeech && LKSpeech.status() !== 'none') LKSpeech.say(en, { speed: 'normal' });
            if (Object.keys(seen).length >= (step.need || 3)) finish();
          });
          row.appendChild(pill);
        });
        box.appendChild(row);
      });
      paint();
    } else if (kind === 'shadow') {
      const idxs = step.lines || [0];
      let at = 0;
      let phaseN = 0;
      const sentence = LK.h('p', { class: 'en' });
      const tip = LK.h('p', { class: 'sheet-copy', text: step.tip || '' });
      const btn = LK.h('button', { class: 'btn btn-primary', type: 'button', text: '慢速听' });
      box.appendChild(sentence);
      box.appendChild(tip);
      box.appendChild(btn);
      function show() {
        const ln = (les.story && les.story.lines || [])[idxs[at]] || { en: '' };
        sentence.innerHTML = '';
        sentence.appendChild(inline(ln.en));
        phaseN = 0;
        btn.textContent = '慢速听';
      }
      btn.addEventListener('click', function () {
        const ln = (les.story && les.story.lines || [])[idxs[at]] || { en: '' };
        phaseN += 1;
        if (phaseN === 1) { LKSpeech.say(ln.en, { speed: 'slow', who: ln.who }); btn.textContent = '跟着说'; }
        else if (phaseN === 2) { LKSpeech.say(ln.en, { speed: 'normal', who: ln.who }); btn.textContent = '我来说'; }
        else {
          at += 1;
          if (at >= idxs.length) finish();
          else show();
        }
      });
      show();
    } else if (kind === 'retell') {
      box.appendChild(LK.h('p', { class: 'k-p', text: step.idea || '看着图，用这些词讲一遍。' }));
      (step.keys || []).forEach(function (group, i) {
        const row = LK.h('p', { class: 'en' });
        row.appendChild(document.createTextNode((i + 1) + '. '));
        row.appendChild(inline((group || []).join(' ')));
        box.appendChild(row);
      });
      const ask = LK.h('div', { class: 'pill-row' });
      ['说出来了', '说了一半', '还不太行'].forEach(function (label, n) {
        const b = LK.h('button', { class: 'opt', type: 'button', text: label });
        b.addEventListener('click', function () {
          if (global.LKStore && LKStore.setRetell) LKStore.setRetell(les.id, n);
          if (n === 2) box.appendChild(LK.h('p', { class: 'sheet-copy', text: '没关系，复述是最难的一步。明天听音认词时会再见到这些词。' }));
          finish();
        });
        ask.appendChild(b);
      });
      box.appendChild(ask);
    } else if (kind === 'warmup') {
      const words = step.words || [];
      let i = 0;
      const face = LK.h('p', { class: 'en' });
      const choices = LK.h('div', { class: 'pill-row' });
      box.appendChild(face);
      box.appendChild(choices);
      function round() {
        if (i >= words.length) { finish(); return; }
        const w = words[i];
        face.textContent = w.w;
        choices.innerHTML = '';
        const play = LK.h('button', { class: 'say-btn', type: 'button', text: '听' });
        play.addEventListener('click', function () { LKSpeech.say(w.w, { speed: 'slow' }); });
        choices.appendChild(play);
        const opts = words.slice();
        opts.forEach(function (opt) {
          const b = LK.h('button', { class: 'opt', type: 'button', text: (opt.pic || '') + ' ' + (opt.zh || opt.w) });
          b.addEventListener('click', function () {
            const ok = opt.w === w.w;
            if (global.LKStore && LKStore.gradeWord) LKStore.gradeWord(w.w, ok, les.day);
            i += 1;
            round();
          });
          choices.appendChild(b);
        });
      }
      if (!words.length) finish();
      else round();
    } else {
      finish();
    }
    if (step.check && kind !== 'story-listen') {
      /* checks on activity cards stay optional */
    }
  }

  global.LKSay = { inline: inline, line: line };
  global.LKEnglish = { mount: mount };
})(window);
