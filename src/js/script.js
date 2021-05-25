( function( $ ) {
    /* Debounce and throttle function's decorator plugin */
    (function (b, c) { var $ = b.jQuery || b.Cowboy || (b.Cowboy = {}), a; $.throttle = a = function (e, f, j, i) { var h, d = 0; if (typeof f !== "boolean") { i = j; j = f; f = c } function g() { var o = this, m = +new Date() - d, n = arguments; function l() { d = +new Date(); j.apply(o, n) } function k() { h = c } if (i && !h) { l() } h && clearTimeout(h); if (i === c && m > e) { l() } else { if (f !== true) { h = setTimeout(i ? k : l, i === c ? e - m : e) } } } if ($.guid) { g.guid = j.guid = j.guid || $.guid++ } return g }; $.debounce = function (d, e, f) { return f === c ? a(d, e, false) : a(d, f, e !== false) } })(this);

    $(function(){
        const $body = document.body;
        const bannerSlider = $('.js-banner-toggle');
        let mobileMenuTrigger = document.querySelector('.js--menu-trigger');

        // anchor link scroll
        $('.js-anchor-trigger').click(function() {
            let $href = $(this).attr('href');

            $('html, body').animate({
                    scrollTop: $($href).offset().top},
                'slow');
        });

        // Open-close init
        $('.js-faq-open-close').openClose({
            activeClass: 'is-active',
            opener: '.js-faq-opener',
            slider: '.js-faq-slide',
            animSpeed: 400,
            effect: 'slide'
        });

        function checkForWindowResize() {
            if (window.matchMedia("(max-width: 991px)").matches) {
                bannerSlider.openClose({
                    activeClass: 'is-active',
                    opener: '.js-banner-opener',
                    slider: '.js-banner-content',
                    animSpeed: 400,
                    effect: 'slide'
                });
            } else {
                if(bannerSlider.data('OpenClose')){
                    bannerSlider.each(function () {
                        $(this).data('OpenClose').destroy();
                    })
                }
            }
        }

        checkForWindowResize();
        $(window).resize( $.throttle( 250, checkForWindowResize));

        /* Mobile nav  */
        mobileMenuTrigger.addEventListener('click', function (e) {
            e.preventDefault();

            if ($body.classList.contains('is-menu-open')) {
                $body.classList.remove('is-menu-open');
            } else {
                $body.classList.add('is-menu-open');
            }
        });

        // Custom selects
        $('.js-select-custom').select2({
            minimumResultsForSearch: -1
        })
            .on('select2:select', function (e) {
                $(e.target).addClass('selected')
            });

        // after Reg form submit
        /*$('.form-callback').on('submit', function(e) {
            $('#modal-callback-done').data('ContentPopup').showPopup();

            e.preventDefault();
        });*/
    });
} )( jQuery );

// Google fonts loader
WebFont.load({
    google: {
        families: ['Roboto:400, 700', 'Open Sans:400,700&display=swap']
    }
});
