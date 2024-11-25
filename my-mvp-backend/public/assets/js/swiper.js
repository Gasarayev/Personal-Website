var swiper = new Swiper(".mySwiper", {
  slidesPerView: 3,
  spaceBetween: 30,
  loop: true,
  breakpoints: {
    250: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    991: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
  },
  // autoplay: {
  //   delay: 5000,
  // },
});

var swiper = new Swiper(".mySwiperCertificate", {
  slidesPerView: 4,
  spaceBetween: 30,
  loop: true,
  breakpoints: {
    250: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    991: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
  autoplay: {
    delay: 3000,
  },
});


