document.addEventListener("DOMContentLoaded", () => {
  function initializeCalendar(containerId, inputId, mode) {
    const datePicker = document.querySelector(".date-picker");
    const dateInput = document.getElementById(inputId);
    const calendar = document.getElementById(containerId);
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    let startDate = new Date();
    let endDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let displayedDate = new Date();
    let datesSelected = false; // Флаг, указывающий на выбор обеих дат

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

        // Добавление классов для диапазона дат
        if (datesSelected && startDate && endDate && date >= startDate && date <= endDate) {
          dayElement.classList.add("in-range");
        }

        // Класс для начальной и конечной дат
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
          datesSelected = false; // Пока обе даты не выбраны
          updateTextInput();
        } else if (date < startDate) {
          // Если вторая выбранная дата меньше первой, меняем местами
          endDate = startDate;
          startDate = date;
          datesSelected = true; // Обе даты выбраны
          updateTextInput();
    
          toggleCalendar(); // Закрываем календарь
        } else {
          endDate = date;
          datesSelected = true; // Обе даты выбраны
          updateTextInput();
    
          if (startDate && endDate) {
            toggleCalendar(); // Закрываем календарь
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

          dateInput.value = `${formattedStartDate} - ${formattedEndDate}`;

          if (startDateInput) startDateInput.value = formatDateForInput(startDate);
          if (endDateInput) endDateInput.value = formatDateForInput(endDate);
        } else if (startDate) {
          const formattedStartDate = formatDate(startDate);
          dateInput.value = `${formattedStartDate} - ...`;

          if (startDateInput) startDateInput.value = formatDateForInput(startDate);
          if (endDateInput) endDateInput.value = "";
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

    dateInput.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleCalendar();
    });
  }

  if (document.querySelector(".date-picker")) {
    initializeCalendar("calendar-range", "date-input-range", "range");
  }
});
