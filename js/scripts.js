$(function () {
  "use strict";

  var wind = $(window);

  
  $.scrollIt({
    upKey: 38,
    downKey: 40, 
    easing: "swing",
    scrollTime: 600, 
    activeClass: "active", 
    onPageChange: null, 
    topOffset: -80, 
  });


  wind.on("scroll", function () {
    var bodyScroll = wind.scrollTop(),
      navbar = $(".navbar");

    if (bodyScroll > 100) {
      navbar.addClass("nav-scroll");
    } else {
      navbar.removeClass("nav-scroll");
    }
  });


  wind.on("scroll", function () {
    var bodyScroll = wind.scrollTop(),
      navLight = $(".nav-light"),
      logo = $(".nav-light .logo> img");

    if (bodyScroll > 100) {
      navLight.addClass("nav-scroll");
      logo.attr("src", "img/logo-dark.png");
    } else {
      navLight.removeClass("nav-scroll");
      logo.attr("src", "img/logo-light.png");
    }
  });


  $(".navbar-nav a").on("click", function () {
    $(".navbar-collapse").removeClass("show");
  });


  wind.on("scroll", function () {
    $(".skill-progress .progres").each(function () {
      var bottom_of_object = $(this).offset().top + $(this).outerHeight();
      var bottom_of_window = $(window).scrollTop() + $(window).height();
      var myVal = $(this).attr("data-value");
      if (bottom_of_window > bottom_of_object) {
        $(this).css({
          width: myVal,
        });
      }
    });
  });


  var pageSection = $(".bg-img, section");
  pageSection.each(function (indx) {
    if ($(this).attr("data-background")) {
      $(this).css(
        "background-image",
        "url(" + $(this).data("background") + ")"
      );
    }
  });
});



$(window).on("load", function () {
  var wind = $(window);


  $(".loading").fadeOut(500);
});
