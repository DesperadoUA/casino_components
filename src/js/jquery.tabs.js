$(function() {
    const tabsNav = $('.js-tabs-nav');
    let activeClass = 'is-active';

    tabsNav.each(function(i) {
        var storage = localStorage.getItem('tab' + i);
        if (storage) {
            $(this).find('li').removeClass(activeClass).eq(storage).addClass(activeClass)
                .closest('.tabs').find('.tabs__content').removeClass(activeClass).eq(storage).addClass(activeClass);
        }
    });

    tabsNav.on('click', '.js-tab-link:not(.is-active)', function() {
        $(this)
            .addClass(activeClass).siblings().removeClass(activeClass)
            .closest('.tabs').find('.tabs__content').removeClass(activeClass).eq($(this).index()).addClass(activeClass);

        var ulIndex = tabsNav.index($(this).parents(tabsNav));
        localStorage.removeItem('tab' + ulIndex);
        localStorage.setItem('tab' + ulIndex, $(this).index());
    });
});
