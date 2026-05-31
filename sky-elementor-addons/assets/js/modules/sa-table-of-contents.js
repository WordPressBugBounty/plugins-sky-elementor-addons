;(function ($, elementor) {
    'use strict';

    var SCROLL_DEBOUNCE_MS = 180;

    /**
     * Single source of truth for .is-collapsible max-height.
     *
     * Reads desired state from two inputs:
     *   1. is-collapsed class (tocbot scroll-driven) — DEBOUNCED so fast
     *      scrolling collapses cleanly to final state without animation pile-up.
     *   2. parent .sa-toc-item :hover (when hoverExpand=true) — INSTANT for
     *      snappy interaction feel.
     *
     * Always animates between measured scrollHeight ↔ 0 so transitions are
     * pixel-perfect at every content size (no CSS max-height snap).
     */
    function setupCollapseManager(navEl, hoverExpand) {
        var collapsibles = navEl.querySelectorAll('.is-collapsible');

        collapsibles.forEach(function (el) {
            var item = el.parentElement; // .sa-toc-item

            // Initial sync — no transition needed (same value → same value)
            if (el.classList.contains('is-collapsed')) {
                el.style.maxHeight = '0px';
                el.style.opacity = '0';
            } else {
                el.style.maxHeight = el.scrollHeight + 'px';
                el.style.opacity = '1';
            }

            function apply() {
                var hovering     = hoverExpand && item && item.matches(':hover');
                var shouldBeOpen = !el.classList.contains('is-collapsed') || hovering;

                if (shouldBeOpen) {
                    el.style.maxHeight = el.scrollHeight + 'px';
                    el.style.opacity   = '1';
                } else {
                    // Lock current height as transition start frame, reflow,
                    // then animate to 0 next frame.
                    el.style.maxHeight = el.scrollHeight + 'px';
                    void el.offsetHeight;
                    requestAnimationFrame(function () {
                        el.style.maxHeight = '0px';
                        el.style.opacity   = '0';
                    });
                }
            }

            // Debounce scroll-driven class flips so rapid scrolling settles
            // on final state instead of firing N overlapping animations.
            var scrollTimer;
            function debouncedApply() {
                clearTimeout(scrollTimer);
                scrollTimer = setTimeout(apply, SCROLL_DEBOUNCE_MS);
            }

            new MutationObserver(debouncedApply).observe(el, {
                attributes: true,
                attributeFilter: ['class']
            });

            // Hover bypasses debounce — instant feedback
            if (hoverExpand && item) {
                item.addEventListener('mouseenter', function () {
                    clearTimeout(scrollTimer); // cancel any pending scroll apply
                    apply();
                });
                item.addEventListener('mouseleave', function () {
                    clearTimeout(scrollTimer);
                    apply();
                });
            }
        });
    }

    var widgetTableOfContents = function ($scope, $) {

        var $el      = $scope.find('.sa-toc'),
            settings = $el.data('settings');

        if (!$el.length || !settings) {
            return;
        }

        var contentEl = document.querySelector(settings.contentSelector);

        if (!contentEl) {
            return;
        }

        // Inject IDs into headings that lack them — tocbot only reads existing IDs
        contentEl.querySelectorAll(settings.headingSelector || 'h2, h3, h4')
            .forEach(function (el, i) {
                if (!el.id) {
                    var slug = el.textContent.trim()
                        .toLowerCase()
                        .replace(/\s+/g, '-')
                        .replace(/[^a-z0-9-]/g, '')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                    el.id = slug || ('sa-toc-' + i);
                }
            });

        // Destroy previous instance on re-render (edit mode refresh)
        var navEl = document.querySelector(settings.tocSelector);
        if (navEl && navEl.innerHTML !== '') {
            tocbot.destroy();
        }

        // disableTocScrollSync is runtime-only — not stored in PHP settings
        settings.disableTocScrollSync = Boolean(elementorFrontend.isEditMode());

        tocbot.init(settings);

        var hoverExpand = $scope.hasClass('sa-toc-hover-yes');

        // Wait one frame so tocbot finishes rendering + class assignment
        requestAnimationFrame(function () {
            if (navEl) {
                setupCollapseManager(navEl, hoverExpand);
            }
        });

        // Bottom-of-page fix — tocbot cannot activate the last heading when the
        // page cannot scroll far enough to bring it within headingsOffset of the
        // viewport top. Detect "at bottom" state and force the last ToC link
        // active. setTimeout(0) defers past tocbot's own rAF scroll handler so
        // our classes land last and are not immediately overwritten.
        if (!elementorFrontend.isEditMode()) {
            var lastTocLink  = null;
            var BOTTOM_PX    = 30; // px tolerance from page bottom
            var activeLinkClass    = settings.activeLinkClass    || 'is-active-link';
            var activeListClass    = settings.activeListItemClass || 'is-active-li';

            requestAnimationFrame(function () {
                if (!navEl) { return; }
                var links = navEl.querySelectorAll('.' + (settings.linkClass || 'sa-toc-link'));
                lastTocLink = links.length ? links[links.length - 1] : null;
            });

            function activateLastIfAtBottom() {
                if (!lastTocLink || !navEl) { return; }
                var atBottom = (window.innerHeight + Math.round(window.scrollY)) >=
                               (document.documentElement.scrollHeight - BOTTOM_PX);
                if (!atBottom) { return; }

                navEl.querySelectorAll('.' + activeLinkClass).forEach(function (a) {
                    a.classList.remove(activeLinkClass);
                });
                navEl.querySelectorAll('.' + activeListClass).forEach(function (li) {
                    li.classList.remove(activeListClass);
                });

                lastTocLink.classList.add(activeLinkClass);

                var li = lastTocLink.closest('li');
                while (li) {
                    li.classList.add(activeListClass);
                    li = li.parentElement ? li.parentElement.closest('li') : null;
                }
            }

            window.addEventListener('scroll', function () {
                setTimeout(activateLastIfAtBottom, 0);
            }, { passive: true });
        }
    };

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/sky-table-of-contents.default',
            widgetTableOfContents
        );
    });

}(jQuery, window.elementorFrontend));
