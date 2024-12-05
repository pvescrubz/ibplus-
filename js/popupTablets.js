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
  function handleTableRows() {
    const tablePointerRows = document.querySelectorAll('.grid-archive .pointer'); // Строки таблицы с классом 'pointer'
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


  // Закрытие попапа
  popupClose.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  // Закрытие попапа при клике вне контента
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.style.display = 'none';
    }
  });
});
