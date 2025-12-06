// ====================================
// Mobile Navigation Toggle
// ====================================
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger menu
        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ====================================
// Spotify Integration
// ====================================

async function fetchSpotifyData() {
    const spotifyContent = document.getElementById('spotify-content');
    if (!spotifyContent) return;

    try {
        // Check if user is authenticated
        if (!isSpotifyAuthenticated()) {
            displaySpotifyConnect();
            return;
        }

        // Fetch currently playing track
        const nowPlaying = await fetchCurrentlyPlaying();

        if (!nowPlaying) {
            displaySpotifyConnect();
            return;
        }

        if (!nowPlaying.isPlaying) {
            spotifyContent.innerHTML = `
                <div style="text-align: center; padding: var(--space-lg);">
                    <p style="color: var(--text-secondary); margin-bottom: var(--space-sm);">Nothing playing right now</p>
                    <button onclick="disconnectSpotify()" style="font-size: 12px; padding: 6px 12px; background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary);">Disconnect</button>
                </div>
            `;
            return;
        }

        // Display the actual track
        displaySpotifyTrack(nowPlaying);

        // Auto-refresh every 10 seconds
        setTimeout(fetchSpotifyData, 10000);

    } catch (error) {
        console.error('Error fetching Spotify data:', error);
        displaySpotifyConnect();
    }
}

function displaySpotifyConnect() {
    const spotifyContent = document.getElementById('spotify-content');
    spotifyContent.innerHTML = `
        <div style="text-align: center; padding: var(--space-lg);">
            <div style="font-size: 48px; margin-bottom: var(--space-md);">🎵</div>
            <h4 style="margin-bottom: var(--space-sm); color: var(--text-primary);">Connect Spotify</h4>
            <p style="color: var(--text-secondary); margin-bottom: var(--space-md); font-size: 14px;">See what you're listening to in real-time</p>
            <button onclick="connectSpotify()" class="btn btn-primary" style="font-size: 14px; padding: 10px 20px;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="margin-right: 6px;">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                Connect to Spotify
            </button>
        </div>
    `;
}

function displaySpotifyTrack(data) {
    const spotifyContent = document.getElementById('spotify-content');

    spotifyContent.innerHTML = `
        <div class="spotify-premium-card">
            <div class="spotify-glow"></div>
            <div class="spotify-content-wrapper">
                <div class="album-container">
                    <div class="album-shadow"></div>
                    <img src="${data.image}" alt="${data.track}" class="album-cover" />
                    <div class="playing-animation">
                        <div class="bar"></div>
                        <div class="bar"></div>
                        <div class="bar"></div>
                    </div>
                </div>
                
                <div class="track-details">
                    <div class="status-badge">
                        <span class="live-indicator"></span>
                        <span>NOW PLAYING</span>
                    </div>
                    
                    <h3 class="track-title">${data.track}</h3>
                    <p class="artist-name">${data.artist}</p>
                    <p class="album-title">${data.album}</p>
                    
                    ${data.url ? `
                        <a href="${data.url}" target="_blank" class="spotify-btn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                            </svg>
                            Listen on Spotify
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <style>
            .spotify-premium-card {
                position: relative;
                background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 20px;
                padding: 32px;
                overflow: hidden;
                box-shadow: 
                    0 0 0 1px rgba(255, 255, 255, 0.1),
                    0 20px 60px rgba(0, 0, 0, 0.1);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .spotify-premium-card:hover {
                transform: translateY(-4px);
                box-shadow: 
                    0 0 0 1px rgba(255, 255, 255, 0.2),
                    0 30px 80px rgba(0, 0, 0, 0.15);
            }
            
            .spotify-glow {
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
                animation: glowPulse 3s ease-in-out infinite;
                pointer-events: none;
            }
            
            @keyframes glowPulse {
                0%, 100% { opacity: 0.5; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.1); }
            }
            
            .spotify-content-wrapper {
                position: relative;
                display: flex;
                gap: 28px;
                align-items: center;
                z-index: 1;
            }
            
            .album-container {
                position: relative;
                flex-shrink: 0;
            }
            
            .album-shadow {
                position: absolute;
                bottom: -10px;
                left: 50%;
                transform: translateX(-50%);
                width: 90%;
                height: 20px;
                background: rgba(0, 0, 0, 0.3);
                filter: blur(15px);
                border-radius: 50%;
            }
            
            .album-cover {
                width: 140px;
                height: 140px;
                border-radius: 12px;
                object-fit: cover;
                display: block;
                box-shadow: 
                    0 10px 40px rgba(0, 0, 0, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
                transition: all 0.3s ease;
            }
            
            .album-container:hover .album-cover {
                transform: scale(1.05) rotate(2deg);
                box-shadow: 
                    0 15px 50px rgba(0, 0, 0, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.2);
            }
            
            .playing-animation {
                position: absolute;
                bottom: 12px;
                right: 12px;
                display: flex;
                gap: 3px;
                align-items: flex-end;
                height: 20px;
                padding: 6px 8px;
                background: rgba(29, 185, 84, 0.95);
                backdrop-filter: blur(10px);
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(29, 185, 84, 0.4);
            }
            
            .playing-animation .bar {
                width: 3px;
                background: white;
                border-radius: 2px;
                animation: barBounce 1s ease-in-out infinite;
            }
            
            .playing-animation .bar:nth-child(1) { height: 70%; animation-delay: 0s; }
            .playing-animation .bar:nth-child(2) { height: 50%; animation-delay: 0.2s; }
            .playing-animation .bar:nth-child(3) { height: 90%; animation-delay: 0.4s; }
            
            @keyframes barBounce {
                0%, 100% { transform: scaleY(1); }
                50% { transform: scaleY(0.3); }
            }
            
            .track-details {
                flex: 1;
                min-width: 0;
            }
            
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 6px 14px;
                background: linear-gradient(135deg, #1DB954 0%, #1ed760 100%);
                border-radius: 20px;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 1.5px;
                color: white;
                margin-bottom: 16px;
                box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3);
                animation: badgePulse 2s ease-in-out infinite;
            }
            
            @keyframes badgePulse {
                0%, 100% { box-shadow: 0 4px 15px rgba(29, 185, 84, 0.3); }
                50% { box-shadow: 0 4px 20px rgba(29, 185, 84, 0.5); }
            }
            
            .live-indicator {
                width: 8px;
                height: 8px;
                background: white;
                border-radius: 50%;
                animation: livePulse 1.5s ease-in-out infinite;
            }
            
            @keyframes livePulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.6; transform: scale(0.8); }
            }
            
            .track-title {
                font-size: 24px;
                font-weight: 800;
                color: var(--text-primary);
                margin: 0 0 8px 0;
                line-height: 1.2;
                letter-spacing: -0.5px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .artist-name {
                font-size: 16px;
                font-weight: 600;
                color: var(--text-secondary);
                margin: 0 0 4px 0;
            }
            
            .album-title {
                font-size: 14px;
                font-weight: 500;
                color: var(--text-tertiary);
                margin: 0 0 20px 0;
            }
            
            .spotify-btn {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                padding: 12px 24px;
                background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
                color: white;
                text-decoration: none;
                border-radius: 12px;
                font-size: 14px;
                font-weight: 600;
                box-shadow: 
                    0 4px 15px rgba(99, 102, 241, 0.3),
                    0 0 0 1px rgba(255, 255, 255, 0.1);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .spotify-btn:hover {
                transform: translateY(-2px);
                box-shadow: 
                    0 8px 25px rgba(99, 102, 241, 0.4),
                    0 0 0 1px rgba(255, 255, 255, 0.2);
                background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary) 100%);
            }
            
            @media (max-width: 650px) {
                .spotify-premium-card {
                    padding: 24px;
                }
                
                .spotify-content-wrapper {
                    flex-direction: column;
                    text-align: center;
                    gap: 24px;
                }
                
                .album-cover {
                    width: 160px;
                    height: 160px;
                }
                
                .spotify-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        </style>
    `;
}




// Football API Configuration
// Get a free API key from: https://www.api-football.com/
const FOOTBALL_API_KEY = 'YOUR_API_KEY_HERE';
const LIVERPOOL_TEAM_ID = 40; // Liverpool's team ID in the API

async function fetchLiverpoolMatch() {
    const footballContent = document.getElementById('football-content');

    if (!footballContent) return;

    try {
        // For demonstration, showing realistic match data
        // Sign up for a free API key at https://www.api-football.com/ to get live data
        displayFootballDemo();

        // Uncomment and use this when you have your API key:
        /*
        const response = await fetch(
            `https://v3.football.api-sports.io/fixtures?team=${LIVERPOOL_TEAM_ID}&last=1`,
            {
                headers: {
                    'x-rapidapi-key': FOOTBALL_API_KEY,
                    'x-rapidapi-host': 'v3.football.api-sports.io'
                }
            }
        );
        
        const data = await response.json();
        if (data.response && data.response.length > 0) {
            displayFootballMatch(data.response[0]);
        }
        */

    } catch (error) {
        console.error('Error fetching football data:', error);
        footballContent.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">Unable to load match data</p>';
    }
}

function displayFootballDemo() {
    const footballContent = document.getElementById('football-content');

    // Demo match data - replace with real API data
    const demoMatches = [
        { home: 'Liverpool', homeScore: 3, away: 'Man City', awayScore: 1, date: 'Dec 5, 2025' },
        { home: 'Liverpool', homeScore: 2, away: 'Chelsea', awayScore: 0, date: 'Dec 1, 2025' },
        { home: 'Arsenal', homeScore: 1, away: 'Liverpool', awayScore: 4, date: 'Nov 28, 2025' },
        { home: 'Liverpool', homeScore: 5, away: 'Newcastle', awayScore: 1, date: 'Nov 24, 2025' }
    ];

    const randomMatch = demoMatches[Math.floor(Math.random() * demoMatches.length)];

    footballContent.innerHTML = `
        <div class="match-info">
            <div class="match-teams">
                <div class="team">
                    <div class="team-name">${randomMatch.home}</div>
                    <div class="score">${randomMatch.homeScore}</div>
                </div>
                <div class="vs">-</div>
                <div class="team">
                    <div class="team-name">${randomMatch.away}</div>
                    <div class="score">${randomMatch.awayScore}</div>
                </div>
            </div>
            <p class="match-date">${randomMatch.date} • Premier League</p>
            <p style="font-size: 0.75rem; color: var(--text-tertiary); margin-top: 0.5rem;">Demo Mode - Connect API for live scores</p>
        </div>
    `;
}

function displayFootballMatch(fixture) {
    const footballContent = document.getElementById('football-content');
    const homeTeam = fixture.teams.home;
    const awayTeam = fixture.teams.away;
    const homeScore = fixture.goals.home;
    const awayScore = fixture.goals.away;
    const matchDate = new Date(fixture.fixture.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    footballContent.innerHTML = `
        <div class="match-info">
            <div class="match-teams">
                <div class="team">
                    <div class="team-name">${homeTeam.name}</div>
                    <div class="score">${homeScore ?? '-'}</div>
                </div>
                <div class="vs">-</div>
                <div class="team">
                    <div class="team-name">${awayTeam.name}</div>
                    <div class="score">${awayScore ?? '-'}</div>
                </div>
            </div>
            <p class="match-date">${matchDate} • ${fixture.league.name}</p>
        </div>
    `;
}

// ====================================
// Load Data on Page Load
// ====================================
document.addEventListener('DOMContentLoaded', async () => {
    // Handle Spotify OAuth callback
    await handleSpotifyCallback();

    // Only fetch data if we're on the home page
    if (document.getElementById('spotify-content')) {
        fetchSpotifyData();
    }

    if (document.getElementById('football-content')) {
        fetchLiverpoolMatch();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll animation to sections
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe cards with subtle fade-in
    const cards = document.querySelectorAll('.activity-card, .project-card, .interest-card, .link-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
});

// ====================================
// Utility: Update Footer Year
// ====================================
function updateFooterYear() {
    const year = new Date().getFullYear();
    const footerText = document.querySelector('.footer p');
    if (footerText) {
        footerText.textContent = `© ${year} Your Name. All rights reserved.`;
    }
}

updateFooterYear();

// ====================================
// Console Message (Easter Egg)
// ====================================
console.log('%c👋 Hey there!', 'font-size: 20px; font-weight: bold; color: #C8102E;');
console.log('%cThanks for checking out my website!', 'font-size: 14px; color: #b0b0b0;');
console.log('%cYou\'ll Never Walk Alone ⚽🔴', 'font-size: 12px; color: #C8102E;');
