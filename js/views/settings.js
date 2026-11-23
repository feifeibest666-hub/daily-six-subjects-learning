(function (global) {
  function mount() {
    const state = LKStore.get();
    const screen = LK.h('div', { class: 'screen settings-screen' });
    const back = LK.h('button', { class: 'icon-btn', 'aria-label': '返回' }, [LKIcons.closeIcon()]);
    back.addEventListener('click', function () {
      if (history.length > 1) history.back();
      else location.hash = '#/today';
    });
    screen.appendChild(LK.h('header', { class: 'lesson-top' }, [
      back,
      LK.h('div', { class: 'top-kicker', text: '设置' })
    ]));

    screen.appendChild(row('减少动效', switchBtn(state.settings.reduceMotion, function (on) {
      LKStore.setSetting('reduceMotion', on);
    })));
    function rateRow(label, key, values) {
      const rates = LK.h('div', { class: 'rate-row' });
      values.forEach(function (r) {
        const b = LK.h('button', { class: 'zoom-btn' + (state.settings[key] === r ? ' is-on' : ''), text: String(r) });
        b.addEventListener('click', function () {
          LKStore.setSetting(key, r);
          rates.querySelectorAll('.zoom-btn').forEach(function (n) { n.classList.toggle('is-on', n === b); });
        });
        rates.appendChild(b);
      });
      screen.appendChild(LK.h('section', { class: 'set-block' }, [
        LK.h('p', { class: 'set-label', text: label }),
        rates
      ]));
    }
    rateRow('英语慢速', 'ttsSlow', [0.6, 0.7, 0.8]);
    rateRow('英语常速', 'ttsNormal', [0.9, 1.0, 1.1]);
    const voiceBlock = LK.h('section', { class: 'set-block' });
    voiceBlock.appendChild(LK.h('p', { class: 'set-label', text: '英语声音' }));
    const voiceList = LK.h('div', { class: 'rate-row' });
    const voices = global.LKSpeech ? LKSpeech.englishVoices() : [];
    if (!voices.length) {
      voiceBlock.appendChild(LK.h('p', { class: 'sheet-copy', text: '这台设备还没有英语声音。课程可以照常学，只是听不到朗读。' }));
      voiceBlock.appendChild(LK.h('p', { class: 'sheet-copy', text: 'iPhone：设置 → 辅助功能 → 朗读内容 → 声音 → English。安卓：设置 → 文字转语音。' }));
    }
    voices.forEach(function (v) {
      const on = state.settings.ttsVoice === v.voiceURI || (!state.settings.ttsVoice && v.recommended);
      const b = LK.h('button', { class: 'zoom-btn' + (state.settings.ttsVoice === v.voiceURI ? ' is-on' : ''), text: v.name });
      b.addEventListener('click', function () {
        LKStore.setSetting('ttsVoice', v.voiceURI);
        if (global.LKSpeech) LKSpeech.say('Hi. I am ready.', { speed: 'normal' });
        voiceList.querySelectorAll('.zoom-btn').forEach(function (n) { n.classList.toggle('is-on', n === b); });
      });
      if (on && state.settings.ttsVoice) b.classList.add('is-on');
      voiceList.appendChild(b);
    });
    voiceBlock.appendChild(voiceList);
    screen.appendChild(voiceBlock);
    screen.appendChild(row('迷你模式默认开', switchBtn(state.settings.miniDefault, function (on) {
      LKStore.setSetting('miniDefault', on);
    })));
    screen.appendChild(LK.h('p', { class: 'sheet-copy', text: '经验值 ' + state.xp }));

    const reset = LK.h('button', { class: 'btn btn-secondary', text: '重置进度' });
    reset.addEventListener('click', function () {
      LKSheet.confirm({
        title: '清空全部进度？',
        body: '星星、图鉴和错题都会去掉。',
        ok: '清空',
        cancel: '再想想'
      }).then(function (yes) {
        if (!yes) return;
        LKStore.reset();
        location.hash = '#/today';
      });
    });
    screen.appendChild(reset);

    const ver = LK.h('p', { class: 'version', text: '六科学园 v2.0.0' });
    let timer = null;
    ver.addEventListener('pointerdown', function () {
      timer = setTimeout(function () {
        LKStore.setSetting('debug', true);
        debug.hidden = false;
      }, 2000);
    });
    ver.addEventListener('pointerup', function () { clearTimeout(timer); });
    ver.addEventListener('pointerleave', function () { clearTimeout(timer); });
    screen.appendChild(ver);

    const debug = LK.h('section', { class: 'debug-box' });
    debug.hidden = !state.settings.debug;
    debug.appendChild(LK.h('p', { class: 'set-label', text: '跳到第 N 天（测试用）' }));
    const input = LK.h('input', { type: 'number', min: '1', max: '14', value: String(state.currentDay), 'aria-label': '学习日' });
    const jump = LK.h('button', { class: 'btn btn-primary', text: '跳转' });
    jump.addEventListener('click', function () {
      LKStore.jumpDay(Number(input.value) || 1);
      location.hash = '#/today';
    });
    debug.appendChild(input);
    debug.appendChild(jump);
    const probe = LK.h('button', { class: 'btn btn-secondary', text: state.settings.ttsProbe === 'none' ? '恢复英语声音' : '假装没有语音' });
    probe.addEventListener('click', function () {
      const next = state.settings.ttsProbe === 'none' ? null : 'none';
      LKStore.setSetting('ttsProbe', next);
      if (global.LKSpeech && LKSpeech.rescan) LKSpeech.rescan();
      probe.textContent = next === 'none' ? '恢复英语声音' : '假装没有语音';
    });
    debug.appendChild(probe);
    screen.appendChild(debug);
    return screen;
  }

  function row(label, control) {
    return LK.h('div', { class: 'set-row' }, [LK.h('span', { text: label }), control]);
  }

  function switchBtn(on, fn) {
    const sw = LK.h('button', {
      class: 'switch' + (on ? ' is-on' : ''),
      role: 'switch',
      'aria-checked': on ? 'true' : 'false'
    });
    sw.appendChild(LK.h('i'));
    sw.addEventListener('click', function () {
      const next = !sw.classList.contains('is-on');
      sw.classList.toggle('is-on', next);
      sw.setAttribute('aria-checked', next ? 'true' : 'false');
      fn(next);
    });
    return sw;
  }

  global.LKSettings = { mount: mount };
})(window);
