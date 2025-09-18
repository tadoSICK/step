// Глобальные переменные для хранения данных
let bookingData = {
    tickets: {
        adult: { count: 0, price: 0, subtotal: 0 },
        under18: { count: 0, price: 0, subtotal: 0 },
        muse: { count: 0, price: 0, subtotal: 0 },
        student: { count: 0, price: 0, subtotal: 0 },
        auditor: { count: 0, price: 0, subtotal: 0 },
        child: { count: 0, price: 0, subtotal: 0 }
    },
    selectedDate: '',
    selectedTime: '',
    personalInfo: {
        firstName: '',
        surname: '',
        city: '',
        country: '',
        birthYear: '',
        email: '',
        emailConfirm: ''
    },
    totalAmount: 0
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    initializeBookingSystem();
});

function initializeBookingSystem() {
    // Показываем первый шаг при загрузке
    showStep('stepOne');
    
    // Инициализируем цены билетов
    initializePrices();
    
    // Создаем селекторы количества билетов
    createTicketSelectors();
    
    // Настраиваем обработчики событий
    setupEventListeners();
    
    // Настраиваем календарь
    setupCalendar();
    
    // Настраиваем выбор страны
    setupCountrySelector();
}

function initializePrices() {
    // Получаем цены из HTML элементов
    const priceElements = {
        adult: document.getElementById('priceAdults'),
        under18: document.getElementById('priceUnder18'),
        muse: document.getElementById('priceMuse'),
        student: document.getElementById('stunedtPrice'),
        auditor: document.getElementById('auditorPrice'),
        child: document.getElementById('childPrice')
    };

    // Сохраняем цены в глобальном объекте
    Object.keys(priceElements).forEach(type => {
        if (priceElements[type]) {
            const priceText = priceElements[type].textContent || priceElements[type].innerText;
            const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
            bookingData.tickets[type].price = price;
        }
    });
}

function createTicketSelectors() {
    const ticketTypes = [
        { id: 'tickettype_396894-button', type: 'adult' },
        { id: 'tickettype_398153-button', type: 'under18' },
        { id: 'tickettype_398152-button', type: 'muse' },
        { id: 'tickettype_398159-button', type: 'student' },
        { id: 'tickettype_397088-button', type: 'auditor' },
        { id: 'tickettype_398323-button', type: 'child' }
    ];

    ticketTypes.forEach(ticket => {
        const button = document.getElementById(ticket.id);
        if (button) {
            // Создаем выпадающий список
            const select = document.createElement('select');
            select.className = 'ticket-quantity-select';
            select.style.cssText = `
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background: white;
                font-size: 14px;
                cursor: pointer;
                min-width: 60px;
            `;

            // Добавляем опции от 0 до 10
            for (let i = 0; i <= 10; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                select.appendChild(option);
            }

            // Обработчик изменения количества
            select.addEventListener('change', function() {
                updateTicketQuantity(ticket.type, parseInt(this.value));
            });

            // Заменяем содержимое кнопки на селект
            button.innerHTML = '';
            button.appendChild(select);
        }
    });
}

function updateTicketQuantity(type, quantity) {
    bookingData.tickets[type].count = quantity;
    bookingData.tickets[type].subtotal = quantity * bookingData.tickets[type].price;
    
    // Обновляем отображение подытога
    updateSubtotal(type);
    
    // Обновляем общую сумму
    updateTotalAmount();
}

function updateSubtotal(type) {
    const subtotalElements = {
        adult: 'subtotalAdult',
        under18: 'subtotalUnder18',
        muse: 'subtotalMuse',
        student: 'subtotalStudent',
        auditor: 'subtotalAuditor',
        child: 'subtotalChild'
    };

    const elementId = subtotalElements[type];
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = bookingData.tickets[type].subtotal.toFixed(2);
    }
}

function updateTotalAmount() {
    let total = 0;
    Object.keys(bookingData.tickets).forEach(type => {
        total += bookingData.tickets[type].subtotal;
    });
    
    bookingData.totalAmount = total;
    
    const totalElement = document.getElementById('allSubtotal');
    if (totalElement) {
        totalElement.textContent = total.toFixed(2);
    }
}

function setupEventListeners() {
    // Кнопки перехода между шагами
    const goTwoStep = document.getElementById('goTwoStep');
    if (goTwoStep) {
        goTwoStep.addEventListener('click', function() {
            if (validateStep1()) {
                showStep('stepTwo');
            }
        });
    }

    const goThreeStep = document.getElementById('goThreeStep');
    if (goThreeStep) {
        goThreeStep.addEventListener('click', function() {
            if (validateStep2()) {
                showStep('stepThree');
            }
        });
    }

    const goFooStep = document.getElementById('goFooStep');
    if (goFooStep) {
        goFooStep.addEventListener('click', function() {
            if (validateStep3()) {
                populateFinalStep();
                showStep('stepFoo');
            }
        });
    }

    const goFiveStep = document.getElementById('goFiveStep');
    if (goFiveStep) {
        goFiveStep.addEventListener('click', function() {
            showStep('stepFive');
        });
    }
}

function setupCalendar() {
    const calendar = document.getElementById('dp1758166138189');
    if (calendar) {
        // Используем делегирование событий для динамического контента
        setupCalendarEventDelegation(calendar);
        
        // Также проверяем существующие даты при инициализации
        setTimeout(() => {
            setupExistingCalendarDates(calendar);
        }, 100);
    }
}

function setupCalendarEventDelegation(calendar) {
    // Используем делегирование событий для обработки кликов по датам
    calendar.addEventListener('click', function(e) {
        const target = e.target;
        
        // Проверяем различные возможные селекторы для дат
        if ((target.tagName === 'TD' || target.tagName === 'A' || target.classList.contains('ui-state-default')) 
            && target.textContent.trim() && !target.classList.contains('ui-state-disabled')) {
            
            e.preventDefault();
            e.stopPropagation();
            
            // Убираем выделение с других дат
            const allDates = calendar.querySelectorAll('td, a, .ui-state-default');
            allDates.forEach(element => {
                element.classList.remove('selected-date');
                element.style.backgroundColor = '';
                element.style.color = '';
            });
            
            // Выделяем выбранную дату
            target.classList.add('selected-date');
            target.style.backgroundColor = '#007bff !important';
            target.style.color = 'white !important';
            
            // Сохраняем выбранную дату
            const day = target.textContent.trim();
            const monthYear = calendar.querySelector('.ui-datepicker-title, .ui-datepicker-month, .ui-datepicker-year');
            let dateString = day;
            
            if (monthYear) {
                dateString = `${day} ${monthYear.textContent}`;
            } else {
                // Попробуем найти месяц и год другими способами
                const month = calendar.querySelector('.ui-datepicker-month');
                const year = calendar.querySelector('.ui-datepicker-year');
                if (month && year) {
                    dateString = `${day} ${month.textContent} ${year.textContent}`;
                }
            }
            
            bookingData.selectedDate = dateString;
            console.log('Выбрана дата:', bookingData.selectedDate);
            
            // Показываем блок выбора времени
            showTimeSlots();
        }
    });
    
    // Обработчик для кнопок навигации по месяцам
    calendar.addEventListener('click', function(e) {
        if (e.target.classList.contains('ui-datepicker-next') || 
            e.target.classList.contains('ui-datepicker-prev')) {
            // Переинициализируем обработчики после смены месяца
            setTimeout(() => {
                setupExistingCalendarDates(calendar);
            }, 100);
        }
    });
}

function setupExistingCalendarDates(calendar) {
    // Находим все возможные элементы дат и добавляем им стили для hover
    const dateElements = calendar.querySelectorAll('td a, .ui-state-default, td[data-handler="selectDay"]');
    dateElements.forEach(element => {
        if (element.textContent.trim() && !element.classList.contains('ui-state-disabled')) {
            element.style.cursor = 'pointer';
            
            // Добавляем hover эффекты
            element.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected-date')) {
                    this.style.backgroundColor = '#e3f2fd';
                }
            });
            
            element.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected-date')) {
                    this.style.backgroundColor = '';
                }
            });
        }
    });
}

function showTimeSlots() {
    const timeslotSection = document.getElementById('timeslot-section');
    if (timeslotSection) {
        timeslotSection.style.display = 'block';
        
        // Обработчик выбора времени - ищем все возможные селекторы
        const timeSlots = timeslotSection.querySelectorAll('.timeslots-container, .timeslot, [class*="timeslot"]');
        
        console.log('Найдено временных слотов:', timeSlots.length);
        
        timeSlots.forEach(slot => {
            slot.style.cursor = 'pointer';
            
            // Убираем старые обработчики и добавляем новые
            slot.removeEventListener('click', handleTimeSlotClick);
            slot.addEventListener('click', handleTimeSlotClick);
            
            // Добавляем hover эффекты
            slot.addEventListener('mouseenter', function() {
                if (!this.classList.contains('selected-time')) {
                    this.style.backgroundColor = '#e3f2fd';
                }
            });
            
            slot.addEventListener('mouseleave', function() {
                if (!this.classList.contains('selected-time')) {
                    this.style.backgroundColor = '';
                }
            });
        });
    }
}

function handleTimeSlotClick() {
    const timeslotSection = document.getElementById('timeslot-section');
    if (timeslotSection) {
        const timeSlots = timeslotSection.querySelectorAll('.timeslots-container, .timeslot, [class*="timeslot"]');
        
        // Убираем выделение с других слотов
        timeSlots.forEach(s => {
            s.classList.remove('selected-time');
            s.style.backgroundColor = '';
            s.style.color = '';
        });
        
        // Выделяем выбранный слот
        this.classList.add('selected-time');
        this.style.backgroundColor = '#007bff !important';
        this.style.color = 'white !important';
        
        // Сохраняем выбранное время
        bookingData.selectedTime = this.textContent.trim();
        console.log('Выбрано время:', bookingData.selectedTime);
    }
}
                // Убираем выделение с других слотов
                timeSlots.forEach(s => s.classList.remove('selected-time'));
                
                // Выделяем выбранный слот
                this.classList.add('selected-time');
                this.style.backgroundColor = '#007bff';
                this.style.color = 'white';
                
                // Сохраняем выбранное время
                bookingData.selectedTime = this.textContent.trim();
            });
        });
    }
}

function setupCountrySelector() {
    const countryButton = document.getElementById('country-button');
    const countryList = document.getElementById('country');
    
    if (countryButton && countryList) {
        // Стилизуем список стран
        countryList.style.cssText = `
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 4px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            width: 100%;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        // Стилизуем элементы списка
        const countryItems = countryList.querySelectorAll('*');
        countryItems.forEach(item => {
            if (item.textContent.trim()) {
                item.style.cssText = `
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                `;
                
                item.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = '#f5f5f5';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'white';
                });
                
                item.addEventListener('click', function() {
                    countryButton.textContent = this.textContent.trim();
                    bookingData.personalInfo.country = this.textContent.trim();
                    countryList.style.display = 'none';
                });
            }
        });

        // Обработчик клика по кнопке страны
        countryButton.addEventListener('click', function() {
            countryList.style.display = countryList.style.display === 'none' ? 'block' : 'none';
        });

        // Закрываем список при клике вне его
        document.addEventListener('click', function(e) {
            if (!countryButton.contains(e.target) && !countryList.contains(e.target)) {
                countryList.style.display = 'none';
            }
        });
    }
}

function showStep(stepId) {
    // Скрываем все шаги
    const steps = ['stepOne', 'stepTwo', 'stepThree', 'stepFoo', 'stepFive'];
    steps.forEach(step => {
        const element = document.getElementById(step);
        if (element) {
            element.style.display = 'none';
        }
    });

    // Показываем нужный шаг
    const targetStep = document.getElementById(stepId);
    if (targetStep) {
        targetStep.style.display = 'block';
    }
}

function validateStep1() {
    // Проверяем, что выбран хотя бы один билет
    let hasTickets = false;
    Object.keys(bookingData.tickets).forEach(type => {
        if (bookingData.tickets[type].count > 0) {
            hasTickets = true;
        }
    });

    if (!hasTickets) {
        alert('Пожалуйста, выберите хотя бы один билет');
        return false;
    }
    return true;
}

function validateStep2() {
    console.log('Проверка шага 2:', {
        selectedDate: bookingData.selectedDate,
        selectedTime: bookingData.selectedTime
    });
    
    if (!bookingData.selectedDate || !bookingData.selectedTime) {
        let message = 'Пожалуйста, выберите ';
        if (!bookingData.selectedDate && !bookingData.selectedTime) {
            message += 'дату и время';
        } else if (!bookingData.selectedDate) {
            message += 'дату';
        } else {
            message += 'время';
        }
        alert(message);
        return false;
    }
    return true;
}

function validateStep3() {
    // Собираем данные из формы
    const firstName = document.getElementById('firstName');
    const surname = document.getElementById('surname');
    const city = document.getElementById('city');
    const roomNumber = document.getElementById('room-number');
    const emailAddress = document.getElementById('emailAddress');
    const emailConfirm = document.querySelector('[name="emailAddressConfirm"]');

    if (firstName) bookingData.personalInfo.firstName = firstName.value.trim();
    if (surname) bookingData.personalInfo.surname = surname.value.trim();
    if (city) bookingData.personalInfo.city = city.value.trim();
    if (roomNumber) bookingData.personalInfo.birthYear = roomNumber.value.trim();
    if (emailAddress) bookingData.personalInfo.email = emailAddress.value.trim();
    if (emailConfirm) bookingData.personalInfo.emailConfirm = emailConfirm.value.trim();

    // Валидация
    if (!bookingData.personalInfo.firstName) {
        alert('Пожалуйста, введите имя');
        return false;
    }
    if (!bookingData.personalInfo.surname) {
        alert('Пожалуйста, введите фамилию');
        return false;
    }
    if (!bookingData.personalInfo.email) {
        alert('Пожалуйста, введите email');
        return false;
    }
    if (bookingData.personalInfo.email !== bookingData.personalInfo.emailConfirm) {
        alert('Email адреса не совпадают');
        return false;
    }
    if (!bookingData.personalInfo.birthYear) {
        alert('Пожалуйста, введите год рождения');
        return false;
    }

    return true;
}

function populateFinalStep() {
    // Заполняем финальную информацию
    const elements = {
        'fullnamefinal': `${bookingData.personalInfo.firstName} ${bookingData.personalInfo.surname}`,
        'emailfinal': bookingData.personalInfo.email,
        'finaldate': `${bookingData.selectedDate} ${bookingData.selectedTime}`,
        'finalAdult': bookingData.tickets.adult.count,
        'finalPriceAdult': bookingData.tickets.adult.subtotal.toFixed(2),
        'finalMuse': bookingData.tickets.muse.count,
        'finalUnder18': bookingData.tickets.under18.count,
        'studentFinal': bookingData.tickets.student.count,
        'finalPriceStudent': bookingData.tickets.student.subtotal.toFixed(2),
        'auditorFinal': bookingData.tickets.auditor.count,
        'auditorFinalPrice': bookingData.tickets.auditor.subtotal.toFixed(2),
        'childFinal': bookingData.tickets.child.count,
        'childFinalPrice': bookingData.tickets.child.subtotal.toFixed(2),
        'finalTotalAllPrice': bookingData.totalAmount.toFixed(2)
    };

    Object.keys(elements).forEach(elementId => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = elements[elementId];
        }
    });
}

// Дополнительные стили для улучшения UX
const additionalStyles = `
    .selected-date {
        background-color: #007bff !important;
        color: white !important;
        font-weight: bold !important;
    }
    
    .selected-time {
        background-color: #007bff !important;
        color: white !important;
        font-weight: bold !important;
        border: 2px solid #0056b3 !important;
    }
    
    .ticket-quantity-select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
    }
    
    #country {
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    
    #timeslot-section {
        display: none;
        margin-top: 20px;
        padding: 15px;
        border: 1px solid #ddd;
        border-radius: 8px;
        background-color: #f8f9fa;
    }
    
    .timeslots-container, .timeslot, [class*="timeslot"] {
        transition: all 0.2s ease;
        margin: 5px;
        padding: 8px 12px;
        border: 1px solid #ddd;
        border-radius: 4px;
        display: inline-block;
        background-color: white;
    }
    
    .timeslots-container:hover, .timeslot:hover, [class*="timeslot"]:hover {
        background-color: #e3f2fd !important;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    #dp1758166138189 td {
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    #dp1758166138189 td:hover {
        background-color: #e3f2fd !important;
        transform: scale(1.05);
    }
    
    #dp1758166138189 .ui-state-default {
        cursor: pointer !important;
        transition: all 0.2s ease;
    }
    
    #dp1758166138189 .ui-state-default:hover {
        background-color: #e3f2fd !important;
        color: #007bff !important;
    }
`;

// Добавляем стили на страницу
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);