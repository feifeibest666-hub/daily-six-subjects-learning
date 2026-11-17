(function (global) {
  function dayObj(n) {
    return (global.DAYS || []).find(function (d) { return d.day === n; }) || null;
  }

  function rawLesson(day, subject) {
    const d = dayObj(day);
    if (!d || d.type !== 'new' || !d.lessons) return null;
    return d.lessons[subject] || null;
  }

  function buildReview(day, subject) {
    const week = day === 7 ? [1, 2, 3, 4, 5, 6] : [8, 9, 10, 11, 12, 13];
    const takes = [];
    week.forEach(function (n) {
      const les = rawLesson(n, subject);
      if (les) takes.push(les.take);
    });
    const sub = SUBJECTS[subject];
    return {
      id: LK.lessonId(day, subject),
      title: sub.name + '回炉',
      minutes: 3,
      review: true,
      day: day,
      subject: subject,
      week: week,
      takes: takes,
      hook: '先把本周带走的 6 句话看一遍，再做 3 道题。',
      take: '本周' + sub.name + '，把这 6 句再带走一次。'
    };
  }

  function lesson(day, subject) {
    const d = dayObj(day);
    if (!d) return null;
    if (subject === 'boss') {
      if (!d.boss) return null;
      return {
        id: LK.lessonId(day, 'boss'),
        title: d.boss.title,
        minutes: 4,
        boss: true,
        day: day,
        subject: 'boss',
        intro: d.boss.intro,
        parts: d.boss.parts
      };
    }
    if (d.type === 'review') return buildReview(day, subject);
    const les = rawLesson(day, subject);
    if (!les) return null;
    return Object.assign({ day: day, subject: subject }, les);
  }

  function findQuestion(key) {
    const m = /^d(\d+)-([a-z]+)#(\d+)$/.exec(key || '');
    if (!m) return null;
    const day = +m[1];
    const subject = m[2];
    const idx = +m[3];
    const d = dayObj(day);
    let q = null;
    if (subject === 'boss' && d && d.boss) q = d.boss.parts[idx];
    else if (d && d.type === 'new' && d.lessons[subject]) q = d.lessons[subject].quiz[idx];
    if (!q) return null;
    return {
      key: key,
      q: q.q,
      options: q.options.slice(),
      answer: q.answer,
      why: q.why
    };
  }

  function present(q, salt) {
    const map = LK.shuffleIdx(q.options.length, (q.key || q.q) + '|' + salt);
    return {
      key: q.key,
      q: q.q,
      why: q.why,
      review: !!q.review,
      options: map.map(function (i) { return q.options[i]; }),
      answer: map.indexOf(q.answer),
      indexMap: map
    };
  }

  function questionPool(subject, days) {
    const pool = [];
    days.forEach(function (n) {
      const les = rawLesson(n, subject);
      if (!les) return;
      les.quiz.forEach(function (q, i) {
        pool.push({
          key: les.id + '#' + i,
          q: q.q,
          options: q.options.slice(),
          answer: q.answer,
          why: q.why,
          review: true
        });
      });
    });
    return pool;
  }

  function pickReviewSet(subject, day) {
    const state = LKStore.get();
    const days = day === 7 ? [1, 2, 3, 4, 5, 6] : [8, 9, 10, 11, 12, 13];
    const pool = questionPool(subject, days);
    if (day === 14) {
      Object.keys(state.mistakes).forEach(function (key) {
        if (key.indexOf('-' + subject + '#') < 0) return;
        const dayNum = +key.slice(1, 3);
        if (dayNum < 1 || dayNum > 6) return;
        if (pool.some(function (p) { return p.key === key; })) return;
        const q = findQuestion(key);
        if (q) pool.push(Object.assign({ review: true }, q));
      });
    }
    const missed = pool.filter(function (p) { return !!state.mistakes[p.key]; });
    missed.sort(function (a, b) { return state.mistakes[a.key].due - state.mistakes[b.key].due; });
    const rest = pool.filter(function (p) { return !state.mistakes[p.key]; });
    rest.sort(function (a, b) {
      return LK.hashStr(a.key + '|rev|' + day) - LK.hashStr(b.key + '|rev|' + day);
    });
    return missed.concat(rest).slice(0, 3);
  }

  function pickOneReview(subject, day, lessonKey) {
    if (day <= 1) return null;
    const state = LKStore.get();
    const due = Object.keys(state.mistakes).filter(function (k) {
      return k.indexOf('-' + subject + '#') >= 0 && state.mistakes[k].due <= day;
    }).sort(function (a, b) {
      return state.mistakes[a].due - state.mistakes[b].due || (a < b ? -1 : 1);
    });
    if (due.length) {
      const q = findQuestion(due[0]);
      if (q) return Object.assign({ review: true }, q);
    }
    const pool = [];
    for (let d = 1; d < day; d++) {
      if (d === 7 || d === 14) continue;
      const id = LK.lessonId(d, subject);
      if (!state.lessons[id]) continue;
      const les = rawLesson(d, subject);
      if (!les) continue;
      les.quiz.forEach(function (q, i) {
        pool.push({
          key: id + '#' + i,
          q: q.q,
          options: q.options.slice(),
          answer: q.answer,
          why: q.why,
          review: true
        });
      });
    }
    if (!pool.length) return null;
    const idx = LK.hashStr(lessonKey + '|' + state.seed) % pool.length;
    return pool[idx];
  }

  function buildQuiz(les, mini) {
    const salt = LKStore.get().seed;
    if (les.boss) {
      return les.parts.map(function (q, i) {
        return present({
          key: les.id + '#' + i,
          q: q.q,
          options: q.options,
          answer: q.answer,
          why: q.why
        }, salt);
      });
    }
    if (les.review) {
      let set = pickReviewSet(les.subject, les.day);
      if (mini) set = set.slice(0, 1);
      return set.map(function (q) { return present(q, salt); });
    }
    const base = les.quiz.map(function (q, i) {
      return {
        key: les.id + '#' + i,
        q: q.q,
        options: q.options.slice(),
        answer: q.answer,
        why: q.why
      };
    });
    let list = mini ? base.slice(0, 1) : base.slice();
    if (!mini && les.day > 1) {
      const extra = pickOneReview(les.subject, les.day, les.id);
      if (extra) list.push(extra);
    }
    return list.map(function (q) { return present(q, salt); });
  }

  function starsFor(wrongs) {
    if (wrongs <= 0) return 3;
    if (wrongs === 1) return 2;
    return 1;
  }

  function sixDone(day) {
    const st = LKStore.get();
    return SUBJECT_ORDER.every(function (s) { return !!st.lessons[LK.lessonId(day, s)]; });
  }

  function doneCount(day) {
    const st = LKStore.get();
    return SUBJECT_ORDER.filter(function (s) { return !!st.lessons[LK.lessonId(day, s)]; }).length;
  }

  function nextOpen(day, current) {
    const st = LKStore.get();
    const start = current === 'boss' ? -1 : SUBJECT_ORDER.indexOf(current);
    for (let step = 1; step <= SUBJECT_ORDER.length; step++) {
      const s = SUBJECT_ORDER[(start + step) % SUBJECT_ORDER.length];
      if (!st.lessons[LK.lessonId(day, s)]) return s;
    }
    return null;
  }

  function weekNo(day) { return day <= 7 ? 1 : 2; }

  function seasonLabel(day) {
    return '第 ' + day + ' 天 · 第 1 季 第 ' + weekNo(day) + ' 周';
  }

  function bubble(state) {
    const day = state.currentDay;
    const d = dayObj(day);
    if (state.welcomeBack) return '欢迎回来，从第 ' + day + ' 天接着来，没有欠账。';
    const n = doneCount(day);
    const chest = !!state.dayCompletedDate[String(day)];
    if (n === 0) {
      if (d && d.type === 'review') return '今天是周复盘。先从时尚回炉热个身？';
      if (state.miniOn) return '迷你模式 6 关，约 8 分钟。先从时尚热个身？';
      return '今天 6 关，约 30 分钟。先从时尚热个身？';
    }
    if (n <= 2) {
      const next = SUBJECT_ORDER.find(function (s) { return !state.lessons[LK.lessonId(day, s)]; });
      return '不错！下一关推荐：' + SUBJECTS[next].name + '。';
    }
    if (n <= 5) return '过半啦，还剩 ' + (6 - n) + ' 关。';
    if (!chest) return '六连达成！宝箱在等你。';
    return '今天收工。明天见～';
  }

  function provinceById(id) {
    return PROVINCES.find(function (p) { return p.id === id; }) || null;
  }

  function terrainLevel(id) {
    if (MAP_META.level1.indexOf(id) >= 0) return 1;
    if (MAP_META.level2.indexOf(id) >= 0) return 2;
    return 3;
  }

  function placeId(p) { return p.layer + ':' + p.id; }

  function learnedProvince(id) {
    const places = LKStore.get().places;
    return places.some(function (k) { return k.split(':')[1] === id && k.indexOf('river:') !== 0; })
      || places.indexOf('province:' + id) >= 0
      || places.indexOf('terrain:' + id) >= 0;
  }

  function knowledgeFor(provId) {
    const lines = [];
    const st = LKStore.get();
    (DAYS || []).forEach(function (d) {
      if (d.type !== 'new') return;
      SUBJECT_ORDER.forEach(function (s) {
        const les = d.lessons[s];
        if (!les || !les.places) return;
        if (!les.places.some(function (p) { return p.id === provId; })) return;
        if (!st.lessons[les.id]) return;
        lines.push({ subject: s, day: d.day, text: les.take });
      });
    });
    return lines;
  }

  function dynastyLearned(name) {
    const pins = LKStore.get().pins;
    for (let i = 0; i < DAYS.length; i++) {
      const d = DAYS[i];
      if (d.type !== 'new') continue;
      const les = d.lessons.history;
      if (!les || !les.pins) continue;
      for (let k = 0; k < les.pins.length; k++) {
        const pin = les.pins[k];
        if (pin.kind === 'dynasty' && pin.label === name && pins.indexOf(les.id + '#' + k) >= 0) return les;
      }
    }
    return null;
  }

  function pinLesson(pinId) {
    const id = pinId.split('#')[0];
    const m = /^d(\d+)-([a-z]+)$/.exec(id);
    if (!m) return null;
    return lesson(+m[1], m[2]);
  }

  global.LKCatalog = {
    dayObj: dayObj,
    rawLesson: rawLesson,
    lesson: lesson,
    findQuestion: findQuestion,
    present: present,
    buildQuiz: buildQuiz,
    starsFor: starsFor,
    sixDone: sixDone,
    doneCount: doneCount,
    nextOpen: nextOpen,
    weekNo: weekNo,
    seasonLabel: seasonLabel,
    bubble: bubble,
    provinceById: provinceById,
    terrainLevel: terrainLevel,
    placeId: placeId,
    learnedProvince: learnedProvince,
    knowledgeFor: knowledgeFor,
    dynastyLearned: dynastyLearned,
    pinLesson: pinLesson
  };
})(window);
