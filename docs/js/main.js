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

	// Нажатие на навигационный тоггл
	$("#nav-toggle").on("click", function() {
		$(this).toggleClass("nav-toggle--active"); // Тоггл меняется на крестик
		$(this).toggleClass("fixed"); // Фиксируем тоггл
		$("#background").toggleClass("background--active"); // Затемняем фон
		$("#mobile-nav").toggleClass("mobile-nav--visible"); // Выдвигаем боковое меню
	});

	// Убираем боковое меню при клике за его пределами
	$("#background").on("click", function() {
		$("#mobile-nav").removeClass("mobile-nav--visible");
		$("#nav-toggle").removeClass("nav-toggle--active");
		$("#nav-toggle").removeClass("fixed");
		$("#background").removeClass("background--active");
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
	function ajaxFormSumbit() {
		let string = $(".contacts-form").serialize();

		$.ajax({
			type: "POST",
			url: "php/mail.php",
			data: string,
			success: function(html) {
				$(".contacts-form").slideUp(800);
				$("#answer").html(html);
			}
		});
		return false;
	}
});