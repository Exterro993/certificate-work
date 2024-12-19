# Админ страничка

```javascript
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
```
- [Страничка Регистрации](./doc/registr-auth.md)
- [Страничка о проекте](./doc/about.md)
- [Основная страничка](./doc/main.md)
- [Страница карточек](./doc/cards.md)
- [Страничка друзей](./doc/friends.md)
- [Страника промокодов](./doc/promo.md)
- [Страничка информации](./doc/airdrop.md)
- [Админ страничка](./doc/admin.md)