(function (global) {
  function host() {
    let n = document.getElementById('overlay');
    if (!n) {
      n = document.createElement('div');
      n.id = 'overlay';
      document.body.appendChild(n);
    }
    return n;
  }

  function focusables(root) {
    return Array.prototype.slice.call(root.querySelectorAll('button, a[href], input, [tabindex]')).filter(function (el) {
      return !el.disabled && el.tabIndex !== -1 && el.offsetParent !== null;
    });
  }

  function open(build, opts) {
    opts = opts || {};
    const root = host();
    const mask = LK.h('div', { class: 'mask' });
    const sheet = LK.h('div', { class: 'sheet' + (opts.tall ? ' sheet-tall' : ''), role: 'dialog' });
    if (opts.tall) sheet.setAttribute('aria-modal', 'true');
    if (opts.labelledBy) sheet.setAttribute('aria-labelledby', opts.labelledBy);
    const grip = LK.h('div', { class: 'sheet-grip' });
    const body = LK.h('div', { class: 'sheet-body' });
    sheet.appendChild(grip);
    sheet.appendChild(body);
    root.appendChild(mask);
    root.appendChild(sheet);
    let closed = false;
    function finishRemove() {
      mask.remove();
      sheet.remove();
      document.removeEventListener('keydown', onKey);
      const back = opts.returnFocus;
      if (back && back.focus && document.contains(back)) back.focus();
    }
    function close() {
      if (closed) return;
      closed = true;
      if (opts.onClose) opts.onClose();
      const done = finishRemove;
      if (LKMotion.reduce()) {
        mask.animate([{ opacity: .35 }, { opacity: 0 }], { duration: 120, fill: 'forwards' });
        sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: 'forwards' }).finished.then(done);
        return;
      }
      mask.animate([{ opacity: .35 }, { opacity: 0 }], { duration: 180, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' });
      sheet.animate(
        [{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }],
        { duration: 180, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' }
      ).finished.then(done);
    }
    function onKey(e) {
      if (!opts.tall || closed) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables(sheet);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    build(body, close);
    if (opts.tall) {
      document.addEventListener('keydown', onKey);
      bindDrag(grip);
      const head = body.querySelector('.peek-head');
      if (head) bindDrag(head);
      const closeBtn = sheet.querySelector('[data-sheet-close]');
      if (closeBtn) closeBtn.focus();
    }
    if (LKMotion.reduce()) {
      mask.animate([{ opacity: 0 }, { opacity: .35 }], { duration: 120, fill: 'forwards' });
      sheet.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 120, fill: 'forwards' });
    } else {
      mask.animate([{ opacity: 0 }, { opacity: .35 }], { duration: 240, fill: 'forwards' });
      sheet.animate(
        [
          { transform: 'translateY(100%)' },
          { transform: 'translateY(-6px)', offset: .86 },
          { transform: 'translateY(0)' }
        ],
        { duration: 380, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
      );
    }
    mask.addEventListener('click', close);

    function bindDrag(handle) {
      let active = false;
      let startY = 0;
      let startT = 0;
      let lastY = 0;
      let lastT = 0;
      handle.addEventListener('pointerdown', function (e) {
        if (e.target.closest && e.target.closest('button')) return;
        active = true;
        startY = lastY = e.clientY;
        startT = lastT = performance.now();
        sheet.getAnimations().forEach(function (a) { a.cancel(); });
        try { handle.setPointerCapture(e.pointerId); } catch (err) {}
      });
      handle.addEventListener('pointermove', function (e) {
        if (!active) return;
        lastY = e.clientY;
        lastT = performance.now();
        const dy = Math.max(0, e.clientY - startY);
        sheet.style.transform = 'translateY(' + dy + 'px)';
      });
      function end(e) {
        if (!active) return;
        active = false;
        const y = e.clientY || lastY;
        const dy = Math.max(0, y - startY);
        const dt = Math.max(1, (e.timeStamp || lastT) - (lastT === startT ? startT : lastT));
        const velocity = (y - lastY) / dt;
        const pulled = (y - startY) / Math.max(1, (e.timeStamp || lastT) - startT);
        if (dy >= 80 || velocity > 0.5 || pulled > 0.5) close();
        else {
          sheet.animate(
            [{ transform: 'translateY(' + dy + 'px)' }, { transform: 'translateY(0)' }],
            { duration: 180, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'forwards' }
          );
        }
      }
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    }
    return close;
  }

  function confirm(opts) {
    return new Promise(function (resolve) {
      open(function (body, close) {
        body.appendChild(LK.h('h2', { class: 'sheet-title', text: opts.title }));
        if (opts.body) body.appendChild(LK.h('p', { class: 'sheet-copy', text: opts.body }));
        const row = LK.h('div', { class: 'sheet-actions' });
        row.appendChild(LK.h('button', {
          class: 'btn btn-secondary',
          text: opts.cancel || '取消',
          onClick: function () { resolve(false); close(); }
        }));
        row.appendChild(LK.h('button', {
          class: 'btn btn-primary',
          text: opts.ok || '确定',
          onClick: function () { resolve(true); close(); }
        }));
        body.appendChild(row);
      });
    });
  }

  function toast(text) {
    open(function (body, close) {
      body.appendChild(LK.h('p', { class: 'sheet-copy', text: text }));
      body.appendChild(LK.h('button', {
        class: 'btn btn-primary',
        text: '知道了',
        onClick: close
      }));
    });
  }

  global.LKSheet = { open: open, confirm: confirm, toast: toast };
})(window);
