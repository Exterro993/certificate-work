# Админ страничка

```javascript
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
```

[Страничка Регистрации](./doc/registr-auth.md)
[Страничка о проекте](./doc/about.md)
[Основная страничка](./doc/main.md)
[Страница карточек](./doc/cards.md)
[Страничка друзей](./doc/friends.md)
[Страника промокодов](./doc/promo.md)
[Страничка информации](./doc/airdrop.md)
[Админ страничка](./doc/admin.md)