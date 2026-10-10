(function () {
  var weightEl = document.getElementById('calc-weight');
  var bcsEl = document.getElementById('calc-bcs');
  var runEl = document.getElementById('calc-run');
  var msgEl = document.getElementById('calc-msg');
  var resultEl = document.getElementById('calc-result');
  var idealLineEl = document.getElementById('calc-ideal-line');
  var idealEl = document.getElementById('calc-ideal');
  var excessEl = document.getElementById('calc-excess');
  var statusEl = document.getElementById('calc-status-line');
  if (!weightEl || !bcsEl || !resultEl) { return; }

  function fmt1(n) {
    return (Math.round(n * 10) / 10).toLocaleString('ko-KR');
  }

  function calc() {
    var w = parseFloat(weightEl.value);
    var bcs = parseInt(bcsEl.value, 10);
    if (!isFinite(w) || w <= 0) {
      msgEl.textContent = '현재 체중을 kg 단위로 입력해 주세요.';
      msgEl.hidden = false;
      resultEl.hidden = true;
      return;
    }
    msgEl.hidden = true;
    idealLineEl.hidden = true;
    if (bcs <= 3) {
      statusEl.textContent = '많이 마른 상태입니다. 체중이 계속 줄고 있다면 수의사와 상담하세요.';
    } else if (bcs === 4) {
      statusEl.textContent = '약간 마른 편입니다. 체중이 안정적인지 2~4주 단위로 확인해 보세요.';
    } else if (bcs === 5) {
      statusEl.textContent = '적정 범위입니다. 지금 체중을 유지하는 것이 목표입니다.';
    } else {
      var pct = (bcs - 5) * 10;
      var excess = w * pct / 100;
      idealEl.textContent = fmt1(w - excess);
      excessEl.textContent = fmt1(excess);
      statusEl.textContent = '현재 체중은 적정 체중보다 약 ' + pct + '% 무거운 것으로 보는 추정입니다.';
      idealLineEl.hidden = false;
    }
    resultEl.hidden = false;
  }

  runEl.addEventListener('click', calc);
  weightEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { calc(); }
  });
  weightEl.addEventListener('change', function () {
    if (!resultEl.hidden) { calc(); }
  });
  bcsEl.addEventListener('change', function () {
    if (!resultEl.hidden) { calc(); }
  });
})();
