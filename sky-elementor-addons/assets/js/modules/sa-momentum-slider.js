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
