@echo off
REM Script de inicio para PM2
cd /d C:\Users\CyT3\Documents\Deploy\ocgn_ordenes
C:\Users\CyT3\Documents\Deploy\ocgn_ordenes\.venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8008
