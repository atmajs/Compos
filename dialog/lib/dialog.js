
include
    .css('dialog.css')
    .done(function(){
        
        var Template = ".-dialog-overlay {\
                        .-dialog-btn-cancel x-signal='click:dialogCancel';\
                        .-dialog-wrapper > .-dialog-cell > .-dialog;\
                       }"
        
        mask.registerHandler(':dialog', Compo({
            mode: 'client',
            compos: {
                $overlay: '$: .-dialog-overlay',
                $dialog: '$: .-dialog'
            },
            slots: {
                dialogCancel: 'hide'
            },
            onRenderStart: function(model){
                this.__model = model;
                this.__nodes = this.nodes;
                
                this.nodes = jmask(Template)
            },
            
            show: function(data){
                
                var compos = this.compos;
                
                if (this.__nodes != null) {
                    
                    compos.$dialog.appendMask(this.__nodes, this.__model);
                    this.__nodes = null;
                    this.__model = null;
                    
                    compos.ani_show = this.find('#dialog-show');
                    compos.ani_hide = this.find('#dialog-hide');
                }
                
                if (data != null) {
                    var template = data.template,
                        asHtml = data.asHtml;
                        
                    if (template) {
                        compos
                            .$dialog
                            .emptyAndDispose()
                            [asHtml ? 'append' : 'appendMask'](template);
                    }    
                }
                
                compos.$overlay.show();
                
                if (compos.ani_show) {
                    compos
                        .ani_show
                        .start(null, compos.$dialog.get(0));   
                }
            },
            
            hide: function(){
                var that = this;
                    
                if (this.compos.ani_hide) {
                    this
                        .compos
                        .ani_hide
                        .start(function(){
                            
                            that.compos.$overlay.hide();
                            
                        }, this.compos.$dialog.get(0));
                        
                    return;
                }
                
                this.compos.$overlay.hide();
            }
        }));
        
    });
    