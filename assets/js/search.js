/* 딱지허브 사이트 검색 — /search-index.json(빌드 시 생성)을 Fuse.js로 검색한다.
   한국어 교착어 특성상 어미가 붙어도 찾히도록 부분 문자열 퍼지 매칭(Fuse.js)을 쓴다. */
(function () {
  'use strict';

  var input = document.getElementById('search-input');
  var resultsEl = document.getElementById('search-results');
  var statusEl = document.getElementById('search-status');
  var suggestEl = document.getElementById('search-suggest');
  if (!input || !resultsEl) return;

  var SECTION_LABELS = { breeds: '품종', guides: '가이드', daily: '일상' };
  var fuse = null;
  var loading = false;
  var pending = [];
  var timer = null;

  function indexPath() {
    var el = document.querySelector('script[data-search-index]');
    return (el && el.getAttribute('data-search-index')) || '/search-index.json';
  }

  /* 색인은 첫 검색 때 한 번만 내려받는다 — 검색 페이지에 온 뒤에만 트래픽 발생 */
  function ensureIndex(done) {
    if (fuse) { done(); return; }
    pending.push(done);
    if (loading) return;
    loading = true;
    setStatus('검색 준비 중입니다…');
    fetch(indexPath())
      .then(function (r) { return r.json(); })
      .then(function (docs) {
        /* 본문에는 타이포그래프 엔티티(&lsquo; 등)가 남어 있어 실제 글자로 바꿔 둔다 */
        docs.forEach(function (d) { d.content = decodeEntities(d.content); });
        fuse = new Fuse(docs, {
          keys: [
            { name: 'title', weight: 0.35 },
            { name: 'tags', weight: 0.25 },
            { name: 'breed', weight: 0.15 },
            { name: 'content', weight: 0.15 },
            { name: 'desc', weight: 0.1 }
          ],
          threshold: 0.3,
          ignoreLocation: true,
          includeMatches: true,
          minMatchCharLength: 2
        });
        loading = false;
        setStatus('');
        var cb;
        while ((cb = pending.shift())) cb();
      })
      .catch(function () {
        loading = false;
        setStatus('검색 색인을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.');
      });
  }

  function setStatus(text) {
    if (!text) { statusEl.hidden = true; statusEl.textContent = ''; return; }
    statusEl.hidden = false;
    statusEl.textContent = text;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* HTML 엔티티 디코딩 — textarea 내용은 파싱 대상이 아니라 스크립트 실행 위험 없이 풀린다 */
  function decodeEntities(s) {
    if (!s || s.indexOf('&') === -1) return s || '';
    var ta = document.createElement('textarea');
    ta.innerHTML = s;
    return ta.value;
  }

  /* 제목 강조 — 일치 구간을 mark로 감싼다(이스케이프 후 조립) */
  function highlight(text, ranges) {
    if (!ranges || !ranges.length) return escapeHtml(text);
    var out = '';
    var cursor = 0;
    for (var i = 0; i < ranges.length; i++) {
      out += escapeHtml(text.slice(cursor, ranges[i][0]))
        + '<mark>' + escapeHtml(text.slice(ranges[i][0], ranges[i][1] + 1)) + '</mark>';
      cursor = ranges[i][1] + 1;
    }
    return out + escapeHtml(text.slice(cursor));
  }

  /* 본문 발췌 — 첫 일치 위치 주변 radius자. 원문을 자른 뒤 조각별 이스케이프해 mark로 감싼다 */
  function snippet(text, ranges, radius) {
    if (!ranges || !ranges.length || !text) return null;
    var start = Math.max(0, ranges[0][0] - radius);
    var end = Math.min(text.length, ranges[0][1] + 1 + radius);
    var out = (start > 0 ? '…' : '');
    var cursor = start;
    for (var i = 0; i < Math.min(ranges.length, 3); i++) {
      var rs = Math.max(ranges[i][0], start);
      var re = Math.min(ranges[i][1] + 1, end);
      if (re <= rs) continue;
      out += escapeHtml(text.slice(cursor, rs)) + '<mark>' + escapeHtml(text.slice(rs, re)) + '</mark>';
      cursor = re;
    }
    out += escapeHtml(text.slice(cursor, end));
    return out + (end < text.length ? '…' : '');
  }

  function findMatch(matches, key) {
    if (!matches) return null;
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].key === key) return matches[i].indices;
    }
    return null;
  }

  function fmtDate(iso) {
    var p = String(iso).split('-');
    return p[0] + '. ' + parseInt(p[1], 10) + '. ' + parseInt(p[2], 10) + '.';
  }

  function render(q, items) {
    resultsEl.innerHTML = '';
    if (!q) {
      setStatus('');
      if (suggestEl) suggestEl.hidden = false;
      return;
    }
    if (suggestEl) suggestEl.hidden = true;
    if (!items.length) {
      setStatus('‘' + q + '’에 맞는 글이 없습니다. 더 짧은 단어로 다시 찾아보세요.');
      return;
    }
    setStatus(items.length + '개의 글을 찾았습니다.');
    var frag = document.createDocumentFragment();
    items.slice(0, 12).forEach(function (it) {
      var d = it.item;
      var m = it.matches || [];
      var meta = [SECTION_LABELS[d.section] || '', d.breed || '', fmtDate(d.date)]
        .filter(Boolean).join(' · ');
      var snip = snippet(d.content, findMatch(m, 'content'), 60)
        || (d.desc ? escapeHtml(d.desc) : '');
      var li = document.createElement('li');
      li.className = 'search-result';
      li.innerHTML = '<div class="search-result-meta">' + escapeHtml(meta) + '</div>'
        + '<h3 class="search-result-title"><a href="' + d.url + '">' + highlight(d.title, findMatch(m, 'title')) + '</a></h3>'
        + '<p class="search-result-snippet">' + snip + '</p>';
      frag.appendChild(li);
    });
    resultsEl.appendChild(frag);
  }

  input.addEventListener('input', function () {
    var q = input.value.trim();
    if (history.replaceState) {
      history.replaceState(null, '', q ? '/search/?q=' + encodeURIComponent(q) : '/search/');
    }
    clearTimeout(timer);
    if (!q) { render('', []); return; }
    timer = setTimeout(function () {
      ensureIndex(function () { render(q, fuse.search(q, { limit: 12 })); });
    }, 180);
  });

  /* 헤더·추천 단어에서 /search/?q=… 로 들어온 경우 미리 채워 검색한다 */
  var initial = new URLSearchParams(location.search).get('q');
  if (initial && initial.trim()) {
    input.value = initial;
    ensureIndex(function () { render(initial.trim(), fuse.search(initial.trim(), { limit: 12 })); });
  }
})();
