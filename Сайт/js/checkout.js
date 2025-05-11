document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров в корзине
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryCostElement = document.getElementById('delivery-cost');
    const orderTotalElement = document.getElementById('order-total');
    
    // Обновление счетчика корзины
    updateCartCount();
    
    if (cart.length === 0) {
        orderItemsContainer.innerHTML = '<p>Ваша корзина пуста</p>';
        return;
    }
    
    // Отображение товаров
    orderItemsContainer.innerHTML = cart.map(item => `
        <div class="d-flex justify-content-between mb-2">
            <div>${item.name}</div>
            <div>${item.price.toLocaleString()} ₽</div>
        </div>
    `).join('');
    
    // Расчет стоимости
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryCost = calculateDeliveryCost();
    const total = subtotal + deliveryCost;
    
    subtotalElement.textContent = subtotal.toLocaleString() + ' ₽';
    deliveryCostElement.textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost.toLocaleString() + ' ₽';
    orderTotalElement.textContent = total.toLocaleString() + ' ₽';
    
    // Обработка формы
    document.getElementById('order-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const orderData = {
            customer: {
                name: document.getElementById('name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                address: document.getElementById('address').value
            },
            delivery: document.getElementById('delivery-method').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            comments: document.getElementById('comments').value,
            items: cart,
            total: total
        };
        
        // Здесь должна быть отправка данных на сервер
        console.log('Order data:', orderData);
        
        // Очищаем корзину
        localStorage.removeItem('cart');
        
        // Перенаправляем на страницу благодарности
        window.location.href = 'thank-you.html';
    });
    
    // Обновляем стоимость при изменении способа доставки
    document.getElementById('delivery-method').addEventListener('change', function() {
        const deliveryCost = calculateDeliveryCost();
        const total = subtotal + deliveryCost;
        
        deliveryCostElement.textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost.toLocaleString() + ' ₽';
        orderTotalElement.textContent = total.toLocaleString() + ' ₽';
    });
    
    // Функция расчета стоимости доставки
    function calculateDeliveryCost() {
        const method = document.getElementById('delivery-method').value;
        
        if (method === 'pickup') {
            return 0;
        } else if (method === 'courier') {
            return 500; // Пример стоимости курьерской доставки
        } else {
            return 800; // Пример стоимости почтовой доставки
        }
    }
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
});