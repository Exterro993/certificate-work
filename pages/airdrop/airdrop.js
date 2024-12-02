 var swiper = new Swiper(".mySwiper", {
  spaceBetween: 30,
  centeredSlides: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
const logout = () => {
  localStorage.removeItem('currentUser');
  window.location.href = '../registr or auth/registr-auth.html';
};
document.getElementById('logoutButton').addEventListener('click', logout);

// Swiper();
