@echo off
echo Testing SmartFit Backend...
echo.

echo 1. Testing health endpoint...
curl -X GET http://localhost:8080/api/auth/health
echo.
echo.

echo 2. Testing authentication (should return 401)...
curl -X GET http://localhost:8080/api/checkin
echo.
echo.

echo 3. Testing with valid Firebase token...
echo This would require a valid Firebase ID token
echo.

echo Backend test completed!
echo.
echo Expected Results:
echo - Health endpoint: 200 OK
echo - Unauthenticated checkin: 401 Unauthorized
echo - This confirms authentication is working correctly
pause 