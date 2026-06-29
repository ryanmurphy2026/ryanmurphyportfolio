document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');

    if (!navbar || !navLinks || navbar.querySelector('.mobile-nav-toggle')) {
        return;
    }

    navbar.classList.add('has-mobile-nav');

    const firstNavLink = navLinks.querySelector('a[href]');
    const mobileBrand = document.createElement('a');
    mobileBrand.className = 'mobile-nav-brand';
    mobileBrand.href = firstNavLink ? firstNavLink.getAttribute('href') : 'index.html';
    mobileBrand.textContent = 'Ryan Murphy';

    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-nav-toggle';
    mobileToggle.type = 'button';
    mobileToggle.setAttribute('aria-label', 'Open navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = '<span class="mobile-nav-toggle-lines" aria-hidden="true"></span>';

    navbar.insertBefore(mobileBrand, navLinks);
    navbar.insertBefore(mobileToggle, navLinks);

    const setMenuOpen = (isOpen) => {
        navbar.classList.toggle('nav-open', isOpen);
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
        mobileToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    mobileToggle.addEventListener('click', () => {
        setMenuOpen(!navbar.classList.contains('nav-open'));
    });

    mobileBrand.addEventListener('click', () => {
        setMenuOpen(false);
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) {
            setMenuOpen(false);
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setMenuOpen(false);
        }
    });

    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 701px)').matches) {
            setMenuOpen(false);
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to trigger slide up
                entry.target.classList.add('animate');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of element is visible
    });

    // Observe all slide-up elements
    document.querySelectorAll('.slide-up').forEach(element => {
        observer.observe(element);
    });
});

// Fade in on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Fade out on page exit
document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Only intercept internal links
        if (href.startsWith('#') || href.startsWith('/') || href.includes(window.location.host)) {
            e.preventDefault();
            
            document.body.classList.add('exiting');
            
            setTimeout(() => {
                window.location.href = href;
            }, 400);
        }
    });
});