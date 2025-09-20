// AmpliKIT Insights Theme - JavaScript Functionality

// Global state
let isPlaying = false;
let currentTime = 0;
let duration = 154; // 2:34 in seconds
let volume = 0.75;
let isMuted = false;
let isRepeating = false;
let currentEpisode = 1;

// Audio context for waveform visualization
let audioContext;
let analyser;
let dataArray;

// Initialize theme
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    setupIntersectionObserver();
    initializeAudioContext();
});

// Theme initialization
function initializeTheme() {
    // Add loading states
    addLoadingStates();
    
    // Initialize audio player
    initializeAudioPlayer();
    
    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Initialize tooltips
    initializeTooltips();
}

// Audio player functionality
function initializeAudioPlayer() {
    const playButton = document.getElementById('playIcon');
    const progressBar = document.querySelector('.waveform-progress');
    const currentTimeDisplay = document.querySelector('.current-time');
    
    if (playButton) {
        updatePlayButton();
    }
    
    if (progressBar) {
        updateProgress();
    }
    
    if (currentTimeDisplay) {
        updateTimeDisplay();
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    updatePlayButton();
    
    if (isPlaying) {
        startPlayback();
    } else {
        pausePlayback();
    }
    
    // Add visual feedback
    const playButton = document.querySelector('.play-button');
    if (playButton) {
        playButton.classList.add('animate-pulse');
        setTimeout(() => {
            playButton.classList.remove('animate-pulse');
        }, 200);
    }
}

function updatePlayButton() {
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.textContent = isPlaying ? '⏸️' : '▶️';
    }
}

function startPlayback() {
    // Simulate audio playback
    const progressBar = document.querySelector('.waveform-progress');
    if (progressBar) {
        animateProgress();
    }
    
    // Start waveform animation
    startWaveformAnimation();
}

function pausePlayback() {
    // Stop progress animation
    if (window.progressAnimation) {
        clearInterval(window.progressAnimation);
    }
    
    // Stop waveform animation
    stopWaveformAnimation();
}

function animateProgress() {
    const progressBar = document.querySelector('.waveform-progress');
    if (!progressBar) return;
    
    const startTime = currentTime;
    const startTimestamp = Date.now();
    
    window.progressAnimation = setInterval(() => {
        if (!isPlaying) return;
        
        const elapsed = (Date.now() - startTimestamp) / 1000;
        currentTime = Math.min(startTime + elapsed, duration);
        
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = `${progress}%`;
        
        updateTimeDisplay();
        
        if (currentTime >= duration) {
            if (isRepeating) {
                currentTime = 0;
                progressBar.style.width = '0%';
            } else {
                isPlaying = false;
                updatePlayButton();
                clearInterval(window.progressAnimation);
            }
        }
    }, 100);
}

function updateTimeDisplay() {
    const currentTimeDisplay = document.querySelector('.current-time');
    if (currentTimeDisplay) {
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function seekTo(event) {
    const waveformContainer = event.currentTarget;
    const rect = waveformContainer.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    
    currentTime = percentage * duration;
    const progressBar = document.querySelector('.waveform-progress');
    if (progressBar) {
        progressBar.style.width = `${percentage * 100}%`;
    }
    
    updateTimeDisplay();
    
    // Add visual feedback
    waveformContainer.style.transform = 'scale(0.98)';
    setTimeout(() => {
        waveformContainer.style.transform = 'scale(1)';
    }, 150);
}

function previousTrack() {
    if (currentEpisode > 1) {
        currentEpisode--;
        loadEpisode(currentEpisode);
    }
    
    // Add visual feedback
    const button = event.target.closest('.control-button');
    if (button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

function nextTrack() {
    if (currentEpisode < 6) { // Assuming 6 episodes
        currentEpisode++;
        loadEpisode(currentEpisode);
    }
    
    // Add visual feedback
    const button = event.target.closest('.control-button');
    if (button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

function loadEpisode(episodeNumber) {
    // Reset player state
    isPlaying = false;
    currentTime = 0;
    updatePlayButton();
    
    const progressBar = document.querySelector('.waveform-progress');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    updateTimeDisplay();
    
    // Update episode info (in a real app, this would load actual episode data)
    const episodeTitles = [
        "The Future of AI in Business",
        "Innovation in Remote Work", 
        "Sustainable Technology Solutions",
        "Cybersecurity Best Practices",
        "Data Analytics for Decision Making",
        "Digital Marketing Trends 2024"
    ];
    
    const episodeDescriptions = [
        "AI Revolution in Business Operations",
        "Remote Work Innovation Strategies",
        "Green Technology Solutions",
        "Essential Security Protocols",
        "Data-Driven Business Intelligence",
        "Modern Marketing Techniques"
    ];
    
    const playerInfo = document.querySelector('.player-info');
    if (playerInfo) {
        const title = playerInfo.querySelector('h3');
        const description = playerInfo.querySelector('p');
        
        if (title) title.textContent = `AmpliKIT Insights - Episode ${episodeNumber}`;
        if (description) description.textContent = episodeDescriptions[episodeNumber - 1];
    }
    
    // Update playlist active state
    updatePlaylistActiveState(episodeNumber - 1);
    
    // Add loading animation
    showLoadingState();
    setTimeout(() => {
        hideLoadingState();
    }, 1000);
}

function updatePlaylistActiveState(activeIndex) {
    const playlistItems = document.querySelectorAll('.playlist-item');
    playlistItems.forEach((item, index) => {
        if (index === activeIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

function toggleMute() {
    isMuted = !isMuted;
    const volumeIcon = document.getElementById('volumeIcon');
    if (volumeIcon) {
        volumeIcon.textContent = isMuted ? '🔇' : '🔊';
    }
    
    // Add visual feedback
    const button = event.target.closest('.control-button');
    if (button) {
        button.style.transform = 'scale(0.9)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }
}

function setVolume(value) {
    volume = value / 100;
    const volumeIcon = document.getElementById('volumeIcon');
    if (volumeIcon && !isMuted) {
        if (volume === 0) {
            volumeIcon.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeIcon.textContent = '🔉';
        } else {
            volumeIcon.textContent = '🔊';
        }
    }
}

function toggleRepeat() {
    isRepeating = !isRepeating;
    const button = event.target.closest('.control-button');
    if (button) {
        if (isRepeating) {
            button.style.backgroundColor = 'var(--primary-color)';
            button.style.color = 'white';
        } else {
            button.style.backgroundColor = '';
            button.style.color = '';
        }
    }
}

// Waveform animation
function initializeAudioContext() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    } catch (e) {
        console.log('Web Audio API not supported');
    }
}

function startWaveformAnimation() {
    if (!analyser) return;
    
    const waveform = document.querySelector('.waveform');
    if (!waveform) return;
    
    function animate() {
        if (!isPlaying) return;
        
        // Simulate waveform data
        const bars = 50;
        let html = '';
        
        for (let i = 0; i < bars; i++) {
            const height = Math.random() * 100;
            html += `<div class="waveform-bar" style="height: ${height}%;"></div>`;
        }
        
        waveform.innerHTML = html;
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

function stopWaveformAnimation() {
    const waveform = document.querySelector('.waveform');
    if (waveform) {
        waveform.innerHTML = '';
    }
}

// Episode management
function playEpisode(episodeNumber) {
    currentEpisode = episodeNumber;
    loadEpisode(episodeNumber);
    
    // Scroll to player
    const playerSection = document.querySelector('.player-section');
    if (playerSection) {
        playerSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Add visual feedback
    const episodeCard = event.currentTarget;
    episodeCard.style.transform = 'scale(0.98)';
    setTimeout(() => {
        episodeCard.style.transform = 'scale(1)';
    }, 150);
}

function playFromPlaylist(index) {
    currentEpisode = index + 1;
    loadEpisode(currentEpisode);
    
    // Scroll to player
    const playerSection = document.querySelector('.player-section');
    if (playerSection) {
        playerSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function playRandomEpisode() {
    const randomEpisode = Math.floor(Math.random() * 6) + 1;
    playEpisode(randomEpisode);
}

function showPlaylist() {
    const playlistSection = document.getElementById('playlist');
    if (playlistSection) {
        playlistSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Loading states
function addLoadingStates() {
    const episodeCards = document.querySelectorAll('.episode-card');
    episodeCards.forEach(card => {
        card.addEventListener('click', function() {
            showLoadingState();
        });
    });
}

function showLoadingState() {
    const player = document.querySelector('.audio-player');
    if (player) {
        player.style.opacity = '0.7';
        player.style.pointerEvents = 'none';
        
        // Add loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.position = 'absolute';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.style.transform = 'translate(-50%, -50%)';
        spinner.style.zIndex = '10';
        
        player.style.position = 'relative';
        player.appendChild(spinner);
    }
}

function hideLoadingState() {
    const player = document.querySelector('.audio-player');
    if (player) {
        player.style.opacity = '1';
        player.style.pointerEvents = 'auto';
        
        const spinner = player.querySelector('.loading-spinner');
        if (spinner) {
            spinner.remove();
        }
    }
}

// Intersection Observer for animations
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with animate-on-scroll class
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Space bar to play/pause
        if (e.code === 'Space' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            togglePlay();
        }
        
        // Arrow keys for seeking
        if (e.code === 'ArrowLeft') {
            e.preventDefault();
            currentTime = Math.max(0, currentTime - 10);
            updateProgress();
        }
        
        if (e.code === 'ArrowRight') {
            e.preventDefault();
            currentTime = Math.min(duration, currentTime + 10);
            updateProgress();
        }
        
        // M key for mute
        if (e.code === 'KeyM') {
            e.preventDefault();
            toggleMute();
        }
        
        // R key for repeat
        if (e.code === 'KeyR') {
            e.preventDefault();
            toggleRepeat();
        }
    });
}

// Tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const text = event.target.getAttribute('data-tooltip');
    if (!text) return;
    
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: var(--background-dark);
        color: white;
        padding: var(--space-2) var(--space-3);
        border-radius: var(--radius-lg);
        font-size: var(--text-xs);
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity var(--transition-fast);
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 8 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    event.target._tooltip = tooltip;
}

function hideTooltip(event) {
    const tooltip = event.target._tooltip;
    if (tooltip) {
        tooltip.remove();
        delete event.target._tooltip;
    }
}

// Utility functions
function updateProgress() {
    const progressBar = document.querySelector('.waveform-progress');
    if (progressBar) {
        const progress = (currentTime / duration) * 100;
        progressBar.style.width = `${progress}%`;
    }
    updateTimeDisplay();
}

// Export functions for global access
window.togglePlay = togglePlay;
window.seekTo = seekTo;
window.previousTrack = previousTrack;
window.nextTrack = nextTrack;
window.toggleMute = toggleMute;
window.setVolume = setVolume;
window.toggleRepeat = toggleRepeat;
window.playEpisode = playEpisode;
window.playFromPlaylist = playFromPlaylist;
window.playRandomEpisode = playRandomEpisode;
window.showPlaylist = showPlaylist;