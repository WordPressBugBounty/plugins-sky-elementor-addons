;(function ($, elementor) {
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
