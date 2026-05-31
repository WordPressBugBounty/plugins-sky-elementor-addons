; (function ($, elementor) {
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
            speed: $settings.speed || 300,
            title: $settings.title === true
        };

        $($settings.id).slinky(options);

    };
    jQuery(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/' + 'sky-slinky-menu.default', widgetSlinkyMenu);
    });

}(jQuery, window.elementorFrontend));
