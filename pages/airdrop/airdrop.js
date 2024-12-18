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
  localStorage.removeItem('userData');
  window.location.href = '../registr or auth/registr-auth.html';
};
document.getElementById('logoutButton').addEventListener('click', logout);

// Swiper();
const apiUrl = "http://localhost:5000/users"; // URL API для сохранения данных

// Функция для обработки смены аккаунта
function handleAccountChange(newUserData) {
  const currentUser = JSON.parse(localStorage.getItem("userData"));

  // Если ID пользователя отличается, сбрасываем данные
  if (!currentUser || currentUser.id !== newUserData.id) {
    console.log("Смена аккаунта. Обнуляем данные в localStorage.");
    localStorage.setItem("userData", JSON.stringify(newUserData));
    updateUserCoinsAndEarnings(); // Обновляем интерфейс
  }
}

// Функция для сохранения данных пользователя на сервере
// Функция для сохранения времени выхода пользователя
function saveExitTime() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  userData.lastVisit = Date.now(); // Сохраняем текущее время как время выхода
  localStorage.setItem("userData", JSON.stringify(userData)); // Обновляем данные в localStorage
}

// Функция для подсчета монет за время отсутствия
function calculateOfflineEarnings() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // Получаем время последнего визита и текущее время
  const lastVisitTime = userData.lastVisit || Date.now();
  const currentTime = Date.now();

  // Вычисляем время отсутствия в секундах
  const offlineSeconds = Math.floor((currentTime - lastVisitTime) / 1000);

  // Рассчитываем доход в секунду
  const earningsPerSecond = (userData.earnPerHour || 0) / 3600;

  // Вычисляем заработанные монеты
  const coinsEarned = Math.floor(offlineSeconds * earningsPerSecond);

  // Обновляем баланс монет
  userData.coins = (userData.coins || 0) + coinsEarned;

  // Сохраняем обновленные данные
  userData.lastVisit = currentTime; // Обновляем время последнего визита
  localStorage.setItem("userData", JSON.stringify(userData));
}

// Обработчик перед закрытием окна
window.addEventListener("beforeunload", () => {
  saveExitTime(); // Сохраняем время выхода
});

// Обработчик для входа в систему
function handleUserLogin() {
  calculateOfflineEarnings(); // Начисляем монеты за время отсутствия
  // Дополнительные действия при входе, например, обновление UI
}

// Функция для сохранения времени выхода и расчёта монет за время отсутствия
function handleUserExitAndEarnings() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // Сохраняем текущее время как время выхода
  const lastVisitTime = userData.lastVisit || Date.now();
  const currentTime = Date.now();

  // Вычисляем разницу во времени (в секундах)
  const offlineSeconds = Math.floor((currentTime - lastVisitTime) / 1000);

  // Рассчитываем доход в секунду
  const earningsPerSecond = (userData.earnPerHour || 0) / 3600;

  // Вычисляем заработанные монеты за время отсутствия
  const coinsEarned = Math.floor(offlineSeconds * earningsPerSecond);

  // Обновляем данные пользователя
  userData.coins = (userData.coins || 0) + coinsEarned;
  userData.lastVisit = currentTime; // Обновляем время последнего визита
  localStorage.setItem("userData", JSON.stringify(userData));

  // Показываем пользователю уведомление о заработке
  if (coinsEarned > 0) {
    alert(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`);
  }

  return userData; // Возвращаем обновлённые данные
}

// Добавляем обработчик на закрытие вкладки
window.addEventListener("beforeunload", (event) => {
  const confirmationMessage = "Вы уверены, что хотите выйти? Ваш прогресс будет сохранён.";
  
  // Отображаем системное уведомление (браузерное)
  event.returnValue = confirmationMessage;

  // Показываем пользовательское подтверждение
  const userConfirmed = confirm("Вы уверены, что хотите выйти?");
  if (userConfirmed) {
    handleUserExitAndEarnings(); // Сохранить данные и рассчитать заработок
  } else {
    event.preventDefault(); // Блокируем закрытие вкладки
  }
});
