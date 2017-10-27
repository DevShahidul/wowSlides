
$('#sidebar-left').click(function(){
	 if($('.dashboard-content').hasClass('show')){
		 $('.dashboard-content').removeClass('show');
		 $('.dashboard-menu-wrapper').removeClass('slide');
	 }else{
		 $('.dashboard-content').addClass('show');
		 $('.dashboard-menu-wrapper').addClass('slide');
	 }
 })
