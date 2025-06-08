@echo off

:: Mở cửa sổ terminal thứ nhất để chạy popmartBot.js
start "Popmart Bot" cmd /k "node USApopmart1.js"

:: Mở cửa sổ terminal thứ hai để chạy USApopmart.js
start "USA Bot" cmd /k "node USApopmart.js"

start "USA1 Bot" cmd /k "node USApopmart2.js"
