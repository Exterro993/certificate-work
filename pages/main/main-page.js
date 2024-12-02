document.addEventListener("DOMContentLoaded", async () => {
  const userNameDiv = document.getElementById("user-name");
  const exchangeIconDiv = document.querySelector(".exchange-icon");

  // Получение пользователя из localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    alert("Вы не авторизованы!");
    window.location.href = "";
    return;
  }

  // Обновляем имя пользователя
  userNameDiv.textContent = currentUser.login;

  // Карта бирж и их иконок
  const exchangeIcons = {
    binance: "../../images/main/stock__exchage icons/binance.svg",
    okx: "../../images/main/stock__exchage icons/okx.svg",
    cryptoCom: "../../images/main/stock__exchage icons/crypto-com.png",
    bybit: "../../images/main/stock__exchage icons/bybit-seeklogo.svg",
    bingx: "../../images/main/stock__exchage icons/bingx.svg",
    htx: "../../images/main/stock__exchage icons/HTX-01.svg",
    kucoin: "../../images/main/stock__exchage icons/kucoin.png",
    gateIo: "../../images/main/stock__exchage icons/gateio.svg",
  };

  // Получаем URL иконки биржи
  if (exchangeIcons[currentUser.exchange]) {
    exchangeIconDiv.innerHTML = `

        <img src="${
          exchangeIcons[currentUser.exchange]
        }" alt="logo"> <p>${currentUser.exchange.toLocaleUpperCase()}</p>

    `;
  } else {
    // Если иконка не найдена
    exchangeIconDiv.textContent = "Иконка биржи не найдена";
  }
});











const coinsDisplay = document.getElementById('coinsDisplay');
const earnPerHourDisplay = document.getElementById('earnPerHourDisplay');
const energyDisplay = document.getElementById('energyDisplay');
const clickButton = document.getElementById('clickButton');

// Получаем текущего пользователя из localStorage
const currentUser = JSON.parse(localStorage.getItem('currentUser'));
if (!currentUser || !currentUser.id) {
  alert('Пользователь не найден. Пожалуйста, войдите в систему.');
  window.location.href = '/login.html'; // Перенаправляем на страницу входа
}

// Загружаем данные о пользователе из localStorage
let userData = JSON.parse(localStorage.getItem('userData')) || {
  coins: 0,
  energy: 10000,
  earnPerHour: 0,
  lastUpdate: Date.now(),
  lastVisitTime: Date.now() // Время последнего посещения
};

// Функция для обновления отображения данных
function updateStats() {
  coinsDisplay.textContent = `Монеты: ${userData.coins}`;
  earnPerHourDisplay.textContent = `Заработок в час: ${userData.earnPerHour}`;
  energyDisplay.textContent = `Энергия: ${userData.energy}`;
}

// Сохранение данных пользователя в localStorage
function saveUserDataToLocal() {
  localStorage.setItem('userData', JSON.stringify(userData));
}

// Рассчитываем восстановление энергии
function restoreEnergy() {
  const currentTime = Date.now();
  const timeDifference = Math.floor((currentTime - userData.lastUpdate) / 1000); // Время в секундах
  const energyToRestore = Math.floor(timeDifference / 5) * 5; // Восстанавливаем по 5 энергии каждые 5 секунд

  if (energyToRestore > 0) {
    userData.energy = Math.min(10000, userData.energy + energyToRestore); // Не превышаем максимум
    userData.lastUpdate = currentTime; // Обновляем время последнего восстановления
    saveUserDataToLocal();
    updateStats();
  }
}

// Обработчик клика
clickButton.addEventListener('click', () => {
  restoreEnergy(); // Проверяем восстановление перед действием
  if (userData.energy > 0) {
    userData.coins += 1; // Добавляем монету
    userData.energy -= 1; // Тратим 1 единицу энергии
    userData.lastUpdate = Date.now(); // Обновляем время последнего действия
    saveUserDataToLocal();
    updateStats();
  } else {
    alert('Недостаточно энергии для клика!');
  }
});

// Функция для автоматического восстановления энергии
function autoRestoreEnergy() {
  setInterval(() => {
    restoreEnergy(); // Каждые 5 секунд восстанавливаем энергию
  }, 5000); // Интервал 5 секунд
}

// Запуск восстановления энергии при загрузке
window.addEventListener('load', () => {
  const lastVisitTime = userData.lastVisitTime;
  const currentTime = Date.now();
  const timeDifference = Math.floor((currentTime - lastVisitTime) / 1000); // Время в секундах

  // Рассчитываем, сколько энергии накопилось за время отсутствия пользователя
  const energyToRestore = Math.floor(timeDifference / 5) * 5; // Восстанавливаем по 5 энергии каждые 5 секунд
  if (energyToRestore > 0) {
    userData.energy = Math.min(10000, userData.energy + energyToRestore); // Не превышаем максимум
  }

  userData.lastVisitTime = currentTime; // Обновляем время последнего посещения
  saveUserDataToLocal();
  restoreEnergy(); // Восстановить энергию при загрузке страницы
  updateStats();
  autoRestoreEnergy(); // Запуск авто-восстановления энергии
});

// Сохраняем данные при закрытии страницы
window.addEventListener('beforeunload', () => {
  saveUserDataToLocal();
});
