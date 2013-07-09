include.js('prism.lib.js').css('prism.lib.css').done(function() {


    function highlight(compo){
        window.Prism.highlightElement(compo.$.find('code').get(0));
        
        compo.resolve();
    }

    mask.registerHandler('prism', Class({
        Base: Compo,
        Extends: Class.Deferred,
        Construct: function(){
            this.attr = {
                language: 'javascript'
            };   
        },
        
        renderStart: function() {

            var _class = 'language-' + this.attr.language

            this.nodes = jmask('pre.language-' + _class + ' > code.' + _class)
                .children()
                .mask(this.nodes)
                .end()

        },

        onRenderEnd: function(elements, model, cntx){
            if (this.attr.src != null) {
                var that = this;
                include
                    .instance()
                    .ajax(this.attr.src + '::Data')
                    .done(function(resp) {
                        that
                            .$
                            .find('code')
                            .text(resp.ajax.Data);
    
                        highlight(that);
                        
                    });
                
                (cntx.promise || (cntx.promise  = [])).push(this);
            }else {
                highlight(this);
            }
        }
    }));
});
