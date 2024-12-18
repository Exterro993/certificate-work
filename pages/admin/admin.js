document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.getElementById("userTableBody");

  // Функция для обновления таблицы пользователей
  function updateUserTable(usersData) {
    userTableBody.innerHTML = ''; // Очищаем таблицу перед рендером

    usersData.forEach((user) => {
      const row = document.createElement("tr");

      const nicknameCell = document.createElement("td");
      nicknameCell.textContent = user.login;

      const statusCell = document.createElement("td");
      statusCell.textContent = user.status;

      const titleCell = document.createElement("td");
      titleCell.textContent = user.title;

      const coinsCell = document.createElement("td");
      coinsCell.textContent = user.coins;

      const actionsCell = document.createElement("td");
      const banButton = document.createElement("button");
      banButton.textContent = user.banned ? 'Разбанить' : 'Забанить';
      banButton.onclick = () => toggleBanStatus(user);

      actionsCell.appendChild(banButton);

      row.appendChild(nicknameCell);
      row.appendChild(statusCell);
      row.appendChild(titleCell);
      row.appendChild(coinsCell);
      row.appendChild(actionsCell);

      userTableBody.appendChild(row);
    });
  }

  // Функция для получения данных пользователей с сервера
  async function fetchUsersData() {
    try {
      const response = await fetch('http://localhost:5000/users');
      const usersData = await response.json();
      updateUserTable(usersData);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  }

  // Функция для изменения статуса бана
  async function toggleBanStatus(user) {
    const updatedUser = { ...user, banned: !user.banned };

    try {
      // Отправляем обновленные данные на сервер
      await fetch(`http://localhost:5000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedUser)
      });

      // Перезагружаем данные с сервера после обновления
      fetchUsersData();
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  }

  // Загружаем данные пользователей при старте
  fetchUsersData();
});







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
      alert(`Вы отсутствовали ${offlineSeconds} секунд и заработали ${coinsEarned} монет!`);
    }
  
    return userData; // Возвращаем обновлённые данные
  }
  
  // Добавляем обработчик на закрытие вкладки
  window.addEventListener("beforeunload", (event) => {
    const confirmationMessage = "Вы уверены, что хотите выйти? Ваш прогресс будет сохранён.";
    
    // Отображаем системное уведомление (браузерное)
    event.returnValue = confirmationMessage;
  
    // Показываем пользовательское подтверждение
    const userConfirmed = confirm("Вы уверены, что хотите выйти?");
    if (userConfirmed) {
      handleUserExitAndEarnings(); // Сохранить данные и рассчитать заработок
    } else {
      event.preventDefault(); // Блокируем закрытие вкладки
    }
  });
  