document.addEventListener('DOMContentLoaded', function() {
    // Получаем корзину из localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const cartItemsContainer = document.getElementById('cart-items');
    const subtotalElement = document.getElementById('subtotal');
    const deliveryCostElement = document.getElementById('delivery-cost');
    const totalElement = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-btn');
    const emptyCartMessage = '<div class="alert alert-info text-center py-5"><i class="bi bi-cart-x fs-1 d-block mb-3"></i><h4>Ваша корзина пуста</h4><p class="text-muted">Добавьте товары из каталога</p><a href="catalog.html" class="btn btn-primary mt-3">Перейти в каталог</a></div>';
    
    // Обновляем счетчик товаров
    updateCartCount();
    
    // Если корзина пуста, показываем сообщение
    if (!cart || cart.length === 0) {
        if (cartItemsContainer) cartItemsContainer.innerHTML = emptyCartMessage;
        if (checkoutButton) checkoutButton.classList.add('disabled');
        updateCartTotals();
        return;
    }
    
    // Нормализуем данные корзины (добавляем quantity, если его нет)
    cart = cart.map(item => {
        if (!item.hasOwnProperty('quantity')) {
            return { ...item, quantity: 1 };
        }
        return item;
    });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Отображаем товары в корзине
    renderCartItems();
    
    // Функция отображения товаров в корзине
    function renderCartItems() {
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item row align-items-center py-3 border-bottom" data-id="${item.id}">
                    <div class="col-md-2 mb-3 mb-md-0">
                        <img src="${item.image || 'images/placeholder.jpg'}" alt="${item.name}" class="cart-item-img img-fluid" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <div class="col-md-4 mb-3 mb-md-0">
                        <h5 class="mb-1">${item.name}</h5>
                        <p class="text-muted mb-0">${item.category || 'Музыкальный инструмент'}</p>
                        <div class="mt-2">
                            <span class="text-primary fw-bold">${(item.price * (item.quantity || 1)).toLocaleString()} ₽</span>
                            <span class="text-muted small"> (${item.price.toLocaleString()} ₽/шт)</span>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3 mb-md-0">
                        <div class="quantity-control">
                            <button class="btn btn-sm btn-outline-secondary quantity-btn minus-btn" data-id="${item.id}">−</button>
                            <span class="quantity fw-bold mx-2">${item.quantity || 1}</span>
                            <button class="btn btn-sm btn-outline-secondary quantity-btn plus-btn" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 text-md-end mb-3 mb-md-0">
                        <button class="btn btn-outline-danger btn-sm remove-item" data-id="${item.id}" title="Удалить">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
        
        // Добавляем обработчики для кнопок
        setupEventListeners();
        updateCartTotals();
    }
    
    // Настройка обработчиков событий
    function setupEventListeners() {
        // Обработчики для кнопок удаления
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
        
        // Обработчики для кнопок уменьшения количества
        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, -1);
            });
        });
        
        // Обработчики для кнопок увеличения количества
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, 1);
            });
        });
        
        // Обработчик для кнопки оформления заказа
        if (checkoutButton) {
            checkoutButton.addEventListener('click', function(e) {
                if (cart.length === 0) {
                    e.preventDefault();
                    alert('Ваша корзина пуста. Добавьте товары перед оформлением заказа.');
                }
            });
        }
    }
    
    // Функция обновления количества товара
    function updateQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            // Обновляем количество
            cart[itemIndex].quantity = (cart[itemIndex].quantity || 1) + change;
            
            // Если количество стало 0 или меньше - удаляем товар
            if (cart[itemIndex].quantity < 1) {
                cart.splice(itemIndex, 1);
            }
            
            // Сохраняем изменения
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Обновляем отображение
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = emptyCartMessage;
                if (checkoutButton) checkoutButton.classList.add('disabled');
            } else {
                renderCartItems();
            }
            
            updateCartCount();
        }
    }
    
    // Функция удаления товара из корзины
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = emptyCartMessage;
            if (checkoutButton) checkoutButton.classList.add('disabled');
        } else {
            renderCartItems();
        }
        
        updateCartCount();
    }
    
    // Функция обновления счетчика товаров
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    }
    
    // Функция обновления сумм заказа
    function updateCartTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
        const deliveryCost = cart.length > 0 ? 500 : 0;
        const total = subtotal + deliveryCost;
        
        if (subtotalElement) subtotalElement.textContent = subtotal.toLocaleString() + ' ₽';
        if (deliveryCostElement) deliveryCostElement.textContent = deliveryCost.toLocaleString() + ' ₽';
        if (totalElement) totalElement.textContent = total.toLocaleString() + ' ₽';
    }
});