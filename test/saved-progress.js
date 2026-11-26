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
    deckAt: { 'd04-geo#5': 3, 'd01-fashion#0': 1, 'd06-history#3': 4, 'd06-finance#0': 2 },
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
  if (after.deckAt['d06-history#3'] !== 0) problems.push(label + ' rewritten history slide was not rewound');
  if (after.contentVer.english !== 3 || after.contentVer.deck !== 1 || after.contentVer.history !== 1) problems.push(label + ' contentVer ' + JSON.stringify(after.contentVer));
  ['finance', 'psych', 'geo', 'fashion'].forEach(function (sub) {
    if (after.contentVer[sub] !== 1) problems.push(label + ' contentVer.' + sub);
  });
  if (after.deckAt['d06-finance#0'] !== 2) problems.push(label + ' day 6 finance slide was rewound');
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

const oldSrc = fs.readFileSync(path.join(__dirname, 'fixtures/store-7024e4f.js'), 'utf8');
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

// The live shape before the history rewrite: deck already bumped, a day-6
// history lesson half done with one quiz key that no longer exists.
const liveStorage = {};
const liveBoot = boot(files, liveStorage);
const liveSave = seed(todayOf(liveBoot), { english: 2, deck: 1 });
liveSave.deckAt['d04-geo#5'] = 3;
liveSave.draft = { id: 'd06-history', phase: 'quiz', step: 8, qi: 1, quizKeys: ['d06-history#0', 'd06-history#7'], wrongs: 0, correct: 1, checks: { 2: true }, spanRead: true };
liveStorage['liuke.v2'] = JSON.stringify(liveSave);
const liveAfter = boot(files, liveStorage).LKStore.init();
const histProblems = [];
['currentDay', 'xp', 'streak', 'lessons', 'clearedOn', 'dayCompletedDate', 'badges', 'cards', 'pins', 'places', 'words', 'english', 'mistakes', 'mastered', 'settings'].forEach(function (key) {
  if (JSON.stringify(liveSave[key]) !== JSON.stringify(liveAfter[key])) histProblems.push('history bump changed ' + key);
});
if (!liveAfter.draft || liveAfter.draft.id !== 'd06-history' || liveAfter.draft.step !== 8 || liveAfter.draft.correct !== 1) histProblems.push('history bump lost the day-6 draft');
if (JSON.stringify(liveAfter.draft && liveAfter.draft.quizKeys) !== JSON.stringify(['d06-history#0'])) histProblems.push('history quiz keys ' + JSON.stringify(liveAfter.draft && liveAfter.draft.quizKeys));
if (liveAfter.deckAt['d04-geo#5'] !== 3) histProblems.push('history bump rewound a geo picture');
if (liveAfter.deckAt['d06-history#3'] !== 0) histProblems.push('history bump kept an old history slide');
if (liveAfter.contentVer.history !== 1 || liveAfter.contentVer.deck !== 1) histProblems.push('contentVer ' + JSON.stringify(liveAfter.contentVer));
if (histProblems.length) {
  console.error(histProblems.join('\n'));
  process.exit(1);
}

const beforeJump = JSON.parse(JSON.stringify(back.LKStore.get()));
[4, 6, 2].forEach(function (n) { back.LKStore.jumpDay(n); });
const afterJump = back.LKStore.get();
function same(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
const jumpProblems = [];
if (afterJump.currentDay !== 2) jumpProblems.push('landed on day ' + afterJump.currentDay);
['lessons', 'mistakes', 'mastered', 'draft', 'settings', 'streak'].forEach(function (key) {
  if (!same(beforeJump[key], afterJump[key])) jumpProblems.push(key + ' changed while switching days');
});
function starLine(st, day) {
  return ['fashion', 'history', 'geo', 'finance', 'psych', 'english'].map(function (sub) {
    const id = 'd' + (day < 10 ? '0' : '') + day + '-' + sub;
    const rec = st.lessons[id];
    return rec ? (rec.best || rec.stars || 0) : 0;
  }).join(',');
}
[4, 6, 2].forEach(function (day) {
  if (starLine(beforeJump, day) !== starLine(afterJump, day)) jumpProblems.push('day ' + day + ' stars changed');
});
if (jumpProblems.length) {
  console.error(jumpProblems.join('\n'));
  process.exit(1);
}

const replayStore = {};
const replayBoot = boot(files, replayStore);
const replayToday = todayOf(replayBoot);
const replaySeed = seed(replayToday, { english: 2, deck: 1, history: 1 });
replaySeed.draft = { id: 'd06-geo', phase: 'steps', step: 4, qi: 0, quizKeys: ['d06-geo#0'], wrongs: 0, correct: 1, checks: { 1: true }, spanRead: true };
replayStore['liuke.v2'] = JSON.stringify(replaySeed);
const replay = boot(files, replayStore);
const replayBefore = JSON.parse(JSON.stringify(replay.LKStore.init()));
replay.LKStore.requestRestart('d06-history');
if (replay.LKStore.takeRestart('d06-fashion')) {
  console.error('restart flag answered for the wrong lesson');
  process.exit(1);
}
if (!replay.LKStore.takeRestart('d06-history')) {
  console.error('restart flag was not taken');
  process.exit(1);
}
if (replay.LKStore.takeRestart('d06-history')) {
  console.error('restart flag was taken twice');
  process.exit(1);
}
const replayMid = replay.LKStore.get();
['lessons', 'mistakes', 'mastered', 'draft', 'xp', 'streak', 'cards', 'badges'].forEach(function (key) {
  if (JSON.stringify(replayBefore[key]) !== JSON.stringify(replayMid[key])) {
    console.error('requesting a restart changed ' + key);
    process.exit(1);
  }
});
replay.LKStore.completeLesson({ id: 'd06-history', stars: 1, day: 6, ms: 10, correct: 1, total: 2, pinIds: [], placeIds: [], badges: [] });
const replayAfter = replay.LKStore.get();
if (!replayAfter.draft || replayAfter.draft.id !== 'd06-geo' || replayAfter.draft.step !== 4) {
  console.error('replaying history wiped the geo draft');
  process.exit(1);
}
if (replayAfter.lessons['d06-history'].stars !== 3 || replayAfter.lessons['d06-history'].best !== 3) {
  console.error('replaying lowered history stars', replayAfter.lessons['d06-history']);
  process.exit(1);
}
if (JSON.stringify(replayAfter.mistakes) !== JSON.stringify(replayBefore.mistakes) || JSON.stringify(replayAfter.mastered) !== JSON.stringify(replayBefore.mastered)) {
  console.error('replaying changed mistakes or mastered');
  process.exit(1);
}
replay.LKStore.setDraft({ id: 'd06-history', phase: 'quiz', step: 7, qi: 1 });
replay.LKStore.completeLesson({ id: 'd06-history', stars: 3, day: 6, ms: 10, correct: 2, total: 2, pinIds: [], placeIds: [], badges: [] });
if (replay.LKStore.get().draft) {
  console.error('finishing a lesson kept its own draft');
  process.exit(1);
}

console.log('saved-progress ok', today);
console.log('jump 4 → 6 → 2 kept stars', [4, 6, 2].map(function (day) {
  return day + ':' + starLine(afterJump, day);
}).join(' '));
