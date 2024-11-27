function DialogFast(appendto, id, title, width, height, content, buttons) {
    $.ajaxSetup({ cache: false });

    // Удаляем предыдущий диалог с таким же ID, если он существует
    $(`#wrapper-${id}`).remove();

    // Блокируем скролл
    $('body').addClass('no-scroll');

    // Создаем основной контейнер
    var dialogHtml = `
        <div class="dialog-wrapper" id="wrapper-${id}">
            <div class="dialog" id="${id}">
                <div class="ui-dialog-titlebar">
                    <span class="ui-dialog-title">${title}</span>
                    <button class="ui-dialog-titlebar-close" onclick="closeDialog('${id}')">✖</button>
                </div>
                <div class="ui-dialog-content">
                    ${content}
                </div>
                <div id="buttons">
                    ${buttons}
                </div>
            </div>
        </div>
    `;

    // Добавляем диалог в указанный контейнер
    $(appendto).append(dialogHtml);

    // Устанавливаем размеры для попапа
    $(`#${id}`).css({
        width: `${width}px`,
        height: height ? `${height}px` : 'auto',
    });
}

// Функция для закрытия диалога
function closeDialog(id) {
    $(`#wrapper-${id}`).remove(); // Удаляем обертку вместе с диалогом
    $('body').removeClass('no-scroll'); // Разблокируем скролл
}




