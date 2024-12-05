document.addEventListener('DOMContentLoaded', function () {
    // Проверяем, существует ли таблица с классом "table-archive"
    const table = document.querySelector('.table-archive');
    
    if (table) {
      // --- Работа с радиокнопками ---
      const radioButtons = table.querySelectorAll('input[type="radio"]');
      
      // Функция для добавления/удаления класса на строке при изменении состояния радио
      function toggleRowClass() {
        radioButtons.forEach(function (radioButton) {
          const row = radioButton.closest('tr'); // Находим родительскую строку <tr>
          
          // Если радио-кнопка выбрана, добавляем класс
          if (radioButton.checked) {
            row.classList.add('active-row');
          } else {
            row.classList.remove('active-row');
          }
        });
      }
  
      // Добавляем обработчик для каждого радио-кнопки
      radioButtons.forEach(function (radioButton) {
        radioButton.addEventListener('change', toggleRowClass);
      });
  
      // Вызов функции для начального состояния
      toggleRowClass();
  
      // --- Работа с чекбоксами в заголовке и строках ---
      // Находим чекбокс в заголовке
      const headerCheckbox = table.querySelector('th input[type="checkbox"]');
      
      // Находим все чекбоксы в строках таблицы
      const rowCheckboxes = table.querySelectorAll('tbody input[type="checkbox"]');
      
      // Функция для изменения состояния всех чекбоксов в зависимости от состояния чекбокса в заголовке
      function toggleCheckboxes() {
        const isChecked = headerCheckbox.checked; // Смотрим, выбран ли чекбокс в заголовке
        rowCheckboxes.forEach(function (checkbox) {
          checkbox.checked = isChecked; // Устанавливаем такое же состояние для всех чекбоксов в строках
        });
      }
  
      // Добавляем обработчик на изменение состояния чекбокса в заголовке
      if (headerCheckbox) {
        headerCheckbox.addEventListener('change', toggleCheckboxes);
      }
    }
  });
  