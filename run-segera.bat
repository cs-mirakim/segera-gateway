@echo off
title SEGERA - 10-Minute City Engine
cd /d "%~dp0"

echo ======================================================================
echo    SEGERA - Sistem Evaluasi Geografi & Aksesibiliti Rumah Malaysia
echo ======================================================================
echo.
echo [1/2] Membuka pelayar web di http://localhost:3000 ...
start "" "http://localhost:3000"
echo [2/2] Menjalankan pelayan pembangunan Next.js ...
echo.
echo Tekan Ctrl + C dalam tetingkap ini jika ingin memberhentikan sistem.
echo ======================================================================
echo.

npm run dev

pause
