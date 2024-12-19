# Страничка с вводом промокодов
```javascript
  function applyPromoCode(promoCodeInput) {
    const userData = getUserData();  // Получаем данные пользователя
    const promoData = JSON.parse(localStorage.getItem('promoData'));  // Получаем данные о промокодах
    
    // Проверяем, что у пользователя есть поле usedPromoCodes, если нет - инициализируем пустым массивом
    if (!userData.usedPromoCodes) {
      userData.usedPromoCodes = [];
    }
  
    // Поиск промокода в списке доступных
    const promoCode = promoData.promoCodes.find(promo => promo.code === promoCodeInput);
  
    // Если промокод найден и не был использован ранее
    if (promoCode) {
      // Проверка, использован ли промокод
      if (userData.usedPromoCodes.includes(promoCode.code)) {
        createModal('Этот промокод уже был использован.');
      } else {
        userData.coins += promoCode.reward;  // Добавление монет пользователю
        userData.usedPromoCodes.push(promoCode.code);  // Добавление использованного промокода
        saveUserData(userData);  // Сохранение обновлённого состояния
        createModal(`Промокод применён. Вы получили ${promoCode.reward} монет.`)
      }
    } else {
      createModal('Неверный промокод.');
    }
  }
```
- [Страничка Регистрации](./doc/registr-auth.md)
- [Страничка о проекте](./doc/about.md)
- [Основная страничка](./doc/main.md)
- [Страница карточек](./doc/cards.md)
- [Страничка друзей](./doc/friends.md)
- [Страника промокодов](./doc/promo.md)
- [Страничка информации](./doc/airdrop.md)
- [Админ страничка](./doc/admin.md)