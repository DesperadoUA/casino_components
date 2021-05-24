$(function() {
    const $body = $('body');

    // Overlays
    $('[data-popup]').contentPopup({
        mode: 'click',
        btnOpen: '',
        hideOnClickLink: true,
        openClass: 'is-open',
        btnClose: '.js-popup-close',
        onShow: function (self) {
            const scrollWidth = window.innerWidth - document.documentElement.clientWidth;

            $body.removeClass('is-modal-open');
            $(self.popup).siblings('.modal').removeClass(self.options.openClass);

            setTimeout(function () {
                if(!$body.hasClass('is-modal-open')) {
                    $body
                        .css({
                            paddingRight: scrollWidth
                        })
                        .removeClass('is-menu-open')
                        .addClass('is-modal-open');

                    document.documentElement.style
                        .setProperty('--scrollbar-width', scrollWidth + 'px');
                }
            }, 1)
        },
        onHide: function () {
            if($body.hasClass('is-modal-open')) {
                if ("ontouchstart" in document.documentElement) {
                    bodyScrollLock.clearAllBodyScrollLocks();
                }

                $body
                    .css('padding-right', '')
                    .removeClass('is-modal-open');
            }
        }
    });
})

// popup plugin
;(function($) {
    function ContentPopup(opt) {
        this.options = $.extend({
            holder: null,
            dataPopup: 'popup',
            btnOpen: '.open',
            btnClose: '.close',
            openClass: 'popup-active',
            clickEvent: 'click',
            mode: 'click',
            hideOnClickLink: true,
            hideOnClickOutside: true,
            delay: 50,
            animTimeEnd: 0,
            onShow: function () {},
            onHide: function () {}
        }, opt);
        if (this.options.holder) {
            this.holder = $(this.options.holder);
            this.init();
        }
    }
    ContentPopup.prototype = {
        init: function() {
            this.findElements();
            this.attachEvents();
        },
        findElements: function() {
            this.popup = $(this.holder.data(this.options.dataPopup));
            this.btnClose = this.popup.find(this.options.btnClose);
            //this.btnOpen = this.holder.find(this.options.btnOpen);

            if(this.options.btnOpen.length === 0) {
                this.btnOpen = this.holder;
            } else {
                this.btnOpen = this.holder.find(this.options.btnOpen);
            }
        },
        attachEvents: function() {
            // handle popup openers
            var self = this;
            this.clickMode = isTouchDevice || (self.options.mode === self.options.clickEvent);

            if (this.clickMode) {
                // handle click mode
                this.btnOpen.bind(self.options.clickEvent + '.popup', function(e) {
                    if (self.holder.hasClass(self.options.openClass)) {
                        if (self.options.hideOnClickLink) {
                            self.hidePopup();
                        }
                    } else {
                        self.showPopup();
                    }
                    e.preventDefault();
                });

                // prepare outside click handler
                this.outsideClickHandler = this.bind(this.outsideClickHandler, this);
            } else {
                // handle hover mode
                var timer, delayedFunc = function(func) {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        func.call(self);
                    }, self.options.delay);
                };
                this.btnOpen.on('mouseover.popup', function() {
                    delayedFunc(self.showPopup);
                }).on('mouseout.popup', function() {
                    delayedFunc(self.hidePopup);
                });
                this.popup.on('mouseover.popup', function() {
                    delayedFunc(self.showPopup);
                }).on('mouseout.popup', function() {
                    delayedFunc(self.hidePopup);
                });
            }

            // handle close buttons
            this.btnClose.on(self.options.clickEvent + '.popup', function(e) {
                self.hidePopup();
                e.preventDefault();
                e.stopPropagation();
            });

            $(document).on('keyup',function(e) {
                if (e.keyCode === 27) {
                    self.hidePopup();
                }

                e.stopPropagation();
            });
        },
        outsideClickHandler: function(e) {
            // hide popup if clicked outside
            var targetNode = $((e.changedTouches ? e.changedTouches[0] : e).target);
            if (!targetNode.closest(this.popup).length && !targetNode.closest(this.btnOpen).length) {
                this.hidePopup();
            }
        },
        showPopup: function() {
            // reveal popup
            let self = this;

            self.holder.addClass(self.options.openClass);
            self.popup.addClass(self.options.openClass);
            /*self.popup.css({
                display: 'block'
            });*/

            // outside click handler
            if (self.clickMode && self.options.hideOnClickOutside && !self.outsideHandlerActive) {
                self.outsideHandlerActive = true;
                $(document).on('click touchstart', self.outsideClickHandler);
            }

            if (self.options.onShow !== undefined) {
                self.options.onShow(self);
            }
        },
        hidePopup: function() {
            // hide popup
            let self = this;

            self.holder.removeClass(self.options.openClass);
            self.popup.removeClass(self.options.openClass);

            // outside click handler
            if (self.clickMode && self.options.hideOnClickOutside && self.outsideHandlerActive) {
                self.outsideHandlerActive = false;
                $(document).off('click touchstart', this.outsideClickHandler);
            }

            if (self.options.onHide !== undefined) {
                self.options.onHide();
            }
        },
        bind: function(f, scope, forceArgs) {
            return function() {
                return f.apply(scope, forceArgs ? [forceArgs] : arguments);
            };
        },
        destroy: function() {
            this.popup.removeAttr('style');
            this.holder.removeClass(this.options.openClass);
            this.btnOpen.add(this.btnClose).add(this.popup).off('.popup');
            $(document).off('click touchstart', this.outsideClickHandler);
        }
    };

    // detect touch devices
    var isTouchDevice = /Windows Phone/.test(navigator.userAgent) || ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;

    // jQuery plugin interface
    $.fn.contentPopup = function(opt) {
        var args = Array.prototype.slice.call(arguments);
        var method = args[0];

        return this.each(function() {
            var $holder = jQuery(this);
            var instance = $holder.data('ContentPopup');

            if (typeof opt === 'object' || typeof opt === 'undefined') {
                $holder.data('ContentPopup', new ContentPopup($.extend({
                    holder: this
                }, opt)));
            } else if (typeof method === 'string' && instance) {
                if (typeof instance[method] === 'function') {
                    args.shift();
                    instance[method].apply(instance, args);
                }
            }
        });
    };
}(jQuery));
