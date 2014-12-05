define(function(require, exports, module){
    var util = require('modules/utility'),
        $ = require('jquery');

    function popup(options){
        var self = this,
            opts;
        $.extend(self._options = opts = {
            prefix: '',
            markClass: 'popup-mark',
            popupClass: 'popup-main',
            contentClass: 'popup-content',
            hideAndClear: true
        }, options || {});
        var html = '<div class="'+opts.markClass+'"><div class="'+opts.popupClass+'"><div class="'+opts.contentClass+'"></div></div></div>';
        $('body').append($(html));
        self._popup = $('.' + opts.markClass).css('visibility', 'hidden');
        self._main = $('.' + opts.markClass + ' > div.' + opts.popupClass);
        self._content = $('.' + opts.markClass + ' div.' + opts.popupClass + ' > div.' + opts.contentClass);
        self._initialize();
    }
    
    util.defineProperties(popup.prototype, {
        _initialize: function(){
            var self = this,
                popup = self._popup,
                main = self._main;
            popup.css('position', 'absolute')
                .css('width', '100%')
                .css('left', '0px')
                .css('top', '0px');
            main.css('position', 'absolute')
                .css('left', '0px')
                .css('top', '0px')
                .css('right', '0px')
                .css('bottom', '0px');
            self._content.delegate('.popup-close', 'click', function(){self.hide();});
            self.refresh();
        },

        show: function(){
            this._popup.css('visibility', 'visible');
            return this;
        },

        hide: function(){
            var self = this,
                opts = self._options;
            self._popup.css('visibility', 'hidden');
            if(!opts.hideAndClear){return self;}
            self._content.html('');
            self._main.css('marginTop', '0px');
            self._popup.css('width', '100%')
                .css('height', '100%');
            return self;
        },

        content: function(content){
            var self = this;
            this._content.html(content);
            self.refresh();
            return self;
        },

        prefix: function(className){
            var self = this,
                opts = self._options,
                popup = self._popup;
            if(popup.hasClass(className)){return;}
            popup.addClass(className);
            return self;
        },

        refresh: function(){
            var self = this,
                body = $('body').get(0),
                main = document.documentElement,
                top = Math.round((main.clientHeight - self._content.get(0).offsetHeight) / 2 + Math.max(main.scrollTop, body.scrollTop)),
                height;
            self._main.css('marginTop', Math.max(top, 0) + 'px');
            height = Math.max(body.scrollHeight, main.scrollHeight),
            self._popup.css('height', height + 'px')//.css('width',  width + 'px');
            return self;
        }
    });
    
    exports.getInstance = function(opts){
        return new popup(opts);
    }
});