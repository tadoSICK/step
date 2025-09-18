// Система бронирования билетов
class BookingSystem {
    constructor() {
        this.selectedTickets = {};
        this.selectedDate = null;
        this.selectedTime = null;
        this.userInfo = {};
        
        this.init();
    }

    init() {
        // Показываем первый шаг при загрузке
        this.showStep('stepOne');
        
        // Инициализируем все компоненты
        this.initTicketSelectors();
        this.initStepButtons();
        this.initCalendar();
        this.initCountrySelector();
        this.initFormValidation();
    }

    // Показать определенный шаг
    showStep(stepId) {
        console.log('Показываем шаг:', stepId);
        const steps = ['stepOne', 'stepTwo', 'stepThree', 'stepFoo', 'stepFive'];
        steps.forEach(step => {
            const element = document.getElementById(step);
            if (element) {
                element.style.display = step === stepId ? 'block' : 'none';
                console.log(`Шаг ${step}: display = ${element.style.display}`);
            } else {
                console.log(`Элемент ${step} не найден!`);
            }
        });
    }

    // Инициализация селекторов билетов
    initTicketSelectors() {
        const ticketTypes = [
            { id: 'tickettype_396894-button', priceId: 'priceAdults', subtotalId: 'subtotalAdult', type: 'adult' },
            { id: 'tickettype_398153-button', priceId: 'priceUnder18', subtotalId: 'subtotalUnder18', type: 'under18' },
            { id: 'tickettype_398152-button', priceId: 'priceMuse', subtotalId: 'subtotalMuse', type: 'muse' },
            { id: 'tickettype_398159-button', priceId: 'stunedtPrice', subtotalId: 'subtotalStudent', type: 'student' },
            { id: 'tickettype_397088-button', priceId: 'auditorPrice', subtotalId: 'subtotalAuditor', type: 'auditor' },
            { id: 'tickettype_398323-button', priceId: 'childPrice', subtotalId: 'subtotalChild', type: 'child' }
        ];

        ticketTypes.forEach(ticket => {
            this.createTicketSelector(ticket);
        });
    }

    // Создание селектора для выбора количества билетов
    createTicketSelector(ticket) {
        const buttonElement = document.getElementById(ticket.id);
        const priceElement = document.getElementById(ticket.priceId);
        
        if (!buttonElement || !priceElement) return;

        // Получаем цену из элемента
        const priceText = priceElement.textContent || priceElement.innerText;
        const price = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;

        // Создаем select элемент
        const select = document.createElement('select');
        select.className = 'ticket-quantity-select';
        select.style.cssText = `
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            background: white;
            cursor: pointer;
            width: 100%;
            max-width: 200px;
        `;

        // Добавляем опции от 0 до 10
        for (let i = 0; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i === 0 ? 'Select quantity' : `${i} ticket${i > 1 ? 's' : ''}`;
            select.appendChild(option);
        }

        // Обработчик изменения количества
        select.addEventListener('change', (e) => {
            const quantity = parseInt(e.target.value);
            this.selectedTickets[ticket.type] = { quantity, price };
            this.updateSubtotal(ticket.subtotalId, quantity * price);
            this.updateTotalPrice();
        });

        // Заменяем кнопку на select
        buttonElement.innerHTML = '';
        buttonElement.appendChild(select);
    }

    // Обновление промежуточной суммы
    updateSubtotal(subtotalId, amount) {
        const subtotalElement = document.getElementById(subtotalId);
        if (subtotalElement) {
            subtotalElement.textContent = amount > 0 ? `€${amount.toFixed(2)}` : '€0.00';
        }
    }

    // Обновление общей суммы
    updateTotalPrice() {
        let total = 0;
        Object.values(this.selectedTickets).forEach(ticket => {
            total += ticket.quantity * ticket.price;
        });

        const totalElement = document.getElementById('allSubtotal');
        if (totalElement) {
            totalElement.textContent = `€${total.toFixed(2)}`;
        }
    }

    // Инициализация кнопок переходов между шагами
    initStepButtons() {
        // Переход к шагу 2
        const goTwoStep = document.getElementById('goTwoStep');
        if (goTwoStep) {
            goTwoStep.addEventListener('click', () => {
                if (this.validateStep1()) {
                    this.showStep('stepTwo');
                }
            });
        }

        // Переход к шагу 3
        const goThreeStep = document.getElementById('goThreeStep');
        if (goThreeStep) {
            goThreeStep.addEventListener('click', () => {
                if (this.validateStep2()) {
                    this.showStep('stepThree');
                }
            });
        }

        // Переход к шагу 4
        const goFooStep = document.getElementById('goFooStep');
        if (goFooStep) {
            goFooStep.addEventListener('click', () => {
                console.log('Клик по кнопке goFooStep');
               event.preventDefault(); // Предотвращаем отправку формы
                if (this.validateStep3()) {
                    console.log('Валидация шага 3 прошла успешно');
                    this.fillFinalInfo();
                    this.showStep('stepFoo');
                } else {
                    console.log('Валидация шага 3 не прошла');
                }
            });
        }

        // Переход к шагу 5
        const goFiveStep = document.getElementById('goFiveStep');
        if (goFiveStep) {
            goFiveStep.addEventListener('click', () => {
                this.showStep('stepFive');
            });
        }
    }

    // Инициализация календаря
    initCalendar() {
        console.log('Инициализация календаря...');
        
        // Инициализируем календарь с текущей датой
        this.currentCalendarDate = new Date();
        this.updateCalendarDisplay();
        
        // Добавляем обработчики для кнопок навигации
        this.initCalendarNavigation();
        
        // Добавляем обработчик кликов для календаря
        document.addEventListener('click', (e) => {
            // Если клик по ссылке внутри календаря - блокируем переход
            if (e.target.tagName === 'A' && e.target.closest('#dp1758166138189')) {
                // Проверяем, что это не кнопка навигации
                if (!e.target.classList.contains('ui-datepicker-next') && 
                    !e.target.classList.contains('ui-datepicker-prev')) {
                    e.preventDefault(); // Блокируем переход по ссылке
                    console.log('Клик по дате-ссылке:', e.target.textContent);
                    this.handleDateClick(e.target);
                    return false;
                }
            }
            
            // Обработка кликов по датам в календаре (если это TD)
            if (e.target.tagName === 'TD' && e.target.closest('#dp1758166138189')) {
                // Проверяем что это не пустая ячейка и не заблокированная дата
                if (e.target.textContent.trim() && 
                    !e.target.classList.contains('ui-datepicker-unselectable') &&
                    !e.target.classList.contains('ui-datepicker-other-month')) {
                    console.log('Клик по TD:', e.target.textContent);
                    this.handleDateClick(e.target);
                }
            }
        });
        
        // Инициализируем выбор времени
        this.initTimeSlots();
        
        // Показываем блок выбора времени если дата уже выбрана
        const timeslotSection = document.getElementById('timeslot-section');
        if (timeslotSection) {
            timeslotSection.style.display = 'block';
        }
        
        // Обновляем обработчики для календаря
        this.updateCalendarClickHandlers();
    }

    // Инициализация навигации календаря
    initCalendarNavigation() {
        const calendar = document.getElementById('dp1758166138189');
        if (!calendar) return;

        // Обработчик для кнопки "Next"
        calendar.addEventListener('click', (e) => {
            if (e.target.closest('.ui-datepicker-next')) {
                e.preventDefault();
                this.navigateCalendar(1);
            }
            
            if (e.target.closest('.ui-datepicker-prev')) {
                e.preventDefault();
                this.navigateCalendar(-1);
            }
        });
    }

    // Навигация по месяцам
    navigateCalendar(direction) {
        // direction: 1 для следующего месяца, -1 для предыдущего
        this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + direction);
        this.updateCalendarDisplay();
    }

    // Обновление отображения календаря
    updateCalendarDisplay() {
        const calendar = document.getElementById('dp1758166138189');
        if (!calendar) return;

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const currentMonth = this.currentCalendarDate.getMonth();
        const currentYear = this.currentCalendarDate.getFullYear();
        
        // Обновляем заголовок
        const monthElement = calendar.querySelector('.ui-datepicker-month');
        const yearElement = calendar.querySelector('.ui-datepicker-year');
        const titleElement = calendar.querySelector('.ui-datepicker-title');
        
        if (monthElement) monthElement.textContent = monthNames[currentMonth];
        if (yearElement) yearElement.textContent = currentYear;
        if (titleElement) {
            titleElement.setAttribute('aria-label', `Current month: ${monthNames[currentMonth]} ${currentYear}`);
        }

        // Генерируем календарь для текущего месяца
        this.generateCalendarDays(currentMonth, currentYear);
        
        // Обновляем состояние кнопок навигации
        this.updateNavigationButtons();
    }

    // Генерация дней календаря
    generateCalendarDays(month, year) {
        const calendar = document.getElementById('dp1758166138189');
        const tbody = calendar.querySelector('tbody');
        if (!tbody) return;

        // Очищаем текущие дни
        tbody.innerHTML = '';

        // Получаем первый день месяца и количество дней
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Получаем день недели первого дня (0 = воскресенье, нужно сделать понедельник = 0)
        let startDay = firstDay.getDay();
        startDay = startDay === 0 ? 6 : startDay - 1; // Делаем понедельник = 0
        
        // Получаем текущую дату для сравнения
        const today = new Date();
        const isCurrentMonth = today.getMonth() === month && today.getFullYear() === year;
        const todayDate = today.getDate();

        let date = 1;
        
        // Создаем 6 недель (строк)
        for (let week = 0; week < 6; week++) {
            const row = document.createElement('tr');
            
            // Создаем 7 дней (колонок)
            for (let day = 0; day < 7; day++) {
                const cell = document.createElement('td');
                
                if (week === 0 && day < startDay) {
                    // Пустые ячейки в начале
                    cell.className = 'ui-datepicker-other-month ui-datepicker-unselectable ui-state-disabled';
                    cell.innerHTML = '&nbsp;';
                } else if (date > daysInMonth) {
                    // Пустые ячейки в конце
                    cell.className = 'ui-datepicker-other-month ui-datepicker-unselectable ui-state-disabled';
                    cell.innerHTML = '&nbsp;';
                } else {
                    // Обычные дни
                    const isToday = isCurrentMonth && date === todayDate;
                    const isPast = new Date(year, month, date) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    
                    if (isPast) {
                        // Прошедшие дни - заблокированы
                        cell.className = 'ui-datepicker-unselectable ui-state-disabled disabled';
                        if (day >= 5) cell.className += ' ui-datepicker-week-end';
                        if (isToday) cell.className += ' ui-datepicker-today';
                        cell.innerHTML = `<span class="ui-state-default">${date}</span>`;
                    } else {
                        // Доступные дни
                        cell.className = 'undefined';
                        if (day >= 5) cell.className += ' ui-datepicker-week-end';
                        cell.setAttribute('data-handler', 'selectDay');
                        cell.setAttribute('data-event', 'click');
                        cell.setAttribute('data-month', month);
                        cell.setAttribute('data-year', year);
                        
                        const dayName = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][day];
                        cell.innerHTML = `<a class="ui-state-default" href="#" title="${dayName} ${date}" aria-label="${dayName} ${date}">${date}</a>`;
                    }
                    
                    date++;
                }
                
                row.appendChild(cell);
            }
            
            tbody.appendChild(row);
            
            // Если мы закончили все дни месяца, прерываем
            if (date > daysInMonth) break;
        }
    }

    // Обновление состояния кнопок навигации
    updateNavigationButtons() {
        const calendar = document.getElementById('dp1758166138189');
        if (!calendar) return;

        const prevButton = calendar.querySelector('.ui-datepicker-prev');
        const nextButton = calendar.querySelector('.ui-datepicker-next');
        
        // Можно добавить логику для блокировки кнопок при необходимости
        // Например, не позволять переходить в прошлые месяцы
        const today = new Date();
        const currentMonth = this.currentCalendarDate.getMonth();
        const currentYear = this.currentCalendarDate.getFullYear();
        
        if (prevButton) {
            if (currentYear < today.getFullYear() || 
                (currentYear === today.getFullYear() && currentMonth <= today.getMonth())) {
                prevButton.classList.add('ui-state-disabled');
            } else {
                prevButton.classList.remove('ui-state-disabled');
            }
        }
    }
    
    // Обновление обработчиков кликов для календаря
    updateCalendarClickHandlers() {
        const calendar = document.getElementById('dp1758166138189');
        if (calendar) {
            // Находим все ссылки в календаре и блокируем их
            const dateLinks = calendar.querySelectorAll('a');
            dateLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Заблокирован переход по ссылке:', link.textContent);
                    this.handleDateClick(link);
                    return false;
                });
            });
        }
    }

    // Обработчик клика по дате
    handleDateClick(element) {
        let dateText;
        
        // Если это ссылка, берем текст из неё
        if (element.tagName === 'A') {
            dateText = element.textContent.trim();
        } else {
            // Если это TD, ищем ссылку внутри или берем текст
            const link = element.querySelector('a');
            dateText = link ? link.textContent.trim() : element.textContent.trim();
        }
        
        console.log('Обработка клика по дате:', dateText);
        
        // Проверяем, что это дата (не пустая ячейка и не заголовок)
        if (dateText && !isNaN(dateText) && dateText !== '') {
            console.log('Выбрана дата:', dateText);
            
            // Убираем выделение с других дат
            const calendar = document.getElementById('dp1758166138189');
            if (calendar) {
                calendar.querySelectorAll('td, a').forEach(el => {
                    el.style.backgroundColor = '';
                    el.style.color = '';
                });
                calendar.querySelectorAll('td').forEach(td => {
                    td.style.backgroundColor = '';
                    td.style.color = '';
                });
            }

            // Выделяем выбранную дату
            const clickedCell = element.tagName === 'A' ? element.closest('td') : element;
            clickedCell.style.backgroundColor = '#007bff';
            clickedCell.style.color = 'white';
            
            // Также выделяем ссылку внутри если есть
            const linkInCell = clickedCell.querySelector('a');
            if (linkInCell) {
                linkInCell.style.backgroundColor = '#007bff';
                linkInCell.style.color = 'white';
            }

            // Получаем полную дату
            let fullDate = dateText;
            if (calendar) {
                const monthElement = calendar.querySelector('.ui-datepicker-month');
                const yearElement = calendar.querySelector('.ui-datepicker-year');
                
                if (monthElement && yearElement) {
                    const month = monthElement.textContent.trim();
                    const year = yearElement.textContent.trim();
                    fullDate = `${dateText} ${month} ${year}`;
                }
            }

            // Сохраняем выбранную дату
            this.selectedDate = fullDate;
            console.log('Сохранена дата:', this.selectedDate);

            // Показываем блок выбора времени
            const timeslotSection = document.getElementById('timeslot-section');
            if (timeslotSection) {
                timeslotSection.style.display = 'block';
                console.log('Показан блок выбора времени');
            }
            
            // Показываем кнопку "Next step"
            const nextButton = document.getElementById('goThreeStep');
            if (nextButton) {
                nextButton.style.display = 'block';
            }
        }
    }

    // Инициализация слотов времени
    initTimeSlots() {
        const timeslotsContainer = document.querySelector('.timeslots-container');
        if (!timeslotsContainer) return;

        timeslotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('timeslot') || e.target.closest('.timeslot')) {
                // Убираем выделение с других времен
                timeslotsContainer.querySelectorAll('.timeslot, [class*="timeslot"]').forEach(slot => {
                    slot.classList.remove('selected-time');
                    slot.style.backgroundColor = '';
                });

                // Выделяем выбранное время
                const selectedSlot = e.target.classList.contains('timeslot') ? e.target : e.target.closest('.timeslot');
                if (selectedSlot) {
                    selectedSlot.classList.add('selected-time');
                    selectedSlot.style.backgroundColor = '#007bff';
                    selectedSlot.style.color = 'white';

                    // Сохраняем выбранное время
                    this.selectedTime = selectedSlot.textContent.trim();
                }
            }
        });
    }

    // Инициализация селектора страны
    initCountrySelector() {
        const countryButton = document.getElementById('country-button');
        const countryList = document.getElementById('country');

        if (!countryButton || !countryList) return;

        // Переменная для хранения выбранной страны
        let selectedCountry = '';
        let isListOpen = false;

        // Стилизация списка стран
        countryList.style.display = 'none';
        countryList.style.position = 'absolute';
        countryList.style.background = 'white';
        countryList.style.border = '1px solid #ddd';
        countryList.style.borderRadius = '5px';
        countryList.style.maxHeight = '200px';
        countryList.style.overflowY = 'auto';
        countryList.style.zIndex = '1000';
        countryList.style.width = '100%';
        countryList.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

        // Обработка кликов по кнопке
        countryButton.addEventListener('click', () => {
            isListOpen = !isListOpen;
            countryList.style.display = isListOpen ? 'block' : 'none';
        });

        // Обработка выбора страны
        countryList.addEventListener('click', (e) => {
            if (e.target.tagName === 'OPTION' && e.target.textContent.trim() !== 'Choose a country') {
                selectedCountry = e.target.textContent.trim();
                const buttonText = countryButton.querySelector('.ui-selectmenu-text');
                if (buttonText) {
                    buttonText.textContent = selectedCountry;
                }
                countryList.style.display = 'none';
                isListOpen = false;
                console.log('Selected country:', selectedCountry);
            }
        });

        // Стилизация опций
        const options = countryList.querySelectorAll('option');
        options.forEach(option => {
            if (option.textContent.trim() && option.textContent.trim() !== 'Choose a country') {
                option.style.padding = '10px';
                option.style.cursor = 'pointer';
                option.style.borderBottom = '1px solid #eee';
                
                option.addEventListener('mouseenter', () => {
                    option.style.backgroundColor = '#f5f5f5';
                });
                
                option.addEventListener('mouseleave', () => {
                    option.style.backgroundColor = 'white';
                });
            }
        });

        // Закрытие списка при клике вне его
        document.addEventListener('click', (e) => {
            if (!countryButton.contains(e.target) && !countryList.contains(e.target)) {
                countryList.style.display = 'none';
                isListOpen = false;
            }
        });

        // Сохранение выбранной страны при потере фокуса
        countryButton.addEventListener('blur', () => {
            setTimeout(() => {
                if (selectedCountry) {
                    const buttonText = countryButton.querySelector('.ui-selectmenu-text');
                    if (buttonText) {
                        buttonText.textContent = selectedCountry;
                    }
                }
            }, 100);
        });
    }

    // Инициализация валидации формы
    initFormValidation() {
        const emailAddress = document.getElementById('emailAddress');
        const emailConfirm = document.querySelector('[name="emailAddressConfirm"]');

        if (emailAddress && emailConfirm) {
            const validateEmails = () => {
                if (emailAddress.value && emailConfirm.value) {
                    if (emailAddress.value !== emailConfirm.value) {
                        emailConfirm.style.borderColor = 'red';
                        return false;
                    } else {
                        emailConfirm.style.borderColor = 'green';
                        return true;
                    }
                }
                return true;
            };

            emailAddress.addEventListener('input', validateEmails);
            emailConfirm.addEventListener('input', validateEmails);
        }
    }

    // Валидация первого шага
    validateStep1() {
        const hasTickets = Object.values(this.selectedTickets).some(ticket => ticket.quantity > 0);
        if (!hasTickets) {
            alert('Please select at least one ticket');
            return false;
        }
        return true;
    }

    // Валидация второго шага
    validateStep2() {
        if (!this.selectedDate || !this.selectedTime) {
            alert('Please select date and time');
            return false;
        }
        return true;
    }

    // Валидация третьего шага
    validateStep3() {
        console.log('Starting step 3 validation');
        
        const firstName = document.getElementById('firstName').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country-button').textContent.trim();
        const birthYear = document.getElementById('room-number').value.trim();
        const email = document.getElementById('emailAddress').value.trim();
        const emailConfirm = document.querySelector('[name="emailAddressConfirm"]').value.trim();

        console.log('Form data:', {
            firstName,
            surname,
            city,
            country,
            birthYear,
            email,
            emailConfirm
        });

        if (!firstName || !surname || !city || !country || !birthYear || !email || !emailConfirm) {
            console.log('Not all fields are filled');
            alert('Please fill in all fields');
            return false;
        }

        if (email !== emailConfirm) {
            console.log('Email addresses do not match');
            alert('Email addresses do not match');
            return false;
        }

        // Сохраняем данные пользователя
        this.userInfo = {
            firstName,
            surname,
            city,
            country,
            birthYear,
            email
        };

        console.log('Validation successful, data saved:', this.userInfo);
        return true;
    }

    // Заполнение финальной информации
    fillFinalInfo() {
        // Полное имя
        const fullnameFinal = document.getElementById('fullnamefinal');
        if (fullnameFinal) {
            fullnameFinal.textContent = `${this.userInfo.firstName} ${this.userInfo.surname}`;
        }

        // Email
        const emailFinal = document.getElementById('emailfinal');
        if (emailFinal) {
            emailFinal.textContent = this.userInfo.email;
        }

        // Дата и время
        const finalDate = document.getElementById('finaldate');
        if (finalDate) {
            finalDate.textContent = `${this.selectedDate} at ${this.selectedTime}`;
        }

        // Информация о билетах
        const ticketInfo = [
            { finalId: 'finalAdult', priceId: 'finalPriceAdult', type: 'adult', subtotalId: 'subtotalAdult' },
            { finalId: 'finalUnder18', type: 'under18' },
            { finalId: 'finalMuse', type: 'muse' },
            { finalId: 'studentFinal', priceId: 'finalPriceStudent', type: 'student', subtotalId: 'subtotalStudent' },
            { finalId: 'auditorFinal', priceId: 'auditorFinalPrice', type: 'auditor', subtotalId: 'subtotalAuditor' },
            { finalId: 'childFinal', priceId: 'childFinalPrice', type: 'child', subtotalId: 'subtotalChild' }
        ];

        ticketInfo.forEach(info => {
            const finalElement = document.getElementById(info.finalId);
            if (finalElement && this.selectedTickets[info.type]) {
                finalElement.textContent = this.selectedTickets[info.type].quantity;
            }

            if (info.priceId && info.subtotalId) {
                const priceElement = document.getElementById(info.priceId);
                const subtotalElement = document.getElementById(info.subtotalId);
                if (priceElement && subtotalElement) {
                    priceElement.textContent = subtotalElement.textContent;
                }
            }
        });

        // Общая сумма
        const finalTotalPrice = document.getElementById('finalTotalAllPrice');
        const allSubtotal = document.getElementById('allSubtotal');
        if (finalTotalPrice && allSubtotal) {
            finalTotalPrice.textContent = allSubtotal.textContent;
        }
    }
}

// Запуск системы после загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    new BookingSystem();
});

// Дополнительные стили для элементов
const style = document.createElement('style');
style.textContent = `
    .selected-date {
        background-color: #007bff !important;
        color: white !important;
    }
    
    .selected-time {
        background-color: #007bff !important;
        color: white !important;
    }
    
    .ticket-quantity-select:hover {
        border-color: #007bff;
    }
    
    .ticket-quantity-select:focus {
        outline: none;
        border-color: #007bff;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
    }
`;
document.head.appendChild(style);