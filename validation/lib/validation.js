window.include && include.css('styles.css');

;
(function() {
	var DOM = {
		notifyInvalid: function(element, message, oncancel) {
			console.warn('Validation Notification:', element, message);

			var next = $(element).next('.invalid');
			if (next.length == 0) {
				next = $('<div>').addClass('invalid').html('<span></span><button>cancel</button>').insertAfter(element);
			}

			next //
			.children('button').off().on('click', function() {
				next.hide();
				oncancel && oncancel();
			}) //
			.end() //
			.children('span').text(message) //
			.end() //
			.show(); //
		},
		isValid: function(element) {
			$(element).next('.invalid').hide();
		}
	}

	var Validators = {
		match: {
			validate: function(node, str) {
				return new RegExp(node.attr.match).test(str);
			}
		},
		unmatch: {
			validate: function(node, str) {
				return !(new RegExp(node.attr.unmatch)).test(str);
			}
		},
		minLength: {
			validate: function(node, str) {
				return str.length >= parseInt(node.attr.minLength,10);
			}
		},
		maxLength: {
			validate: function(node, str) {
				console.log('max',parseInt(node.attr.maxLength, 10), str.length);
				return str.length <= parseInt(node.attr.maxLength, 10);
			}
		},
		check: {
			validate: function(node, str){
				//...
			}
		}
	}

	
	mask.registerValidator = function(type, validator){
		Validators[type] = validator;
	}

	
	mask.registerHandler('validate', Class({
		render: function(model, container, cntx) {
			this.element = container;
			this.model = model;
		},
		/**
		 * @param input - {control specific} - value to validate
		 * @param element - {HTMLElement} - (optional, @default this.element) -
		 * 				Invalid message is schown(inserted into DOM) after this element
		 * @param oncance - {Function} - Callback function for canceling
		 * 				invalid notification
		 */
		validate: function(input, element, oncancel) {
			if (element == null) element = this.element;

			if (this.attr.getter) {
				input = Object.getProperty({
					node: this,
					element: element
				}, this.attr.getter);
			}
			
			if (this.validators == null){
				this.initValidators();
			}
			
			for(var i = 0, x, length = this.validators.length; i<length; i++){
				x = this.validators[i];
				if (x.validate(this, input) === false){
					DOM.notifyInvalid(element, this.message, oncancel);
					return false;
				}
			}

			//////if (this.model == null) {
			//////	this.createModel();
			//////}
			//////for (var key in this.model) {
			//////	if (Validators[key].validate(this.model[key], input) == false) {
			//////		DOM.notifyInvalid(element, this.message, oncancel);
			//////		return false;
			//////	}
			//////}

			DOM.isValid(element);
			return true;
		},
		initValidators: function(){
			this.validators = [];			
			this.message = this.attr.message
			delete this.attr.message;
			
			for (var key in this.attr) {
				if (key in Validators == false) {
					console.error('Unknown Validator:', key, this);
					continue;
				}				
				var validator = Validators[key];
				if (validator instanceof Function){
					validator = new validator(this);
				}
				this.validators.push(validator);
			}
		},
		//////createModel: function() {
		//////	this.model = {};
		//////	this.message = this.attr.message
		//////
		//////	delete this.attr.message;
		//////	for (var key in this.attr) {
		//////		if (key in Validators == false) {
		//////			console.error('Unknown Validator:', key, this);
		//////			continue;
		//////		}
		//////		this.model[key] = Validators[key].create(this.attr[key]);
		//////	}
		//////}
	}));

	mask.registerHandler('validationGroup', Class({
		Extends: CompoUtils,
		render: function(model, container, cntx) {
			mask.renderDom(this.nodes, model, container, cntx);
		},
		validate: function() {
			var validations = this.all('validate');
			for (var i = 0, x, length = validations.length; i < length; i++) {
				x = validations[i];
				if (!x.validate()) return false;
			}
			return true;
		}
	}));
})();