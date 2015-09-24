makePlaceholder = function($el){
    var sel = null;
    if(!$el){
        sel = $('.input__wrapper');
    }else{
        sel = $($el).find('.input__wrapper');
    }
    sel.each(function(){
        var $this = $(this),
            $input = $this.find(".input__input"),
            $placeholder = $this.find(".input__label");
        $input.trigger('blur');
        if($input.val() != '') {
            $placeholder.hide();
        }
        $input
            .on('blur', function() {
                setTimeout(function(){
                    if ($input.val() == '')
                        $placeholder.show();
                },10);
            }).on('focus',function() {
                $placeholder.hide();
            }).on('change', function() {
                $placeholder.hide();
            }).on('mouseover', function() {
                if ($input.val() != '') {
                    $placeholder.hide();
                }
            });
        if($this.hasClass('.input__input--phone') && $.fn.mask !== undefined){
            $input.mask("+7 (999) 999-99-99");
        }
    });
};
makePlaceholder();
