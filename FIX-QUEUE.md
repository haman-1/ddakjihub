# 기존 글 문맥 수정 큐 (2026-10-13)

> GSC 28일 노출순 → 미노출 → 시설 순서. 쇼츠 카드 9편은 본문 없어 제외. 총 75편.
> 처리: 딱지허브 세션에서 "문맥 수정해줘" + 원문/수정문 쌍 (회차당 최대 5편, edit-post 스킬). 완료 시 [ ] → [x]만 바꾼다.
> 검수 프롬프트(대표님): 본문을 GPT/재미나이에 붙이고 "한국어·문맥만 자연스럽게 고쳐줘 — 제목 구조·내부 링크·이미지 숏코드·사실·숫자는 유지"
> 완료 후(75/75): 배치 커밋 diff에서 (원문→교정) 쌍 추출 → 반복 오류 패턴 마이닝(문체 규칙 개선). 원본은 git에 남으므로 추출 시점은 무관 — 허브 세션에 요청
> 대기(대표님): ⓐ 검수 프롬프트에 "고칠 수 없는 사실 오류·앞뒤 모순은 [의심]만 표시" 한 줄 추가 여부 ⓑ "말도안되는 소리" 예시 1~2개 → 문체/사실 원인 분류 후 규칙 반영

## ① GSC 노출순 (35)

- [x] `/breeds/belgian-malinois/` — 말리노이즈 허브 (노출 169)
- [x] `/guides/retriever-types/` — 리트리버 6종 도감 (161)
- [x] `/guides/dog-muzzle/` — 입마개 (112)
- [x] `/guides/dog-bath-schedule/` — 목욕 주기 (61)
- [ ] `/breeds/border-collie/` — 보더콜리 허브 (41)
- [ ] `/guides/dog-nail-trimming/` — 발톱 관리 (39)
- [ ] `/breeds/maltese-exercise/` — 말티즈 운동량 (32)
- [ ] `/breeds/shiba-inu-colors/` — 시바 색상 (28)
- [ ] `/guides/choosing-animal-hospital/` — 동물병원 고르기 (20)
- [ ] `/breeds/maltese-tear-stains/` — 말티즈 눈물자국 (19)
- [ ] `/breeds/shiba-inu-shedding/` — 시바 털갈이 (18)
- [ ] `/breeds/bull-terrier-derived-breeds/` — 불테리어 파생 견종 (16)
- [ ] `/breeds/dachshund/` — 닥스훈트 허브 (15)
- [ ] `/guides/dog-basic-training/` — 기본 훈련 (15)
- [ ] `/guides/small-dog-types/` — 소형견 8종 (13)
- [ ] `/breeds/golden-retriever/` — 골든 허브 (10)
- [ ] `/guides/dog-walking/` — 산책 (10)
- [ ] `/breeds/cane-corso-colors/` — 카네코르소 색상 (7)
- [ ] `/daily/ddakji-3d-printed-mask/` — 3D프린터 가면 (5)
- [ ] `/breeds/old-english-sheepdog/` — 올드 잉글리시 쉽독 허브 (5)
- [ ] `/breeds/golden-retriever-health/` — 골든 유전병 (4)
- [ ] `/guides/choosing-dog-food/` — 사료 고르기 (4)
- [ ] `/guides/dog-patellar-luxation/` — 슬개골 탈구 (4)
- [ ] `/breeds/golden-retriever-colors/` — 골든 색상 (3)
- [ ] `/breeds/shiba-inu-apartment/` — 시바 아파트 (3)
- [ ] `/guides/dog-brush-comparison/` — 빗·브러시 비교 (2)
- [ ] `/guides/dog-periodontal-disease/` — 치주질환 (2)
- [ ] `/guides/home-nosework/` — 집 노즈워크 (2)
- [ ] `/breeds/maltese/` — 말티즈 허브 (2)
- [ ] `/breeds/poodle/` — 푸들 허브 (1)
- [ ] `/guides/dog-apartment-guide/` — 아파트 가이드 (1)
- [ ] `/guides/dog-refuses-walk/` — 산책 거부 (1)
- [ ] `/guides/dog-ticks/` — 진드기 (1)
- [ ] `/guides/dog-walk-mistakes/` — 산책 실수 9가지 (1)
- [ ] `/guides/troublemaker-dogs-top3/` — 말썽 견종 탑3 (1)

## ② 미노출 (30)

- [ ] `/breeds/border-collie-colors/` — 보더콜리 색상
- [ ] `/breeds/border-collie-exercise/` — 보더콜리 운동량
- [ ] `/daily/ddakji-birth-to-two/` — 탄생부터 두 살까지
- [ ] `/breeds/border-collie-grooming/` — 보더콜리 털 관리
- [ ] `/breeds/border-collie-apartment/` — 보더콜리 아파트
- [ ] `/guides/dog-ball-play/` — 공놀이
- [ ] `/breeds/golden-retriever-exercise/` — 골든 운동량
- [ ] `/guides/hound-types/` — 하운드 9종
- [ ] `/breeds/shiba-inu/` — 시바 허브
- [ ] `/breeds/italian-hound/` — 이탈리안 하운드 허브
- [ ] `/breeds/italian-hound-colors/` — 이탈리안 하운드 색상
- [ ] `/breeds/bull-terrier/` — 불테리어 허브
- [ ] `/breeds/maltese-food/` — 말티즈 사료
- [ ] `/breeds/cane-corso/` — 카네코르소 허브
- [ ] `/breeds/german-shepherd/` — 저먼 셰퍼드 허브
- [ ] `/breeds/italian-hound-exercise/` — 이탈리안 하운드 운동량
- [ ] `/breeds/italian-greyhound/` — 이탈리안 그레이하운드 허브
- [ ] `/guides/dog-licking-owner/` — 핥는 이유
- [ ] `/guides/dog-symptom-check/` — 이상 증상 확인
- [ ] `/breeds/labrador-retriever/` — 래브라도 허브
- [ ] `/tools/dog-age/` — 나이 계산기
- [ ] `/tools/dog-food-amount/` — 사료량 계산기
- [ ] `/tools/dog-ideal-weight/` — 적정 체중 계산기
- [ ] `/tools/dog-daily-calories/` — 열량 계산기
- [ ] `/tools/dog-treat-calories/` — 간식 열량 계산기
- [ ] `/tools/dog-whelping-date/` — 임신·출산 계산기
- [ ] `/guides/golden-vs-labrador/` — 골든 vs 래브라도
- [x] `/breeds/labrador-retriever-colors/` — 래브라도 색상
- [ ] `/daily/ddakji-nexgard-spectra-year-supply/` — 예방약 비용
- [ ] `/breeds/belgian-malinois-exercise/` — 말리노이즈 운동량

## ③ 시설 (10)

- [ ] `/places/gyeonaega-goyang/` — 견애가
- [ ] `/places/artnewyork-ilsan/` — 아트스뉴욕 밤리단길
- [ ] `/places/meongmeongground-gwangju/` — 멍멍그라운드
- [ ] `/places/ilovemydog-gwangju/` — 아이러브마이독
- [ ] `/places/cocovalley-gwangju/` — 코코밸리
- [ ] `/places/elfgaenims-yangpyeong/` — 엘프개님스
- [ ] `/places/poripori-yeoju/` — 포리포리
- [ ] `/places/norigae-yongin/` — 노리개운동장
- [ ] `/places/heungmanso-icheon/` — 흥만소
- [ ] `/places/seowonangil-hapjeong/` — 서원안길 합정
