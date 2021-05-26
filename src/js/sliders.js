(function() {
    /* Swiper
    **************************************************************/
    const breakpoint = window.matchMedia( '(max-width: 991px)' );
    let init = false;
    let swiperOffer;


    /* Which media query
**************************************************************/
    function swiperMode() {
        if(breakpoint.matches) {
            if (!init) {
                init = true;
                enableSwiperCondition();
            }

        } else {
            if ( swiperOffer !== undefined ) swiperHiw.destroy( true, true );

            init = false;
        }
    }

    const enableSwiperCondition = function() {
        swiperOffer = new Swiper('.js-best-offer-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 20,
            hashNavigation: {
                watchState: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                600: {
                    centeredSlides: true,
                    slidesPerView: 2,
                    spaceBetween: 20,
                }
            }
        });
    };

    /* On Load
    **************************************************************/
    window.addEventListener('load', function() {
        swiperMode();
    });

    /* On Resize
    **************************************************************/
    window.addEventListener('resize', function() {
        swiperMode();
    });
})();
