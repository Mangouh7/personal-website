@echo off
echo Starting local web server on http://localhost:8080
echo.
echo Your website will be available at: http://localhost:8080/index.html
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8080
