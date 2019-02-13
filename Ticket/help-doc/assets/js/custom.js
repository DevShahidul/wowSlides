$(document).ready(function(){

	//material contact form
	$('.input-style').find('.form-control').each(function() {
	  var targetItem = $(this).parent();
	  if ($(this).val()) {
		$(targetItem).find('label').css({
		  'top': '10px',
		  'fontSize': '14px'
		});
	  }
	})
	$('.input-style').find('.form-control').focus(function() {
	  $(this).parent('.input-block').addClass('focus');
	  $(this).parent().find('label').animate({
		'top': '10px',
		'fontSize': '14px'
	  }, 300);
	})
	$('.input-style').find('.form-control').blur(function() {
	  if ($(this).val().length == 0) {
		$(this).parent('.input-block').removeClass('focus');
		$(this).parent().find('label').animate({
		  'top': '25px',
		  'fontSize': '14px'
		}, 300);
	  }
	})


	// Sidebar Trigger
	$('.leftmenu-trigger').click(function(){
		if ( $('#leftsidebar').hasClass("triggered-sidebar") ) {   
	      $('#leftsidebar').removeClass("triggered-sidebar");
	      $('.leftmenu-trigger').removeClass("triggered");
	      $('#doc-content').addClass("col-xl-8").removeClass("col-xl-10");
	 	}
	 	else {
	 	  $('#leftsidebar').addClass("triggered-sidebar");
	 	  $('.leftmenu-trigger').addClass("triggered");
	 	  $('.leftmenu-trigger').addClass("triggered");
	 	  $('#doc-content').addClass("col-xl-10").removeClass("col-xl-8");

	 	}
	});

});
