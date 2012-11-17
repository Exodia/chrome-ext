

var SubmitButton = 'submitButton';

function fireChange(el) {
	var event = document.createEvent("HTMLEvents");
	event.initEvent('change', true, false);
	el.dispatchEvent(event);
}

$(function() {
	chrome.extension.onMessage.addListener(function(msg) {	
		var data = msg.data,
			fields = data.fields, 
		//	selects = item.selects, 
			radios = data.radios;
		for (var k in fields) {
			$('#' + k).val(fields[k]);
		}
		
		for(k in radios){
			$(document.getElementById(k)).prop('disabled', false).trigger('click');
		}
		
		// for(k in selects) {		
			// fireChange(($('#' + k).prop('selectedIndex', selects[k]))[0]);
		// }
	//	$($("#quantity")[0].options[2]).trigger('click')
	})
});
