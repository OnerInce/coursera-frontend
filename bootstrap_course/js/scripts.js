$(document).ready(function(){
	$('#mycaro').carousel({ interval : 2000 });
	$('#carouselButton').click(function() {
		if ($('#carouselButton').children('span').hasClass('fa-pause')){
			$('#mycaro').carousel('pause');
			$('#carouselButton').children('span').removeClass('fa-pause');
			$('#carouselButton').children('span').addClass('fa-play');
		}
		else{
			$('#mycaro').carousel('cycle');
			$('#carouselButton').children('span').removeClass('fa-play');
			$('#carouselButton').children('span').addClass('fa-pause');
		}               
	});

	$('#reserveButton').click(function() {
		$('#reserve-modal').modal('toggle');

	});

	$('#loginButton').click(function() {
		$('#loginModal').modal('toggle');

	});
});