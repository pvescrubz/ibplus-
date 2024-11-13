document.addEventListener("DOMContentLoaded", function () {
    const dropdowns = document.querySelectorAll(".dropdown");
  
    dropdowns.forEach((dropdown) => {
      const button = dropdown.querySelector(".dropdown-button");
      const content = dropdown.querySelector(".dropdown-content");
  
      // Дефолтное значение
      let defaultText = button.textContent;
  
      button.addEventListener("click", function (event) {
        event.stopPropagation(); // Останавливаем всплытие события
        closeAllDropdowns();
        dropdown.classList.toggle("active");
      });
  
      // Обработчик выбора опции
      content.querySelectorAll("a").forEach((item) => {
        item.addEventListener("click", function (event) {
          event.preventDefault(); // Предотвращаем переход по ссылке
          const selectedValue = item.getAttribute("data-value");
          button.textContent = selectedValue; // Устанавливаем выбранное значение в кнопку
          dropdown.classList.remove("active"); // Закрываем dropdown
        });
      });
    });
  
    // Закрыть все открытые выпадающие меню
    function closeAllDropdowns() {
      dropdowns.forEach((dropdown) => {
        dropdown.classList.remove("active");
      });
    }
  
    // Закрытие всех dropdown при клике вне области меню
    window.addEventListener("click", closeAllDropdowns);
  });