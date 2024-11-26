document.addEventListener("DOMContentLoaded", () => {
  function initializeCalendar(datePicker) {
    const dateInput = datePicker.querySelector(".input-main");
    const calendar = datePicker.querySelector(".calendar");
    const hiddenDateInputs = datePicker.querySelectorAll('input[type="date"]');
    const mode = datePicker.dataset.mode || "single"; // Определение режима (range или single)

    const monthNames = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    let displayedDate = new Date();
    let startDate = null;
    let endDate = null;
    let userInteracted = false; // Флаг для отслеживания выбора пользователем

    function formatToInputDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    function formatToDisplayDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    function initializeDates() {
      if (hiddenDateInputs[0] && hiddenDateInputs[0].value) {
        startDate = new Date(hiddenDateInputs[0].value);
      }

      if (mode === "range" && hiddenDateInputs[1] && hiddenDateInputs[1].value) {
        endDate = new Date(hiddenDateInputs[1].value);
      }

      updateTextInput();
    }

    function updateTextInput() {
      if (dateInput) {
        if (mode === "range") {
          if (startDate && endDate) {
            dateInput.value = `${formatToDisplayDate(startDate)} - ${formatToDisplayDate(endDate)}`;
            hiddenDateInputs[0].value = formatToInputDate(startDate);
            hiddenDateInputs[1].value = formatToInputDate(endDate);
          } else if (startDate) {
            dateInput.value = `${formatToDisplayDate(startDate)} - ...`;
            hiddenDateInputs[0].value = formatToInputDate(startDate);
            if (hiddenDateInputs[1]) hiddenDateInputs[1].value = "";
          } else {
            dateInput.value = "Выберите диапазон";
            hiddenDateInputs.forEach((input) => (input.value = ""));
          }
        } else if (mode === "single") {
          if (startDate) {
            dateInput.value = formatToDisplayDate(startDate);
            hiddenDateInputs[0].value = formatToInputDate(startDate);
          } else {
            dateInput.value = "Выберите дату";
            hiddenDateInputs[0].value = "";
          }
        }
      }
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
      monthDisplay.textContent = `${monthNames[displayedDate.getMonth()]} ${displayedDate.getFullYear()}`;

      header.appendChild(prevButton);
      header.appendChild(monthDisplay);
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

        // Класс для начальной даты
        if (startDate && date.getTime() === startDate.getTime()) {
          dayElement.classList.add("selected-start");
          if (mode === "range") dayElement.classList.add("in-range");
        }

        // Класс для конечной даты
        if (mode === "range" && endDate && date.getTime() === endDate.getTime()) {
          dayElement.classList.add("selected-end", "in-range");
        }

        // Класс для дней внутри диапазона (только для режима range)
        if (
          userInteracted &&
          mode === "range" &&
          startDate &&
          endDate &&
          date > startDate &&
          date < endDate
        ) {
          dayElement.classList.add("in-range");
        }

        dayElement.onclick = (event) => {
          event.stopPropagation();
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

    function selectDate(date) {
      if (mode === "range") {
        userInteracted = true;
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

  // Инициализация всех календарей с классом .date-picker
  const datePickers = document.querySelectorAll(".date-picker");
  datePickers.forEach((datePicker) => {
    initializeCalendar(datePicker);
  });
});
