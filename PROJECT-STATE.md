# 딱지허브 진행 기록 (2026-09-09 뼈대 재구축)

> 이 문서가 진행 상황의 유일한 기록. 새 세션은 이 파일과 `CLAUDE.md`를 먼저 읽는다.
> **디자인은 별도 단계** — 사용자가 디자인 자료를 공유한 뒤 진행 (현재 기준 초안: `DESIGN-aspca.org.md`)

## 프로젝트 한 줄

한국어 반려동물(개 중심) 정보 사이트 **딱지허브** (https://ddakjihub.com/). 목표는 AdSense 광고 수익 + 제휴 수익. 에버그린 검색형 콘텐츠, 허브-스포크 구조.

## 2026-09-09 뼈대 재구축 — 완료

**사유:** 초반에 다른 사이트(aidaily) 구조를 복제해 시작했으나, 이 사이트의 목적(반려동물 콘텐츠·광고 수익)과 맞지 않는 테마·설정·디자인 패턴이 함께 따라왔다. 콘텐츠가 쌓인 뒤엔 고치기 어려우므로 본격 발행 전에 전면 재구성했다. 콘텐츠 전략·문체 규칙은 그대로 유지.

**새 뼈대 (전부 이 저장소 안, 테마·서브모듈 없음):**
- 레이아웃 `layouts/` (baseof·single·list·index·404·archives + partials head/header/footer/card)
- 스타일 `assets/css/main.css` — **임시 최소 스타일. 디자인 단계에서 교체 예정**
- 콘텐츠 구조: 한 글 = 한 디렉터리(페이지 번들). 섹션 breeds(허브+스포크) / guides(실용·리뷰) / daily(일상)
  - 스포크는 `<견종슬러그>-<주제>` 형제 디렉터리 규칙 (리프 번들 중첩 불가 제약 + 같은 견종끼리 정렬)
- series 택소노미로 허브-스포크 자동 연결 (본문 하단 '관련 글'), kind·breed 프런트매터
- 아키타입 4종: `hugo new -k hub|spoke|guide|daily …` — 유형별 템플릿 내장
- 예시 글(드래프트): `content/breeds/border-collie/`(허브) + `border-collie-colors/`(스포크) — 구조 확인용이며 실제 발행 시 원 출처 리서치 후 새로 작성
- 검색 페이지는 제거(구 테마 전용 기능). /archives/는 자체 레이아웃으로 전체 글 연도별 목록
- 빌드 검증 완료: 드래프트 포함/제외 모두 에러 없음, 시리즈 자동 링크·택소노미 페이지 정상
- 교체된 구 테마 시절 미커밋 작업물은 `legacy-papermod/`에 보관 — 참고할 일 없으면 삭제해도 됨

## 저장소·도메인 (2026-09-09 클리어 → 재구축 배포 완료)

- **새 저장소**: https://github.com/haman-1/ddakjihub (공개, 새 히스토리 — 재구축 커밋 1개로 시작)
- **배포 검증 완료**: Pages Source = GitHub Actions · 커스텀 도메인 ddakjihub.com 재연결 · 인증서 승인(apex+www, ~2026-12-08) · HTTPS 강제 적용 · `https://ddakjihub.com/` 200 OK · www 301 확인
- DNS(등록부에 유지 중): A `@` → 185.199.108/109/110/111.153 · CNAME `www` → haman-1.github.io
- **남은 클리어**: 구 저장소 `haman-1/-ddakjihub` 삭제 — Pages는 이미 해제(도메인 충돌 없음). 삭제는 `delete_repo` 스코프가 필요해 사용자 직접 실행: 터미널에 `! gh auth refresh -h github.com -s delete_repo` 로 스코프 부여 뒤 `gh repo delete haman-1/-ddakjihub --yes` (또는 GitHub 웹에서 삭제)
- 구 히스토리 백업: `legacy-papermod/repo-history-old.bundle` (로컬 전용, gitignore 처리됨)

## 다음 단계

- [ ] **디자인 단계** — 사용자가 디자인 자료 공유 후 진행. `DESIGN-aspca.org.md`가 현재 기준 초안 (에그셸 #fff9e5 / 네이비 #002e4d / 오렌지 #f75f00 / radius 4px / 라이트 전용 / Pretendard)
- [ ] 구 저장소(`-ddakjihub`) 삭제 — 위 안내대로 사용자 액션 필요
- [ ] contact·privacy의 `[이메일 주소]` 등 플레이스홀더 교체
- [ ] 초기 콘텐츠: 품종 허브 1호(개인 사진·경험 중심) + 스포크 2~3편 — 초반은 질 우선
- [ ] GSC·네이버 서치어드바이저 등록 (`hugo.toml`의 naverSiteVerification 입력)
- [ ] 글 20~30개 + 플레이스홀더 교체 후 AdSense 신청 → 쿠팡파트너스
