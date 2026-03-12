// Данные товаров для гитар
const guitarsData = {
    acoustic: [
        {
            id: 101,
            name: "Fender FA-125",
            price: 12500,
            image: "images/fenderfa.jpg",
            description: "Акустическая гитара с корпусом dreadnought",
            specs: {
                "Тип": "Акустическая гитара",
                "Форма корпуса": "Dreadnought",
                "Материал верхней деки": "Ель",
                "Количество струн": "6"
            }
        },
        {
            id: 102,
            name: "Yamaha F310",
            price: 18900,
            image: "images/f310.jpg",
            description: "Качественная гитара для начинающих",
            specs: {
                "Тип": "Акустическая гитара",
                "Форма корпуса": "Dreadnought",
                "Материал верхней деки": "Ель",
                "Количество струн": "6"
            }
        }
    ],
    electric: [
        {
            id: 201,
            name: "Fender Stratocaster",
            price: 45000,
            image: "images/fender.jpg",
            description: "Легендарная электрогитара",
            specs: {
                "Тип": "Электрогитара",
                "Форма корпуса": "Double-cutaway",
                "Звукосниматели": "3 сингла",
                "Количество струн": "6"
            }
        },
        {
            id: 202,
            name: "Gibson Les Paul",
            price: 68000,
            image: "images/lespaul.jpg",
            description: "Классика рок-музыки",
            specs: {
                "Тип": "Электрогитара",
                "Форма корпуса": "Single-cutaway",
                "Звукосниматели": "2 хамбакера",
                "Количество струн": "6"
            }
        }
    ],
    bass: [
        {
            id: 301,
            name: "Fender Precision Bass",
            price: 52000,
            image: "images/precision.jpg",
            description: "Икона бас-гитар",
            specs: {
                "Тип": "Бас-гитара",
                "Мензура": "34 дюйма",
                "Звукосниматели": "1 сплит-хамбакер",
                "Количество струн": "4"
            }
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров
    loadGuitarProducts('acoustic-guitars-grid', guitarsData.acoustic);
    loadGuitarProducts('electric-guitars-grid', guitarsData.electric);
    loadGuitarProducts('bass-guitars-grid', guitarsData.bass);
    
    // Функция загрузки товаров
    function loadGuitarProducts(elementId, products) {
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
        return [...guitarsData.acoustic, ...guitarsData.electric, ...guitarsData.bass]
            .find(p => p.id === productId);
    }
    
    // Функция добавления в корзину
    function addToCart(product) {
        // Используем глобальную функцию из script.js
        if (window.addToCart) {
            const success = window.addToCart(product);
            if (success) {
                // Анимация добавления в корзину
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