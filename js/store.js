(function (global) {
  const KEY = 'liuke.v2';
  const INTERVALS = [1, 3, 7, 21];
  let state = null;
  let streakBumped = false;
  let aheadAnim = false;
  let restartId = null;

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
      contentVer: { english: 2, deck: 1, history: 1 },
      deckAt: {},
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
      state.deckAt = parsed.deckAt || {};
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
    if (!state.deckAt) state.deckAt = {};
    // A content bump may drop a quiz key that no longer points at a real
    // question, or rewind one replaced picture to its first slide.
    // It must not delete days, stars, mistakes, the draft, or settings.
    dropStaleQuizRefs();
    if ((state.contentVer.english || 0) < 2) state.contentVer.english = 2;
    if ((state.contentVer.deck || 0) < 1) {
      rewindReplacedPictures();
      state.contentVer.deck = 1;
    }
    if ((state.contentVer.history || 0) < 1) {
      rewindRewrittenHistory();
      state.contentVer.history = 1;
    }
  }

  // History days 6 to 13 were rewritten as one storyline per lesson, so a
  // saved slide index on those cards may point at a different picture.
  function rewindRewrittenHistory() {
    Object.keys(state.deckAt || {}).forEach(function (id) {
      if (/^d(0[6-9]|1[0-3])-history#/.test(id)) state.deckAt[id] = 0;
    });
  }

  // Cards whose picture was replaced. A saved slide index on one of these
  // starts again at the first slide. Every other saved position stays.
  const REPLACED_PICTURES = {
    'd02-history#2': 1, 'd02-history#7': 1,
    'd03-geo#2': 1, 'd04-geo#2': 1, 'd04-geo#5': 1,
    'd04-history#1': 1, 'd04-history#2': 1, 'd04-history#3': 1, 'd04-history#4': 1, 'd04-history#7': 1,
    'd06-geo#5': 1, 'd06-geo#6': 1, 'd06-history#3': 1, 'd06-history#4': 1, 'd06-finance#2': 1, 'd06-psych#1': 1,
    'd08-geo#1': 1, 'd08-geo#7': 1, 'd08-history#3': 1, 'd08-history#6': 1, 'd08-finance#4': 1, 'd08-psych#3': 1,
    'd09-geo#6': 1, 'd09-geo#7': 1, 'd09-history#5': 1, 'd09-history#8': 1, 'd09-finance#3': 1, 'd09-finance#4': 1, 'd09-finance#5': 1,
    'd09-psych#4': 1, 'd09-fashion#4': 1
  };

  function rewindReplacedPictures() {
    Object.keys(state.deckAt || {}).forEach(function (id) {
      if (REPLACED_PICTURES[id]) state.deckAt[id] = 0;
    });
  }

  function lessonSteps(day, subject) {
    const d = (global.DAYS || []).find(function (x) { return x.day === day; });
    if (!d) return null;
    if (subject === 'boss') return d.boss ? (d.boss.parts || []) : null;
    if (d.type === 'new' && d.lessons && d.lessons[subject]) return d.lessons[subject].steps || [];
    return null;
  }

  function refStillFits(key, ref) {
    if (ref == null) return true;
    const m = /^d(\d+)-([a-z]+)#/.exec(key || '');
    if (!m) return true;
    const steps = lessonSteps(+m[1], m[2]);
    if (!steps) return true;
    const list = Array.isArray(ref) ? ref : [ref];
    for (let i = 0; i < list.length; i++) {
      const r = list[i];
      if (typeof r === 'number') {
        if (r < 0 || r >= steps.length) return false;
      } else if (r && typeof r === 'object' && r.lesson) {
        const bits = /^d(\d+)-([a-z]+)$/.exec(r.lesson);
        const host = bits ? lessonSteps(+bits[1], bits[2]) : null;
        if (!host) return false;
        const inner = Array.isArray(r.step) ? r.step : [r.step];
        for (let j = 0; j < inner.length; j++) {
          if (typeof inner[j] === 'number' && (inner[j] < 0 || inner[j] >= host.length)) return false;
        }
      }
    }
    return true;
  }

  function dropStaleQuizRefs() {
    const draft = state.draft;
    if (!draft || !draft.quizKeys || !global.LKCatalog || !LKCatalog.findQuestion) return;
    draft.quizKeys = draft.quizKeys.filter(function (key) {
      const q = LKCatalog.findQuestion(key);
      return !!(q && refStillFits(key, q.ref));
    });
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
    if (!state.draft || state.draft.id === p.id) state.draft = null;
    if (prev) {
      state.lessons[p.id].stars = Math.max(prev.stars || 0, p.stars);
      state.lessons[p.id].best = Math.max(prev.best || prev.stars || 0, p.stars);
    }
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
    // Asks the next mount of this lesson to start again from card 1. Nothing
    // saved changes here; the lesson writes its own fresh draft once it opens.
    requestRestart: function (id) { restartId = id; },
    takeRestart: function (id) {
      if (restartId !== id) return false;
      restartId = null;
      return true;
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
    // Moves the day pointer only. Stars, mistakes, mastered, the draft,
    // settings, and the streak stay exactly as they are.
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
    },
    noteDeck: function (id, i) {
      if (!state.deckAt) state.deckAt = {};
      state.deckAt[id] = i;
      save();
    },
    deckPos: function (id) {
      if (!state.deckAt || !Object.prototype.hasOwnProperty.call(state.deckAt, id)) return null;
      return state.deckAt[id];
    }
  };
})(window);
