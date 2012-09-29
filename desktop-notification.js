void function() {
	var DN = window.XX.DesktopNotify;

	function createMsg() {
		return {
			interval : +intervalEl.value,
			duration : +durEl.value,
			content : contentEl.value
		}
	}

	function init() {
		var config =  chrome.extension.getBackgroundPage().TimeNotifyConfig;
		config.status == "start" && (startEl.disabled = true);
		config.status == "stop" && (stopEl.disabled = true);
		intervalEl.value = config.interval;
		contentEl.value = config.content;
		durEl.value = config.duration;
		
	}

	if (!DN.isSupport()) {
		alert('浏览器不支持桌面通知！');
		return;
	}

	var startEl = document.getElementById('start'), 
		stopEl = document.getElementById('stop'), 
		intervalEl = document.getElementById('interval'), 
		contentEl = document.getElementById('content'), 
		durEl = document.getElementById('duration');

	startEl.addEventListener('click', function(evt) {
		chrome.extension.sendMessage(createMsg());
		window.close();
	}, false);

	stopEl.addEventListener('click', function(evt) {
		startEl.disabled = false;
		stopEl.disabled = true;
		chrome.extension.sendMessage({stop:1});
	}, false);
	
	window.addEventListener('load', init, false);
}();
