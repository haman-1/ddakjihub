(function () {
  var mateEl = document.getElementById('calc-mate');
  var runEl = document.getElementById('calc-run');
  var msgEl = document.getElementById('calc-msg');
  var resultEl = document.getElementById('calc-result');
  var dueEl = document.getElementById('calc-due');
  var windowEl = document.getElementById('calc-window');
  var checkEl = document.getElementById('calc-check');
  var xrayEl = document.getElementById('calc-xray');
  var tempEl = document.getElementById('calc-temp');
  if (!mateEl || !resultEl) { return; }

  function addDays(base, n) {
    return new Date(base.getFullYear(), base.getMonth(), base.getDate() + n);
  }

  function fmtDate(d) {
    return d.getFullYear() + '년 ' + (d.getMonth() + 1) + '월 ' + d.getDate() + '일';
  }

  function calc() {
    var parts = (mateEl.value || '').split('-');
    if (parts.length !== 3) {
      msgEl.textContent = '교배일을 선택해 주세요.';
      msgEl.hidden = false;
      resultEl.hidden = true;
      return;
    }
    var base = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    if (isNaN(base.getTime()) || base.getFullYear() < 1000) {
      msgEl.textContent = '교배일을 선택해 주세요.';
      msgEl.hidden = false;
      resultEl.hidden = true;
      return;
    }
    msgEl.hidden = true;
    dueEl.textContent = fmtDate(addDays(base, 63));
    windowEl.textContent = fmtDate(addDays(base, 58)) + ' ~ ' + fmtDate(addDays(base, 68));
    checkEl.textContent = fmtDate(addDays(base, 21)) + ' ~ ' + fmtDate(addDays(base, 30));
    xrayEl.textContent = fmtDate(addDays(base, 45)) + ' 이후';
    tempEl.textContent = fmtDate(addDays(base, 56)) + '부터';
    resultEl.hidden = false;
  }

  runEl.addEventListener('click', calc);
  mateEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { calc(); }
  });
  mateEl.addEventListener('change', function () {
    if (!resultEl.hidden) { calc(); }
  });
})();
