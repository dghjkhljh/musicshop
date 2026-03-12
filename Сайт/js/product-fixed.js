// js/product-fixed.js
// ПОЛНЫЙ РАБОЧИЙ КОД - всё в одном файле

// Конфигурация Supabase
const SUPABASE_URL = 'https://ujijwwtvmbusocxprliz.supabase.co';
const SUPABASE_KEY = 'eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MioiJzdXBhYmFzZSIsInJlZii6InVpam';

// Ждем загрузки страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Страница загружена, начинаем...');
    
    try {
        // Проверяем, загружен ли Supabase
        if (typeof supabase === 'undefined') {
            throw new Error('Supabase библиотека не загружена! Проверьте подключение');
        }
        
        // Создаем клиент
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase клиент создан');
        
        // Получаем ID из URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        console.log('ID товара из URL:', productId);
        
        if (!productId) {
            showError('Не указан ID товара');
            return;
        }
        
        // Показываем загрузку
        showLoading();
        
        // Загружаем товар
        console.log('Загружаем товар...');
        const { data: product, error } = await supabaseClient
            .from('products')
            .select('*')
            .eq('id', parseInt(productId))
            .eq('active', true)
            .maybeSingle();
        
        console.log('Ответ от базы:', { product, error });
        
        if (error) {
            throw new Error('Ошибка базы данных: ' + error.message);
        }
        
        if (!product) {
            showError('Товар не найден');
            return;
        }
        
        // Отображаем товар
        displayProduct(product);
        
        // Обновляем заголовок
        document.title = `${product.name} - PerfectSound38`;
        
    } catch (error) {
        console.error('КРИТИЧЕСКАЯ ОШИБКА:', error);
        showError('Ошибка загрузки данных: ' + error.message);
    } finally {
        hideLoading();
    }
    
    // Обновляем корзину
    updateCartCount();
});

// Функция отображения товара
function displayProduct(product) {
    console.log('Отображаем товар:', product);
    
    // Название
    const titleEl = document.getElementById('product-title');
    if (titleEl) titleEl.textContent = product.name || 'Без названия';
    
    // Цена
    const priceEl = document.getElementById('product-price');
    if (priceEl) priceEl.textContent = formatPrice(product.price);
    
    // Описание
    const descEl = document.getElementById('product-description');
    if (descEl) descEl.textContent = product.description || 'Нет описания';
    
    // Изображение
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = product.image || 'images/placeholder.jpg';
        mainImage.alt = product.name;
        mainImage.onerror = function() { 
            this.src = 'images/placeholder.jpg';
            console.log('Ошибка загрузки изображения');
        };
    }
    
    // Характеристики
    displaySpecs(product.specs);
    
    // Наличие
    displayStock(product.stock);
    
    // Кнопка добавления
    setupAddToCart(product);
    
    // Рейтинг
    displayRating(product.rating);
}

// Характеристики
function displaySpecs(specs) {
    const specsTable = document.getElementById('specs-table');
    if (!specsTable) return;
    
    specsTable.innerHTML = '';
    
    if (specs && typeof specs === 'object') {
        let hasSpecs = false;
        for (const [key, value] of Object.entries(specs)) {
            if (value) {
                hasSpecs = true;
                const row = specsTable.insertRow();
                row.innerHTML = `
                    <td class="fw-bold" style="width: 40%">${key}</td>
                    <td>${value}</td>
                `;
            }
        }
        if (!hasSpecs) {
            const row = specsTable.insertRow();
            row.innerHTML = '<td colspan="2" class="text-center">Нет характеристик</td>';
        }
    } else {
        const row = specsTable.insertRow();
        row.innerHTML = '<td colspan="2" class="text-center">Нет характеристик</td>';
    }
}

// Наличие
function displayStock(stock) {
    // Удаляем старый индикатор если есть
    const oldStock = document.querySelector('.product-stock');
    if (oldStock) oldStock.remove();
    
    const stockDiv = document.createElement('div');
    stockDiv.className = 'product-stock mb-3';
    
    if (stock > 0) {
        stockDiv.innerHTML = `<span class="badge bg-success">В наличии: ${stock} шт.</span>`;
    } else {
        stockDiv.innerHTML = '<span class="badge bg-danger">Нет в наличии</span>';
    }
    
    const priceEl = document.getElementById('product-price');
    if (priceEl) {
        priceEl.insertAdjacentElement('afterend', stockDiv);
    }
}

// Рейтинг
function displayRating(rating) {
    const starsEl = document.querySelector('.stars');
    if (starsEl && rating) {
        const fullStars = Math.floor(rating);
        const stars = '★'.repeat(fullStars) + '☆'.repeat(5 - fullStars);
        starsEl.textContent = stars;
    }
}

// Кнопка в корзину
function setupAddToCart(product) {
    const addBtn = document.getElementById('add-to-cart-btn');
    if (!addBtn) return;
    
    // Удаляем старые обработчики
    const newBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newBtn, addBtn);
    
    if (product.stock <= 0) {
        newBtn.disabled = true;
        newBtn.classList.add('disabled');
        return;
    }
    
    newBtn.addEventListener('click', function() {
        addToCart(product);
        
        // Визуальная обратная связь
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="bi bi-check"></i> Добавлено!';
        this.classList.remove('btn-primary');
        this.classList.add('btn-success');
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.classList.remove('btn-success');
            this.classList.add('btn-primary');
        }, 2000);
    });
}

// Добавление в корзину
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity = (existing.quantity || 1) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`"${product.name}" добавлен в корзину!`);
}

// Обновление счетчика
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const counter = document.getElementById('cart-count');
    if (counter) counter.textContent = total;
}

// Форматирование цены
function formatPrice(price) {
    return (price || 0).toLocaleString() + ' ₽';
}

// Загрузка
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'product-loader';
    loader.innerHTML = `
        <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(255,255,255,0.9); z-index:9999; display:flex; justify-content:center; align-items:center; flex-direction:column;">
            <div class="spinner-border text-primary mb-3" style="width:3rem; height:3rem;"></div>
            <p class="text-primary">Загрузка товара...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('product-loader');
    if (loader) loader.remove();
}

// Ошибка
function showError(message) {
    const main = document.querySelector('main');
    if (!main) return;
    
    main.innerHTML = `
        <div class="container py-5">
            <div class="alert alert-warning text-center">
                <h2>😕 Товар не найден</h2>
                <p class="mb-3">${message}</p>
                <a href="catalog.html" class="btn btn-primary">В каталог</a>
            </div>
        </div>
    `;
}