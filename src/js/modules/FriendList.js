define(function(require, exports, module){
    var util = require('modules/utility');
    function c (options){
        var self = this;
        util.extend(self._options = {
            container: document.body,
            items: []
        }, options);
        self._options.items.forEach(function(item, index){
            self.add(item);
        });
    }
    util.defineProperties(c.prototype, {
        add: function(val){
            var self = this,
                el = self._options.container;
            el.append('<div class="item"><input type="checkbox" />&nbsp;<input type="text" value="'+ (val || '') +'"></div>');
        },

        remove: function(){
            var self = this,
                el = self._options.container;

            el.find('.item').each(function(index, item){
                item = $(item);
                item.find('input[type=checkbox]').prop('checked') && item.remove();
            });
        },

        getValues: function(){
            var self = this,
                el = self._options.container,
                ret = [];
            var x = el.find('input[type=text]').each(function(index, item){
                ret.push(item.value);
            });
            return ret;
        }
    });
    
    exports.setup = function(el){
        return new c({container: el});
    }
});