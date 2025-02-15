document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popup'); // Контейнер попапа
  const popupClose = document.getElementById('popup-close_vipiska'); // Кнопка закрытия попапа
  const popupData = document.getElementById('popup-data_vipiska'); // Контейнер для данных внутри попапа

  // Проверяем наличие попапа и его элементов
  if (!popup || !popupClose || !popupData) {
    return; // Если отсутствуют важные элементы, прекращаем выполнение
  }



  
  
  /**
   * Скрипт для таблицы с <tr> и <td>.
   */

  function handleDoubleHeaderRows() {
    const doubleHeaderTables = document.querySelectorAll('.double-header-table .pointered');

    doubleHeaderTables.forEach(row => {
      row.addEventListener('click', (event) => {
        // Проверяем, что клик был на <td class="pointer">
        if (!event.target.classList.contains('pointer')) {
          return;
        }
        // Получаем заголовки из двух строк
        const firstHeaderRow = row.closest('table').querySelectorAll('tr:nth-child(1) th');
        const secondHeaderRow = row.closest('table').querySelectorAll('tr:nth-child(2) th');

        // Объединяем заголовки из двух строк
        const headers = Array.from(firstHeaderRow).map(th => th.textContent.trim())
          .concat(Array.from(secondHeaderRow).map(th => th.textContent.trim()));

        // Получаем все ячейки, исключая ячейки с классом 'pointer' и 'tablet-mobile'
        const dataCells = Array.from(row.querySelectorAll('td')).filter(cell =>
          !cell.classList.contains('pointer') &&
          !cell.classList.contains('tablet-mobile')
        );

        // Очищаем попап перед заполнением
        popupData.innerHTML = '';

        // Заполняем попап данными
        dataCells.forEach((cell, index) => {
          let header;

          if (index === 3) {
            header = 'Максимум (за период 7 дней)';
          } else if (index === 5) {
            header = 'Максимум (В день по номеру моб. телефона)';
          }
          else if (index === 4) {
            header = 'Максимум (В день)';
          }
          else {
            header = headers[index] || `Колонка ${index + 1}`;
          } 
          const value = extractCellValue(cell);




          if (header && value) {
            const field = document.createElement('div');
            field.classList.add('popup-item_vipiska');
            field.innerHTML = `<p class="popup-title">${header}:</p> <span class="popup-descr-vipiska">${value}</span>`;
            popupData.appendChild(field);
          }
        });

        // Показываем попап
        popup.style.display = 'flex';
        document.body.classList.add('no-scroll');
      });
    });
  }

  /**
   * Вспомогательная функция для извлечения значения из ячейки
   */
  function extractCellValue(cell) {
    if (cell.querySelector('img')) {
      return cell.querySelector('img').getAttribute('title') || '';
    } else if (cell.querySelector('a')) {
      return cell.querySelector('a').textContent.trim();
    } else {
      return cell.textContent.trim();
    }
  }

  function extractSvgCellValue(cell) {
    if (cell.querySelector('a')) {
      const link = cell.querySelector('a');
      const href = link.getAttribute('href') || '#'; // Получаем href ссылки
      const svgContent = link.innerHTML.trim(); // Получаем содержимое внутри <a> (включая SVG)
      return `<a href="${href}" target="_blank">${svgContent}</a>`; // Возвращаем полный HTML
    }
    return ''; // Если нет ссылки, возвращаем пустую строку
  }

  // Инициализируем обработку таблиц с двойными заголовками
  if (document.querySelector('.double-header-table')) {
    handleDoubleHeaderRows();
  }
  function handleTableRows() {
    
    const tablePointerRows = document.querySelectorAll('.pointer'); // Строки таблицы с классом 'pointer'
    const tableHeaders = document.querySelectorAll('.grid-archive th'); // Заголовки таблицы
  
    // Проверка наличия строк и заголовков таблицы
    if (!tablePointerRows.length || !tableHeaders.length) {
      return;
    }
  
    // Получаем текстовые значения заголовков таблицы, начиная с 3-го столбца
    const headers = Array.from(tableHeaders)
      .slice(2, -1) // Заголовки с 3 по предпоследний
      .map(header => header.textContent.trim());
  
    tablePointerRows.forEach(pointerRow => {
      pointerRow.addEventListener('click', () => {
        // Получаем ячейки текущей строки, начиная с 3-й и заканчивая предпоследней
        const cells = Array.from(pointerRow.closest('tr').querySelectorAll('td')).slice(2, -1);
  
        // Очищаем контейнер попапа
        popupData.innerHTML = '';
  
        // Заполняем попап данными из строки
        cells.forEach((cell, index) => {
          const header = headers[index];
          let value;
  
          if (cell.querySelector('img')) {
            value = cell.querySelector('img').getAttribute('title'); // Берем title изображения
          } else if (cell.querySelector('a')) {
            value = cell.querySelector('a').textContent.trim(); // Берем текст ссылки
          } else {
            value = cell.textContent.trim(); // Иначе берем текст ячейки
          }
  
          // Добавляем данные в попап
          if (header && value) {
            const field = document.createElement('div');
            field.classList.add('popup-item_vipiska');
            field.innerHTML = `<p class="popup-title">${header}:</p> <span class="popup-descr-vipiska">${value}</span>`;
            popupData.appendChild(field);
          }
        });
  
        // Показываем попап
        popup.style.display = 'flex';
        document.body.classList.toggle('no-scroll');
      });
    });
  }

  /**
   * Скрипт для таблицы через <ul> и <li>.
   */
  function handleDivRows() {

    const showMoreButtons = document.querySelectorAll('.show_more-btn'); // Кнопки "Показать больше"
    const gridHead = document.querySelector('.grid-head'); // Заголовки таблицы

    // Получаем заголовки из grid-head, исключая элементы с data-not-count="true"
  const headers = Array.from(
    gridHead.querySelectorAll('.grid-cell:not(.show_more-btn)')
  )
    .filter(header => !header.hasAttribute('data-not-count')) // Исключаем по атрибуту
    .map(header => header.textContent.trim());

  showMoreButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const li = button.closest('li'); // Находим родительский li
      if (li) {
        // Получаем ячейки данных из li, исключая кнопки и элементы с data-not-count="true"
        const dataCells = Array.from(li.querySelectorAll('.grid-cell')).filter(cell =>
          !cell.classList.contains('show_more-btn') &&
          !cell.hasAttribute('data-not-count')
        );

        // Очищаем предыдущие данные в попапе
        popupData.innerHTML = '';

        // Формируем поля попапа
        headers.forEach((header, index) => {
          const value = dataCells[index]?.textContent.trim() || ''; // Берем значение из текущего li
          if (header) { // Проверяем, чтобы header не был пустым
            const field = document.createElement('div');
            field.classList.add('popup-item_vipiska');
            field.innerHTML = `<p class="popup-title">${header}:</p> <span class="popup-descr-vipiska">${value}</span>`;
            popupData.appendChild(field);
          }
        });

        // Показываем попап
        popup.style.display = 'flex';
        document.body.classList.toggle('no-scroll');
      }
    });
  });
  }

  // Инициализируем обе функции
 

  if (document.querySelector('.grid-archive')) {
    handleTableRows();
  }
  if (document.querySelector('.grid-table')) {
    handleDivRows();
  }
  function handleForeignArchiveTable() {
    const foreignTables = document.querySelectorAll('.foreign-archive');
  
    foreignTables.forEach((table) => {
      // Получаем заголовки (ТОЛЬКО нужные столбцы)
      const tableHeaders = Array.from(table.querySelectorAll('th'))
        .map((header) => header.textContent.trim()) // Получаем текст заголовков
        .filter((text) => text !== ""); // Исключаем пустые заголовки
  
      const tableRows = table.querySelectorAll('.pointered');
  
      tableRows.forEach((row) => {
        row.addEventListener('click', (event) => {
          // Проверяем, что клик был ТОЛЬКО на .pointer
          if (!event.target.classList.contains('pointer')) {
            return;
          }
  
          // Получаем ячейки, исключая radio-кнопку и ПОСЛЕДНИЙ столбец (`...`)
          const dataCells = Array.from(row.querySelectorAll('td'))
            .filter((cell, index, arr) => 
              !cell.classList.contains('radio_container1') && index < arr.length - 1 // Исключаем последний
            );
  
          // Очищаем попап перед заполнением
          popupData.innerHTML = '';
  
          // Заполняем попап данными, БЕЗ последней колонки
          dataCells.forEach((cell, index) => {
            const header = tableHeaders[index] || `Колонка ${index + 1}`;
            const value = extractCellValue(cell);
  
            if (header && value) {
              const field = document.createElement('div');
              field.classList.add('popup-item_vipiska');
              field.innerHTML = `<p class="popup-title">${header}:</p> <span class="popup-descr-vipiska">${value}</span>`;
              popupData.appendChild(field);
            }
          });
  
          // Показываем попап
          popup.style.display = 'flex';
          document.body.classList.add('no-scroll');
        });
      });
    });
  }

  if (document.querySelector('.foreign-archive')) {
    handleForeignArchiveTable();
  }

  function handlemailArchiveTable() {
    const tables = document.querySelectorAll('.mail-archive'); // Находим все таблицы с нужными классами
  
    tables.forEach((table) => {
      // Получаем заголовки таблицы
      const headers = Array.from(table.querySelectorAll('th.grid_colored.archive-title-th.text_bold'))
        .map(header => header.textContent.trim());
  
      // Обрабатываем строки с данными (класс "pointered")
      table.querySelectorAll('tr.pointered').forEach((row) => {
        row.addEventListener('click', (event) => {
          if (!event.target.classList.contains('pointer')) return; // Проверяем, что клик был на элементе с классом "pointer"
  
          // Очищаем контейнер данных попапа
          popupData.innerHTML = '';
  
          // Получаем ячейки текущей строки, исключая ненужные столбцы
          const cells = Array.from(row.querySelectorAll('td'))
            .filter((cell, index) => index >= 2 && index <= 5); // Берем только нужные столбцы (Дата, Номер, Тема, Вложения)
  
          // Формируем данные для попапа
          cells.forEach((cell, index) => {
            const header = headers[index];
  
            let value;
            if (header === 'Вложения') {
              // Используем специальную функцию для обработки SVG
              value = extractSvgCellValue(cell);
            } else {
              // Для остальных ячеек используем оригинальную функцию
              value = extractCellValue(cell);
            }
  
            if (header && value !== 'Нет данных' && value !== '') {
              const field = document.createElement('div');
              field.classList.add('popup-item_vipiska');
  
              if (value.includes('<a')) {
                // Если значение содержит ссылку, добавляем как HTML
                field.innerHTML = `
                  <p class="popup-title">${header}:</p> 
                  <span class="popup-descr-vipiska">${value}</span>
                `;
              } else {
                // Иначе просто добавляем текст
                field.innerHTML = `
                  <p class="popup-title">${header}:</p> 
                  <span class="popup-descr-vipiska">${value}</span>
                `;
              }
  
              popupData.appendChild(field);
            }
          });
  
          // Показываем попап
          popup.style.display = 'flex';
          document.body.classList.add('no-scroll');
        });
      });
    });
  }

  if (document.querySelector('.mail-archive')) {
    handlemailArchiveTable();
  }
  // Закрытие попапа
  popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
    document.body.classList.toggle('no-scroll');
  });

  // Закрытие попапа при клике вне контента
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
      document.body.classList.toggle('no-scroll');
    }
  });
});
