(function () {
  var weightEl = document.getElementById('calc-weight');
  var statusEl = document.getElementById('calc-status');
  var runEl = document.getElementById('calc-run');
  var msgEl = document.getElementById('calc-msg');
  var resultEl = document.getElementById('calc-result');
  var merEl = document.getElementById('calc-mer');
  var rerEl = document.getElementById('calc-rer');
  var factorEl = document.getElementById('calc-factor');
  var treatEl = document.getElementById('calc-treat');
  if (!weightEl || !statusEl || !resultEl) { return; }

  function fmt(n) {
    return Math.round(n).toLocaleString('ko-KR');
  }

  function calc() {
    var w = parseFloat(weightEl.value);
    var factor = parseFloat(statusEl.value);
    if (!isFinite(w) || w <= 0) {
      msgEl.textContent = '몸무게를 kg 단위로 입력해 주세요.';
      msgEl.hidden = false;
      resultEl.hidden = true;
      return;
    }
    msgEl.hidden = true;
    var rer = 70 * Math.pow(w, 0.75);
    var mer = rer * factor;
    rerEl.textContent = fmt(rer);
    factorEl.textContent = factor;
    merEl.textContent = fmt(mer);
    treatEl.textContent = fmt(mer * 0.1);
    resultEl.hidden = false;
  }

  runEl.addEventListener('click', calc);
  weightEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { calc(); }
  });
  weightEl.addEventListener('change', function () {
    if (!resultEl.hidden) { calc(); }
  });
  statusEl.addEventListener('change', function () {
    if (!resultEl.hidden) { calc(); }
  });
})();
