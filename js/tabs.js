document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.grid-btn:not(.more)'); // Кнопки страниц
    const pages = document.querySelectorAll('.vipiska_tabs_content'); // Страницы контента
    const moreBtn = document.querySelector('.grid-btn.more'); // Кнопка "вперед"
  

    
    function switchToPage(tabIndex) {
      // Убираем класс "active" у всех вкладок и страниц
      tabs.forEach(tab => tab.classList.remove('active'));
      pages.forEach(page => page.classList.remove('active'));
  
      // Находим вкладку и страницу по атрибуту data-tab и делаем их активными
      const targetTab = document.querySelector(`.grid-btn[data-tab="${tabIndex}"]`);
      const targetPage = document.querySelector(`.vipiska_tabs_content[data-tab="${tabIndex}"]`);
  
      if (targetTab && targetPage) {
        targetTab.classList.add('active');
        targetPage.classList.add('active');
      }
    }
  
    // Обработчик для кнопок вкладок
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const tabIndex = tab.getAttribute('data-tab'); // Получаем индекс из data-tab
        switchToPage(tabIndex); // Переключаемся на выбранную страницу
      });
    });
  
    // Обработчик для кнопки "вперед"
    moreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const activeTab = document.querySelector('.grid-btn.active'); // Текущая активная вкладка
      let nextTabIndex = parseInt(activeTab.getAttribute('data-tab')) + 1; // Следующая страница
  
      // Если достигли последней страницы, возвращаемся к первой
      if (nextTabIndex > tabs.length) {
        nextTabIndex = 1;
      }
  
      switchToPage(nextTabIndex); // Переключаемся на следующую страницу
    });
  
    // Инициализация: делаем первую страницу активной при загрузке
    switchToPage(1);
  });
  