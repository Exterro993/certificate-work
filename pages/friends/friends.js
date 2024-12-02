const loginInput = document.querySelector("#friend__name");
const addLoginBtn = document.querySelector(".find__friend");
const loginListContainer = document.querySelector(".friends-list");

// Пример данных пользователей
const users = [
  // { login: "Exterro", title: "Админ", avatar: "../../images/main/user__avatar.jpg" },
  {
    login: "Ratareto",
    title: "Игрок",
    avatar: "../../images/main/user__avatar.jpg",
  },
  {
    login: "test",
    title: "Игрок",
    avatar: "../../images/main/user__avatar.jpg",
  },
  {
    login: "Sigma",
    title: "Админ",
    avatar: "../../images/main/user__avatar.jpg",
  },
];

// Массив для сохранения добавленных друзей
let savedLogins = JSON.parse(localStorage.getItem("friendsLogins")) || [];

// Функция для отображения друзей из `savedLogins` при загрузке страницы
const loadSavedLogins = () => {
  savedLogins.forEach((savedLogin) => {
    const user = users.find((user) => user.login === savedLogin);
    if (user) {
      addFriendFragment(user);
    }
  });
};

// Функция для добавления фрагмента друга в контейнер
const addFriendFragment = (user) => {
  if (loginListContainer.children.length >= 20) {
    alert("Достигнуто максимальное количество друзей (20).");
    return;
  }

  const friendFragment = document.createElement("div");
  friendFragment.classList.add("loginItem");
  friendFragment.innerHTML = `
    <img src="${user.avatar}" alt="${user.login}" class="user-avatar">
    <span>${user.login} - ${user.title}</span>
  `;
  loginListContainer.appendChild(friendFragment);
};

// Обработчик для кнопки "Добавить друга"
addLoginBtn.addEventListener("click", () => {
  const inputLogin = loginInput.value.trim();
  if (inputLogin === currentUserLogin) {
    alert("Вы не можете добавить себя в список друзей!");
    return;
  }

  // Проверяем, есть ли пользователь с таким логином
  const user = users.find((user) => user.login === inputLogin);

  if (user && !savedLogins.includes(inputLogin)) {
    addFriendFragment(user);

    // Сохраняем логин друга
    savedLogins.push(inputLogin);
    localStorage.setItem("friendsLogins", JSON.stringify(savedLogins));

    // Очищаем инпут
    loginInput.value = "";
  } else if (savedLogins.includes(inputLogin)) {
    alert("Этот пользователь уже добавлен в список!");
  } else {
    alert("Пользователь с таким логином не найден.");
  }
});

// Загружаем сохраненные друзья при загрузке страницы
window.addEventListener("DOMContentLoaded", loadSavedLogins);
