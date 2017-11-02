
$('#sidebar-left').click(function(){
	 if($('.dashboard-content').hasClass('show')){
		 $('.dashboard-content').removeClass('show');
		 $('.dashboard-menu-wrapper').removeClass('slide');
	 }else{
		 $('.dashboard-content').addClass('show');
		 $('.dashboard-menu-wrapper').addClass('slide');
	 }
 })

function sidebarControl() {
	if($( window ).width() < 768) {
			$('.dashboard-menu-wrapper').removeClass('small-dashboard');
	}
	else {
		 $('.dashboard-menu-wrapper').addClass('small-dashboard');
	}
}

 $( window ).resize(function() {
	 sidebarControl();
 });

 $( document ).ready(function() {
	sidebarControl();
 });
