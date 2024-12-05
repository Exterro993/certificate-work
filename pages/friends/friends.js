// Путь к серверу для получения данных пользователей, карт и промокодов
const usersUrl = 'http://localhost:5000/users';

// Получение всех пользователей
async function getUsers() {
  try {
    const response = await axios.get(usersUrl);
    return response.data; // Данные о пользователях
  } catch (error) {
    console.error('Ошибка при загрузке данных пользователей:', error);
    alert('Ошибка при загрузке данных. Попробуйте снова позже.');
  }
}

// Добавление друга
async function addFriend(event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы

  const friendInput = document.getElementById('friend-input');
  const friendLogin = friendInput.value.trim();

  if (!friendLogin) {
    alert("Введите логин друга.");
    return;
  }

  // Получаем список пользователей
  const users = await getUsers();

  if (!users) {
    alert("Не удалось получить список пользователей.");
    return;
  }

  // Поиск пользователя по логину
  const friend = users.find(user => user.login === friendLogin);

  if (!friend) {
    alert("Пользователь с таким логином не найден.");
    return;
  }

  // Получаем список добавленных друзей из localStorage
  const currentFriends = JSON.parse(localStorage.getItem("addedFriends")) || [];

  // Проверяем, что друг еще не добавлен
  if (currentFriends.some(f => f.login === friend.login)) {
    alert("Этот пользователь уже добавлен в друзья.");
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
