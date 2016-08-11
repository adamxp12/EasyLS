$(document).foundation();
$('#amazoncode').hide();
$('#smartlinkcontent').hide();
$('#device').hide();
$('#referal').hide();

$('#linktype').on('change', function () {
	console.log(this.value);

    switch (this.value) {
        case 'generic':
        console.log('why');
            $('#amazoncode').hide();
            $('#amazoncodeinput').prop('required',false);
            break;

        case 'amazon':
            $('#amazoncode').show();
            $('#amazoncodeinput').prop('required',true);
            $('#amazoncode').focus();
            break;

        case 'youtube':
            $('#amazoncode').hide();
            $('#amazoncodeinput').prop('required',false);
            break;
    }

});

$('#smartlinkcheckbox').on('change', function() {
	if(this.checked) {
    	$('#smartlinkcontent').show();
    	$('#smartlinktype').prop('required',true);
	} else {
    	$('#smartlinkcontent').hide();
    	$('#smartlinktype').prop('required',false);
	}

});

$('#smartlinktype').on('change', function() {

	switch (this.value) {
        case 'country':
        	$('#country').show();
            $('#device').hide();
    		$('#referal').hide();
            break;

        case 'device':
            $('#country').hide();
            $('#device').show();
    		$('#referal').hide();
            break;

        case 'referal':
            $('#country').hide();
            $('#device').hide();
    		$('#referal').show();
            break;
    }

});
