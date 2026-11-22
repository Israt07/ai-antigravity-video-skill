Param(
    [string]$ProjectPath = "C:/Users/israt/faceless-shorts/inside-out",
    [string]$VoiceScript = "C:/Users/israt/Desktop/ai-antigravity-video-skill-main/ai-antigravity-video-skill-main/scripts/voice.py",
    [string]$ProgressHtml = "C:/Users/israt/.gemini/antigravity/brain/cbeef05a-4a24-4a41-b1f7-a2e31baac927/progress.html"
)

function Update-Status {
    param(
        [string]$StepId,
        [string]$Status
    )
    # Load file as an array of lines
    $lines = Get-Content -Path $ProgressHtml
    for ($i = 0; $i -lt $lines.Count; $i++) {
        # Build a regex that matches the <div> with the given id
        $pattern = '<div class="step[^"]*" id="' + $StepId + '"'
        if ($lines[$i] -match $pattern) {
            # Replace everything after the dash (‑ or -) with new status
            $lines[$i] = $lines[$i] -replace '- .*', "- $Status"
        }
    }
    Set-Content -Path $ProgressHtml -Value $lines -Encoding utf8
}

Push-Location $ProjectPath

# 1️⃣  Generate narration (creates narration.wav + lines.json)
Update-Status -StepId "step-voice" -Status "running"
# Run the voice script directly
python "$VoiceScript" .
if ($LASTEXITCODE -ne 0) { Update-Status -StepId "step-voice" -Status "failed"; exit $LASTEXITCODE }
Update-Status -StepId "step-voice" -Status "done"

# -------------------------------------------------
# 2️⃣  Build cue points (creates cues.json)
# -------------------------------------------------
Update-Status -StepId "step-cues" -Status "running"
node tools/capture.mjs cues
if ($LASTEXITCODE -ne 0) { Update-Status -StepId "step-cues" -Status "failed"; exit $LASTEXITCODE }
Update-Status -StepId "step-cues" -Status "done"

# -------------------------------------------------
# 3️⃣  Mix audio (creates mix.wav)
# -------------------------------------------------
Update-Status -StepId "step-mix" -Status "running"
python tools/mix.py
if ($LASTEXITCODE -ne 0) { Update-Status -StepId "step-mix" -Status "failed"; exit $LASTEXITCODE }
Update-Status -StepId "step-mix" -Status "done"

# -------------------------------------------------
# 4️⃣  Render video (creates renders/inside-out.mp4)
# -------------------------------------------------
Update-Status -StepId "step-render" -Status "running"
node tools/capture.mjs video renders/inside-out.mp4
if ($LASTEXITCODE -ne 0) { Update-Status -StepId "step-render" -Status "failed"; exit $LASTEXITCODE }
Update-Status -StepId "step-render" -Status "done"

Pop-Location
Write-Host "✅ Pipeline complete. Video at $ProjectPath/renders/inside-out.mp4"
