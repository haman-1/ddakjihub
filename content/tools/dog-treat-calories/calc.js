(function () {
  var dailyEl = document.getElementById('calc-daily');
  var treatEl = document.getElementById('calc-treat-kcal');
  var countEl = document.getElementById('calc-count');
  var runEl = document.getElementById('calc-run');
  var msgEl = document.getElementById('calc-msg');
  var resultEl = document.getElementById('calc-result');
  var sumEl = document.getElementById('calc-sum');
  var pctEl = document.getElementById('calc-pct');
  var capEl = document.getElementById('calc-cap');
  var verdictEl = document.getElementById('calc-verdict');
  if (!dailyEl || !treatEl || !countEl || !resultEl) { return; }

  function fmt(n) {
    return Math.round(n).toLocaleString('ko-KR');
  }

  function fmt1(n) {
    return (Math.round(n * 10) / 10).toLocaleString('ko-KR');
  }

  function showMsg(text) {
    msgEl.textContent = text;
    msgEl.hidden = false;
    resultEl.hidden = true;
  }

  function calc() {
    var daily = parseFloat(dailyEl.value);
    var treat = parseFloat(treatEl.value);
    var count = parseFloat(countEl.value);
    if (!isFinite(daily) || daily <= 0) { showMsg('하루 필요 열량을 kcal 단위로 입력해 주세요.'); return; }
    if (!isFinite(treat) || treat <= 0) { showMsg('간식 1개 열량을 kcal 단위로 입력해 주세요.'); return; }
    if (!isFinite(count) || count <= 0) { showMsg('하루 간식 개수를 입력해 주세요.'); return; }
    msgEl.hidden = true;
    var sum = treat * count;
    var cap = daily * 0.1;
    var maxCount = Math.floor(cap / treat);
    sumEl.textContent = fmt(sum);
    pctEl.textContent = fmt1(sum / daily * 100);
    capEl.textContent = fmt(cap);
    if (sum <= cap) {
      verdictEl.textContent = '10% 이내로 적정 범위입니다. 이 간식이라면 하루 최대 ' + maxCount + '개까지 가능합니다.';
    } else {
      var exceed = sum - cap;
      var reduceBy = Math.ceil(exceed / treat);
      verdictEl.textContent = '상한을 ' + fmt(exceed) + 'kcal 넘었습니다. 이 간식을 ' + reduceBy + '개 줄이거나, 사료를 약 ' + fmt(exceed) + 'kcal만큼 덜어 주세요.';
    }
    resultEl.hidden = false;
  }

  runEl.addEventListener('click', calc);
  [dailyEl, treatEl, countEl].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { calc(); }
    });
    el.addEventListener('change', function () {
      if (!resultEl.hidden) { calc(); }
    });
  });
})();
