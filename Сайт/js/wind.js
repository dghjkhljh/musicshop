// Данные товаров для духовых инструментов
const windInstrumentsData = {
    woodwind: [
        {
            id: 401,
            name: "Yamaha YFL-222",
            price: 32500,
            image: "images/flute.jpg",
            description: "Флейта для начинающих с серебряным покрытием",
            specs: {
                "Тип": "Поперечная флейта",
                "Материал": "Никель-серебро",
                "Система": "Бёма",
                "Клавиши": "Закрытые"
            }
        },
        {
            id: 402,
            name: "Selmer CL211",
            price: 48900,
            image: "images/clarinet.jpg",
            description: "Кларнет для студентов с эбонитовым корпусом",
            specs: {
                "Тип": "Кларнет Bb",
                "Материал": "Эбонит",
                "Мензура": "Стандартная",
                "Клавиши": "17 клавиш, 6 колец"
            }
        }
    ],
    brass: [
        {
            id: 501,
            name: "Bach TR300",
            price: 65000,
            image: "images/trumpet.jpg",
            description: "Труба для начинающих с латунным корпусом",
            specs: {
                "Тип": "Труба Bb",
                "Материал": "Латунь",
                "Мундштук": "7C",
                "Отделка": "Лакированная"
            }
        },
        {
            id: 502,
            name: "Yamaha YSL-354",
            price: 72000,
            image: "images/trombone.jpg",
            description: "Тромбон с F-аппаратом для студентов",
            specs: {
                "Тип": "Теноровый тромбон",
                "Строение": "Bb/F",
                "Мундштук": "11",
                "Материал": "Желтая латунь"
            }
        }
    ],
    otherWind: [
        {
            id: 601,
            name: "Hohner Bravo III",
            price: 45000,
            image: "images/accordion.jpg",
            description: "Аккордеон с 120 басами и 41 клавишей",
            specs: {
                "Тип": "Аккордеон",
                "Клавиши": "41 (правая рука)",
                "Басы": "120 (левая рука)",
                "Регистры": "11"
            }
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров
    loadWindProducts('woodwind-grid', windInstrumentsData.woodwind);
    loadWindProducts('brass-grid', windInstrumentsData.brass);
    loadWindProducts('other-wind-grid', windInstrumentsData.otherWind);
    
    // Обновление счетчика корзины
    updateCartCount();
    
    // Функция загрузки товаров
    function loadWindProducts(elementId, products) {
        const container = document.getElementById(elementId);
        if (!container) return;
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
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
                const product = [...windInstrumentsData.woodwind, ...windInstrumentsData.brass, ...windInstrumentsData.otherWind].find(p => p.id === productId);
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