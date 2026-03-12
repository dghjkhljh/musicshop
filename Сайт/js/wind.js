// Данные товаров для духовых инструментов
const windInstrumentsData = {
    woodwind: [
        {
            id: 1201,
            name: "Yamaha YFL-222",
            price: 35000,
            image: "images/yfl.jpg",
            description: "Флейта для начинающих с серебряным покрытием",
            specs: {
                "Тип": "Поперечная флейта",
                "Материал": "Никелевое серебро",
                "Клавиши": "Закрытые",
                "Система": "C"
            }
        },
        {
            id: 1202,
            name: "Selmer CL211",
            price: 65000,
            image: "images/selmer.jpg",
            description: "Кларнет для студентов с эбонитовым корпусом",
            specs: {
                "Тип": "Кларнет Bb",
                "Материал": "Эбонит",
                "Клавиши": "17 клавиш + 6 колец",
                "Мундштук": "В комплекте"
            }
        },
        {
            id: 1203,
            name: "Yamaha YAS-280",
            price: 125000,
            image: "images/yamahayas.jpg",
            description: "Альт-саксофон для студентов",
            specs: {
                "Тип": "Альт-саксофон",
                "Материал": "Латунь",
                "Отделка": "Лак",
                "Клавиши": "Перламутровые"
            }
        }
    ],
    brass: [
        {
            id: 1301,
            name: "Yamaha YTR-2330",
            price: 45000,
            image: "images/yamahatr.jpg",
            description: "Труба для начинающих с мундштуком 11B4",
            specs: {
                "Тип": "Труба Bb",
                "Материал": "Латунь",
                "Мензура": "Medium-large",
                "Отделка": "Лак"
            }
        },
        {
            id: 1302,
            name: "Bach TR300",
            price: 68000,
            image: "images/bach.jpg",
            description: "Профессиональная труба со свинцовым мундштуком",
            specs: {
                "Тип": "Труба Bb",
                "Материал": "Желтая латунь",
                "Мензура": "Large",
                "Отделка": "Серебро"
            }
        }
    ],
    other: [
        {
            id: 1401,
            name: "Hohner Bravo III",
            price: 85000,
            image: "images/hohner.jpg",
            description: "Аккордеон с 120 басами и 41 клавишей",
            specs: {
                "Тип": "Аккордеон",
                "Клавиши": "41 (правая рука)",
                "Басы": "120 (левая рука)",
                "Регистры": "11 + 1"
            }
        }
    ]
};

document.addEventListener('DOMContentLoaded', function() {
    // Загрузка товаров
    loadWindProducts('woodwind-grid', windInstrumentsData.woodwind);
    loadWindProducts('brass-grid', windInstrumentsData.brass);
    loadWindProducts('other-wind-grid', windInstrumentsData.other);
    
    // Функция загрузки товаров
    function loadWindProducts(elementId, products) {
        const container = document.getElementById(elementId);
        if (!container) {
            console.error(`Элемент с ID ${elementId} не найден`);
            return;
        }
        
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
        return [...windInstrumentsData.woodwind, ...windInstrumentsData.brass, ...windInstrumentsData.other]
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