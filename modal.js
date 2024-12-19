export function createModal(message) {
    // Создание элементов модального окна
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
  
    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      text-align: center;
      max-width: 400px;
      width: 100%;
    `;
  
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.style.cssText = `
      margin: 0 0 20px;
      font-size: 16px;
      color: #333;
    `;
  
    const closeButton = document.createElement("button");
    closeButton.textContent = "Закрыть";
    closeButton.style.cssText = `
      padding: 10px 20px;
      background-color: #007bff;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
  
    // Обработчик для закрытия модального окна
    closeButton.onclick = () => {
      document.body.removeChild(modal);
    };
  
    // Добавление элементов в модальное окно
    modalContent.appendChild(messageElement);
    modalContent.appendChild(closeButton);
    modal.appendChild(modalContent);
  
    // Отображение модального окна
    document.body.appendChild(modal);
  }
  



















export  function createConfirmModal(message, onConfirm, onCancel) {
    // Создание элементов модального окна
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
  
    const modalContent = document.createElement("div");
    modalContent.style.cssText = `
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      text-align: center;
      max-width: 400px;
      width: 100%;
    `;
  
    const messageElement = document.createElement("p");
    messageElement.textContent = message;
    messageElement.style.cssText = `
      margin: 0 0 20px;
      font-size: 16px;
      color: #333;
    `;
  
    const buttonContainer = document.createElement("div");
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: space-around;
    `;
  
    const confirmButton = document.createElement("button");
    confirmButton.textContent = "Подтвердить";
    confirmButton.style.cssText = `
      padding: 10px 20px;
      background-color: #28a745;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    confirmButton.onclick = () => {
      onConfirm();
      document.body.removeChild(modal);
    };
  
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Отменить";
    cancelButton.style.cssText = `
      padding: 10px 20px;
      background-color: #dc3545;
      color: #fff;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
    `;
    cancelButton.onclick = () => {
      if (onCancel) onCancel();
      document.body.removeChild(modal);
    };
  
    // Добавление элементов в модальное окно
    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    modalContent.appendChild(messageElement);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);
  
    // Отображение модального окна
    document.body.appendChild(modal);
  }
  