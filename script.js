// Глобальный объект для хранения данных бронирования
let bookingData = {
    tickets: {},
    selectedDate: null,
    selectedTime: null,
    selectedCountry: null
};

// Функция для создания селектора количества билетов
function createTicketSelector(buttonId, priceId, subtotalId, ticketType) {
    console.log(`Создаем селектор для ${ticketType}, ищем элемент ${buttonId}`);
    
    const buttonElement = document.getElementById(buttonId);
    if (!buttonElement) {
        console.log(`Элемент ${buttonId} не найден`);
        return;
    }

    console.log(`Элемент ${buttonId} найден:`, buttonElement);

    // Создаем select элемент
    const select = document.createElement('select');
    select.className = 'form-control ticket-quantity-select';
    select.id = `select-${ticketType}`;
    select.style.width = '80px';
    select.style.display = 'inline-block';

    // Создаем опции от 0 до 10
    for (let i = 0; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }

    // Заменяем кнопку на select
    buttonElement.parentNode.replaceChild(select, buttonElement);
    console.log(`Select создан и добавлен для ${ticketType}`);

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
        const price = parseFloat(priceText.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        console.log(`Цена за билет: ${price}`);
        
        // Рассчитываем общую стоимость
        const total = quantity * price;
        console.log(`Общая стоимость: ${total}`);
        
        // Обновляем subtotal
        const subtotalElement = document.getElementById(subtotalId);
        if (subtotalElement) {
            subtotalElement.textContent = total.toFixed(2);
            console.log(`Обновлен subtotal ${subtotalId}: ${total.toFixed(2)}`);
        }
        
        // Сохраняем в bookingData
        if (!bookingData.tickets) {
            bookingData.tickets = {};
        }
        bookingData.tickets[ticketType] = {
            quantity: quantity,
            price: price,
            total: total
        };
        
        console.log('Текущие данные билетов:', bookingData.tickets);
        
        // Обновляем общую сумму
        updateTotalPrice();
    });
    
    console.log(`Селектор для ${ticketType} создан успешно`);
}

// Функция для обновления общей суммы
function updateTotalPrice() {
    let totalSum = 0;
    
    // Суммируем все subtotal элементы
    const subtotalElements = [
        'subtotal-adult',
        'subtotal-under18', 
        'subtotal-muse',
        'subtotal-student',
        'subtotal-auditor',
        'subtotal-child'
    ];
    
    subtotalElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const value = parseFloat(element.textContent) || 0;
            totalSum += value;
        }
    });
    
    // Обновляем общую сумму
    const allSubtotalElement = document.getElementById('allSubtotal');
    if (allSubtotalElement) {
        allSubtotalElement.textContent = totalSum.toFixed(2);
    }
    
    console.log(`Общая сумма обновлена: ${totalSum.toFixed(2)}`);
}

// Функция для настройки календаря
function setupCalendar() {
    console.log('Настройка календаря...');
    
    // Используем делегирование событий для календаря
    document.addEventListener('click', function(e) {
        // Проверяем клик по дате в календаре
        if (e.target.matches('.ui-datepicker-calendar td a') || 
            e.target.matches('.ui-datepicker-calendar td') ||
            (e.target.closest('.ui-datepicker-calendar td') && !e.target.matches('.ui-datepicker-other-month'))) {
            
            let dateElement = e.target;
            if (e.target.tagName === 'A') {
                dateElement = e.target;
            } else if (e.target.tagName === 'TD') {
                const link = e.target.querySelector('a');
                if (link) dateElement = link;
            }
            
            const dateText = dateElement.textContent || dateElement.innerText;
            if (dateText && !isNaN(dateText)) {
                console.log('Выбрана дата:', dateText);
                
                // Убираем выделение с предыдущих дат
                document.querySelectorAll('.ui-datepicker-calendar .ui-state-active').forEach(el => {
                    el.classList.remove('ui-state-active');
                });
                
                // Добавляем выделение к выбранной дате
                dateElement.classList.add('ui-state-active');
                
                // Сохраняем выбранную дату
                bookingData.selectedDate = dateText;
                console.log('Дата сохранена:', bookingData.selectedDate);
            }
        }
    });
}

// Функция для настройки выбора времени
function setupTimeSelection() {
    console.log('Настройка выбора времени...');
    
    // Используем делегирование событий для времени
    document.addEventListener('click', function(e) {
        // Ищем элементы времени по различным селекторам
        if (e.target.matches('.time-slot') || 
            e.target.matches('[class*="time"]') ||
            e.target.closest('.time-slots')) {
            
            const timeElement = e.target;
            const timeText = timeElement.textContent || timeElement.innerText;
            
            if (timeText && timeText.includes(':')) {
                console.log('Выбрано время:', timeText);
                
                // Убираем выделение с предыдущих времен
                document.querySelectorAll('.time-slot.selected, [class*="time"].selected').forEach(el => {
                    el.classList.remove('selected');
                });
                
                // Добавляем выделение к выбранному времени
                timeElement.classList.add('selected');
                
                // Сохраняем выбранное время
                bookingData.selectedTime = timeText.trim();
                console.log('Время сохранено:', bookingData.selectedTime);
            }
        }
    });
}

// Функция для настройки выбора страны
function setupCountrySelection() {
    console.log('Настройка выбора страны...');
    
    // Ищем выпадающий список стран
    const countryDropdown = document.querySelector('.dropdown-menu');
    if (countryDropdown) {
        // Обработчик для каждой опции страны
        countryDropdown.addEventListener('click', function(e) {
            if (e.target.matches('li') || e.target.matches('a')) {
                const countryElement = e.target.matches('li') ? e.target : e.target.closest('li');
                const countryText = countryElement.textContent || countryElement.innerText;
                
                if (countryText && countryText.trim() !== '') {
                    console.log('Выбрана страна:', countryText.trim());
                    
                    // Находим кнопку dropdown и обновляем её текст
                    const dropdownButton = document.querySelector('.dropdown-toggle');
                    if (dropdownButton) {
                        // Сохраняем иконку если есть
                        const icon = dropdownButton.querySelector('.caret');
                        dropdownButton.textContent = countryText.trim() + ' ';
                        if (icon) {
                            dropdownButton.appendChild(icon);
                        }
                    }
                    
                    // Сохраняем выбранную страну
                    bookingData.selectedCountry = countryText.trim();
                    console.log('Страна сохранена:', bookingData.selectedCountry);
                }
            }
        });
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализируем селекторы билетов...');
    
    // Небольшая задержка для загрузки всех элементов
    setTimeout(() => {
        // Создаем селекторы для всех типов билетов с правильными ID
        createTicketSelector('adult-button', 'adult-price', 'subtotal-adult', 'adult');
        createTicketSelector('under18-button', 'under18-price', 'subtotal-under18', 'under18');
        createTicketSelector('muse-button', 'muse-price', 'subtotal-muse', 'muse');
        createTicketSelector('student-button', 'student-price', 'subtotal-student', 'student');
        createTicketSelector('auditor-button', 'auditor-price', 'subtotal-auditor', 'auditor');
        createTicketSelector('child-button', 'child-price', 'subtotal-child', 'child');
        
        // Настраиваем календарь и выбор времени
        setupCalendar();
        setupTimeSelection();
        setupCountrySelection();
        
        console.log('Все селекторы инициализированы');
    }, 1000);
});

// Функция валидации перед переходом к следующему шагу
function validateStep(stepNumber) {
    switch(stepNumber) {
        case 1:
            // Проверяем, выбран ли хотя бы один билет
            let hasTickets = false;
            if (bookingData.tickets) {
                for (let type in bookingData.tickets) {
                    if (bookingData.tickets[type].quantity > 0) {
                        hasTickets = true;
                        break;
                    }
                }
            }
            if (!hasTickets) {
                alert('Пожалуйста, выберите количество билетов');
                return false;
            }
            break;
            
        case 2:
            if (!bookingData.selectedDate) {
                alert('Пожалуйста, выберите дату');
                return false;
            }
            if (!bookingData.selectedTime) {
                alert('Пожалуйста, выберите время');
                return false;
            }
            break;
            
        case 3:
            if (!bookingData.selectedCountry) {
                alert('Пожалуйста, выберите страну');
                return false;
            }
            break;
    }
    return true;
}