function initializeCalendar(containerId, inputId, mode) {
  const dateInput = document.getElementById(inputId); // Поле для текстового диапазона
  const calendar = document.getElementById(containerId);

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  let startDate = new Date();
  let endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Завтра только при инициализации
  let displayedDate = new Date();

  // Установить начальные значения в input type="date" и текстовый input
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");

  if (startDateInput) startDateInput.value = formatDateForInput(startDate);
  if (endDateInput) endDateInput.value = formatDateForInput(endDate);
  if (dateInput) dateInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`; // Устанавливаем диапазон в текстовый input

  // Функция для генерации календаря
  function renderCalendar() {
    const calendarContent = document.createElement("div");
    calendarContent.className = "calendar-content";

    // Заголовок календаря
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

    // Заголовок дней недели
    const daysHeader = document.createElement("div");
    daysHeader.className = "calendar-days";
    daysOfWeek.forEach(day => {
      const dayElement = document.createElement("div");
      dayElement.textContent = day;
      daysHeader.appendChild(dayElement);
    });
    calendarContent.appendChild(daysHeader);

    // Дни месяца
    const daysContainer = document.createElement("div");
    daysContainer.className = "calendar-days";
    const firstDayOfMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(displayedDate.getFullYear(), displayedDate.getMonth() + 1, 0).getDate();

    // Пустые ячейки перед первым днем месяца
    for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
      daysContainer.appendChild(document.createElement("div"));
    }

    // Заполнение дней месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
      const dayElement = document.createElement("div");
      const dayText = document.createElement("span");
      dayText.textContent = day;
      dayText.classList.add("day-text");

      dayElement.className = "day";
      dayElement.appendChild(dayText);

      if (mode === "range") {
        // Логика выбора диапазона
        if (startDate && endDate) {
          if (date >= startDate && date <= endDate) {
            dayElement.classList.add("in-range");
          }
        }
        if (startDate && date.getTime() === startDate.getTime()) {
          dayElement.classList.add("selected-start");
        }
        if (endDate && date.getTime() === endDate.getTime()) {
          dayElement.classList.add("selected-end");
        }
      } else if (mode === "single" && startDate && date.getTime() === startDate.getTime()) {
        dayElement.classList.add("selected-start");
      }

      dayElement.onclick = () => selectDate(date);
      daysContainer.appendChild(dayElement);
    }
    calendarContent.appendChild(daysContainer);

    // Обновление содержимого календаря
    const existingContent = calendar.querySelector(".calendar-content");
    if (existingContent) {
      calendar.removeChild(existingContent);
    }
    calendar.appendChild(calendarContent);
  }

  // Функция для изменения месяца
  function changeMonth(offset) {
    displayedDate.setMonth(displayedDate.getMonth() + offset);
    renderCalendar();
  }

  // Функция для выбора даты или диапазона
  function selectDate(date) {
    const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  
    if (mode === "range") {
      if (!startDate || (startDate && endDate)) {
        startDate = utcDate;
        endDate = null;
        if (startDateInput) startDateInput.value = formatDateForInput(startDate);
        if (endDateInput) endDateInput.value = ""; // Очищаем конечную дату
      } else if (utcDate < startDate) {
        endDate = startDate;
        startDate = utcDate;
        if (startDateInput) startDateInput.value = formatDateForInput(startDate);
        if (endDateInput) endDateInput.value = formatDateForInput(endDate);
      } else {
        endDate = utcDate;
        if (endDateInput) endDateInput.value = formatDateForInput(endDate);
      }
  
      updateTextInput();
      renderCalendar();
    } else if (mode === "single") {
      startDate = utcDate;
      if (startDateInput) startDateInput.value = formatDateForInput(startDate);
      updateTextInput();
      toggleCalendar();
    }
  }

  // Форматирование даты для input type="date"
  function formatDateForInput(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
      .toISOString()
      .split("T")[0];
  }

  // Форматирование даты для текстового поля
  function formatDate(date) {
    return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  }

  // Обновление текстового input
  function updateTextInput() {
    if (dateInput) {
      if (startDate && endDate) {
        dateInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      } else if (startDate) {
        dateInput.value = `${formatDate(startDate)} - ...`;
      } else {
        dateInput.value = "Выберите диапазон";
      }
    }
  }

  // Открытие и закрытие календаря
  function toggleCalendar() {
    calendar.classList.toggle("active");
    renderCalendar();
  }

  // Закрытие при клике вне календаря
  window.addEventListener("click", (event) => {
    if (!calendar.contains(event.target) && event.target !== dateInput) {
      calendar.classList.remove("active");
    }
  });

  dateInput.addEventListener("click", toggleCalendar);
}

// Инициализация календарей
if (document.getElementById("calendar-range") && document.getElementById("date-input-range")) {
  initializeCalendar("calendar-range", "date-input-range", "range");
}
