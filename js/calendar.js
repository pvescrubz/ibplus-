function initializeCalendar(containerId, inputId, mode) {
  const dateInput = document.getElementById(inputId);
  const calendar = document.getElementById(containerId);

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
  const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
  let startDate = null;
  let endDate = null;
  let displayedDate = new Date();

  // Функция для генерации календаря
  function renderCalendar() {
    const calendarContent = document.createElement("div");
    calendarContent.className = "calendar-content";
    
    // Заголовок календар
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
        if (startDate && endDate && date >= startDate && date <= endDate) {
          dayElement.classList.add("in-range");
        }
        if (startDate && date.getTime() === startDate.getTime()) {
          dayElement.classList.add("selected-start");
        }
        if (endDate && date.getTime() === endDate.getTime()) {
          dayElement.classList.add("selected-end");
        }
      } else if (mode === "single" && startDate && date.getTime() === startDate.getTime()) {
        // Логика выбора одной даты
        dayElement.classList.add("selected-start");
      }

      dayElement.onclick = () => selectDate(date);
      daysContainer.appendChild(dayElement);
    }
    calendarContent.appendChild(daysContainer);

    // Плавное обновление содержимого календаря
    const existingContent = calendar.querySelector(".calendar-content");
    if (existingContent) {
      setTimeout(() => {
        calendar.removeChild(existingContent);
        calendar.appendChild(calendarContent);
      }, 300);
    } else {
      calendar.appendChild(calendarContent);
    }
  }

  // Функция для изменения месяца
  function changeMonth(offset) {
    displayedDate.setMonth(displayedDate.getMonth() + offset);
    renderCalendar();
  }

  // Функция для выбора даты или диапазона
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
      
      updateInput();
      if (startDate && endDate) {
        toggleCalendar(); // Закрываем календарь после выбора диапазона
      } else {
        renderCalendar();
      }
    } else if (mode === "single") {
      startDate = date;
      updateInput();
      toggleCalendar(); // Закрываем календарь после выбора даты
    }
  }

  // Обновление поля ввода
  function updateInput() {
    if (mode === "range") {
      if (startDate && endDate) {
        dateInput.value = `${formatDate(startDate)} - ${formatDate(endDate)}`;
      } else if (startDate) {
        dateInput.value = `${formatDate(startDate)} - ...`;
      } else {
        dateInput.value = "Выберите диапазон";
      }
    } else if (mode === "single" && startDate) {
      dateInput.value = formatDate(startDate);
    }
  }

  // Форматирование даты
  function formatDate(date) {
    return date.toLocaleDateString("ru-RU", { day: '2-digit', month: '2-digit', year: 'numeric' });
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

  window.addEventListener('scroll', function() {
    if (!calendar.contains(event.target) && event.target !== dateInput) {
      calendar.classList.remove("active");
    }
  });


  dateInput.addEventListener("click", toggleCalendar);
}

// Инициализация календарей
initializeCalendar("calendar-range", "date-input-range", "range");  // Для выбора диапазона
// initializeCalendar("calendar-single", "date-input-single", "single");  // Для выбора одной даты
