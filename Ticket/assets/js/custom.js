$("#inpt_search").on('focus', function () {
	$(this).parent('label').addClass('active');
});

$("#inpt_search").on('blur', function () {
	if($(this).val().length == 0)
		$(this).parent('label').removeClass('active');
});


$('#sidebar-left').click(function(){
	 if($('.dashboard-content').hasClass('show')){
		 $('.dashboard-content').removeClass('show');
		 $('.dashboard-menu-wrapper').removeClass('slide');
	 }else{
		 $('.dashboard-content').addClass('show');
		 $('.dashboard-menu-wrapper').addClass('slide');
	 }
 })
