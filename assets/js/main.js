/**
 * VentureOut - Main JavaScript Logic
 * Handles Light/Dark Theme, RTL Toggle, Counter Animations, Gallery Filtering,
 * FAQ Search, Form Submissions, and Scroll Effects.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Theme Toggle (Light / Dark Mode) ---
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const htmlElem = document.documentElement;

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('venture_theme') || 'light';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElem.getAttribute('data-bs-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }

    function setTheme(theme) {
        htmlElem.setAttribute('data-bs-theme', theme);
        localStorage.setItem('venture_theme', theme);
        if (themeToggleBtn) {
            const icon = themeToggleBtn.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
            }
        }
    }

    // --- 2. RTL Mode Toggle ---
    const rtlToggleBtn = document.getElementById('rtlToggleBtn');
    const savedRtl = localStorage.getItem('venture_rtl') === 'true';

    if (savedRtl) {
        setRtl(true);
    }

    if (rtlToggleBtn) {
        rtlToggleBtn.addEventListener('click', () => {
            const isRtl = htmlElem.getAttribute('dir') === 'rtl';
            setRtl(!isRtl);
        });
    }

    function setRtl(isRtl) {
        if (isRtl) {
            htmlElem.setAttribute('dir', 'rtl');
            localStorage.setItem('venture_rtl', 'true');
            if (rtlToggleBtn) rtlToggleBtn.classList.add('active');
        } else {
            htmlElem.removeAttribute('dir');
            localStorage.setItem('venture_rtl', 'false');
            if (rtlToggleBtn) rtlToggleBtn.classList.remove('active');
        }
    }

    // --- 3. Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- 4. Animated Counters ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        statNumbers.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target') || '0', 10);
            const prefix = counter.getAttribute('data-prefix') || '';
            const suffix = counter.getAttribute('data-suffix') || '';
            let count = 0;
            const speed = target / 50;

            const updateCount = () => {
                count += speed;
                if (count < target) {
                    counter.innerText = prefix + Math.ceil(count) + suffix;
                    setTimeout(updateCount, 30);
                } else {
                    counter.innerText = prefix + target + suffix;
                }
            };
            updateCount();
        });
    }

    // Trigger counter when in view
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animateCounters();
                    animated = true;
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) observer.observe(statsSection);
    }

    // --- 5. Gallery Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                });
            });
        });
    }

    // --- 6. FAQ Search Filter ---
    const faqSearch = document.getElementById('faqSearchInput');
    const faqAccordions = document.querySelectorAll('.accordion-item');

    if (faqSearch && faqAccordions.length > 0) {
        faqSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            faqAccordions.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }

    // --- 7. Generic Form Handling with Alerts ---
    const forms = document.querySelectorAll('form:not([action])');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : 'Submit';

            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...`;
            }

            setTimeout(() => {
                alert('Thank you! Your request has been submitted successfully.');
                form.reset();
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }
            }, 1000);
        });
    });
});
