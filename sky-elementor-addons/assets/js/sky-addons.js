(function ($, elementor) {
    'use strict';

var widgetAdvancedAccordion = function ($scope, $) {
    var $advancedAccordion = $scope.find('.sa-advanced-accordion');
    var $settings = $advancedAccordion.data('settings');

    if (!$advancedAccordion.length) {
        return;
    }

    var accOptions = {
        duration:     $settings.duration,
        showMultiple: $settings.showMultiple,
        collapse:     $settings.collapse,
        elementClass: 'sa-ac-item',
        triggerClass: 'sa-ac-trigger',
        panelClass:   'sa-ac-panel',
        activeClass:  'is-active',
    };

    var $cols = $advancedAccordion.children('.sa-acc-col');

    if ($cols.length) {
        // Multi-column: init on each column div so accordion.js finds
        // .sa-ac-item as direct children. Map global openOnInit indices
        // to per-column indices so the correct item opens in the right column.
        var openOnInit = $settings.openOnInit || [];
        var offset = 0;

        $cols.each(function () {
            var colEl    = this;
            var colCount = $(colEl).children('.sa-ac-item').length;
            var colOpen  = openOnInit
                .filter(function (i) { return i >= offset && i < offset + colCount; })
                .map(function (i) { return i - offset; });

            new Accordion(colEl, $.extend({}, accOptions, { openOnInit: colOpen }));
            offset += colCount;
        });
    } else {
        new Accordion('#' + $settings.id, $.extend({}, accOptions, {
            openOnInit: $settings.openOnInit,
        }));
    }
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-advanced-accordion.default', widgetAdvancedAccordion);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetAdvancedSkillBars = function ($scope, $) {
    var $advancedSkillBars = $scope.find('.sa-advanced-skills'),
        $items = $scope.find('.sa-skill-item');

    if (!$advancedSkillBars.length) {
        return;
    }

    var settings      = $advancedSkillBars.data('settings') || {};
    var animDuration  = settings.animDuration  || 2600;
    var animThreshold = settings.animThreshold || 0.8;
    var valuePrefix   = settings.valuePrefix   || '';
    var valueSuffix   = settings.valueSuffix   !== undefined ? settings.valueSuffix : '%';

    $items.each(function () {
        var $item = $(this);

        skyAddonsObserver($item[0], function () {
            var $bars = $item.find('.sa-skill-progress-bar');

            $bars.each(function () {
                var $bar         = $(this);
                var skillMaxValue = parseFloat($bar.attr('data-max-value')) || 100;
                var skillFillVal  = parseFloat($bar.attr('data-width'))     || 0;
                var result        = (skillFillVal * 100) / skillMaxValue;

                $bar.css('width', result + '%');

                $bar.children('.sa-skill-content-wrapper, .sa-skill-value').css('transform', 'scale(1)');

                $item.find('.sa-skill-value').prop('Counter', 0).animate({
                    Counter: skillFillVal
                }, {
                    duration: animDuration,
                    easing: 'swing',
                    step: function (now) {
                        $(this).text(valuePrefix + Math.ceil(now) + valueSuffix);
                    }
                });
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: animThreshold,
        });
    });
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-advanced-skill-bars.default', widgetAdvancedSkillBars);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetAdvancedSlider = function ($scope, $) {
    var $slider = $scope.find('.sa-advanced-slider'),
        $sliderContainer = $slider.find('.swiper'),
        $settings = $slider.data('settings');

    if (!$slider.length) {
        return;
    }

    function activateSlideVideo($slide) {
        // Lazy-load iframe: set src from data-src on first activation
        $slide.find('iframe[data-src]').each(function () {
            this.src = this.dataset.src;
            delete this.dataset.src;
        });
        // Resume already-loaded iframes
        $slide.find('[data-video-type="youtube"] iframe').each(function () {
            try {
                this.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
            } catch (e) {}
        });
        $slide.find('[data-video-type="vimeo"] iframe').each(function () {
            try {
                this.contentWindow.postMessage('{"method":"play"}', '*');
            } catch (e) {}
        });
        // HTML5 video
        $slide.find('video').each(function () {
            this.play().catch(function () {});
        });
    }

    function deactivateSlideVideo($slide) {
        $slide.find('[data-video-type="youtube"] iframe').each(function () {
            try {
                this.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
            } catch (e) {}
        });
        $slide.find('[data-video-type="vimeo"] iframe').each(function () {
            try {
                this.contentWindow.postMessage('{"method":"pause"}', '*');
            } catch (e) {}
        });
        $slide.find('video').each(function () {
            this.pause();
        });
    }

    var hasVideo = $slider.find('.sa-slide-video-wrapper').length > 0;

    // Destroy any existing Swiper instance on this container before re-init
    if ($sliderContainer[0] && $sliderContainer[0].swiper) {
        $sliderContainer[0].swiper.destroy(true, true);
    }

    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {
        var swiper = await new Swiper($sliderContainer, $settings);

        if ($settings.pauseOnHover) {
            $($sliderContainer).hover(function () {
                (this).swiper.autoplay.stop();
            }, function () {
                (this).swiper.autoplay.start();
            });
        }

        if (hasVideo) {
            // Load and play the initial active slide's video immediately
            activateSlideVideo($slider.find('.swiper-slide-active'));

            swiper.on('slideChangeTransitionStart', function () {
                deactivateSlideVideo($slider.find('.swiper-slide-prev, .swiper-slide-next'));
            });

            swiper.on('slideChangeTransitionEnd', function () {
                activateSlideVideo($slider.find('.swiper-slide-active'));
            });
        }
    };

};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-advanced-slider.default', widgetAdvancedSlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetAnimatedHeading = function ($scope, $) {

    var $animatedHeading = $scope.find('.sa-animated-heading');
    var $settings = $animatedHeading.data('settings');
    if (!$animatedHeading.length || !$settings) {
        return;
    }

    var isRtl = $('body').hasClass('rtl')
        || $('html').attr('dir') === 'rtl'
        || $animatedHeading.css('direction') === 'rtl';

    skyAddonsObserver($scope[0], function () {
        var selector = $animatedHeading.data('id');
        var style = $settings.style;
        delete $settings.style;

        if ('typed' === style) {
            new Typed('#' + selector, $settings);
        } else if ('animated' === style) {
            $('#' + selector).Morphext($settings);
        } else if ('highlight' === style) {
            saHighlight('#' + selector, $settings);
        } else if ('glitch' === style) {
            saGlitch('#' + selector, $settings);
        } else if ('reveal' === style) {
            saReveal('#' + selector, $settings, isRtl);
        } else if ('word-rotate' === style) {
            saWordRotate('#' + selector, $settings);
        } else if ('split-chars' === style) {
            saSplitChars('#' + selector, $settings, isRtl);
        } else if ('gravity' === style) {
            saGravity('#' + selector, $settings, isRtl);
        } else if ('flip-chars' === style) {
            saFlipChars('#' + selector, $settings, isRtl);
        } else if ('vortex' === style) {
            saVortex('#' + selector, $settings, isRtl);
        } else if ('wave-in' === style) {
            saWaveIn('#' + selector, $settings, isRtl);
        }
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.8
    });

};

function saHighlight(selector, settings) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function showWord() {
        var $span = $('<span class="sa-word sa-highlight-word">').html(words[i % words.length]);
        $el.html($span);
        setTimeout(function () { $span.addClass('sa--active'); }, 30);
        i++;
    }

    showWord();
    setInterval(showWord, interval);
}

function saGlitch(selector, settings) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var chars = '!<>-_\\/[]{}=+*^?#@';
    var i = 0;
    var timer;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function glitch(word) {
        var decoded = decodeHtml(word);
        var duration = 600;
        var start = Date.now();
        clearInterval(timer);
        timer = setInterval(function () {
            var elapsed = Date.now() - start;
            var progress = Math.min(elapsed / duration, 1);
            var result = decoded.split('').map(function (ch, idx) {
                if (idx < Math.floor(progress * decoded.length)) { return decoded[idx]; }
                return chars[Math.floor(Math.random() * chars.length)];
            }).join('');
            $el.text(result);
            if (progress >= 1) { clearInterval(timer); $el.text(decoded); }
        }, 30);
    }

    glitch(words[i++]);
    setInterval(function () { glitch(words[i++ % words.length]); }, interval);
}

function saReveal(selector, settings, isRtl) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function showWord() {
        var cls = 'sa-reveal-word' + (isRtl ? ' sa-reveal-rtl' : '');
        $el.html($('<span>').addClass(cls).html(words[i++ % words.length]));
    }

    showWord();
    setInterval(showWord, interval);
}

function saWordRotate(selector, settings) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function showWord() {
        var $old = $el.find('.sa-rotate-word');
        if ($old.length) {
            $old.addClass('sa-rotate-exit').one('animationend webkitAnimationEnd', function () { $(this).remove(); });
        }
        $el.append($('<span class="sa-rotate-word">').html(words[i++ % words.length]));
    }

    showWord();
    setInterval(showWord, interval);
}

function saCharWord(selector, settings, isRtl, cls, makeSpan) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function showWord() {
        var $old = $el.find('.' + cls);
        var $new = makeSpan(decodeHtml(words[i++ % words.length]), isRtl);
        if ($old.length) {
            $old.css({ position: 'absolute', left: 0, top: 0 });
            exitWord($old);
        }
        $el.append($new);
    }

    showWord();
    setInterval(showWord, interval);
}

function saSplitChars(selector, settings, isRtl) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function makeWordSpan(word) {
        var $wrap = $('<span class="sa-split-word">');
        if (isRtl) { $wrap.attr('dir', 'rtl'); }
        decodeHtml(word).split('').forEach(function (ch, idx) {
            var tx = (Math.random() * 140 - 70), ty = (Math.random() * 140 - 70), rot = (Math.random() * 300 - 150);
            var $char = $('<span class="sa-split-char">').text(ch === ' ' ? ' ' : ch);
            $char.css({ transform: 'translate(' + tx + 'px,' + ty + 'px) rotate(' + rot + 'deg)', opacity: 0 });
            $wrap.append($char);
            setTimeout(function () {
                $char.css({ transform: 'translate(0,0) rotate(0deg)', opacity: 1, transition: 'transform 0.55s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease' });
            }, 20 + idx * 35);
        });
        return $wrap;
    }

    function showWord() {
        var $old = $el.find('.sa-split-word');
        if ($old.length) {
            $old.css({ position: 'absolute', left: 0, top: 0 });
            $old.find('.sa-split-char').each(function (idx) {
                var $c = $(this), tx = (Math.random() * 140 - 70), ty = (Math.random() * 140 - 70), rot = (Math.random() * 300 - 150);
                setTimeout(function () {
                    $c.css({ transform: 'translate(' + tx + 'px,' + ty + 'px) rotate(' + rot + 'deg)', opacity: 0, transition: 'transform 0.35s ease, opacity 0.28s ease' });
                }, idx * 25);
            });
            setTimeout(function () { $old.remove(); }, 600);
        }
        $el.append(makeWordSpan(words[i++ % words.length]));
    }

    showWord();
    setInterval(showWord, interval);
}

function saGravity(selector, settings, isRtl) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function makeWordSpan(word) {
        var $wrap = $('<span class="sa-gravity-word">');
        if (isRtl) { $wrap.attr('dir', 'rtl'); }
        decodeHtml(word).split('').forEach(function (ch, idx) {
            $wrap.append($('<span class="sa-gravity-char">').text(ch === ' ' ? ' ' : ch).css('animation-delay', (idx * 40) + 'ms'));
        });
        return $wrap;
    }

    function showWord() {
        var $old = $el.find('.sa-gravity-word');
        if ($old.length) {
            $old.css({ position: 'absolute', left: 0, top: 0 }).addClass('sa-gravity-exit');
            setTimeout(function () { $old.remove(); }, 450);
        }
        $el.append(makeWordSpan(words[i++ % words.length]));
    }

    showWord();
    setInterval(showWord, interval);
}

function saFlipChars(selector, settings, isRtl) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function makeWordSpan(word) {
        var $wrap = $('<span class="sa-flip-word">');
        if (isRtl) { $wrap.attr('dir', 'rtl'); }
        decodeHtml(word).split('').forEach(function (ch, idx) {
            $wrap.append($('<span class="sa-flip-char">').text(ch === ' ' ? ' ' : ch).css('animation-delay', (idx * 50) + 'ms'));
        });
        return $wrap;
    }

    function showWord() {
        var $old = $el.find('.sa-flip-word');
        if ($old.length) {
            $old.css({ position: 'absolute', left: 0, top: 0 }).addClass('sa-flip-exit');
            setTimeout(function () { $old.remove(); }, 450);
        }
        $el.append(makeWordSpan(words[i++ % words.length]));
    }

    showWord();
    setInterval(showWord, interval);
}

function saVortex(selector, settings, isRtl) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function makeWordSpan(word) {
        var $wrap = $('<span class="sa-vortex-word">');
        if (isRtl) { $wrap.attr('dir', 'rtl'); }
        var chars = decodeHtml(word).split('');
        chars.forEach(function (ch, idx) {
            var cx = (idx - (chars.length - 1) / 2), rot = (Math.random() * 360 - 180);
            var $char = $('<span class="sa-vortex-char">').text(ch === ' ' ? ' ' : ch);
            $char.css({ transform: 'translateX(' + (-cx * 28) + 'px) rotate(' + rot + 'deg) scale(0)', opacity: 0 });
            $wrap.append($char);
            setTimeout(function () {
                $char.css({ transform: 'translateX(0) rotate(0deg) scale(1)', opacity: 1, transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease' });
            }, 20 + idx * 45);
        });
        return $wrap;
    }

    function showWord() {
        var $old = $el.find('.sa-vortex-word');
        if ($old.length) {
            $old.css({ position: 'absolute', left: 0, top: 0 });
            var total = $old.find('.sa-vortex-char').length;
            $old.find('.sa-vortex-char').each(function (idx) {
                var $c = $(this), cx = (idx - (total - 1) / 2), rot = (Math.random() * 360 - 180);
                setTimeout(function () {
                    $c.css({ transform: 'translateX(' + (-cx * 28) + 'px) rotate(' + rot + 'deg) scale(0)', opacity: 0, transition: 'transform 0.35s ease, opacity 0.28s ease' });
                }, idx * 30);
            });
            setTimeout(function () { $old.remove(); }, 550);
        }
        $el.append(makeWordSpan(words[i++ % words.length]));
    }

    showWord();
    setInterval(showWord, interval);
}

function saWaveIn(selector, settings, isRtl) {
    var $el = $(selector);
    var words = settings.strings || [];
    var interval = settings.interval || 2000;
    var i = 0;

    if (!words.length) { return; }

    function decodeHtml(html) { return $('<span>').html(html).text(); }

    function showWord() {
        $el.empty();
        var $wrap = $('<span>');
        if (isRtl) { $wrap.attr('dir', 'rtl'); }
        decodeHtml(words[i++ % words.length]).split('').forEach(function (ch, idx) {
            $wrap.append($('<span class="sa-wave-char">').text(ch === ' ' ? ' ' : ch).css('animation-delay', (idx * 55) + 'ms'));
        });
        $el.append($wrap);
    }

    showWord();
    setInterval(showWord, interval);
}

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-animated-heading.default', widgetAnimatedHeading);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetAudioPlayer = function ($scope, $) {
    var $el      = $scope.find('.sa-audio-player'),
        $audio   = $scope.find('audio')[0],
        settings = $el.data('settings');

    if (!$el.length || !$audio) { return; }

    var player = new Plyr($audio, {
        controls:    [],
        autoplay:    settings.autoplay || false,
        loop:        { active: settings.loop || false },
        clickToPlay: false,
    });

    var isVinyl   = $el.hasClass('sa-style-vinyl'),
        vinylFill = isVinyl ? $el.find('.sa-vinyl-fill')[0] : null,
        vinylCirc = 565;

    $el.find('.sa-btn-play-pause').on('click', function () {
        player.togglePlay();
    });

    $el.find('.sa-progress-bar').on('click', function (e) {
        if (!player.duration) { return; }
        var pct = e.offsetX / $(this).outerWidth();
        var $fill = $el.find('.sa-progress-fill');
        $fill.css('transition', 'none');
        if (vinylFill) { vinylFill.style.transition = 'none'; }
        player.currentTime = pct * player.duration;
        setTimeout(function () {
            $fill.css('transition', '');
            if (vinylFill) { vinylFill.style.transition = ''; }
        }, 50);
    });

    $el.find('.sa-volume-slider').on('input', function () {
        player.volume = parseFloat($(this).val());
    });

    player.on('timeupdate', function () {
        if (!player.duration) { return; }
        var pct = (player.currentTime / player.duration) * 100;
        $el.find('.sa-progress-fill').css('width', pct + '%');
        $el.find('.sa-progress-bar').attr('aria-valuenow', Math.round(pct));
        $el.find('.sa-time-current').text(saFormatTime(player.currentTime));
        if (vinylFill) {
            vinylFill.style.strokeDashoffset = vinylCirc - (pct / 100) * vinylCirc;
        }
    });

    player.on('ready loadedmetadata', function () {
        $el.find('.sa-time-total').text(saFormatTime(player.duration || 0));
    });

    player.on('play',  function () { $el.addClass('sa-is-playing'); });
    player.on('pause', function () { $el.removeClass('sa-is-playing'); });
    player.on('ended', function () { $el.removeClass('sa-is-playing'); });
};

function saFormatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) { return '0:00'; }
    var m = Math.floor(seconds / 60),
        s = Math.floor(seconds % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
}

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-audio-player.default', widgetAudioPlayer);
    });

}(jQuery, window.elementorFrontend));

(function ($) {
    'use strict';

    var widgetChangelog = function ($scope) {
        var $wrapper = $scope.find('.sa-changelog-wrapper');
        if (!$wrapper.length) return;

        var limit    = parseInt($wrapper.data('versions-limit'), 10) || 3;
        var step     = parseInt($wrapper.data('load-step'), 10) || 3;
        var btnLabel = $wrapper.data('load-more-text') || 'Load More Versions';
        var $cards   = $wrapper.find('.sa-changelog-version');

        if ($cards.length <= limit) return;

        $cards.slice(limit).hide();

        var remaining = $cards.length - limit;

        var $btn = $(
            '<a class="sa-cl-load-more" type="button">' +
                '<span class="sa-cl-icon"></span>' +
                '<span class="sa-cl-btn-label">' + btnLabel + '</span>' +
                '<span class="sa-cl-count">+' + remaining + '</span>' +
            '</a>'
        );

        $wrapper.after($btn);

        $btn.on('click', function () {
            if ($btn.hasClass('sa-cl-loading')) return;

            $btn.addClass('sa-cl-loading');

            var $hidden  = $cards.filter(':hidden');
            var $toShow  = $hidden.slice(0, step);
            var revealCount = $toShow.length;

            $toShow.each(function (i) {
                var $card = $(this);
                setTimeout(function () {
                    $card.slideDown(400);
                }, i * 80);
            });

            setTimeout(function () {
                $btn.removeClass('sa-cl-loading');

                var stillHidden = $cards.filter(':hidden').length;

                if (stillHidden === 0) {
                    $btn.addClass('sa-cl-done');
                    setTimeout(function () { $btn.remove(); }, 500);
                } else {
                    // Pop animation on count badge update
                    var $count = $btn.find('.sa-cl-count');
                    $count.text('+' + stillHidden).addClass('sa-cl-pop');
                    setTimeout(function () { $count.removeClass('sa-cl-pop'); }, 400);
                }
            }, (revealCount - 1) * 80 + 430);
        });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/sky-changelog.default',
            widgetChangelog
        );
    });

}(jQuery));

(function ($, elementor) {
    'use strict';

var widgetContentSwitcher = function ($scope, $) {

    var $contentSwitcher = $scope.find('.sa-content-switcher'),
        $settings = $contentSwitcher.data('settings');

    if (!$contentSwitcher.length) {
        return;
    }

    var switcherToggle = $contentSwitcher.find('.sa-switcher-toggle'),
        checkbox = $($settings.checkbox),
        switcherWrapper = $contentSwitcher.find('.sa-switcher-wrap'),
        contentWrapper = $contentSwitcher.find('.sa-content-wrapper');

    // Apply user-defined transition speed as a CSS custom property
    if ($settings.transitionSpeed) {
        $contentSwitcher.css('--sa-transition-speed', $settings.transitionSpeed + 'ms');
    }

    // ── Binary toggle mode ────────────────────────────────────────────────────
    if ($settings.type !== 'button') {

        function activateBinaryItem(isSecondary) {
            if (isSecondary) {
                switcherWrapper.find('.sa-switch-item').removeClass('sa-active');
                switcherWrapper.find('.sa-switch-item.sa-secondary').addClass('sa-active');
                contentWrapper.find('.sa-switch-content-item').removeClass('sa-active');
                contentWrapper.find('.sa-switch-content-item.sa-secondary').addClass('sa-active');
            } else {
                switcherWrapper.find('.sa-switch-item').removeClass('sa-active');
                switcherWrapper.find('.sa-switch-item.sa-primary').addClass('sa-active');
                contentWrapper.find('.sa-switch-content-item').removeClass('sa-active');
                contentWrapper.find('.sa-switch-content-item.sa-primary').addClass('sa-active');
            }
        }

        switcherToggle.on('click', function () {
            activateBinaryItem(checkbox.is(':checked'));
        });

        // Deep link: activate the matching item on page load
        var hash = window.location.hash ? window.location.hash.slice(1) : '';
        if (hash) {
            var $primary   = switcherWrapper.find('.sa-switch-item.sa-primary');
            var $secondary = switcherWrapper.find('.sa-switch-item.sa-secondary');
            if ($primary.data('slug') === hash) {
                checkbox.prop('checked', false);
                activateBinaryItem(false);
            } else if ($secondary.data('slug') === hash) {
                checkbox.prop('checked', true);
                activateBinaryItem(true);
            }
        }
    }

    // ── Button (tabs) mode ────────────────────────────────────────────────────
    if ($settings.type === 'button') {

        var borderSize = $settings.borderSize || 0,
            isVertical = $settings.orientation === 'vertical',
            tabs       = $contentSwitcher.find('.sa-switcher-tabs');

        function positionSelector($item) {
            var pos = $item.position();
            if (isVertical) {
                $contentSwitcher.find('.sa-selector').css({
                    top:    pos.top + 'px',
                    height: $item.outerHeight() + 'px',
                });
            } else {
                $contentSwitcher.find('.sa-selector').css({
                    left:  pos.left + 'px',
                    width: ($item.innerWidth() + borderSize) + 'px',
                });
            }
        }

        var activeItem = tabs.find('.sa-active');
        if (activeItem.length) {
            positionSelector(activeItem);
        }

        tabs.on('click', 'a', function (e) {
            e.preventDefault();

            var id = $(this).data('id');

            switcherWrapper.find('.sa-switcher-tabs a').removeClass('sa-active');
            $(this).addClass('sa-active');

            contentWrapper.find('.sa-switch-content-item').removeClass('sa-active');
            contentWrapper.find('#' + id).addClass('sa-active');

            positionSelector($(this));
        });

        // Deep link: click the matching tab on page load
        var hash = window.location.hash ? window.location.hash.slice(1) : '';
        if (hash) {
            var $target = tabs.find('[data-slug="' + hash + '"]');
            if ($target.length) {
                $target.trigger('click');
            }
        }

        if ($('body').hasClass('rtl')) {
            $contentSwitcher.find('.sa-switcher-tabs .sa-selector').css({
                right: 'auto',
            });
        }
    }

};
    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-content-switcher.default', widgetContentSwitcher);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-edd-category-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetFellowSlider = function ($scope, $) {

    var $fellowSlider = $scope.find('.sa-fellow-slider'),
        $fellowContainer = $fellowSlider.find('.sa-fellow.swiper'),
        $itemsContainer = $fellowSlider.find('.sa-fellow-items.swiper'),
        $playerSettings = $fellowSlider.data('player-settings'),
        $listSettings = $fellowSlider.data('playlist-settings');

    if (!$fellowSlider.length) {
        return;
    }

    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {

        var playerItems = await new Swiper($itemsContainer, $listSettings);

        var player = await new Swiper($fellowContainer, $playerSettings);

        player.controller.control = playerItems;
        playerItems.controller.control = player;

        if ($playerSettings.pauseOnHover) {
            $($fellowContainer).hover(function () {
                (this).swiper.autoplay.stop();
            }, function () {
                (this).swiper.autoplay.start();
            });
        }
    };
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-fellow-slider.default', widgetFellowSlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-generic-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetGlorySlider = function ($scope, $) {

    var $glorySlider = $scope.find('.sa-glory-slider'),
        $playerContainer = $glorySlider.find('.sa-glory-player'),
        $thumbsContainer = $glorySlider.find('.sa-glory-thumbs'),
        $playerSettings = $glorySlider.data('player-settings'),
        $thumbsSettings = $glorySlider.data('thumbs-settings');

    if (!$glorySlider.length) {
        return;
    }

    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {
        var playerThumbs = null;
        if ($thumbsContainer.length) {
            playerThumbs = await new Swiper($thumbsContainer, $thumbsSettings);
        }

        var player = await new Swiper($playerContainer, $playerSettings);

        if (playerThumbs) {
            player.controller.control = playerThumbs;
            playerThumbs.controller.control = player;

            var testWidth = $glorySlider.find('.sa-glory-player .swiper-slide-active').width();
            $glorySlider.find('.sa-glory-thumbs').width(testWidth);
        }

        player.on('slideChange', function () {
            resetVideos();
        });
    };


    function resetVideos() {
        $($glorySlider).find('.sa-video-player').css('z-index', -1);
        var videos = $($glorySlider).find('.sa-player-iframe');
        Array.prototype.forEach.call(videos, function (video) {
            var src = video.src;
            video.src = src.replace("?autoplay=1", "");
            $($glorySlider).find('.sa-player-iframe').prop("src", "");
        });
    }

    $('.sa-play-button').on('click', function () {
        var videoURL = $(this).data('src').split('?')[0]; // also removed @param
        var sliderWrapper = $(this).closest('.sa-player-wrapper');
        sliderWrapper.find('.sa-player-iframe').attr("src", videoURL + "?autoplay=1");
        sliderWrapper.find('.sa-video-player').css('z-index', 10);

    });

};
    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-glory-slider.default', widgetGlorySlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

    var widgetImageCompare = function ($scope, $) {

        var $imageCompare = $scope.find('.sa-image-compare');
        var $settings = $imageCompare.data('settings');
        if (!$imageCompare.length) {
            return;
        }

        var viewers = document.querySelectorAll('#' + $settings.id);

        // Responsive starting point — PHP can't detect viewport, so JS overrides here
        var isMobile = window.innerWidth <= 767;
        if (isMobile && $settings.mobileStartingPoint) {
            $settings.startingPoint = $settings.mobileStartingPoint;
        }

        viewers.forEach(function (element) {
            new ImageCompare(element, $settings).mount();

            // DOM overrides — library sets these as inline styles, so we override post-mount

            // Circle Size
            if ($settings.addCircle && $settings.circleSize && $settings.circleSize !== 50) {
                $(element).find('.icv__circle').css({ width: $settings.circleSize + 'px', height: $settings.circleSize + 'px' });
            }

            // Circle Vertical Offset
            if ($settings.addCircle && $settings.circleVerticalOffset && $settings.circleVerticalOffset !== 0) {
                $(element).find('.icv__circle').css('transform', 'translateY(' + $settings.circleVerticalOffset + 'px)');
            }

            // Smoothing Easing
            if ($settings.smoothing && $settings.smoothingEase && 'ease-out' !== $settings.smoothingEase) {
                $(element).find('.icv__theme-wrapper, .icv__wrapper').css('transition-timing-function', $settings.smoothingEase);
            }

            // Label Fade Duration
            if ($settings.labelOptionsonHover && $settings.labelFadeDuration && $settings.labelFadeDuration !== 0.25) {
                $(element).find('.icv__label.on-hover').css('transition-duration', $settings.labelFadeDuration + 's');
            }

            // Entry Animation — fade-in only, no transform conflict with library positioning
            if ($settings.animateOnLoad) {
                var duration = $settings.entryAnimationDuration || 800;
                var ease = $settings.smoothingEase || 'ease-out';
                var keyframeStyle = '@keyframes sa-ic-fade-in { from { opacity: 0; } to { opacity: 1; } }';
                $('<style id="sa-ic-anim-' + $settings.id + '">' + keyframeStyle + '</style>').appendTo('head');
                $(element).find('.icv__control').css('animation', 'sa-ic-fade-in ' + duration + 'ms ' + ease + ' forwards');
            }
        });
    };

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-image-compare.default', widgetImageCompare);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

    var widgetLogoCarousel = function ($scope, $) {

        var $logoCarousel = $scope.find('.sa-logo-carousel'),
            $carouselContainer = $logoCarousel.find('.swiper'),
            $settings = $logoCarousel.data('settings');

        if (!$logoCarousel.length) {
            return;
        }

        var $tooltips = $logoCarousel.find('.sa-tippy-tooltip'),
            widgetID = $scope.data('id');

        $tooltips.each(function () {
            tippy(this, {
                allowHTML: true,
                theme: 'sa-tippy-' + widgetID
            });
        });

        // Disable loop when slide count <= highest slidesPerView to prevent Swiper blank-slide glitch
        if ($settings.loop) {
            var slideCount = $carouselContainer.find('.swiper-slide').length;
            var maxPerView = $settings.slidesPerView || 1;
            if ($settings.breakpoints) {
                Object.values($settings.breakpoints).forEach(function (bp) {
                    if (bp.slidesPerView && bp.slidesPerView > maxPerView) {
                        maxPerView = bp.slidesPerView;
                    }
                });
            }
            if (slideCount <= maxPerView) {
                $settings.loop = false;
            }
        }

        const Swiper = elementorFrontend.utils.swiper;
        initSwiper();
        async function initSwiper() {
            var swiper = await new Swiper($carouselContainer, $settings);
            if ($settings.pauseOnHover) {
                $carouselContainer.hover(function () {
                    this.swiper.autoplay.stop();
                }, function () {
                    this.swiper.autoplay.start();
                });
            }
        }

    };

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/sky-logo-carousel.default', widgetLogoCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

    var widgetLogoGrid = function ($scope, $) {

        var $logoGrid = $scope.find('.sa-logo-grid');

        if (!$logoGrid.length) {
            return;
        }

        var $tooltips = $logoGrid.find('.sa-tippy-tooltip'),
            widgetID = $scope.data('id');

        $tooltips.each(function () {
            tippy(this, {
                allowHTML: true,
                theme: 'sa-tippy-' + widgetID
            });
        });

    };

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/sky-logo-grid.default', widgetLogoGrid);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-loop-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-luster-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-mate-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetMateSlider = function ($scope, $) {

    var $dataWrapper = $scope.find('.sa-mate-slider'),
        $primaryContainer = $dataWrapper.find('.sa-mate-primary.swiper'),
        $secondaryContainer = $dataWrapper.find('.sa-mate-secondary.swiper'),
        $primarySettings = $dataWrapper.data('primary-settings'),
        $secondarySettings = $dataWrapper.data('secondary-settings');

    if (!$dataWrapper.length) {
        return;
    }

    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {

        var secondary = await new Swiper($secondaryContainer, $secondarySettings);

        var primary = await new Swiper($primaryContainer, $primarySettings);

        primary.controller.control = secondary;
        secondary.controller.control = primary;

        if ($primarySettings.pauseOnHover) {
            $($fellowContainer).hover(function () {
                (this).swiper.autoplay.stop();
            }, function () {
                (this).swiper.autoplay.start();
            });
        }
    };
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-mate-slider.default', widgetMateSlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

    var widgetMomentumSlider = function ($scope, $) {
        var $momentumSlider = $scope.find('.sa-momentum-slider'),
            $settings = $momentumSlider.data('settings'),
            slidersContainer = document.querySelector($settings.id),
            range = $settings.range;

        // Initializing the numbers slider
        var msNumbers = new MomentumSlider({
            el: slidersContainer,
            cssClass: 'ms--numbers',
            range: [1, range],
            rangeContent: function (i) {
                return '0' + i;
            },
            style: {
                transform: [{scale: [0.4, 1]}],
                opacity: [0, 1]
            },
            interactive: false
        });

        // Initializing the titles slider
        var titles = $settings.sliderTitles;
        var msTitles = new MomentumSlider({
            el: slidersContainer,
            cssClass: 'ms--titles',
            range: [0, range - 1],
            rangeContent: function (i) {
                return '<' + $settings.titleTag + ' class="ms-slide-title">' + titles[i] + '</' + $settings.titleTag + '>';
            },
            vertical: true,
            reverse: true,
            style: {
                opacity: [0, 1]
            },
            interactive: false
        });
        // Initializing the links slider
        var sliderAttrs = $settings.sliderAttr;
        var msLinks = new MomentumSlider({
            el: slidersContainer,
            cssClass: 'ms--links',
            range: [0, range - 1],
            rangeContent: function (i) {
                // var buttonLinksTarget = $settings.buttonLinksTarget[i] != false ? 'target="_blank"' : '';
//                return '<a href="'+buttonLinks[i]+'" '+buttonLinksTarget+' class="ms-slide__link sa-link">'+$settings.buttonText+'</a>';
                return '<a ' + sliderAttrs[i] + ' class="ms-slide__link sa-link sa-text-decoration-none">' + $settings.buttonText + '</a>';
            },
            vertical: true,
            interactive: false
        });
        // Get pagination items
        var pagination = document.querySelector('.momentum-slider-pagination');
        var paginationItems = [].slice.call(pagination.children);
        // Initializing the images slider

        var sliderImages = $settings.sliderImages;
        var msImages = new MomentumSlider({
            // Element to append the slider
            el: slidersContainer,
            // CSS class to reference the slider
            cssClass: 'ms--images',
            // Generate the 4 slides required
            range: [0, range - 1],
            rangeContent: function (i) {
                return '<div class="ms-slide__image-container"><div class="ms-slide__image" style="background-image: url(' + sliderImages[i] + ')"></div></div>';
//                return '<div class="ms-slide__image-container"><div class="ms-slide__image"><img src="' + sliderImages[i] + '"></div></div>';
            },
            // Syncronize the other sliders
            sync: [msNumbers, msTitles, msLinks],
            // Styles to interpolate as we move the slider
            style: {
                '.ms-slide__image': {
                    transform: [{scale: [1.5, 1]}]
                }
            },
            // Update pagination if slider change
            change: function (newIndex, oldIndex) {
                if (typeof oldIndex !== 'undefined') {
                    paginationItems[oldIndex].classList.remove('pagination__item--active');
                }
                paginationItems[newIndex].classList.add('pagination__item--active');
            }
        });
        // Select corresponding slider item when a pagination button is clicked
        pagination.addEventListener('click', function (e) {
            if (e.target.matches('.pagination__button')) {
                var index = paginationItems.indexOf(e.target.parentNode);
                msImages.select(index);
            }
        });
    };

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-momentum-slider.default', widgetMomentumSlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-naive-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetNumber = function ($scope, $) {
    var $number = $scope.find('.sa-number'),
        $settings = $number.data('settings');

    if (!$number.length) {
        return;
    }

    if ($settings.animation == 'no') {
        return;
    }

    skyAddonsObserver($scope[0], function () {
        $($number).find('.sa-text').prop('Counter', 0).animate({
            Counter: $settings.number
        }, {
            duration: $settings.time,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });

    }, {
        root: null, // Use the viewport as the root
        rootMargin: '0px', // No margin around the root
        threshold: 0.8 // 80% visibility (1 - 0.8)
    });
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-number.default', widgetNumber);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetPanelSlider = function ($scope, $) {
    var $panelSlider = $scope.find('.sa-panel-slider'),
        $panelSliderContainer = $panelSlider.find('.swiper'),
        $settings = $panelSlider.data('settings');

    if (!$panelSlider.length) {
        return;
    }
    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {

        var sliderThumbs = await new Swiper($panelSliderContainer, $settings);

        if ($settings.pauseOnHover) {
            $($panelSlider).hover(function () {
                sliderThumbs.autoplay.stop();
            }, function () {
                sliderThumbs.autoplay.start();
            });
        }

        var $sliderSettings = $panelSlider.data('slider-settings');

        if ('hover' == $sliderSettings.showContent) {
            $panelSlider.find('.swiper-slide').on('mouseover', function () {
                $(this).siblings().removeClass('sa-active');
                $(this).addClass('sa-active');
            })
            $panelSlider.find('.swiper-slide').on('mouseleave', function () {
                $(this).siblings().removeClass('sa-active');
                $(this).removeClass('sa-active');
            })
        }

        if ('active_hover' == $sliderSettings.showContent) {
            $panelSlider.find('.swiper-slide').on('mouseover', function () {
                $(this).addClass('sa-active');
            })
            $panelSlider.find('.swiper-slide').on('mouseleave', function () {
                if ($(this).hasClass('swiper-slide-active') !== true) {
                    $(this).removeClass('sa-active');
                }
            })
        }

        if ('active' == $sliderSettings.showContent || 'active_hover' == $sliderSettings.showContent) {
            $panelSlider.find('.swiper-slide.swiper-slide-active').siblings().removeClass('sa-active');
            $panelSlider.find('.swiper-slide.swiper-slide-active').addClass('sa-active');

            sliderThumbs.on('slideChangeTransitionEnd', function (e) {
                $panelSlider.find('.swiper-slide.swiper-slide-active').siblings().removeClass('sa-active');
                $panelSlider.find('.swiper-slide.swiper-slide-active').addClass('sa-active');
            });
        }

        if ('always' == $sliderSettings.showContent) {
            $panelSlider.find('.swiper-slide').addClass('sa-active');
        }

    };

};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-panel-slider.default', widgetPanelSlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetPdfViewer = function ($scope, $) {
    var $pdfViewer = $scope.find('.sa-pdf-viewer'),
        $settings = $pdfViewer.data('settings'),
        $options = $pdfViewer.data('pdf-settings');

    if (!$pdfViewer.length) {
        return;
    }

    PDFObject.embed($settings.pdfUrl, $settings.id, $options);
};
    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-pdf-viewer.default', widgetPdfViewer);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetPortionEffect = function ($scope, $) {
    var $portionEffect = $scope.find('.sa-portion-effect');
    if (!$portionEffect.length) {
        return;
    }

    var $settings = $portionEffect.data('settings');

    $portionEffect.find('.sa-side').css('background-image', 'url(' + $settings.image + ')');

    var animated = false;

    var animate = function () {
        if (animated) { return; }
        animated = true;
        $portionEffect.addClass('sa-animated');
    };

    // Snap all panels to hidden state instantly — used for clean repeat reset
    var snapToHidden = function () {
        $portionEffect.addClass('sa-pe-no-trans');
        $portionEffect.removeClass('sa-animated');
        animated = false;
        requestAnimationFrame(function () {
            $portionEffect.removeClass('sa-pe-no-trans');
        });
    };

    if ($settings.entrance_animation === 'yes' && !elementorFrontend.isEditMode()) {
        var stagger    = ($settings.stagger !== undefined)    ? parseInt($settings.stagger, 10)    : 150;
        var repeat     = $settings.animation_repeat === 'yes';
        var threshold  = ($settings.threshold !== undefined)  ? parseInt($settings.threshold, 10) / 100 : 0.4;

        // Set per-block stagger delay as CSS var — inherited by .sa-side via transition-delay
        $portionEffect.find('.sa-block').each(function (i) {
            this.style.setProperty('--sky-pe-anim-delay', (i * stagger) + 'ms');
        });

        // Snap to hidden instantly (sa-pe-no-trans prevents transition flash)
        $portionEffect.addClass('sa-pe-ready sa-pe-no-trans');
        requestAnimationFrame(function () {
            $portionEffect.removeClass('sa-pe-no-trans');

            // 400ms delay: above-fold widgets animate visibly on page load
            setTimeout(function () {
                if ('IntersectionObserver' in window) {
                    // Two thresholds: 0 = fully gone (reset), threshold = enough visible (animate)
                    var thresholds = threshold > 0 ? [ 0, threshold ] : [ 0 ];

                    var observer = new IntersectionObserver(function (entries) {
                        entries.forEach(function (entry) {
                            if (entry.intersectionRatio >= threshold) {
                                // Enough of element visible → animate in
                                requestAnimationFrame(function () {
                                    requestAnimationFrame(animate);
                                });
                                if (!repeat) {
                                    observer.unobserve(entry.target);
                                }
                            } else if (repeat && !entry.isIntersecting) {
                                // Fully out of viewport → safe to snap to hidden, no white flash
                                snapToHidden();
                            }
                        });
                    }, { threshold: thresholds });

                    observer.observe($portionEffect[0]);
                } else {
                    animate();
                }
            }, 400);
        });

    } else {
        animate();
    }
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-portion-effect.default', widgetPortionEffect);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

    var SaReadingProgress = {

        initDefault: function ($scope) {
            var $el    = $scope.find('.sa-reading-progress.sa-skin-default');
            var $inner = $el.find('.sa-rp-inner');
            if (!$el.length) return;

            $(window).off('scroll.sa-rp-default');

            function getMax() {
                return Math.max(1, $(document).height() - $(window).height());
            }

            function update() {
                var pct = Math.min(100, ($(window).scrollTop() / getMax()) * 100);
                $inner.css('width', pct + '%');
            }

            update();
            $(window).on('scroll.sa-rp-default', function () {
                window.requestAnimationFrame(update);
            });
        },

        initFancyHorizontal: function ($scope) {
            var $el   = $scope.find('.sa-reading-progress.sa-skin-fancy-horizontal');
            var $span = $el.find('span');
            if (!$el.length) return;

            $(window).off('scroll.sa-rp-fh');

            function getMax() {
                return Math.max(1, $(document).height() - $(window).height());
            }

            function update() {
                var pct = Math.min(100, ($(window).scrollTop() / getMax()) * 100);
                $el.css('width', pct + '%');
                if ($span.length) $span.text(Math.round(pct));
            }

            update();
            $(window).on('scroll.sa-rp-fh', function () {
                window.requestAnimationFrame(update);
            });
        },

        initFancyVertical: function ($scope) {
            var $el   = $scope.find('.sa-reading-progress.sa-skin-fancy-vertical');
            var $span = $el.find('span');
            if (!$el.length) return;

            $(window).off('scroll.sa-rp-fv');

            function getMax() {
                return Math.max(1, $(document).height() - $(window).height());
            }

            function update() {
                var pct = Math.min(100, ($(window).scrollTop() / getMax()) * 100);
                $el.css('height', pct + '%');
                if ($span.length) $span.text(Math.round(pct));
            }

            update();
            $(window).on('scroll.sa-rp-fv', function () {
                window.requestAnimationFrame(update);
            });
        },

        initScrollTop: function ($scope) {
            var $el = $scope.find('.sa-reading-progress.sa-skin-scroll-top');
            if (!$el.length) return;

            var path = $el.find('path')[0];
            if (!path) return;

            var pathLen   = path.getTotalLength();
            var threshold = parseInt($el.data('scroll-threshold'), 10) || 50;
            var duration  = parseInt($el.data('scroll-duration'),  10) || 550;

            path.style.transition       = 'none';
            path.style.strokeDasharray  = pathLen + ' ' + pathLen;
            path.style.strokeDashoffset = pathLen;
            path.getBoundingClientRect();
            path.style.transition = 'stroke-dashoffset 10ms linear';

            $(window).off('scroll.sa-rp-st');

            function getMax() {
                return Math.max(1, $(document).height() - $(window).height());
            }

            function update() {
                var st      = $(window).scrollTop();
                var offset  = pathLen - (st * pathLen / getMax());
                path.style.strokeDashoffset = Math.max(0, offset);
                $el.toggleClass('sa-active-progress', st > threshold);
            }

            update();
            $(window).on('scroll.sa-rp-st', function () {
                window.requestAnimationFrame(update);
            });

            $el.off('click.sa-rp-st').on('click.sa-rp-st', function (e) {
                e.preventDefault();
                $('html, body').animate({ scrollTop: 0 }, duration);
            });
        },

        initWithCursor: function ($scope) {
            var $dot = $scope.find('.sa-reading-progress.sa-skin-with-cursor');
            if (!$dot.length) return;

            // Clean up previous instance
            $('body').find('.sa-rp-cursor-outer, .sa-rp-cursor-inner').remove();
            $(window).off('scroll.sa-rp-wc');
            $(document).off('mousemove.sa-rp-wc');

            // Read CSS vars from dot (inherits from {{WRAPPER}})
            var dotEl  = $dot[0];
            var cs     = window.getComputedStyle(dotEl);
            var lag    = parseFloat(cs.getPropertyValue('--sky-rp-cursor-lag').trim())    || 150;
            var blend  = cs.getPropertyValue('--sky-rp-cursor-blend-mode').trim()         || 'normal';
            var dotSize = cs.getPropertyValue('--sky-rp-cursor-dot-size').trim()          || '8px';
            var primary  = cs.getPropertyValue('--sky-r-p-primary-color').trim()          || 'blueviolet';
            var secondary = cs.getPropertyValue('--sky-r-p-secondary-color').trim()       || 'rgba(0,0,0,0.15)';
            var ringColor = cs.getPropertyValue('--sky-rp-cursor-ring-color').trim()      || secondary;

            // Build DOM
            var $outer = $('<div class="sa-progress-with-cursor-2 sa-rp-cursor-outer"></div>').appendTo('body');
            var $inner = $('<div class="sa-progress-with-cursor-3 sa-rp-cursor-inner"></div>').appendTo('body');
            var $wrap  = $([
                '<div class="sa-progress-wrap">',
                    '<svg class="sa-progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">',
                        '<path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"/>',
                    '</svg>',
                '</div>'
            ].join('')).appendTo($outer);

            var outEl = $outer[0];
            var innEl = $inner[0];

            var ringThickness = cs.getPropertyValue('--sky-rp-cursor-ring-thickness').trim() || '2px';
            var outerSize     = cs.getPropertyValue('--sky-reading-progress-size').trim()    || '0px';

            // Propagate CSS vars to body elements (they can't inherit from {{WRAPPER}})
            function setVar(el, name, val) { el.style.setProperty(name, val); }
            [outEl, innEl].forEach(function (el) {
                setVar(el, '--sky-rp-cursor-dot-size',         dotSize);
                setVar(el, '--sky-rp-cursor-blend-mode',       blend);
                setVar(el, '--sky-r-p-primary-color',          primary);
                setVar(el, '--sky-r-p-secondary-color',        ringColor);
                setVar(el, '--sky-rp-cursor-ring-color',       ringColor);
                setVar(el, '--sky-rp-cursor-ring-thickness',   ringThickness);
                setVar(el, '--sky-reading-progress-size',      outerSize);
            });

            // Staggered lag: outer = full lag, inner = half lag (creates depth effect)
            var lagHalf = Math.round(lag * 0.5);
            outEl.style.transition = [
                'left ' + lag     + 'ms ease-out',
                'top '  + lag     + 'ms ease-out',
                'transform 400ms ease',
                'opacity 400ms ease'
            ].join(', ');
            innEl.style.transition = [
                'left ' + lagHalf + 'ms ease-out',
                'top '  + lagHalf + 'ms ease-out',
                'transform 300ms ease',
                'opacity 300ms ease'
            ].join(', ');

            // Blend mode on dot
            dotEl.style.mixBlendMode = blend;

            // SVG progress ring setup
            var path = $wrap.find('path')[0];
            if (path) {
                var pathLen = path.getTotalLength();
                path.style.transition       = 'none';
                path.style.strokeDasharray  = pathLen + ' ' + pathLen;
                path.style.strokeDashoffset = pathLen;
                path.style.stroke           = primary;
                path.getBoundingClientRect();
                path.style.transition = 'stroke-dashoffset 10ms linear';

                $(window).on('scroll.sa-rp-wc', function () {
                    window.requestAnimationFrame(function () {
                        var st  = $(window).scrollTop();
                        var max = Math.max(1, $(document).height() - $(window).height());
                        path.style.strokeDashoffset = Math.max(0, pathLen - (st * pathLen / max));
                    });
                });
            }

            // Fade in all layers on first mousemove
            var activated = false;
            var rafId     = null;

            $(document).on('mousemove.sa-rp-wc', function (e) {
                var x = e.clientX, y = e.clientY;

                if (!activated) {
                    activated = true;
                    $dot.add($outer).add($inner).addClass('sa-rp-cursor-shown');
                }

                if (rafId) cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(function () {
                    dotEl.style.left = x + 'px';
                    dotEl.style.top  = y + 'px';
                    outEl.style.left = x + 'px';
                    outEl.style.top  = y + 'px';
                    innEl.style.left = x + 'px';
                    innEl.style.top  = y + 'px';
                });
            });

            // Hover effects on .hover-target elements
            $(document).find('.hover-target')
                .off('mouseenter.sa-rp-wc mouseleave.sa-rp-wc')
                .on('mouseenter.sa-rp-wc', function () {
                    $dot.addClass('sa-rp-cursor-hover');
                    $outer.add($inner).addClass('hover');
                })
                .on('mouseleave.sa-rp-wc', function () {
                    $dot.removeClass('sa-rp-cursor-hover');
                    $outer.add($inner).removeClass('hover');
                });
        },

        register: function () {
            var self = this;
            jQuery(window).on('elementor/frontend/init', function () {
                var hooks = elementorFrontend.hooks;
                hooks.addAction('frontend/element_ready/sky-reading-progress.default',                  function ($s) { self.initDefault($s); });
                hooks.addAction('frontend/element_ready/sky-reading-progress.sky-skin-fancy-horizontal', function ($s) { self.initFancyHorizontal($s); });
                hooks.addAction('frontend/element_ready/sky-reading-progress.sky-skin-fancy-vertical',   function ($s) { self.initFancyVertical($s); });
                hooks.addAction('frontend/element_ready/sky-reading-progress.sky-skin-scroll-top',       function ($s) { self.initScrollTop($s); });
                hooks.addAction('frontend/element_ready/sky-reading-progress.sky-skin-with-cursor',      function ($s) { self.initWithCursor($s); });
            });
        }
    };

    SaReadingProgress.register();

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-review-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-sapling-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetSlinkyMenu = function ($scope, $) {
    var $slinkyMenu = $scope.find('.sa-slinky-menu');
    var $settings = $slinkyMenu.data('settings');

    if (!$slinkyMenu.length) {
        return;
    }

    $slinkyMenu.removeClass('sa-d-none');

    var options = {
        resize: $settings.resize !== false,
        speed:  $settings.speed || 300,
        title:  $settings.title === true
    };

    $($settings.id).slinky(options);

};
    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-slinky-menu.default', widgetSlinkyMenu);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

var widgetStellarSlider = function ($scope, $) {

    var $stellarSlider = $scope.find('.sa-stellar-slider'),
        $container     = $stellarSlider.find('.swiper'),
        $settings      = $stellarSlider.data('settings');

    if (!$stellarSlider.length) {
        return;
    }

    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {

        var slider = await new Swiper($container, $settings);

        if ($settings.pauseOnHover) {
            $stellarSlider.hover(function () {
                slider.autoplay.stop();
            }, function () {
                slider.autoplay.start();
            });
        }
    };
};

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-stellar-slider.default', widgetStellarSlider);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
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

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-team-member-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-testimonial-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-ultra-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

(function ($, elementor) {
    'use strict';

// This widget uses the global carousel handler

    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-wc-category-carousel.default', widgetGlobalCarousel);
    });

}(jQuery, window.elementorFrontend));

;
(function ($) {
    var $window = $(window),
        toGranimColor = function (color) {
            if (!color) return null;
            // Granim alpha regex (.?\d{1,3}) can't match "0.5" — strip the leading zero
            var c = color.replace(/(rgba\([\d\s,]+,\s*)0(\.\d+\))$/, '$1$2');
            // Reject CSS vars, HSL, and anything Granim won't accept
            return /^#[0-9a-fA-F]{3,6}$|^rgba?\([\d.,\s]+\)$/.test(c) ? c : null;
        },
        debounce = function (func, wait, immediate) {
            // 'private' variable for instance
            // The returned function will be able to reference this due to closure.
            // Each call to the returned function will share this common timer.
            var timeout;

            // Calling debounce returns a new anonymous function
            return function () {
                // reference the context and args for the setTimeout function
                var context = this,
                    args = arguments;

                // Should the function be called now? If immediate is true
                //   and not already in a timeout then the answer is: Yes
                var callNow = immediate && !timeout;

                // This is the basic debounce behaviour where you can call this
                //   function several times, but it will only execute once
                //   [before or after imposing a delay].
                //   Each time the returned function is called, the timer starts over.
                clearTimeout(timeout);

                // Set the new timeout
                timeout = setTimeout(function () {

                    // Inside the timeout function, clear the timeout variable
                    // which will let the next execution run when in 'immediate' mode
                    timeout = null;

                    // Check if the function already ran with the immediate flag
                    if (!immediate) {
                        // Call the original function with apply
                        // apply lets you define the 'this' object as well as the arguments
                        //    (both captured before setTimeout)
                        func.apply(context, args);
                    }
                }, wait);

                // Immediate mode and no wait timer? Execute the function..
                if (callNow)
                    func.apply(context, args);
            };
        };
    $window.on('elementor/frontend/init', function () {
        var ModuleHandler = elementorModules.frontend.handlers.Base,
            AnimatedGradientBg;

        AnimatedGradientBg = ModuleHandler.extend({

            bindEvents: function () {
                this.run();
            },

            getDefaultSettings: function () {
                return {
                    direction: 'left-right',
                };
            },

            settings: function (key) {
                return this.getElementSettings('sa_agbg_' + key);
            },

            onElementChange: debounce(function (prop) {
                if (prop.indexOf('sa_agbg_') !== -1) {
                    if ($('#' + this.Granim).length) {
                        $('#' + this.Granim).remove();
                    }
                    this.run();
                }
            }, 400),

            run: function () {
                var options = this.getDefaultSettings(),
                    elementID = this.getID(),
                    elementContainer = $('.elementor-element-' + elementID),
                    element = 'sa-agbg-' + elementID;

                if (this.settings('enable') !== 'yes') {
                    return;
                }

                if ($(this.$element).hasClass('elementor-widget')) {
                    elementContainer = $('.elementor-element-' + elementID + ' > :first-child');
                    elementContainer.css({
                        'position': 'relative',
                        'overflow': 'hidden',
                    });
                }

                if ($(this.$element).hasClass('elementor-column')) {
                    elementContainer = $('.elementor-element-' + elementID).find('.elementor-column-wrap');
                    elementContainer.css({
                        // 'position' : 'relative',
                        'overflow': 'hidden',
                    });
                }

                var $color_list = this.settings('color_list');
                var gradients = [];

                $color_list.forEach(function (item) {
                    var start = toGranimColor(item.sa_agbg_start_color);
                    var end = toGranimColor(item.sa_agbg_end_color);
                    if (!start || !end) {
                        return;
                    }
                    var stops = [start];
                    var mid = toGranimColor(item.sa_agbg_mid_color);
                    if (mid) {
                        stops.push(mid);
                    }
                    stops.push(end);
                    gradients.push(stops);
                });

                if (!gradients.length) {
                    return;
                }

                // Granim requires all gradients to have the same stop count
                var firstLen = gradients[0].length;
                if (gradients.some(function (g) { return g.length !== firstLen; })) {
                    gradients = gradients.map(function (g) { return [g[0], g[g.length - 1]]; });
                }

                elementContainer.prepend('<canvas id="' + element + '" class="sa-animated-gradient-bg sa-d-block sa-w-100 sa-h-100"></canvas>');

                $('#' + element).css({
                    'position': 'absolute',
                    'top': 0,
                    'right': 0,
                    'bottom': 0,
                    'left': 0,
                    'pointer-events': 'none',
                });

                options.element = '#' + element;
                options.isPausedWhenNotInView = this.settings('pause_on_scroll') !== 'no';

                if (this.settings('direction')) {
                    options.direction = this.settings('direction');
                }

                var transitionSpeed = this.settings('transition_speed.size') || 7000;

                options.states = {
                    'default-state': {
                        'gradients': gradients,
                        'transitionSpeed': transitionSpeed,
                    }
                };

                var loopCount = parseInt(this.settings('loop_count')) || 0;
                var granimInstance;

                if (loopCount > 0) {
                    var transitionCount = 0;
                    var maxTransitions = loopCount * gradients.length;
                    options.onGradientChange = function () {
                        transitionCount++;
                        if (transitionCount >= maxTransitions && granimInstance) {
                            granimInstance.pause();
                        }
                    };
                }

                granimInstance = new Granim(options);
                this.Granim = element;
            }
        });


        elementorFrontend.hooks.addAction('frontend/element_ready/section', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(AnimatedGradientBg, {
                $element: $scope
            });
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/container', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(AnimatedGradientBg, {
                $element: $scope
            });
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/column', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(AnimatedGradientBg, {
                $element: $scope
            });
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(AnimatedGradientBg, {
                $element: $scope
            });
        });

    });

}(jQuery));

;
(function ($) {
    var $window = $(window),
        debounce = function (func, wait, immediate) {
            var timeout;
            return function () {
                var context = this,
                    args = arguments;
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    timeout = null;
                    if (!immediate) {
                        func.apply(context, args);
                    }
                }, wait);
                if (callNow)
                    func.apply(context, args);
            };
        };

    $window.on('elementor/frontend/init', function () {
        var ModuleHandler = elementorModules.frontend.handlers.Base,
            EqualHeight;

        EqualHeight = ModuleHandler.extend({

            _applied: [],

            settings: function (key) {
                return this.getElementSettings('sa_eqh_' + key);
            },

            isDisabledOnDevice: function () {
                var breakpoints = (elementorFrontend.config && elementorFrontend.config.breakpoints)
                                  || elementorFrontendConfig.breakpoints,
                    windowWidth = $window.outerWidth(),
                    tabletWidth = breakpoints.lg,
                    mobileWidth = breakpoints.md;

                if (this.settings('disable_on_mobile') === 'yes' && windowWidth < mobileWidth) {
                    return true;
                }
                if (this.settings('disable_on_tablet') === 'yes' && windowWidth >= mobileWidth && windowWidth < tabletWidth) {
                    return true;
                }
                return false;
            },

            cleanup: function () {
                this._applied.forEach(function ($el) {
                    $el.matchHeight({ remove: true });
                });
                this._applied = [];
            },

            getTargetGroups: function (elementContainer) {
                var applyElements = this.settings('apply_elements') || 'select_widgets',
                    selectorMap = {
                        'widgets':         '.elementor-widget',
                        'widgets_1st':     '.elementor-widget > :nth-child(1)',
                        'widgets_1st_2nd': '.elementor-widget > :nth-child(2)',
                        'widgets_1st_3rd': '.elementor-widget > :nth-child(3)',
                        'widgets_2nd':     '.elementor-widget > :nth-child(1) > :nth-child(1)',
                        'widgets_2nd_2nd': '.elementor-widget > :nth-child(1) > :nth-child(2)',
                        'widgets_3rd':     '.elementor-widget > :nth-child(1) > :nth-child(1) > :nth-child(1)',
                    };

                // Select Widgets mode: one independent matchHeight group per widget type
                if (applyElements === 'select_widgets') {
                    var widgetList = this.settings('widget_list') || [];
                    if (!widgetList.length) {
                        return [];
                    }
                    return widgetList
                        .map(function (widgetType) {
                            return elementContainer.find('.elementor-widget-' + widgetType);
                        })
                        .filter(function ($group) { return $group.length > 0; });
                }

                // Legacy selector-map modes: single combined group
                var selector = selectorMap[applyElements];
                if (!selector && applyElements === 'custom') {
                    selector = this.settings('apply_elements_custom') || null;
                }
                if (selector) {
                    var $group = elementContainer.find(selector);
                    return $group.length ? [$group] : [];
                }

                return [];
            },

            run: function () {
                this.cleanup();

                if (this.settings('enable') !== 'yes') {
                    return;
                }

                if (this.isDisabledOnDevice()) {
                    return;
                }

                var elementContainer = $('.elementor-element-' + this.getID()),
                    applyElements    = this.settings('apply_elements') || 'select_widgets',
                    groups           = this.getTargetGroups(elementContainer),
                    self             = this,
                    options          = {
                        byRow    : applyElements !== 'select_widgets',
                        property : this.settings('css_property') === 'min_height' ? 'min-height' : 'height'
                    };

                groups.forEach(function ($group) {
                    $group.matchHeight(options);
                    self._applied.push($group);
                });
            },

            onUnload: function () {
                this.cleanup();
            },

            onElementChange: debounce(function (prop) {
                if (prop.indexOf('sa_eqh_') !== -1) {
                    this.run();
                }
            }, 400),

            bindEvents: function () {
                this.run();
                $window.on('resize orientationchange', debounce(this.run.bind(this), 100));
            }
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/section', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(EqualHeight, { $element: $scope });
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/container', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(EqualHeight, { $element: $scope });
        });

    });

}(jQuery));

;
(function ($) {
    var $window = $(window),
        debounce = function (func, wait, immediate) {
            // 'private' variable for instance
            // The returned function will be able to reference this due to closure.
            // Each call to the returned function will share this common timer.
            var timeout;

            // Calling debounce returns a new anonymous function
            return function () {
                // reference the context and args for the setTimeout function
                var context = this,
                    args = arguments;

                // Should the function be called now? If immediate is true
                //   and not already in a timeout then the answer is: Yes
                var callNow = immediate && !timeout;

                // This is the basic debounce behaviour where you can call this
                //   function several times, but it will only execute once
                //   [before or after imposing a delay].
                //   Each time the returned function is called, the timer starts over.
                clearTimeout(timeout);

                // Set the new timeout
                timeout = setTimeout(function () {

                    // Inside the timeout function, clear the timeout variable
                    // which will let the next execution run when in 'immediate' mode
                    timeout = null;

                    // Check if the function already ran with the immediate flag
                    if (!immediate) {
                        // Call the original function with apply
                        // apply lets you define the 'this' object as well as the arguments
                        //    (both captured before setTimeout)
                        func.apply(context, args);
                    }
                }, wait);

                // Immediate mode and no wait timer? Execute the function..
                if (callNow)
                    func.apply(context, args);
            };
        };
    $window.on('elementor/frontend/init', function () {
        var ModuleHandler = elementorModules.frontend.handlers.Base,
            FloatingEffects;

        FloatingEffects = ModuleHandler.extend({

            bindEvents: function () {
                this.run();
            },

            getDefaultSettings: function () {
                return {
                    direction: 'alternate',
                    easing: 'easeInOutSine',
                    loop: true
                };
            },

            settings: function (key) {
                return this.getElementSettings('sa_floating_ef_' + key);
            },

            onElementChange: debounce(function (prop) {
                if (prop.indexOf('sa_floating') !== -1) {
                    this.anime && this.anime.restart();
                    this.run();
                }
            }, 400),

            run: function () {
                var options = this.getDefaultSettings(),
                    element = this.$element.get(0);

                options.targets = element;

                if (this.settings('enable') !== 'yes') {
                    return;
                }

                //                if (this.settings('translate_x.sizes.from').length !== 0 || this.settings('translate_x.sizes.to').length !== 0) {}

                if (this.settings('translate_toggle')) {
                    if (this.settings('translate_x.sizes.from').length !== 0 || this.settings('translate_x.sizes.to').length !== 0) {
                        options.translateX = {
                            value: [this.settings('translate_x.sizes.from') || 0, this.settings('translate_x.size') || this.settings('translate_x.sizes.to')],
                            duration: this.settings('translate_duration.size'),
                            delay: this.settings('translate_delay.size') || 0
                        };
                    }
                    if (this.settings('translate_y.sizes.from').length !== 0 || this.settings('translate_y.sizes.to').length !== 0) {
                        options.translateY = {
                            value: [this.settings('translate_y.sizes.from') || 0, this.settings('translate_y.size') || this.settings('translate_y.sizes.to')],
                            duration: this.settings('translate_duration.size'),
                            delay: this.settings('translate_delay.size') || 0
                        };
                    }
                }

                if (this.settings('rotate_toggle')) {
                    if (this.settings('rotate_x.sizes.from').length !== 0 || this.settings('rotate_x.sizes.to').length !== 0) {
                        options.rotateX = {
                            value: [this.settings('rotate_x.sizes.from') || 0, this.settings('rotate_x.size') || this.settings('rotate_x.sizes.to')],
                            duration: this.settings('rotate_duration.size'),
                            delay: this.settings('rotate_delay.size') || 0
                        };
                    }
                    if (this.settings('rotate_y.sizes.from').length !== 0 || this.settings('rotate_y.sizes.to').length !== 0) {
                        options.rotateY = {
                            value: [this.settings('rotate_y.sizes.from') || 0, this.settings('rotate_y.size') || this.settings('rotate_y.sizes.to')],
                            duration: this.settings('rotate_duration.size'),
                            delay: this.settings('rotate_delay.size') || 0
                        };
                    }
                    if (this.settings('rotate_z.sizes.from').length !== 0 || this.settings('rotate_z.sizes.to').length !== 0) {
                        options.rotateZ = {
                            value: [this.settings('rotate_z.sizes.from') || 0, this.settings('rotate_z.size') || this.settings('rotate_z.sizes.to')],
                            duration: this.settings('rotate_duration.size'),
                            delay: this.settings('rotate_delay.size') || 0
                        };
                    }
                }

                if (this.settings('scale_toggle')) {
                    if (this.settings('scale_x.sizes.from').length !== 0 || this.settings('scale_x.sizes.to').length !== 0) {
                        options.scaleX = {
                            value: [this.settings('scale_x.sizes.from') || 0, this.settings('scale_x.size') || this.settings('scale_x.sizes.to')],
                            duration: this.settings('scale_duration.size'),
                            delay: this.settings('scale_delay.size') || 0
                        };
                    }
                    if (this.settings('scale_y.sizes.from').length !== 0 || this.settings('scale_y.sizes.to').length !== 0) {
                        options.scaleY = {
                            value: [this.settings('scale_y.sizes.from') || 0, this.settings('scale_y.size') || this.settings('scale_y.sizes.to')],
                            duration: this.settings('scale_duration.size'),
                            delay: this.settings('scale_delay.size') || 0
                        };
                    }
                }

                if (this.settings('skew_toggle')) {
                    if (this.settings('skew_x.sizes.from').length !== 0 || this.settings('skew_x.sizes.to').length !== 0) {
                        options.skewX = {
                            value: [this.settings('skew_x.sizes.from') || 0, this.settings('skew_x.size') || this.settings('skew_x.sizes.to')],
                            duration: this.settings('skew_duration.size'),
                            delay: this.settings('skew_delay.size') || 0
                        };
                    }
                    if (this.settings('skew_y.sizes.from').length !== 0 || this.settings('skew_y.sizes.to').length !== 0) {
                        options.skewY = {
                            value: [this.settings('skew_y.sizes.from') || 0, this.settings('skew_y.size') || this.settings('skew_y.sizes.to')],
                            duration: this.settings('skew_duration.size'),
                            delay: this.settings('skew_delay.size') || 0
                        };
                    }
                }

                if (this.settings('easing')) {
                    options.easing = this.settings('easing');
                }

                if (
                    this.settings('translate_toggle') ||
                    this.settings('rotate_toggle') ||
                    this.settings('scale_toggle') ||
                    this.settings('skew_toggle')
                ) {
                    this.anime = window.anime && window.anime(options);
                }

            }
        });


        elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(FloatingEffects, {
                $element: $scope
            });
        });
    });

}(jQuery));

;
(function ($) {
    var $window = $(window);

    var debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(function () {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            }, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    };

    $window.on('elementor/frontend/init', function () {
        var ModuleHandler = elementorModules.frontend.handlers.Base,
            RevealEffects;

        RevealEffects = ModuleHandler.extend({

            bindEvents: function () {
                this._cleanup();
                this.run();
            },

            getDefaultSettings: function () {
                return {
                    direction: 'lr',
                    easing: 'easeInOutQuint',
                    duration: 600,
                    delay: 100,
                    bgColors: ['#111'],
                    coverArea: 0
                };
            },

            settings: function (key) {
                return this.getElementSettings('sa_reveal_fx_' + key);
            },

            onElementChange: debounce(function (prop) {
                if (prop.indexOf('sa_reveal_fx') !== -1) {
                    this._cleanup();
                    this.run();
                }
            }, 400),

            _cleanup: function () {
                var instances = this._revealInstances;
                if (!instances || !instances.length) {
                    return;
                }
                instances.forEach(function (inst) {
                    var el = inst.el;
                    if (el && inst.content && el.parentNode) {
                        el.innerHTML = inst.content.innerHTML;
                        el.classList.remove('block-revealer');
                    }
                });
                this._revealInstances = [];
            },

            run: function () {
                var self = this,
                    options = this.getDefaultSettings(),
                    elementID = this.getID(),
                    element = this.$element.get(0);

                if (this.settings('enable') !== 'yes') {
                    return;
                }

                if (this.$element.hasClass('elementor-widget')) {
                    element = $('.elementor-element-' + elementID).get(0);
                }

                if (!element) {
                    return;
                }

                if (this.settings('direction')) {
                    options.direction = this.settings('direction');
                }

                var bgColors = this.settings('bg_colors');
                if (bgColors) {
                    var parsed = bgColors.split(/[ ,]+/).filter(Boolean);
                    if (parsed.length) {
                        options.bgColors = parsed;
                    }
                }

                options.duration = parseInt(this.settings('duration.size'), 10) || options.duration;
                options.delay    = parseInt(this.settings('delay.size'), 10)    || options.delay;

                if (this.settings('easing')) {
                    options.easing = this.settings('easing');
                }

                options.onHalfway = function (contentEl) {
                    contentEl.style.opacity = 1;
                };

                // backward-compat: layers was NUMBER (plain int), now SLIDER ({size, unit})
                var layers = parseInt(this.settings('layers.size'), 10) || parseInt(this.settings('layers'), 10) || 1;

                var coverAreaRaw = parseInt(this.settings('cover_area'), 10);
                if (!isNaN(coverAreaRaw)) {
                    options.coverArea = coverAreaRaw;
                }

                var contentHidden = this.settings('content_show') !== 'yes';
                var isLoop        = this.settings('loop') === 'yes';
                var thresholdRaw  = parseInt(this.settings('threshold.size'), 10);
                var threshold     = (thresholdRaw > 0 && thresholdRaw <= 100) ? thresholdRaw / 100 : 0.8;

                var targets = $(element);
                if (this.settings('select_type') === 'custom') {
                    var selector = this.settings('selector');
                    if (selector && selector.length) {
                        targets = $(element).find(selector);
                    }
                }

                if (!targets.length) {
                    return;
                }

                self._revealInstances = [];

                targets.each(function () {
                    var el = this;
                    var revealerEffect = new RevealFx(el, {
                        layers: layers,
                        isContentHidden: contentHidden,
                        revealSettings: options
                    });
                    self._revealInstances.push(revealerEffect);

                    skyAddonsObserver(el, function () {
                        revealerEffect.reveal();
                    }, {
                        rootMargin: '0px',
                        threshold: threshold,
                        loop: isLoop
                    });
                });
            }
        });

        elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(RevealEffects, { $element: $scope });
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/section', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(RevealEffects, { $element: $scope });
        });
        elementorFrontend.hooks.addAction('frontend/element_ready/container', function ($scope) {
            elementorFrontend.elementsHandler.addHandler(RevealEffects, { $element: $scope });
        });
    });

}(jQuery));

(function ($) {
  var $window = $(window),
    debounce = function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        }, wait);
        if (callNow) func.apply(context, args);
      };
    };
  $window.on('elementor/frontend/init', function () {
    var ModuleHandler = elementorModules.frontend.handlers.Base,
      RipplesEffect;

    RipplesEffect = ModuleHandler.extend({

      bindEvents: function () {
        this.run();
        $window.on('resize.ripples-' + this.getID(), debounce(function () {
          if (this.RippleEl) {
            $(this.RippleEl).ripples('updateSize');
          }
        }.bind(this), 200));
      },

      unbindEvents: function () {
        $window.off('resize.ripples-' + this.getID());
        if (this.RippleEl) {
          $(this.RippleEl).ripples('destroy');
          this.RippleEl = null;
        }
      },

      getDefaultSettings: function () {
        return {
          interactive: true,
        };
      },

      settings: function (key) {
        return this.getElementSettings('sa_rf_' + key);
      },

      onElementChange: debounce(function (prop) {
        if (prop.indexOf('sa_rf_') === -1) {
          return;
        }

        var el = $(this.RippleEl);

        if (prop === 'sa_rf_enable') {
          if (this.settings('enable') !== 'yes') {
            if (this.RippleEl) {
              el.ripples('destroy');
              this.RippleEl = null;
            }
          } else {
            this.run();
          }
          return;
        }

        if (!this.RippleEl) {
          return;
        }

        if (prop === 'sa_rf_drop_radius') {
          el.ripples('set', 'dropRadius', this.settings('drop_radius.size') || 20);
        } else if (prop === 'sa_rf_perturbance') {
          el.ripples('set', 'perturbance', this.settings('perturbance.size') || 0.03);
        } else {
          el.ripples('destroy');
          this.run();
        }
      }, 300),

      run: function () {
        var options = this.getDefaultSettings(),
          elementID = this.getID(),
          elementContainer = $('.elementor-element-' + elementID),
          element = $('.elementor-element-' + elementID);

        if (this.settings('enable') !== 'yes') {
          return;
        }

        if ($(this.$element).hasClass('elementor-widget')) {
          elementContainer.css({ 'position': 'relative' });
        }

        if ($(this.$element).hasClass('elementor-column')) {
          elementContainer = $('.elementor-element-' + elementID).find('.elementor-column-wrap');
          element = elementContainer;
          elementContainer.css({ 'position': 'relative' });
        }

        if (this.settings('drop_radius.size')) {
          options.dropRadius = this.settings('drop_radius.size') || 20;
        }
        if (this.settings('perturbance.size')) {
          options.perturbance = this.settings('perturbance.size') || 0.03;
        }
        if (this.settings('resolution')) {
          options.resolution = this.settings('resolution') || 256;
        }

        options.interactive = true;
        options.id = elementID;
        options.crossOrigin = 'anonymous';

        this.RippleEl = element;
        $(element).ripples(options);
      }
    });


    elementorFrontend.hooks.addAction('frontend/element_ready/section', function ($scope) {
      elementorFrontend.elementsHandler.addHandler(RipplesEffect, {
        $element: $scope
      });
    });

    elementorFrontend.hooks.addAction('frontend/element_ready/container', function ($scope) {
      elementorFrontend.elementsHandler.addHandler(RipplesEffect, {
        $element: $scope
      });
    });

    elementorFrontend.hooks.addAction('frontend/element_ready/column', function ($scope) {
      elementorFrontend.elementsHandler.addHandler(RipplesEffect, {
        $element: $scope
      });
    });

    elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
      elementorFrontend.elementsHandler.addHandler(RipplesEffect, {
        $element: $scope
      });
    });

  });

}(jQuery));

;
(function ($) {
  var $window = $(window),
    debounce = function (func, wait, immediate) {
      var timeout;
      return function () {
        var context = this,
          args = arguments;
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
          timeout = null;
          if (!immediate) {
            func.apply(context, args);
          }
        }, wait);
        if (callNow) func.apply(context, args);
      };
    };

  $window.on('elementor/frontend/init', function () {
    var ModuleHandler = elementorModules.frontend.handlers.Base,
      SimpleParallaxHandler;

    SimpleParallaxHandler = ModuleHandler.extend({

      onInit: function () {
        this._spInstances = [];
        ModuleHandler.prototype.onInit.apply(this, arguments);
      },

      bindEvents: function () {
        this.run();
      },

      getDefaultSettings: function () {
        return {
          scale: 1.4,
          orientation: 'up',
          delay: 0,
        };
      },

      settings: function (key) {
        return this.getElementSettings('sa_sp_' + key);
      },

      destroyParallax: function () {
        this._spInstances.forEach(function (instance) {
          instance.destroy();
        });
        this._spInstances = [];
      },

      onElementChange: debounce(function (prop) {
        if (prop.indexOf('sa_sp') !== -1) {
          this.destroyParallax();
          this.run();
        }
      }, 400),

      run: function () {
        var self = this;

        if (this.settings('enable') !== 'yes') {
          return;
        }

        var options = this.getDefaultSettings();

        var scale = this.settings('scale');
        if (scale && scale.size) {
          options.scale = scale.size;
        }
        if (this.settings('orientation')) {
          options.orientation = this.settings('orientation');
        }
        var delay = this.settings('delay');
        if (delay && delay.size) {
          options.delay = delay.size;
        }
        var transition = this.settings('transition');
        if (transition === 'custom') {
          if (this.settings('transition_custom')) {
            options.transition = this.settings('transition_custom');
          }
        } else if (transition) {
          options.transition = transition;
        }
        var maxTransition = this.settings('max_transition');
        if (maxTransition && maxTransition.size) {
          options.maxTransition = maxTransition.size;
        }
        if (this.settings('overflow')) {
          options.overflow = this.settings('overflow') === 'yes';
        }
        if (this.settings('custom_container')) {
          options.customContainer = this.settings('custom_container');
        }

        var container = this.$element;
        if (!container.length) {
          return;
        }

        var mediaType = this.settings('media_type');
        var mediaElements = container.find(mediaType === 'video' ? 'video' : 'img');

        if (mediaElements.length) {
          mediaElements.each(function () {
            var instance = new SimpleParallax($(this).get(0), options);
            self._spInstances.push(instance);
          });
        }
      }
    });

    elementorFrontend.hooks.addAction('frontend/element_ready/widget', function ($scope) {
      elementorFrontend.elementsHandler.addHandler(SimpleParallaxHandler, {
        $element: $scope
      });
    });
  });

}(jQuery));

jQuery('body').on('click', '.sa-element-link', function () {
    var timeout,
        $element = jQuery(this),
        data = $element.data('sa-element-link'),
        id = 'sa-element-link-' + $element.data('id'),
        idSelector = '#' + id;

    if (jQuery(idSelector).length === 0) {
        var options = {
            href: data.url,
            target: data.is_external ? '_blank' : '_self',
            class: 'sa-d-none',
            id: id,
            rel: data.nofollow ? 'nofollow noreferrer' : ''
        };

        jQuery('body').append(
            jQuery(document.createElement('a')).prop(options)
        );

        jQuery(idSelector)[0].click();

        timeout = setTimeout(function () {
            jQuery('body').find(idSelector).remove();
            clearTimeout(timeout);
        }, 1000);

    }

});