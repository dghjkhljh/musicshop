// Данные товаров для клавишных
const keyboardsData = {
    digitalPianos: [
        {
            id: 801,
            name: "Yamaha P-515",
            price: 145000,
            image: "images/yamaha-piano.jpg",
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
            image: "images/privia.jpg",
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
            image: "images/korgxd.jpg",
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
            image: "images/roland.jpg",
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
    
    // Функция загрузки товаров
    function loadKeyboardProducts(elementId, products) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="price">${product.price.toLocaleString()} ₽</div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <a href="product.html?id=${product.id}" class="btn btn-outline-primary view-product">Подробнее</a>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Назначение обработчиков для кнопок
        container.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = findProductById(productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
    }
    
    // Функция поиска товара по ID
    function findProductById(productId) {
        return [...keyboardsData.digitalPianos, ...keyboardsData.synthesizers]
            .find(p => p.id === productId);
    }
    
    // Функция добавления в корзину
    function addToCart(product) {
        if (window.addToCart) {
            const success = window.addToCart(product);
            if (success) {
                const button = document.querySelector(`.add-to-cart[data-id="${product.id}"]`);
                if (button) {
                    button.textContent = 'Добавлено!';
                    button.classList.remove('btn-primary');
                    button.classList.add('btn-success');
                    setTimeout(() => {
                        button.textContent = 'В корзину';
                        button.classList.remove('btn-success');
                        button.classList.add('btn-primary');
                    }, 2000);
                }
            }
        } else {
            console.error('Функция addToCart не найдена в script.js');
        }
    }
});