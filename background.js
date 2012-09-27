void function() {
	var TITLE = '尿歇时间到啦~~！亲！！', 
		ICONURL = 'icon.png', 
		DN = window.XX.DesktopNotify,
		handler = null;
	
	function showDialog(icon, title, value, duration) {
		console.log(new Date());
		DN.show(icon, title, value);
		console.log(icon, title, value)
		setTimeout(function() {
			DN.hide();
		}, duration);
	}

	chrome.extension.onMessage.addListener(function(msg) {
		if(msg.stop) {
			handler && clearInterval(handler);
			return;
		}
		
		DN.requestPermission(function(){
			handler = setInterval(showDialog, msg.time, ICONURL, TITLE, msg.value, msg.duration);
		});
	});
}();

