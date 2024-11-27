// Получаем все формы на странице
const forms = document.querySelectorAll('form');

// Добавляем обработчик события для каждой формы
forms.forEach(form => {
    form.addEventListener('submit', function(e) {
        // Убираем стандартное поведение отправки формы
        e.preventDefault();
    });
});