
var SubmitButton = 'submitButton';
var RadioIds = ['addButtonMD528CH~AC', 'addButtonMD531CH~AC','addButtonMD540CH~AC',
  'addButtonMD543CH~AC'];

function fireChange(el) {
	var event = document.createEvent("HTMLEvents");
	event.initEvent('change', true, false);
	el.dispatchEvent(event);
}

function random() {
    return Math.floor(Math.random()*RadioIds.length);
}

$(function() {
	chrome.extension.onMessage.addListener(function(msg) {
		var id = msg.id, item = Data[id],
			fields = item.fields, selects = item.selects, radios = item.radios;

        for(k in selects) {
            fireChange(($('#' + k).prop('disabled', false).prop('selectedIndex', selects[k]))[0]);
        }
        //Radios
        var radioId =  RadioIds[random()];
	    $(document.getElementById(radioId)).prop('disabled', false).trigger('click');

        setTimeout(function(){
            $("#quantity").prop('selectedIndex', 1);
            fireChange($("#quantity")[0]);
            for (var k in fields) {
                $('#' + k).val(fields[k]);
            }
        }, 1000);

	})
});
