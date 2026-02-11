// Ten plik zawiera wspólne funkcje dla całej aplikacji

// Funkcja do tworzenia latających serduszek
function createFloatingHearts(count = 15) {
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💘', '💝', '💞'];
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
            
            // Losowe właściwości
            heart.style.left = Math.random() * 100 + 'vw';
            heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heart.style.animationDuration = (Math.random() * 10 + 10) + 's';
            heart.style.animationDelay = Math.random() * 5 + 's';
            
            // Losowy kolor
            const colors = ['#e63946', '#ff6b6b', '#ffafbd', '#e84393', '#fd79a8'];
            heart.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            document.body.appendChild(heart);
            
            // Usuń po animacji
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.parentNode.removeChild(heart);
                }
            }, 15000);
        }, i * 300);
    }
}

// Funkcja do animacji otwierania listu
function animateLetterOpening(fileName) {
    // Utwórz overlay z animacją
    const overlay = document.createElement('div');
    overlay.className = 'letter-opening-overlay';
    overlay.innerHTML = `
        <div class="letter-scroll-animation">
            <div class="paper-roll">
                <div class="paper-unrolling"></div>
            </div>
            <p class="opening-text">Otwieranie listu miłosnego...</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Odtwórz dźwięk
    try {
        const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-page-turn-swipe-1491.mp3');
        audio.volume = 0.5;
        audio.play();
    } catch(e) {
        console.log("Dźwięk niedostępny");
    }
    
    // Przejdź do listu po 2 sekundach
    setTimeout(() => {
        window.location.href = `letters/${fileName}`;
    }, 2000);
}

// Funkcja do zapisywania w localStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch(e) {
        console.error('Błąd zapisu do localStorage:', e);
        return false;
    }
}

// Funkcja do odczytywania z localStorage
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch(e) {
        console.error('Błąd odczytu z localStorage:', e);
        return null;
    }
}

// Funkcja do formatowania daty
function formatDate(date, includeTime = false) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('pl-PL', options);
}

// Funkcja do tworzenia odliczania
function createCountdown(targetDate, elementId) {
    const countdownElement = document.getElementById(elementId);
    if (!countdownElement) return;
    
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            countdownElement.innerHTML = '<span class="countdown-finished">List jest już dostępny!</span>';
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        countdownElement.innerHTML = `
            <div class="countdown-unit">
                <span class="number">${days.toString().padStart(2, '0')}</span>
                <span class="label">dni</span>
            </div>
            <div class="countdown-unit">
                <span class="number">${hours.toString().padStart(2, '0')}</span>
                <span class="label">godziny</span>
            </div>
            <div class="countdown-unit">
                <span class="number">${minutes.toString().padStart(2, '0')}</span>
                <span class="label">minuty</span>
            </div>
            <div class="countdown-unit">
                <span class="number">${seconds.toString().padStart(2, '0')}</span>
                <span class="label">sekundy</span>
            </div>
        `;
    }
    
    updateCountdown();
    return setInterval(updateCountdown, 1000);
}

// Funkcja do obsługi responsywności
function handleResponsiveDesign() {
    const isMobile = window.innerWidth <= 768;
    const isDesktop = window.innerWidth >= 1920;
    
    // Dodaj odpowiednie klasy do body
    document.body.classList.toggle('mobile-view', isMobile);
    document.body.classList.toggle('desktop-view', isDesktop);
    
    // Dostosuj niektóre elementy
    if (isMobile) {
        // Optymalizacje dla mobile
        const allModals = document.querySelectorAll('.modal-content');
        allModals.forEach(modal => {
            modal.style.maxWidth = '95%';
        });
    }
    
    if (isDesktop) {
        // Optymalizacje dla desktop
        document.documentElement.style.fontSize = '18px';
    }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    // Ustaw aktualną datę w nagłówku jeśli istnieje element
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const now = new Date();
        dateElement.textContent = formatDate(now);
    }
    
    // Obsługa responsywności
    handleResponsiveDesign();
    window.addEventListener('resize', handleResponsiveDesign);
    
    // Dodaj latające serduszka na stronach głównych
    if (document.querySelector('.mailbox-container') || document.querySelector('.calendar-grid')) {
        createFloatingHearts(10);
        
        // Dodawaj kolejne serduszka co 30 sekund
        setInterval(() => createFloatingHearts(5), 30000);
    }
    
    // Inicjalizacja dźwięków
    const sounds = {
        mailboxOpen: document.getElementById('mailboxOpenSound'),
        pageTurn: document.getElementById('pageTurnSound')
    };
    
    // Ustaw niską głośność dla dźwięków
    Object.values(sounds).forEach(sound => {
        if (sound) {
            sound.volume = 0.3;
        }
    });
});