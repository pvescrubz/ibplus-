
document.addEventListener('DOMContentLoaded', () => {
  


function initializeCalendar(containerId, inputId, mode) {
  const datePicker = document.querySelector(".date-picker"); // Главный контейнер
  const dateInput = document.getElementById(inputId); // Поле для текстового диапазона
  const calendar = document.getElementById(containerId);
  const startDateInput = document.getElementById("start-date"); // Скрытый input для начальной даты
  const endDateInput = document.getElementById("end-date"); // Скрытый input для конечной даты

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  let startDate = new Date(); // Сегодня
  let endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000); // Завтра
  let displayedDate = new Date();

  // Установить начальные значения
  function setInitialRange() {
    updateTextInput();
  }
  setInitialRange();

  function renderCalendar() {
    const calendarContent = document.createElement("div");
    calendarContent.className = "calendar-content";
  
    const header = document.createElement("div");
    header.className = "calendar-header";
  
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.addEventListener("click", () => changeMonth(-1));
  
    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.addEventListener("click", () => changeMonth(1));
  
    const title = document.createElement("span");
    title.className = "input-text";
    title.textContent = `${monthNames[displayedDate.getMonth()]} ${displayedDate.getFullYear()}`;
  
    header.appendChild(prevButton);
    header.appendChild(title);
    header.appendChild(nextButton);
  
    calendarContent.appendChild(header);
  
    const daysHeader = document.createElement("div");
    daysHeader.className = "calendar-days";
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;
      daysHeader.appendChild(dayElement);
    });
    calendarContent.appendChild(daysHeader);
  
    const daysContainer = document.createElement("div");
    daysContainer.className = "calendar-days";
    const firstDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();
  
    // Добавляем пустые дни перед началом месяца
    for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
      const emptyDay = document.createElement("div");
      emptyDay.className = "day empty"; // Добавляем класс для пустых дней
      daysContainer.appendChild(emptyDay);
    }
  
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
      const dayElement = document.createElement("div");
      const dayText = document.createElement("span");
      dayText.textContent = day;
      dayText.classList.add("day-text");
  
      dayElement.className = "day";
      dayElement.appendChild(dayText);
  
      // Добавление классов для выбранных дат
      if (startDate && endDate && date >= startDate && date <= endDate) {
        dayElement.classList.add("in-range");
      }
      if (startDate && date.getTime() === startDate.getTime()) {
        dayElement.classList.add("selected-start");
      }
      if (endDate && date.getTime() === endDate.getTime()) {
        dayElement.classList.add("selected-end");
      }
  
      dayElement.onclick = () => selectDate(date);
      daysContainer.appendChild(dayElement);
    }
  
    calendarContent.appendChild(daysContainer);
  
    const existingContent = calendar.querySelector(".calendar-content");
    if (existingContent) {
      calendar.removeChild(existingContent);
    }
    calendar.appendChild(calendarContent);
  }

  function changeMonth(offset) {
    displayedDate.setMonth(displayedDate.getMonth() + offset);
    renderCalendar();
  }

  function selectDate(date) {
    if (mode === "range") {
      if (!startDate || (startDate && endDate)) {
        startDate = date;
        endDate = null;
        updateTextInput();
      } else if (date < startDate) {
        endDate = startDate;
        startDate = date;
        updateTextInput();
      } else {
        endDate = date;
        updateTextInput();

        if (startDate && endDate) {
          toggleCalendar(); // Закрываем календарь только после выбора обеих дат
        }
      }

      renderCalendar(); // Перерисовываем календарь для обновления выбора
    } else if (mode === "single") {
      startDate = date;
      updateTextInput();
      toggleCalendar(); // Закрываем календарь сразу после выбора даты
    }
  }

  function formatDate(date) {
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function updateTextInput() {
    if (dateInput) {
      if (startDate && endDate) {
        const formattedStartDate = formatDate(startDate);
        const formattedEndDate = formatDate(endDate);

        // Устанавливаем текст в текстовое поле
        dateInput.value = `${formattedStartDate} - ${formattedEndDate}`;

        // Дублируем текст в скрытые инпуты (в формате yyyy-MM-dd)
        if (startDateInput) startDateInput.value = formatDateForInput(startDate);
        if (endDateInput) endDateInput.value = formatDateForInput(endDate);
      } else if (startDate) {
        const formattedStartDate = formatDate(startDate);
        dateInput.value = `${formattedStartDate} - ...`;

        // Дублируем только начальную дату (в формате yyyy-MM-dd)
        if (startDateInput) startDateInput.value = formatDateForInput(startDate);
        if (endDateInput) endDateInput.value = ""; // Сбрасываем конечную дату
      } else {
        dateInput.value = "Выберите диапазон";
        if (startDateInput) startDateInput.value = "";
        if (endDateInput) endDateInput.value = "";
      }
    }
  }

  function toggleCalendar() {
    calendar.classList.toggle("active");
    if (calendar.classList.contains("active")) {
      renderCalendar();
    }
  }

  // Убедимся, что клик вне главного div закрывает календарь
  document.addEventListener("click", (event) => {
    console.log(event.target);
    if (!datePicker.contains(event.target)) {
      calendar.classList.remove("active");
    }
  });

  dateInput.addEventListener("click", (event) => {
    event.stopPropagation(); // Останавливаем всплытие клика
    toggleCalendar();
  });
}

// Инициализация
if (document.querySelector(".date-picker")) {
  initializeCalendar("calendar-range", "date-input-range", "range");
  document.addEventListener("click", (event) => {
    console.log(event.target);
     }
   );
}

});
