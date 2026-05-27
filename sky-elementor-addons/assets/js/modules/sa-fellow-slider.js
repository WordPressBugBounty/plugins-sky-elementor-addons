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
