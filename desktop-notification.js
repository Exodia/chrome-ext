void function() {
	var TITLE = '时间到啦~~！亲！！',
		ICONURL = 'icon.png';
	
	var DN = window.XX.DesktopNotify;
	
	function notify(icon, title, value, duration) {
		DN.show(icon, title, value);
		setTimeout(function() {
			DN.hide();
		}, duration);
	}
	
	if(!DN.isSupport()) {
		alert('浏览器不支持桌面通知！');
		return;
	}
	
	var startEl = document.getElementById('start'),
		stopEl = document.getElementById('stop'),
		timeEl = document.getElementById('time'),
		msgEl = document.getElementById('msg'),
		durEl = document.getElementById('duration'),
		handler = null;
	
	startEl.addEventListener('click', function(evt) {
		DN.requestPermission(function() {
			handler = setInterval(notify, timeEl.value * 60 * 1000, ICONURL, TITLE, msgEl.value, durEl.value*60*1000);
			startEl.disabled = true;
			chrome.extension.sendMessage({data:"hello world!"});
		});
	}, false);
	
	stopEl.addEventListener('click', function(evt) {
		clearInterval(handler);
		startEl.disabled = false;
	}, false);
}();
