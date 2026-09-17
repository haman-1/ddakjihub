# 딱지허브 AI 일러스트 생성 스크립트
# 사용: .\scripts\generate-image.ps1 -Prompt "..." -Out content\breeds\xxx\cover.png
# API 키는 루트 .env(GEMINI_API_KEY=...)에서만 읽는다 — 공개 저장소에 커밋 금지.
# 모델: gemini-3.1-flash-image (2026-09-09 확정, 프로젝트 규칙)

param(
  [Parameter(Mandatory = $true)][string]$Prompt,
  [Parameter(Mandatory = $true)][string]$Out,
  [string]$Model = "gemini-3.1-flash-image",
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
$root = Split-Path -Parent $PSScriptRoot
$envLine = Get-Content (Join-Path $root ".env") | Where-Object { $_ -match "^GEMINI_API_KEY=" }
if (-not $envLine) { throw ".env 에 GEMINI_API_KEY 가 없습니다." }
$key = $envLine.Split("=", 2)[1].Trim()

$body = @{
  contents        = @(@{ parts = @(@{ text = $Prompt }) })
  generationConfig = @{
    responseModalities = @("IMAGE")
    imageConfig        = @{ aspectRatio = $AspectRatio }
  }
} | ConvertTo-Json -Depth 8

$resp = Invoke-RestMethod `
  -Uri "https://generativelanguage.googleapis.com/v1beta/models/$($Model):generateContent" `
  -Method Post -Headers @{ "x-goog-api-key" = $key } `
  -ContentType "application/json; charset=utf-8" `
  -Body ([Text.Encoding]::UTF8.GetBytes($body)) -TimeoutSec 240

$part = $resp.candidates[0].content.parts | Where-Object { $_.inlineData } | Select-Object -First 1
if (-not $part) { throw "이미지가 반환되지 않았습니다: $($resp | ConvertTo-Json -Depth 6)" }

# 반환된 실제 형식과 확장자가 다르면 이름을 맞춘다 (예: jpeg인데 .png로 저장하는 것 방지)
$ext = switch ($part.inlineData.mimeType) {
  "image/jpeg" { ".jpg" }
  "image/png"  { ".png" }
  "image/webp" { ".webp" }
  default      { [IO.Path]::GetExtension($Out) }
}
if ([IO.Path]::GetExtension($Out) -ne $ext) {
  $Out = [IO.Path]::ChangeExtension($Out, $ext)
  "주의: 반환 형식이 $($part.inlineData.mimeType)라 저장 이름을 $Out 로 맞췄습니다"
}

$dir = Split-Path -Parent $Out
if ($dir -and -not (Test-Path $dir)) { New-Item -ItemType Directory -Force $dir | Out-Null }
[IO.File]::WriteAllBytes($Out, [Convert]::FromBase64String($part.inlineData.data))
"{0} ({1}, {2:N0} KB)" -f $Out, $part.inlineData.mimeType, ((Get-Item $Out).Length / 1KB)
