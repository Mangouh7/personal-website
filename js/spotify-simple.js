// ====================================
// Simple Spotify Widget (Manual Update)
// ====================================

function initSpotifyWidget() {
    const spotifyContent = document.getElementById('spotify-content');
    if (!spotifyContent) return;

    // Check if there's a saved track
    const savedTrack = localStorage.getItem('current_track');

    if (savedTrack) {
        const track = JSON.parse(savedTrack);
        displayTrack(track);
    } else {
        // Show default track
        displayTrack({
            track: 'Blinding Lights',
            artist: 'The Weeknd',
            album: 'After Hours'
        });
    }
}

function displayTrack(data) {
    const spotifyContent = document.getElementById('spotify-content');

    // Create a color based on the song name
    const colors = ['#1DB954', '#E13287', '#1E3264', '#8B0000', '#FF6B6B', '#4ECDC4', '#9B59B6'];
    const colorIndex = (data.track.length + data.artist.length) % colors.length;
    const color = colors[colorIndex];

    spotifyContent.innerHTML = `
        <div class="spotify-info">
            <div class="spotify-artwork" style="background: linear-gradient(135deg, ${color} 0%, #191414 100%); display: flex; align-items: center; justify-content: center; color: white; font-size: 36px;">
                🎵
            </div>
            <div class="spotify-details">
                <h4>${data.track}</h4>
                <p>${data.artist}</p>
                <p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.25rem;">${data.album}</p>
                <div style="margin-top: var(--space-sm);">
                    <button onclick="updateSpotifyTrack()" style="font-size: 11px; padding: 4px 8px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary); transition: all 0.2s;">
                        ✏️ Update Song
                    </button>
                </div>
            </div>
        </div>
    `;
}

function updateSpotifyTrack() {
    const song = prompt('Song name:');
    if (!song) return;

    const artist = prompt('Artist name:');
    if (!artist) return;

    const album = prompt('Album name (optional):') || 'Single';

    const track = { track: song, artist: artist, album: album };
    localStorage.setItem('current_track', JSON.stringify(track));
    displayTrack(track);
}
