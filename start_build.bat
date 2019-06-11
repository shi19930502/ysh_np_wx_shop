@echo off 
cmd /c "gulp clean"
cmd /c "npm run build"
cmd /c "gulp getZip"
cmd /k "exit"
