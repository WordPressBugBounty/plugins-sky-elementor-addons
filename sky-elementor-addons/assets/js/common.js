function skyAddonsObserver(target, callback) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    // Set the rootMargin to trigger when the target is 10% past the viewport
    options.rootMargin = options.rootMargin || '10% 0px 0px 0px';
    var observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                callback(entry);

                if (!options.loop)
                    observer.unobserve(entry.target); // Unobserve after the first intersection
            }
        });
    }, options);
    observer.observe(target);
}

var widgetGlobalCarousel = function ($scope, $) {

    var $carousel = $scope.find('.sa-swiper-global-carousel'),
        $carouselContainer = $carousel.find('.swiper'),
        $settings = $carousel.data('settings');

    if (!$carousel.length) {
        return;
    }

    const Swiper = elementorFrontend.utils.swiper;
    initSwiper();
    async function initSwiper() {
        var swiper = await new Swiper($carouselContainer, $settings);
        if ($settings.pauseOnHover) {
            $($carouselContainer).hover(function () {
                (this).swiper.autoplay.stop();
            }, function () {
                (this).swiper.autoplay.start();
            });
        }

    };

};
