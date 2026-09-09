# 디자인 기준 — aspca.org 추출 시안 (2026-09-09)

> 영문 디자인 프롬프트(aspca.org 분석 결과)를 프로젝트 디자인 기준으로 채택.
> 한글 사이트이므로 폰트만 Pretendard로 대체하고, 색·형태·타입 스케일은 원 시안 값을 따른다.

## Core Spec (최우선)
- 페이지 배경: `#fff9e5` (에그셸) — 전체 페이지가 이 색 위에 렌더링. 중립 회색(bg-white, zinc-50 등)으로 대체 금지
- Primary action: `#002e4d` (딥 네이비) — CTA·버튼·링크·포커스 링·활성 상태 전부 이 색. Tailwind blue-500 등 대체 금지
- Secondary accent: `#f75f00` (오렌지) — 카테고리·상태·장식 용도 한정. Primary와 호환 금지
- Heading: "AvantGarde Bold" → **Pretendard Bold(700~800)로 대체**
- Body/UI: "Helvetica Now Light" → **Pretendard(400)로 대체**
- Radius 계열: **4px** 시작 (sharp, engineered feel)
- Motion base: 600ms editorial — 단, **즉시 노출 규칙(아래) 우선**

## 색 역할 매핑
- Primary action `#002e4d`: CTA, 버튼, 링크, 포커스, 본문 강조 링크
- Surface base `#fff9e5`: 페이지·카드·모달 배경
- Surface elevated `#ffffff` / 카드 `#faf4e0`: 섹션 구분은 흰색 vs #fff9e5 온오프로 — **절대 어두운 배경 섹션 금지**
- Text primary `#002e4d`: 제목·본문 강조 / 본문 `#272626`
- Border `rgba(0,0,0,0.08)`: 카드 테두리, 구분선, 폼 보더
- Semantic: success `#22c55e` · error `#ef4444` · warning `#f59e0b`

## 브랜드 스케일
brand-50 `#f4f8fa` · 100 `#e4eff6` · 200 `#c6e0f1` · 300 `#91ccf3` · 400 `#47b6ff` · **500 `#002e4d`** · 600 `#0087e0` · 700 `#006eb8` · 800 `#00568f` · 900 `#053c61`

## 타입 스케일
- H1: 60px/400 (hero display, 페이지 타이틀)
- H2: 48px/400 (섹션 헤더)
- H3: 33px/400 (피처·카드 제목)
- Body: 18px/27px, 읽기 폭 60–70ch
- 폰트 웨이트: 400, 700

## 형태·간격
- radius: 4px (input/small) — 날카로운 기하학
- 입력창: 높이 40px, bg #ffffff, border 1px solid rgb(216,215,218), 4px radius, focus outline 2px solid #002e4d offset 2px
- 컨테이너 max-width: 1200px 내외 (원 시안 2000px는 한국 블로그 본문에 과하므로 가독 기준으로 축소 적용)
- 버튼: 4px radius, #002e4d bg, padding 10px 20px, weight 600, hover brightness(0.92), active scale(0.98)

## 섹션 리듬
- 전체적으로 라이트 톤 유지. 섹션 구분은 흰색/#fff9e5 미묘한 틴트 차이 + 넉넉한 세로 패딩(80–120px)
- 이미지는 섹션 분위기를 담당 (cinematic, emotional)

## 상호작용 규칙
- **즉시 노출(핵심 규칙):** 모든 콘텐츠는 로드 즉시 보여야 한다. opacity:0 초기화, IntersectionObserver, 스크롤 트리거 애니메이션 금지
- Hover: 그림자/변환으로 명시적 반응
- 링크: #002e4d, 밑줄 없음

## 미적용 항목 (판단 기록)
- 원 사진 cinematic 히어로 → 본인 사진 확보 전까지는 일러스트 유지
- 어두운 배경(dark mode) → 시안이 라이트 전용이므로 사이트도 라이트 고정 (defaultTheme=light, 토글 비활성)
