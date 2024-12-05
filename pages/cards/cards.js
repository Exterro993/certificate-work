const groupList = document.getElementById("groupList");
const cardsContainer = document.getElementById("cardsContainer");
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

  return totalEarningsPerHour;
}

function displayCardsByGroup(group, cards) {
    // console.log(group, cards); 
    if (!cards || cards.length === 0) {
      console.warn(`Нет карточек в группе ${group}`);
      return;
    }
  console.log(group);
  console.log(cards);
  
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
            <button class="upgrade-btn" onclick="upgradeCard('${group}', '${card.name}', ${card.cost}, ${perHour})">Прокачать</button>
        </div>
    `;
      cardsContainer.appendChild(cardElement);
    });
  }
  

function updateUserCoinsAndEarnings() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    coins: 0,
    earnPerHour: 0,
  };

  const totalEarningsPerHour = calculateTotalEarnings();
  if (totalEarningsPerHour === 0) {
    console.warn("Общий доход в час равен 0");
  }

  currentUser.earnPerHour = totalEarningsPerHour;

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  const coinsElement = document.getElementById("user-coins");
  if (coinsElement) {
    coinsElement.textContent = `Монеты: ${currentUser.coins}`;
  }

  const earningsElement = document.getElementById("total-earnings");
  if (earningsElement) {
    earningsElement.textContent = `Общий доход в час: ${formatNum(
      currentUser.earnPerHour
    )} монет`;
  }
}

function upgradeCard(group, title, upgradePrice, perHour) {
  const savedData = JSON.parse(localStorage.getItem("userCardsData"));
  let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    coins: 0,
    earnPerHour: 0,
  };

  const cardIndex = savedData[group].findIndex((card) => card.name === title);
  if (cardIndex !== -1) {
    const card = savedData[group][cardIndex];

    if (currentUser.coins >= upgradePrice) {
      savedData[group][cardIndex].level += 1;

      currentUser.coins -= upgradePrice;

      localStorage.setItem("userCardsData", JSON.stringify(savedData));
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      displayCardsByGroup(group, savedData[group]);

      updateUserCoinsAndEarnings();
    } else {
      alert("Недостаточно монет для улучшения этой карточки!");
    }
  }
}

function startCoinEarnings() {
    setInterval(() => {
      const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { coins: 0, earnPerHour: 0 };
      const earningsPerSecond = currentUser.earnPerHour / 3600;
  
    //   console.log(`Доход в секунду: ${earningsPerSecond.toFixed(2)} монет`); 
  
      if (earningsPerSecond > 0) {
        const addedCoins = Math.round(earningsPerSecond * 100) / 100;
  
        currentUser.coins += addedCoins;
  
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
        const coinsElement = document.getElementById("user-coins");
        if (coinsElement) {
          coinsElement.textContent = `Монеты: ${currentUser.coins.toFixed(2)}`;
        }
  
        // console.log(`Добавлено монет: ${addedCoins.toFixed(2)}, Общее количество монет: ${currentUser.coins.toFixed(2)}`); // Отладка
      } else {
        console.warn("Доход в секунду равен 0 или меньше");
      }
    }, 1000);
  }
    

function updateUserCoinsAndEarnings() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    coins: 0,
    earnPerHour: 0,
  };

  const totalEarningsPerHour = calculateTotalEarnings();
  if (totalEarningsPerHour === 0) {
    console.warn("Общий доход в час равен 0");
  }

  currentUser.earnPerHour = totalEarningsPerHour;

  localStorage.setItem("currentUser", JSON.stringify(currentUser));

  const coinsElement = document.getElementById("user-coins");
  if (coinsElement) {
    coinsElement.textContent = `Монеты: ${currentUser.coins}`;
  }

  const earningsElement = document.getElementById("total-earnings");
  if (earningsElement) {
    earningsElement.textContent = `Общий доход в час: ${formatNum(
      currentUser.earnPerHour
    )} монет`;
  }

  console.log(`Обновленный общий доход в час: ${currentUser.earnPerHour}`);
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
  
    console.log(`Общий доход в час (после расчета): ${totalEarningsPerHour}`); 
  
    return totalEarningsPerHour;
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
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { coins: 0, earnPerHour: 0 };
  
    if (!currentUser.coins) {
      currentUser.coins = 0;
    }
    if (!currentUser.earnPerHour) {
      currentUser.earnPerHour = calculateTotalEarnings();
    }
  
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateUserCoinsAndEarnings();
  }
  
initializeCoinsAndEarnings();
startCoinEarnings();


window.addEventListener("beforeunload", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
    coins: 0,
    earnPerHour: 0,
  };
  currentUser.lastVisit = Date.now(); 
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
});

fetchCardsData();
function initializeCoinsAndEarnings() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { coins: 0, earnPerHour: 0 };
  
    if (!currentUser.coins) {
      currentUser.coins = 0;
    }
  
    if (!currentUser.earnPerHour) {
      currentUser.earnPerHour = calculateTotalEarnings();
    }
  
    const lastVisit = currentUser.lastVisit || Date.now();
    const currentTime = Date.now();
    const timeDifference = currentTime - lastVisit;
    const timeDifferenceInHours = timeDifference / 3600000;
  
    const earnedCoins = Math.floor(currentUser.earnPerHour * timeDifferenceInHours);
  
    currentUser.coins += earnedCoins;
  
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    updateUserCoinsAndEarnings(); 
  }
  
  function updateUserCoinsAndEarnings() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || { coins: 0, earnPerHour: 0 };
  
    const totalEarningsPerHour = calculateTotalEarnings();
    if (totalEarningsPerHour === 0) {
      console.warn("Общий доход в час равен 0");
    }
  
    currentUser.earnPerHour = totalEarningsPerHour;
  
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
    const coinsElement = document.getElementById("user-coins");
    if (coinsElement) {
      coinsElement.textContent = `Монеты: ${currentUser.coins}`;
    }
  
    const earningsElement = document.getElementById("total-earnings");
    if (earningsElement) {
      earningsElement.textContent = `Общий доход в час: ${formatNum(currentUser.earnPerHour)} монет`;
    }
  }
  
  window.addEventListener("beforeunload", () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
      coins: 0,
      earnPerHour: 0,
    };
  
    currentUser.lastVisit = Date.now();
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  
    fetch("http://localhost:5000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    })
      .then(response => response.json())
      .then(data => {
        console.log("Данные успешно сохранены на сервере", data);
      })
      .catch(error => {
        console.error("Ошибка при сохранении данных на сервере", error);
      });
  });
  
  initializeCoinsAndEarnings();
  
  
  
function getRandomCards() {
    const allCards = document.querySelectorAll('.card');
    console.log('Количество карточек в контейнере:', allCards.length);
  
    if (allCards.length < 3) {
      console.error('Недостаточно карточек для выбора!');
      return [];
    }
  
    const randomCards = [];
    const indices = new Set(); 
  
    while (randomCards.length < 3) {
      const randomIndex = Math.floor(Math.random() * allCards.length);
      if (!indices.has(randomIndex)) {
        indices.add(randomIndex);
        randomCards.push(allCards[randomIndex].cloneNode(true)); 
      }
    }
  
    return randomCards;
  }
  
  function displayRandomCards() {
    const comboContainer = document.getElementById('combo');
    
    if (!comboContainer) {
      console.error('Контейнер #combo не найден!');
      return; 
    }
  
    comboContainer.innerHTML = ''; 
  
    const randomCards = getRandomCards();
  
    if (randomCards.length === 0) {
      console.warn('Не удалось выбрать карточки.');
      return; 
    }
  
    randomCards.forEach(card => {
      comboContainer.appendChild(card);
    });
  
    randomCards.forEach((card, index) => {
      anime({
        targets: card,
        opacity: 1,
        translateY: [30, 0], 
        easing: 'easeOutExpo',
        duration: 800,
        delay: index * 100 
      });
    });
  }
  
  document.addEventListener('DOMContentLoaded', displayRandomCards);
  