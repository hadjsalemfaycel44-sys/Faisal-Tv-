// ==================== PLAYER ====================
function playChannel(channel) {
    appState.currentChannel = channel;

    elements.playerModal.classList.add('active');

    document.getElementById('channelName').textContent = channel.name;
    document.getElementById('channelDesc').textContent = `جودة: ${channel.quality}`;

    const streamUrl = buildStreamUrl(channel.id);

    elements.videoPlayer.src = streamUrl;
    
    elements.videoPlayer.play().catch(err => {
        console.log('يمكنك تشغيل الفيديو يدوياً:', err);
    });

    addToHistory(channel);
    
    showNotification(`▶️ ${channel.name}`, 'success');
}

function closePlayer() {
    elements.playerModal.classList.remove('active');
    elements.videoPlayer.pause();
    elements.videoPlayer.src = '';
    document.getElementById('qualityModal').classList.remove('active');
}

function toggleFullscreen() {
    if (!appState.isFullscreen) {
        const videoPlayer = document.getElementById('videoPlayer');
        if (videoPlayer.requestFullscreen) {
            videoPlayer.requestFullscreen().catch(err => {
                console.error('خطأ في ملء الشاشة:', err);
            });
            appState.isFullscreen = true;
            showNotification('⛶ ملء الشاشة', 'success');
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            appState.isFullscreen = false;
        }
    }
}

function selectQuality(quality) {
    appState.currentQuality = quality;

    document.querySelectorAll('.quality-option').forEach(opt => {
        opt.classList.remove('active');
        if (opt.dataset.quality === quality) {
            opt.classList.add('active');
        }
    });

    document.getElementById('qualityModal').classList.remove('active');
    
    showNotification(`📺 ${quality}`, 'success');
}
