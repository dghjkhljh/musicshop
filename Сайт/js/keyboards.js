// Данные товаров для клавишных
const keyboardsData = {
    digitalPianos: [
        {
            id: 801,
            name: "Yamaha P-515",
            price: 145000,
            image: "images/piano1.jpg",
            description: "Цифровое пианино премиум-класса с натуральной механикой",
            specs: {
                "Клавиши": "88 взвешенных клавиш с деревянными элементами",
                "Полифония": "256 нот",
                "Звуки": "40 встроенных тембров"
            }
        },
        {
            id: 802,
            name: "Casio Privia PX-S3000",
            price: 98000,
            image: "images/piano2.jpg",
            description: "Ультратонкое цифровое пианино с Bluetooth",
            specs: {
                "Клавиши": "88 взвешенных клавиш",
                "Полифония": "192 ноты",
                "Толщина": "11 см"
            }
        }
    ],
    synthesizers: [
        {
            id: 901,
            name: "Korg Minilogue XD",
            price: 85000,
            image: "images/synth1.jpg",
            description: "Аналоговый синтезатор с 37 клавишами и цифровыми эффектами",
            specs: {
                "Клавиши": "37 мини-клавиш",
                "Голоса": "4-голосная полифония",
                "Осцилляторы": "2 аналоговых + 1 цифровой"
            }
        },
        {
            id: 902,
            name: "Roland JD-Xi",
            price: 65000,
            image: "images/synth2.jpg",
            description: "Гибридный синтезатор с аналоговыми и цифровыми звуками",
            specs: {
                "Клавиши": "37 мини-клавиш",
                "Секции": "Аналоговая + 2 цифровых + барабанная",
                "Встроенный секвенсор": "Да"
            }
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров
    loadKeyboardProducts('digital-pianos-grid', keyboardsData.digitalPianos);
    loadKeyboardProducts('synthesizers-grid', keyboardsData.synthesizers);
    
    // Обновление счетчика корзины
    updateCartCount();
    
    // Функция загрузки товаров
    function loadKeyboardProducts(elementId, products) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <div class="price">${product.price.toLocaleString()} ₽</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <a href="product.html?id=${product.id}" class="view-product">Подробнее</a>
                        <button class="add-to-cart" data-id="${product.id}">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Назначение обработчиков для кнопок
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = [...keyboardsData.digitalPianos, ...keyboardsData.synthesizers].find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                    updateCartCount();
                    alert(`${product.name} добавлен в корзину!`);
                }
            });
        });
    }
    
    // Функция добавления в корзину
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
});