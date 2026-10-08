$ErrorActionPreference = 'Stop'

Write-Host "==============================================="
Write-Host " TEREX AC40 PartBook - GitHub Setup"
Write-Host "==============================================="
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "Git belum terinstall. Install Git for Windows terlebih dahulu." -ForegroundColor Red
    exit 1
}

$root = Get-Location
if (-not (Test-Path (Join-Path $root 'index.html'))) {
    Write-Host "Jalankan script ini dari folder root project yang berisi index.html." -ForegroundColor Red
    exit 1
}

Write-Host "Project: $root"
Write-Host ""

$remote = Read-Host "Masukkan URL repository GitHub (contoh: https://github.com/USERNAME/terex-ac40-partbook.git)"
if ([string]::IsNullOrWhiteSpace($remote)) {
    Write-Host "URL repository tidak boleh kosong." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path (Join-Path $root '.git'))) {
    git init
}

git branch -M main

$existing = git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) {
    git remote set-url origin $remote
} else {
    git remote add origin $remote
}

Write-Host ""
Write-Host "Memeriksa file terbesar..."
$files = Get-ChildItem -Recurse -File | Where-Object { $_.FullName -notmatch '\\.git\\' }
$largest = $files | Sort-Object Length -Descending | Select-Object -First 10
$largest | ForEach-Object {
    $mb = [Math]::Round($_.Length / 1MB, 2)
    Write-Host ("{0,8} MB  {1}" -f $mb, $_.FullName.Substring($root.Path.Length + 1))
}

$tooLarge = $files | Where-Object { $_.Length -gt 100MB }
if ($tooLarge) {
    Write-Host ""
    Write-Host "ADA FILE > 100 MB. GitHub biasa akan menolak file tersebut." -ForegroundColor Red
    Write-Host "Gunakan Git LFS untuk file tersebut sebelum push."
    $tooLarge | ForEach-Object { Write-Host $_.FullName }
    exit 1
}

Write-Host ""
Write-Host "Menambahkan file..."
git add .

git status --short

Write-Host ""
$commit = Read-Host "Pesan commit [Initial TEREX AC40 PartBook]"
if ([string]::IsNullOrWhiteSpace($commit)) {
    $commit = 'Initial TEREX AC40 PartBook'
}

git commit -m $commit

Write-Host ""
Write-Host "Push ke GitHub..."
git push -u origin main

Write-Host ""
Write-Host "SELESAI." -ForegroundColor Green
Write-Host "Aktifkan GitHub Pages dari Settings > Pages > Deploy from a branch > main > /(root)."
