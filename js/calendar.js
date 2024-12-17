document.addEventListener("DOMContentLoaded", () => {
  /**
   * Инициализация календаря для каждого элемента `.date-picker`.
   * @param {HTMLElement} datePicker - Корневой элемент компонента календаря.
   */
  function initializeCalendar(datePicker) {
    const dateInput = datePicker.querySelector(".input-main");
    const calendar = datePicker.querySelector(".calendar");
    const hiddenDateInputs = datePicker.querySelectorAll(".form-hidden input");
    const mode = datePicker.dataset.mode || "single"; // Определяем режим: выбор одной даты или диапазона.

    const monthNames = [
      "Январь",
      "Февраль",
      "Март",
      "Апрель",
      "Май",
      "Июнь",
      "Июль",
      "Август",
      "Сентябрь",
      "Октябрь",
      "Ноябрь",
      "Декабрь",
    ];
    const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

    let displayedDate = new Date(); // Дата, отображаемая на календаре.
    let startDate = null; // Начальная дата для выбора.
    let endDate = null; // Конечная дата для диапазона.

    /**
     * Преобразование даты из строки в формате `dd.mm.yyyy` в объект `Date`.
     * @param {string} dateStr - Строка с датой.
     * @returns {Date} Объект даты.
     */
    function parseFromDisplayDate(dateStr) {
      const [day, month, year] = dateStr.split(".").map(Number);
      return new Date(year, month - 1, day);
    }

    // Обработка события "input" для каждого скрытого поля.
    hiddenDateInputs.forEach((input) => {
      input.addEventListener("input", () => {
        initializeDates();
        renderCalendar();
      });
    });

    /**
     * Форматирование объекта `Date` в строку `dd.mm.yyyy`.
     * @param {Date} date - Объект даты.
     * @returns {string} Строка в формате `dd.mm.yyyy`.
     */
    function formatToInputDate(date) {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }

    /**
     * Инициализация начальной и конечной даты из скрытых полей.
     */
    function initializeDates() {
      if (hiddenDateInputs[0] && hiddenDateInputs[0].value) {
        const startValue = hiddenDateInputs[0].value;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(startValue)) {
          startDate = parseFromDisplayDate(startValue);
        }
      }

      if (
        mode === "range" &&
        hiddenDateInputs[1] &&
        hiddenDateInputs[1].value
      ) {
        const endValue = hiddenDateInputs[1].value;
        if (/^\d{2}\.\d{2}\.\d{4}$/.test(endValue)) {
          endDate = parseFromDisplayDate(endValue);
        }
      }

      updateTextInput();
    }

    /**
     * Обновление текстового поля и скрытых полей на основе выбранных дат.
     */
    function updateTextInput() {
      if (dateInput) {
        if (mode === "range") {
          if (startDate && endDate) {
            dateInput.value = `${formatToInputDate(
              startDate
            )} - ${formatToInputDate(endDate)}`;
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

    /**
     * Отображение календаря, включая заголовок, дни недели и дни месяца.
     */
    function renderCalendar() {
      const calendarContent = document.createElement("div");
      calendarContent.className = "calendar-content";

      const header = document.createElement("div");
      header.className = "calendar-header";

      // Кнопка для переключения на предыдущий месяц.
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

      // Кнопка для переключения на следующий месяц.
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

      // Выпадающий список для выбора года.
      const yearDropdownContainer = document.createElement("div");
      yearDropdownContainer.className = "year-dropdown-container";

      const yearDisplay = document.createElement("span");
      yearDisplay.className = "year-display";
      yearDisplay.textContent = displayedDate.getFullYear();
      yearDropdownContainer.appendChild(yearDisplay);

      const yearDropdown = document.createElement("div");
      yearDropdown.className = "year-dropdown";

      // Генерация списка лет для выбора.
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

      // Добавление пустых ячеек перед первым днем месяца.
      const firstDayOfMonth = new Date(
        displayedDate.getFullYear(),
        displayedDate.getMonth(),
        1
      ).getDay();
      const daysInMonth = new Date(
        displayedDate.getFullYear(),
        displayedDate.getMonth() + 1,
        0
      ).getDate();

      for (let i = 0; i < (firstDayOfMonth + 6) % 7; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
      }

      // Генерация ячеек для дней месяца.
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(
          displayedDate.getFullYear(),
          displayedDate.getMonth(),
          day
        );
        const dayElement = document.createElement("div");
        dayElement.className = "day";

        const dayText = document.createElement("span");
        dayText.className = "day-text";
        dayText.textContent = day;

        dayElement.appendChild(dayText);

        // Добавление классов для выделения выбранных дат.
        if (startDate && date.toDateString() === startDate.toDateString()) {
          dayElement.classList.add("selected-start");
        }

        if (
          mode === "range" &&
          endDate &&
          date.toDateString() === endDate.toDateString()
        ) {
          dayElement.classList.add("selected-end");
        }

        if (
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

    /**
     * Логика выбора даты или диапазона.
     * @param {Date} date - Выбранная дата.
     */
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
          toggleCalendar(false); // Закрываем календарь после выбора диапазона.
        }
        updateTextInput();
        renderCalendar();
      } else if (mode === "single") {
        startDate = date;
        updateTextInput();
        toggleCalendar(false); // Закрываем календарь после выбора даты.
      }
    }

    /**
     * Переключение отображения календаря (открытие/закрытие).
     * @param {boolean|null} state - Опционально: состояние календаря (true - открыть, false - закрыть).
     */
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

    // Обработчик открытия календаря по клику на текстовое поле.
    dateInput.addEventListener("click", (event) => {
      if (datePicker.classList.contains("disabled-form-btn")) {
        event.stopPropagation();
        return; // Блокируем дальнейшую обработку, если элемент отключен.
      }
      toggleCalendar();
    });

    // Закрытие календаря при клике вне его области.
    document.addEventListener("click", (event) => {
      if (
        calendar.classList.contains("active") &&
        !datePicker.contains(event.target)
      ) {
        toggleCalendar(false);
      }
    });

    // Предотвращение закрытия календаря при клике внутри него.
    calendar.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    initializeDates(); // Инициализация начальных данных.
  }

  // Инициализация календарей для всех элементов с классом `date-picker`.
  const datePickers = document.querySelectorAll(".date-picker");
  datePickers.forEach((datePicker) => {
    initializeCalendar(datePicker);
  });
});

function dateUpdateHiddenInput() {
  const hiddenEndDate2 = document.querySelector(".hidden-end-date-disabled");
  hiddenEndDate2.value = "22.11.2011";
}

function dateUpdate() {
  [document.querySelector(".hidden-end-date-disabled"), document.querySelector(".hidden-start-date-disabled")]
  .filter(Boolean) 
  .forEach(el => el.dispatchEvent(new Event("input") )); // Вызываем событие input т.к на него подписали слушатель изменения даты в скрытом инпуте
}

const checkbox = document.getElementById('input7'); // Идентификатор чекбокса СРОЧНОСТЬ
const needBlock = document.getElementById('need_block'); // Контейнер для календаря (Сюда добавляется ID элемента календаря , чтобы определить что его нужно заблокировать)

// Добавляем слушатель события "change" для чекбокса
checkbox.addEventListener('change', function () {
    if (checkbox.checked) {
        // Удаляем класс disabled-form-btn
        needBlock.classList.add('disabled-form-btn');
    } else {
        // Добавляем класс disabled-form-btn
        needBlock.classList.remove('disabled-form-btn');
    }
});