(function (global) {
  function finishOnce(ctx) {
    let done = false;
    return function () {
      if (done) return;
      done = true;
      ctx.onDone();
    };
  }

  function fmtFactor(n) {
    const r = Math.round(n * 10000) / 10000;
    return String(r);
  }

  function powSeq(factor, times, op) {
    const n = Math.max(0, Math.round(times));
    if (n <= 0) return '1';
    if (n <= 6) {
      const bits = [];
      for (let i = 0; i < n; i++) bits.push(factor);
      return bits.join(op);
    }
    return factor + ' ' + op.trim() + ' …（共 ' + n + ' 次）';
  }

  function stripOuter(s) {
    s = s.trim();
    if (s.charAt(0) !== '(' || s.charAt(s.length - 1) !== ')') return s;
    let depth = 0;
    for (let i = 0; i < s.length; i++) {
      if (s.charAt(i) === '(') depth++;
      else if (s.charAt(i) === ')') depth--;
      if (depth === 0 && i < s.length - 1) return s;
    }
    return s.slice(1, -1).trim();
  }

  function prettyExpr(expr, vars, display) {
    if (display) {
      let shown = String(display);
      const keys = Object.keys(vars).sort(function (a, b) { return b.length - a.length; });
      keys.forEach(function (k) {
        shown = shown.replace(new RegExp('\\{' + k + '\\}', 'g'), String(vars[k]));
      });
      return shown.trim();
    }
    let shown = String(expr).replace(/\.toFixed\(\d+\)/g, '');
    const divRe = /(\w+)\s*\/\s*Math\.pow\(\s*1\s*\+\s*(\w+)\s*\/\s*100\s*,\s*(\w+)\s*\)/;
    const div = divRe.exec(shown);
    if (div) {
      const factor = fmtFactor(1 + Number(vars[div[2]]) / 100);
      const seq = powSeq(factor, Number(vars[div[3]]), ' ÷ ');
      shown = shown.replace(div[0], div[1] + ' ÷ ' + seq);
    }
    shown = shown.replace(/Math\.pow\(\s*1\s*\+\s*(\w+)\s*\/\s*100\s*,\s*(\w+)\s*\)/g, function (_, rKey, yKey) {
      const factor = fmtFactor(1 + Number(vars[rKey]) / 100);
      return powSeq(factor, Number(vars[yKey]), ' × ');
    });
    const keys = Object.keys(vars).sort(function (a, b) { return b.length - a.length; });
    keys.forEach(function (k) {
      shown = shown.replace(new RegExp('\\b' + k + '\\b', 'g'), String(vars[k]));
    });
    shown = shown.replace(/\s*\*\s*/g, ' × ').replace(/\s*\/\s*/g, ' ÷ ').replace(/\s*-\s*/g, ' − ').replace(/\s*\+\s*/g, ' + ');
    return stripOuter(shown);
  }

  function evalExpr(expr, vars) {
    const keys = Object.keys(vars);
    const fn = new Function(keys.join(','), 'return (' + expr + ');');
    return fn.apply(null, keys.map(function (k) { return vars[k]; }));
  }

  function mountOrder(inter, ctx) {
    const correct = inter.items.slice();
    const seed = LKStore.get().seed + '|' + inter.prompt;
    const idx = LK.shuffleIdx(correct.length, seed);
    let items = idx.map(function (i) { return { key: String(i), text: correct[i] }; });
    const root = LK.h('div', { class: 'inter' });
    root.appendChild(LK.h('p', { class: 'inter-prompt', text: inter.prompt }));
    const list = LK.h('div', { class: 'order-list' });
    let tries = 0;
    let solved = false;
    const go = finishOnce(ctx);

    function paint() {
      list.innerHTML = '';
      items.forEach(function (it) {
        const up = LK.h('button', { class: 'order-nudge', type: 'button', 'aria-label': '上移', text: '↑' });
        const down = LK.h('button', { class: 'order-nudge', type: 'button', 'aria-label': '下移', text: '↓' });
        const card = LK.h('div', {
          class: 'order-card',
          'data-key': it.key,
          'data-text': it.text
        }, [
          LK.h('span', { class: 'order-handle', text: '⋮⋮' }),
          LK.h('span', { class: 'order-tx', text: it.text }),
          LK.h('span', { class: 'order-nudges' }, [up, down])
        ]);
        up.addEventListener('pointerdown', function (e) { e.stopPropagation(); e.preventDefault(); });
        down.addEventListener('pointerdown', function (e) { e.stopPropagation(); e.preventDefault(); });
        up.addEventListener('click', function (e) {
          e.stopPropagation();
          nudge(card, -1);
        });
        down.addEventListener('click', function (e) {
          e.stopPropagation();
          nudge(card, 1);
        });
        bind(card);
        list.appendChild(card);
      });
    }

    function nudge(card, dir) {
      if (solved) return;
      const sib = dir < 0 ? card.previousElementSibling : card.nextElementSibling;
      if (!sib || !sib.classList.contains('order-card')) return;
      if (dir < 0) list.insertBefore(card, sib);
      else list.insertBefore(sib, card);
      sync();
    }

    function sync() {
      const next = [];
      list.querySelectorAll('.order-card').forEach(function (n) {
        next.push({ key: n.dataset.key, text: n.dataset.text });
      });
      items = next;
    }

    function bind(card) {
      let dragging = false;
      let startY = 0;
      card.addEventListener('pointerdown', function (e) {
        if (solved) return;
        if (e.target.closest && e.target.closest('.order-nudge')) return;
        e.preventDefault();
        dragging = true;
        startY = e.clientY;
        card.classList.add('is-lift');
        try { card.setPointerCapture(e.pointerId); } catch (err) {}
        document.body.classList.add('is-dragging');
      });
      card.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        let guard = 0;
        while (guard++ < 24) {
          const offset = e.clientY - startY;
          card.style.transform = 'translateY(' + offset + 'px) scale(1.04)';
          const rect = card.getBoundingClientRect();
          const mid = rect.top + rect.height / 2;
          const next = card.nextElementSibling && card.nextElementSibling.classList.contains('order-card')
            ? card.nextElementSibling : null;
          const prev = card.previousElementSibling && card.previousElementSibling.classList.contains('order-card')
            ? card.previousElementSibling : null;
          if (next) {
            const nr = next.getBoundingClientRect();
            if (mid > nr.top + nr.height / 2) {
              const old = nr.top;
              const visualWanted = rect.top;
              list.insertBefore(card, next.nextSibling);
              card.style.transform = '';
              const fix = visualWanted - card.getBoundingClientRect().top;
              startY = e.clientY - fix;
              card.style.transform = 'translateY(' + fix + 'px) scale(1.04)';
              const dy = old - next.getBoundingClientRect().top;
              if (!LKMotion.reduce()) {
                next.animate(
                  [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(0)' }],
                  { duration: 180, easing: 'cubic-bezier(.22,1,.36,1)' }
                );
              }
              continue;
            }
          }
          if (prev) {
            const pr = prev.getBoundingClientRect();
            if (mid < pr.top + pr.height / 2) {
              const old = pr.top;
              const visualWanted = rect.top;
              list.insertBefore(card, prev);
              card.style.transform = '';
              const fix = visualWanted - card.getBoundingClientRect().top;
              startY = e.clientY - fix;
              card.style.transform = 'translateY(' + fix + 'px) scale(1.04)';
              const dy = old - prev.getBoundingClientRect().top;
              if (!LKMotion.reduce()) {
                prev.animate(
                  [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(0)' }],
                  { duration: 180, easing: 'cubic-bezier(.22,1,.36,1)' }
                );
              }
              continue;
            }
          }
          break;
        }
        sync();
      });
      function end() {
        if (!dragging) return;
        dragging = false;
        document.body.classList.remove('is-dragging');
        const tr = card.style.transform;
        card.classList.remove('is-lift');
        card.style.transform = '';
        if (!LKMotion.reduce() && tr) {
          card.animate(
            [{ transform: tr }, { transform: 'translateY(0) scale(1)' }],
            { duration: 180, easing: 'cubic-bezier(.22,1,.36,1)' }
          );
        }
        sync();
      }
      card.addEventListener('pointerup', end);
      card.addEventListener('pointercancel', end);
    }

    function showCorrect() {
      solved = true;
      items = correct.map(function (text, i) { return { key: 'c' + i, text: text }; });
      paint();
      root.appendChild(LK.h('p', { class: 'inter-note', text: '先看正确顺序，下一关再自己排。' }));
      ctx.setAction({ label: '继续', onClick: go });
    }

    function check() {
      if (solved) return;
      sync();
      const wrong = [];
      items.forEach(function (it, i) {
        const node = list.querySelector('[data-key="' + it.key + '"]');
        const hint = node.querySelector('.hint');
        if (hint) hint.remove();
        node.classList.remove('is-bad');
        if (it.text !== correct[i]) wrong.push({ node: node, i: i });
      });
      if (!wrong.length) {
        solved = true;
        LKMotion.bounce(list);
        ctx.setAction({ label: '继续', onClick: go });
        return;
      }
      tries += 1;
      wrong.forEach(function (w) {
        w.node.classList.add('is-bad');
        LKMotion.shake(w.node);
        w.node.appendChild(LK.h('em', { class: 'hint', text: '第 ' + (w.i + 1) + ' 个位置不对' }));
      });
      if (tries >= 3) showCorrect();
    }

    paint();
    root.appendChild(list);
    ctx.setAction({ label: '检查', onClick: check });
    return root;
  }

  function mountSort(inter, ctx) {
    const root = LK.h('div', { class: 'inter' });
    root.appendChild(LK.h('p', { class: 'inter-prompt', text: inter.prompt }));
    const seed = LKStore.get().seed + '|' + inter.prompt;
    const order = LK.shuffleIdx(inter.items.length, seed);
    const pool = LK.h('div', { class: 'sort-pool' });
    const bins = LK.h('div', { class: 'sort-bins' });
    const go = finishOnce(ctx);
    let selected = null;
    let left = inter.items.length;
    const hint = LK.h('p', { class: 'inter-note', text: '点一张卡片，再点它该去的篮子。也可以拖过去。' });
    const status = LK.h('p', { class: 'inter-note sort-status', text: '' });

    function cardEl(item, key) {
      const btn = LK.h('button', { class: 'sort-card', 'data-key': key, 'data-no-press': '1' });
      if (item.color) btn.appendChild(LK.h('i', { class: 'sort-chip', style: { background: item.color } }));
      btn.appendChild(LK.h('span', { text: item.text }));
      return btn;
    }

    const binEls = inter.bins.map(function (name, bi) {
      const bin = LK.h('button', { class: 'bin', 'data-bin': String(bi) }, [
        LK.h('span', { class: 'bin-name', text: name }),
        LK.h('span', { class: 'bin-count num', text: '0' })
      ]);
      bin.addEventListener('click', function () { dropSelected(bi, bin); });
      return bin;
    });
    binEls.forEach(function (b) { bins.appendChild(b); });

    function updateCount() {
      binEls.forEach(function (b, i) {
        b.querySelector('.bin-count').textContent = String(b.querySelectorAll('.sort-card').length);
      });
    }

    function succeed(card) {
      left -= 1;
      card.classList.add('is-in');
      LKMotion.bounce(card);
      selected = null;
      pool.querySelectorAll('.sort-card').forEach(function (c) { c.classList.remove('is-selected'); });
      updateCount();
      if (left <= 0) {
        ctx.setAction({ label: '继续', onClick: go });
      }
    }

    function reject(card, binEl) {
      status.textContent = '差一点，这张弹回去了。';
      const origin = card.getBoundingClientRect();
      binEl.appendChild(card);
      const landed = card.getBoundingClientRect();
      const dx = origin.left - landed.left;
      const dy = origin.top - landed.top;
      card.style.transition = 'none';
      card.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      LKMotion.shake(binEl);
      requestAnimationFrame(function () {
        card.style.transition = 'transform 160ms cubic-bezier(.22,1,.36,1)';
        card.style.transform = 'translate(0px,0px)';
      });
      setTimeout(function () {
        const from = card.getBoundingClientRect();
        pool.appendChild(card);
        const to = card.getBoundingClientRect();
        const ox = from.left - to.left;
        const oy = from.top - to.top;
        card.style.transition = 'none';
        const t0 = performance.now();
        function frame(now) {
          const t = Math.min(1, (now - t0) / 300);
          const lift = Math.sin(Math.PI * t) * -36;
          card.style.transform = 'translate(' + (ox * (1 - t)) + 'px,' + (oy * (1 - t) + lift) + 'px)';
          if (t < 1) requestAnimationFrame(frame);
          else card.style.transform = '';
        }
        if (LKMotion.reduce()) card.style.transform = '';
        else requestAnimationFrame(frame);
        card.classList.remove('is-selected');
        if (selected === card) selected = null;
      }, 180);
    }

    function dropSelected(bi, binEl) {
      if (!selected) {
        status.textContent = '先点一张卡片。';
        return;
      }
      const item = selected._item;
      if (item.bin !== bi) {
        reject(selected, binEl);
        return;
      }
      binEl.appendChild(selected);
      succeed(selected);
    }

    order.forEach(function (i) {
      const item = inter.items[i];
      const card = cardEl(item, String(i));
      card._item = item;
      card.addEventListener('click', function () {
        if (card.classList.contains('is-in')) return;
        pool.querySelectorAll('.sort-card').forEach(function (c) { c.classList.remove('is-selected'); });
        card.classList.add('is-selected');
        selected = card;
      });
      let start = null;
      card.addEventListener('pointerdown', function (e) { start = { x: e.clientX, y: e.clientY, id: e.pointerId }; });
      card.addEventListener('pointerup', function (e) {
        if (!start) return;
        const dx = e.clientX - start.x;
        const dy = e.clientY - start.y;
        start = null;
        if (Math.hypot(dx, dy) < 12) return;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        const bin = el && el.closest ? el.closest('.bin') : null;
        if (!bin) return;
        selected = card;
        dropSelected(+bin.dataset.bin, bin);
      });
      pool.appendChild(card);
    });

    root.appendChild(hint);
    root.appendChild(status);
    root.appendChild(pool);
    root.appendChild(bins);
    ctx.setAction({ hidden: true });
    return root;
  }

  function mountSlider(inter, ctx) {
    const root = LK.h('div', { class: 'inter' });
    root.appendChild(LK.h('p', { class: 'inter-prompt', text: inter.prompt || '拖动滑块，看数字怎么变。' }));
    const vars = {};
    let moved = false;
    const rows = LK.h('div', { class: 'slider-rows' });
    inter.vars.forEach(function (v) {
      vars[v.key] = v.value;
      const out = LK.h('span', { class: 'num slider-val', text: LK.fmtNum(v.value) + (v.unit || '') });
      const range = LK.h('input', {
        type: 'range',
        min: v.min,
        max: v.max,
        step: v.step,
        value: v.value,
        'aria-label': v.label
      });
      function paintRange() {
        const min = Number(range.min);
        const max = Number(range.max);
        const val = Number(range.value);
        const pct = max === min ? 0 : ((val - min) / (max - min)) * 100;
        range.style.setProperty('--fill', pct + '%');
      }
      paintRange();
      range.addEventListener('input', function () {
        moved = true;
        vars[v.key] = Number(range.value);
        out.textContent = LK.fmtNum(vars[v.key]) + (v.unit || '');
        paintRange();
        renderOut();
        ctx.setAction({ label: '我看明白了', disabled: false, onClick: finishOnce(ctx) });
      });
      rows.appendChild(LK.h('label', { class: 'slider-row' }, [
        LK.h('span', { class: 'slider-label' }, [document.createTextNode(v.label), out]),
        range
      ]));
    });
    const formulas = LK.h('div', { class: 'formula-stack' });
    function renderOut() {
      formulas.innerHTML = '';
      (inter.outputs || []).forEach(function (o) {
        let value = '';
        let shown = '';
        try {
          value = evalExpr(o.expr, vars);
          shown = prettyExpr(o.expr, vars, o.display) + ' = ' + (typeof value === 'string' ? value : LK.fmtNum(Number(value)));
          if (o.unit && String(shown).indexOf(o.unit) < 0) shown += ' ' + o.unit;
        } catch (e) {
          shown = '算式还不能算';
        }
        formulas.appendChild(LK.h('div', { class: 'formula' }, [
          LK.h('div', { class: 'formula-k', text: o.label }),
          LK.h('div', { class: 'num', text: shown })
        ]));
      });
    }
    renderOut();
    root.appendChild(rows);
    root.appendChild(formulas);
    if (inter.note && inter.note !== inter.prompt) root.appendChild(LK.h('p', { class: 'inter-note', text: inter.note }));
    ctx.setAction({ label: '我看明白了', disabled: true, onClick: function () { if (moved) finishOnce(ctx)(); } });
    return root;
  }

  function mountChoice(inter, ctx, kind) {
    const root = LK.h('div', { class: 'inter' });
    root.appendChild(LK.h('p', { class: 'inter-prompt', text: inter.prompt }));
    const salt = LKStore.get().seed + '|' + inter.prompt;
    const map = LK.shuffleIdx(inter.options.length, salt);
    const answer = map.indexOf(inter.answer);
    const go = finishOnce(ctx);
    let locked = false;
    if (kind === 'listen') {
      const bar = LK.h('div', { class: 'listen-bar' });
      if (LK.canSpeak()) {
        const play = LK.h('button', { class: 'speak-btn', 'aria-label': '播放' }, [LK.h('span', { text: '▶' })]);
        play.addEventListener('click', function () {
          const ok = LK.speak(inter.audio, LKStore.get().settings.ttsRate || 0.9);
          if (!ok) {
            play.remove();
            bar.appendChild(LK.h('p', { class: 'listen-text', text: inter.audio }));
            return;
          }
          play.classList.add('is-speaking');
          setTimeout(function () { play.classList.remove('is-speaking'); }, 1600);
        });
        bar.appendChild(play);
        bar.appendChild(LK.h('span', { class: 'listen-hint', text: '点一下，听这句话' }));
      } else {
        bar.appendChild(LK.h('p', { class: 'listen-text', text: inter.audio }));
      }
      root.appendChild(bar);
    }
    const list = LK.h('div', { class: 'opt-list' });
    const why = LK.h('div', { class: 'explain', hidden: true }, [
      LK.h('div', { class: 'explain-clip' }, [
        LK.h('p', { class: 'explain-k', text: '' }),
        LK.h('p', { class: 'explain-why', text: inter.why || '' })
      ])
    ]);
    const buttons = map.map(function (src, display) {
      const opt = inter.options[src];
      const btn = LK.h('button', { class: kind === 'swatch' ? 'swatch-opt' : 'opt listen-opt' });
      if (kind === 'swatch') {
        if (opt.weights) {
          const bar = LK.h('span', { class: 'swatch-weight' });
          const sum = opt.weights.reduce(function (a, b) { return a + b; }, 0) || 1;
          opt.colors.forEach(function (c, i) {
            bar.appendChild(LK.h('i', { style: { background: c, width: (opt.weights[i] / sum * 100) + '%' } }));
          });
          btn.appendChild(bar);
        } else {
          const row = LK.h('span', { class: 'swatch-row' });
          opt.colors.forEach(function (c) {
            row.appendChild(LK.h('i', { style: { background: c } }));
          });
          btn.appendChild(row);
        }
        btn.appendChild(LK.h('span', { class: 'swatch-label', text: opt.label }));
      } else {
        btn.textContent = typeof opt === 'string' ? opt : opt.label;
      }
      btn.addEventListener('click', function () {
        if (locked) return;
        if (btn.disabled) return;
        const ok = display === answer;
        list.querySelectorAll('.swatch-label').forEach(function (label) { label.classList.add('is-shown'); });
        if (ok) {
          locked = true;
          btn.classList.add('is-ok');
          LKMotion.bounce(btn);
          const starSlot = document.querySelector('.star-slot');
          if (starSlot) LKMotion.arcFly(btn, starSlot, { text: '★', duration: 560 });
          const mascot = document.querySelector('.lesson-mascot .mascot');
          if (mascot) LKMotion.celebrateMascot(mascot);
          why.querySelector('.explain-k').textContent = '对了';
          LKMotion.revealRows(why);
          ctx.setAction({ label: '继续', onClick: go });
        } else {
          btn.classList.add('is-bad');
          btn.disabled = true;
          LKMotion.shake(btn);
          why.querySelector('.explain-k').textContent = '差一点';
          setTimeout(function () {
            const good = buttons[answer];
            if (good) {
              good.classList.add('is-reveal');
              if (!LKMotion.reduce()) {
                good.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }], { duration: 220 });
              }
            }
          }, 200);
          LKMotion.revealRows(why, { delay: 250, duration: 420 });
        }
      });
      list.appendChild(btn);
      return btn;
    });
    root.appendChild(list);
    root.appendChild(why);
    ctx.setAction({ hidden: true });
    return root;
  }

  function mountMap(inter, ctx) {
    const root = LK.h('div', { class: 'inter' });
    root.appendChild(LK.h('p', { class: 'inter-prompt', text: inter.prompt }));
    const got = {};
    const go = finishOnce(ctx);
    const map = LKMap.mount({
      layer: inter.layer || 'province',
      lit: function (id) { return !!got[id]; },
      onTap: function (p, tile) {
        if (got[p.id]) return;
        if (inter.targets.indexOf(p.id) >= 0) {
          got[p.id] = true;
          const ns = LKMap.neighbors(p.id).map(function (n) { return map._tiles[n.id]; }).filter(function (n) {
            return n && n.classList.contains('is-lit');
          });
          LKMotion.lightTile(tile, ns);
          if (inter.targets.every(function (id) { return got[id]; })) {
            ctx.setAction({ label: '继续', onClick: go });
          }
        } else {
          LKMotion.shake(tile);
          const tip = LK.h('span', { class: 'tile-tip', text: p.name });
          tile.appendChild(tip);
          setTimeout(function () { tip.remove(); }, 900);
        }
      }
    });
    root.appendChild(map);
    ctx.setAction({ hidden: true });
    return root;
  }

  function mount(inter, ctx) {
    if (!inter) return LK.h('div');
    if (inter.type === 'order') return mountOrder(inter, ctx);
    if (inter.type === 'sort2') return mountSort(inter, ctx);
    if (inter.type === 'slider') return mountSlider(inter, ctx);
    if (inter.type === 'swatch') return mountChoice(inter, ctx, 'swatch');
    if (inter.type === 'listen') return mountChoice(inter, ctx, 'listen');
    if (inter.type === 'mapTap') return mountMap(inter, ctx);
    return LK.h('p', { text: '这个互动还没准备好。' });
  }

  global.LKInteract = { mount: mount };
})(window);
