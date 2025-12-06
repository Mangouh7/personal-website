# 🎵 Get Your Spotify Refresh Token

Follow these steps to get your refresh token:

## Step 1: Get Authorization Code

1. Open this URL in your browser (replace CLIENT_ID with yours):

```
https://accounts.spotify.com/authorize?client_id=ef640275d3494247b4c9d3913de0c82d&response_type=code&redirect_uri=http://localhost:8080/&scope=user-read-recently-played user-read-currently-playing user-read-playback-state
```

2. Log in to Spotify and click "Agree"

3. You'll be redirected to `http://localhost:8080/?code=XXXXXXXXXX`

4. **COPY THE CODE** from the URL (everything after `code=`)

## Step 2: Exchange Code for Refresh Token

1. Open PowerShell or Command Prompt

2. Run this command (replace YOUR_CODE with the code from step 1):

```powershell
$body = @{
    grant_type = "authorization_code"
    code = "YOUR_CODE_HERE"
    redirect_uri = "http://localhost:8080/"
    client_id = "ef640275d3494247b4c9d3913de0c82d"
    client_secret = "3127b6c4f8ff4aebbf68bcdcbe2936f0"
}

Invoke-RestMethod -Uri "https://accounts.spotify.com/api/token" -Method POST -Body $body -ContentType "application/x-www-form-urlencoded"
```

3. You'll get a response with `refresh_token`

4. **COPY THE REFRESH TOKEN** and paste it in `server.js` where it says `YOUR_REFRESH_TOKEN_HERE`

## Step 3: Update server.js

Open `server.js` and replace:
```javascript
REFRESH_TOKEN: 'YOUR_REFRESH_TOKEN_HERE'
```

With:
```javascript
REFRESH_TOKEN: 'your_actual_refresh_token_from_step_2'
```

## Step 4: Start the Server

```bash
npm install
npm start
```

## Done! 🎉

Your server will be running at `http://localhost:3000`

The website will automatically fetch your Spotify data!
