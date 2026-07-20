// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(registration => {
        console.log('Service Worker تم تسجيله:', registration);
    }).catch(error => {
        console.log('فشل تسجيل Service Worker:', error);
    });
}

// Install App Banner
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`المستخدم اختار: ${outcome}`);
            deferredPrompt = null;
            installBtn.style.display = 'none';
        }
    });
}

window.addEventListener('appinstalled', () => {
    console.log('تم تثبيت التطبيق بنجاح!');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
});

// Device Orientation
window.addEventListener('orientationchange', () => {
    console.log('تغير اتجاه الجهاز:', window.orientation);
});

// Full Screen API
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}

// Prevent Sleep
function preventSleep() {
    navigator.wakeLock?.request('screen').then(wakeLock => {
        console.log('شاشة الجهاز نشطة');
    }).catch(err => {
        console.log('خطأ:', err.name, err.message);
    });
}

// Check if app is installed
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           navigator.standalone === true;
}

console.log('هل التطبيق مثبت؟', isAppInstalled());
