define(function(require, exports, module){
    var util = require('modules/utility'),
        dot = require('modules/doT'),
        template = dot.template('<div class="popover-mark{{=it.popupMark}}" style=""><div class="popover-main"><div class="popover-content">{{=it.content}}</div></div></div>');


    function c (options){
        var self = this;
        util.extend(self._options = {
            prefix: '',
            content: ''
        }, options || {});
    }


    util.defineProperties(c.prototype, {
        getHTMLString: function(){
            var self = this,
                opts = self._options;
            return template({popupMark: opts.prefix ? ' ' + opts.prefix : '', content: opts.content});
        },

        render: function(el){
            var self = this;
            el.append(self._popoverMark = $(self.getHTMLString()));
        },


        show: function(){

        },

        hide: function(){

        },


        content: function(){

        },

        prefix: function(){

        }


    });




    exports.getInstance = function(opts){
        return new c(opts);
    }
});