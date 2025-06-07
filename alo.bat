@echo off

:: Mở cửa sổ terminal thứ nhất để chạy popmartBot.js
start "Popmart Bot" cmd /k "node lazzda.js"

:: Mở cửa sổ terminal thứ hai để chạy USApopmart.js
start "USA Bot" cmd /k "node USApopmart.js"
