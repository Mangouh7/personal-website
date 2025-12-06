// ====================================
// Spotify OAuth with PKCE
// ====================================

const SPOTIFY_CONFIG = {
    clientId: 'ef640275d3494247b4c9d3913de0c82d',
    redirectUri: 'https://mangouh7.github.io/personal-website/',
    scopes: 'user-read-currently-playing user-read-playback-state'
};

// Generate code verifier and challenge for PKCE
function generateCodeVerifier() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return base64URLEncode(array);
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return base64URLEncode(new Uint8Array(hash));
}

function base64URLEncode(array) {
    return btoa(String.fromCharCode.apply(null, array))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

// Start Spotify authentication
async function connectSpotify() {
    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('spotify_code_verifier', codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);

    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.append('client_id', SPOTIFY_CONFIG.clientId);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('redirect_uri', SPOTIFY_CONFIG.redirectUri);
    authUrl.searchParams.append('scope', SPOTIFY_CONFIG.scopes);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('code_challenge', codeChallenge);

    window.location.href = authUrl.toString();
}

// Handle OAuth callback
async function handleSpotifyCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (!code) return false;

    const codeVerifier = localStorage.getItem('spotify_code_verifier');
    if (!codeVerifier) return false;

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: SPOTIFY_CONFIG.clientId,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: SPOTIFY_CONFIG.redirectUri,
                code_verifier: codeVerifier,
            })
        });

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
            localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return true;
        }
    } catch (error) {
        console.error('Error getting Spotify token:', error);
    }

    return false;
}

// Refresh access token
async function refreshSpotifyToken() {
    const refreshToken = localStorage.getItem('spotify_refresh_token');
    if (!refreshToken) return false;

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: SPOTIFY_CONFIG.clientId,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })
        });

        const data = await response.json();

        if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
            localStorage.setItem('spotify_token_expiry', Date.now() + (data.expires_in * 1000));
            return true;
        }
    } catch (error) {
        console.error('Error refreshing Spotify token:', error);
    }

    return false;
}

// Get valid access token
async function getSpotifyAccessToken() {
    const token = localStorage.getItem('spotify_access_token');
    const expiry = localStorage.getItem('spotify_token_expiry');

    if (!token) return null;

    // Check if token is expired
    if (Date.now() >= parseInt(expiry)) {
        const refreshed = await refreshSpotifyToken();
        if (!refreshed) return null;
        return localStorage.getItem('spotify_access_token');
    }

    return token;
}

// Fetch currently playing track
async function fetchCurrentlyPlaying() {
    const accessToken = await getSpotifyAccessToken();

    if (!accessToken) return null;

    try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.status === 204) {
            return { isPlaying: false };
        }

        if (response.status === 200) {
            const data = await response.json();
            return {
                isPlaying: true,
                track: data.item.name,
                artist: data.item.artists.map(a => a.name).join(', '),
                album: data.item.album.name,
                image: data.item.album.images[1]?.url || data.item.album.images[0]?.url
            };
        }
    } catch (error) {
        console.error('Error fetching currently playing:', error);
    }

    return null;
}

// Disconnect Spotify
function disconnectSpotify() {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_code_verifier');
    location.reload();
}

// Check if user is authenticated
function isSpotifyAuthenticated() {
    return !!localStorage.getItem('spotify_access_token');
}
