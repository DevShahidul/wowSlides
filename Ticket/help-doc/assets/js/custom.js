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
	$('#sidebar-toggle').click(function(){
	     $('#sidebar').css('right', '0')
	});
	$('.close-right').click(function(){
	     $('#sidebar').css('right', '-300px')
	});

});
