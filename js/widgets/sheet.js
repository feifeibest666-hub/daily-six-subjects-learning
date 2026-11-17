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

  function open(build) {
    const root = host();
    const mask = LK.h('div', { class: 'mask' });
    const sheet = LK.h('div', { class: 'sheet', role: 'dialog' });
    const grip = LK.h('div', { class: 'sheet-grip' });
    const body = LK.h('div', { class: 'sheet-body' });
    sheet.appendChild(grip);
    sheet.appendChild(body);
    root.appendChild(mask);
    root.appendChild(sheet);
    let closed = false;
    function close() {
      if (closed) return;
      closed = true;
      const done = function () { mask.remove(); sheet.remove(); };
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
    build(body, close);
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
