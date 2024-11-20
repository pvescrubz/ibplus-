document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup'); // Контейнер попапа
    const popupClose = document.getElementById('popup-close_vipiska'); // Кнопка закрытия попапа
    const popupData = document.getElementById('popup-data_vipiska'); // Контейнер для данных
    const showMoreButtons = document.querySelectorAll('.show_more-btn'); // Кнопки "Показать больше"
  
    // Получаем заголовки из grid-head
    const headers = Array.from(document.querySelector('.grid-head').querySelectorAll('.grid-cell:not(.show_more-btn)'))
      .map(header => header.textContent.trim());
  
    showMoreButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const li = button.closest('li'); // Находим родительский li
        if (li) {
          const dataCells = Array.from(li.querySelectorAll('.grid-cell')).filter(cell => !cell.classList.contains('show_more-btn')); // Исключаем кнопку
  
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
  