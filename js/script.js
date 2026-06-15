'use strict';

/* ========================
   NAVBAR — scroll shadow + burger
======================== */
const navbar   = document.getElementById('navbar');
const burgerBtn = document.getElementById('burgerBtn');
const navMenu  = document.getElementById('navMenu');
const navLinks = navMenu.querySelectorAll('.navbar__link');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burgerBtn.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    burgerBtn.classList.toggle('active', open);
    burgerBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });
});

/* Close mobile menu on outside click */
document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        burgerBtn.classList.remove('active');
        burgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

/* ========================
   SCROLL ANIMATIONS
======================== */
const animItems = document.querySelectorAll('.animate-in');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

animItems.forEach(el => observer.observe(el));

/* ========================
   REVIEWS CAROUSEL
======================== */
const track    = document.getElementById('reviewsCarousel').querySelector('.reviews__track');
const cards    = track.querySelectorAll('.review-card');
const dotsWrap = document.getElementById('reviewsDots');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

let current = 0;
let autoTimer;

/* Build dots */
cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'review-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Opinia ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
});

const dots = dotsWrap.querySelectorAll('.review-dot');

function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetTimer();
}

function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

/* Touch / swipe support */
let touchStartX = 0;
track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
}, { passive: true });
track.addEventListener('touchend', e => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
});

/* Auto-advance */
function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, 5500);
}
resetTimer();

/* Pause on hover */
const carouselWrap = document.querySelector('.reviews__carousel-wrap');
carouselWrap.addEventListener('mouseenter', () => clearInterval(autoTimer));
carouselWrap.addEventListener('mouseleave', resetTimer);

/* ========================
   CONTACT FORM
======================== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = contactForm.name.value.trim();
    const phone   = contactForm.phone.value.trim();
    const message = contactForm.message.value.trim();

    if (!name || !phone || !message) {
        /* Mark empty fields */
        [['name', name], ['phone', phone], ['message', message]].forEach(([id, val]) => {
            const el = document.getElementById(id);
            el.style.borderColor = val ? '' : '#e53e3e';
            el.addEventListener('input', () => { el.style.borderColor = ''; }, { once: true });
        });
        return;
    }

    /* Simulate send — replace with real fetch/form action when backend is ready */
    const submitBtn = contactForm.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wysyłanie…';

    setTimeout(() => {
        contactForm.hidden = true;
        formSuccess.hidden = false;
    }, 800);
});

/* ========================
   SMOOTH ANCHOR SCROLL (fallback for older browsers)
======================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY
                  - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
        window.scrollTo({ top, behavior: 'smooth' });
    });
});

/* ========================
   ACTIVE NAV LINK on scroll
======================== */
const sections = document.querySelectorAll('section[id], .hero[id]');

const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                const href = link.getAttribute('href').replace('#', '');
                link.classList.toggle('active', href === entry.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => navObserver.observe(s));

/* ========================
   GALLERY CAROUSEL
======================== */
(function () {
    const track   = document.getElementById('galleryTrack');
    if (!track) return;

    const slides   = track.querySelectorAll('.gallery__slide');
    const total    = slides.length;
    const thumbsEl = document.getElementById('galleryThumbs');
    const thumbs   = thumbsEl.querySelectorAll('.gallery__thumb');
    const counter  = document.getElementById('gallCounter');
    const prevBtn  = document.getElementById('gallPrev');
    const nextBtn  = document.getElementById('gallNext');
    let current    = 0;

    /* Init counter */
    counter.textContent = `1 / ${total}`;

    function goTo(idx) {
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        counter.textContent = `${current + 1} / ${total}`;
        thumbs.forEach((t, i) => t.classList.toggle('active', i === current));
        thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
    thumbs.forEach((t, i) => t.addEventListener('click', () => goTo(i)));

    /* Touch / swipe */
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const d = tx - e.changedTouches[0].clientX;
        if (Math.abs(d) > 40) d > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    /* Keyboard (only when not in a form field) */
    document.addEventListener('keydown', e => {
        if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return;
        if (e.key === 'ArrowLeft')  goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });
})();

/* ========================
   FILMS CAROUSEL
======================== */
(function () {
    const track   = document.getElementById('filmsTrack');
    if (!track) return;

    const slides   = track.querySelectorAll('.films__slide');
    const total    = slides.length;
    const dotsWrap = document.getElementById('filmsDots');
    const prevBtn  = document.getElementById('filmPrev');
    const nextBtn  = document.getElementById('filmNext');
    let current    = 0;

    /* Build dots */
    const dots = Array.from({ length: total }, (_, i) => {
        const btn = document.createElement('button');
        btn.className = 'film-dot' + (i === 0 ? ' active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', `Film ${i + 1}`);
        btn.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(btn);
        return btn;
    });

    function pauseAll() {
        track.querySelectorAll('video').forEach(v => {
            v.pause();
            const btn = v.closest('.films__phone')?.querySelector('.films__play-btn');
            if (btn) { btn.classList.add('paused'); togglePlayIcons(btn, true); }
        });
    }

    function playActive() {
        const video = slides[current].querySelector('video');
        if (!video) return;
        video.muted = true;
        video.play().catch(() => {});
        const btn = video.closest('.films__phone')?.querySelector('.films__play-btn');
        if (btn) { btn.classList.remove('paused'); togglePlayIcons(btn, false); }
    }

    function togglePlayIcons(btn, showPlay) {
        const play  = btn.querySelector('.icon-play');
        const pause = btn.querySelector('.icon-pause');
        if (play)  play.style.display  = showPlay ? '' : 'none';
        if (pause) pause.style.display = showPlay ? 'none' : '';
    }

    function goTo(idx) {
        pauseAll();
        current = (idx + total) % total;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle('active', i === current));
        playActive();
    }

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    /* Touch / swipe */
    let tx = 0;
    track.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const d = tx - e.changedTouches[0].clientX;
        if (Math.abs(d) > 40) d > 0 ? goTo(current + 1) : goTo(current - 1);
    });

    /* Play / Pause buttons (delegated) */
    track.addEventListener('click', e => {
        const btn = e.target.closest('.films__play-btn');
        if (!btn) return;
        const video = btn.closest('.films__phone')?.querySelector('video');
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {});
            btn.classList.remove('paused');
            togglePlayIcons(btn, false);
        } else {
            video.pause();
            btn.classList.add('paused');
            togglePlayIcons(btn, true);
        }
    });

    /* Mute buttons (delegated) */
    track.addEventListener('click', e => {
        const btn = e.target.closest('.films__mute-btn');
        if (!btn) return;
        const video = btn.closest('.films__phone')?.querySelector('video');
        if (!video) return;
        video.muted = !video.muted;
        btn.style.opacity = video.muted ? '0.5' : '';
    });

    /* Auto-pause when section scrolled out of view */
    const filmsSection = document.querySelector('.films');
    if (filmsSection) {
        new IntersectionObserver(entries => {
            if (!entries[0].isIntersecting) pauseAll();
        }, { threshold: 0.05 }).observe(filmsSection);
    }
})();
