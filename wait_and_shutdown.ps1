$process = Get-WmiObject Win32_Process -Filter "CommandLine LIKE '%python%index_anatomy_vlm.py%'"

if ($process) {
    Write-Host "Found indexing process with ID: $($process.ProcessId)"
    Write-Host "Waiting for indexing to complete..."
    
    # Wait for the python process to finish
    Wait-Process -Id $process.ProcessId
    
    Write-Host "Indexing finished! Shutting down the system in 30 seconds..."
    
    # Stop ollama service gracefully if running
    $ollama = Get-Process -Name "ollama" -ErrorAction SilentlyContinue
    if ($ollama) {
        Stop-Process -Id $ollama.Id -Force
    }
    
    # Shutdown the laptop/system
    # /s = shutdown, /f = force close apps, /t 30 = 30 seconds delay
    shutdown /s /f /t 30 /c "Indexing completed successfully. Shutting down."
} else {
    Write-Host "Could not find a running indexing process. Are you sure it's running?"
}
