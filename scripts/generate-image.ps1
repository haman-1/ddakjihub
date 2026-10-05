# 딱지허브 AI 일러스트 생성 스크립트
# 사용: .\scripts\generate-image.ps1 -Prompt "..." -Out content\breeds\xxx\cover.jpg
# API 키는 F:\SecretsKey\flux3-api-key.txt(저장소 밖, 두 사이트 공용)에서만 읽는다 — 절대 커밋 금지.
# 모델: Black Forest Labs FLUX 3 Image (BFL 공식 API — 2026-10-06 Gemini에서 전환, 백업: generate-image.gemini.bak.ps1)

param(
  [Parameter(Mandatory = $true)][string]$Prompt,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$AspectRatio = "16:9",
  [switch]$NoStyle
)

$ErrorActionPreference = "Stop"

# 실사(photorealistic) 가드 — 프롬프트에 실사 지시가 없으면 기본 접두사를 붙인다.
# 이 사이트의 AI 이미지 규칙은 '실사 스타일'이므로 일러스트가 나오는 것을 방지한다.
# 실사가 아닌 이미지가 필요하면 -NoStyle 스위치로 가드를 끈다.
$realisticMarkers = @("실사", "사진", "photorealistic", "realistic", "photo")
$isRealistic = ($realisticMarkers | Where-Object { $Prompt -match [regex]::Escape($_) }).Count -gt 0
if (-not $NoStyle -and -not $isRealistic) {
  $Prompt = "실사 사진 스타일(photorealistic photography, 자연스러운 조명과 질감, 일러스트 아님). " + $Prompt
  "주의: 실사 지시가 없어 기본 실사 접두사를 붙였습니다 (-NoStyle 로 끌 수 있음)"
}
$key = (Get-Content "F:\SecretsKey\flux3-api-key.txt" -Raw).Trim()
if (-not $key) { throw "키 파일 F:\SecretsKey\flux3-api-key.txt 가 비어 있습니다." }

# FLUX 3 Image는 비동기 API — 제출하면 polling_url을 주고, Ready가 될 때까지 폴링한 뒤 result.sample을 내려받는다
$body = @{
  prompt        = $Prompt
  aspect_ratio  = $AspectRatio
  resolution    = "1k"   # 768sq/1k/1.5k/2k/4k — 사이트 규격 16:9·1K 고정
} | ConvertTo-Json

$submit = Invoke-RestMethod `
  -Uri "https://api.bfl.ai/v1/flux-3-image" `
  -Method Post -Headers @{ "x-key" = $key } `
  -ContentType "application/json; charset=utf-8" `
  -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 120
if (-not $submit.polling_url) { throw "폴링 URL이 반환되지 않았습니다: $($submit | ConvertTo-Json -Depth 6)" }
"제출 완료 (id: $($submit.id)) — 생성 대기 중..."

$deadline = (Get-Date).AddMinutes(10)
$result = $null
# polling_url은 절대 URL로 오는 경우가 있다 — 상대 경로면 도메인을 붙인다
$pollUrl = if ($submit.polling_url -match "^https?://") { $submit.polling_url } else { "https://api.bfl.ai$($submit.polling_url)" }
while ($true) {
  if ((Get-Date) -ge $deadline) { throw "10분 안에 생성이 끝나지 않았습니다 (마지막 status: $($result.status))" }
  try {
    $result = Invoke-RestMethod -Uri $pollUrl -Headers @{ "x-key" = $key } -TimeoutSec 60
  } catch {
    # 실패 태스크는 HTTP 503으로도 온다 — body의 status를 먼저 본다
    if ($_.ErrorDetails.Message) { $result = $_.ErrorDetails.Message | ConvertFrom-Json } else { throw }
  }
  if ($result.status -eq "Ready") { break }
  if ($result.status -notin @("Pending", "Reasoning", "Generating")) {
    throw "생성 실패 (status: $($result.status)): $($result | ConvertTo-Json -Depth 6)"
  }
  Start-Sleep -Seconds 3
}
if (-not $result.result.sample) { throw "이미지 URL이 반환되지 않았습니다: $($result | ConvertTo-Json -Depth 6)" }

# 서명 URL은 1시간 후 만료 — x-key 없이 즉시 다운로드한다
$dir = Split-Path -Parent $Out
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
$tmp = "$Out.download"
Invoke-WebRequest -Uri $result.result.sample -OutFile $tmp -TimeoutSec 240

# 반환 형식을 파일 시그니처로 판별 — png로 오면 jpg(품질 82)로 재인코딩해 저장소 원본을 가볍게 둔다
# (optimize-image.ps1이 jpg만 압축하므로, png를 그대로 두면 2MB 원본이 저장소에 쌓인다)
$bytes = [IO.File]::ReadAllBytes($tmp)
$isPng  = ($bytes.Length -gt 8 -and $bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50 -and $bytes[2] -eq 0x4E -and $bytes[3] -eq 0x47)
$isJpeg = ($bytes.Length -gt 3 -and $bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8)
if (-not $isPng -and -not $isJpeg) { throw "알 수 없는 이미지 형식이 반환됐습니다 (처음 4바이트: $($bytes[0..3] -join ' '))" }
if ([IO.Path]::GetExtension($Out) -ne ".jpg") {
  $Out = [IO.Path]::ChangeExtension($Out, ".jpg")
  "주의: jpg 고정 저장이라 이름을 $Out 로 맞췄습니다"
}
if ($isPng) {
  Add-Type -AssemblyName System.Drawing
  $img = [System.Drawing.Image]::FromFile($tmp)
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)
  $img.Save($Out, $codec, $ep)
  $img.Dispose()
  Remove-Item $tmp
  "원본 png를 jpg 품질 82로 재인코딩했습니다"
} else {
  Move-Item $tmp $Out -Force
}
"{0} (image/jpeg, {1:N0} KB)" -f $Out, ((Get-Item $Out).Length / 1KB)
