---
title: ""
date: {{ .Date }}
description: ""
kind: place
place_type: ""     # cafe | restaurant | hotel | pension | pool
region: ""         # 시·도 단위: 서울 | 경기 | 인천 | 부산 | 대구 | 강원 | 제주 ...
city: ""           # 시·군·구: 경기는 필수(고양·용인·양평...), 서울은 구 — 주소에서 기재
status: ""         # open | closed — 현재 운영 여부, 출처에서 확인된 경우만(미확인 시 비움)
address: ""
hours: ""
phone: ""
parking: ""
dog_rule: ""
checked: ""        # 정보 확인일 YYYY-MM-DD (필수)
source: ""         # 출처: 공식 홈페이지·인스타그램·네이버 지도 (필수)
draft: true
---

<!--
시설 DB 항목. 이용 정보(주소·시간 등)는 프런트매터로 쓰면 상세 페이지 표로 자동 노출되고,
주소가 있으면 지도(구글맵 임베드 + 네이버 지도 링크 버튼)도 자동으로 붙는다.

규칙:
- 공개된 사실(주소·영업시간·반려견 조건)만 담는다. 직접 방문한 것처럼 쓰지 않는다.
- checked(확인일)·source(출처)는 반드시 채우고, 출처에서 확인한 정보만 쓴다.
- 운영 여부(status)·시·군·구(city)도 출처에서 확인해 함께 기재한다(미확인은 비움).
- 본문 구조: 한 줄 소개 → 이용 팁(주의점·준비물) → 주변 정보. 표지 이미지는 두지 않는다.
- 발행 후 content/places/_index.md의 noindex·sitemap.disable 두 줄을 지운다(첫 글 한 번만).
-->

<!-- 한 줄 소개 -->
