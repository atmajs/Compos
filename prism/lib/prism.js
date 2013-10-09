include
    .js('prism.lib.js::Prism')
    .css('prism.lib.css')
    .done(function(resp) {

    var Prism = resp.Prism || window.Prism;

    if (typeof global !== 'undefined') {
        global.Prism = Prism;
    }

    var PrismCompo = Compo({
        mode: 'server:all',
        attr : {
            language: 'javascript'
        },
        
        renderStart: function(model, ctx) {

            var _lang = this.attr.language,
                _class = 'language-' + _lang,
                _code;

            if (this.attr.src != null) {
                var that = this;
				
				this.nodes = jmask('pre.' + _class + ' > code.' + _class);
				
				_code = this.nodes.find('code');
                
                Compo.pause(this, ctx);
                
				var name = this.attr.src;
                Compo
                    .resource(this)
                    .ajax(this.attr.src + '::' + name)
                    .done(function(resp) {
                        
						
                        highlight(_code, resp.ajax[name], _lang);
                        Compo.resume(that, ctx);
                    });
                    
                return;
            }
			
            _code = jmask('pre.' + _class + ' > code.' + _class)
				.children()
				.mask(this.nodes);
				
			this.nodes = _code.end();
				
            highlight(_code, str_trimTrailings(_code.text(model, ctx, this)), _lang);
        }
    });
    
    
    // @obsolete
    mask.registerHandler('prism', PrismCompo);
    
    mask.registerHandler(':prism', PrismCompo);
    
    
    
    // UTILS
    
    function highlight($code, str, lang){
        
        var langs = Prism.languages,
            grammar = langs[lang] || langs.javascript;
            
        
        //if (lang === 'markup' || lang === 'css') 
            str = str
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        
        
        str = Prism.highlight(str, grammar);   
        
        
        
        var $html = jmask(':html')
            .text(str);
        
        $code.mask($html);
    }
    
    
    var _cache_Regexp = {};
    function str_trimTrailings(string) {
		var regexp_trailing = /^[\t ]*(?=[^\r\n\t ]+)/m,
			count,
			match;

		match = regexp_trailing.exec(string);

		if (!match)
			return string;

		count = match[0].length;
        
        if (count === 0) 
            return string;

		if (_cache_Regexp[count] == null)
			_cache_Regexp[count] = new RegExp('^[\\t ]{1,' + count + '}', 'gm');

		return string.replace(_cache_Regexp[count], '');
	};
});
