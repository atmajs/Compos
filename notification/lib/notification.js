include.css('style.css').load('view.mask').done(function(response) {

    if (typeof $L == 'undefined') {
        $L = function(arg) {
            return arg;
        }
    }

    var w = window,
        template = response.load[0],
        stack = [],
        $t = null,
        $container = null,
        $exceptionContainer = null,
        width = 350,
        $alert = null,
        $overlay;
    
    template = "<div class='ui-notify-message ui-notify-message-style #{type}'>\
                    <div>\
                        <a class='ui-notify-cross ui-notify-close' href='#'>x</a>\
                        <h1>#{title}</h1>\
                        <div class='ui-notify-icon'></div>\
                        <p>#{message}</p>\
                        </div>\
                </div>"
	

    function argumentsToHtmlMessage() {
        var message = '';
        for (var i = 0; i < arguments.length; i++) {
            if (typeof arguments[i] == 'string') message += arguments[i] + '<br/>';
            else message += JSON.stringify(arguments[i]) + '<br/>';

        }
        return message;
    }(w.compo || (w.compo = {})).Notification = {
        exception: function(error) {
            var message;
            if (typeof error == 'string') message = error.replace(/\n/g, '<br\>');
            else message = JSON.stringify(error);

            this.show({
                type: 'exception',
                message: message
            });
        },
        warn: function() {
            var message = argumentsToHtmlMessage.apply(this, arguments);
            d.error('warn notification:', message);
            this.show(message, 'warn');
        },
        error: function() {
            var message = argumentsToHtmlMessage.apply(this, arguments);
            console.error('error notification:', message);
            this.show(message, 'error');
        },
        success: function() {

            var message = argumentsToHtmlMessage.apply(this, arguments);
            this.show(message, 'success');
        },
        /** { type : info{default}, success, warn, error
         *      message
         *      title?
         */
        show: function(data, type) {
            if (typeof data == 'string') {
                data = {
                    type: type,
                    message: data
                };
            }
            if (!data.type) data.type = 'info';
            if (!data.title) {
                switch (data.type) {
                case 'success':
                    data.title = $L('Done');
                    break;
                case 'error':
                    data.title = $L('Error');
                    break;
                case 'warn':
                    data.title = $L('Warning');
                    break;
                case 'exception':
                    data.title = $L('Exception');
                    data.type = 'error exception';
                    break;
                case 'info':
                    data.title = $L('Info');
                    break;
                }
            }

            if (!$container) {
                $container = $('<div class="ui-notify"></div>').appendTo($('body'));
            }
            if (data.type.indexOf('exception') > -1 && !$exceptionContainer) {
                $exceptionContainer = $('<div class="ui-notify exception"></div>').appendTo($('body'));
            }

            if (!$t) {
                $t = $(String.format(template,data));
            } else {
                $t.removeClass('success error warn info').addClass(data.type);
                $t.find('p').html(data.message);
                $t.find('h1').text(data.title);
            }

            var $div = $t.clone().prependTo(data.type.indexOf('exception') == -1 ? $container : $exceptionContainer); 



            new ruqq.animate.Model3({
                model: '-webkit-transform | translate3d(0px, -250px, 0px) > translate3d(0px, 0px, 0px) | 200ms',
                next: '-webkit-transform | > translate3d(300px, 0px, 0px) | 100ms linear 4s'
            }).start($div[0], function() {
                $div.remove()
            });


        }
    };
});