// js/product.js

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Product page loaded');
    
    try {
        // Получаем ID из URL
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        console.log('Product ID from URL:', productId);
        
        if (!productId) {
            showError('Не указан ID товара');
            return;
        }
        
        // Показываем загрузку
        showLoading();
        
        // Загружаем товар
        const product = await SiteAPI.getProductById(parseInt(productId));
        
        console.log('Loaded product:', product);
        
        if (!product) {
            showError('Товар не найден в базе данных');
            return;
        }
        
        // Отображаем товар
        displayProduct(product);
        
        // Обновляем заголовок
        document.title = `${product.name} - PerfectSound38`;
        
    } catch (error) {
        console.error('Critical error:', error);
        showError('Ошибка загрузки данных: ' + error.message);
    } finally {
        hideLoading();
    }
    
    // Обновляем корзину
    updateCartCount();
});

function displayProduct(product) {
    console.log('Displaying product:', product);
    
    // Основная информация
    setElementText('product-title', product.name || 'Без названия');
    setElementText('product-price', formatPrice(product.price));
    setElementText('product-description', product.description || 'Нет описания');
    
    // Изображение
    const mainImage = document.getElementById('main-image');
    if (mainImage) {
        mainImage.src = product.image || 'images/placeholder.jpg';
        mainImage.alt = product.name;
        mainImage.onerror = () => { mainImage.src = 'images/placeholder.jpg'; };
    }
    
    // Характеристики
    displaySpecs(product.specs);
    
    // Наличие
    displayStock(product.stock);
    
    // Кнопка добавления
    setupAddToCart(product);
}

function displaySpecs(specs) {
    const specsTable = document.getElementById('specs-table');
    if (!specsTable) return;
    
    specsTable.innerHTML = '';
    
    if (specs && typeof specs === 'object') {
        for (const [key, value] of Object.entries(specs)) {
            if (value) {
                const row = specsTable.insertRow();
                row.innerHTML = `
                    <td class="fw-bold">${key}</td>
                    <td>${value}</td>
                `;
            }
        }
    }
    
    // Если нет характеристик
    if (specsTable.rows.length === 0) {
        const row = specsTable.insertRow();
        row.innerHTML = '<td colspan="2" class="text-center">Нет характеристик</td>';
    }
}

function displayStock(stock) {
    const stockElement = document.querySelector('.product-stock') || document.createElement('div');
    stockElement.className = 'product-stock mb-3';
    
    if (stock > 0) {
        stockElement.innerHTML = `<span class="badge bg-success">В наличии: ${stock} шт.</span>`;
    } else {
        stockElement.innerHTML = '<span class="badge bg-danger">Нет в наличии</span>';
        
        const addBtn = document.getElementById('add-to-cart-btn');
        if (addBtn) {
            addBtn.disabled = true;
            addBtn.classList.add('disabled');
        }
    }
    
    const priceElement = document.getElementById('product-price');
    if (priceElement && !document.querySelector('.product-stock')) {
        priceElement.insertAdjacentElement('afterend', stockElement);
    }
}

function setupAddToCart(product) {
    const addBtn = document.getElementById('add-to-cart-btn');
    if (!addBtn) return;
    
    // Удаляем старые обработчики
    const newBtn = addBtn.cloneNode(true);
    addBtn.parentNode.replaceChild(newBtn, addBtn);
    
    newBtn.addEventListener('click', function() {
        if (product.stock <= 0) {
            alert('Товара нет в наличии');
            return;
        }
        
        addToCart(product);
        
        // Визуальная обратная связь
        this.innerHTML = '<i class="bi bi-check"></i> Добавлено!';
        this.classList.remove('btn-primary');
        this.classList.add('btn-success');
        
        setTimeout(() => {
            this.innerHTML = 'Добавить в корзину';
            this.classList.remove('btn-success');
            this.classList.add('btn-primary');
        }, 2000);
    });
}

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
    showNotification(`"${product.name}" добавлен в корзину`);
}

// Вспомогательные функции
function formatPrice(price) {
    return (price || 0).toLocaleString() + ' ₽';
}

function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'product-loader';
    loader.innerHTML = `
        <div style="position: fixed; top:0; left:0; right:0; bottom:0; background:rgba(255,255,255,0.9); z-index:9999; display:flex; justify-content:center; align-items:center;">
            <div class="spinner-border text-primary" style="width:3rem; height:3rem;"></div>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('product-loader');
    if (loader) loader.remove();
}

function showError(message) {
    const main = document.querySelector('main');
    if (!main) return;
    
    main.innerHTML = `
        <div class="container py-5">
            <div class="alert alert-warning text-center">
                <h2>Товар не найден</h2>
                <p>${message}</p>
                <a href="catalog.html" class="btn btn-primary mt-3">В каталог</a>
            </div>
        </div>
    `;
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const counter = document.getElementById('cart-count');
    if (counter) counter.textContent = total;
}

function showNotification(msg) {
    const notif = document.createElement('div');
    notif.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
    notif.style.zIndex = '9999';
    notif.innerHTML = `
        ${msg}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}