const replaceBtn = document.querySelector(".to__auth");
const registr = document.querySelector("#registr");
const auth = document.querySelector("#auth");
const replaceBtn2 = document.querySelector(".to__registr");
document.addEventListener("DOMContentLoaded", () => {
  if (registr) {
    replaceBtn.click();
    replaceBtn2.click();
  }
  const form = document.getElementById("registr");
  const erorrDiv = document.querySelector(".error");
  const RegUserLogin = document.querySelector(".login");
  const RegUserPassword = document.querySelector("#password");
  const RegUserEmail = document.querySelector(".email");
  const RePassword = document.querySelector("#re__password");

  let loginTouched = false;
  let passwordTouched = false;
  let emailTouched = false;
  let rePasswordTouched = false;

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
        errorMessages += `<div class="errors-div"> <img src="../../images/reg_auth/OOjs_UI_icon_error-destructive.svg.png" alt=""> <p>${loginErrors.join("<br>")}</p> </div>`;
      }
    }

    if (passwordTouched) {
      const passwordErrors = checkPassword();
      if (passwordErrors.length > 0) {
        errorMessages += `<div class="errors-div"> <img src="../../images/reg_auth/OOjs_UI_icon_error-destructive.svg.png" alt=""> <p>${passwordErrors.join("<br>")}</p> </div>`;
      }
    }

    if (rePasswordTouched) {
      const rePasswordErrors = checkRePassword();
      if (rePasswordErrors.length > 0) {
        errorMessages += `<div class="errors-div"> <img src="../../images/reg_auth/OOjs_UI_icon_error-destructive.svg.png" alt=""> <p>${rePasswordErrors.join("<br>")}</p> </div>`;
      }
    }

    if (emailTouched) {
      const emailErrors = checkEmail();
      if (emailErrors.length > 0) {
        errorMessages += `<div class="errors-div"> <img src="../../images/reg_auth/OOjs_UI_icon_error-destructive.svg.png" alt=""> <p>${emailErrors.join("<br>")}</p> </div>`;
      }
    }

    if (errorMessages) {
      erorrDiv.innerHTML = errorMessages;
    } else {
      erorrDiv.innerHTML = "";
    }
  };

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
