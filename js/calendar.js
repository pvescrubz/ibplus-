document.addEventListener("DOMContentLoaded", () => {
  function initializeCalendar(containerSelector, options = {}) {
    const datePicker = document.querySelector(containerSelector);
    const dateInput = datePicker.querySelector(".input-main");
    const calendar = datePicker.querySelector(".calendar");
    const hiddenDateInputs = datePicker.querySelectorAll('input[type="date"]');
    const mode = options.mode || datePicker.dataset.mode || "single";

    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    const minYear = 2000;
    const maxYear = new Date().getFullYear(); 

    let displayedDate = new Date();
    let startDate = null;
    let endDate = null;

    function extractDateFromServerFormat(dateStr) {
      return dateStr.split(" ")[0];
    }

    function convertToInputDate(dateStr) {
      const [day, month, year] = dateStr.split(".");
      return `${year}-${month}-${day}`;
    }

    function formatToDisplayDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    function initializeDates() {
      // Утилита для преобразования даты из формата с временем в формат yyyy-MM-dd
      function toInputDateFormat(value) {
        if (!value) return ""; // Если значение пустое, возвращаем пустую строку
        if (value.includes(" ")) {
          return value.split(" ")[0]; // Отсекаем время, оставляем только дату
        }
        return value; // Если значение уже в правильном формате yyyy-MM-dd
      }
    
      // Проверяем значения скрытых полей и преобразуем их
      if (hiddenDateInputs[0] && hiddenDateInputs[0].value) {
        const normalizedStartDate = toInputDateFormat(hiddenDateInputs[0].value);
        startDate = new Date(normalizedStartDate); // Преобразуем в объект Date
        hiddenDateInputs[0].value = normalizedStartDate; // Устанавливаем значение в правильном формате
      } else {
        // Если значения нет, задаем текущую дату
        const today = new Date();
        startDate = today;
        hiddenDateInputs[0].value = today.toISOString().split("T")[0];
      }
    
      if (mode === "range" && hiddenDateInputs[1] && hiddenDateInputs[1].value) {
        const normalizedEndDate = toInputDateFormat(hiddenDateInputs[1].value);
        endDate = new Date(normalizedEndDate); // Преобразуем в объект Date
        hiddenDateInputs[1].value = normalizedEndDate; // Устанавливаем значение в правильном формате
      } else if (mode === "range") {
        // Если значения нет, задаем текущую дату + 1 день
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        endDate = tomorrow;
        hiddenDateInputs[1].value = tomorrow.toISOString().split("T")[0];
      }
    
      // Обновляем текстовое поле для отображения
      updateTextInput();
    }
    
    
    function updateTextInput() {
      if (dateInput) {
        if (mode === "range") {
          if (startDate && endDate) {
            dateInput.value = `${formatToDisplayDate(startDate)} - ${formatToDisplayDate(endDate)}`;
          } else if (startDate) {
            dateInput.value = `${formatToDisplayDate(startDate)} - ...`;
          } else {
            dateInput.value = "Выберите диапазон";
          }
        } else if (mode === "single") {
          dateInput.value = startDate ? formatToDisplayDate(startDate) : "Выберите дату";
        }
      }

      if (hiddenDateInputs[0]) hiddenDateInputs[0].value = startDate ? convertToInputDate(formatToDisplayDate(startDate)) : "";
      if (mode === "range" && hiddenDateInputs[1]) hiddenDateInputs[1].value = endDate ? convertToInputDate(formatToDisplayDate(endDate)) : "";
    }

    function renderCalendar() {
      const calendarContent = document.createElement("div");
      calendarContent.className = "calendar-content";

      const header = document.createElement("div");
      header.className = "calendar-header";

      const prevButton = document.createElement("button");
      prevButton.textContent = "<";
      prevButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (displayedDate.getMonth() === 0) {
          displayedDate.setFullYear(displayedDate.getFullYear() - 1);
          displayedDate.setMonth(11);
        } else {
          displayedDate.setMonth(displayedDate.getMonth() - 1);
        }
        renderCalendar();
      });

      const nextButton = document.createElement("button");
      nextButton.textContent = ">";
      nextButton.addEventListener("click", (event) => {
        event.stopPropagation();
        if (displayedDate.getMonth() === 11) {
          displayedDate.setFullYear(displayedDate.getFullYear() + 1);
          displayedDate.setMonth(0);
        } else {
          displayedDate.setMonth(displayedDate.getMonth() + 1);
        }
        renderCalendar();
      });

      const monthDisplay = document.createElement("span");
      monthDisplay.textContent = monthNames[displayedDate.getMonth()];

      header.appendChild(prevButton);
      header.appendChild(monthDisplay);

      // Вызовем функцию для рендеринга кнопки выбора года
      renderYearSelector(header);

      header.appendChild(nextButton);

      calendarContent.appendChild(header);

      const daysHeader = document.createElement("div");
      daysHeader.className = "calendar-days";
      daysOfWeek.forEach((day) => {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;
        daysHeader.appendChild(dayElement);
      });
      calendarContent.appendChild(daysHeader);

      const daysContainer = document.createElement("div");
      daysContainer.className = "calendar-days";

      const firstDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
      const daysInMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();

      for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
        const dayElement = document.createElement("div");
        const dayText = document.createElement("span");
        dayText.textContent = day;
        dayText.classList.add("day-text");

        dayElement.className = "day";
        dayElement.appendChild(dayText);

        if (mode === "range" && startDate && endDate && date >= startDate && date <= endDate) {
          dayElement.classList.add("in-range");
        }

        if (startDate && date.getTime() === startDate.getTime()) {
          dayElement.classList.add("selected-start");
        }
        if (mode === "range" && endDate && date.getTime() === endDate.getTime()) {
          dayElement.classList.add("selected-end");
        }

        dayElement.onclick = (event) => {
          event.stopPropagation();  // Останавливаем всплытие события
          selectDate(date);
        };
        daysContainer.appendChild(dayElement);
      }

      calendarContent.appendChild(daysContainer);

      const existingContent = calendar.querySelector(".calendar-content");
      if (existingContent) {
        calendar.removeChild(existingContent);
      }
      calendar.appendChild(calendarContent);
    }

    function renderYearSelector(header) {
      const yearWrapper = document.createElement("div");
      yearWrapper.className = "year-wrapper"; // Новый контейнер для кнопки и списка лет

      const yearButton = document.createElement("button");
      yearButton.className = "year-selector-button";
      yearButton.textContent = displayedDate.getFullYear();
    
      const yearList = document.createElement("div");
      yearList.className = "year-selector-list";

      // Предотвращаем стандартное поведение кнопки
      yearButton.addEventListener("click", (event) => {
        event.preventDefault();  // Останавливаем стандартное поведение кнопки
        event.stopPropagation(); // Останавливаем всплытие события
        yearList.classList.toggle("active");
      });
    
      // Создаем элементы для каждого года
      for (let year = minYear; year <= maxYear; year++) {
        const yearItem = document.createElement("div");
        yearItem.textContent = year;
        yearItem.className = "year-item";
    
        // При клике на год, меняем отображаемый год
        yearItem.addEventListener("click", (event) => {
          event.stopPropagation();  // Останавливаем всплытие события
          displayedDate.setFullYear(year);
          yearButton.textContent = year;
          yearList.classList.remove("active");  // Закрываем список лет
          renderCalendar();  // Перерисовываем календарь с новым годом
        });
    
        yearList.appendChild(yearItem);
      }

      yearWrapper.appendChild(yearButton);
      yearWrapper.appendChild(yearList);
      header.appendChild(yearWrapper);  // Добавляем годовой блок в header
    }

    function selectDate(date) {
      if (mode === "range") {
        if (!startDate || (startDate && endDate)) {
          startDate = date;
          endDate = null;
        } else if (date < startDate) {
          endDate = startDate;
          startDate = date;
        } else {
          endDate = date;
        }
        updateTextInput();
        renderCalendar();

        if (startDate && endDate) {
          toggleCalendar(false);
        }
      } else if (mode === "single") {
        startDate = date;
        updateTextInput();
        toggleCalendar(false);
      }
    }

    function toggleCalendar(state = null) {
      if (state === null) {
        calendar.classList.toggle("active");
      } else {
        calendar.classList[state ? "add" : "remove"]("active");
      }
      if (calendar.classList.contains("active")) {
        renderCalendar();
      }
    }

    dateInput.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleCalendar();
    });

    document.addEventListener("click", (event) => {
      if (calendar.classList.contains("active") && !datePicker.contains(event.target)) {
        toggleCalendar(false);
      }
    });

    calendar.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    initializeDates();
  }

  const datePickers = document.querySelectorAll(".date-picker");
  datePickers.forEach((datePicker) => {
    initializeCalendar(`#${datePicker.id}`);
  });
});
