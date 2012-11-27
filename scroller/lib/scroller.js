include.js('iscroll-full.js').done(function() {
   mask.registerHandler('scroller', Class({
      Base: Compo,
      DOMInsert: function() {
         if (this.scroller == null) this.scroller = new iScroll(this.$[0],{vScrollbar: true, hScrollbar: true});         
      },
      render: function(values, container, cntx) {

         this.tagName = 'div';
         this.attr.class = (this.attr.class ? this.attr.class + ' ': '') + 'scroller';
         
         this.nodes = {
            tagName: 'div',
            attr: {
               class: 'scroller-container'
            },
            nodes: this.nodes
         };
         
         
         Compo.render(this, values, container, cntx);
         Compo.shots.on(this, 'DOMInsert', this.DOMInsert);
         
         return this;
      },
      dispose: function() {
         if (this.scroller) this.scroller.destroy();
      }
   }));
});