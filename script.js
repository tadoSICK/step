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