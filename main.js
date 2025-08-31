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