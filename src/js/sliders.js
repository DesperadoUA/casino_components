(function() {
    /* Swiper
    **************************************************************/
    const breakpoint = window.matchMedia( '(max-width: 991px)' );
    let init = false;
    let swiperHiw;
    let swiperWhyUs;
    let swiperReviews;
    let swiperProducts;
    let swiperDiet;
    let swiperDietImages;


    /* Which media query
**************************************************************/
    function swiperMode() {
        if(breakpoint.matches) {
            if (!init) {
                init = true;
                enableSwiperCondition();
            }

        } else {
            if ( swiperHiw !== undefined ) swiperHiw.destroy( true, true );
            if ( swiperWhyUs !== undefined ) swiperWhyUs.destroy( true, true );
            if ( swiperProducts !== undefined ) swiperProducts.destroy( true, true );
            if ( swiperDiet !== undefined ) swiperDiet.destroy( true, true );

            init = false;
        }
    }

    const enableSwiperCondition = function() {
        swiperHiw = new Swiper('.js-hiw-swiper', {
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

        swiperWhyUs = new Swiper('.js-why-us-swiper', {
            slidesPerView: 1.2,
            spaceBetween: 10,
            hashNavigation: {
                watchState: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                480: {
                    slidesPerView: 1.7,
                    spaceBetween: 10
                },
                600: {
                    centeredSlides: true,
                    slidesPerView: 2,
                    spaceBetween: 20,
                }
            }
        });

        swiperProducts = new Swiper('.js-products-swiper', {
            slidesPerView: 1.1,
            spaceBetween: 20,
            hashNavigation: {
                watchState: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                480: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                600: {
                    centeredSlides: true,
                    slidesPerView: 3,
                    spaceBetween: 20
                }
            }
        });

        swiperDiet = new Swiper('.js-diet-swiper', {
            slidesPerView: 1.03,
            spaceBetween: 10,
            hashNavigation: {
                watchState: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                480: {
                    slidesPerView: 1.3,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 2,
                    centeredSlides: true,
                    spaceBetween: 20
                }
            }
        });
    };

    const enableSwiperGeneral = function() {
        swiperReviews = new Swiper('.js-reviews-swiper', {
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
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                992: {
                    slidesPerView: 'auto',
                    spaceBetween: 20,
                    scrollbar: {
                        el: '.swiper-scrollbar',
                        hide: true,
                    }
                }
            }
        });

        swiperDietImages = new Swiper('.js-diet-images', {
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    };

    /* On Load
    **************************************************************/
    window.addEventListener('load', function() {
        swiperMode();
        enableSwiperGeneral();
    });

    /* On Resize
    **************************************************************/
    window.addEventListener('resize', function() {
        swiperMode();
    });
})();
