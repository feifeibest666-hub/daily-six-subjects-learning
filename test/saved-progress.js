/* Seed a day-6 save from the live 7024e4f shape and load this branch.
   A content bump may drop a quiz key that no longer points at a question,
   and may rewind one replaced picture. It must not clear progress. */
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = path.resolve(__dirname, '..');

function boot(files, storage) {
  const sb = {
    window: {},
    console: console,
    localStorage: {
      getItem: function (k) { return Object.prototype.hasOwnProperty.call(storage, k) ? storage[k] : null; },
      setItem: function (k, v) { storage[k] = String(v); }
    }
  };
  sb.window = sb;
  sb.global = sb;
  files.forEach(function (file) {
    vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), sb, { filename: file });
  });
  return sb;
}

function todayOf(sb) {
  return sb.LK.todayStr();
}

function seed(today, contentVer) {
  const subjects = ['fashion', 'history', 'geo', 'finance', 'psych', 'english'];
  const lessons = {};
  for (let day = 1; day <= 5; day++) {
    subjects.forEach(function (sub, i) {
      lessons['d0' + day + '-' + sub] = { stars: (i % 3) + 1, best: (i % 3) + 1, doneAt: 1700000000000 + day, ms: 80000, correct: 2, total: 2 };
    });
  }
  lessons['d06-fashion'] = { stars: 2, best: 2, doneAt: 1700000001000, ms: 70000, correct: 2, total: 2 };
  lessons['d06-history'] = { stars: 3, best: 3, doneAt: 1700000002000, ms: 90000, correct: 2, total: 2 };
  const clearedOn = {};
  const dayCompletedDate = {};
  for (let day = 1; day <= 5; day++) {
    clearedOn[String(day)] = today;
    dayCompletedDate[String(day)] = today;
  }
  return {
    version: 2,
    currentDay: 6,
    lastOpenDate: today,
    dayCompletedDate: dayCompletedDate,
    clearedOn: clearedOn,
    lessons: lessons,
    mistakes: {
      'd01-english#0': { due: 8, stage: 1, wrongPick: 1, lastSeen: today },
      'd04-geo#1': { due: 7, stage: 0, wrongPick: 0, lastSeen: today },
      'd06-finance#0': { due: 7, stage: 0, wrongPick: 1, lastSeen: today }
    },
    mastered: ['d02-history#0', 'd03-english#1'],
    cards: ['d01-fashion', 'd02-history', 'd03-geo'],
    pins: ['pin-wuhan'],
    places: ['place-changjiang'],
    xp: 420,
    streak: { count: 5, lastDate: today, freezeLeft: 2, freezeMonth: today.slice(0, 7) },
    badges: ['week1'],
    settings: { reduceMotion: false, ttsSlow: 0.7, ttsNormal: 0.9, ttsVoice: 'xiaoman', ttsProbe: 'ok', muteHintShown: true, miniDefault: false, debug: false },
    words: { river: { stage: 2, due: 9, lastSeen: today } },
    english: { retell: { 'd02-english': 1 } },
    contentVer: contentVer,
    deckAt: { 'd04-geo#5': 3, 'd01-fashion#0': 1 },
    miniOn: false,
    welcomeBack: false,
    notice: null,
    draft: {
      id: 'd06-geo',
      phase: 'steps',
      step: 5,
      qi: 0,
      quizKeys: ['d06-geo#0', 'd06-geo#99'],
      wrongs: [],
      correct: 1,
      checks: { 0: true },
      spanRead: true
    },
    seed: 3331
  };
}

function assertSameProgress(before, after, label) {
  const problems = [];
  function eq(path, a, b) {
    if (JSON.stringify(a) !== JSON.stringify(b)) problems.push(label + ' ' + path + ' changed');
  }
  eq('currentDay', before.currentDay, after.currentDay);
  eq('xp', before.xp, after.xp);
  eq('streak', before.streak, after.streak);
  eq('lessons', before.lessons, after.lessons);
  eq('clearedOn', before.clearedOn, after.clearedOn);
  eq('dayCompletedDate', before.dayCompletedDate, after.dayCompletedDate);
  eq('badges', before.badges, after.badges);
  eq('cards', before.cards, after.cards);
  eq('pins', before.pins, after.pins);
  eq('places', before.places, after.places);
  eq('words', before.words, after.words);
  eq('english', before.english, after.english);
  Object.keys(before.settings).forEach(function (k) {
    eq('settings.' + k, before.settings[k], after.settings[k]);
  });
  eq('mistakes', before.mistakes, after.mistakes);
  eq('mastered', before.mastered, after.mastered);
  eq('draft.id', before.draft.id, after.draft.id);
  eq('draft.phase', before.draft.phase, after.draft.phase);
  eq('draft.step', before.draft.step, after.draft.step);
  eq('draft.checks', before.draft.checks, after.draft.checks);
  eq('draft.correct', before.draft.correct, after.draft.correct);
  eq('draft.spanRead', before.draft.spanRead, after.draft.spanRead);
  if (after.draft.quizKeys.indexOf('d06-geo#99') >= 0) problems.push(label + ' stale quiz key kept');
  if (after.draft.quizKeys.indexOf('d06-geo#0') < 0) problems.push(label + ' live quiz key dropped');
  if (after.deckAt['d04-geo#5'] !== 0) problems.push(label + ' replaced picture was not rewound');
  if (after.deckAt['d01-fashion#0'] !== 1) problems.push(label + ' untouched deck position changed');
  if (after.contentVer.english !== 2 || after.contentVer.deck !== 1) problems.push(label + ' contentVer ' + JSON.stringify(after.contentVer));
  if (!after.mistakes['d01-english#0']) problems.push(label + ' english mistake wiped');
  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
}

const files = ['data/subjects.js', 'data/days.js', 'js/util.js', 'js/catalog.js', 'js/store.js'];
const storage = {};
const probe = boot(files, storage);
const today = todayOf(probe);
const live = seed(today, { english: 2 });
storage['liuke.v2'] = JSON.stringify(live);
const fresh = boot(files, storage);
const after = fresh.LKStore.init();
assertSameProgress(live, after, 'new');
if (storage['liuke.v2'] == null) {
  console.error('save key missing');
  process.exit(1);
}

const oldSrc = fs.readFileSync('/tmp/old-liuke/js/store.js', 'utf8');
const oldStorage = { 'liuke.v2': storage['liuke.v2'] };
const oldSb = boot(['data/subjects.js', 'data/days.js', 'js/util.js'], oldStorage);
vm.runInNewContext(oldSrc, oldSb, { filename: 'store-7024e4f.js' });
const afterOld = oldSb.LKStore.init();
if (!afterOld.mistakes['d01-english#0']) {
  console.error('old app wiped the english mistake');
  process.exit(1);
}
if (afterOld.draft.step !== 5 || afterOld.currentDay !== 6 || afterOld.xp !== 420) {
  console.error('old app changed progress', afterOld.currentDay, afterOld.draft && afterOld.draft.step, afterOld.xp);
  process.exit(1);
}
if (!afterOld.contentVer.deck) {
  console.error('old app dropped the new contentVer field');
  process.exit(1);
}

const round = {};
round['liuke.v2'] = oldStorage['liuke.v2'];
const back = boot(files, round);
const again = back.LKStore.init();
assertSameProgress(live, again, 'roundtrip');

const bareStorage = {};
const bareBoot = boot(files, bareStorage);
const bareToday = todayOf(bareBoot);
bareStorage['liuke.v2'] = JSON.stringify(seed(bareToday, {}));
const bare = boot(files, bareStorage);
const bareAfter = bare.LKStore.init();
if (!bareAfter.mistakes['d01-english#0'] || bareAfter.mastered.indexOf('d03-english#1') < 0) {
  console.error('a missing english version wiped english progress');
  process.exit(1);
}
if (bareAfter.draft == null || bareAfter.draft.id !== 'd06-geo') {
  console.error('a missing english version cleared the geo draft');
  process.exit(1);
}

console.log('saved-progress ok', today);
