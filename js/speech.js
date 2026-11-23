(function (global) {
  const BANNED = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
  const NICE = ['Samantha', 'Ava', 'Allison', 'Susan', 'Zoe', 'Nicky', 'Evan', 'Tom', 'Aaron', 'Daniel', 'Serena', 'Kate', 'Oliver', 'Arthur', 'Martha', 'Google US English', 'Google UK English Female', 'Microsoft Aria', 'Microsoft Jenny', 'Microsoft Guy', 'Microsoft Zira', 'Microsoft David'];
  const MALE = { Aaron: 1, Evan: 1, Tom: 1, Daniel: 1, Oliver: 1, Arthur: 1, 'Microsoft Guy': 1, 'Microsoft David': 1 };
  let status = 'try';
  let voices = [];
  let primary = null;
  let secondary = null;
  let current = null;
  let timers = [];
  let token = 0;
  const cache = {};

  function langOf(v) { return String(v.lang || '').toLowerCase().replace('_', '-'); }
  function score(v) {
    const lang = langOf(v);
    if (lang.indexOf('en') !== 0) return -1;
    if (BANNED.test(String(v.name || '').replace(/\s*\(.*$/, ''))) return -1;
    let s = lang === 'en-us' ? 40 : (lang === 'en-gb' ? 30 : 10);
    if (v.localService) s += 30;
    if (/premium|enhanced|natural/i.test((v.name || '') + (v.voiceURI || ''))) s += 15;
    if (NICE.some(function (n) { return (v.name || '').indexOf(n) >= 0; })) s += 10;
    return s;
  }
  function pick() {
    const list = voices.map(function (v, i) { return { v: v, s: score(v), i: i }; }).filter(function (x) { return x.s >= 0; });
    list.sort(function (a, b) { return b.s - a.s || a.i - b.i; });
    const settings = global.LKStore ? LKStore.get().settings : {};
    const chosen = settings.ttsVoice && voices.filter(function (v) { return v.voiceURI === settings.ttsVoice; })[0];
    primary = chosen || (list[0] && list[0].v) || null;
    secondary = null;
    list.forEach(function (x) {
      if (!primary || x.v === primary || secondary) return;
      const maleP = NICE.some(function (n) { return MALE[n] && (primary.name || '').indexOf(n) >= 0; });
      const maleX = NICE.some(function (n) { return MALE[n] && (x.v.name || '').indexOf(n) >= 0; });
      if (maleP !== maleX) secondary = x.v;
    });
    if (!secondary && list.length > 1) secondary = list.filter(function (x) { return x.v !== primary; })[0].v;
    if (settings.ttsProbe === 'none') status = 'none';
    else if (!primary) status = (typeof speechSynthesis === 'undefined') ? 'none' : 'try';
    else status = 'ready';
  }
  function loadVoices() {
    const settings = global.LKStore ? LKStore.get().settings : {};
    if (typeof speechSynthesis === 'undefined') { status = 'none'; return; }
    voices = speechSynthesis.getVoices() || [];
    if (voices.length) pick();
    else status = settings.ttsProbe === 'none' ? 'none' : 'try';
  }
  function init() {
    loadVoices();
    if (typeof speechSynthesis !== 'undefined') {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
      [0, 250, 1000, 2000].forEach(function (ms) { setTimeout(loadVoices, ms); });
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
    });
    return Promise.resolve({ status: status, voice: primary });
  }
  function clearTimers() {
    timers.forEach(function (id) { clearTimeout(id); });
    timers = [];
  }
  function tokens(text) {
    const out = [];
    const re = /[A-Za-z0-9]+(?:['’][A-Za-z]+)*/g;
    let m;
    const src = String(text || '');
    while ((m = re.exec(src))) out.push({ w: m[0], start: m.index, end: m.index + m[0].length });
    return out;
  }
  function syllables(word) {
    const groups = String(word || '').toLowerCase().replace(/e$/, '').match(/[aeiouy]+/g);
    return Math.max(1, groups ? groups.length : 1);
  }
  function voiceFor(who) {
    if (who === 'B' && secondary) return secondary;
    return primary;
  }
  function pitchFor(who) {
    if (secondary) return 1;
    if (who === 'A') return 1.12;
    if (who === 'B') return 0.86;
    return 1;
  }
  function say(text, opts) {
    opts = opts || {};
    const mine = ++token;
    stop(true);
    token = mine;
    const done = { stop: function () { if (token === mine) stop(); } };
    if (status === 'none' || typeof speechSynthesis === 'undefined' || !text) {
      if (opts.onError) opts.onError('none');
      if (opts.onEnd) opts.onEnd();
      return done;
    }
    loadVoices();
    const settings = global.LKStore ? LKStore.get().settings : {};
    const speed = opts.speed === 'slow' ? (settings.ttsSlow || 0.7) : (settings.ttsNormal || 0.95);
    const parts = [];
    const words = tokens(text);
    if (opts.speed === 'slow' && words.length > 6) {
      String(text).split(/([,.!?])/).reduce(function (buf, bit) {
        buf.push(bit);
        if (/[,.!?]/.test(bit)) { parts.push(buf.join('')); buf.length = 0; }
        return buf;
      }, []).forEach(function (p) { if (String(p).trim()) parts.push(p); });
      if (!parts.length) parts.push(text);
    } else parts.push(text);
    let offset = 0;
    function speakPart(i) {
      if (token !== mine) return;
      if (i >= parts.length) { if (opts.onEnd) opts.onEnd(); return; }
      const chunk = parts[i];
      const u = new SpeechSynthesisUtterance(chunk);
      const voice = voiceFor(opts.who || 'N');
      if (voice) { u.voice = voice; u.lang = voice.lang || 'en-US'; }
      else u.lang = 'en-US';
      u.rate = speed;
      u.pitch = pitchFor(opts.who || 'N');
      current = u;
      const local = tokens(chunk);
      const weights = local.map(function (t) { return syllables(t.w); });
      const sum = weights.reduce(function (a, b) { return a + b; }, 1);
      const key = speed + '|' + chunk;
      const guess = (cache[key] || (sum * 220 / speed));
      let sawBoundary = false;
      u.onboundary = function (e) {
        if (e.name && e.name !== 'word') return;
        sawBoundary = true;
        const at = offset + (e.charIndex || 0);
        const all = tokens(text);
        for (let k = 0; k < all.length; k++) {
          if (at >= all[k].start && at < all[k].end) { if (opts.onWord) opts.onWord(k); break; }
        }
      };
      u.onstart = function () {
        const id = setTimeout(function () {
          if (sawBoundary || token !== mine) return;
          let acc = 0;
          weights.forEach(function (w, idx) {
            const wait = guess * (acc / sum);
            acc += w;
            timers.push(setTimeout(function () {
              if (token !== mine) return;
              const all = tokens(text);
              const target = all.filter(function (t) { return t.start >= offset; })[idx];
              if (target && opts.onWord) opts.onWord(all.indexOf(target));
            }, wait));
          });
        }, 250);
        timers.push(id);
      };
      const t0 = performance.now();
      u.onend = function () {
        cache[key] = performance.now() - t0;
        offset += chunk.length;
        timers.push(setTimeout(function () { speakPart(i + 1); }, opts.speed === 'slow' ? 300 : 0));
      };
      u.onerror = function (e) {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        status = 'none';
        if (opts.onError) opts.onError(e.error);
        if (opts.onEnd) opts.onEnd();
      };
      try { speechSynthesis.speak(u); } catch (err) { status = 'none'; if (opts.onEnd) opts.onEnd(); }
    }
    speakPart(0);
    return done;
  }
  function sayLines(lines, opts) {
    opts = opts || {};
    let i = 0;
    let stopped = false;
    function next() {
      if (stopped) return;
      if (i >= lines.length) { if (opts.onEnd) opts.onEnd(); return; }
      const line = lines[i];
      const idx = i;
      if (opts.onLine) opts.onLine(idx);
      say(line.en, {
        speed: opts.speed || 'normal',
        who: line.who,
        onWord: function (w) { if (opts.onWord) opts.onWord(idx, w); },
        onEnd: function () {
          i += 1;
          setTimeout(next, opts.speed === 'slow' ? 600 : 350);
        }
      });
    }
    next();
    return { stop: function () { stopped = true; stop(); } };
  }
  function stop(keepToken) {
    clearTimers();
    current = null;
    if (!keepToken) token += 1;
    if (typeof speechSynthesis !== 'undefined') {
      try { speechSynthesis.cancel(); } catch (e) {}
    }
  }
  function englishVoices() {
    loadVoices();
    return voices.filter(function (v) { return score(v) >= 0; }).map(function (v) {
      return { name: v.name, lang: v.lang, voiceURI: v.voiceURI, localService: !!v.localService, recommended: NICE.some(function (n) { return (v.name || '').indexOf(n) >= 0; }) };
    });
  }
  global.LKSpeech = {
    init: init,
    status: function () { return status; },
    say: say,
    sayLines: sayLines,
    stop: function () { stop(false); },
    englishVoices: englishVoices,
    tokens: tokens,
    primaryName: function () { return primary ? primary.name : ''; },
    rescan: function () { loadVoices(); }
  };
})(window);
