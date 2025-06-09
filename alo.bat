@echo off

:: Mở cửa sổ terminal thứ nhất để chạy popmartBot.js
start "USABot" cmd /k "node USApopmart.js"

:: Mở cửa sổ terminal thứ hai để chạy USApopmart.js
start "USABot1" cmd /k "node USApopmart1.js"

start "USABot2" cmd /k "node USApopmart2.js"
