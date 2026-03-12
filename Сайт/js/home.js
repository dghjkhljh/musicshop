// Данные товаров для главной страницы
const homeProducts = [
    {
        id: 101,
        name: "Fender FA-125 Акустическая гитара",
        price: 12500,
        category: "guitars",
        brand: "Fender",
        image: "images/fenderfa.jpg",
        description: "Отличный выбор для начинающих гитаристов",
        rating: 4.5
    },
    {
        id: 102,
        name: "Yamaha F310 Акустическая гитара",
        price: 18900,
        category: "guitars",
        brand: "Yamaha",
        image: "images/f310.jpg",
        description: "Качественная гитара для начинающих",
        rating: 4.7
    },
    {
        id: 103,
        name: "Fender Stratocaster Электрогитара",
        price: 65000,
        category: "guitars",
        brand: "Fender",
        image: "images/fender.jpg",
        description: "Легендарная модель с тремя синглами",
        rating: 4.9
    },
    {
        id: 104,
        name: "Gibson Les Paul Электрогитара",
        price: 85000,
        category: "guitars",
        brand: "Gibson",
        image: "images/lespaul.jpg",
        description: "Классика рок-музыки с хамбакерами",
        rating: 4.8
    },
    {
        id: 201,
        name: "Yamaha P-515 Цифровое пианино",
        price: 145000,
        category: "keyboards",
        brand: "Yamaha",
        image: "images/yamaha-piano.jpg",
        description: "Премиальное цифровое пианино",
        rating: 4.9
    },
    {
        id: 301,
        name: "Pearl Export Барабанная установка",
        price: 125000,
        category: "drums",
        brand: "Pearl",
        image: "images/pearldrum.jpg",
        description: "5-компонентная барабанная установка",
        rating: 4.7
    }
];

document.addEventListener('DOMContentLoaded', function() {
    renderPopularProducts();
    setupModal();
    updateCartCount();
});

// Рендер популярных товаров
function renderPopularProducts() {
    const container = document.getElementById('popular-products');
    if (!container) return;
    
    container.innerHTML = homeProducts.map(product => `
        <div class="col">
            <div class="card product-card-carousel h-100 border-0 shadow-sm">
                ${product.rating >= 4.5 ? '<span class="badge bg-danger position-absolute m-2">Хит</span>' : ''}
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: contain; padding: 15px;" onerror="this.src='images/placeholder.jpg'">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <span class="text-muted small">${product.brand}</span>
                        <div class="text-warning small">
                            ${renderRatingStars(product.rating)}
                        </div>
                    </div>
                    <h5 class="card-title mt-2">${product.name}</h5>
                    <p class="card-text text-muted small">${product.description.substring(0, 60)}...</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0 text-primary fw-bold">${product.price.toLocaleString()} ₽</h6>
                        <div>
                            <button class="btn btn-sm btn-outline-primary view-details me-2" data-id="${product.id}">
                                <i class="bi bi-info-circle"></i>
                            </button>
                            <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${product.id}">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Добавляем обработчики для кнопок "Подробнее"
    document.querySelectorAll('.view-details').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = this.getAttribute('data-id');
            window.location.href = `product.html?id=${productId}`;
        });
    });
    
    // Добавляем обработчики для кнопок "В корзину"
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const productId = parseInt(this.getAttribute('data-id'));
            const product = homeProducts.find(p => p.id === productId);
            if (product && window.addToCart) {
                window.addToCart(product);
                // Визуальная обратная связь
                this.innerHTML = '<i class="bi bi-check"></i>';
                this.classList.remove('btn-primary');
                this.classList.add('btn-success');
                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-cart-plus"></i>';
                    this.classList.remove('btn-success');
                    this.classList.add('btn-primary');
                }, 1500);
            }
        });
    });
}

// Настройка модального окна
function setupModal() {
    const productModal = document.getElementById('productModal');
    if (!productModal) return;
    
    productModal.addEventListener('show.bs.modal', function(event) {
        const button = event.relatedTarget;
        const productId = parseInt(button.getAttribute('data-id'));
        const product = homeProducts.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('modalProductTitle').textContent = product.name;
            document.getElementById('modalProductCategory').textContent = product.brand;
            document.getElementById('modalProductPrice').textContent = product.price.toLocaleString() + ' ₽';
            document.getElementById('modalProductDescription').textContent = product.description;
            document.getElementById('modalProductImage').src = product.image;
            document.getElementById('modalProductImage').alt = product.name;
            
            // Обновляем рейтинг
            const ratingElement = document.getElementById('modalProductRating');
            ratingElement.innerHTML = renderRatingStars(product.rating);
            
            // Пример характеристик
            const specsElement = document.getElementById('modalProductSpecs');
            specsElement.innerHTML = `
                <li>Бренд: ${product.brand}</li>
                <li>Категория: ${product.category}</li>
                <li>Рейтинг: ${product.rating}/5</li>
            `;
            
            // Обработчик для кнопки в модальном окне
            document.getElementById('modalAddToCart').onclick = function() {
                if (window.addToCart) {
                    window.addToCart(product);
                    const modal = bootstrap.Modal.getInstance(productModal);
                    modal.hide();
                }
            };
        }
    });
}

// Рендер звезд рейтинга
function renderRatingStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="bi bi-star-fill"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="bi bi-star-half"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="bi bi-star"></i>';
    }
    
    return stars;
}

// Обновление счетчика корзины
function updateCartCount() {
    if (window.updateCartCount) {
        window.updateCartCount();
    } else {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
            cartCountElement.textContent = totalItems;
        }
    }
}