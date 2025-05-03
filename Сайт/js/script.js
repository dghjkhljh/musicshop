// Мок данные товаров
const products = [
    {
        id: 1,
        name: "Fender Stratocaster",
        price: 45000,
        category: "guitars",
        image: "images/guitar1.jpg"
    },
    {
        id: 2,
        name: "Yamaha P-125",
        price: 65000,
        category: "keyboards",
        image: "images/piano1.jpg"
    },
    {
        id: 3,
        name: "Pearl Export",
        price: 80000,
        category: "drums",
        image: "images/drums1.jpg"
    }
];

// Инициализация корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Обновление счетчика корзины
function updateCartCount() {
    const countElements = document.querySelectorAll('#cart-count, .cart-count');
    countElements.forEach(element => {
        element.textContent = cart.length;
    });
}

// Добавление товара в корзину
function addToCart(productId, event) {
    event.preventDefault();
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push({...product}); // Создаем копию объекта
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Товар добавлен в корзину!');
    }
}

// Загрузка товаров на странице
function loadProducts() {
    const container = document.querySelector('.products-grid:not(.catalog-view)');
    if (container) {
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">${product.price.toLocaleString()} ₽</div>
                <a href="#" class="add-to-cart" data-id="${product.id}">В корзину</a>
            </div>
        `).join('');

        // Назначаем обработчики событий
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId, e);
            });
        });
    }
}

// Загрузка товаров в каталоге
function loadCatalog() {
    const container = document.querySelector('.catalog-view');
    if (container) {
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <div class="price">${product.price.toLocaleString()} ₽</div>
                <a href="product.html?id=${product.id}" class="view-product">Подробнее</a>
                <a href="#" class="add-to-cart" data-id="${product.id}">В корзину</a>
            </div>
        `).join('');

        // Назначаем обработчики событий
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId, e);
            });
        });
    }
}

// Загрузка товаров в корзине
function loadCart() {
    const container = document.querySelector('.cart-items');
    const totalElement = document.getElementById('total-price');
    
    if (container && totalElement) {
        if (cart.length === 0) {
            container.innerHTML = '<p>Ваша корзина пуста</p>';
            totalElement.textContent = '0';
            return;
        }
        
        container.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <div class="price">${item.price.toLocaleString()} ₽</div>
                </div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `).join('');
        
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        totalElement.textContent = total.toLocaleString();

        // Назначаем обработчики для кнопок удаления
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }
}

// Удаление товара из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartCount();
}

// Загрузка страницы товара
function loadProductPage() {
    if (window.location.pathname.includes('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = parseInt(urlParams.get('id'));
        const product = products.find(p => p.id === productId);
        
        if (product) {
            document.title = `${product.name} - MusicShop`;
            
            const productContainer = document.querySelector('.product-page');
            if (productContainer) {
                productContainer.innerHTML = `
                    <div class="product-images">
                        <img src="${product.image}" alt="${product.name}" id="main-image">
                    </div>
                    <div class="product-details">
                        <h1>${product.name}</h1>
                        <div class="price">${product.price.toLocaleString()} ₽</div>
                        <div class="description">
                            <h3>Описание</h3>
                            <p>${product.description || 'Описание отсутствует'}</p>
                        </div>
                        <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
                    </div>
                `;
                
                // Назначаем обработчик для кнопки
                document.querySelector('.add-to-cart').addEventListener('click', function(e) {
                    addToCart(productId, e);
                });
            }
        }
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadProducts();
    loadCatalog();
    loadCart();
    loadProductPage();
    
    // Обработка формы заказа
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
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
                total: cart.reduce((sum, item) => sum + item.price, 0)
            };
            
            console.log('Order data:', orderData);
            
            // Очищаем корзину
            cart = [];
            localStorage.removeItem('cart');
            updateCartCount();
            
            // Перенаправляем на страницу благодарности
            window.location.href = 'thank-you.html';
        });
    }
});