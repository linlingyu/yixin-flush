requirejs(['jquery'], function($){
    var windowId;
    function getWindowId(callback){
        if(windowId){return callback();}
        chrome.windows.getCurrent(null, function(win){
            windowId = win.id;
            callback();
        });
    }
    //
    $('.app-menu .item').click(function(evt){
        evt.preventDefault();
        var typeId = this.id;
        chrome.runtime.getBackgroundPage(function(win){
            getWindowId(function(){
                var App = win.App,
                    porp = typeId === 'exeId' ? 'run' : 'open';
                if(typeId === 'exeId'){
                    App.run(windowId);
                }else{
                    App.open(windowId);
                }
                window.close();
            });
        });
    });
});