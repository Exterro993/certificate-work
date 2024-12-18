import { updateUserInJson } from "./data-func.js";



document.addEventListener("DOMContentLoaded", async () => {
  event.preventDefault()
  console.log("Загрузка страницы...");

  const userNameDiv = document.getElementById("user-name");
  const exchangeIconDiv = document.querySelector(".exchange-icon");
  const titleInfo = document.querySelector("#title-info");

  // Получаем данные о пользователе из localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log("Данные пользователя при загрузке:", userData);

  if (!userData) {
    alert("Вы не авторизованы!");
    window.location.href = "";
    return;
  }

  // Обновляем имя пользователя и информацию о бирже
  userNameDiv.textContent = userData.login;
  titleInfo.textContent = userData.title;

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

  if (exchangeIcons[userData.exchange]) {
    exchangeIconDiv.innerHTML = `
        <img src="${exchangeIcons[userData.exchange]}" alt="logo"> <p>${userData.exchange.toLocaleUpperCase()}</p>
    `;
  } else {
    exchangeIconDiv.textContent = "Иконка биржи не найдена";
    console.error("Не удалось найти иконку для биржи:", userData.exchange);
  }
});

const coinsDisplay = document.getElementById("coinsDisplay");
const earnPerHourDisplay = document.getElementById("earnPerHourDisplay");
const energyDisplay = document.getElementById("energyDisplay");
const clickButton = document.getElementById("clickButton");

let userData = JSON.parse(localStorage.getItem("userData")) || {
  coins: 0,
  energy: 10000,
  earnPerHour: 0,
  lastUpdate: Date.now(),
  lastVisitTime: Date.now(),
  login: "Гость",
  title: "Новичок",
  exchange: "binance",
};
console.log("Инициализированы данные пользователя:", userData);
updateUserInJson(userData)
if (!userData.id) {
  alert("Пользователь не найден. Пожалуйста, войдите в систему.");
  window.location.href = "../registr or auth/registr-auth.html";
}

const formatNum = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : n.toFixed(2));

function updateStats(userData) {
  coinsDisplay.textContent = `Монеты: ${formatNum(userData.coins || 0)}`;
  earnPerHourDisplay.textContent = `Заработок в час: ${userData.earnPerHour || 0}`;
  energyDisplay.textContent = `Энергия: ${userData.energy || 0}`;
}

function saveUserDataToLocal(userData) {
  localStorage.setItem("userData", JSON.stringify(userData));
}

function restoreEnergy() {
  let userData = JSON.parse(localStorage.getItem("userData")) || {};
  const currentTime = Date.now();
  const timeDifference = Math.floor((currentTime - userData.lastUpdate) / 1000);
  const energyToRestore = Math.floor(timeDifference / 5) * 5;

  if (energyToRestore > 0) {
    userData.energy = Math.min(10000, userData.energy + energyToRestore);
    userData.lastUpdate = currentTime;
    saveUserDataToLocal(userData);
    updateStats(userData);
  }
}

clickButton.addEventListener("click", () => {
  event.preventDefault()
  let userData = JSON.parse(localStorage.getItem("userData")) || {};
  restoreEnergy();

  if (userData.energy > 0) {
    userData.coins = (userData.coins || 0) + 1;
    userData.energy -= 1;
    userData.lastUpdate = Date.now();
    console.log("Клик успешен. Новые данные пользователя:", userData);
    saveUserDataToLocal(userData);
    updateStats(userData);
  } else {
    console.warn("Недостаточно энергии для клика.");
    alert("Недостаточно энергии для клика!");
  }
});

function autoRestoreEnergy() {
  setInterval(() => {
    console.log("Авто-восстановление энергии...");
    restoreEnergy();
  }, 5000);
}

window.addEventListener("load", () => {
  event.preventDefault()
  console.log("Выполняется обработка загрузки страницы...");
  const lastVisitTime = userData.lastVisitTime;
  const currentTime = Date.now();
  const timeDifference = Math.floor((currentTime - lastVisitTime) / 1000);
  const energyToRestore = Math.floor(timeDifference / 5) * 5;

  if (energyToRestore > 0) {
    userData.energy = Math.min(10000, userData.energy + energyToRestore);
    console.log("Энергия восстановлена за время отсутствия:", energyToRestore);
  }

  userData.lastVisitTime = currentTime;
  saveUserDataToLocal(userData);
  restoreEnergy();
  updateStats(userData);
  autoRestoreEnergy();
});



function calculateOfflineEarnings() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  const lastVisitTime = userData.lastVisit || Date.now();
  const currentTime = Date.now();
  const offlineSeconds = Math.floor((currentTime - lastVisitTime) / 1000);
  const earningsPerSecond = (userData.earnPerHour || 0) / 3600;
  const coinsEarned = Math.floor(offlineSeconds * earningsPerSecond);

  userData.coins = (userData.coins || 0) + coinsEarned;
  userData.lastVisit = currentTime;
  console.log("Начислено монет за время отсутствия:", coinsEarned);
  saveUserDataToLocal(userData);
}



function startEarningCoins() {
  setInterval(() => {
    const userData = JSON.parse(localStorage.getItem("userData")) || {};

    if (!userData.earnPerHour || userData.earnPerHour <= 0) {
      console.log("Заработок в час не установлен или равен 0.");
      return;
    }

    const earnPerSecond = userData.earnPerHour / 3600;
    userData.coins += earnPerSecond;
    userData.lastVisit = Date.now();
    saveUserDataToLocal(userData);
    updateStats(userData);
  }, 1000);
}

startEarningCoins();

// Функция для сохранения времени выхода и расчёта монет за время отсутствия
function handleUserExitAndEarnings() {
  // Загружаем данные пользователя
  const userData = JSON.parse(localStorage.getItem("userData")) || {};

  // Сохраняем текущее время как время выхода
  const lastVisitTime = userData.lastVisit || Date.now(); // Если данных о последнем визите нет, используем текущее время
  const currentTime = Date.now();

  // Вычисляем разницу во времени (в секундах)
  const offlineSeconds = Math.floor((currentTime - lastVisitTime) / 1000);

  // Рассчитываем доход в секунду
  const earningsPerSecond = (userData.earnPerHour || 0) / 3600;

  // Вычисляем заработанные монеты за время отсутствия
  const coinsEarned = Math.floor(offlineSeconds * earningsPerSecond);

  // Обновляем данные пользователя
  userData.coins = (userData.coins || 0) + coinsEarned; // Добавляем заработанные монеты
  userData.lastVisit = currentTime; // Обновляем время последнего визита
  localStorage.setItem("userData", JSON.stringify(userData)); // Сохраняем обновлённые данные в localStorage

  // Показываем уведомление о заработке, если есть монеты
  if (coinsEarned > 0) {
    alert(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`);
  }
}

// Добавляем обработчик на закрытие вкладки
window.addEventListener("beforeunload", (event) => {
  // Проверяем, было ли событие вызвано обновлением страницы
  const isReloadOrInternalNavigation = performance.getEntriesByType("navigation")[0]?.type === "reload";

  if (!isReloadOrInternalNavigation) {
    const confirmationMessage = "Вы уверены, что хотите выйти? Ваш прогресс будет сохранён.";

    // Показываем системное уведомление браузера
    event.returnValue = confirmationMessage;

    // Отображаем пользовательское подтверждение
    const userConfirmed = confirm("Вы уверены, что хотите выйти?");
    if (userConfirmed) {
      handleUserExitAndEarnings(); // Сохраняем данные и начисляем монеты
    } else {
      event.preventDefault(); // Блокируем закрытие вкладки
    }
  }
});



const logoDiv = document.querySelector('.user__avatar__img');
logoDiv.addEventListener("dblclick", () => {
  // Проверяем title пользователя
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  if (userData.title === "Admin") {
    window.location.href = "../admin/admin.html"; // Перенаправляем на страницу администратора
  } else {
    console.log("Хорошая попытка...");
  }
})


document.addEventListener("DOMContentLoaded", () => {
  event.preventDefault()
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    console.error("Нет данных пользователя в localStorage");
    alert("Вы не авторизованы! Перенаправление на страницу входа.");
    window.location.href = "login.html"; // Перенаправление на страницу входа
    return;
  }
  updateUserInJson(userData)

  // const updateUserInJson = (user) => {
  //   // Считываем текущие данные с сервера (в данном случае локальный JSON-файл)
  //   fetch("http://localhost:5000/users")
  //     .then(response => response.json())
  //     .then(users => {
  //       const existingUserIndex = users.findIndex(u => u.login === user.login);
  //       if (existingUserIndex !== -1) {
  //         // Обновляем данные пользователя в массиве
  //         users[existingUserIndex] = { ...users[existingUserIndex], ...user };
          
  //         // Отправляем обновленные данные на сервер
  //         fetch("http://localhost:5000/users", {
  //           method: "PUT",
  //           mode: 'no-cors',
  //           headers: {
  //             "Content-Type": "application/json",
  //             "Access-Control-Allow-Origin": "*", // Разрешаем любой источник
  //           },
  //           body: JSON.stringify(users),
  //         })
  //           .then(response => response.json())
  //           .then(updatedUsers => {
  //             console.log("Данные пользователя обновлены на сервере:", updatedUsers);
  //           })
  //           .catch(error => console.error("Ошибка при обновлении данных на сервере:", error));
  //       }
  //     })
  //     .catch(error => console.error("Ошибка при получении данных с сервера:", error));
  // };

  // Проверяем и добавляем недостающие данные
  if (userData.coins === undefined) userData.coins = 0;
  if (userData.earnPerHour === undefined) userData.earnPerHour = 0;
  if (userData.energy === undefined) userData.energy = 10000;

  // Обновляем данные в localStorage
  localStorage.setItem("userData", JSON.stringify(userData));

  // Обновляем данные пользователя в JSON
  updateUserInJson(userData);

  console.log("Данные пользователя успешно обновлены:", userData);
});

