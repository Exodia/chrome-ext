void function() {
	var TITLE = '尿歇时间到啦~~！亲！！', ICONURL = 'icon.png', DN = window.XX.DesktopNotify;
	window.TimeNotifyConfig = {
		status : 'stop',
		timer : null,
		content : '你已经做了很久啦，让眼睛放松放松吧~~！',
		duration : 1,
		interval : 60
	};

	function config(key, val) {
		var tn = window.TimeNotifyConfig;

		if ( typeof key == 'string') {
			if ( typeof val != 'undefined') {
				tn[key] = val;
				return tn;
			}

			return tn[key];
		}

		if ( typeof key == 'object') {
			for (k in key) {
				tn[k] = key[k];
			}
		}

		return tn;
	}

	function showDialog(icon, title, content, duration) {
		DN.show(icon, title, content);
		setTimeout(function() {
			DN.hide();
		}, duration);
	}


	chrome.extension.onMessage.addListener(function(msg) {
		var conf;
		if (msg.stop) {
			return clearInterval(config('status', 'stop').timer);
		}

		DN.requestPermission(function() {
			conf = config(msg);
			config('timer', setInterval(showDialog, msg.interval*60*1000, ICONURL, TITLE, msg.content, msg.duration*60*1000));
			config('status', 'start');
		});
	});
}();

