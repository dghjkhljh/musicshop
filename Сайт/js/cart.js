document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров в корзине
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryCostElement = document.getElementById('delivery-cost');
    const totalElement = document.getElementById('total-price');
    
    // Обновление счетчика корзины
    updateCartCount();
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="alert alert-info">Ваша корзина пуста</div>';
        return;
    }
    
    // Отображение товаров
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="card mb-3">
            <div class="row g-0">
                <div class="col-md-2">
                    <img src="${item.image}" class="img-fluid rounded-start" alt="${item.name}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text">${item.price.toLocaleString()} ₽</p>
                    </div>
                </div>
                <div class="col-md-2 d-flex align-items-center justify-content-center">
                    <button class="btn btn-outline-danger remove-item" data-id="${item.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Расчет стоимости
    const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    const deliveryCost = 500; // Пример стоимости доставки
    const total = subtotal + deliveryCost;
    
    subtotalElement.textContent = subtotal.toLocaleString() + ' ₽';
    deliveryCostElement.textContent = deliveryCost.toLocaleString() + ' ₽';
    totalElement.textContent = total.toLocaleString() + ' ₽';
    
    // Обработчики для кнопок удаления
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    
    // Функция удаления товара из корзины
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Перезагружаем страницу для обновления данных
        location.reload();
    }
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
});