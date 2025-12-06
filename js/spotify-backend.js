// ====================================
// Spotify Widget with Backend
// ====================================

async function fetchSpotifyData() {
    const spotifyContent = document.getElementById('spotify-content');
    if (!spotifyContent) return;

    try {
        // Fetch from your backend
        const response = await fetch('http://localhost:3000/api/now-playing');
        const data = await response.json();

        if (!data.isPlaying || !data.name) {
            // If nothing is playing, show last played
            const lastPlayedResponse = await fetch('http://localhost:3000/api/last-played');
            const lastPlayed = await lastPlayedResponse.json();

            if (lastPlayed.name) {
                displayTrack(lastPlayed, false);
            } else {
                showNoTrack();
            }
        } else {
            // Show currently playing
            displayTrack(data, true);
        }

        // Auto-refresh every 10 seconds
        setTimeout(fetchSpotifyData, 10000);

    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        showError();
    }
}

function displayTrack(data, isPlaying) {
    const spotifyContent = document.getElementById('spotify-content');

    spotifyContent.innerHTML = `
        <div class="spotify-info">
            <img src="${data.albumArt}" alt="${data.name}" class="spotify-artwork" style="object-fit: cover;">
            <div class="spotify-details">
                <h4>${data.name}</h4>
                <p>${data.artist}</p>
                <p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">${data.album}</p>
                <div style="margin-top: var(--space-sm);">
                    ${isPlaying ? `
                        <span style="display: inline-flex; align-items: center; gap: 4px; font-size: 11px; color: var(--success);">
                            <span style="width: 6px; height: 6px; background: var(--success); border-radius: 50%; animation: pulse 2s infinite;"></span>
                            Now Playing
                        </span>
                    ` : `
                        <span style="font-size: 11px; color: var(--text-tertiary);">
                            Last Played
                        </span>
                    `}
                </div>
            </div>
        </div>
        <style>
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        </style>
    `;
}

function showNoTrack() {
    const spotifyContent = document.getElementById('spotify-content');
    spotifyContent.innerHTML = `
        <div style="text-align: center; padding: var(--space-lg);">
            <div style="font-size: 48px; margin-bottom: var(--space-sm);">🎵</div>
            <p style="color: var(--text-secondary); font-size: 14px;">No recent tracks found</p>
        </div>
    `;
}

function showError() {
    const spotifyContent = document.getElementById('spotify-content');
    spotifyContent.innerHTML = `
        <div style="text-align: center; padding: var(--space-lg);">
            <div style="font-size: 48px; margin-bottom: var(--space-sm);">⚠️</div>
            <p style="color: var(--text-secondary); font-size: 14px;">Could not connect to Spotify server</p>
            <p style="color: var(--text-tertiary); font-size: 12px; margin-top: var(--space-xs);">Make sure the backend is running</p>
        </div>
    `;
}
