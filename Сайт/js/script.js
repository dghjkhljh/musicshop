// Общие функции для всех страниц
document.addEventListener('DOMContentLoaded', function() {
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const countElements = document.querySelectorAll('#cart-count, .cart-count');
        
        countElements.forEach(element => {
            element.textContent = cart.length;
        });
    }
    
    // Инициализация счетчика корзины
    updateCartCount();
    
    // Функция добавления товара в корзину
    window.addToCart = function(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Проверяем, есть ли уже этот товар в корзине
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            alert('Этот товар уже в вашей корзине!');
            return false;
        }
        
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        return true;
    };
    
    // Функция удаления товара из корзины
    window.removeFromCart = function(productId) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };
});