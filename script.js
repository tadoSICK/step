// Функция для создания селекторов количества билетов
function createTicketSelector(buttonId, priceId, subtotalId, ticketType) {
    const button = document.getElementById(buttonId);
    const priceElement = document.getElementById(priceId);
    const subtotalElement = document.getElementById(subtotalId);
    
    if (!button || !priceElement || !subtotalElement) {
        console.log(`Элементы не найдены для ${ticketType}`);
        return;
    }
    
    // Создаем select элемент
    const select = document.createElement('select');
    select.className = 'ticket-quantity-select';
    select.id = `${ticketType}-quantity`;
    
    // Добавляем опции от 0 до 10
    for (let i = 0; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }
    
    // Заменяем содержимое кнопки на select
    button.innerHTML = '';
    button.appendChild(select);
    
    // Обработчик изменения количества
    select.addEventListener('change', function() {
        const quantity = parseInt(this.value);
        const price = parseFloat(priceElement.textContent.replace(/[^\d.]/g, '')) || 0;
        const subtotal = quantity * price;
        
        // Обновляем subtotal
        subtotalElement.textContent = subtotal.toFixed(2);
        
        // Сохраняем в глобальном объекте
        bookingData.tickets[ticketType] = quantity;
        
        // Обновляем общую сумму
        updateTotalPrice();
        
        console.log(`${ticketType}: количество=${quantity}, цена=${price}, итого=${subtotal}`);
    });
}

// Функция для обновления общей суммы
function updateTotalPrice() {
    const subtotalElements = [
        'subtotalAdult',
        'subtotalUnder18', 
        'subtotalMuse',
        'subtotalStudent',
        'subtotalAuditor',
        'subtotalChild'
    ];
    
    let total = 0;
    subtotalElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const value = parseFloat(element.textContent) || 0;
            total += value;
        }
    });
    
    const totalElement = document.getElementById('allSubtotal');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
    
    console.log('Общая сумма:', total);
}

// Функция для настройки выбора страны
function setupCountrySelection() {
    const countryButton = document.getElementById('country-button');
    const countryDropdown = document.getElementById('country');
    
    if (!countryButton || !countryDropdown) return;
    
    // Показать/скрыть список стран
    countryButton.addEventListener('click', function(e) {
        e.preventDefault();
        const isVisible = countryDropdown.style.display === 'block';
        countryDropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    // Обработка выбора страны
    const countryOptions = countryDropdown.querySelectorAll('option');
    
    countryOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedCountry = this.textContent.trim();
            console.log('Country selected:', selectedCountry);
            
            // Обновляем текст кнопки
            countryButton.textContent = selectedCountry;
            
            // Сохраняем выбранную страну
            bookingData.country = selectedCountry;
            
            // Скрываем dropdown
            countryDropdown.style.display = 'none';
        });
    });
    
    // Закрытие при клике вне элемента
    document.addEventListener('click', function(e) {
        if (!countryButton.contains(e.target) && !countryDropdown.contains(e.target)) {
            countryDropdown.style.display = 'none';
        }
    });
}