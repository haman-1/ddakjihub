# 이미지 원본 최적화 스크립트 — AI 생성 이미지 저장 직후 품질 82 JPEG로 재압축한다.
# 사용: .\scripts\optimize-image.ps1 -Path content\breeds\xxx\cover.jpg
# 빌드 타임 리사이즈와 별개로, 저장소에 올라가는 원본 자체를 가볍게 두기 위한 것(2026-09-18).

param(
  [Parameter(Mandatory = $true)][string]$Path
)

$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]82)

foreach ($f in (Get-ChildItem $Path)) {
  if ($f.Extension -notin ".jpg", ".jpeg") { continue }  # PNG 등은 그대로 둔다
  $img = [System.Drawing.Image]::FromFile($f.FullName)
  $tmp = "$($f.FullName).tmp"
  $img.Save($tmp, $codec, $ep)
  $img.Dispose()
  $origKB = [math]::Round($f.Length / 1KB)
  if ((Get-Item $tmp).Length -lt $f.Length) {
    Move-Item $tmp $f.FullName -Force
    "{0}: {1:N0}KB -> {2:N0}KB" -f $f.Name, $origKB, [math]::Round((Get-Item $f.FullName).Length / 1KB)
  } else {
    Remove-Item $tmp
    "{0}: 이미 충분히 작아 그대로 둔다" -f $f.Name
  }
}
