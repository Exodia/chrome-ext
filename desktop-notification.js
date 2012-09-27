void function() {
	var DN = window.XX.DesktopNotify;

	function createMsg() {
		return {
			time : timeEl.value * 60 * 1000,
			duration : durEl.value * 60 * 1000,
			value : msgEl.value
		}
	}

	if (!DN.isSupport()) {
		alert('浏览器不支持桌面通知！');
		return;
	}

	var startEl = document.getElementById('start'), 
		stopEl = document.getElementById('stop'), 
		timeEl = document.getElementById('time'), 
		msgEl = document.getElementById('msg'), 
		durEl = document.getElementById('duration');

	startEl.addEventListener('click', function(evt) {
		startEl.disabled = true;
		chrome.extension.sendMessage(createMsg());
	}, false);

	stopEl.addEventListener('click', function(evt) {
		chrome.extension.sendMessage({stop:1});
		startEl.disabled = false;
	}, false);
}();
