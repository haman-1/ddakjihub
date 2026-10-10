(function () {
  var yearsEl = document.getElementById('calc-years');
  var monthsEl = document.getElementById('calc-months');
  var weightEl = document.getElementById('calc-weight');
  var runEl = document.getElementById('calc-run');
  var msgEl = document.getElementById('calc-msg');
  var resultEl = document.getElementById('calc-result');
  var humanEl = document.getElementById('calc-human');
  var bandEl = document.getElementById('calc-band');
  var stageEl = document.getElementById('calc-stage');
  var sevenEl = document.getElementById('calc-seven');
  if (!yearsEl || !monthsEl || !weightEl || !resultEl) { return; }

  // 체중 구간별 사람 나이 환산표 — Zoetis Petcare(헤더 버스트 수의사) 자료 기준.
  // 1세 15, 2세 24는 전 체형 공통이고 3세부터 구간별로 벌어진다.
  // 구간 경계는 원자료의 20·50·90파운드를 kg로 바꾼 9·23·41kg.
  var TABLES = {
    small:  [0, 15, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72, 76, 80, 84, 88, 92, 96],
    medium: [0, 15, 24, 28, 33, 37, 42, 47, 51, 56, 60, 65, 69, 74, 78, 83, 87, 92, 96, 101, 105],
    large:  [0, 15, 24, 30, 35, 40, 45, 50, 55, 61, 66, 72, 77, 83, 88, 94, 99, 105, 110, 116, 121],
    giant:  [0, 15, 24, 32, 37, 42, 49, 56, 64, 71, 78, 86, 92, 100, 107, 114, 121, 128, 135, 142, 149]
  };

  // 노령기 진입 시점 — VCA 동물병원 기준
  var SENIOR_START = { small: 11, medium: 10, large: 8, giant: 7 };
  var BAND_LABEL = { small: '9kg 이하', medium: '9~23kg', large: '23~41kg', giant: '41kg 이상' };

  function bandOf(w) {
    if (w <= 9) { return 'small'; }
    if (w <= 23) { return 'medium'; }
    if (w <= 41) { return 'large'; }
    return 'giant';
  }

  function humanAge(age, table) {
    if (age <= 0) { return 0; }
    if (age < 1) { return 15 * age; }
    var top = table.length - 1;
    if (age >= top) {
      var lastRate = table[top] - table[top - 1];
      return table[top] + lastRate * (age - top);
    }
    var lo = Math.floor(age);
    return table[lo] + (table[lo + 1] - table[lo]) * (age - lo);
  }

  function stageOf(age, band) {
    if (age < 1) { return '퍼피 (새끼)'; }
    if (age < 2) { return '주니어 (성장기)'; }
    if (age < SENIOR_START[band]) { return '성견'; }
    return '노령기 (시니어)';
  }

  function calc() {
    var y = parseFloat(yearsEl.value);
    var m = parseFloat(monthsEl.value);
    if (!isFinite(y)) { y = 0; }
    if (!isFinite(m)) { m = 0; }
    var age = y + m / 12;
    var w = parseFloat(weightEl.value);
    if (age <= 0) {
      msgEl.textContent = '강아지 나이를 입력해 주세요.';
      msgEl.hidden = false;
      resultEl.hidden = true;
      return;
    }
    if (!isFinite(w) || w <= 0) {
      msgEl.textContent = '체중을 kg 단위로 입력해 주세요.';
      msgEl.hidden = false;
      resultEl.hidden = true;
      return;
    }
    msgEl.hidden = true;
    var band = bandOf(w);
    humanEl.textContent = Math.round(humanAge(age, TABLES[band]));
    bandEl.textContent = BAND_LABEL[band];
    stageEl.textContent = stageOf(age, band);
    sevenEl.textContent = Math.round(age * 7);
    resultEl.hidden = false;
  }

  runEl.addEventListener('click', calc);
  [yearsEl, monthsEl, weightEl].forEach(function (el) {
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { calc(); }
    });
    el.addEventListener('change', function () {
      if (!resultEl.hidden) { calc(); }
    });
  });
})();
