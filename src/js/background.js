requirejs(['jquery', 'modules/FileHelper'], function($, fileHelper){
    var article = '', profile = {},
        App = window.App = {
        open: function(windowId){//open options
            chrome.tabs.query({windowId: windowId}, function(tabs){
                var url = chrome.extension.getURL('src/options.html'),
                    tabId;
                //
                tabs.forEach(function(tab, index){
                    if(~tab.url.indexOf(url)){//update
                        tabId = tab.id;
                    }
                });
                if(tabId){
                    chrome.tabs.update(tabId, {url: url}, function(tab){});
                }else{
                    chrome.tabs.create({url: url}, function(tab){});
                }
            });
        },

        run: function(windowId){
            $.when(read('/yixin/profile.txt'), read('/yixin/article.txt')).then(function(pf, ar){
                article = ar;
                profile = JSON.parse(pf || '{}');
                chrome.tabs.query({windowId: windowId}, function(tabs){
                    var url = 'http://web.yixin.im/?type=auto', tabId;
                    tabs.forEach(function(tab, index){
                        if(~tab.url.indexOf('yixin.im/?type=auto')){
                            tabId = tab.id;
                        }
                    });
                    if(tabId){
                        chrome.tabs.update(tabId, {url: url}, function(){});
                    }else{
                        chrome.tabs.create({url: url}, function(){});
                    }
                });
            });
        }
    };
    function read(url){
        var dtd = $.Deferred();
        fileHelper.read(url, {success: function(txt){
            dtd.resolve(txt);
        }});
        return dtd.promise();
    }
    //
    chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse){
        sendResponse({article: article, profile: profile});
    });
});