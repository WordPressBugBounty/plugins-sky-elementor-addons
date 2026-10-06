;(function ($, elementor) {
	'use strict';

	// This widget uses the global carousel handler. `widgetGlobalCarousel` is a top-level
	// global in the free plugin's base.js (handle `sky-addons-base`), which every per-module
	// pro handle and the pro editor bundle already depend on. The wrapper prints
	// `sa-swiper-global-carousel`, which is what that handler looks for.
	jQuery(window).on('elementor/frontend/init', function () {
		elementorFrontend.hooks.addAction('frontend/element_ready/sky-loop-carousel.default', widgetGlobalCarousel);
	});

}(jQuery, window.elementorFrontend));
