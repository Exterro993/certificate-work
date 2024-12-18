const replaceBtn = document.querySelector(".to__auth");
const registr = document.querySelector("#registr");
const auth = document.querySelector("#auth");
const replaceBtn2 = document.querySelector(".to__registr");
const polit_div = document.querySelector(".politic-div");
const politicBtn = document.querySelector(".politicBtn");
const politicBtnBack = document.querySelector(".politicBtnBack");
const forms__container = document.querySelector('.forms-container')
// const body = document.querySelector("body")
anime({
  targets: ".politic",
  translateY: -700,
  delay: 2,
});
politicBtnBack.addEventListener("click",()=>{
  forms__container.style.filter = "blur(0px)"
  anime({
    targets: ".politic",
    translateY: -700,
    delay: 2,
  });
  setTimeout(() => {
    polit_div.style.display = 'none'
  }, 1000);
})
politicBtn.addEventListener("click", () => {
  polit_div.style.display = "flex";
  forms__container.style.filter = "blur(5px)"
  // setTimeout(() => {

  // }, 1000);
  anime({
    targets: ".politic",
    translateY: 50,
    delay: 2,
  });
});
document.addEventListener("DOMContentLoaded", () => {
  if (registr) {
    replaceBtn.click()
    replaceBtn2.click()
  }
  const authForm = document.getElementById("auth");
  const authErrorDiv = document.querySelector(".auth-error");
  const authLoginInput = document.querySelector(".auth-login");
  const authEmailInput = document.querySelector(".auth-email");
  const authPasswordInput = document.querySelector("#auth-password");
  const authPasswordInputView = document.querySelector('#view__password-auth')
  authPasswordInputView.addEventListener("click", () => {
    // const passwordInp = document.querySelector("#password");
    // click.preventdefault
    event.preventDefault();
    authPasswordInput.type = authPasswordInput.type === "password" ? "text" : "password";
  });
  // Функция для отображения ошибок
  const showAuthError = (message) => {
    authErrorDiv.innerHTML = `<div class="errors-div"><p>${message}</p></div>`;
  };

  // Функция для проверки данных пользователя
  const authenticateUser = async (login, email, password) => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      const users = response.data;

      // Ищем пользователя с совпадающими данными
      const user = users.find(
        (u) => u.login === login && u.email === email && u.password === password
      );

      if (user) {
        if (user.banned) {
          // Если пользователь имеет статус "false", перенаправляем на страницу для неактивных пользователей
          alert("Ваш аккаунт деактивирован. Вы будете перенаправлены.");
          window.location.href = "../ban/ban.html";
        } else {
          // Если пользователь имеет статус "true", сохраняем его данные в localStorage и переходим на главную страницу
          localStorage.setItem("userData", JSON.stringify(user));
          alert("Успешный вход!");
          window.location.href = "../main/main.html";
        }
      } else {
        // Ошибка авторизации
        showAuthError("Неверные данные. Проверьте логин, email или пароль.");
      }
    } catch (error) {
      console.error("Ошибка запроса:", error);
      showAuthError("Произошла ошибка на сервере. Попробуйте позже.");
    }
  };

  // Обработчик отправки формы
  authForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Предотвращаем перезагрузку страницы

    const login = authLoginInput.value.trim();
    const email = authEmailInput.value.trim();
    const password = authPasswordInput.value.trim();

    if (!login || !email || !password) {
      showAuthError("Заполните все поля.");
      return;
    }

    authenticateUser(login, email, password); // Проверяем пользователя
  });
});
const replace = () => {
  replaceBtn.addEventListener("click", () => {
    anime({
      targets: ".forms-container",
      translateX: 550,
      delay: 2,
    });
  });
  if (window.innerWidth < 600) {
    replaceBtn2.addEventListener("click", () => {
      anime({
        targets: ".forms-container",
        translateX: -30,
        delay: 2,
      });
    });
  } else {
    replaceBtn2.addEventListener("click", () => {
      anime({
        targets: ".forms-container",
        translateX: -550,
        delay: 2,
      });
    });
  }
};
replace();

export const ClickBtnBack = () => {
  const back = document.querySelector("#back-btn");
  back.addEventListener("click", () => {
    window.location.href = "../about/about.html";
  });
};
// anime()
ClickBtnBack();
const passwordInp = document.querySelector("#password");
const rePasswordInp = document.querySelector("#re__password");
const CheckRePasswordBtn = document.querySelector("#view__Repassword");
const CheckPasswordBtn = document.querySelector("#view__password");
export const PasswordCheck = () => {
  CheckPasswordBtn.addEventListener("click", () => {
    // const passwordInp = document.querySelector("#password");
    // click.preventdefault
    event.preventDefault();
    passwordInp.type = passwordInp.type === "password" ? "text" : "password";
  });
  CheckRePasswordBtn.addEventListener("click", () => {
    // const passwordInp = document.querySelector("#password");
    event.preventDefault();
    rePasswordInp.type =
      rePasswordInp.type === "password" ? "text" : "password";
  });

  // CheckRePasswordBtn.addEventListener("click", () => {
  //   rePasswordInp.type =
  //     rePasswordInp.type === "password" ? "text" : "password";
  // });
};
PasswordCheck();
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registr");
  const errorDiv = document.querySelector(".error");
  const RegUserLogin = document.querySelector(".login");
  const RegUserPassword = document.querySelector("#password");
  const RegUserEmail = document.querySelector(".email");
  const RePassword = document.querySelector("#re__password");
  const exchangeSelect = document.getElementById("stock__change");

  let loginTouched = false;
  let passwordTouched = false;
  let emailTouched = false;
  let rePasswordTouched = false;

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      return response.data; // Предполагается, что это массив пользователей
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error.message);
      return [];
    }
  };

  const checkPasswordUnique = async (password) => {
    try {
      const users = await fetchUsers();
      if (!Array.isArray(users)) {
        throw new Error("Данные пользователей имеют некорректный формат");
      }
      return !users.some((user) => user.password === password.trim());
    } catch (error) {
      console.error("Ошибка при проверке пароля на уникальность:", error.message);
      alert("Ошибка при проверке пароля на уникальность");
      return false;
    }
  };

  const checkLogin = () => {
    const loginValue = RegUserLogin.value.trim();
    let errorMessages = [];

    if (loginValue.length < 5) {
      errorMessages.push("Логин должен быть больше 5 символов");
    } else if (loginValue.length > 20) {
      errorMessages.push("Логин должен быть меньше 20 символов");
    } else if (/[а-яёА-ЯЁ]/.test(loginValue)) {
      errorMessages.push("Логин не должен содержать кириллицу");
    }

    return errorMessages;
  };

  const checkPassword = () => {
    const passwordValue = RegUserPassword.value.trim();
    let errorMessages = [];

    if (passwordValue.length < 8) {
      errorMessages.push("Пароль должен быть не менее 8 символов");
    } else if (!/[A-Z]/.test(passwordValue)) {
      errorMessages.push("Пароль должен содержать хотя бы одну заглавную букву");
    } else if (!/[a-z]/.test(passwordValue)) {
      errorMessages.push("Пароль должен содержать хотя бы одну строчную букву");
    } else if (!/\d/.test(passwordValue)) {
      errorMessages.push("Пароль должен содержать хотя бы одну цифру");
    } else if (!/[@#$%^&*()_+!]/.test(passwordValue)) {
      errorMessages.push("Пароль должен содержать хотя бы один специальный символ");
    }

    return errorMessages;
  };

  const checkRePassword = () => {
    const rePasswordValue = RePassword.value.trim();
    let errorMessages = [];

    if (rePasswordValue !== RegUserPassword.value.trim()) {
      errorMessages.push("Пароли не совпадают");
    }

    return errorMessages;
  };

  const checkEmail = () => {
    const emailValue = RegUserEmail.value.trim();
    let errorMessages = [];

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailValue)) {
      errorMessages.push("Введите корректный email");
    }

    return errorMessages;
  };

  const showErrors = () => {
    let errorMessages = "";

    if (loginTouched) {
      const loginErrors = checkLogin();
      if (loginErrors.length > 0) {
        errorMessages += `<div class="errors-div"><p>${loginErrors.join("<br>")}</p></div>`;
      }
    }

    if (passwordTouched) {
      const passwordErrors = checkPassword();
      if (passwordErrors.length > 0) {
        errorMessages += `<div class="errors-div"><p>${passwordErrors.join("<br>")}</p></div>`;
      }
    }

    if (rePasswordTouched) {
      const rePasswordErrors = checkRePassword();
      if (rePasswordErrors.length > 0) {
        errorMessages += `<div class="errors-div"><p>${rePasswordErrors.join("<br>")}</p></div>`;
      }
    }

    if (emailTouched) {
      const emailErrors = checkEmail();
      if (emailErrors.length > 0) {
        errorMessages += `<div class="errors-div"><p>${emailErrors.join("<br>")}</p></div>`;
      }
    }

    if (errorMessages) {
      errorDiv.innerHTML = errorMessages;
    } else {
      errorDiv.innerHTML = "";
    }
  };

  const validateForm = () => {
    const loginErrors = checkLogin();
    const passwordErrors = checkPassword();
    const rePasswordErrors = checkRePassword();
    const emailErrors = checkEmail();

    return (
      loginErrors.length === 0 &&
      passwordErrors.length === 0 &&
      rePasswordErrors.length === 0 &&
      emailErrors.length === 0
    );
  };

  const sendData = async (data) => {
    try {
      const response = await axios.post("http://localhost:5000/users", data);
      if (response.status === 201) {
        alert("Регистрация прошла успешно!");
        form.reset();
        loginTouched = false;
        passwordTouched = false;
        emailTouched = false;
        rePasswordTouched = false;
        showErrors();
      } else {
        alert("Ошибка при отправке данных");
      }
    } catch (error) {
      console.error("Ошибка при отправке данных:", error.response || error.message);
      alert("Не удалось отправить данные на сервер");
    }
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    loginTouched = true;
    passwordTouched = true;
    emailTouched = true;
    rePasswordTouched = true;
    showErrors();

    if (validateForm()) {
      const passwordValue = RegUserPassword.value.trim();
      const isPasswordUnique = await checkPasswordUnique(passwordValue);

      if (!isPasswordUnique) {
        alert("Пароль уже занят!");
        return;
      }

      const title = "user"; // Уровень по умолчанию

      const userData = {
        login: RegUserLogin.value.trim(),
        password: passwordValue,
        email: RegUserEmail.value.trim(),
        exchange: exchangeSelect.value,
        title: title,
        banned: false
      };

      await sendData(userData);
    }
  });

  RegUserLogin.addEventListener("input", () => {
    loginTouched = true;
    showErrors();
  });

  RegUserPassword.addEventListener("input", () => {
    passwordTouched = true;
    showErrors();
  });

  RePassword.addEventListener("input", () => {
    rePasswordTouched = true;
    showErrors();
  });

  RegUserEmail.addEventListener("input", () => {
    emailTouched = true;
    showErrors();
  });
});