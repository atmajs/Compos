include
	.css('notification.css')
	.load('notification.mask')
	.done(function(resp) {

    if (typeof $L == 'undefined') {
        $L = function(arg) {
            return arg;
        }
    }

    var template = resp.load.notification,
        $t = null,
        $container = null,
        $exceptionContainer = null
		;
    
    function argsToMessage(args) {
        var message = '',
			i = 0,
			imax = args.length,
			x;
			
        for (; i < imax; i++) {
			
			x = args[i];
			message  += typeof x === 'string'
				? x 
				: JSON.stringify(x, null, 4)
				;
        }
		
        return message;
    };
	
	if (window.compo == null) 
		window.compo = {};
	
	
    window.compo.Notification = {
        exception: function(error) {
            
			var message = typeof error == 'string'
				? error
				: JSON.stringify(error, null, 4);
            

            this.show(argsToMessage(arguments), 'exception');
        },
        warn: function() {
            
            this.show(argsToMessage(arguments), 'warn');
        },
        error: function() {
			
            this.show(argsToMessage(arguments), 'error');
        },
        success: function() {

            
            this.show(argsToMessage(arguments), 'success');
        },
        
		
        show: function(message, type) {
			
			var title = getTitle(type);
			
            if ($container == null) {
				
				initialize();
            }
            
			
			$t
				.removeClass('success error warn info')
				.addClass(type);
				
			$t
				.find('pre')
				.text(message);
			$t
				.find('h1')
				.text(title);
		

            var $div = $t
				.clone()
				.prependTo(type === 'exception' ? $exceptionContainer : $container); 



            mask.animate($div.get(0), {
                model: 'transform | translate3d(0px, -250px, 0px) > translate3d(0px, 0px, 0px) | 200ms',
                next: 'transform | > translate3d(300px, 0px, 0px) | 100ms linear 4s'
            }, function() {
                $div.remove()
            });


        }
    };
	
	
	
	function initialize(args) {
		var compo = Compo.initialize(Compo({
					
			template: '.ui-notify; .ui-notify.exception',
			events: {
				'click: .ui-notify-close': function(event){
					var $div = $(event.currentTarget).closest('.ui-notify-message');
					
					$div.remove();
				}
			}
			
		}), null, document.body);
		
		$container = compo.$.first();
		$exceptionContainer = compo.$.last();
		$t = $(mask.render(template, {}));
	}
	
	var titles = {
		success: 'Done',
		error: 'Error',
		warn: 'Warning',
		exception: 'Exception',
		info: 'Info'
	};
	
	function getTitle(type){
		return $L(titles[type]);
	}
});