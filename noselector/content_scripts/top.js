/**
 * Created with JetBrains WebStorm.
 * User: tafeng.dxx
 * Date: 12-11-10
 * Time: 下午4:18
 * To change this template use File | Settings | File Templates.
 */
var isTop = true;

void function($){
    var INTERVAL = 1000,
        URL = "http://127.0.0.1:8190";
        xhr = new XMLHttpRequest();
        xhr.onload = function(xhr) {
            if(xhr.responseText) {
                window.postMessage( {
                    type:'NoSelector',
                    cmd:'verify',
                    selector: xhr.responseText
                }, '*');
            }
        };

    window.XX = window.XX || {};
    XX.AutoAjax = {
        send: function(){
            xhr.open('POST', URL, true);
            xhr.send('check');
        },
        start: function() {
          this.timer = setInterval(this.send, INTERVAL);
        },
        stop: function() {
            clearInterval(this.timer);
        }
    };

}(jQuery);