$(window).load(function(){


    		// mobile menu
    		var button = $('.mobile-nav .menu-bar'),
    			page = $('.allPage'),
    			close = $('.close-menu img');


    		button.click(function(){
    			page.addClass("active");
    		});

    		close.click(function(){
    			page.removeClass("active");
    		});


    		// video section
    		$('#video-section').hide();
    		$('a.action.watch').click(function(){
    			$('#video-section').fadeIn();
    			$('#video-section video').trigger('play');
    			return false;
    		});

    		$('#video-section .close').click(function(){
    			$('#video-section').fadeOut();
    			$('#video-section video').trigger('pause');
    			return false;
    		});


    		$('select').niceSelect();


    		// Dropzone
    		// $(".dropzone").dropzone({ url: "/file/post" });



     	$('.fullscreen').click(function(){
     		$('.imageBig').toggleClass("col-md-9");
     		$('.imageBig').css("margin-bottom","20px");
     	});


     	// contact
     	$('.contactForm').hide();
     	$('section.contact a.action').on("click",function(){
     		$('.contactForm').slideToggle(500);
            return false;
     	});

     	// search
     	$('.searchButton').click(function(){
     		$('#search').addClass("active");
            return false;
     	});
     	$('.closeSearch').click(function(){
     		$('#search').removeClass("active");
            return false;
     	})

      // triggers
      var trigger = $(".toggleButton");

        trigger.click(function(){
          $(".popUpItem").removeClass("active");
          var target = $(this).attr("data-target");
          trigger.removeClass("active");
          $(this).toggleClass("active");
          $(target).addClass("active");
          return false;
        });

        $("*").click(function(e){
          if( !$(e.target).is( trigger.parent() ) && !$(e.target).is( trigger.parent().find("*") ) ){
              $(".popUpItem").removeClass("active");
              trigger.removeClass("active");
          }
        });






});


// loader
$(window).load(function(){
	$('#loader').fadeOut(400);
});
