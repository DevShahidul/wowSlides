$(window).load(function(){


    		// mobile menu
    		var button = $('.mobile-nav .menu-bar'),
    			  page = $('.allPage');


    		button.click(function(){
    			page.toggleClass("active");
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
        $(this).toggleClass("active");
            return false;
     	});



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

        $("*").click(function(e){
          if( !$(e.target).is( $(".catSearch") ) && !$(e.target).is( $(".catSearch *") ) ){
              $(this).find(".searchBox.categoryItem").removeClass("active");
          }
        });


        // close
        $(".close-button").on("click",function(){
          var Closetarget = $(this).attr("data-target");
          $(Closetarget).fadeOut(500);
          return false
        });


        // profile buttons
        $(".toggleButton.profileButton").click(function(){
            $(this).parent().find(".listDetail").toggleClass("active");
        });





});


// loader
$(window).load(function(){
	$('#loader').fadeOut(400);
});
