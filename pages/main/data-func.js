export const updateUserInJson = (user) => {
    console.log(user);
    const PutData = async() =>{
        try {
           await axios.put(`http://localhost:5000/users/${user.id}`, user) 
           console.log(`work`);
           
        } catch (error) {
            console.log(error);
            
        }
    }
    PutData()
    // Считываем текущие данные с сервера (в данном случае локальный JSON-файл)
    // fetch("http://localhost:5000/users")
    //   .then(response => response.json())
    //   .then(users => {
    //     const existingUserIndex = users.findIndex(u => u.login === user.login);
    //     if (existingUserIndex !== -1) {
    //       // Обновляем данные пользователя в массиве
    //       users[existingUserIndex] = { ...users[existingUserIndex], ...user };
          
    //       // Отправляем обновленные данные на сервер
    //       fetch("http://localhost:5000/users", {
    //         method: "PUT",
    //         mode: 'no-cors',
    //         headers: {
    //           "Content-Type": "application/json",
    //           "Access-Control-Allow-Origin": "*", // Разрешаем любой источник
    //         },
    //         body: JSON.stringify(users),
    //       })
    //         .then(response => response.json())
    //         .then(updatedUsers => {
    //           console.log("Данные пользователя обновлены на сервере:", updatedUsers);
    //         })
    //         .catch(error => console.error("Ошибка при обновлении данных на сервере:", error));
    //     }
    //   })
    //   .catch(error => console.error("Ошибка при получении данных с сервера:", error));
  };
