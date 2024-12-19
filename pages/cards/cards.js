const groupList = document.getElementById("groupList");
const cardsContainer = document.getElementById("cardsContainer");
import { createConfirmModal, createModal } from "../../modal.js";
const apiUrl = "http://localhost:5000/cards"; 
if (!groupList || !cardsContainer) {
  console.error("Элементы groupList или cardsContainer не найдены в DOM");
}
async function fetchCardsData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    const data = await response.json();

    const savedData = JSON.parse(localStorage.getItem("userCardsData")) || {};

    if (!data || Object.keys(data).length === 0) {
      console.error("Нет данных о карточках от сервера");
      return;
    }

    Object.keys(data).forEach((group) => {
      if (!savedData[group]) {
        savedData[group] = data[group].map((card) => ({
          ...card,
          level: 0, 
          maxLvl: card.maxLvl || 1, 
          maxPerHour: card.maxPerHour || 0,
        }));
      }
    });

    localStorage.setItem("userCardsData", JSON.stringify(savedData));

    const groups = Object.keys(data);
    if (groups.length === 0) {
      console.error("Нет доступных групп для отображения");
      return;
    }

    groups.forEach((group) => {
      const groupButton = document.createElement("button");
      groupButton.textContent = group;
      groupButton.classList.add("group-btn");
      groupButton.onclick = () => displayCardsByGroup(group, savedData[group]);
      groupList.appendChild(groupButton);
    });

    if (groups.length > 0) {
      displayCardsByGroup(groups[0], savedData[groups[0]]);
    }

    updateUserCoinsAndEarnings();

    startCoinEarnings();
  } catch (error) {
    console.error("Ошибка при загрузке данных:", error);
  }
}

const formatNum = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}К` : `${n}`);

function calculateCurrentEarnings(level = 0, maxLevel = 1, maxPerHour = 0) {
  level = Number(level);
  maxLevel = Number(maxLevel);
  maxPerHour = Number(maxPerHour);

  if (maxLevel === 0) return 0;  

  return Math.floor((level / maxLevel) * maxPerHour);
}

function parseValue(value) {
  if (typeof value === "string") {
    value = value.replace(/[^\d.-]/g, ""); 
        return parseFloat(value) || 0; 
  }
  return value;
}


function displayCardsByGroup(group, cards) {
  if (!cards || cards.length === 0) {
    console.warn(`Нет карточек в группе ${group}`);
    return;
  }

  cardsContainer.innerHTML = "";

  cards.forEach((card) => {
    const perHour = parseValue(card.perHour);

    const currentEarningsPerHour = calculateCurrentEarnings(
      card.level || 0,
      card.maxLvl || 1,
      perHour
    );

    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.innerHTML = `
      <img src="../../images/nav/airdrop.png" alt="Card Image">
      <div class="card-content">
          <h3>${card.name}</h3>
          <p>Уровень: ${card.level}</p>
          <p>Цена улучшения: ${card.cost} монет</p>
          <p>Текущий доход в час: ${formatNum(currentEarningsPerHour)} монет</p>
      </div>
    `;

    const upgradeButton = document.createElement("button");
    upgradeButton.classList.add("upgrade-btn");
    upgradeButton.textContent = "Прокачать";

    // Добавляем обработчик события
    upgradeButton.addEventListener("click", () => {
      upgradeCard(group, card.name, card.cost, perHour);
    });

    cardElement.querySelector(".card-content").appendChild(upgradeButton);
    cardsContainer.appendChild(cardElement);
  });
}

  

function updateUserCoinsAndEarnings() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    coins: 0,
    earnPerHour: 0,
  };

  const totalEarningsPerHour = calculateTotalEarnings();
  if (totalEarningsPerHour === 0) {
    console.warn("Общий доход в час равен 0");
  }

  userData.earnPerHour = totalEarningsPerHour;

  localStorage.setItem("userData", JSON.stringify(userData));

  const coinsElement = document.getElementById("user-coins");
  if (coinsElement) {
    coinsElement.textContent = `Монеты: ${userData.coins}`;
  }

  const earningsElement = document.getElementById("total-earnings");
  if (earningsElement) {
    earningsElement.textContent = `Общий доход в час: ${formatNum(
      userData.earnPerHour
    )} монет`;
  }
}

function upgradeCard(group, title, upgradePrice, perHour) {
  const savedData = JSON.parse(localStorage.getItem("userCardsData"));
  let userData = JSON.parse(localStorage.getItem("userData")) || {
    coins: 0,
    earnPerHour: 0,
  };

  const cardIndex = savedData[group].findIndex((card) => card.name === title);
  if (cardIndex !== -1) {
    const card = savedData[group][cardIndex];

    if (userData.coins >= upgradePrice) {
      savedData[group][cardIndex].level += 1;

      userData.coins -= upgradePrice;

      localStorage.setItem("userCardsData", JSON.stringify(savedData));
      localStorage.setItem("userData", JSON.stringify(userData));

      displayCardsByGroup(group, savedData[group]);

      updateUserCoinsAndEarnings();
    } else {
      createModal('Недостаточно монет для прокачки этой карточки!')
    }
  }
}

function startCoinEarnings() {
    setInterval(() => {
      const userData = JSON.parse(localStorage.getItem("userData")) || { coins: 0, earnPerHour: 0 };
      const earningsPerSecond = userData.earnPerHour / 3600;
  
    //   console.log(`Доход в секунду: ${earningsPerSecond.toFixed(2)} монет`); 
  
      if (earningsPerSecond > 0) {
        const addedCoins = Math.round(earningsPerSecond * 100) / 100;
  
        userData.coins += addedCoins;
  
        localStorage.setItem("userData", JSON.stringify(userData));
  
        const coinsElement = document.getElementById("user-coins");
        if (coinsElement) {
          coinsElement.textContent = `Монеты: ${userData.coins.toFixed(2)}`;
        }
  
        // console.log(`Добавлено монет: ${addedCoins.toFixed(2)}, Общее количество монет: ${userData.coins.toFixed(2)}`); // Отладка
      } else {
        console.warn("Доход в секунду равен 0 или меньше");
      }
    }, 1000);
  }
    




  
function calculateTotalEarnings() {
  const savedData = JSON.parse(localStorage.getItem("userCardsData")) || {};
  if (!savedData || Object.keys(savedData).length === 0) {
    console.warn("Нет данных о карточках для расчета дохода");
    return 0;
  }

  let totalEarningsPerHour = 0;

  Object.values(savedData).forEach((group) => {
    group.forEach((card) => {
      const perHour = parseValue(card.perHour);
      totalEarningsPerHour += calculateCurrentEarnings(
        card.level || 0,
        card.maxLvl || 1,
        perHour
      );
    });
  });

//   console.log(`Общий доход в час (после расчета): ${totalEarningsPerHour}`);

  return totalEarningsPerHour;
}

function initializeCoinsAndEarnings() {
    const userData = JSON.parse(localStorage.getItem("userData")) || { coins: 0, earnPerHour: 0 };
  
    if (!userData.coins) {
      userData.coins = 0;
    }
    if (!userData.earnPerHour) {
      userData.earnPerHour = calculateTotalEarnings();
    }
  
    localStorage.setItem("userData", JSON.stringify(userData));
    updateUserCoinsAndEarnings();
  }
  
initializeCoinsAndEarnings();
startCoinEarnings();


window.addEventListener("beforeunload", () => {
  const userData = JSON.parse(localStorage.getItem("userData")) || {
    coins: 0,
    earnPerHour: 0,
  };
  userData.lastVisit = Date.now(); 
  localStorage.setItem("userData", JSON.stringify(userData));
});

fetchCardsData();
// Функция для сохранения времени выхода пользователя
function saveExitTime() {
  const userData = JSON.parse(localStorage.getItem("userData")) || {};
  userData.lastVisit = Date.now(); // Сохраняем текущее время как время выхода
  localStorage.setItem("userData", JSON.stringify(userData)); // Обновляем данные в localStorage
}

// Функция для подсчета монет за время отсутствия
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
    createModal(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`)
  }

  return userData; // Возвращаем обновлённые данные
}

// Добавляем обработчик на закрытие вкладки
window.addEventListener("beforeunload", (event) => {
  const confirmationMessage = "Вы уверены, что хотите выйти? Ваш прогресс будет сохранён.";
  
  // Отображаем системное уведомление (браузерное)
  event.returnValue = confirmationMessage;

  // Показываем пользовательское подтверждение
  const userConfirmed = createConfirmModal("Вы уверены, что хотите выйти?");
  if (userConfirmed) {
    handleUserExitAndEarnings(); // Сохранить данные и рассчитать заработок
  } else {
    event.preventDefault(); // Блокируем закрытие вкладки
  }
});
