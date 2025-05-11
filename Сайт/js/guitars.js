// Данные товаров для гитар
const guitarsData = {
    acoustic: [
        {
            id: 101,
            name: "Fender FA-125",
            price: 12500,
            image: "images/guitar-acoustic1.jpg",
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
            image: "images/guitar-acoustic2.jpg",
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
            image: "images/guitar-electric1.jpg",
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
            image: "images/guitar-electric2.jpg",
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
            image: "images/guitar-bass1.jpg",
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
    
    // Обновление счетчика корзины
    updateCartCount();
    
    // Функция загрузки товаров
    function loadGuitarProducts(elementId, products) {
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
                const product = [...guitarsData.acoustic, ...guitarsData.electric, ...guitarsData.bass].find(p => p.id === productId);
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