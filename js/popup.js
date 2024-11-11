// Открытие окна настроек при клике на кнопку
// Открытие окна настроек при клике на кнопку
document.querySelectorAll('[data-btn="settings_btn"]').forEach(button => {
    button.addEventListener('click', function(event) {
      event.stopPropagation(); // Останавливаем всплытие, чтобы избежать немедленного закрытия
      document.querySelector('.settings_content').style.display = 'flex';
    });
  });
  
  // Закрытие окна при клике вне его области
  document.addEventListener('click', function(event) {
    const settingsContent = document.querySelector('.settings_content');
  
    // Проверяем, открыт ли попап и что клик не внутри окна настроек
    if (
      settingsContent.style.display === 'flex' &&
      !settingsContent.contains(event.target) &&
      !event.target.closest('[data-btn="settings_btn"]')
    ) {
      settingsContent.style.display = 'none';
    }
  });
  
  // Закрытие окна при начале скролла
  window.addEventListener('scroll', function() {
    const settingsContent = document.querySelector('.settings_content');
    if (settingsContent.style.display === 'flex') {
      settingsContent.style.display = 'none';
    }
  });
  
  


