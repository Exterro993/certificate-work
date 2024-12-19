// Проверка наличия данных о пользователе в localStorage
import { createModal } from "../../modal.js";
import { createConfirmModal } from "../../modal.js";

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
  
  // Обработчик формы
  document.getElementById('promoForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const promoCodeInput = document.getElementById('promoCodeInput').value;
    applyPromoCode(promoCodeInput);
  });
  

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
    createModal(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`);
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


