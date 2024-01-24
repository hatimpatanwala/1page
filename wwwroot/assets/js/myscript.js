$(document).ready(function () {

	//Navbar Toggle
	$('.navbar-toggle').click(function () {
		// alert('');
		$(this).toggleClass('cross');
		$('.menus').slideToggle(300);
	});

	$('.hover-menu span').click(function () {
		$('.dropdown-toggle1').slideToggle(300);
		$(this).parent().parent().toggleClass('add-active');
	})



});