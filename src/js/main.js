$(document).ready(function() {
	// AOS
	AOS.init({
		disable: function() {
			var maxWidth = 767;
			return window.innerWidth < maxWidth;
		}
	});

	// Nav dots (right side)
	$("#page-nav").onePageNav({
		currentClass: "active",
		changeHash: false,
		scrollSpeed: 100,
		scrollThreshold: 0.5,
		filter: "",
		easing: "swing",
		begin: function() {},
		end: function() {},
		scrollChange: function($currentListItem) {}
	});

	// Mobile nav
	$("#nav-toggle").on("click", function() {
		$(this).toggleClass("nav-toggle--active");
		$(this).toggleClass("fixed");
		$("#background").toggleClass("background--active");
		$("#mobile-nav").toggleClass("mobile-nav--visible");
	});

	$("#background").on("click", function() {
		$("#mobile-nav").removeClass("mobile-nav--visible");
		$("#nav-toggle").removeClass("nav-toggle--active");
		$("#nav-toggle").removeClass("fixed");
		$("#background").removeClass("background--active");
	});

	$(window).on("resize", function() {
		var win = $(this);
		if (win.height() > 768) {
			$("#mobile-nav").removeClass("mobile-nav--visible");
			$("#nav-toggle").removeClass("nav-toggle--active");
			$("#nav-toggle").removeClass("fixed");
			$("#background").removeClass("background--active");
		}
	});

	// Fake placeholder
	const formRows = document.querySelectorAll(".contacts-form__label");
	const formRowsInputs = document.querySelectorAll(".contacts-form__input");

	for (let i = 0; i < formRowsInputs.length; i++) {
		formRowsInputs[i].addEventListener("focus", function() {
			const thisParent = this.parentElement;
			thisParent.querySelector("span").classList.add("fake-placeholder--active");
		});
	}
	for (let i = 0; i < formRowsInputs.length; i++) {
		formRowsInputs[i].addEventListener("blur", function() {
			const thisParent = this.parentElement;
			if (this.value == "") {
				thisParent.querySelector("span").classList.remove("fake-placeholder--active");
			}
		});
	}

	// Form validation
	$("#contacts-form").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			theme: {
				required: true
			},
			message: {
				required: true
			}
		},
		messages: {
			email: {
				required: "Введите ваш email",
				email: "Отсутствует символ @"
			},
			theme: {
				required: "Введите тему сообщения"
			},
			message: {
				required: "Введите текст сообщения"
			}
		},
		submitHandler: function(form) {
			ajaxFormSubmit();
		}
	});

	// AJAX
	function ajaxFormSubmit() {
		let string = $("#contacts-form").serialize();

		$.ajax({
			type: "POST",
			url: "php/mail.php",
			data: string,
			success: function(html) {
				$("#contacts-form label").slideUp(800);
				$("#answer").html(html);
			}
		});
		return false;
	}
});
