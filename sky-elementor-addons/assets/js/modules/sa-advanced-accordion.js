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
