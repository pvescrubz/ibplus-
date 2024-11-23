document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
        // Найти следующий input по DOM-дереву
        const siblingInput = input.nextElementSibling;

        // Проверяем, что это действительно input
        if (siblingInput && siblingInput.tagName === 'INPUT' && siblingInput.type === 'text') {
            siblingInput.value = input.value; // Копируем значение
        }
    });
});
