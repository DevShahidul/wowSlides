
$('#sidebar-left').click(function(){
	 if($('.dashboard-menu-wrapper').hasClass('slide')){
		 $('.dashboard-menu-wrapper').removeClass('slide');
	 }else{
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
