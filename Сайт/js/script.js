// Общие функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    updateCartCount();
    
    // Получение корзины из localStorage
    window.getCart = function() {
        return JSON.parse(localStorage.getItem('cart')) || [];
    };
    
    // Сохранение корзины в localStorage
    window.saveCart = function(cart) {
        localStorage.setItem('cart', JSON.stringify(cart));
    };
    
    // Функция обновления счетчика корзины
    window.updateCartCount = function() {
        const cart = window.getCart();
        const cartCountElements = document.querySelectorAll('#cart-count');
        
        const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
        });
    };
    
    // Функция добавления товара в корзину
    window.addToCart = function(product) {
        let cart = window.getCart();
        
        // Проверяем, есть ли уже этот товар в корзине
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            // Увеличиваем количество
            existingItem.quantity = (existingItem.quantity || 1) + 1;
            alert(`Количество товара "${product.name}" увеличено!`);
        } else {
            // Добавляем новый товар
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                category: product.category || ''
            });
            alert(`"${product.name}" добавлен в корзину!`);
        }
        
        window.saveCart(cart);
        window.updateCartCount();
        return true;
    };
    
    // Функция удаления товара из корзины
    window.removeFromCart = function(productId, showAlert = true) {
        let cart = window.getCart();
        const productIndex = cart.findIndex(item => item.id === productId);
        
        if (productIndex !== -1) {
            const productName = cart[productIndex].name;
            cart.splice(productIndex, 1);
            window.saveCart(cart);
            window.updateCartCount();
            if (showAlert) {
                alert(`"${productName}" удален из корзины.`);
            }
            return true;
        }
        return false;
    };
    
    // Обработчик для кнопок "Подробнее" - исправляем ссылки на карточку товара
    document.querySelectorAll('.view-product').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id') || 
                             this.closest('[data-id]')?.getAttribute('data-id');
            if (productId) {
                window.location.href = `product.html?id=${productId}`;
            }
        });
    });
});