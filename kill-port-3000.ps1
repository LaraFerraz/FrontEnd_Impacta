$port = 3000
$processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue

if ($processes) {
    foreach ($process in $processes) {
        $processId = $process.OwningProcess
        if ($processId -gt 0) {
            Write-Host "Matando processo PID $processId na porta $port..."
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Milliseconds 500
        }
    }
}

Write-Host "Porta $port liberada"
