(function () {
  const KEY = 'liuke-xueyuan-v1';
  const MONTHS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const LEVELS = [
    [0, '好奇新手'],
    [80, '连胜新星'],
    [200, '六科学徒'],
    [360, '知识旅人'],
    [700, '融会行家'],
    [1400, '年度达人'],
    [2400, '六科导师'],
    [4000, '学园传说'],
    [6000, '全年毕业']
  ];

  const app = document.getElementById('app');
  const nav = document.getElementById('nav');
  let session = { day: null, picks: {} };
  const awardCache = {};

  function pad(n) { return String(n).padStart(2, '0'); }
  function todayStr(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function addDays(iso, n) {
    const p = iso.split('-').map(Number);
    const dt = new Date(p[0], p[1] - 1, p[2]);
    dt.setDate(dt.getDate() + n);
    return todayStr(dt);
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }
  function fresh() {
    return { xp: 0, streak: 0, lastActive: null, completed: {}, previewed: {}, ephemeral: false };
  }
  function load() {
    const base = fresh();
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!raw || typeof raw !== 'object') return base;
      base.xp = Number(raw.xp) || 0;
      base.streak = Number(raw.streak) || 0;
      base.lastActive = raw.lastActive || null;
      base.completed = raw.completed && typeof raw.completed === 'object' ? raw.completed : {};
      base.previewed = raw.previewed && typeof raw.previewed === 'object' ? raw.previewed : {};
    } catch (e) { /* 坏掉的存档就从零开始 */ }
    return base;
  }
  function save() {
    if (state.ephemeral) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({
        xp: state.xp,
        streak: state.streak,
        lastActive: state.lastActive,
        completed: state.completed,
        previewed: state.previewed
      }));
    } catch (e) { /* 隐私模式写不进去时，这一关仍可玩完 */ }
  }

  let state = load();
  const params = new URLSearchParams(location.search);
  if (params.get('demo') === 'mid') {
    state = fresh();
    state.ephemeral = true;
    const yesterday = addDays(todayStr(), -1);
    for (let d = 1; d <= 8; d++) {
      state.completed[String(d)] = { correct: 3, total: 3, xp: 55, at: yesterday };
      state.xp += 55;
    }
    state.streak = 4;
    state.lastActive = yesterday;
  }

  function levelOf(xp) {
    let i = 0;
    for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k][0]) i = k;
    const cur = LEVELS[i];
    const next = LEVELS[i + 1];
    const floor = cur[0];
    const ceil = next ? next[0] : floor + 1500;
    const pct = Math.max(0, Math.min(1, (xp - floor) / (ceil - floor)));
    return { index: i + 1, name: cur[1], nextName: next ? next[1] : '', floor, ceil, pct, atTop: !next };
  }
  function meta(day) {
    const info = dayInfo(day);
    if (!info.subject) {
      return { name: '挑战', emoji: '🏁', color: '#C9852A', soft: '#FFF6E4', tagline: '把六科放在一起用' };
    }
    return SUBJECTS[info.subject];
  }
  function doneCount() {
    return Object.keys(state.completed).length;
  }
  function fullCount() {
    return Object.keys(LESSONS).length;
  }
  function isUnlocked(day) {
    if (state.completed[String(day)]) return true;
    if (!LESSONS[day]) return true;
    for (let d = 1; d < day; d++) {
      if (LESSONS[d] && !state.completed[String(d)]) return false;
    }
    return true;
  }
  function nextPlayable() {
    const days = Object.keys(LESSONS).map(Number).sort((a, b) => a - b);
    for (const d of days) if (!state.completed[String(d)]) return d;
    return null;
  }
  function subjectStats() {
    const out = {};
    ORDER.forEach((k) => { out[k] = { done: 0, open: 0, year: 60 }; });
    for (let d = 1; d <= 360; d++) {
      const info = dayInfo(d);
      if (!out[info.subject]) continue;
      if (LESSONS[d]) out[info.subject].open += 1;
      if (state.completed[String(d)]) out[info.subject].done += 1;
    }
    return out;
  }
  function monthOf(day) {
    let left = day;
    for (let i = 0; i < 12; i++) {
      if (left <= MONTHS[i]) return { month: i + 1, index: left, start: day - left + 1 };
      left -= MONTHS[i];
    }
    return { month: 12, index: 31, start: 335 };
  }

  function selfCheck() {
    const errors = [];
    if (typeof dayInfo !== 'function') errors.push('缺少 dayInfo');
    for (let d = 1; d <= 365; d++) {
      const info = dayInfo(d);
      if (!info || !info.title) errors.push('第 ' + d + ' 天没有标题');
    }
    Object.keys(LESSONS).forEach((key) => {
      const d = Number(key);
      const L = LESSONS[d];
      if (!L.cards || L.cards.length !== 2) errors.push('第 ' + d + ' 关卡片不是 2 张');
      if (!L.quiz || L.quiz.length !== 3) errors.push('第 ' + d + ' 关题目不是 3 道');
      (L.cards || []).forEach((c) => {
        if (c.fig && !FIGURES[c.fig]) errors.push('第 ' + d + ' 关缺少图解 ' + c.fig);
      });
      (L.quiz || []).forEach((q, i) => {
        if (!q.options || q.options.length !== 3 || q.answer < 0 || q.answer > 2) {
          errors.push('第 ' + d + ' 关第 ' + (i + 1) + ' 题选项有问题');
        }
      });
    });
    if (dayInfo(1).subject !== 'psych') errors.push('第 1 天应为心理');
    if (dayInfo(5).subject !== 'english') errors.push('第 5 天应为英语');
    if (dayInfo(30).subject !== 'geo') errors.push('第 30 天应为地理');
    return errors;
  }

  function toast(msg) {
    const old = document.querySelector('.toast');
    if (old) old.remove();
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2400);
  }

  function streakLine() {
    const t = todayStr();
    const y = addDays(t, -1);
    if (state.lastActive === t) return '今天的连胜已经点亮。多学几关也不会再加一次。';
    if (state.lastActive === y) return '昨天也来过。今天再通关一关，连胜会变成 ' + (state.streak + 1) + ' 天。';
    if (!state.streak) return '通关任意一关，就点亮第一天。漏掉的日子只断连胜，关卡进度还在。';
    return '连胜中断了，进度还在。今天通关，就从 1 重新点亮。';
  }

  function paintSubject(day) {
    const m = meta(day);
    document.documentElement.style.setProperty('--subject', m.color);
    document.documentElement.style.setProperty('--soft', m.soft);
  }

  function render() {
    const route = parseRoute();
    document.body.className = 'screen-' + route.name;
    nav.hidden = false;
    document.querySelectorAll('.nav button').forEach((b) => {
      b.classList.toggle('on', b.dataset.route === route.name);
    });
    if (route.name === 'home') renderHome();
    else if (route.name === 'map') renderMap();
    else if (route.name === 'me') renderMe();
    else if (route.name === 'card' || route.name === 'quiz') renderLesson(route);
    else if (route.name === 'result') renderResult(route);
    else if (route.name === 'outline') renderOutline(route.day);
    else renderHome();
    const problems = selfCheck();
    if (problems.length) {
      app.insertAdjacentHTML('afterbegin', '<p class="warn">' + esc(problems.slice(0, 3).join('；')) + '</p>');
    }
  }

  function parseRoute() {
    const parts = (location.hash || '#/').replace(/^#/, '').split('/').filter(Boolean);
    if (!parts.length) return { name: 'home' };
    if (parts[0] === 'map') return { name: 'map' };
    if (parts[0] === 'me') return { name: 'me' };
    if (parts[0] === 'outline') return { name: 'outline', day: clampDay(parts[1]) };
    if (parts[0] === 'result') {
      return { name: 'result', day: clampDay(parts[1]), correct: clampScore(parts[2]) };
    }
    if (parts[0] === 'lesson') {
      const day = clampDay(parts[1]);
      if (!LESSONS[day]) return { name: 'outline', day };
      if (parts[2] === 'quiz') {
        let pick = null;
        if (parts[4] === 'pick' && parts[5] !== undefined) pick = Number(parts[5]);
        if (!Number.isInteger(pick) || pick < 0 || pick > 2) pick = null;
        return { name: 'quiz', day, qi: clamp(Number(parts[3]) || 0, 0, 2), pick };
      }
      const ci = parts[2] === 'card' ? Number(parts[3]) || 0 : 0;
      return { name: 'card', day, ci: clamp(ci, 0, 1) };
    }
    return { name: 'home' };
  }
  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
  function clampDay(v) {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 365) return 1;
    return n;
  }
  function clampScore(v) {
    const n = Number(v);
    if (!Number.isInteger(n) || n < 0) return 0;
    return Math.min(3, n);
  }

  function demoNote() {
    return state.ephemeral ? '<p class="demo-note">这是演示进度，只活在这一页里，不会写入你的存档。</p>' : '';
  }

  function renderHome() {
    document.title = '六科学园';
    const day = nextPlayable();
    const lv = levelOf(state.xp);
    const stats = subjectStats();
    let hero = '';
    if (!day) {
      hero = '<section class="hero"><h1>前 ' + fullCount() + ' 关都走完了</h1><p class="hook">后面每一天的问题已经列在地图上。图解补上以后，会从你停下的地方继续，不用重头来。</p><button class="btn" type="button" data-act="go" data-href="#/map">去地图看看全年</button></section>';
    } else {
      const info = dayInfo(day);
      const m = meta(day);
      const L = LESSONS[day];
      paintSubject(day);
      const locked = !isUnlocked(day);
      hero = '<section class="hero"><div class="watermark">' + m.emoji + '</div>'
        + '<span class="tag">' + m.emoji + ' ' + esc(m.name) + ' · 第 ' + day + ' 天</span>'
        + '<h1>' + esc(info.title) + '</h1>'
        + '<p class="hook">' + esc(L.hook) + '</p>'
        + '<div class="meta"><span class="chip">约 ' + (L.minutes || 6) + ' 分钟</span><span class="chip">2 张图解卡</span><span class="chip">3 道选择题</span></div>'
        + (locked
          ? '<button class="btn" type="button" disabled>先通关上一关</button>'
          : '<button class="btn subject" type="button" data-act="open" data-day="' + day + '">开始这 ' + (L.minutes || 6) + ' 分钟</button>')
        + '</section>';
    }
    const next = day && day < 365 ? dayInfo(day + 1) : null;
    const nextMeta = next ? meta(day + 1) : null;
    const rows = ORDER.map((k) => {
      const s = SUBJECTS[k];
      const st = stats[k];
      const pct = st.open ? Math.round(st.done / st.open * 100) : 0;
      return '<div class="subj"><span>' + s.emoji + '</span><div><div class="track" style="--c:' + s.color + '"><i style="width:' + pct + '%"></i></div></div><small>' + st.done + '/' + st.open + '</small></div>';
    }).join('');
    const remain = lv.atTop ? '这一档已经到顶。' : '再拿 ' + (lv.ceil - state.xp) + ' 分到「' + lv.nextName + '」。';
    app.innerHTML = demoNote()
      + '<div class="kicker"><div class="brand">六科<span>学园</span></div><div class="flame">🔥 ' + state.streak + '</div></div>'
      + '<p class="subline">一天一关，大约六分钟。做完就有反馈。</p>'
      + '<section class="level"><div class="row"><b>' + esc(lv.name) + '</b><em>Lv.' + lv.index + ' · ' + state.xp + ' 分</em></div>'
      + '<div class="bar"><i style="width:' + Math.round(lv.pct * 100) + '%"></i></div>'
      + '<p class="hint">' + esc(remain) + ' ' + esc(streakLine()) + '</p></section>'
      + hero
      + '<h2 class="section-title">六科都在长</h2><p class="hint">右边的数字是已学 / 目前写好的关卡。全年每科共 60 关。</p><div class="subjects">' + rows + '</div>'
      + (next ? '<p class="next-preview">下一关 · ' + nextMeta.emoji + ' <b>' + esc(nextMeta.name) + '</b> · ' + esc(next.title) + '</p>' : '');
  }

  function renderMap() {
    document.title = '进度地图 · 六科学园';
    const current = nextPlayable();
    let html = demoNote() + '<div class="map-head"><h1>一年的路</h1><p class="subline">这是学习年，不跟日历绑定。断了从下一关接着走。已通关 ' + doneCount() + ' / ' + fullCount() + ' 关可玩内容。</p></div>'
      + '<div class="legend"><span><i style="background:#8B5CF6"></i>已通关</span><span><i style="background:#fff;box-shadow:0 0 0 2px #c9852a"></i>今天</span><span><i style="border:1px dashed #7a6a5c;background:transparent"></i>大纲</span></div>';
    let day = 1;
    for (let m = 0; m < 12; m++) {
      const start = day;
      const stage = stageOf(start);
      html += '<section class="month"><h2>' + (m + 1) + ' 月 · ' + esc(stage.name) + '</h2><div class="grid6">';
      for (let i = 0; i < MONTHS[m]; i++, day++) {
        const info = dayInfo(day);
        const sub = meta(day);
        const opened = !!LESSONS[day];
        const learned = !!state.completed[String(day)];
        const now = day === current;
        const locked = opened && !learned && !isUnlocked(day);
        const cls = ['pill', learned ? 'done' : '', now ? 'now' : '', !opened ? 'outline' : '', locked ? 'lock' : '', info.subject ? '' : 'finale'].filter(Boolean).join(' ');
        html += '<button type="button" class="' + cls + '" style="--c:' + sub.color + '" data-act="open" data-day="' + day + '" aria-label="第' + day + '天 ' + esc(info.title) + '"><span class="em">' + sub.emoji + '</span><span class="n">' + day + '</span></button>';
      }
      html += '</div></section>';
    }
    app.innerHTML = html;
    const nowEl = app.querySelector('.pill.now');
    if (nowEl) nowEl.scrollIntoView({ block: 'center' });
  }

  function renderMe() {
    document.title = '我的 · 六科学园';
    const lv = levelOf(state.xp);
    const stats = subjectStats();
    const perfect = Object.values(state.completed).filter((x) => x.correct === x.total).length;
    const rows = ORDER.map((k) => {
      const s = SUBJECTS[k];
      const st = stats[k];
      const pct = st.open ? Math.round(st.done / st.open * 100) : 0;
      return '<div class="subj"><span>' + s.emoji + '</span><div><b style="font-weight:700">' + s.name + '</b><div class="track" style="--c:' + s.color + ';margin-top:6px"><i style="width:' + pct + '%"></i></div></div><small>' + st.done + '/' + st.open + '</small></div>';
    }).join('');
    const previewN = Object.keys(state.previewed).length;
    app.innerHTML = demoNote()
      + '<div class="me"><h1>' + esc(lv.name) + '</h1><p class="subline">Lv.' + lv.index + ' · 积分只在第一次通关时发放。复习不加分，进度也不会丢。</p></div>'
      + '<div class="stats"><div class="stat"><b>' + state.xp + '</b><span>积分</span></div><div class="stat"><b>' + state.streak + '</b><span>连胜天数</span></div><div class="stat"><b>' + doneCount() + '</b><span>已通关</span></div><div class="stat"><b>' + perfect + '</b><span>满分关卡</span></div></div>'
      + '<h2 class="section-title">分科</h2><div class="subjects">' + rows + '</div>'
      + '<p class="hint">问题清单里有 ' + previewN + ' 个预习过的大纲问题。全年每科 60 关，现在先开放了前 30 天。</p>'
      + (state.ephemeral
        ? '<button class="btn light danger" type="button" data-act="exit-demo">退出演示</button>'
        : '<button class="btn light danger" type="button" data-act="reset-ask">清空这台设备上的进度</button>');
  }

  function renderLesson(route) {
    const day = route.day;
    if (!isUnlocked(day)) {
      app.innerHTML = '<div class="card"><h2>这关还锁着</h2><p>先把前面的关卡通关。进度按顺序走，漏掉的日子不影响你从下一关继续。</p><button class="btn" type="button" data-act="go" data-href="#/">回今天</button></div>';
      return;
    }
    paintSubject(day);
    const info = dayInfo(day);
    const m = meta(day);
    const L = LESSONS[day];
    const step = route.name === 'card' ? route.ci : 2 + route.qi;
    document.title = info.title + ' · 六科学园';
    const dots = [0, 1, 2, 3, 4].map((i) => '<i class="' + (i <= step ? 'on' : '') + '"></i>').join('');
    const head = '<div class="topbar"><button class="back" type="button" data-act="go" data-href="#/" aria-label="返回">←</button><div class="dots">' + dots + '</div><span class="stepcount">' + (step + 1) + '/5</span></div>';
    if (route.name === 'card') {
      const card = L.cards[route.ci];
      const fig = card.fig && FIGURES[card.fig]
        ? '<div class="fig" aria-hidden="true">' + FIGURES[card.fig] + '</div><p class="cap">' + esc(card.cap || '') + '</p>'
        : '';
      const take = route.ci === 1 ? '<div class="take"><b>带走这一句</b>' + esc(L.take) + '</div>' : '';
      const nextHref = route.ci === 0 ? '#/lesson/' + day + '/card/1' : '#/lesson/' + day + '/quiz/0';
      const label = route.ci === 0 ? '下一张' : '去做 3 道题';
      app.innerHTML = head + '<article class="card"><span class="tag">' + m.emoji + ' ' + esc(m.name) + ' · ' + esc(info.unit) + '</span><h2>' + esc(card.t) + '</h2>' + fig + '<p>' + esc(card.body) + '</p>' + take
        + '<button class="btn subject" type="button" data-act="go" data-href="' + nextHref + '">' + label + '</button></article>';
      return;
    }
    const q = L.quiz[route.qi];
    const locked = route.pick !== null;
    const right = locked && route.pick === q.answer;
    if (locked) {
      if (!session || session.day !== day) session = { day, picks: {} };
      session.picks[route.qi] = route.pick;
    }
    const options = q.options.map((opt, i) => {
      let cls = 'opt';
      if (locked && i === q.answer) cls += ' good';
      else if (locked && i === route.pick) cls += ' bad';
      return '<button type="button" class="' + cls + '" ' + (locked ? 'disabled' : '') + ' data-act="pick" data-day="' + day + '" data-qi="' + route.qi + '" data-choice="' + i + '">' + esc(opt) + '</button>';
    }).join('');
    const why = locked
      ? '<div class="why ' + (right ? '' : 'bad') + '"><b>' + (right ? '对了。' : '这题先记下。') + '</b> ' + esc(q.why) + '</div>'
        + '<button class="btn subject" type="button" data-act="next" data-day="' + day + '" data-qi="' + route.qi + '">' + (route.qi === 2 ? '看成绩' : '下一题') + '</button>'
      : '';
    app.innerHTML = head + '<article class="card"><p class="quiz-head">第 ' + (route.qi + 1) + ' / 3 题 · 点下去就会告诉你为什么</p><h2 class="q">' + esc(q.q) + '</h2>' + options + why + '</article>';
  }

  function scoreSession(day) {
    const L = LESSONS[day];
    if (!L || !session || session.day !== day) return null;
    let n = 0;
    L.quiz.forEach((q, i) => { if (session.picks[i] === q.answer) n += 1; });
    return n;
  }

  function markComplete(day, correct) {
    const key = String(day);
    const total = 3;
    const first = !state.completed[key];
    const gained = first ? 10 + 15 * correct : 0;
    if (first) {
      state.xp += gained;
      state.completed[key] = { correct, total, xp: gained, at: todayStr() };
      const t = todayStr();
      if (state.lastActive !== t) {
        state.streak = state.lastActive === addDays(t, -1) ? state.streak + 1 : 1;
        state.lastActive = t;
      }
    } else if (correct > state.completed[key].correct) {
      state.completed[key].correct = correct;
    }
    save();
    return { gained, first, streak: state.streak };
  }

  function renderResult(route) {
    const day = route.day;
    const L = LESSONS[day];
    if (!L) { location.hash = '#/outline/' + day; return; }
    paintSubject(day);
    const fromSession = scoreSession(day);
    const correct = fromSession == null ? route.correct : fromSession;
    const cacheKey = day + '@' + correct;
    if (!awardCache[cacheKey]) awardCache[cacheKey] = markComplete(day, correct);
    const award = awardCache[cacheKey];
    const info = dayInfo(day);
    document.title = '成绩 · ' + info.title;
    const lines = [
      ['今天先把原因看懂，也算数。完成本身就有分。'],
      ['有一道对上了。剩下的原因比分数重要。'],
      ['两题抓住了。错的那题，原因比再猜一次有用。'],
      ['三题全对。这个概念你可以拿去用了。']
    ];
    const line = lines[correct][0];
    let review = '';
    if (session && session.day === day) {
      review = '<ul class="review">' + L.quiz.map((q, i) => {
        const pick = session.picks[i];
        const ok = pick === q.answer;
        return '<li class="' + (ok ? 'ok' : 'no') + '">' + (ok ? '对' : '再看') + ' · ' + esc(q.why) + '</li>';
      }).join('') + '</ul>';
    }
    const earned = state.completed[String(day)];
    const xpLine = award.gained > 0
      ? '<b>+' + award.gained + '</b><span>本关积分</span>'
      : '<b>' + (earned && earned.xp ? earned.xp : 0) + '</b><span>这关已得过</span>';
    app.innerHTML = '<article class="card score">'
      + (correct === 3 ? '<div class="stamp">满分</div>' : '')
      + '<div class="big">' + correct + '</div><p class="of">答对，共 3 题</p>'
      + '<p>' + esc(line) + '</p>'
      + '<div class="rewards"><div>' + xpLine + '</div><div><b>' + state.streak + '</b><span>连胜</span></div></div>'
      + review
      + '<button class="btn subject" type="button" data-act="go" data-href="#/">回到今天</button>'
      + '<button class="btn light" type="button" data-act="replay" data-day="' + day + '">再看一遍这关</button>'
      + '<p class="hint">内容改编自《六科深入图解》学习 3 到 6。标明教学设定的数字，是用来把关系算清楚的例子。</p>'
      + '</article>';
  }

  function renderOutline(day) {
    const info = dayInfo(day);
    const m = meta(day);
    paintSubject(day);
    document.title = info.title + ' · 大纲';
    const seen = !!state.previewed[String(day)];
    app.innerHTML = '<div class="topbar"><button class="back" type="button" data-act="go" data-href="#/map" aria-label="返回地图">←</button><span class="stepcount">' + m.emoji + ' ' + esc(m.name) + '</span></div>'
      + '<article class="card"><span class="tag">大纲 · 第 ' + day + ' 天</span><h2>' + esc(info.title) + '</h2>'
      + '<p>这一关在「' + esc(info.unit) + '」里。完整的图解和题目还没排进来，全年的位置已经留好了。</p>'
      + '<div class="take"><b>今天先记住这个问题</b>' + esc(info.title) + '</div>'
      + (seen
        ? '<button class="btn light" type="button" disabled>已在问题清单里</button>'
        : '<button class="btn subject" type="button" data-act="preview" data-day="' + day + '">先记下这个问题</button>')
      + '<p class="hint">记下来不加分，也不算通关。以后这格变成可玩关卡时，从这里接着走。</p></article>';
  }

  document.body.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (!b) return;
    const act = b.dataset.act;
    if (act === 'go') location.hash = b.dataset.href || '#/';
    else if (act === 'open') openDay(Number(b.dataset.day));
    else if (act === 'pick') {
      const day = Number(b.dataset.day);
      const qi = Number(b.dataset.qi);
      const choice = Number(b.dataset.choice);
      if (!session || session.day !== day) session = { day, picks: {} };
      session.picks[qi] = choice;
      location.hash = '#/lesson/' + day + '/quiz/' + qi + '/pick/' + choice;
    } else if (act === 'next') {
      const day = Number(b.dataset.day);
      const qi = Number(b.dataset.qi);
      if (qi >= 2) {
        const n = scoreSession(day);
        location.hash = '#/result/' + day + '/' + (n == null ? 0 : n);
      } else location.hash = '#/lesson/' + day + '/quiz/' + (qi + 1);
    } else if (act === 'replay') {
      const day = Number(b.dataset.day);
      session = { day, picks: {} };
      Object.keys(awardCache).forEach((k) => { if (k.indexOf(day + '@') === 0) delete awardCache[k]; });
      location.hash = '#/lesson/' + day;
    } else if (act === 'preview') {
      state.previewed[String(b.dataset.day)] = true;
      save();
      toast('已放进问题清单');
      render();
    } else if (act === 'reset-ask') {
      app.insertAdjacentHTML('beforeend', '<div class="card" style="margin-top:12px"><p>清空后，积分、连胜和通关记录都会从这台设备消失。</p><button class="btn" type="button" data-act="reset-yes">确认清空</button><button class="btn light" type="button" data-act="go" data-href="#/me">先留着</button></div>');
    } else if (act === 'reset-yes') {
      try { localStorage.removeItem(KEY); } catch (err) {}
      state = fresh();
      session = { day: null, picks: {} };
      location.hash = '#/';
      render();
    } else if (act === 'exit-demo') {
      location.href = location.pathname;
    }
  });

  function openDay(day) {
    if (LESSONS[day]) {
      if (!isUnlocked(day)) { toast('先把上一关走完，这关就会打开'); return; }
      session = { day, picks: {} };
      location.hash = '#/lesson/' + day;
    } else location.hash = '#/outline/' + day;
  }

  window.addEventListener('hashchange', render);
  window.__liuke = { KEY, levelOf, selfCheck, nextPlayable, isUnlocked };
  render();
})();
