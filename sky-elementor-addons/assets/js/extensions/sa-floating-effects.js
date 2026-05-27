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
