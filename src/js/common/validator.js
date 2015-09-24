;(function(){
    var re_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
        re_phone = /\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}/i,
        re_date  = /^\d{2}\.\d{2}\.\d{4}$/i,
        allowed_filetypes = ['pdf','txt','doc','docx','xls','xlsx','jpg','jpeg','png','gif'],
        field, result, field_result, val, orField, orResult, orVal;
    window.validator = {
        defaultRules: {
            email: function(val, field){
                return re_email.test(val);
            },
            phone: function(val,field){
                return re_phone.test(val);
            },
            date: function(val, field){
                var d = val.split('.');
                return re_date.test(val) && !isNaN(new Date(d[2]+'-'+d[1]+'-'+d[0]).getTime());
            },
            string: function(val, field){
                return val.length >= 3;
            },
            checkbox: function(val, field){
                return field.input.prop('checked');
            },
            file: function(val, field){
                var files = field.input.prop('files');
                if(files['length']){
                    var file = files[0],
                        file_parts = file.name.split('.'),
                        file_ext = file_parts[file_parts.length - 1];
                    return file.size < 10 * 1024 * 1024 && allowed_filetypes.indexOf(file_ext) !== -1;
                }else return false;
            }
        },

        testField: function(field, val){
            var res = [];
            if(typeof(this.defaultRules[field.type]) !== 'undefined'){
                if(!this.defaultRules[field.type].call(this, val,  field)) res.push('text');
            } else if(field.type == 'custom'){
                if(typeof(field['rules']) === 'object'){
                    for(var rule_name in field['rules']) if(field['rules'].hasOwnProperty(rule_name)){
                        var rule = field['rules'][rule_name];
                        switch(typeof(rule)){
                            case 'function':
                                if(!rule.call(this, val, field)){
                                    res.push(rule_name);
                                }
                                break;
                            case 'string':
                                if(
                                    typeof(this.defaultRules[rule]) === 'undefined' ||
                                    !this.defaultRules[rule].call(this, val, field)
                                ) {
                                    res.push(rule_name);
                                }
                                break;
                            default:
                                res.push('text');
                        }
                    }
                }
            }else {
                res.push('text');
            }
            return res;
        },

        successField: function(field){
            field.wrapper
                .prop('class', field.baseClass + ' input__success')
                .find('.input__error-message').removeClass('input__error-message--active');

        },

        errorField: function(field, classes){
            field.wrapper
                .prop('class', field.baseClass + ' input__error')
                .find('.input__error-message').removeClass('input__error-message--active')
                .filter(classes.map(function(e){return'.'+e;}).join(', ')).addClass('input__error-message--active');
        },

        validateField: function(field){
            val = field.input.val().trim();
            if (val != '' || field['required']) {
                field_result = this.testField(field, val);
            } else {
                field_result = [];
            }
            if (!field_result.length) {
                this.successField(field);
            } else {
                this.errorField(field, field_result);
                result = false;
            }
            return field_result;
        },

        validate: function(fields){
            result = true;
            this.fields = fields;
            for(var i in fields){
                field = fields[i];

                if(typeof(field['wrapper']) === 'undefined'){
                    field.wrapper = (field.input)?field.input.parent():null;
                }
                field.baseClass =
                    field.wrapper
                        .prop('class').trim().split(' ')
                        .filter(function(c){return c != 'input__error' && c != 'input__success'})
                        .join(' ');

                if(field['logic'] == 'or'){
                    orResult = false;
                    for(var j in field.fields){
                        orField = field.fields[j];
                        orVal = orField.input.val().trim();
                        if(typeof(orField['wrapper']) === 'undefined'){
                            orField.wrapper = (orField.input)?orField.input.parent():null;
                        }
                        orField.baseClass =
                            orField.wrapper
                                .prop('class').trim().split(' ')
                                .filter(function(c){return c != 'input__error' && c != 'input__success'})
                                .join(' ');

                        this.validateField(orField);
                        if(orVal != ''){
                            orResult = true;
                        }
                    }
                    if(orResult){
                        this.successField(field);
                    }else{
                        this.errorField(field, ['text']);
                    }
                }else {
                    if(!this.validateField(field)){
                        result = false;
                    }
                }
            }
            return result;
        }
    };
})();
