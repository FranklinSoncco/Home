/* ==========================================================================
   Franklin Soncco — site behaviour
   ========================================================================== */

/* ---------- Language (EN / ES) ---------- */
let currentLang = 'en';

function switchLanguage(lang) {
    currentLang = lang;
    try { localStorage.setItem('preferredLanguage', lang); } catch (e) { /* private mode */ }

    document.querySelectorAll('[data-en], [data-es]').forEach((el) => {
        const text = el.getAttribute('data-' + lang);
        if (text === null) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
        }
    });

    document.querySelectorAll('.lang-option').forEach((opt) => {
        opt.classList.toggle('active', opt.getAttribute('data-lang') === lang);
    });

    document.documentElement.lang = lang;
}

function initLanguage() {
    let saved = 'en';
    try { saved = localStorage.getItem('preferredLanguage') || 'en'; } catch (e) { /* ignore */ }
    if (saved === 'es') switchLanguage('es');

    const toggle = document.getElementById('langToggle');
    if (!toggle) return;
    toggle.addEventListener('click', () => {
        switchLanguage(currentLang === 'en' ? 'es' : 'en');
    });
}

/* ---------- Mobile navigation ---------- */
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuToggle');
    const links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    btn.addEventListener('click', () => {
        const open = links.classList.toggle('active');
        btn.classList.toggle('active', open);
        btn.setAttribute('aria-expanded', String(open));
    });

    links.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', () => {
            links.classList.remove('active');
            btn.classList.remove('active');
            btn.setAttribute('aria-expanded', 'false');
        });
    });
}

/* ---------- Media modal: images, PDFs and video ---------- */
/* Media is only fetched when opened, so the 300 MB of project video on this
   site never loads until a visitor actually asks for it. */
const MediaModal = (() => {
    let modal, body, titleEl, openBtn, lastFocused;

    function typeOf(src) {
        const ext = src.split('?')[0].split('.').pop().toLowerCase();
        if (['mp4', 'webm', 'ogg', 'mov'].includes(ext)) return 'video';
        if (['pdf'].includes(ext)) return 'pdf';
        return 'image';
    }

    function open(src, label) {
        if (!modal) return;
        lastFocused = document.activeElement;
        const kind = typeOf(src);
        titleEl.textContent = label || '';
        openBtn.href = src;
        body.innerHTML = '';

        let node;
        if (kind === 'video') {
            node = document.createElement('video');
            node.controls = true;
            node.autoplay = true;
            node.preload = 'metadata';
            node.src = src;
        } else if (kind === 'pdf') {
            node = document.createElement('iframe');
            node.src = src + '#view=FitH';
            node.title = label || 'Document';
        } else {
            node = document.createElement('img');
            node.src = src;
            node.alt = label || '';
        }
        body.appendChild(node);

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modal.querySelector('.modal-close').focus();
    }

    function close() {
        if (!modal || !modal.classList.contains('open')) return;
        const vid = body.querySelector('video');
        if (vid) { vid.pause(); vid.removeAttribute('src'); vid.load(); }
        body.innerHTML = '';
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    function init() {
        modal = document.getElementById('mediaModal');
        if (!modal) return;
        body = modal.querySelector('.modal-body');
        titleEl = modal.querySelector('.modal-title');
        openBtn = modal.querySelector('.modal-open-new');

        modal.querySelector('.modal-close').addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

        // Any element carrying data-media opens in the viewer.
        document.querySelectorAll('[data-media]').forEach((el) => {
            const src = el.getAttribute('data-media');
            const label = el.getAttribute('data-media-title') || el.textContent.trim();

            if (!el.hasAttribute('tabindex') && !['A', 'BUTTON'].includes(el.tagName)) {
                el.setAttribute('tabindex', '0');
                el.setAttribute('role', 'button');
            }
            el.addEventListener('click', (e) => { e.preventDefault(); open(src, label); });
            el.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(src, label); }
            });
        });
    }

    return { init, open, close };
})();

/* ---------- Card filtering (projects, certifications) ---------- */
function initFilters() {
    document.querySelectorAll('[data-filter-group]').forEach((group) => {
        const targetSel = group.getAttribute('data-filter-target');
        const buttons = group.querySelectorAll('.filter-btn');
        const cards = document.querySelectorAll(targetSel);
        if (!cards.length) return;

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const cat = btn.getAttribute('data-category');
                buttons.forEach((b) => b.classList.remove('active'));
                btn.classList.add('active');

                cards.forEach((card) => {
                    const cardCats = (card.getAttribute('data-category') || '').split(/\s+/);
                    card.classList.toggle('hidden', cat !== 'all' && !cardCats.includes(cat));
                });
            });
        });
    });
}

/* ---------- Active nav link ---------- */
function initActiveNav() {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach((link) => {
        if (link.getAttribute('href') === page) link.classList.add('active');
    });
}

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initMobileMenu();
    MediaModal.init();
    initFilters();
    initActiveNav();
});
