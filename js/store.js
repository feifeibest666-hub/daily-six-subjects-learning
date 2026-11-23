(function (global) {
  const KEY = 'liuke.v2';
  const INTERVALS = [1, 3, 7, 21];
  let state = null;
  let streakBumped = false;
  let aheadAnim = false;

  function blank() {
    const today = LK.todayStr();
    return {
      version: 2,
      currentDay: 1,
      lastOpenDate: today,
      dayCompletedDate: {},
      clearedOn: {},
      lessons: {},
      mistakes: {},
      mastered: [],
      cards: [],
      pins: [],
      places: [],
      xp: 0,
      streak: { count: 0, lastDate: null, freezeLeft: 2, freezeMonth: today.slice(0, 7) },
      badges: [],
      settings: { reduceMotion: false, ttsSlow: 0.7, ttsNormal: 0.95, ttsVoice: null, ttsProbe: null, muteHintShown: false, miniDefault: false, debug: false, aheadNoteDate: null, peekHintShown: false },
      words: {},
      english: { retell: {} },
      contentVer: { english: 2, deck: 1 },
      miniOn: false,
      welcomeBack: false,
      notice: null,
      draft: null,
      seed: Math.floor(Math.random() * 1e9)
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) { state = blank(); return; }
      const parsed = JSON.parse(raw);
      const b = blank();
      state = Object.assign(b, parsed);
      state.streak = Object.assign(b.streak, parsed.streak || {});
      state.settings = Object.assign(b.settings, parsed.settings || {});
      state.lessons = parsed.lessons || {};
      state.mistakes = parsed.mistakes || {};
      state.mastered = parsed.mastered || [];
      state.cards = parsed.cards || [];
      state.pins = parsed.pins || [];
      state.places = parsed.places || [];
      state.badges = parsed.badges || [];
      state.dayCompletedDate = parsed.dayCompletedDate || {};
      state.clearedOn = parsed.clearedOn || {};
      if (!state.seed) state.seed = Math.floor(Math.random() * 1e9);
      migrateEnglish();
    } catch (e) {
      state = blank();
    }
  }

  function migrateEnglish() {
    const s = state.settings;
    if (s.ttsNormal == null) {
      const old = s.ttsRate;
      s.ttsNormal = old === 0.8 ? 0.9 : (old == null ? 0.95 : old);
    }
    if (s.ttsSlow == null) s.ttsSlow = 0.7;
    if (s.ttsVoice === undefined) s.ttsVoice = null;
    if (s.ttsProbe === undefined) s.ttsProbe = null;
    if (!s.muteHintShown) s.muteHintShown = false;
    delete s.ttsRate;
    if (!state.words) state.words = {};
    if (!state.english) state.english = { retell: {} };
    if (!state.english.retell) state.english.retell = {};
    if (!state.contentVer) state.contentVer = {};
    if ((state.contentVer.english || 0) < 2) {
      Object.keys(state.mistakes || {}).forEach(function (k) {
        if (/^d\d+-english#/.test(k)) delete state.mistakes[k];
      });
      state.mastered = (state.mastered || []).filter(function (k) { return !/^d\d+-english#/.test(k); });
      if (state.draft && /-english$/.test(state.draft.id || '')) state.draft = null;
      state.contentVer.english = 2;
    }
    if ((state.contentVer.deck || 0) < 1) state.contentVer.deck = 1;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function waitingForChest(today) {
    const key = String(state.currentDay);
    const cleared = state.clearedOn[key];
    const chest = state.dayCompletedDate[key];
    return !!(cleared && cleared < today && !chest);
  }

  function reconcile() {
    const today = LK.todayStr();
    const month = today.slice(0, 7);
    if (state.streak.freezeMonth !== month) {
      state.streak.freezeLeft = 2;
      state.streak.freezeMonth = month;
    }
    const key = String(state.currentDay);
    const chest = state.dayCompletedDate[key];
    if (chest && chest < today && state.currentDay < 14) state.currentDay += 1;
    const idle = waitingForChest(today);
    if (state.streak.lastDate && state.streak.lastDate < today && !idle) {
      const missed = LK.missedDayList(state.streak.lastDate, today);
      if (missed.length === 1 && state.streak.freezeLeft > 0) {
        state.streak.freezeLeft -= 1;
        state.streak.lastDate = missed[0];
        state.notice = 'freeze';
      } else if (missed.length >= 1) {
        state.streak.count = 0;
        state.streak.lastDate = null;
        state.welcomeBack = true;
      }
    }
    state.lastOpenDate = today;
  }

  function bumpStreak(today) {
    if (state.streak.lastDate === today) return;
    const prev = state.streak.lastDate;
    const before = state.streak.count;
    if (!prev) state.streak.count = 1;
    else if (LK.missedDayList(prev, today).length === 0) state.streak.count += 1;
    else state.streak.count = 1;
    state.streak.lastDate = today;
    if (state.streak.count > before) streakBumped = true;
  }

  function sixIds(day) {
    return global.SUBJECT_ORDER.map(function (s) { return LK.lessonId(day, s); });
  }

  function maybeClear(day) {
    const ids = sixIds(day);
    if (!ids.every(function (id) { return !!state.lessons[id]; })) return;
    const key = String(day);
    if (!state.clearedOn[key]) {
      state.clearedOn[key] = LK.todayStr();
      bumpStreak(state.clearedOn[key]);
    }
  }

  function init() {
    load();
    reconcile();
    save();
    return state;
  }

  function grade(key, ok, wrongOriginal) {
    if (!key) return;
    const today = LK.todayStr();
    if (!ok) {
      state.mistakes[key] = {
        due: state.currentDay + INTERVALS[0],
        stage: 0,
        wrongPick: wrongOriginal,
        lastSeen: today
      };
      state.mastered = state.mastered.filter(function (k) { return k !== key; });
    } else if (state.mistakes[key]) {
      const cur = state.mistakes[key];
      if (cur.lastSeen === today) {
        save();
        return;
      }
      const next = cur.stage + 1;
      if (next >= INTERVALS.length) {
        delete state.mistakes[key];
        if (state.mastered.indexOf(key) < 0) state.mastered.push(key);
      } else {
        state.mistakes[key] = {
          due: state.currentDay + INTERVALS[next],
          stage: next,
          wrongPick: cur.wrongPick,
          lastSeen: today
        };
      }
    }
    save();
  }

  function learnAhead() {
    if (state.currentDay >= 14) return state.currentDay;
    state.currentDay += 1;
    state.welcomeBack = false;
    state.draft = null;
    aheadAnim = true;
    save();
    return state.currentDay;
  }

  function completeLesson(p) {
    const prev = state.lessons[p.id];
    const first = !prev;
    if (first) {
      state.xp += 10 + p.stars * 5 + (p.bossPerfect ? 20 : 0);
      if (!p.isBoss && state.cards.indexOf(p.id) < 0) state.cards.push(p.id);
      (p.pinIds || []).forEach(function (id) {
        if (state.pins.indexOf(id) < 0) state.pins.push(id);
      });
      (p.placeIds || []).forEach(function (id) {
        if (state.places.indexOf(id) < 0) state.places.push(id);
      });
    }
    (p.badges || []).forEach(function (b) {
      if (p.bossPerfect && state.badges.indexOf(b) < 0) state.badges.push(b);
    });
    state.lessons[p.id] = {
      stars: p.stars,
      best: Math.max(prev ? (prev.best || 0) : 0, p.stars),
      doneAt: prev ? prev.doneAt : Date.now(),
      ms: p.ms,
      mini: !!p.mini,
      correct: p.correct,
      total: p.total
    };
    if (!p.isBoss) maybeClear(p.day);
    state.draft = null;
    state.welcomeBack = false;
    save();
    return { first: first };
  }

  function openChest(day) {
    const key = String(day);
    const first = !state.dayCompletedDate[key];
    if (first) {
      state.dayCompletedDate[key] = LK.todayStr();
      state.xp += 30;
    }
    save();
    return first;
  }

  function reset() {
    localStorage.removeItem(KEY);
    state = blank();
    reconcile();
    save();
  }

  global.LKStore = {
    init: init,
    get: function () { return state; },
    save: save,
    grade: grade,
    completeLesson: completeLesson,
    openChest: openChest,
    reset: reset,
    consumeNotice: function () {
      const n = state.notice;
      if (n) { state.notice = null; save(); }
      return n;
    },
    consumeStreakBump: function () {
      const b = streakBumped;
      streakBumped = false;
      return b;
    },
    setDraft: function (draft) { state.draft = draft; save(); },
    clearDraft: function () { state.draft = null; save(); },
    setMini: function (on) { state.miniOn = !!on; save(); },
    setSetting: function (k, v) {
      state.settings[k] = v;
      if (k === 'miniDefault') state.miniOn = !!v;
      save();
      if (global.LKMotion) LKMotion.syncRoot();
    },
    jumpDay: function (n) {
      n = Math.max(1, Math.min(14, n | 0));
      state.currentDay = n;
      state.welcomeBack = false;
      save();
    },
    learnAhead: learnAhead,
    consumeAheadAnim: function () {
      const v = aheadAnim;
      aheadAnim = false;
      return v;
    },
    clearWelcome: function () {
      if (!state.welcomeBack) return;
      state.welcomeBack = false;
      save();
    },
    INTERVALS: INTERVALS,
    learnWords: function (lessonId, words, day) {
      (words || []).forEach(function (w) {
        if (!w || !w.w || state.words[w.w]) return;
        state.words[w.w] = { from: lessonId, stage: 0, due: (day || 1) + 1, lastSeen: null, zh: w.zh || '', pic: w.pic || '' };
      });
      save();
    },
    dueWords: function (day) {
      const today = LK.todayStr();
      return Object.keys(state.words || {}).filter(function (k) {
        const w = state.words[k];
        return w.stage < 4 && w.due <= day && w.lastSeen !== today;
      }).map(function (k) { return Object.assign({ w: k }, state.words[k]); });
    },
    gradeWord: function (word, ok, day) {
      const w = state.words && state.words[word];
      if (!w) return;
      w.lastSeen = LK.todayStr();
      if (ok) {
        w.stage = Math.min(4, w.stage + 1);
        w.due = day + (INTERVALS[Math.max(0, w.stage - 1)] || 21);
      } else {
        w.stage = 0;
        w.due = day + 1;
      }
      save();
    },
    setRetell: function (id, n) {
      state.english.retell[id] = n;
      save();
    }
  };
})(window);
