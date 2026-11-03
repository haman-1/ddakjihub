// 출처 인용 스타일 — 본문의 괄호 인용(PetMD·위키백과 등)을 <span class="src">로 감싼다 (2026-11-04)
// 텍스트 노드만 처리하므로 링크·이미지 속성은 건드리지 않는다. 크롤러가 보는 HTML은 그대로다.
(function () {
  var re = /\(((?:[A-Z][A-Za-z가-힣0-9&.,;:·\-\s]{0,45})|(?:로얄캐닌|위키백과|국내 분양 가이드|모멘트원|압구정)[^)]{0,30})\)/g;
  var root = document.querySelector('.post-content');
  if (!root) return;
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function (node) {
    var text = node.nodeValue || '';
    var last = 0;
    var m;
    var frag = document.createDocumentFragment();
    var hit = false;
    while ((m = re.exec(text))) {
      hit = true;
      frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      var span = document.createElement('span');
      span.className = 'src';
      span.textContent = m[0];
      frag.appendChild(span);
      last = m.index + m[0].length;
    }
    if (hit) {
      frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    }
  });
})();
