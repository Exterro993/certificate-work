# Документация.

## Дипломная работа Рогачёва Данияра.
## Начинающий **Front-end** разработчик.
## Используемый материал 

* MarkDown
* Json-сервер,swiper,axios,anime.js
* Работа с нейросетями для создания контента
* Другие сервисы,улучшения...
```javascript
// Универсальная функция для управления лоадером
// Универсальная функция для управления лоадером
function manageLoader(action) {
  let loader = document.getElementById("loader");

  // Если лоадер отсутствует в DOM, создаем его
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";

    // Создаем spinner
    const spinner = document.createElement("div");
    spinner.className = "spinner";
    loader.appendChild(spinner);

    // Добавляем лоадер в DOM
    document.body.appendChild(loader);

    // Добавляем стили через JS
    const style = document.createElement("style");
    style.textContent = `
      #loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('images/loader-bg.jpg');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      #loader.hidden {
        visibility: hidden;
        opacity: 0;
      }
      .spinner {
        width: 50px;
        height: 50px;
        border: 5px solid rgba(0, 0, 0, 0.1);
        border-top: 5px solid #3498db;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Обрабатываем действие
  if (action === "show") {
    loader.classList.remove("hidden");

    // Скрыть лоадер через 5 секунд
    setTimeout(() => {
      loader.classList.add("hidden");
    }, 5000);
  } else if (action === "hide") {
    loader.classList.add("hidden");
  }
}

// Показ лоадера при загрузке страницы
window.addEventListener("load", () => {
  manageLoader("show");
});

// Показ лоадера при переходе по ссылкам
document.addEventListener("click", (event) => {
  if (event.target.tagName === "A" && event.target.href) {
    manageLoader("show");
  }
});

```
- [Страничка Регистрации](./doc/registr-auth.md)
- [Страничка о проекте](./doc/about.md)
- [Основная страничка](./doc/main.md)
- [Страница карточек](./doc/cards.md)
- [Страничка друзей](./doc/friends.md)
- [Страника промокодов](./doc/promo.md)
- [Страничка информации](./doc/airdrop.md)
- [Админ страничка](./doc/admin.md)