import { manageLoader } from "../../loader.js";
manageLoader()
// Путь к серверу для получения данных пользователей, карт и промокодов
const usersUrl = 'http://localhost:5000/users';
import { createModal } from "../../modal.js";
import { createConfirmModal } from "../../modal.js";
// Получение всех пользователей
async function getUsers() {
  try {
    const response = await axios.get(usersUrl);
    return response.data; // Данные о пользователях
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователей:', error);
    createModal('Ошибка при загрузке данных. Попробуйте снова позже.');
  }
}

// Добавление друга
// Добавление друга
async function addFriend(event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы

  const friendInput = document.getElementById('friend-input');
  const friendLogin = friendInput.value.trim();

  if (!friendLogin) {
    createModal("Введите логин друга.");
    return;
  }

  // Получаем текущего пользователя
  const currentUser = localStorage.getItem("currentUser");

  if (!currentUser) {
    createModal("Не удалось определить текущего пользователя.");
    return;
  }

  if (friendLogin === currentUser) {
    createModal("Вы не можете добавить себя в друзья.");
    return;
  }

  // Получаем список пользователей
  const users = await getUsers();

  if (!users) {
    createModal("Не удалось получить список пользователей.");
    return;
  }

  // Поиск пользователя по логину
  const friend = users.find(user => user.login === friendLogin);

  if (!friend) {
    createModal("Пользователь с таким логином не найден.");
    return;
  }

  // Получаем список добавленных друзей из localStorage
  const currentFriends = JSON.parse(localStorage.getItem("addedFriends")) || [];

  // Проверяем, что друг еще не добавлен
  if (currentFriends.some(f => f.login === friend.login)) {
    createModal("Этот пользователь уже добавлен в друзья.");
    return;
  }

  // Добавляем друга в список
  currentFriends.push({ login: friend.login, title: friend.title });
  localStorage.setItem("addedFriends", JSON.stringify(currentFriends));

  // Получаем текущие данные пользователя из localStorage
  const userData = JSON.parse(localStorage.getItem("userData")) || { coins: 0 };
  userData.coins += 10000; // Добавляем 10000 монет
  localStorage.setItem("userData", JSON.stringify(userData));

  // Очищаем поле ввода
  friendInput.value = "";

  // Обновляем список друзей на странице
  displayFriends();
}


// Отображение списка друзей
function displayFriends() {
  const friendsContainer = document.getElementById('friends-list');
  if (!friendsContainer) {
    console.error('Контейнер с id="friends-list" не найден.');
    return;
  }

  const addedFriends = JSON.parse(localStorage.getItem("addedFriends")) || [];

  // Очищаем контейнер
  friendsContainer.innerHTML = '';

  if (addedFriends.length === 0) {
    const noFriendsMessage = document.createElement('p');
    noFriendsMessage.textContent = 'Нет добавленных друзей.';
    friendsContainer.appendChild(noFriendsMessage);
    return;
  }

  // Генерация элементов для каждого друга
  addedFriends.forEach(friend => {
    const friendItem = document.createElement('div');
    friendItem.className = 'loginItem';
    friendItem.innerHTML = `
      <img src="../../images/main/user__avatar.jpg" alt="avatar">
      <p>${friend.login} (${friend.title})</p>
    `;
    friendsContainer.appendChild(friendItem);
  });
}

// Запуск отображения друзей при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  displayFriends();
  document.getElementById('add-friend-button').addEventListener('click', addFriend);
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
  const userConfirmed = createConfirmModal('Вы уверенны что хотите выйти?');
  if (userConfirmed) {
    handleUserExitAndEarnings(); // Сохранить данные и рассчитать заработок
  } else {
    event.preventDefault(); // Блокируем закрытие вкладки
  }
});