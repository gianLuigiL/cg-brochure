var $ = require("jquery");

(function init(){
	'use strict';

	//Set the height of the main elements to a screen
	$('main').height(window.innerHeight);
	
	//Is mobile?
	const mobile = window.innerWidth < 1050;
	//If it's mobile move the menu after the header for side navigation
	const $nav = $('nav', 'header');
	
	$('.navico', 'header').click(function(){
		if($nav.hasClass('closed')){
			$nav.removeClass('closed');
			$(this).addClass('active');
		} else {
			$nav.addClass('closed');
			$(this).removeClass('active');
		}
	});
	
	//Set the height of the modal background to the whole document
	const $divModal = $('div.modal').height($('body').height());
	//Handles a click on the X closing button
	$divModal.on('click', 'img.close',function(){
		$divModal.fadeOut().html('');
		$('li', $nav).removeClass('active');
		$('body').css({overflow: 'auto'});
	});	
	//Also you can close the modal clicking anywhere the modal frame is not covering
	$divModal.on('click',function(event){
		if($(event.target).hasClass('modal')){
			$('img.close').click();
		}
	});

	//When click on the "contact" button load the HTML of the modal from the URL
	$('.button-contact').click(function(event){
		//Freeze scrolling while the modal is on
		$("body").css({overflow: 'hidden'});
		//Prevent the button from laoding a new page
		event.preventDefault();
		//Load the HTML into the modal overlay
		$divModal.load('./modal/contact.html',function(){
		//Declare a utility function
		function filterInput(element){
			//Get the name of the element being worked on
			const $name = element.attr('name');
			let allowed, notAllowed, actualValue, allowedValue;
			//Set allowed and not-allowed values to filter the input string
			switch($name){
				case 'name':
					allowed = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-!?() "];
					actualValue = [...element.val()];
					allowedValue = actualValue.filter(function(el){
						return allowed.includes(el);
					});
					element.val(allowedValue.join(""));
					break;
				case 'email':
					notAllowed = [..."\"\'\\<>; "];
					actualValue = [...element.val()];
					allowedValue = actualValue.filter(function(el){
						return !notAllowed.includes(el);
					});
					element.val(allowedValue.join(""));
					break;
				case 'phone':
					allowed = [..."0123456789"];
					actualValue = [...element.val()];
					allowedValue = actualValue.filter(function(el){
						return allowed.includes(el);
					});
					element.val(allowedValue.join(""));
					break;
				case 'message':
					allowed = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz.-!?() £$%&/=?!é*+òù,;:-_#@0123456789"];
					actualValue = [...element.val()];
					allowedValue = actualValue.filter(function(el){
						return allowed.includes(el);
					});
					element.val(allowedValue.join(""));
					break;
			}
		}
		$('form', $divModal).on('input', function(event){
			const $element = $(event.target);
			filterInput($element);
		});
		$('form', $divModal).on('submit', function(event){
			event.preventDefault();
			$.post("./util/mailer.php", $(this).serialize(), function(data){
				$('form').children().hide();
				const $data = $(data).css('display', 'none');
				$('form').html(data);
				$data.show();
			}, "html");
		});
		}).fadeIn();

	});
	//When click on the "info" button load the HTML of the modal from the URL
	$('.button-info').click(function(event){
		//Freeze scrolling while the modal is visible
		$("body").css({overflow: 'hidden'});
		event.preventDefault();
		$divModal.load('./modal/info.html').fadeIn();
	});
	//Edge has a bug related to the smooth scroll animation so this will prevent it from
	//Running the smooth animation and will just go to the point
	$('a[href*="#"]', '#services').click(function(event){
		if(!navigator.userAgent.match("Edge")){
			event.preventDefault();
		}
		//Get the href of the button in the services menu which is similar to "#TARGET"
		const target = $(this).attr('href');
		//Get the target element
		const $target = $(target);
		//Only if the click has worked alright
		if($target.length === 1){
			//Get the position in RESPECT TO THE DOCUMENT of the trget element
			const offset = $(target).offset();
			//Smoothly scroll to the target
			window.scrollTo({top: parseInt(offset.top), behavior: 'smooth'});
		}
	});
	
	//Click handler for the "shooting" button
	$('a[href*="#"]', '#galleries').click(function(event){
		$('body').css({overflow: 'hidden'});
		//Get the frame of the gallery to be shown
		$.get('./galleries/gallery-frame.html',function(data){
			//Inject it into the modal outer overlay
			$divModal.html(data);
			//After two seconds if the page has not loaded the images
			setTimeout(function(){
				//This is one of the front pieces when loading, if the background hasn't completed reload
				if($('div#piece4').css('background-image') === 'none'){
					$('img.close').click();
					event.target.click();
				}
			},2000);
			//The content needs to be interpreted as html
		}, null, "html");

		//Get the href of the button in the shooting menu which is similar to "#TARGET" and remove the #
		const href = $(this).attr('href').substr(1);
		//Construct the url for the html containing the photos
		$.get('./galleries/' + href + "/" + href + ".html", function(data){
			//Add the class sliderFrame in order to work with the slider
			const $images = $(data).addClass('sliderFrame');
			//Get the frame of the slider
			const $frame = $('div#frame');
			//Set the height proportional to the width
			$frame.height(Math.round($('div#frame').width() / 1.333) + 'px');
			//Get the 4 pieces that make the animation
			let $pieces = $('div[id*=piece]');
			//Retieve the speed the transition needs to have from the CSS value
			const speed = parseFloat($pieces.eq(0).css('transitionDuration')) * 1000;
			//Create an array with the SRCs of the images
			const $photos = $images.map(function(){
				return $(this).attr('src');
			});
			//The current photo being displayed
			let actual = 0;
			//The piece 3 and 4 (indexed 2 and 3) are the front ones
			//Set their background to the first photo in the gallery
			$pieces.eq(2).css('background-image', 'url('+$photos[ actual ]+')' );
			$pieces.eq(3).css('background-image', 'url('+$photos[ actual ]+')' );
			//Extended is an event that fires whenever the piece of the photo reaches it's maximum distance
			//From the centre
			$pieces.on('extended', function(){
				//Bring the piece back to the centre
				$(this).css('left', '0%');
				//Based on the id of the piece, the other piece which is in the same 
				//position as this needs to be brought to the front
				switch($(this).prop('id')){
					case 'piece1':
						$pieces.eq(2).css('z-index', +$(this).css('z-index') + 1);
						break;
					case 'piece2':
						$pieces.eq(3).css('z-index', +$(this).css('z-index') + 1);
						break;
					case 'piece3':
						$pieces.eq(0).css('z-index', +$(this).css('z-index') + 1);
						break;
					case 'piece4':
						$pieces.eq(1).css('z-index', +$(this).css('z-index') + 1);
						break;
				 }
			});
	
	$('div#previousFrame, div#nextFrame').click(function(){
		//Based on the id of the control pressed modify the actual photo that is going to be shown
		const thisId  = $(this).prop('id');
		if(thisId === 'previousFrame') {
			actual--;
			//If it's the first photo set it back to the last
			if(actual === -1){
				actual = $photos.length - 1;
			}
		} else {
			//Otherwise start from the beginning
			actual = (++actual) % $photos.length;
		}
				
		//Get the z-index of the elements with the highest z-index (the front pieces)
		const maxIndex = Math.max.apply(null, $pieces.map(function(){
			return $(this).css('z-index');
		}));
		//Return the two that are at the front
		const $front = $pieces.filter(function(){
			if(+$(this).css('z-index') === maxIndex){
				return true;
			}
		});
		
		//Whenever the controls are pressed set the pieces that are behind 
		//to the actual photo that needs to be displayed
		$pieces.not($front).css('background-image', 'url(' + $photos[ actual ] + ')');
		//Set one of the two pieces to be moved aside
		$front.eq(0).css('left', '-100%');
		//When the animation is completed put it back in the centre but behind the front-facind piece
		setTimeout(function(){
			$front.eq(0).trigger('extended');
		}, speed );
		//Set one of the two pieces to be moved aside
		$front.eq(1).css('left', '+100%');
		//When the animation is completed put it back in the centre but behind the front-facind piece
		setTimeout(function(){
			$front.eq(1).trigger('extended');
		}, speed );
	});
			
		//the response needs to be interpreted as HTML
		}, null, "html");
		//Display the modal overlay with the content
		$divModal.fadeIn();
	});
})();