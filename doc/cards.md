# Страничка с карточками,и их взаимодействием

## Функция для рендеринга карт

```javascript
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
``0`

- [Страничка Регистрации](./doc/registr-auth.md)
- [Страничка о проекте](./doc/about.md)
- [Основная страничка](./doc/main.md)
- [Страница карточек](./doc/cards.md)
- [Страничка друзей](./doc/friends.md)
- [Страника промокодов](./doc/promo.md)
- [Страничка информации](./doc/airdrop.md)
- [Админ страничка](./doc/admin.md)