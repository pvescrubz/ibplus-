document.addEventListener("DOMContentLoaded", () => {
  function initializeCalendar(datePicker) {
    const dateInput = datePicker.querySelector(".input-main");
    const calendar = datePicker.querySelector(".calendar");
    const hiddenDateInputs = datePicker.querySelectorAll(".form-hidden input");
    const mode = datePicker.dataset.mode || "single";

    const monthNames = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    let displayedDate = new Date();
    let startDate = null;
    let endDate = null;

    function parseFromDisplayDate(dateStr) {
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, day);
    }

    function formatToInputDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    function initializeDates() {
      if (hiddenDateInputs[0] && hiddenDateInputs[0].value) {
        const startValue = hiddenDateInputs[0].value;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(startValue)) {
          startDate = parseFromDisplayDate(startValue);
        }
      }

      if (mode === "range" && hiddenDateInputs[1] && hiddenDateInputs[1].value) {
        const endValue = hiddenDateInputs[1].value;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(endValue)) {
          endDate = parseFromDisplayDate(endValue);
        }
      }

      updateTextInput();
    }

    function updateTextInput() {
      if (dateInput) {
        if (mode === "range") {
          if (startDate && endDate) {
            dateInput.value = `${formatToInputDate(startDate)} - ${formatToInputDate(endDate)}`;
            hiddenDateInputs[0].value = formatToInputDate(startDate);
            hiddenDateInputs[1].value = formatToInputDate(endDate);
          } else if (startDate) {
            dateInput.value = `${formatToInputDate(startDate)} - ...`;
            hiddenDateInputs[0].value = formatToInputDate(startDate);
            hiddenDateInputs[1].value = "";
          } else {
            dateInput.value = "Выберите диапазон";
            hiddenDateInputs.forEach((input) => (input.value = ""));
          }
        } else if (mode === "single") {
          if (startDate) {
            dateInput.value = formatToInputDate(startDate);
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
      monthDisplay.textContent = `${monthNames[displayedDate.getMonth()]}`;

      // Выпадающий список для года
      const yearDropdownContainer = document.createElement("div");
      yearDropdownContainer.className = "year-dropdown-container";

      const yearDisplay = document.createElement("span");
      yearDisplay.className = "year-display";
      yearDisplay.textContent = displayedDate.getFullYear();
      yearDropdownContainer.appendChild(yearDisplay);

      const yearDropdown = document.createElement("div");
      yearDropdown.className = "year-dropdown";
      
      // Устанавливаем диапазон от 2000 до текущего года
      const startYear = 2000;
      const endYear = new Date().getFullYear();
      
      for (let year = startYear; year <= endYear; year++) {
        const yearOption = document.createElement("div");
        yearOption.className = "year-option";
        yearOption.textContent = year;
      
        yearOption.addEventListener("click", (event) => {
          event.stopPropagation();
          displayedDate.setFullYear(year);
          renderCalendar();
          yearDropdown.classList.remove("active");
        });
      
        yearDropdown.appendChild(yearOption);
      }

      yearDisplay.addEventListener("click", (event) => {
        event.stopPropagation();
        yearDropdown.classList.toggle("active");
      });

      yearDropdownContainer.appendChild(yearDropdown);

      header.appendChild(prevButton);
      header.appendChild(monthDisplay);
      header.appendChild(yearDropdownContainer);
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

      // Пустые дни перед началом месяца
      for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
      }

      // Дни месяца
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(displayedDate.getFullYear(), displayedDate.getMonth(), day);
        const dayElement = document.createElement("div");
        dayElement.className = "day";

        const dayText = document.createElement("span");
        dayText.className = "day-text";
        dayText.textContent = day;

        dayElement.appendChild(dayText);

        // Проверяем начальную и конечную дату
        if (startDate && date.toDateString() === startDate.toDateString()) {
          dayElement.classList.add("selected-start");
        }

        if (mode === "range" && endDate && date.toDateString() === endDate.toDateString()) {
          dayElement.classList.add("selected-end");
        }

        // Класс для диапазона
        if (mode === "range" && startDate && endDate && date > startDate && date < endDate) {
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
        if (!startDate || (startDate && endDate)) {
          // Устанавливаем начальную дату, сбрасываем конечную
          startDate = date;
          endDate = null;
        } else if (date < startDate) {
          // Если выбранная дата раньше начальной, меняем их местами
          endDate = startDate;
          startDate = date;
        } else {
          // Устанавливаем конечную дату
          endDate = date;
    
          // Закрываем календарь после выбора обеих дат
          toggleCalendar(false);
        }
        updateTextInput();
        renderCalendar();
      } else if (mode === "single") {
        startDate = date;
        updateTextInput();
        toggleCalendar(false); // Закрываем календарь после выбора одной даты
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
    initializeCalendar(datePicker);
  });
});
