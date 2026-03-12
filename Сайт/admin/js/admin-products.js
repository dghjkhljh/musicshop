document.addEventListener('DOMContentLoaded', function() {
    // Моковые данные (в реальном проекте заменить на запросы к API)
    const products = [
        {
            id: 1,
            name: "Fender Stratocaster",
            category: "guitars",
            price: 45000,
            image: "../images/fender.jpg",
            stock: 5,
            active: true
        },
        // Добавьте другие товары
    ];

    // Заполнение таблицы товаров
    const productsTable = document.getElementById('products-table-body');
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>${product.price.toLocaleString()} ₽</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn btn-sm btn-primary btn-action">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger btn-action">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
        productsTable.appendChild(row);
    });

    // Обработчик сохранения нового товара
    document.getElementById('saveProductBtn').addEventListener('click', function() {
        // Здесь будет логика сохранения товара
        alert('Товар успешно добавлен!');
        // Закрыть модальное окно
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
    });

    // Вспомогательная функция
    function getCategoryName(category) {
        const categories = {
            'guitars': 'Гитары',
            'keyboards': 'Клавишные',
            'drums': 'Ударные',
            'wind': 'Духовые'
        };
        return categories[category] || category;
    }
});