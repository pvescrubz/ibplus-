document.addEventListener("DOMContentLoaded", function () {
  // Находим все элементы dropdown
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    // Получаем связанный <select> по атрибуту data-target
    const targetSelectId = dropdown.getAttribute("data-target");
    const select = document.getElementById(targetSelectId);

    // Находим кнопку dropdown и список опций
    const button = dropdown.querySelector(".dropdown-button");
    const buttonText = button.querySelector(".dropdown-button_text");
    const content = dropdown.querySelector(".dropdown-content");

    // Проверяем, что элементы найдены
    if (!select || !button || !content || !buttonText) {
      return;
    }

    // Генерируем элементы <a> для видимого dropdown из <select>
    populateDropdown(content, select);

    // Устанавливаем начальное значение кнопки
    const defaultOption = select.querySelector("option[selected]");
    if (defaultOption) {
      buttonText.textContent = defaultOption.textContent || defaultOption.value || "Выберите";
    }

    // Открытие и закрытие dropdown
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      closeAllDropdowns();
      dropdown.classList.toggle("active");
    });

    // Добавляем обработчики для элементов после их генерации
    content.addEventListener("click", function (event) {
      const item = event.target.closest("a");
      if (item) {
        event.preventDefault();
        const selectedValue = item.getAttribute("data-value");
        const selectedText = item.textContent;

        // Обновляем текст кнопки
        buttonText.textContent = selectedText;

        // Устанавливаем соответствующую опцию в <select> как выбранную
        updateSelect(select, selectedValue);

        // Закрываем dropdown
        dropdown.classList.remove("active");
      }
    });
  });

  // Закрытие всех открытых dropdown при клике вне их области
  window.addEventListener("click", closeAllDropdowns);

  function closeAllDropdowns() {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }

  // Генерация элементов dropdown из скрытого <select>
  function populateDropdown(content, select) {
    content.innerHTML = ""; // Очищаем существующий контент
    select.querySelectorAll("option").forEach((option) => {
      const value = option.value;
      const text = option.textContent || value;

      // Создаём элемент <a> для видимого меню
      const link = document.createElement("a");
      link.href = `#${value}`;
      link.className = "text_semibold";
      link.setAttribute("data-value", value);
      link.textContent = text;

      // Добавляем в контент dropdown
      content.appendChild(link);
    });
  }

  // Обновление значения в <select>
  function updateSelect(select, value) {
    const optionToSelect = select.querySelector(`option[value="${value}"]`);
    if (optionToSelect) {
      // Снимаем выбранное значение со всех опций
      select.querySelectorAll("option").forEach((option) => {
        option.selected = false;
        option.removeAttribute("selected"); // Удаляем HTML-атрибут
      });

      // Устанавливаем выбранное значение
      optionToSelect.selected = true;
      optionToSelect.setAttribute("selected", "selected"); // Обновляем HTML-атрибут
    }
  }
});
