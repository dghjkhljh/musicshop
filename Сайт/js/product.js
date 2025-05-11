// Данные товаров (обычно получаются с сервера)
const products = {
    101: {
        id: 101,
        name: "Fender FA-125 Акустическая гитара",
        price: 12500,
        category: "Акустические гитары",
        brand: "Fender",
        description: "Отличный выбор для начинающих гитаристов. Корпус dreadnought из ламинированной липы, гриф из нато с палисандровой накладкой. Отличное сочетание цены и качества.",
        images: [
            "images/guitar-acoustic1.jpg",
            "images/guitar-acoustic1-thumb1.jpg",
            "images/guitar-acoustic1-thumb2.jpg"
        ],
        specs: {
            "Тип": "Акустическая гитара",
            "Форма корпуса": "Dreadnought",
            "Материал корпуса": "Липа",
            "Материал грифа": "Нато",
            "Накладка грифа": "Палисандр",
            "Количество ладов": "20",
            "Количество струн": "6",
            "Цвет": "Натуральный",
            "Гарантия": "1 год"
        }
    },
    201: {
        id: 201,
        name: "Yamaha P-515 Цифровое пианино",
        price: 145000,
        category: "Цифровые пианино",
        brand: "Yamaha",
        description: "Премиальное цифровое пианино с натуральной механикой клавиш NWX (Natural Wood X). Воспроизводит звучание концертного рояля Yamaha CFX и рояля Bösendorfer Imperial.",
        images: [
            "images/piano1.jpg",
            "images/piano1-thumb1.jpg",
            "images/piano1-thumb2.jpg"
        ],
        specs: {
            "Тип": "Цифровое пианино",
            "Клавиши": "88 взвешенных клавиш с деревянными элементами (NWX)",
            "Полифония": "256 нот",
            "Тембры": "40 встроенных тембров",
            "Размеры": "146 × 46 × 132 см",
            "Вес": "48 кг",
            "Гарантия": "3 года"
        }
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const product = products[productId];
    
    if (!product) {
        // Если товар не найден
        document.querySelector('main').innerHTML = `
            <div class="alert alert-danger">
                <h2>Товар не найден</h2>
                <p>Извините, запрашиваемый товар не существует или был удален.</p>
                <a href="catalog.html" class="btn btn-primary">Вернуться в каталог</a>
            </div>
        `;
        return;
    }
    
    // Заполняем данные товара
    document.title = `${product.name} - PerfectSound38`;
    document.getElementById('product-title').textContent = product.name;
    document.getElementById('product-price').textContent = product.price.toLocaleString() + ' ₽';
    document.getElementById('product-description').textContent = product.description;
    
    // Устанавливаем главное изображение
    const mainImage = document.getElementById('main-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.name;
    
    // Добавляем миниатюры
    const thumbnailsContainer = document.getElementById('thumbnails');
    product.images.slice(1).forEach(imgSrc => {
        const thumbnail = document.createElement('img');
        thumbnail.src = imgSrc;
        thumbnail.alt = product.name;
        thumbnail.className = 'thumbnail img-thumbnail me-2';
        thumbnail.style.cursor = 'pointer';
        thumbnail.addEventListener('click', () => {
            mainImage.src = imgSrc;
        });
        thumbnailsContainer.appendChild(thumbnail);
    });
    
    // Заполняем характеристики
    const specsTable = document.getElementById('specs-table');
    for (const [key, value] of Object.entries(product.specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="fw-bold">${key}</td>
            <td>${value}</td>
        `;
        specsTable.appendChild(row);
    }
    
    // Обработчик кнопки "Добавить в корзину"
    document.getElementById('add-to-cart-btn').addEventListener('click', function() {
        // Получаем текущую корзину из localStorage
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Проверяем, есть ли уже этот товар в корзине
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            alert('Этот товар уже в вашей корзине!');
        } else {
            // Добавляем товар в корзину
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0]
            });
            
            // Сохраняем обновленную корзину
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Обновляем счетчик корзины
            updateCartCount();
            
            // Показываем уведомление
            alert('Товар добавлен в корзину!');
        }
    });
    
    // Функция обновления счетчика корзины
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        document.getElementById('cart-count').textContent = cart.length;
    }
    
    // Инициализируем счетчик
    updateCartCount();
});