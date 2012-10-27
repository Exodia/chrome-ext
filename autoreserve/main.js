var Data = {
	'35042419880107003x' : {
		fields : {
			"firstname" : '欣欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}
	},
	'35042419880107004x' : {
		fields : {
			"firstname" : '欣6欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}
	},
	'35042419880107005x' : {
		fields : {
			"firstname" : '欣5欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}

	},
	'35042419880107006x' : {
		fields : {
			"firstname" : '欣4欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}

	},
	'35042419880107007x' : {
		fields : {
			"firstname" : '欣2欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}

	},
	'35042419880107008x' : {
		fields : {			
			"firstname" : '欣1欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}

	},
	'35042419880107009x' : {
		fields : {			
			"firstname" : '欣3欣',
			"lastname" : '邓',
			"email" : 'd_xinxin@163.com',
			"govid" : '35042419880107003x'
		},
		selects:{
			"store": 6,
			"quantity" : 5
		},
		radios:{
			"addButtonMD198CH~AC" : true
		}
	},
}

var SubmitButton = 'submitButton';

function fireChange(el) {
	var event = document.createEvent("HTMLEvents");
	event.initEvent('change', true, false);
	el.dispatchEvent(event);
}

$(function() {
	chrome.extension.onMessage.addListener(function(msg) {
		var id = msg.id, item = Data[id],
			fields = item.fields, selects = item.selects, radios = item.radios;
		for (var k in fields) {
			$('#' + k).val(fields[k]);
		}
		
		for(k in radios){
			$(document.getElementById(k)).prop('disabled', false).trigger('click');
		}
		
		for(k in selects) {		
			fireChange(($('#' + k).prop('selectedIndex', selects[k]))[0]);
		}
		$($("#quantity")[0].options[2]).trigger('click')
	})
});
