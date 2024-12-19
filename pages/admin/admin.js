document.addEventListener("DOMContentLoaded", () => {
  const userTableBody = document.getElementById("userTableBody");
  const formatNum = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}К` : `${n}`);
  let preventBeforeUnload = false;

  // Создание модального окна
  const modal = document.createElement("div");
  modal.id = "confirmationModal";
  modal.style.cssText = `
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 90%;
    max-width: 400px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  `;
  modal.innerHTML = `
    <p style="margin-bottom: 20px; font-size: 16px; text-align: center;">Вы уверены, что хотите покинуть страницу? Ваш прогресс будет сохранён.</p>
    <div style="display: flex; justify-content: space-around;">
      <button id="confirmLeave" style="padding: 10px 15px; border: none; background: #e74c3c; color: white; border-radius: 5px; cursor: pointer; flex: 1; margin-right: 10px;">Да</button>
      <button id="cancelLeave" style="padding: 10px 15px; border: none; background: #2ecc71; color: white; border-radius: 5px; cursor: pointer; flex: 1;">Нет</button>
    </div>
  `;
  document.body.appendChild(modal);

  const confirmLeave = document.getElementById("confirmLeave");
  const cancelLeave = document.getElementById("cancelLeave");

  function showModal() {
    modal.style.display = "block";
    anime({
      targets: "#confirmationModal",
      opacity: [0, 1],
      scale: [0.8, 1],
      duration: 300,
      easing: "easeOutCubic",
    });
  }

  function hideModal() {
    anime({
      targets: "#confirmationModal",
      opacity: [1, 0],
      scale: [1, 0.8],
      duration: 300,
      easing: "easeInCubic",
      complete: () => {
        modal.style.display = "none";
      },
    });
  }

  // Функция для обновления таблицы пользователей
  function updateUserTable(usersData) {
    userTableBody.innerHTML = '';

    usersData.forEach((user) => {
      const row = document.createElement("tr");

      const nicknameCell = document.createElement("td");
      nicknameCell.textContent = user.login;

      const statusCell = document.createElement("td");
      statusCell.textContent = user.banned;

      const titleCell = document.createElement("td");
      titleCell.textContent = user.title;

      const coinsCell = document.createElement("td");
      coinsCell.textContent = formatNum(user.coins);

      const actionsCell = document.createElement("td");
      const banButton = document.createElement("button");
      banButton.textContent = user.banned ? 'Разбанить' : 'Забанить';
      banButton.onclick = async () => {
        preventBeforeUnload = true;
        await toggleBanStatus(user);
        preventBeforeUnload = false;
      };

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
      await fetch(`http://localhost:5000/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });
      fetchUsersData();
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  }

  fetchUsersData();

  // Обработчик закрытия вкладки с модалкой
  let leavePage = false;

  window.addEventListener("beforeunload", (event) => {
    if (preventBeforeUnload || leavePage) return;

    event.preventDefault();
    event.returnValue = ""; // Для совместимости с браузерами
    showModal();

    return false;
  });

  // Обработка кнопок модального окна
  confirmLeave.addEventListener("click", () => {
    leavePage = true;
    handleUserExitAndEarnings(); // Сохранить прогресс
    hideModal();
    setTimeout(() => window.location.reload(), 300);
  });

  cancelLeave.addEventListener("click", () => {
    leavePage = false;
    hideModal();
  });

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

    console.log(`Вы заработали ${coinsEarned} монет за ${offlineSeconds} секунд.`);
  }
});
const btn = document.querySelector('#back_to_main')
btn.addEventListener("click",()=>{
  location.href = '../main/main.html'
})