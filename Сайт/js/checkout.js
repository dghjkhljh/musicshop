document.addEventListener('DOMContentLoaded', function() {
    // Получаем корзину
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
        <div class="cart-item d-flex justify-content-between mb-2">
            <div>${item.name}</div>
            <div>${item.price.toLocaleString()} ₽</div>
            <button class="remove-item btn btn-link text-danger" data-id="${item.id}">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Расчет стоимости
    updateCartTotals();
    
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
            total: calculateTotal()
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
        updateCartTotals();
    });
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
    
    // Функция обновления итоговых сумм
    function updateCartTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        const deliveryCost = calculateDeliveryCost();
        const total = subtotal + deliveryCost;
        
        if (subtotalElement) subtotalElement.textContent = subtotal.toLocaleString() + ' ₽';
        if (deliveryCostElement) deliveryCostElement.textContent = deliveryCost === 0 ? 'Бесплатно' : deliveryCost.toLocaleString() + ' ₽';
        if (orderTotalElement) orderTotalElement.textContent = total.toLocaleString() + ' ₽';
    }
    
    // Функция расчета общей суммы
    function calculateTotal() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
        return subtotal + calculateDeliveryCost();
    }
    
    // Функция расчета стоимости доставки
    function calculateDeliveryCost() {
        const method = document.getElementById('delivery-method').value;
        
        if (method === 'pickup') {
            return 0;
        } else if (method === 'courier') {
            return 500;
        } else {
            return 800;
        }
    }
});