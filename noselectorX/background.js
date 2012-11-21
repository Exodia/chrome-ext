void function(){
    var Status = 'stop';

    function sendCommand(cmd) {
        chrome.tabs.query({
            windowId: chrome.windows.WINDOW_ID_CURRENT
        }, function(tabs){
            for(var i = tabs.length - 1; i > -1; --i) {
                chrome.tabs.sendMessage(tabs[i].id, cmd);
            }
        });
    }

    chrome.extension.onMessage.addListener(function(status){
        if(status !== 'loaded'){
            return;
        }

        if( Status === 'start'){
            sendCommand(Status);
        }
    });

    chrome.extension.onMessage.addListener(function(status){
        if(status !== 'loaded'){
            return;
        }

        chrome.extension.onMessage.removeListener(arguments.callee);
        chrome.browserAction.onClicked.addListener(function(tab){
            if(Status === 'stop'){
                Status = 'start';
                chrome.browserAction.setIcon({
                    path:"images/start.png"
                });
                chrome.browserAction.setTitle({
                    title:'停止捕获'
                });
            } else {
                Status = 'stop';
                chrome.browserAction.setIcon({
                    path:"images/stop.png"
                });
                chrome.browserAction.setTitle({
                    title:'开始捕获'
                });
            }

            sendCommand(Status);
        });
    });
}();