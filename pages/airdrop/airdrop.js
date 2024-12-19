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

// Logout function
const logout = () => {
  localStorage.removeItem('userData');
  window.location.href = '../registr or auth/registr-auth.html';
};
document.getElementById('logoutButton').addEventListener('click', logout);

const apiUrl = "http://localhost:5000/users"; // URL API для сохранения данных

// Функция для создания и отображения модалки
function showModal(message, callback) {
  const existingModal = document.getElementById("customModal");
  if (existingModal) existingModal.remove();

  const modal = document.createElement("div");
  modal.id = "customModal";
  modal.style.cssText = `
    display: flex;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 300px;
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    flex-direction: column;
    align-items: center;
    z-index: 1000;
  `;

  const text = document.createElement("p");
  text.style.cssText = "margin-bottom: 20px; text-align: center; font-size: 16px;";
  text.textContent = message;

  const closeButton = document.createElement("button");
  closeButton.textContent = "OK";
  closeButton.style.cssText = `
    padding: 10px 15px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  `;
  closeButton.addEventListener("click", () => {
    anime({
      targets: modal,
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 300,
      easing: "easeInCubic",
      complete: () => {
        modal.remove();
        if (callback) callback();
      },
    });
  });

  modal.appendChild(text);
  modal.appendChild(closeButton);
  document.body.appendChild(modal);

  anime({
    targets: modal,
    opacity: [0, 1],
    scale: [0.8, 1],
    duration: 300,
    easing: "easeOutCubic",
  });
}

// Функция для сохранения времени выхода
function saveExitTime() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  userData.lastVisit = Date.now();
  localStorage.setItem("userData", JSON.stringify(userData));
}

// Функция для расчёта заработка
function handleUserExitAndEarnings() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  const lastVisitTime = userData.lastVisit || Date.now();
  const currentTime = Date.now();

  const offlineSeconds = Math.floor((currentTime - lastVisitTime) / 1000);
  const earningsPerSecond = (userData.earnPerHour || 0) / 3600;
  const coinsEarned = Math.floor(offlineSeconds * earningsPerSecond);

  userData.coins = (userData.coins || 0) + coinsEarned;
  userData.lastVisit = currentTime;
  localStorage.setItem("userData", JSON.stringify(userData));

  if (coinsEarned > 0) {
    showModal(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`);
  }

  return userData;
}

// Обработчик закрытия окна
window.addEventListener("beforeunload", (event) => {
  const confirmationMessage = "Вы уверены, что хотите выйти? Ваш прогресс будет сохранён.";

  showModal(confirmationMessage, () => {
    saveExitTime();
    handleUserExitAndEarnings();
  });

  event.returnValue = "";
  return ""; // Для совместимости
});
