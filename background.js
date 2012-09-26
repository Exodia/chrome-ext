var DN = window.XX.DesktopNotify;
DN.show('./icon.png',  'Hello!', 'Lorem ipsum...');

chrome.extension.onMessage.addListener(function(detail){
	console.log(detail);
});
