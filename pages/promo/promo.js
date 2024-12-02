// Проверка наличия данных о пользователе в localStorage
if (!localStorage.getItem('userData')) {
    localStorage.setItem('userData', JSON.stringify({
      "id": "9e38",
      "login": "Exterro",
      "password": "20122012_Dr",
      "coins": 0,
      "energy": 10000,
      "usedPromoCodes": []  // Инициализация usedPromoCodes как пустой массив
    }));
  }
  
  // Проверка наличия данных о промокодах в localStorage
  if (!localStorage.getItem('promoData')) {
    localStorage.setItem('promoData', JSON.stringify({
      "promoCodes": [
        { "id": 1, "code": "ExterroSigma", "reward": 10000 },
        { "id": 2, "code": "EXTERRO+1000JXRF", "reward": 10000 },
        { "id": 5, "code": "SEAL2024", "reward": 10000 }
      ]
    }));
  }
  
  // Получение данных о пользователе
  function getUserData() {
    return JSON.parse(localStorage.getItem('userData'));
  }
  
  // Сохранение данных о пользователе
  function saveUserData(userData) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // Применение промокода
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
        alert('Этот промокод уже был использован.');
      } else {
        userData.coins += promoCode.reward;  // Добавление монет пользователю
        userData.usedPromoCodes.push(promoCode.code);  // Добавление использованного промокода
        saveUserData(userData);  // Сохранение обновлённого состояния
        alert(`Промокод применён. Вы получили ${promoCode.reward} монет.`);
      }
    } else {
      alert('Неверный промокод.');
    }
  }
  
  // Обработчик формы
  document.getElementById('promoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const promoCodeInput = document.getElementById('promoCodeInput').value;
    applyPromoCode(promoCodeInput);
  });
  