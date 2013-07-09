include
	.js('marked.js')
	.done(function() {

	var str_trimTrailings = (function() {

		var _cache_Regexp = {};

		return function(string) {
			var regexp_trailing = /^[\t ]+(?=[^\r\n]+)/m,
				count,
				match;

			match = regexp_trailing.exec(string);

			if (!match)
				return string;

			count = match[0].length;

			if (_cache_Regexp[count] == null)
				_cache_Regexp[count] = new RegExp('^[\\t ]{' + count + '}', 'gm');

			return string.replace(_cache_Regexp[count], '');
		};
	}());


	mask.registerHandler(':markdown', Class({
		Base: Compo,
		Extends: Class.Deferred,
		Construct: function() {
			this.tagName = 'div';
			this.attr = {
				'class': '-markdown'
			};
		},
		

		renderStart: function() {

			if (this.attr.src != null)
				return;

			var md = str_trimTrailings(jmask(this).text());

			this.nodes = jmask(':html')
				.text(highlight(md));
		},

		onRenderEnd: function(elements, model, cntx) {
			if (this.attr.src == null)
				return;

			var that = this;
			include
				.instance()
				.ajax(this.attr.src + '::Data')
				.done(function(resp) {
				that
					.$
					.get(0)
					.innerHTML = highlight(resp.ajax.Data);
			});

			(cntx.promise || (cntx.promise = []))
				.push(this);

		}
	}));

	function highlight(md) {
		return marked(md);
	}

	marked.setOptions({
		gfm: true,
		pedantic: false,
		sanitize: false,
		breaks: true,
		highlight: function(code, lang) {
			code = code.replace(/&nbsp;/g, ' ');
			
			if (typeof Prism === 'undefined')
				return code;
			
			if (lang == null) 
				lang = 'javascript';
			


			if (lang && lang in Prism.languages) {
				return Prism.highlight(code, Prism.languages[lang]);
			}

			return Prism.highlight(code);

		}
	});

});