// Lightweight, dependency-free image/video lightbox.
// Activates on any <img data-lightbox> or <video data-lightbox> found on the page.
document.addEventListener('DOMContentLoaded', function () {
    const triggers = Array.prototype.slice.call(document.querySelectorAll('img[data-lightbox], video[data-lightbox]'));
    if (!triggers.length) return;

    // Build overlay markup once.
    const overlay = document.createElement('div');
    overlay.className = 'image-lightbox-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
        '<div class="image-lightbox-content" role="dialog" aria-modal="true" aria-label="Media viewer" tabindex="-1">' +
            '<img class="image-lightbox-image" src="" alt="">' +
            '<video class="image-lightbox-video" playsinline></video>' +
        '</div>';
    document.body.appendChild(overlay);

    const content = overlay.querySelector('.image-lightbox-content');
    const imageEl = overlay.querySelector('.image-lightbox-image');
    const videoEl = overlay.querySelector('.image-lightbox-video');

    let triggerEl = null;
    let isOpen = false;

    function labelFor(el) {
        const explicit = el.getAttribute('aria-label') || el.getAttribute('alt');
        const kind = el.tagName === 'VIDEO' ? 'video' : 'image';
        return explicit ? 'Enlarge ' + kind + ': ' + explicit : 'Enlarge ' + kind;
    }

    triggers.forEach(function (el) {
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.setAttribute('aria-label', labelFor(el));
        el.classList.add('image-lightbox-trigger');

        el.addEventListener('click', function () {
            open(el);
        });
        el.addEventListener('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open(el);
            }
        });
    });

    function getSrc(mediaEl) {
        if (mediaEl.currentSrc) return mediaEl.currentSrc;
        const source = mediaEl.querySelector('source');
        return source ? source.src : mediaEl.src;
    }

    function open(sourceEl) {
        triggerEl = sourceEl;
        isOpen = true;

        if (sourceEl.tagName === 'VIDEO') {
            imageEl.hidden = true;
            videoEl.hidden = false;
            videoEl.loop = sourceEl.loop;
            videoEl.muted = sourceEl.muted;
            videoEl.controls = sourceEl.hasAttribute('controls');
            videoEl.src = getSrc(sourceEl);
            if (sourceEl.autoplay) {
                videoEl.play().catch(function () {});
            }
        } else {
            videoEl.hidden = true;
            imageEl.hidden = false;
            imageEl.src = getSrc(sourceEl);
            imageEl.alt = sourceEl.getAttribute('alt') || '';
        }

        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('image-lightbox-no-scroll');

        document.addEventListener('keydown', onKeydown);
        content.focus();
    }

    function close() {
        if (!isOpen) return;
        isOpen = false;

        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('image-lightbox-no-scroll');

        document.removeEventListener('keydown', onKeydown);

        videoEl.pause();
        videoEl.removeAttribute('src');
        videoEl.load();

        if (triggerEl && typeof triggerEl.focus === 'function') {
            triggerEl.focus();
        }
        triggerEl = null;
    }

    function onKeydown(event) {
        if (event.key === 'Escape') {
            close();
            return;
        }
        if (event.key === 'Tab') {
            // When the video has native controls, let a single Tab move focus
            // into them; otherwise there's nothing else focusable, so trap.
            const hasFocusableControls = !videoEl.hidden && videoEl.controls;
            if (hasFocusableControls && event.target === content && !event.shiftKey) return;
            event.preventDefault();
            content.focus();
        }
    }

    // Click outside the media (backdrop or content padding) closes the overlay.
    overlay.addEventListener('click', function (event) {
        if (event.target === imageEl || event.target === videoEl) return;
        close();
    });
});
