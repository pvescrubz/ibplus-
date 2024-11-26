document.addEventListener("DOMContentLoaded", function () {
  // Находим все dropdown элементы
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach((dropdown) => {
    // Получаем связанный select по data-target
    const targetSelectId = dropdown.getAttribute("data-target");
    const select = document.getElementById(targetSelectId);

    // Находим кнопку dropdown и список опций
    const button = dropdown.querySelector(".dropdown-button");
    const content = dropdown.querySelector(".dropdown-content");

    // Проверяем, что элементы найдены
    if (!select || !button || !content) {
      return;
    }

    // Открытие и закрытие dropdown
    button.addEventListener("click", function (event) {
      event.stopPropagation(); // Останавливаем всплытие события
      closeAllDropdowns(); // Закрываем все открытые dropdown
      dropdown.classList.toggle("active"); // Переключаем текущий dropdown
    });

    // Обработка выбора опции
    content.querySelectorAll("a").forEach((item) => {
      item.addEventListener("click", function (event) {
        event.preventDefault(); // Предотвращаем переход по ссылке

        const selectedValue = item.getAttribute("data-value");

        // Обновляем текст кнопки
        const buttonText = button.querySelector(".dropdown-button_text");
        if (buttonText) {
          buttonText.textContent = selectedValue;
        }

        // Обновляем значение <select>
        updateSelect(select, selectedValue);

        // Закрываем dropdown
        dropdown.classList.remove("active");
      });
    });
  });

  // Закрытие всех открытых dropdown при клике вне их области
  window.addEventListener("click", closeAllDropdowns);

  // Функция для закрытия всех dropdown
  function closeAllDropdowns() {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("active");
    });
  }

  // Функция для обновления <select>
  function updateSelect(select, value) {
    // Проверяем, есть ли хотя бы одна опция
    const option = select.querySelector("option");
  
    if (option) {
      // Изменяем значение и текст существующей опции
      option.value = value;
      option.textContent = value;
  
      // Устанавливаем новое значение как выбранное (selected)
      option.selected = true;
    } else {
      // Если опций нет, создаём новую
      const newOption = document.createElement("option");
      newOption.value = value;
      newOption.textContent = value;
      newOption.selected = true;
      select.appendChild(newOption);
    }
  }
});




