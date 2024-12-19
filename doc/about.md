# О компании Seal Combat

## Функция для переключения

```javascript
export const Cardclick = document.querySelectorAll(".card");
export const span = document.querySelectorAll(".span");
export const CardclickFun = () => {
  Cardclick.forEach((el) => {
    el.addEventListener("click", () => {
      span.forEach((element) => {
        if (el.id === element.id) {
          element.style.display = "flex";
          // element.style.transition = "1s";
        }else{
          element.style.display = "none";
        }
        // if (el !== element.target) {
        //   el.classList.add("hidden");
        // }
        // if (el.id === element.id) {
        //   element.style.display = "none";
        // }
      });
    });
  });
};
```
- [Страничка Регистрации](./doc/registr-auth.md)
- [Страничка о проекте](./doc/about.md)
- [Основная страничка](./doc/main.md)
- [Страница карточек](./doc/cards.md)
- [Страничка друзей](./doc/friends.md)
- [Страника промокодов](./doc/promo.md)
- [Страничка информации](./doc/airdrop.md)
- [Админ страничка](./doc/admin.md)