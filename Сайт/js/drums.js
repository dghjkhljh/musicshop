// Данные товаров для ударных
const drumsData = {
    acoustic: [
        {
            id: 601,
            name: "Pearl Export EXX725SP/C",
            price: 125000,
            image: "images/drum-set1.jpg",
            description: "5-компонентная барабанная установка, цвет Tobacco Burst",
            specs: {
                "Комплектация": "Бас-барабан, томы 10/12, напольный том 16, малый барабан 14",
                "Материал": "Тополь + махагон",
                "Отделка": "Лак"
            }
        },
        {
            id: 602,
            name: "Tama Imperialstar IE52KH6W",
            price: 98000,
            image: "images/drum-set2.jpg",
            description: "Комплект для начинающих с хардвером и тарелками",
            specs: {
                "Комплектация": "Бас-барабан, томы 10/12, напольный том 16, малый барабан 14",
                "Материал": "Тополь",
                "В комплекте": "Тарелки Hi-hat 14, Crash 16, Ride 20"
            }
        }
    ],
    electronic: [
        {
            id: 701,
            name: "Roland TD-07KV",
            price: 145000,
            image: "images/electronic-drum1.jpg",
            description: "Электронная барабанная установка с сетчатыми пэдами",
            specs: {
                "Пэды": "Сетчатые для малого барабана и томов",
                "Звуковой модуль": "TD-07 с Bluetooth",
                "Размеры": "110×110×110 см"
            }
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров
    loadDrumProducts('acoustic-drums-grid', drumsData.acoustic);
    loadDrumProducts('electronic-drums-grid', drumsData.electronic);
    
    // Обновление счетчика корзины
    updateCartCount();
    
    // Функция загрузки товаров
    function loadDrumProducts(elementId, products) {
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
                const product = [...drumsData.acoustic, ...drumsData.electronic].find(p => p.id === productId);
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