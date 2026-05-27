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
