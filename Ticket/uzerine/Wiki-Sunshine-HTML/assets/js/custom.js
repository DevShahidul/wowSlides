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

	$('.menu-trigger').click(function() {
		$("#rightSidebar").toggleClass("active");
	})
	$('.close-right').click(function() {
		if($('#rightSidebar').find('active')) {
			$("#rightSidebar").removeClass("active");
		}
	})

	$('.left-menu').click(function() {
		$("#leftSidebar").toggleClass("active");
	})
	$('.close-left').click(function() {
		if($('#leftSidebar').find('active')) {
			$("#leftSidebar").removeClass("active");
		}
	})


	$('.search-icon').click(function() {
		$(".animation-search").toggleClass("d-block");
		$('.animation-search').focus();
	})

});
