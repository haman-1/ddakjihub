/* 홈 '최신 글' 더보기 + 스크롤 자동 로드 (2026-11-09)
   점진적 향상 — 서버가 준 /page/N/ 링크는 그대로 두고 JS가 가로채 카드만 append한다.
   JS가 없으면(크롤러 포함) 기존처럼 /page/N/ 페이지 이동 → 크롤 경로 무손실.
   동작: 첫 1회는 '더보기' 클릭 → 이후 버튼이 화면에서 600px 안에 오면 자동 로드 →
   마지막 페이지를 붙이면 버튼 숨김.
   뒤로가기: bfcache면 브라우저가 통째로 복원(이 스크립트 재실행 없음),
   bfcache 없이 재로드된 경우만 sessionStorage에 저장한 (페이지 수, 스크롤)로 복원. */
(function () {
  'use strict';
  var grid = document.getElementById('latest-grid');
  var btn = document.getElementById('home-load-more');
  var pagerEl = document.querySelector('.home-pager');
  if (!grid || !btn || !pagerEl) return;

  var KEY = 'ddakjihub-home-load';
  var loadedPages = 1;
  var nextURL = pagerEl.getAttribute('data-next') || '';
  var inFlight = false;
  var observer = null;

  function readState() {
    try { return JSON.parse(sessionStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function writeState() {
    try { sessionStorage.setItem(KEY, JSON.stringify({ p: loadedPages, y: window.scrollY })); } catch (e) {}
  }
  function clearState() {
    try { sessionStorage.removeItem(KEY); } catch (e) {}
  }

  function appendCards(html) {
    var doc = new DOMParser().parseFromString(html, 'text/html');
    /* 구버전 템플릿(캐시) 페이지면 id가 없을 수 있어 class로 폴백 */
    var remoteGrid = doc.getElementById('latest-grid') || doc.querySelector('.card-grid');
    var remotePager = doc.querySelector('.home-pager');
    if (!remoteGrid) throw new Error('latest-grid 없음');
    var cards = remoteGrid.children;
    while (cards.length) grid.appendChild(cards[0]);
    nextURL = remotePager ? (remotePager.getAttribute('data-next') || '') : '';
    loadedPages += 1;
  }

  function finish() {
    if (observer) { observer.disconnect(); observer = null; }
    btn.style.display = 'none';
  }

  function startObserving() {
    if (observer || !('IntersectionObserver' in window)) return;
    observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) loadNext();
    }, { rootMargin: '600px 0px' });
    observer.observe(btn);
  }

  function loadNext(isRestore) {
    if (!nextURL || inFlight) return Promise.resolve(false);
    inFlight = true;
    /* no-store — GitHub Pages가 max-age=600으로 주는 HTML의 브라우저 캐시를
       무시한다. 캐시된 구버전 페이지를 받으면 append가 조용히 실패하기 때문 */
    return fetch(nextURL, { cache: 'no-store' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.text();
      })
      .then(function (html) {
        appendCards(html);
        if (typeof gtag === 'function') gtag('event', 'home_load_more', { page_number: loadedPages });
        if (!nextURL) finish();
        else startObserving();
        writeState();
        return true;
      })
      .catch(function (err) {
        console.warn('홈 더보기 로드 실패:', err);
        /* append가 안 되면 조용히 멈추지 말고 실제 /page/N/ 링크로 이동해
           폴백(no-JS와 같은 동작). 뒤로가기 복원 중에는 이동하지 않는다 */
        if (!isRestore && nextURL) window.location.href = nextURL;
        return false;
      })
      .finally(function () { inFlight = false; });
  }

  btn.addEventListener('click', function (e) {
    e.preventDefault();
    loadNext();
  });

  /* 뒤로가기 복원 — bfcache 복원이면 이 스크립트가 다시 실행되지 않으므로
     여기 도달하는 것은 bfcache 없이 재로드된 경우뿐. 스크롤 자동 복원과
     겹치지 않게 수동 모드로 두고 sessionStorage 값으로 직접 복원한다. */
  history.scrollRestoration = 'manual';
  function isBackForward() {
    var nav = performance.getEntriesByType('navigation')[0];
    if (nav) return nav.type === 'back_forward';
    return !!(performance.navigation && performance.navigation.type === 2);
  }
  function restore() {
    var saved = readState();
    if (!saved) return;
    clearState();
    var target = parseInt(saved.p, 10) || 1;
    var y = parseInt(saved.y, 10) || 0;
    function step() {
      if (loadedPages >= target || !nextURL) {
        requestAnimationFrame(function () { window.scrollTo(0, y); });
        return;
      }
      loadNext(true).then(function (ok) {
        if (ok) step();
        else requestAnimationFrame(function () { window.scrollTo(0, y); });
      });
    }
    step();
  }
  if (isBackForward()) restore();
  else clearState();

  /* 스크롤 위치 저장 — 카드 클릭으로 페이지를 떠나기 직전 상태를 남긴다 */
  var scrollTimer = null;
  window.addEventListener('scroll', function () {
    if (scrollTimer) return;
    scrollTimer = setTimeout(function () { scrollTimer = null; writeState(); }, 300);
  }, { passive: true });
  window.addEventListener('pagehide', writeState);
})();
