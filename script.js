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
        const steps = ['stepOne', 'stepTwo', 'stepThree', 'stepFoo', 'stepFive'];
        steps.forEach(step => {
            const element = document.getElementById(step);
            if (element) {
                element.style.display = step === stepId ? 'block' : 'none';
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
            option.textContent = i === 0 ? 'Выберите количество' : `${i} билет${i > 1 ? (i < 5 ? 'а' : 'ов') : ''}`;
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
            subtotalElement.textContent = amount > 0 ? `${amount.toFixed(2)} ₽` : '0 ₽';
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
            totalElement.textContent = `${total.toFixed(2)} ₽`;
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
                if (this.validateStep3()) {
                    this.fillFinalInfo();
                    this.showStep('stepFoo');
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
        const calendar = document.getElementById('dp1758166138189');
        if (!calendar) return;

        // Обработчик для навигации по месяцам (кнопки вперед/назад)
        const setupMonthNavigation = () => {
            const nextButton = calendar.querySelector('.ui-datepicker-next');
            const prevButton = calendar.querySelector('.ui-datepicker-prev');
            
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    setTimeout(() => {
                        this.setupDateSelection();
                    }, 100);
                });
            }
            
            if (prevButton) {
                prevButton.addEventListener('click', () => {
                    setTimeout(() => {
                        this.setupDateSelection();
                    }, 100);
                });
            }
        };

        // Настройка выбора дат
        this.setupDateSelection();
        setupMonthNavigation();
        
        // Наблюдатель за изменениями в календаре (для динамического обновления)
        const observer = new MutationObserver(() => {
            this.setupDateSelection();
            setupMonthNavigation();
        });
        
        observer.observe(calendar, { 
            childList: true, 
            subtree: true 
        });
    }

    // Отдельная функция для настройки выбора дат
    setupDateSelection() {
        const calendar = document.getElementById('dp1758166138189');
        if (!calendar) return;

        // Обработчик клика по датам в календаре
        const dateCells = calendar.querySelectorAll('td');
        dateCells.forEach(cell => {
            // Убираем старые обработчики
            cell.removeEventListener('click', this.handleDateClick);
            
            // Добавляем новые обработчики только для дат (не пустых ячеек)
            if (cell.textContent.trim() && !cell.classList.contains('ui-datepicker-other-month')) {
                cell.style.cursor = 'pointer';
                cell.addEventListener('click', this.handleDateClick.bind(this));
            }
        });
    }

    // Обработчик клика по дате
    handleDateClick(e) {
        const calendar = document.getElementById('dp1758166138189');
        if (!calendar) return;

        const clickedCell = e.target;
        
        // Проверяем, что это действительно дата
        if (clickedCell.tagName === 'TD' && clickedCell.textContent.trim() && 
            !clickedCell.classList.contains('ui-datepicker-other-month')) {
            
            // Убираем выделение с других дат
            calendar.querySelectorAll('td').forEach(td => {
                td.classList.remove('selected-date');
                td.style.backgroundColor = '';
                td.style.color = '';
            });

            // Выделяем выбранную дату
            clickedCell.classList.add('selected-date');
            clickedCell.style.backgroundColor = '#007bff';
            clickedCell.style.color = 'white';

            // Получаем информацию о выбранной дате
            const day = clickedCell.textContent.trim();
            const monthYear = calendar.querySelector('.ui-datepicker-title');
            let dateString = day;
            
            if (monthYear) {
                const monthElement = monthYear.querySelector('.ui-datepicker-month');
                const yearElement = monthYear.querySelector('.ui-datepicker-year');
                
                if (monthElement && yearElement) {
                    const month = monthElement.textContent.trim();
                    const year = yearElement.textContent.trim();
                    dateString = `${day} ${month} ${year}`;
                }
            }

            // Сохраняем выбранную дату
            this.selectedDate = dateString;
            console.log('Выбрана дата:', this.selectedDate);

            // Показываем блок выбора времени
            const timeslotSection = document.getElementById('timeslot-section');
            if (timeslotSection) {
                timeslotSection.style.display = 'block';
                this.initTimeSlots();
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

        // Стилизация списка стран
        countryList.style.cssText = `
            display: none;
            position: absolute;
            background: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            width: 100%;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        `;

        // Стилизация элементов списка
        const countryItems = countryList.querySelectorAll('*');
        countryItems.forEach(item => {
            if (item.textContent.trim()) {
                item.style.cssText = `
                    padding: 10px;
                    cursor: pointer;
                    border-bottom: 1px solid #eee;
                `;
                
                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = '#f5f5f5';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = 'white';
                });

                item.addEventListener('click', () => {
                    countryButton.textContent = item.textContent.trim();
                    countryList.style.display = 'none';
                });
            }
        });

        // Показать/скрыть список при клике на кнопку
        countryButton.addEventListener('click', () => {
            countryList.style.display = countryList.style.display === 'none' ? 'block' : 'none';
        });

        // Скрыть список при клике вне его
        document.addEventListener('click', (e) => {
            if (!countryButton.contains(e.target) && !countryList.contains(e.target)) {
                countryList.style.display = 'none';
            }
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
            alert('Пожалуйста, выберите хотя бы один билет');
            return false;
        }
        return true;
    }

    // Валидация второго шага
    validateStep2() {
        if (!this.selectedDate || !this.selectedTime) {
            alert('Пожалуйста, выберите дату и время');
            return false;
        }
        return true;
    }

    // Валидация третьего шага
    validateStep3() {
        const firstName = document.getElementById('firstName').value.trim();
        const surname = document.getElementById('surname').value.trim();
        const city = document.getElementById('city').value.trim();
        const country = document.getElementById('country-button').textContent.trim();
        const birthYear = document.getElementById('room-number').value.trim();
        const email = document.getElementById('emailAddress').value.trim();
        const emailConfirm = document.querySelector('[name="emailAddressConfirm"]').value.trim();

        if (!firstName || !surname || !city || !country || !birthYear || !email || !emailConfirm) {
            alert('Пожалуйста, заполните все поля');
            return false;
        }

        if (email !== emailConfirm) {
            alert('Email адреса не совпадают');
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
            finalDate.textContent = `${this.selectedDate} в ${this.selectedTime}`;
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