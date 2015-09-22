;(function(){
    var $body = $("body");

    $(".tabs__header").on('click', clickTab);
    $body.on('selectFirstTab', selectFirstTab);

    function showTab (tab_id, header){
        var tab = $("#"+tab_id);
        if(tab.length){
            tab
                .parent()
                .children(".tabs__body")
                .removeClass("tabs__body--active");
            tab.addClass('tabs__body--active');
            header
                .parent()
                .children(".tabs__header")
                .removeClass("tabs__header--active");
            header.addClass('tabs__header--active');
            $body.trigger('showTab', [ tab_id ])
        }
    }

    function clickTab(){
        var $this = $(this),
            tab_id = $this.data('target');
        showTab(tab_id, $this);
    }

    function selectFirstTab(e, sel){
        var $root = (sel)?$(sel):$body;
        $root.find(".tabs__headers").find('.tabs__header').first().addClass('tabs__header--active');
        $root.find(".tabs__bodys").find('.tabs__body').first().addClass('tabs__body--active');
    }
})();