 // IDENTIFY THE USE OF CORDOVA OR NOT
 var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
 
 // CALL SAME FUNCTION REGARDLESS
 if(isCordovaApp) {
	console.log('Is Cordova App');
 	document.addEventListener("deviceready", onDeviceReady, false);
	
 } else {
	console.log('Is Web App');
	document.addEventListener('DOMContentLoaded', onDeviceReady, false);
 }

function onDeviceReady () {
	(function($){
	  $('.secureHide').hide();
	  $(function(){
		  if(isCordovaApp) {
			var deviceID = device.uuid;
			  
			  	// Check SSL pinning
                sslHTTP.enableSSLPinning(true, function() {
                    console.log('SSL PINNED');
                }, function() {
                    console.log('SSL NOT PINNED');
                });
			  
		  } else {
			var deviceID = '';
		  }
		
		
		// Initializes all materialize components with default options
		M.AutoInit();
		
		// Initiate app and routing functions
		app.init();
		    
	

		// Hide footer when onscreen keyboard is activated so it doesn't screw up the view.
		$('input').focus(function() {
		   $('footer').addClass('hide-footer');
		});
		
		$('input').focusout(function() {
		   $('footer').removeClass('hide-footer');
		});
	
		// HIDE PROGRESS BAR
		$('.progress').hide();
	
		$('.carousel.carousel-slider').carousel({
			fullWidth: true,
			indicators: true
		});
	
	  }); // end of document ready
	
	})(jQuery); // end of jQuery name space
}