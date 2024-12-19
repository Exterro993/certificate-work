# Страничка для добавления друзей

```javascript
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
```
[Страничка Регистрации](./doc/registr-auth.md)
[Страничка о проекте](./doc/about.md)
[Основная страничка](./doc/main.md)
[Страница карточек](./doc/cards.md)
[Страничка друзей](./doc/friends.md)
[Страника промокодов](./doc/promo.md)
[Страничка информации](./doc/airdrop.md)
[Админ страничка](./doc/admin.md)