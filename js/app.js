(function () {
  function boot() {
    LKStore.init();
    LKMotion.init();
    const notice = LKStore.consumeNotice();
    LKRouter.start();
    if (notice === 'freeze') {
      const left = LKStore.get().streak.freezeLeft;
      setTimeout(function () {
        LKSheet.toast('用了一张补签卡。连续打卡还在，这个月还剩 ' + left + ' 张。');
      }, 400);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
