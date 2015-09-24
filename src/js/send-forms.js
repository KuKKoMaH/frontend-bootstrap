;(function(){
    var forms = {
        'contacts' : {
            selector: $("#contacts-form"),
            fields: [
                {
                    'input'    : $('#contacts-name'),
                    'type'     : 'string',
                    'required' : true
                },
                {
                    'input'    : $('#contacts-phone'),
                    'type'     : 'phone',
                    'required' : true
                },
                {
                    'input'    : $('#contacts-email'),
                    'type'     : 'email',
                    'required' : true
                }
            ]
        }
    };

    $(".input__phone").mask("+7 (999) 999-99-99");
    for(var form in forms) if(forms.hasOwnProperty(form)){
        (function(form_data){
            var selector = form_data.selector,
                fields = form_data.fields,
                target = form_data.target;
            selector.on('submit', function(e){
                e.preventDefault();
                if(validator.validate(fields)){
                    var $this = $(this),
                        data,
                        req = $this.serializeArray(),
                        processData = true,
                        contentType = true;
                    if(form_data['files'] && form_data['files']['length']){
                        data = new FormData();
                        processData = false;
                        contentType = false;
                        for(var i in req){
                            data.append(req[i]['name'], req[i]['value']);
                        }
                        $.each(form_data['files'], function(a,b){data.append(a,b)});

                        $.ajax({
                            url: '/sendForm.php',
                            type: 'POST',
                            data: data,
                            cache: false,
                            dataType: 'json',
                            processData: false,
                            contentType: false,
                            success: function(data, textStatus, jqXHR) {
                                successForm($this, data, target);
                            }
                        })

                    }else{
                        $.post('/sendForm.php', req, function(data){
                            successForm($this, data, target);
                        })

                    }
                }
                return false;
            });
        })(forms[form]);
    }

    function successForm($form, data, target){
        if (data['message']) {
            $form.html(data['message']);
        }
    }
})();