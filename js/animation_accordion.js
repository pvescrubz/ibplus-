document.addEventListener("DOMContentLoaded", function () {
    function acrrdion() {
      const accordions = document.querySelectorAll(".accordion-button");
    if (accordions.length === 0) return;
  
    // SVG иконки
    const svgOpen = `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.49 2 2 6.49 2 12C2 17.51 6.49 22 12 22C17.51 22 22 17.51 22 12C22 6.49 17.51 2 12 2ZM16 12.75H12.75V16C12.75 16.41 12.41 16.75 12 16.75C11.59 16.75 11.25 16.41 11.25 16V12.75H8C7.59 12.75 7.25 12.41 7.25 12C7.25 11.59 7.59 11.25 8 11.25H11.25V8C11.25 7.59 11.59 7.25 12 7.25C12.41 7.25 12.75 7.59 12.75 8V11.25H16C16.41 11.25 16.75 11.59 16.75 12C16.75 12.41 16.41 12.75 16 12.75Z" fill="url(#paint0_linear)"/>
        <defs><linearGradient id="paint0_linear" x1="2" y1="12" x2="22" y2="12" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4F4BF6"/><stop offset="1" stop-color="#2E2C90"/></linearGradient></defs>
        </svg>`;
  
    const svgClose = `<svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 0C4.49 0 0 4.49 0 10C0 15.51 4.49 20 10 20C15.51 20 20 15.51 20 10C20 4.49 15.51 0 10 0ZM13.92 10.75H5.92C5.51 10.75 5.17 10.41 5.17 10C5.17 9.59 5.51 9.25 5.92 9.25H13.92C14.33 9.25 14.67 9.59 14.67 10C14.67 10.41 14.34 10.75 13.92 10.75Z" fill="url(#paint0_linear)"/>
        <defs><linearGradient id="paint0_linear" x1="0" y1="10" x2="20" y2="10" gradientUnits="userSpaceOnUse">
            <stop stop-color="#4F4BF6"/><stop offset="1" stop-color="#2E2C90"/></linearGradient></defs>
        </svg>`;
  
    // Перебираем все аккордеоны
    accordions.forEach((button) => {
      const iconContainer = button.querySelector(".accordion-icon");
      iconContainer.innerHTML = svgOpen; // Вставляем начальную иконку
  
      button.addEventListener("click", function () {
        const content = this.nextElementSibling;
        const isOpen = content.style.maxHeight;
  
        // Переключаем класс активности у кнопки
        this.classList.toggle("active");
  
        // Открытие/закрытие контента и изменение иконки
        if (!isOpen || isOpen === "0px") {
            content.style.maxHeight = `${content.scrollHeight + 50}px`;

          content.style.padding = "10px 10px 30px 40px"; // Добавляем паддинг при открытии
          iconContainer.innerHTML = svgClose; // Меняем иконку
        } else {
          content.style.maxHeight = "0";
          content.style.padding = "5px 0"; // Убираем паддинг при закрытии
          iconContainer.innerHTML = svgOpen; // Возвращаем иконку
        }
      });
    });
  }
    function manageSpecifications() {
   
      const addButton = document.querySelector(".add-specification");
      const deleteButton = document.querySelector(".delete-specification");
      const container = document.querySelector(".flex-container-btns");
 
      if (!addButton || !deleteButton || !container) return;

      const specContainer = container.previousElementSibling;
      if (!specContainer) return;
  
      function updateNumbers() {
        document.querySelectorAll(".accordion_content_specification").forEach((spec, index) => {
          spec.querySelector(".specification_number").textContent = `${index + 1}. `;
        });
      }
  
      function toggleDeleteButton() {
        const specs = document.querySelectorAll(".accordion_content_specification");
        deleteButton.style.display = specs.length > 1 ? "block" : "none";
      }
  
      addButton.addEventListener("click", function () {

        const specs = document.querySelectorAll(".accordion_content_specification");
        if (specs.length === 0) return;
        const lastSpec = specs[specs.length - 1];
        const newSpec = lastSpec.cloneNode(true);
        
        newSpec.querySelectorAll("input").forEach((input) => {
          input.value = "";
        });
  
        specContainer.appendChild(newSpec);
        updateNumbers();
        toggleDeleteButton();
      });
  
      deleteButton.addEventListener("click", function () {
        const specs = document.querySelectorAll(".accordion_content_specification");
        if (specs.length > 1) {
          specs[specs.length - 1].remove();
          updateNumbers();
          toggleDeleteButton();
        }
      });
  
      toggleDeleteButton();
    
  }
  function addSpravochnikEntry() {
    
    const formContainer = document.querySelector(".form_content");
    if (!formContainer) return;
  
    formContainer.addEventListener("change", function (event) {
      const target = event.target;
      const parentContainer = target.closest(".adds_main_container");
      if (!parentContainer) return;
  
      // Проверка на radio
      if (target.classList.contains("visible-radio")) {
        document.querySelectorAll(".adds_main_container").forEach(container => 
          container.classList.remove("radio-active")
        );
        parentContainer.classList.add("radio-active");
      }
  
      // Проверка на checkbox
      if (target.type === "checkbox") {
        if (target.checked) {
          parentContainer.classList.add("checkbox-active");
        } else {
          parentContainer.classList.remove("checkbox-active");
        }
      }
    });
  
    // Проверки на все кнопки
    formContainer.addEventListener("click", function (event) {
      const target = event.target;
      
      // Проверка на кнопку добавления
      if (target.classList.contains("spravochnik-btn")) {
        console.log("Кнопка добавления нажата");
      }
  
      // Проверка на кнопку удаления
      if (target.classList.contains("delete-specification")) {
        console.log("Кнопка удаления нажата");
      }
  
      // Проверка на кнопку поиска
      if (target.classList.contains("archive-platej-btn")) {
        console.log("Кнопка поиска нажата");
      }
    });
      
    
  }

  addSpravochnikEntry();
  manageSpecifications();
  acrrdion();
  });
