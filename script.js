// Функция для создания селектора количества билетов
function createTicketSelector(buttonId, priceId, subtotalId, ticketType) {
    const buttonElement = document.getElementById(buttonId);
    if (!buttonElement) {
        console.log(`Элемент ${buttonId} не найден`);
        return;
    }

    // Очищаем содержимое и создаем select
    buttonElement.innerHTML = '';
    const select = document.createElement('select');
    select.className = 'ticket-quantity-select';
    select.id = `select-${ticketType}`;

    // Создаем опции от 0 до 10
    for (let i = 0; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i === 0 ? '0' : i;
        select.appendChild(option);
    }

    // Добавляем select в элемент
    buttonElement.appendChild(select);

    // Обработчик изменения количества
    select.addEventListener('change', function() {
        const quantity = parseInt(this.value);
        console.log(`Выбрано ${quantity} билетов типа ${ticketType}`);
        
        // Получаем цену
        const priceElement = document.getElementById(priceId);
        if (!priceElement) {
            console.log(`Элемент цены ${priceId} не найден`);
            return;
        }
        
        const priceText = priceElement.textContent || priceElement.innerText || '0';
        const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
        console.log(`Цена за билет: ${price}`);
        
        // Рассчитываем общую стоимость
        const total = quantity * price;
        console.log(`Общая стоимость: ${total}`);
        
        // Обновляем subtotal
        const subtotalElement = document.getElementById(subtotalId);
        if (subtotalElement) {
            subtotalElement.textContent = total.toFixed(2);
        }
        
        // Сохраняем в bookingData
        if (!bookingData.tickets) {
            bookingData.tickets = {};
        }
        bookingData.tickets[ticketType] = {
            quantity: quantity,
            price: price,
            total: quantity * price
        };
        
        // Обновляем общую сумму
        updateTotalPrice();
    });
    
    console.log(`Селектор для ${ticketType} создан успешно`);
}