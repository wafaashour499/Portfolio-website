document.addEventListener('DOMContentLoaded', () => {
    /* ==========================================================================
       Navigation & Mobile Menu
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const mobileOverlay = document.querySelector('.mobile-menu-overlay');
    const navItems = document.querySelectorAll('.nav-links a');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Nav Link on Scroll
        updateActiveNavLink();
    });

    // Mobile Menu Toggle
    function toggleMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        mobileOverlay.classList.toggle('active');

        // Toggle icon between bars and times
        const icon = hamburger.querySelector('i');
        if (hamburger.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    hamburger.addEventListener('click', toggleMenu);
    mobileOverlay.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    /* ==========================================================================
       Scroll Progress Bar
       ========================================================================== */
    const scrollProgressBar = document.getElementById('scroll-progress-bar');

    function updateScrollProgressBar() {
        if (!scrollProgressBar) return;
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgressBar.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgressBar);
    updateScrollProgressBar();

    /* ==========================================================================
       Scroll Spy for Navigation
       ========================================================================== */
    const sections = document.querySelectorAll('section');

    function updateActiveNavLink() {
        let current = '';
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust offset for fixed header
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            // Use endswith or includes to match href="#section-id"
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });
    }

    /* ==========================================================================
       Scroll Reveal Animation
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(element => {
        revealOnScroll.observe(element);
    });

    // Trigger once on load in case elements are already in view
    setTimeout(() => {
        revealElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                element.classList.add('active');
            }
        });
    }, 100);
    /* ==========================================================================
       Case Study Modal
       ========================================================================== */
    const modalOpenTriggers = document.querySelectorAll('[data-open-modal]');
    const modalCloseTriggers = document.querySelectorAll('[data-close-modal]');
    let lastFocusedElement = null;

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        lastFocusedElement = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
    }

    function closeModal(modal) {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    modalOpenTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(trigger.getAttribute('data-open-modal'));
        });
    });

    modalCloseTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = trigger.closest('.cs-modal');
            if (modal) closeModal(modal);
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.cs-modal.open').forEach(modal => closeModal(modal));
        }
    });

    /* ==========================================================================
       Back to Top Button
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ==========================================================================
       Dark/Light Mode Toggle
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    let isDarkMode = false;

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = !isDarkMode;
            if (isDarkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
                themeToggleBtn.textContent = '🌙';
            } else {
                document.documentElement.removeAttribute('data-theme');
                themeToggleBtn.textContent = '☀️';
            }
        });
    }

    /* ==========================================================================
       Contact Form Submission
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = typeof currentLang !== 'undefined' && currentLang === 'ar' ? 'شكراً على رسالتك!' : 'Thanks for your submission!';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.textContent = typeof currentLang !== 'undefined' && currentLang === 'ar' ? 'عذراً! حدثت مشكلة أثناء إرسال النموذج' : 'Oops! There was a problem submitting your form';
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                formStatus.textContent = typeof currentLang !== 'undefined' && currentLang === 'ar' ? 'عذراً! حدثت مشكلة أثناء إرسال النموذج' : 'Oops! There was a problem submitting your form';
                formStatus.className = 'form-status error';
            }
        });
    }
});
