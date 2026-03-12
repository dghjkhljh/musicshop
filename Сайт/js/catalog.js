// Данные товаров
const productsData = [
    // Акустические гитары
    {
        id: 101,
        name: "Fender FA-125 Акустическая гитара",
        price: 12500,
        category: "guitars",
        subcategory: "acoustic",
        brand: "Fender",
        image: "images/fenderfa.jpg",
        description: "Отличный выбор для начинающих гитаристов",
        inStock: true,
        rating: 4.5
    },
    {
        id: 102,
        name: "Yamaha F310 Акустическая гитара",
        price: 18900,
        category: "guitars",
        subcategory: "acoustic",
        brand: "Yamaha",
        image: "images/f310.jpg",
        description: "Качественная гитара для начинающих",
        inStock: true,
        rating: 4.7
    },
    
    // Электрогитары
    {
        id: 103,
        name: "Fender Stratocaster Электрогитара",
        price: 65000,
        category: "guitars",
        subcategory: "electric",
        brand: "Fender",
        image: "images/fender.jpg",
        description: "Легендарная модель с тремя синглами",
        inStock: true,
        rating: 4.9
    },
    {
        id: 104,
        name: "Gibson Les Paul Электрогитара",
        price: 85000,
        category: "guitars",
        subcategory: "electric",
        brand: "Gibson",
        image: "images/lespaul.jpg",
        description: "Классика рок-музыки с хамбакерами",
        inStock: true,
        rating: 4.8
    },
    
    // Клавишные
    {
        id: 201,
        name: "Yamaha P-515 Цифровое пианино",
        price: 145000,
        category: "keyboards",
        subcategory: "pianos",
        brand: "Yamaha",
        image: "images/yamaha-piano.jpg",
        description: "Премиальное цифровое пианино",
        inStock: true,
        rating: 4.9
    },
    {
        id: 202,
        name: "Korg Minilogue XD Синтезатор",
        price: 75000,
        category: "keyboards",
        subcategory: "synthesizers",
        brand: "Korg",
        image: "images/korgxd.jpg",
        description: "Аналоговый синтезатор с цифровыми эффектами",
        inStock: true,
        rating: 4.7
    },
    
    // Ударные
    {
        id: 301,
        name: "Pearl Export EXX725SP/C Барабанная установка",
        price: 125000,
        category: "drums",
        subcategory: "acoustic",
        brand: "Pearl",
        image: "images/pearldrum.jpg",
        description: "5-компонентная барабанная установка",
        inStock: true,
        rating: 4.7
    },
    {
        id: 302,
        name: "Roland TD-07KV Электронная ударная установка",
        price: 145000,
        category: "drums",
        subcategory: "electronic",
        brand: "Roland",
        image: "images/rolanddr.jpg",
        description: "Профессиональная электронная установка",
        inStock: true,
        rating: 4.8
    },
    
    // Духовые
    {
        id: 401,
        name: "Yamaha YTR-2330 Труба",
        price: 45000,
        category: "wind",
        subcategory: "brass",
        brand: "Yamaha",
        image: "images/yamahatr.jpg",
        description: "Труба для начинающих с мундштуком",
        inStock: true,
        rating: 4.5
    },
    {
        id: 402,
        name: "Yamaha YAS-280 Альт-саксофон",
        price: 125000,
        category: "wind",
        subcategory: "woodwind",
        brand: "Yamaha",
        image: "images/yamahayas.jpg",
        description: "Саксофон для студентов",
        inStock: true,
        rating: 4.6
    },
    {
        id: 403,
        name: "Hohner Bravo III Аккордеон",
        price: 85000,
        category: "wind",
        subcategory: "other",
        brand: "Hohner",
        image: "images/hohner.jpg",
        description: "Аккордеон с 120 басами",
        inStock: true,
        rating: 4.4
    }
];

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация
    let currentProducts = [...productsData];
    let currentPage = 1;
    const productsPerPage = 9;
    
    // Загрузка товаров
    renderProducts(currentProducts);
    updateProductsCount(currentProducts.length);
    
    // Функция рендеринга товаров
    function renderProducts(products) {
        const container = document.getElementById('products-container');
        const startIndex = (currentPage - 1) * productsPerPage;
        const paginatedProducts = products.slice(startIndex, startIndex + productsPerPage);
        
        container.innerHTML = paginatedProducts.map(product => `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}" 
                 data-subcategory="${product.subcategory}" data-brand="${product.brand}" 
                 data-price="${product.price}" data-stock="${product.inStock}">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <span class="product-category">${product.brand}</span>
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-price">${product.price.toLocaleString()} ₽</div>
                    <div class="product-actions">
                        <a href="product.html?id=${product.id}" class="view-product">Подробнее</a>
                        <button class="add-to-cart" data-id="${product.id}">В корзину</button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Назначение обработчиков для кнопок "В корзину"
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                addToCart(productId);
            });
        });
    }
    
    // Функция добавления в корзину
    function addToCart(productId) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Проверяем, нет ли уже этого товара в корзине
        if (!cart.some(item => item.id === product.id)) {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            
            updateCartCount();
            alert(`${product.name} добавлен в корзину!`);
        } else {
            alert('Этот товар уже в вашей корзине!');
        }
    }
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
    
    // Функция обновления счетчика товаров
    function updateProductsCount(count) {
        document.getElementById('products-count').textContent = count;
    }
    
    // Функция фильтрации товаров
    function filterProducts() {
        // Получаем выбранные категории
        const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(el => el.value);
        
        // Получаем выбранные бренды
        const selectedBrands = Array.from(document.querySelectorAll('input[name="brand"]:checked')).map(el => el.value);
        
        // Получаем ценовой диапазон
        const minPrice = parseInt(document.getElementById('min-price').value) || 0;
        const maxPrice = parseInt(document.getElementById('max-price').value) || Infinity;
        
        // Фильтруем товары
        currentProducts = productsData.filter(product => {
            return selectedCategories.includes(product.category) &&
                   selectedBrands.includes(product.brand) &&
                   product.price >= minPrice &&
                   product.price <= maxPrice;
        });
        
        // Сортируем товары
        sortProducts();
        
        // Обновляем отображение
        currentPage = 1;
        renderProducts(currentProducts);
        updateProductsCount(currentProducts.length);
        updatePagination();
    }
    
    // Функция сортировки товаров
    function sortProducts() {
        const sortBy = document.getElementById('sort-by').value;
        
        switch(sortBy) {
            case 'price-asc':
                currentProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                currentProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                currentProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                currentProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'popular':
                currentProducts.sort((a, b) => b.rating - a.rating);
                break;
        }
    }
    
    // Функция обновления пагинации
    function updatePagination() {
        const pageCount = Math.ceil(currentProducts.length / productsPerPage);
        const paginationContainer = document.querySelector('.pagination');
        
        paginationContainer.innerHTML = '';
        for (let i = 1; i <= pageCount; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.addEventListener('click', () => {
                currentPage = i;
                renderProducts(currentProducts);
                document.querySelectorAll('.page-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
            paginationContainer.appendChild(btn);
        }
    }
    
    // Назначение обработчиков событий
    document.querySelectorAll('.filter-sidebar input').forEach(input => {
        input.addEventListener('change', filterProducts);
    });
    
    document.getElementById('sort-by').addEventListener('change', () => {
        sortProducts();
        renderProducts(currentProducts);
    });
    
    document.getElementById('reset-filters').addEventListener('click', () => {
        document.querySelectorAll('.filter-sidebar input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        document.getElementById('min-price').value = '';
        document.getElementById('max-price').value = '';
        filterProducts();
    });
    
    // Инициализация корзины
    updateCartCount();
    updatePagination();
});