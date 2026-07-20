// ==================== APP STATE ====================
const appState = {
    currentCategory: 'channels',
    currentSubcategory: 'all',
    favorites: [],
    playHistory: [],
    currentChannel: null,
    currentQuality: '720p',
    isFullscreen: false,
    remoteActive: true,
    theme: localStorage.getItem('faisalTvTheme') || 'dark',
    notifications: true,
    autoplay: false,
    appLoaded: false
};

// ==================== DOM ELEMENTS ====================
const elements = {
    // Loading
    loadingScreen: document.getElementById('loadingScreen'),
    appContainer: document.getElementById('appContainer'),
    
    // Main
    contentGrid: document.getElementById('contentGrid'),
    playerModal: document.getElementById('playerModal'),
    videoPlayer: document.getElementById('videoPlayer'),
    exitModal: document.getElementById('exitModal'),
    qualityModal: document.getElementById('qualityModal'),
    subcategoryContainer: document.getElementById('subcategory'),
    
    // Search
    searchBtn: document.getElementById('searchBtn'),
    searchPanel: document.getElementById('searchPanel'),
    searchInput: document.getElementById('searchInput'),
    searchClose: document.getElementById('searchClose'),
    searchResults: document.getElementById('searchResults'),
    
    // Settings
    settingsSidebar: document.getElementById('settingsSidebar'),
    menuBtn: document.getElementById('menuBtn'),
    closeSidebar: document.getElementById('closeSidebar'),
    
    // Buttons
    tabButtons: document.querySelectorAll('.tab-btn'),
    backBtnTop: document.getElementById('backBtnTop'),
    fullscreenBtnTop: document.getElementById('fullscreenBtnTop'),
    qualityBtnBottom: document.getElementById('qualityBtnBottom'),
    exitYes: document.getElementById('exitYes'),
    exitNo: document.getElementById('exitNo'),
    homeBtn: document.getElementById('homeBtn'),
    refreshBtn: document.getElementById('refreshBtn'),
    themeBtn: document.getElementById('themeBtn'),
    playerControls: document.getElementById('playerControls'),
    
    // Notification
    notificationToast: document.getElementById('notificationToast')
};

// ==================== INITIALIZATION ====================
window.addEventListener('load', () => {
    setTimeout(() => {
        showApp();
    }, 2000);
});

function showApp() {
    elements.loadingScreen.style.animation = 'fadeOut 0.5s ease forwards';
    
    setTimeout(() => {
        elements.loadingScreen.style.display = 'none';
        elements.appContainer.style.display = 'flex';
        
        initializeApp();
        setupEventListeners();
        loadFavorites();
        applyTheme();
        renderChannels('channels');
        
        appState.appLoaded = true;
        showNotification('✨ مرحباً بك في Faisal TV', 'success');
        console.log('✅ تم التحميل بنجاح - التطبيق جاهز للاستخدام');
    }, 500);
}

function initializeApp() {
    console.log('%c🎬 Faisal TV - جاري التهيئة...', 'color: #FFD700; font-size: 16px;');
    loadUserPreferences();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Tab buttons
    elements.tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.currentTarget.dataset.category;
            switchCategory(category);
        });
    });

    // Search
    elements.searchBtn.addEventListener('click', toggleSearchPanel);
    elements.searchClose.addEventListener('click', () => {
        elements.searchPanel.classList.remove('active');
    });
    elements.searchInput.addEventListener('input', performSearch);

    // Settings Sidebar
    elements.menuBtn.addEventListener('click', openSettingsSidebar);
    elements.closeSidebar.addEventListener('click', closeSettingsSidebar);

    // Refresh button
    elements.refreshBtn.addEventListener('click', () => {
        refreshChannels();
    });

    // Theme button
    elements.themeBtn.addEventListener('click', () => {
        toggleTheme();
    });

    // Theme radio buttons
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            applyTheme(e.target.value);
        });
    });

    // Player controls - Top buttons
    elements.backBtnTop.addEventListener('click', closePlayer);
    elements.fullscreenBtnTop.addEventListener('click', toggleFullscreen);
    
    // Quality button - Bottom right
    elements.qualityBtnBottom.addEventListener('click', () => {
        elements.qualityModal.classList.toggle('active');
    });

    // Exit modal
    elements.exitYes.addEventListener('click', exitApp);
    elements.exitNo.addEventListener('click', () => {
        elements.exitModal.classList.remove('active');
    });

    // Home button
    elements.homeBtn.addEventListener('click', () => {
        closePlayer();
        switchCategory('channels');
    });

    // Quality selection
    document.querySelectorAll('.quality-option').forEach(option => {
        option.addEventListener('click', (e) => {
            selectQuality(e.target.dataset.quality);
        });
    });

    // Subcategory buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('subcategory-btn')) {
            switchSubcategory(e.target.dataset.subcategory);
        }
    });

    // Settings buttons
    const saveServerBtn = document.getElementById('saveServerSettings');
    const clearCacheBtn = document.getElementById('clearCache');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    if (saveServerBtn) saveServerBtn.addEventListener('click', saveServerSettings);
    if (clearCacheBtn) clearCacheBtn.addEventListener('click', clearCache);
    if (clearHistoryBtn) clearHistoryBtn.addEventListener('click', clearHistory);

    // Remote control
    document.addEventListener('keydown', handleRemoteControl);

    // Touch controls
    setupTouchControls();

    // Settings button in footer
    const settingsBtns = document.querySelectorAll('#settingsBtn');
    settingsBtns.forEach(btn => {
        btn.addEventListener('click', openSettingsSidebar);
    });

    // Close sidebar on outside click
    document.addEventListener('click', (e) => {
        if (elements.settingsSidebar.classList.contains('active') && 
            !elements.settingsSidebar.contains(e.target) && 
            !elements.menuBtn.contains(e.target)) {
            closeSettingsSidebar();
        }
    });

    // Close quality modal on outside click
    document.addEventListener('click', (e) => {
        if (elements.qualityModal.classList.contains('active') &&
            !elements.qualityModal.contains(e.target) &&
            !elements.qualityBtnBottom.contains(e.target)) {
            elements.qualityModal.classList.remove('active');
        }
    });

    // PWA Install button
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.addEventListener('click', installApp);
    }
}

// ==================== SEARCH FUNCTIONALITY ====================
function toggleSearchPanel() {
    elements.searchPanel.classList.toggle('active');
    if (elements.searchPanel.classList.contains('active')) {
        elements.searchInput.focus();
        showNotification('🔍 ابدأ البحث...', 'success');
    }
}

function performSearch() {
    const query = elements.searchInput.value.toLowerCase().trim();
    
    if (query.length === 0) {
        elements.searchResults.innerHTML = '';
        return;
    }

    const results = CHANNELS_DATABASE.channels.filter(ch => 
        ch.name.includes(query) || 
        ch.category.includes(query) ||
        ch.subcategory.includes(query)
    );

    elements.searchResults.innerHTML = '';

    if (results.length === 0) {
        elements.searchResults.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #b0b3c1; padding: 20px;">❌ لا توجد نتائج</p>';
        return;
    }

    results.forEach(channel => {
        const card = createChannelCard(channel);
        elements.searchResults.appendChild(card);
    });

    showNotification(`🎯 وجدنا ${results.length} نتيجة`, 'success');
}

// ==================== SETTINGS SIDEBAR ====================
function openSettingsSidebar() {
    elements.settingsSidebar.classList.add('active');
    updateSettingsPanel();
    showNotification('⚙️ الإعدادات', 'success');
}

function closeSettingsSidebar() {
    elements.settingsSidebar.classList.remove('active');
}

function updateSettingsPanel() {
    const themeRadio = document.querySelector(`input[name="theme"][value="${appState.theme}"]`);
    if (themeRadio) themeRadio.checked = true;
    
    const qualitySelect = document.getElementById('defaultQuality');
    if (qualitySelect) qualitySelect.value = appState.currentQuality;
    
    const notifToggle = document.getElementById('notificationToggle');
    if (notifToggle) notifToggle.checked = appState.notifications;
    
    const autoplayToggle = document.getElementById('autoplayToggle');
    if (autoplayToggle) autoplayToggle.checked = appState.autoplay;
    
    const serverHost = document.getElementById('serverHost');
    const serverUser = document.getElementById('serverUser');
    if (serverHost) serverHost.value = HOST;
    if (serverUser) serverUser.value = USER;
}

function saveServerSettings() {
    const newHost = document.getElementById('serverHost').value;
    const newUser = document.getElementById('serverUser').value;
    const newPass = document.getElementById('serverPass').value;

    if (!newHost || !newUser) {
        showNotification('⚠️ يرجى ملء جميع الحقول', 'error');
        return;
    }

    localStorage.setItem('faisalTvHost', newHost);
    localStorage.setItem('faisalTvUser', newUser);
    localStorage.setItem('faisalTvPass', newPass);

    showNotification('✅ تم حفظ إعدادات الخادم بنجاح', 'success');
    console.log('🖥️ خادم جديد:', newHost);
}

function clearCache() {
    if (confirm('هل تريد فعلاً مسح الذاكرة المؤقتة؟')) {
        localStorage.removeItem('faisalTvHistory');
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => {
                    caches.delete(name);
                });
            });
        }
        showNotification('✅ تم مسح الذاكرة المؤقتة', 'success');
    }
}

function clearHistory() {
    if (confirm('هل تريد فعلاً مسح السجل؟')) {
        appState.playHistory = [];
        localStorage.removeItem('faisalTvHistory');
        showNotification('✅ تم مسح السجل', 'success');
    }
}

// ==================== THEME MANAGEMENT ====================
function toggleTheme() {
    const newTheme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    elements.themeBtn.classList.add('active');
    setTimeout(() => elements.themeBtn.classList.remove('active'), 600);
}

function applyTheme(theme = appState.theme) {
    appState.theme = theme;
    document.body.classList.toggle('light-theme', theme === 'light');
    localStorage.setItem('faisalTvTheme', theme);
    
    if (theme === 'light') {
        elements.themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
        showNotification('☀️ الوضع الفاتح', 'success');
    } else {
        elements.themeBtn.innerHTML = '<i class="fas fa-sun"></i>';
        showNotification('🌙 الوضع الداكن', 'success');
    }
}

// ==================== REFRESH FUNCTIONALITY ====================
function refreshChannels() {
    elements.refreshBtn.classList.add('active');
    showNotification('🔄 جاري تحديث القنوات...', 'success');
    
    setTimeout(() => {
        renderChannels(appState.currentCategory);
        elements.refreshBtn.classList.remove('active');
        showNotification('✅ تم تحديث القنوات بنجاح', 'success');
    }, 1000);
}

// ==================== CATEGORY MANAGEMENT ====================
function switchCategory(category) {
    appState.currentCategory = category;
    appState.currentSubcategory = 'all';

    elements.tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    if (category === 'sports') {
        elements.subcategoryContainer.style.display = 'block';
    } else {
        elements.subcategoryContainer.style.display = 'none';
    }

    renderChannels(category);
    localStorage.setItem('faisalTvLastCategory', category);
}

function switchSubcategory(subcategory) {
    appState.currentSubcategory = subcategory;

    document.querySelectorAll('.subcategory-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.subcategory === subcategory) {
            btn.classList.add('active');
        }
    });

    renderChannels(appState.currentCategory);
}

// ==================== CHANNEL RENDERING ====================
function renderChannels(category) {
    let filteredChannels = CHANNELS_DATABASE.channels;

    filteredChannels = filteredChannels.filter(ch => ch.category === category);

    if (appState.currentSubcategory !== 'all') {
        filteredChannels = filteredChannels.filter(ch => ch.subcategory === appState.currentSubcategory);
    }

    elements.contentGrid.innerHTML = '';

    if (filteredChannels.length === 0) {
        elements.contentGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #b0b3c1; padding: 20px;">❌ لا توجد قنوات متاحة</p>';
        return;
    }

    filteredChannels.forEach(channel => {
        const card = createChannelCard(channel);
        elements.contentGrid.appendChild(card);
    });
}

function createChannelCard(channel) {
    const card = document.createElement('div');
    card.className = 'channel-card';
    card.innerHTML = `
        <div class="channel-card-image">
            <span style="font-size: 40px;">${channel.icon}</span>
            <button class="channel-card-favorite ${isFavorite(channel.id) ? 'active' : ''}" data-channel-id="${channel.id}">
                <i class="fas fa-star"></i>
            </button>
        </div>
        <div class="channel-card-info">
            <div class="channel-card-title">${channel.name}</div>
            <div class="channel-card-quality">${channel.quality}</div>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (!e.target.closest('.channel-card-favorite')) {
            playChannel(channel);
        }
    });

    card.querySelector('.channel-card-favorite').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(channel.id, e.currentTarget);
    });

    return card;
}

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
    elements.qualityModal.classList.remove('active');
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
        } else if (videoPlayer.webkitRequestFullscreen) {
            videoPlayer.webkitRequestFullscreen();
            appState.isFullscreen = true;
        } else if (videoPlayer.mozRequestFullScreen) {
            videoPlayer.mozRequestFullScreen();
            appState.isFullscreen = true;
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            appState.isFullscreen = false;
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
            appState.isFullscreen = false;
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
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

    elements.qualityModal.classList.remove('active');
    
    showNotification(`📺 ${quality}`, 'success');
}

// ==================== FAVORITES ====================
function toggleFavorite(channelId, button) {
    const index = appState.favorites.indexOf(channelId);

    if (index > -1) {
        appState.favorites.splice(index, 1);
        button.classList.remove('active');
        showNotification('✪ تمت الإزالة من المفضلة', 'success');
    } else {
        appState.favorites.push(channelId);
        button.classList.add('active');
        showNotification('❤️ تمت الإضافة للمفضلة', 'success');
    }

    saveFavorites();
}

function isFavorite(channelId) {
    return appState.favorites.includes(channelId);
}

function saveFavorites() {
    localStorage.setItem('faisalTvFavorites', JSON.stringify(appState.favorites));
}

function loadFavorites() {
    const saved = localStorage.getItem('faisalTvFavorites');
    if (saved) {
        appState.favorites = JSON.parse(saved);
    }
}

// ==================== PLAY HISTORY ====================
function addToHistory(channel) {
    const history = appState.playHistory.filter(ch => ch.id !== channel.id);
    history.unshift(channel);
    appState.playHistory = history.slice(0, 20);

    localStorage.setItem('faisalTvHistory', JSON.stringify(appState.playHistory));
}

// ==================== REMOTE CONTROL ====================
function handleRemoteControl(e) {
    if (!appState.remoteActive || !appState.appLoaded) return;

    // تجاهل إذا كان في حقل إدخال
    if (document.activeElement === elements.searchInput) return;

    switch(e.key) {
        case 'ArrowLeft':
            if (elements.playerModal.classList.contains('active')) {
                handleVolume(true);
            }
            break;
        case 'ArrowRight':
            if (elements.playerModal.classList.contains('active')) {
                handleVolume(false);
            }
            break;
        case 'ArrowUp':
            if (elements.playerModal.classList.contains('active')) {
                elements.videoPlayer.currentTime += 10;
            }
            break;
        case 'ArrowDown':
            if (elements.playerModal.classList.contains('active')) {
                elements.videoPlayer.currentTime -= 10;
            }
            break;
        case ' ':
            e.preventDefault();
            if (elements.playerModal.classList.contains('active')) {
                elements.videoPlayer.paused ? elements.videoPlayer.play() : elements.videoPlayer.pause();
            }
            break;
        case 'Escape':
            if (elements.playerModal.classList.contains('active')) {
                showExitModal();
            } else if (elements.settingsSidebar.classList.contains('active')) {
                closeSettingsSidebar();
            }
            break;
        case 'f':
        case 'F':
            if (elements.playerModal.classList.contains('active')) {
                toggleFullscreen();
            }
            break;
        case 'q':
        case 'Q':
            if (elements.playerModal.classList.contains('active')) {
                elements.qualityModal.classList.toggle('active');
            }
            break;
    }
}

function handleVolume(increase) {
    let volume = elements.videoPlayer.volume;
    if (increase) {
        volume = Math.min(1, volume + 0.1);
    } else {
        volume = Math.max(0, volume - 0.1);
    }
    elements.videoPlayer.volume = volume;
    showNotification(`🔊 ${Math.round(volume * 100)}%`, 'success');
}

// ==================== MOBILE TOUCH CONTROLS ====================
function setupTouchControls() {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;

    elements.playerModal.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    });

    elements.playerModal.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    });

    function handleSwipe() {
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (diffX > 50) {
                // السحب لليسار - تقديم
                elements.videoPlayer.currentTime += 15;
            } else if (diffX < -50) {
                // السحب لليمين - ترجيع
                elements.videoPlayer.currentTime -= 15;
            }
        }
    }
}

// ==================== EXIT MODAL ====================
function showExitModal() {
    elements.exitModal.classList.add('active');
}

function exitApp() {
    showNotification('👋 شكراً لاستخدام Faisal TV', 'success');
    setTimeout(() => {
        window.close() || (window.location.href = 'about:blank');
    }, 1000);
}

// ==================== NOTIFICATIONS ====================
function showNotification(message, type = 'success') {
    if (!appState.notifications) return;

    elements.notificationToast.textContent = message;
    elements.notificationToast.className = `notification-toast show ${type}`;
    
    setTimeout(() => {
        elements.notificationToast.classList.remove('show');
    }, 3000);
}

// ==================== PWA INSTALLATION ====================
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('installBtn');
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(choice => {
            if (choice.outcome === 'accepted') {
                showNotification('✅ تم تثبيت التطبيق بنجاح!', 'success');
            }
            deferredPrompt = null;
            const installBtn = document.getElementById('installBtn');
            if (installBtn) {
                installBtn.style.display = 'none';
            }
        });
    }
}

// ==================== SAVE PREFERENCES ====================
window.addEventListener('beforeunload', () => {
    localStorage.setItem('faisalTvLastCategory', appState.currentCategory);
});

function loadUserPreferences() {
    const savedCategory = localStorage.getItem('faisalTvLastCategory');
    if (savedCategory && CHANNELS_DATABASE.channels.some(ch => ch.category === savedCategory)) {
        appState.currentCategory = savedCategory;
    }
}

// ==================== RESPONSIVE DESIGN ====================
window.addEventListener('orientationchange', () => {
    console.log('تغير اتجاه الجهاز:', window.orientation);
});

// ==================== DEVICE ORIENTATION LOCK ====================
if ('orientation' in screen && 'lock' in screen.orientation) {
    document.getElementById('fullscreenBtnTop')?.addEventListener('click', () => {
        if (!appState.isFullscreen) {
            screen.orientation.lock('landscape').catch(err => {
                console.log('لا يمكن قفل الاتجاه:', err);
            });
        }
    });
}

// ==================== DEBUG & ANALYTICS ====================
console.log('%c🎬 Faisal TV', 'color: #FFD700; font-size: 20px; font-weight: bold;');
console.log('%c✨ تطبيق بث مباشر احترافي', 'color: #FFD700; font-size: 14px;');
console.log('📺 عدد القنوات المتاحة:', CHANNELS_DATABASE.channels.length);
console.log('🖥️ خادم البث:', HOST);
console.log('👤 المستخدم:', USER);
console.log('📱 نظام التشغيل:', navigator.userAgent);
console.log('🌐 متصل بالإنترنت؟', navigator.onLine ? 'نعم' : 'لا');
