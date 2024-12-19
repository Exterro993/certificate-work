# Основная страничка

## Функция для кликов

```javascript
clickButton.addEventListener("click", () => {
  event.preventDefault();
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
```

## Функция для сохранения времени выхода и расчёта монет за время отсутствия

```javascrpt
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
    createModal(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`);
  }
}

```

[Страничка Регистрации](./doc/registr-auth.md)
[Страничка о проекте](./doc/about.md)
[Основная страничка](./doc/main.md)
[Страница карточек](./doc/cards.md)
[Страничка друзей](./doc/friends.md)
[Страника промокодов](./doc/promo.md)
[Страничка информации](./doc/airdrop.md)
[Админ страничка](./doc/admin.md)