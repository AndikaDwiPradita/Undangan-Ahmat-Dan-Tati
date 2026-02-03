// ============================================
// AOS INITIALIZATION
// ============================================
AOS.init({
    duration: 1000,
    offset: 100,
    delay: 100,
    easing: 'ease',
    once: true,
    mirror: false
});

// ============================================
// CONFIGURATION
// ============================================
const SHEETBEST_CONFIG = {
    DOA: 'https://api.sheetbest.com/sheets/c2418473-dfe0-4c43-8968-88f6037de059',
    UCAPAN: 'https://api.sheetbest.com/sheets/51df3877-2628-4612-830e-4a98739ac36d'
};

// ============================================
// MAIN INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    // Elements
    const coverPage = document.getElementById('coverPage');
    const mainContent = document.getElementById('mainContent');
    const openBtn = document.getElementById('openBtn');
    
    // Event Listeners
    setupEventListeners();
    
    // Open invitation button
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            openInvitation(coverPage, mainContent);
        });
    }
    
    // Initialize components
    initializeComponents();
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Prayer Form
    const prayerForm = document.getElementById('prayerForm');
    if (prayerForm) {
        prayerForm.addEventListener('submit', handlePrayerSubmit);
    }
    
    // Wishes Form
    const wishesForm = document.getElementById('wishesForm');
    if (wishesForm) {
        wishesForm.addEventListener('submit', handleWishesSubmit);
    }
    
    // Navigation
    setupNavigation();
    
    // Location buttons
    setupLocationButtons();
    
    // Back to top
    setupBackToTop();
}

const music = document.getElementById("openBtn");

  function playMusicOnce() {
    music.play();
    document.removeEventListener("click", playMusicOnce);
  }

  document.addEventListener("click", playMusicOnce);

// ============================================
// FORM HANDLERS
// ============================================
async function handlePrayerSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('prayerName').value.trim();
    const message = document.getElementById('prayerMessage').value.trim();
    
    if (!name || !message) {
        showNotification('Harap isi nama dan doa Anda.', 'warning');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;
    
    try {
        const doaData = [{
            "Nama": name,
            "Doa": message,
            "Tanggal": new Date().toLocaleDateString('id-ID'),
            "Waktu": new Date().toLocaleTimeString('id-ID')
        }];
        
        const response = await fetch(SHEETBEST_CONFIG.DOA, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doaData)
        });
        
        if (response.ok) {
            addPrayerToDisplay(name, message);
            e.target.reset();
            showNotification('Doa Anda telah terkirim!', 'success');
            saveToLocalStorage('doa', { name, message, timestamp: new Date().toISOString() });
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal mengirim. Coba lagi.', 'error');
        saveToLocalStorage('doa', { name, message, timestamp: new Date().toISOString() });
        addPrayerToDisplay(name, message);
        e.target.reset();
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleWishesSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('wishesName').value.trim();
    const message = document.getElementById('wishesMessage').value.trim();
    
    if (!name || !message) {
        showNotification('Harap isi nama dan ucapan Anda.', 'warning');
        return;
    }
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;
    
    // Show loading
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    submitBtn.disabled = true;
    
    try {
        const ucapanData = [{
            "Nama": name,
            "Ucapan": message,
            "Tanggal": new Date().toLocaleDateString('id-ID'),
            "Waktu": new Date().toLocaleTimeString('id-ID')
        }];
        
        const response = await fetch(SHEETBEST_CONFIG.UCAPAN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ucapanData)
        });
        
        if (response.ok) {
            addWishToDisplay(name, message);
            e.target.reset();
            showNotification('Ucapan Anda telah terkirim!', 'success');
            saveToLocalStorage('ucapan', { name, message, timestamp: new Date().toISOString() });
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Gagal mengirim. Coba lagi.', 'error');
        saveToLocalStorage('ucapan', { name, message, timestamp: new Date().toISOString() });
        addWishToDisplay(name, message);
        e.target.reset();
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================
function addPrayerToDisplay(name, message) {
    const prayerList = document.getElementById('prayerList');
    if (!prayerList) return;
    
    const prayerItem = document.createElement('div');
    prayerItem.className = 'prayer-item';
    prayerItem.innerHTML = `
        <h4>${escapeHtml(name)}</h4>
        <p>${escapeHtml(message)}</p>
        <p class="prayer-time">Baru saja</p>
    `;
    
    if (prayerList.firstChild) {
        prayerList.insertBefore(prayerItem, prayerList.firstChild);
    } else {
        prayerList.appendChild(prayerItem);
    }
}

function addWishToDisplay(name, message) {
    const wishesList = document.getElementById('wishesList');
    if (!wishesList) return;
    
    const wishItem = document.createElement('div');
    wishItem.className = 'wishes-item';
    wishItem.innerHTML = `
        <h4>${escapeHtml(name)}</h4>
        <p>${escapeHtml(message)}</p>
        <p class="wishes-time">Baru saja</p>
    `;
    
    if (wishesList.firstChild) {
        wishesList.insertBefore(wishItem, wishesList.firstChild);
    } else {
        wishesList.appendChild(wishItem);
    }
}

// ============================================
// NAVIGATION
// ============================================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.forEach(item => item.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// LOCATION FUNCTIONS
// ============================================
function setupLocationButtons() {
    // Add to calendar button
    const addToCalendarBtn = document.getElementById('addToCalendar');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', function() {
            const event = {
                title: 'Pernikahan Ahmat & Tati',
                description: 'Acara pernikahan Ahmat & Tati',
                location: 'Kp. Pabuaran Rt.06 Rw.08 Desa Urug Kec. Sukajaya Kab. Bogor',
                start: new Date('2026-02-08T09:00:00'),
                end: new Date('2026-02-08T21:00:00')
            };
            
            const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=20260208T100000/20260208T140000&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
            
            window.open(googleCalendarUrl, '_blank');
            showNotification('Acara telah ditambahkan ke Google Calendar', 'success');
        });
    }
    
    // Open Google Maps button
    const openGMapsBtn = document.getElementById('openGMaps');
    if (openGMapsBtn) {
        openGMapsBtn.addEventListener('click', function() {
            const address = encodeURIComponent('Kp. Pabuaran Rt.06 Rw.08 Desa Urug Kec. Sukajaya Kab. Bogor');
            window.open(`https://maps.app.goo.gl/rGzKCFJTY7rpquJJ9`, '_blank');
        });
    }
}

// ============================================
// INITIALIZATION FUNCTIONS
// ============================================
function openInvitation(coverPage, mainContent) {
    coverPage.classList.add('hidden');
    setTimeout(() => {
        coverPage.style.display = 'none';
        mainContent.classList.add('active');
        initializeCountdown();
        loadInitialData();
    }, 800);
}

function initializeComponents() {
    // Countdown timer
    initializeCountdown();
    
    // Load initial data
    loadInitialData();
}

function initializeCountdown() {
    const weddingDate = new Date('February 08, 2026 09:00:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = weddingDate - now;
        
        if (timeLeft < 0) {
            document.getElementById('countdown').innerHTML = 
                '<div class="countdown-complete">Acara telah berlangsung!</div>';
            return;
        }
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

async function loadInitialData() {
    try {
        const [prayersResponse, wishesResponse] = await Promise.all([
            fetch(SHEETBEST_CONFIG.DOA).catch(() => null),
            fetch(SHEETBEST_CONFIG.UCAPAN).catch(() => null)
        ]);
        
        if (prayersResponse && prayersResponse.ok) {
            const prayers = await prayersResponse.json();
            displayPrayersFromSheet(prayers);
        } else {
            loadPrayersFromLocalStorage();
        }
        
        if (wishesResponse && wishesResponse.ok) {
            const wishes = await wishesResponse.json();
            displayWishesFromSheet(wishes);
        } else {
            loadWishesFromLocalStorage();
        }
    } catch (error) {
        console.error('Error loading data:', error);
        loadFromLocalStorage();
    }
}

function displayPrayersFromSheet(prayers) {
    const prayerList = document.getElementById('prayerList');
    if (!prayerList || !prayers) return;
    
    prayerList.innerHTML = '';
    const recentPrayers = prayers.slice(-10).reverse();
    
    recentPrayers.forEach(prayer => {
        const prayerItem = document.createElement('div');
        prayerItem.className = 'prayer-item';
        prayerItem.innerHTML = `
            <h4>${escapeHtml(prayer.Nama || '')}</h4>
            <p>${escapeHtml(prayer.Doa || '')}</p>
            <p class="prayer-time">${formatDate(prayer.Tanggal, prayer.Waktu)}</p>
        `;
        prayerList.appendChild(prayerItem);
    });
}

function displayWishesFromSheet(wishes) {
    const wishesList = document.getElementById('wishesList');
    if (!wishesList || !wishes) return;
    
    wishesList.innerHTML = '';
    const recentWishes = wishes.slice(-10).reverse();
    
    recentWishes.forEach(wish => {
        const wishItem = document.createElement('div');
        wishItem.className = 'wishes-item';
        wishItem.innerHTML = `
            <h4>${escapeHtml(wish.Nama || '')}</h4>
            <p>${escapeHtml(wish.Ucapan || '')}</p>
            <p class="wishes-time">${formatDate(wish.Tanggal, wish.Waktu)}</p>
        `;
        wishesList.appendChild(wishItem);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function saveToLocalStorage(type, data) {
    const key = type === 'doa' ? 'weddingPrayers' : 'weddingWishes';
    let items = JSON.parse(localStorage.getItem(key)) || [];
    items.unshift(data);
    if (items.length > 50) items = items.slice(0, 50);
    localStorage.setItem(key, JSON.stringify(items));
}

function loadFromLocalStorage() {
    loadPrayersFromLocalStorage();
    loadWishesFromLocalStorage();
}

function loadPrayersFromLocalStorage() {
    const prayers = JSON.parse(localStorage.getItem('weddingPrayers')) || [];
    const prayerList = document.getElementById('prayerList');
    if (!prayerList) return;
    
    prayerList.innerHTML = '';
    prayers.slice(0, 10).forEach(prayer => {
        addPrayerToDisplay(prayer.name, prayer.message);
    });
}

function loadWishesFromLocalStorage() {
    const wishes = JSON.parse(localStorage.getItem('weddingWishes')) || [];
    const wishesList = document.getElementById('wishesList');
    if (!wishesList) return;
    
    wishesList.innerHTML = '';
    wishes.slice(0, 10).forEach(wish => {
        addWishToDisplay(wish.name, wish.message);
    });
}

function showNotification(message, type = 'info') {
    const oldNotification = document.querySelector('.notification');
    if (oldNotification) oldNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function formatDate(dateStr, timeStr) {
    if (!dateStr) return 'Baru saja';
    
    try {
        const dateTimeStr = `${dateStr} ${timeStr || ''}`.trim();
        const date = new Date(dateTimeStr);
        
        if (isNaN(date.getTime())) return dateStr;
        
        const now = new Date();
        const diffMs = now - date;
        const diffHours = diffMs / (1000 * 60 * 60);
        
        if (diffHours < 1) return 'Baru saja';
        if (diffHours < 24) return `${Math.floor(diffHours)} jam yang lalu`;
        if (diffHours < 48) return 'Kemarin';
        
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        return dateStr;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}