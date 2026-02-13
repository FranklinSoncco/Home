// ===== Language Toggle System =====
let currentLang = 'en';

function initLanguageSystem() {
    // Get saved language or default to English
    const savedLang = localStorage.getItem('preferredLanguage') || 'en';
    if (savedLang === 'es') {
        switchLanguage('es');
    }
    
    // Add language toggle event listeners
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'es' : 'en';
            switchLanguage(newLang);
        });
        
        // Also add click events to language options
        document.querySelectorAll('.lang-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                switchLanguage(lang);
            });
        });
    }
}

function switchLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update all elements with language data attributes
    document.querySelectorAll('[data-en], [data-es]').forEach(element => {
        const text = element.getAttribute(`data-${lang}`);
        if (text) {
            // Check if it's an input placeholder
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        }
    });
    
    // Update language toggle active state
    document.querySelectorAll('.lang-option').forEach(option => {
        if (option.getAttribute('data-lang') === lang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    // Update document language attribute
    document.documentElement.lang = lang;
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
}

// ===== Certification Modal Viewer =====
function initCertificationViewer() {
    const modal = document.getElementById('certModal');
    const certViewer = document.getElementById('certViewer');
    const closeBtn = document.querySelector('.cert-modal-close');
    const viewButtons = document.querySelectorAll('.view-cert-btn');
    
    if (!modal) return;
    
    // Open modal when clicking view certificate buttons
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const certPath = button.getAttribute('data-cert');
            if (certPath) {
                certViewer.src = certPath;
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCertModal);
    }
    
    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeCertModal();
        }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeCertModal();
        }
    });
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    const certViewer = document.getElementById('certViewer');
    if (modal) {
        modal.style.display = 'none';
        certViewer.src = '';
        document.body.style.overflow = 'auto';
    }
}

// ===== Certification Filtering =====
function initCertificationFilters() {
    const filterButtons = document.querySelectorAll('.cert-tab');
    const certCards = document.querySelectorAll('.cert-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.getAttribute('data-category');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards
            certCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// ===== Visitor Analytics =====
function initVisitorAnalytics() {
    // Get visit count from localStorage
    let visitCount = parseInt(localStorage.getItem('visitCount') || '0');
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
    
    // Update display
    const visitCountElement = document.getElementById('visitCount');
    if (visitCountElement) {
        visitCountElement.textContent = visitCount;
    }
    
    // Track visit details
    const visitData = {
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        language: navigator.language,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        visitNumber: visitCount
    };
    
    // Try to get location (this requires user permission)
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                visitData.location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                saveVisitData(visitData);
            },
            (error) => {
                // If geolocation fails, save without location
                visitData.locationError = error.message;
                saveVisitData(visitData);
            }
        );
    } else {
        saveVisitData(visitData);
    }
}

function saveVisitData(visitData) {
    // Save to localStorage (limited storage)
    try {
        let visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
        visitHistory.push(visitData);
        
        // Keep only last 100 visits to avoid storage limits
        if (visitHistory.length > 100) {
            visitHistory = visitHistory.slice(-100);
        }
        
        localStorage.setItem('visitHistory', JSON.stringify(visitHistory));
        
        // Log to console for debugging
        console.log('Visit tracked:', visitData);
        
        // Note: For production analytics, you would send this to a server
        // Example: fetch('/api/analytics', { method: 'POST', body: JSON.stringify(visitData) })
        
    } catch (error) {
        console.error('Error saving visit data:', error);
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.interest-card, .project-card, .skill-card, .cert-card, .timeline-item, .education-card, .publication-card').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ===== Active Navigation Highlighting =====
function initActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// ===== Initialize All Functions =====
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSystem();
    initMobileMenu();
    initCertificationViewer();
    initCertificationFilters();
    initVisitorAnalytics();
    initSmoothScroll();
    initScrollAnimations();
    initActiveNavigation();
});

// ===== Export Visit Data Function (for debugging) =====
function exportVisitData() {
    const visitHistory = localStorage.getItem('visitHistory');
    if (visitHistory) {
        const blob = new Blob([visitHistory], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `visit-analytics-${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Make export function available in console
window.exportVisitData = exportVisitData;

// ===== Analytics Dashboard (Console Command) =====
window.viewAnalytics = function() {
    const visitHistory = JSON.parse(localStorage.getItem('visitHistory') || '[]');
    const visitCount = localStorage.getItem('visitCount');
    
    console.log('=== VISIT ANALYTICS ===');
    console.log('Total Visits:', visitCount);
    console.log('Tracked Visits:', visitHistory.length);
    
    if (visitHistory.length > 0) {
        console.log('\nRecent Visits:');
        visitHistory.slice(-10).reverse().forEach((visit, index) => {
            console.log(`\n${index + 1}. ${new Date(visit.timestamp).toLocaleString()}`);
            console.log('   Page:', visit.page);
            console.log('   Referrer:', visit.referrer || 'Direct');
            if (visit.location) {
                console.log('   Location:', `${visit.location.latitude.toFixed(4)}, ${visit.location.longitude.toFixed(4)}`);
            }
        });
        
        // Page statistics
        const pageStats = {};
        visitHistory.forEach(visit => {
            pageStats[visit.page] = (pageStats[visit.page] || 0) + 1;
        });
        console.log('\nPage Views:');
        Object.entries(pageStats).sort((a, b) => b[1] - a[1]).forEach(([page, count]) => {
            console.log(`   ${page}: ${count}`);
        });
    }
    
    console.log('\nCommands:');
    console.log('- exportVisitData() - Download analytics data');
    console.log('- localStorage.clear() - Clear all data');
};

console.log('%c📊 Analytics enabled! Type viewAnalytics() to see stats', 'color: #E91E8C; font-size: 14px; font-weight: bold;');
