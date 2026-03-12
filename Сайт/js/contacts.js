document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы обратной связи
    document.getElementById('contact-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Здесь должна быть отправка формы на сервер
        alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.');
        this.reset();
    });
});