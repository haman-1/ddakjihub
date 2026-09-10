# 로컬 미리보기 — hugo server를 띄우고 실제 서버 포트로 브라우저를 자동으로 연다.
# Hugo 0.165는 -b의 포트를 무시하고 1313부터 시도하다, 이 컴퓨터처럼 1313이
# 윈도우 예약 포트(1037~1536)에 걸리면 임의 포트로 떨어진다(2026-09-11 확인).
# 그래서 고정 포트를 노리는 대신 로그에서 실제 주소를 찾아 브라우저로 연다.
# CSS는 상대 경로로 렌더링되어 어느 포트든 정상 표시된다.
# 드래프트 포함 미리보기는 `.\scripts\dev.ps1 -D`로 실행한다.
$log = Join-Path $env:TEMP 'ddakjihub-hugo.log'
Remove-Item $log -ErrorAction SilentlyContinue
$proc = Start-Process -FilePath 'hugo' -ArgumentList @('server','-b','http://localhost:13131/') @args -NoNewWindow -PassThru -RedirectStandardOutput $log -RedirectStandardError (Join-Path $env:TEMP 'ddakjihub-hugo.err.log')
try {
  $url = $null
  for ($i = 0; $i -lt 40 -and -not $url; $i++) {
    Start-Sleep -Milliseconds 500
    if (Test-Path $log) {
      $m = Select-String -Path $log -Pattern 'http://localhost:(\d+)/' | Select-Object -Last 1
      if ($m) { $url = "http://localhost:$($m.Matches[0].Groups[1].Value)/" }
    }
  }
  if ($url) {
    Write-Host "미리보기: $url  (멈추려면 이 창에서 Ctrl+C)"
    Start-Process $url
  } else {
    Write-Host "서버 주소를 찾지 못했습니다. 로그: $log"
  }
  $proc.WaitForExit()
} finally {
  if (-not $proc.HasExited) { Stop-Process -Id $proc.Id -Force }
}
