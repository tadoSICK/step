$(document).ready(function() {
    // Инициализация - показываем только первый шаг
    showStep('stepOne');
    
    // Объект для хранения данных заказа
    let orderData = {
        tickets: {},
        selectedDate: '',
        selectedTime: '',
        personalData: {}
    };

    // Функция для показа определенного шага
    function showStep(stepId) {
        $('.step').hide();
        $('#' + stepId).show();
    }

    // ШАГ 1: Выбор билетов
    // Обработчик изменения количества билетов
    $('.ticket-count').on('change', function() {
        const count = parseInt($(this).val());
        const priceId = $(this).data('price');
        const subtotalId = $(this).data('subtotal');
        const price = parseInt($('#' + priceId).text());
        
        const subtotal = count * price;
        $('#' + subtotalId).text(subtotal);
        
        // Сохраняем данные о билетах
        const ticketType = subtotalId.replace('subtotal', '').toLowerCase();
        orderData.tickets[ticketType] = {
            count: count,
            price: price,
            subtotal: subtotal
        };
        
        updateTotalPrice();
    });

    // Функция обновления общей стоимости
    function updateTotalPrice() {
        let total = 0;
        $('.subtotal').each(function() {
            total += parseInt($(this).text()) || 0;
        });
        $('#allSubtotal').text(total);
    }

    // Переход ко второму шагу
    $('#goTwoStep').on('click', function() {
        // Проверяем, выбран ли хотя бы один билет
        let hasTickets = false;
        $('.ticket-count').each(function() {
            if (parseInt($(this).val()) > 0) {
                hasTickets = true;
                return false;
            }
        });
        
        if (!hasTickets) {
            alert('Пожалуйста, выберите хотя бы один билет');
            return;
        }
        
        showStep('stepTwo');
        initializeDatepicker();
    });

    // ШАГ 2: Выбор даты и времени
    function initializeDatepicker() {
        $('#datepicker').datepicker({
            dateFormat: 'dd.mm.yy',
            minDate: 0,
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
                        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            onSelect: function(dateText) {
                orderData.selectedDate = dateText;
                $('#timeslot-section').show();
            }
        });
    }

    // Обработчик выбора времени
    $(document).on('click', '.timeslot', function() {
        $('.timeslot').removeClass('selected');
        $(this).addClass('selected');
        orderData.selectedTime = $(this).data('time');
        $('#goThreeStep').show();
    });

    // Переход к третьему шагу
    $('#goThreeStep').on('click', function() {
        if (!orderData.selectedDate || !orderData.selectedTime) {
            alert('Пожалуйста, выберите дату и время');
            return;
        }
        showStep('stepThree');
    });

    // ШАГ 3: Ввод данных
    // Обработчик выпадающего списка стран
    $('#country-button').on('click', function() {
        $('#country').toggle();
    });

    // Выбор страны
    $(document).on('click', '.country-option', function() {
        const selectedCountry = $(this).data('country');
        $('.selected-country').text(selectedCountry);
        $('#country').hide();
        orderData.personalData.country = selectedCountry;
    });

    // Закрытие списка стран при клике вне его
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#country-button').length) {
            $('#country').hide();
        }
    });

    // Проверка совпадения email адресов
    function validateEmails() {
        const email1 = $('#emailAddress').val();
        const email2 = $('#emailAddressConfirm').val();
        
        if (email1 !== email2) {
            $('#email-error').show();
            return false;
        } else {
            $('#email-error').hide();
            return true;
        }
    }

    $('#emailAddress, #emailAddressConfirm').on('blur', validateEmails);

    // Переход к четвертому шагу
    $('#goFooStep').on('click', function() {
        // Валидация полей
        const firstName = $('#firstName').val().trim();
        const surname = $('#surname').val().trim();
        const city = $('#city').val().trim();
        const birthYear = $('#room-number').val();
        const email = $('#emailAddress').val().trim();
        const emailConfirm = $('#emailAddressConfirm').val().trim();
        const country = orderData.personalData.country;

        if (!firstName || !surname || !city || !birthYear || !email || !emailConfirm || !country) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        if (!validateEmails()) {
            alert('Email адреса не совпадают');
            return;
        }

        // Сохраняем персональные данные
        orderData.personalData = {
            firstName: firstName,
            surname: surname,
            city: city,
            birthYear: birthYear,
            email: email,
            country: country
        };

        showConfirmationData();
        showStep('stepFoo');
    });

    // ШАГ 4: Подтверждение заказа
    function showConfirmationData() {
        // Личные данные
        $('#fullnamefinal').text(orderData.personalData.firstName + ' ' + orderData.personalData.surname);
        $('#emailfinal').text(orderData.personalData.email);
        
        // Дата и время
        $('#finaldate').text(orderData.selectedDate + ' в ' + orderData.selectedTime);
        
        // Билеты
        let totalPrice = 0;
        
        // Взрослые билеты
        if (orderData.tickets.adult && orderData.tickets.adult.count > 0) {
            $('#finalAdult').show();
            $('#finalAdult .count').text(orderData.tickets.adult.count);
            $('#finalPriceAdult').text(orderData.tickets.adult.subtotal);
            totalPrice += orderData.tickets.adult.subtotal;
        }
        
        // Билеты до 18 лет
        if (orderData.tickets.under18 && orderData.tickets.under18.count > 0) {
            $('#finalUnder18').show();
            $('#finalUnder18 .count').text(orderData.tickets.under18.count);
            $('#finalPriceUnder18').text(orderData.tickets.under18.subtotal);
            totalPrice += orderData.tickets.under18.subtotal;
        }
        
        // Музейные билеты
        if (orderData.tickets.muse && orderData.tickets.muse.count > 0) {
            $('#finalMuse').show();
            $('#finalMuse .count').text(orderData.tickets.muse.count);
            $('#finalPriceMuse').text(orderData.tickets.muse.subtotal);
            totalPrice += orderData.tickets.muse.subtotal;
        }
        
        // Студенческие билеты
        if (orderData.tickets.student && orderData.tickets.student.count > 0) {
            $('#studentFinal').show();
            $('#studentFinal .count').text(orderData.tickets.student.count);
            $('#finalPriceStudent').text(orderData.tickets.student.subtotal);
            totalPrice += orderData.tickets.student.subtotal;
        }
        
        // Билеты аудитор
        if (orderData.tickets.auditor && orderData.tickets.auditor.count > 0) {
            $('#auditorFinal').show();
            $('#auditorFinal .count').text(orderData.tickets.auditor.count);
            $('#auditorFinalPrice').text(orderData.tickets.auditor.subtotal);
            totalPrice += orderData.tickets.auditor.subtotal;
        }
        
        // Детские билеты
        if (orderData.tickets.child && orderData.tickets.child.count > 0) {
            $('#childFinal').show();
            $('#childFinal .count').text(orderData.tickets.child.count);
            $('#childFinalPrice').text(orderData.tickets.child.subtotal);
            totalPrice += orderData.tickets.child.subtotal;
        }
        
        // Общая стоимость
        $('#finalTotalAllPrice').text(totalPrice);
    }

    // Переход к финальному шагу
    $('#goFiveStep').on('click', function() {
        showStep('stepFive');
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Данные заказа:', orderData);
    });
});