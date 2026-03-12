// Данные товаров для ударных
const drumsData = {
    acoustic: [
        {
            id: 601,
            name: "Pearl Export EXX725SP/C",
            price: 125000,
            image: "images/pearldrum.jpg",
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
            image: "images/tama.jpg",
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
            image: "images/rolanddr.jpg",
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
    
    // Функция загрузки товаров
    function loadDrumProducts(elementId, products) {
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
        return [...drumsData.acoustic, ...drumsData.electronic]
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