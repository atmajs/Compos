include.js('prism.lib.js').css('prism.lib.css').done(function() {

    function IDeferred(){}
    IDeferred.prototype = {
        resolve: function(){
            this.done = function(fn){
                fn();
            };
            if (this.callbacks){
                for(var i = 0, length = this.callbacks.length; i<length; i++){
                    this.callbacks[i]();
                }
            }
            delete this.callbacks;
        },
        done: function(fn){
            (this.callbacks || (this.callbacks = [])).push(fn);
        }
    };


    function highlight(compo){
        window.Prism.highlightElement(compo.$.find('code').get(0));

        compo.resolve();
    }

    mask.registerHandler('prism', Class({
        Base: Compo,
        Extends: IDeferred,
        Construct: function() {
            this.attr = { language: 'javascript' };
        },
        renderStart: function(values, container, cntx) {

            var _class = 'language-' + this.attr.language



            this.nodes = jmask('pre.language-' + _class + ' > code.' + _class)
            .children()
            .mask(this.nodes)
            .end()

        },

        onRenderEnd: function(){
            if (this.attr.src != null) {
                var _this = this;
                include.instance().ajax(this.attr.src + '::Data').done(function(r) {
                    _this.$.find('code').text(r.ajax.Data);

                    highlight(_this);
                });
            }else {
                highlight(this);
            }
        }
    }));
});
