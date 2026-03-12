// admin/js/admin.js
// Полный код для админ-панели с поддержкой Supabase

// Глобальные переменные для хранения данных
let products = [];
let orders = [];
let users = [];

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Админ-панель загружается...');
    
    // Показываем индикатор загрузки
    showLoading();
    
    try {
        // Загружаем данные из Supabase
        await loadDataFromSupabase();
        
        // Инициализируем текущую страницу
        await initCurrentPage();
        
        // Инициализируем общие обработчики
        initCommon();
        
        console.log('Админ-панель готова!');
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
        showError('Ошибка загрузки данных. Проверьте подключение к Supabase.');
    } finally {
        // Скрываем индикатор загрузки
        hideLoading();
    }
});

// Показать индикатор загрузки
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'admin-loader';
    loader.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.8); z-index: 9999; display: flex; justify-content: center; align-items: center;">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Загрузка...</span>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
}

// Скрыть индикатор загрузки
function hideLoading() {
    const loader = document.getElementById('admin-loader');
    if (loader) loader.remove();
}

// Показать ошибку
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger alert-dismissible fade show m-3';
    errorDiv.setAttribute('role', 'alert');
    errorDiv.innerHTML = `
        <strong>Ошибка!</strong> ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.querySelector('.admin-main').prepend(errorDiv);
}

// Загрузка данных из Supabase
async function loadDataFromSupabase() {
    try {
        // Проверяем, доступен ли Supabase
        if (typeof ProductsAPI === 'undefined') {
            throw new Error('Supabase API не подключен');
        }
        
        // Загружаем все данные параллельно
        const [productsData, ordersData, usersData] = await Promise.all([
            ProductsAPI.getAll().catch(() => []),
            OrdersAPI.getAll().catch(() => []),
            UsersAPI.getAll().catch(() => [])
        ]);
        
        products = productsData || [];
        orders = ordersData || [];
        users = usersData || [];
        
        console.log('Данные загружены:', {
            products: products.length,
            orders: orders.length,
            users: users.length
        });
        
        // Сохраняем в глобальный объект для доступа из других функций
        window.products = products;
        window.orders = orders;
        window.users = users;
        
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        // Используем тестовые данные если Supabase недоступен
        useMockData();
    }
}

// Использовать тестовые данные (если Supabase недоступен)
function useMockData() {
    console.log('Используются тестовые данные');
    
    products = [
        { id: 1, name: 'Fender Stratocaster', price: 45000, category: 'guitars', brand: 'Fender', image: 'images/fender.jpg', stock: 5, active: true, description: 'Легендарная электрогитара' },
        { id: 2, name: 'Yamaha P-515', price: 145000, category: 'keyboards', brand: 'Yamaha', image: 'images/yamaha-piano.jpg', stock: 3, active: true, description: 'Цифровое пианино' },
        { id: 3, name: 'Pearl Export', price: 125000, category: 'drums', brand: 'Pearl', image: 'images/pearldrum.jpg', stock: 2, active: true, description: 'Барабанная установка' }
    ];
    
    orders = [
        { id: 1001, customer_name: 'Иван Петров', customer_email: 'ivan@mail.ru', customer_phone: '+7 999 123-45-67', total_amount: 45000, status: 'new', payment_method: 'card', created_at: '2024-03-15' },
        { id: 1002, customer_name: 'Мария Сидорова', total_amount: 68000, status: 'processing', payment_method: 'cash', created_at: '2024-03-14' },
        { id: 1003, customer_name: 'Алексей Иванов', total_amount: 52000, status: 'completed', payment_method: 'card', created_at: '2024-03-13' }
    ];
    
    users = [
        { id: 1, name: 'Администратор', email: 'admin@musicshop.ru', role: 'admin', avatar: 'images/admin.jpg', registered: '2024-01-01' },
        { id: 2, name: 'Иван Петров', email: 'ivan@mail.ru', phone: '+7 999 123-45-67', role: 'user', registered: '2024-02-15' }
    ];
    
    window.products = products;
    window.orders = orders;
    window.users = users;
}

// Инициализация текущей страницы
async function initCurrentPage() {
    // Определяем текущую страницу по URL
    const path = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';
    
    console.log('Текущая страница:', filename);
    
    // Инициализируем соответствующую страницу
    if (filename === 'index.html' || filename === 'admin/' || filename === '') {
        initDashboard();
    } else if (filename === 'products.html') {
        initProductsPage();
    } else if (filename === 'orders.html') {
        initOrdersPage();
    } else if (filename === 'users.html') {
        initUsersPage();
    } else if (filename === 'settings.html') {
        initSettingsPage();
    }
}

// Инициализация дашборда
function initDashboard() {
    console.log('Инициализация дашборда');
    
    // Обновляем статистику
    updateDashboardStats();
    
    // Заполняем последние заказы
    updateRecentOrders();
    
    // Заполняем популярные товары
    updatePopularProducts();
    
    // Заполняем график продаж (если есть элемент)
    initSalesChart();
}

// Обновление статистики на дашборде
function updateDashboardStats() {
    // Основные показатели
    setElementText('products-count', products.length);
    setElementText('orders-count', orders.length);
    setElementText('users-count', users.length);
    
    // Выручка
    const revenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
    setElementText('revenue', revenue.toLocaleString() + ' ₽');
    
    // Средний чек
    const avgOrder = orders.length > 0 ? Math.round(revenue / orders.length) : 0;
    setElementText('avg-order', avgOrder.toLocaleString() + ' ₽');
    
    // Товаров на складе
    const totalStock = products.reduce((sum, p) => sum + (p.stock || 0), 0);
    setElementText('total-stock', totalStock);
}

// Обновление последних заказов
function updateRecentOrders() {
    const ordersTable = document.getElementById('recent-orders');
    if (!ordersTable) return;
    
    const recentOrders = orders.slice(0, 5);
    
    if (recentOrders.length === 0) {
        ordersTable.innerHTML = '<tr><td colspan="6" class="text-center">Нет заказов</td></tr>';
        return;
    }
    
    ordersTable.innerHTML = recentOrders.map(order => {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const date = order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : '—';
        
        return `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${order.customer_name || 'Неизвестно'}</td>
                <td>${date}</td>
                <td>${(order.total_amount || 0).toLocaleString()} ₽</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <button class="btn btn-sm btn-primary view-order-btn" data-id="${order.id}" title="Просмотр">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary edit-order-btn" data-id="${order.id}" title="Редактировать">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Обновление популярных товаров
function updatePopularProducts() {
    const popularTable = document.getElementById('popular-products');
    if (!popularTable) return;
    
    const popularProducts = [...products].sort((a, b) => (b.stock || 0) - (a.stock || 0)).slice(0, 5);
    
    if (popularProducts.length === 0) {
        popularTable.innerHTML = '<tr><td colspan="5" class="text-center">Нет товаров</td></tr>';
        return;
    }
    
    popularTable.innerHTML = popularProducts.map(product => {
        const categoryName = getCategoryName(product.category);
        
        return `
            <tr>
                <td><img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px;"></td>
                <td>${product.name}</td>
                <td>${categoryName}</td>
                <td>${(product.price || 0).toLocaleString()} ₽</td>
                <td><span class="badge bg-${product.stock > 0 ? 'success' : 'danger'}">${product.stock || 0}</span></td>
            </tr>
        `;
    }).join('');
}

// Инициализация графика продаж
function initSalesChart() {
    const canvas = document.getElementById('sales-chart');
    if (!canvas || typeof Chart === 'undefined') return;
    
    // Группируем заказы по дням
    const salesByDay = {};
    const last7Days = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
        last7Days.push(dateStr);
        salesByDay[dateStr] = 0;
    }
    
    orders.forEach(order => {
        if (order.created_at) {
            const date = new Date(order.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
            if (salesByDay[date] !== undefined) {
                salesByDay[date] += order.total_amount || 0;
            }
        }
    });
    
    new Chart(canvas, {
        type: 'line',
        data: {
            labels: last7Days,
            datasets: [{
                label: 'Продажи (₽)',
                data: last7Days.map(day => salesByDay[day] || 0),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Инициализация страницы товаров
function initProductsPage() {
    console.log('Инициализация страницы товаров');
    
    const productsTable = document.getElementById('products-table-body');
    if (!productsTable) return;
    
    if (products.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="8" class="text-center py-4">Нет товаров. Добавьте первый товар!</td></tr>';
        return;
    }
    
    productsTable.innerHTML = products.map(product => {
        const categoryName = getCategoryName(product.category);
        const activeBadge = product.active ? 
            '<span class="badge bg-success">Активен</span>' : 
            '<span class="badge bg-secondary">Неактивен</span>';
        
        return `
            <tr>
                <td><strong>${product.id}</strong></td>
                <td>
                    <img src="${product.image || 'images/placeholder.jpg'}" alt="${product.name}" 
                         style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"
                         onerror="this.src='images/placeholder.jpg'">
                </td>
                <td>${product.name}</td>
                <td>${categoryName}</td>
                <td class="fw-bold">${(product.price || 0).toLocaleString()} ₽</td>
                <td>
                    <span class="badge bg-${product.stock > 0 ? 'success' : 'danger'}">
                        ${product.stock || 0} шт.
                    </span>
                </td>
                <td>${activeBadge}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-product-btn" data-id="${product.id}" title="Редактировать">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-product-btn" data-id="${product.id}" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Добавляем обработчики для кнопок
    addProductHandlers();
    setupSearchAndFilters();
}

// Добавление обработчиков для товаров
function addProductHandlers() {
    // Редактирование товара
    document.querySelectorAll('.edit-product-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            const product = products.find(p => p.id == id);
            if (product) {
                openEditProductModal(product);
            }
        });
    });
    
    // Удаление товара
    document.querySelectorAll('.delete-product-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
            const id = this.getAttribute('data-id');
            if (await confirmDelete('товар')) {
                await deleteProduct(id);
            }
        });
    });
}

// Открыть модальное окно редактирования товара
function openEditProductModal(product) {
    // Заполняем форму
    setElementValue('productName', product.name);
    setElementValue('productCategory', product.category);
    setElementValue('productPrice', product.price);
    setElementValue('productStock', product.stock);
    setElementValue('productDescription', product.description || '');
    
    const activeCheckbox = document.getElementById('productActive');
    if (activeCheckbox) {
        activeCheckbox.checked = product.active !== false;
    }
    
    // Сохраняем ID товара для обновления
    document.getElementById('editProductId')?.setAttribute('value', product.id);
    
    // Меняем заголовок и кнопку
    const modalTitle = document.querySelector('#addProductModal .modal-title');
    if (modalTitle) modalTitle.textContent = 'Редактирование товара';
    
    const saveBtn = document.getElementById('saveProductBtn');
    if (saveBtn) {
        saveBtn.textContent = 'Обновить товар';
        saveBtn.onclick = () => updateProduct(product.id);
    }
    
    // Открываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    modal.show();
}

// Удаление товара
async function deleteProduct(id) {
    try {
        if (typeof ProductsAPI !== 'undefined') {
            await ProductsAPI.delete(id);
        }
        
        // Обновляем локальные данные
        products = products.filter(p => p.id != id);
        window.products = products;
        
        // Обновляем таблицу
        initProductsPage();
        
        showNotification('Товар успешно удален', 'success');
    } catch (error) {
        console.error('Ошибка удаления:', error);
        showNotification('Ошибка при удалении товара', 'danger');
    }
}

// Обновление товара
async function updateProduct(id) {
    const product = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseInt(document.getElementById('productPrice').value),
        stock: parseInt(document.getElementById('productStock').value),
        description: document.getElementById('productDescription').value,
        active: document.getElementById('productActive')?.checked || true,
        image: products.find(p => p.id == id)?.image || 'images/placeholder.jpg'
    };
    
    try {
        if (typeof ProductsAPI !== 'undefined') {
            await ProductsAPI.update(id, product);
        }
        
        // Обновляем локальные данные
        const index = products.findIndex(p => p.id == id);
        if (index !== -1) {
            products[index] = { ...products[index], ...product };
        }
        window.products = products;
        
        // Закрываем модальное окно
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
        
        // Обновляем страницу
        initProductsPage();
        
        showNotification('Товар обновлен', 'success');
    } catch (error) {
        console.error('Ошибка обновления:', error);
        showNotification('Ошибка при обновлении товара', 'danger');
    }
}

// Инициализация страницы заказов
function initOrdersPage() {
    console.log('Инициализация страницы заказов');
    
    const ordersTable = document.getElementById('orders-table-body');
    if (!ordersTable) return;
    
    if (orders.length === 0) {
        ordersTable.innerHTML = '<tr><td colspan="7" class="text-center py-4">Нет заказов</td></tr>';
        return;
    }
    
    ordersTable.innerHTML = orders.map(order => {
        const statusClass = getStatusClass(order.status);
        const statusText = getStatusText(order.status);
        const date = order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU') : '—';
        const paymentText = getPaymentText(order.payment_method);
        
        return `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${order.customer_name || 'Неизвестно'}</td>
                <td>${date}</td>
                <td class="fw-bold">${(order.total_amount || 0).toLocaleString()} ₽</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>${paymentText}</td>
                <td>
                    <button class="btn btn-sm btn-primary view-order-btn" data-id="${order.id}" title="Просмотр">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-secondary edit-order-btn" data-id="${order.id}" title="Редактировать статус">
                        <i class="bi bi-pencil"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Добавляем обработчики
    addOrderHandlers();
    setupOrderFilters();
}

// Добавление обработчиков для заказов
function addOrderHandlers() {
    document.querySelectorAll('.view-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showOrderDetails(id);
        });
    });
    
    document.querySelectorAll('.edit-order-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            showEditOrderModal(id);
        });
    });
}

// Показать детали заказа
function showOrderDetails(id) {
    const order = orders.find(o => o.id == id);
    if (!order) return;
    
    const date = order.created_at ? new Date(order.created_at).toLocaleString('ru-RU') : '—';
    
    const detailsHtml = `
        <div class="order-details">
            <p><strong>Заказ #${order.id}</strong></p>
            <p>Клиент: ${order.customer_name || 'Неизвестно'}</p>
            <p>Email: ${order.customer_email || '—'}</p>
            <p>Телефон: ${order.customer_phone || '—'}</p>
            <p>Дата: ${date}</p>
            <p>Сумма: ${(order.total_amount || 0).toLocaleString()} ₽</p>
            <p>Статус: ${getStatusText(order.status)}</p>
            <p>Оплата: ${getPaymentText(order.payment_method)}</p>
            <p>Адрес: ${order.address || '—'}</p>
        </div>
    `;
    
    // Здесь можно открыть модальное окно с деталями
    alert('Детали заказа:\n\n' + 
          `ID: #${order.id}\n` +
          `Клиент: ${order.customer_name || 'Неизвестно'}\n` +
          `Сумма: ${(order.total_amount || 0).toLocaleString()} ₽\n` +
          `Статус: ${getStatusText(order.status)}`);
}

// Инициализация страницы пользователей
function initUsersPage() {
    console.log('Инициализация страницы пользователей');
    
    const usersTable = document.getElementById('users-table-body');
    if (!usersTable) return;
    
    if (users.length === 0) {
        usersTable.innerHTML = '<tr><td colspan="8" class="text-center py-4">Нет пользователей</td></tr>';
        return;
    }
    
    usersTable.innerHTML = users.map(user => {
        const roleText = getRoleText(user.role);
        const roleClass = getRoleClass(user.role);
        const date = user.registered ? new Date(user.registered).toLocaleDateString('ru-RU') : '—';
        
        return `
            <tr>
                <td><strong>${user.id}</strong></td>
                <td>
                    <img src="${user.avatar || 'images/default-avatar.jpg'}" alt="${user.name}" 
                         style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;"
                         onerror="this.src='images/default-avatar.jpg'">
                </td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.phone || '—'}</td>
                <td><span class="badge bg-${roleClass}">${roleText}</span></td>
                <td>${date}</td>
                <td>
                    <button class="btn btn-sm btn-primary edit-user-btn" data-id="${user.id}" title="Редактировать">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-user-btn" data-id="${user.id}" title="Удалить">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Добавляем обработчики
    addUserHandlers();
}

// Инициализация страницы настроек
function initSettingsPage() {
    console.log('Инициализация страницы настроек');
    
    // Загружаем настройки из localStorage
    loadSettings();
    
    // Обработчик сохранения настроек
    document.getElementById('saveSettingsBtn')?.addEventListener('click', saveSettings);
}

// Загрузка настроек
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings')) || {
        siteName: 'PerfectSound38',
        email: 'info@perfectsound38.ru',
        phone: '+7 (3952) 47-16-59',
        address: 'г. Иркутск, ул. Баумана, 214',
        currency: '₽',
        deliveryCost: '500'
    };
    
    Object.keys(settings).forEach(key => {
        setElementValue(key, settings[key]);
    });
}

// Сохранение настроек
function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName')?.value || 'PerfectSound38',
        email: document.getElementById('email')?.value || '',
        phone: document.getElementById('phone')?.value || '',
        address: document.getElementById('address')?.value || '',
        currency: document.getElementById('currency')?.value || '₽',
        deliveryCost: document.getElementById('deliveryCost')?.value || '500'
    };
    
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    showNotification('Настройки сохранены', 'success');
}

// Настройка поиска и фильтров
function setupSearchAndFilters() {
    const searchInput = document.querySelector('.admin-search input');
    if (searchInput) {
        searchInput.addEventListener('keyup', debounce(function(e) {
            const query = e.target.value.toLowerCase();
            filterProducts(query);
        }, 300));
    }
    
    // Фильтр по категории
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            filterByCategory(this.value);
        });
    }
}

// Фильтрация товаров
function filterProducts(query) {
    const rows = document.querySelectorAll('#products-table-body tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(query) ? '' : 'none';
    });
}

// Фильтрация по категории
function filterByCategory(category) {
    const rows = document.querySelectorAll('#products-table-body tr');
    rows.forEach(row => {
        if (!category || category === 'all') {
            row.style.display = '';
        } else {
            const rowCategory = row.querySelector('td:nth-child(4)')?.textContent.toLowerCase();
            row.style.display = rowCategory === getCategoryName(category).toLowerCase() ? '' : 'none';
        }
    });
}

// Настройка фильтров заказов
function setupOrderFilters() {
    const statusFilter = document.getElementById('orderStatusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            filterOrdersByStatus(this.value);
        });
    }
    
    const dateFrom = document.getElementById('orderDateFrom');
    const dateTo = document.getElementById('orderDateTo');
    
    if (dateFrom && dateTo) {
        dateFrom.addEventListener('change', filterOrdersByDate);
        dateTo.addEventListener('change', filterOrdersByDate);
    }
}

// Фильтрация заказов по статусу
function filterOrdersByStatus(status) {
    const rows = document.querySelectorAll('#orders-table-body tr');
    rows.forEach(row => {
        if (status === 'all') {
            row.style.display = '';
        } else {
            const statusCell = row.querySelector('td:nth-child(5) span');
            const statusText = statusCell?.textContent.toLowerCase() || '';
            row.style.display = statusText === getStatusText(status).toLowerCase() ? '' : 'none';
        }
    });
}

// Фильтрация заказов по дате
function filterOrdersByDate() {
    const dateFrom = document.getElementById('orderDateFrom')?.value;
    const dateTo = document.getElementById('orderDateTo')?.value;
    
    if (!dateFrom && !dateTo) return;
    
    const rows = document.querySelectorAll('#orders-table-body tr');
    rows.forEach(row => {
        const dateCell = row.querySelector('td:nth-child(3)')?.textContent;
        if (!dateCell) return;
        
        const orderDate = parseDate(dateCell);
        let show = true;
        
        if (dateFrom && orderDate < new Date(dateFrom)) show = false;
        if (dateTo && orderDate > new Date(dateTo)) show = false;
        
        row.style.display = show ? '' : 'none';
    });
}

// Общие обработчики для всех страниц
function initCommon() {
    // Подсветка активного пункта меню
    highlightActiveMenuItem();
    
    // Обработчик кнопки "Сохранить товар"
    const saveProductBtn = document.getElementById('saveProductBtn');
    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveNewProduct);
    }
    
    // Обработчик кнопки "Сохранить пользователя"
    const saveUserBtn = document.getElementById('saveUserBtn');
    if (saveUserBtn) {
        saveUserBtn.addEventListener('click', saveNewUser);
    }
    
    // Обработчик кнопки "Сбросить фильтры"
    const resetFiltersBtn = document.getElementById('resetFilters');
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    // Обработчик выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

// Подсветка активного пункта меню
function highlightActiveMenuItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.admin-nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.closest('li').classList.add('active');
        } else {
            link.closest('li').classList.remove('active');
        }
    });
}

// Сохранение нового товара
async function saveNewProduct() {
    // Валидация
    const name = document.getElementById('productName')?.value;
    const category = document.getElementById('productCategory')?.value;
    const price = document.getElementById('productPrice')?.value;
    
    if (!name || !category || !price) {
        showNotification('Заполните все обязательные поля', 'warning');
        return;
    }
    
    const product = {
        name: name,
        category: category,
        price: parseInt(price),
        stock: parseInt(document.getElementById('productStock')?.value) || 0,
        description: document.getElementById('productDescription')?.value || '',
        active: document.getElementById('productActive')?.checked || true,
        image: 'images/new-product.jpg',
        brand: document.getElementById('productBrand')?.value || ''
    };
    
    try {
        let newProduct;
        if (typeof ProductsAPI !== 'undefined') {
            newProduct = await ProductsAPI.add(product);
        } else {
            newProduct = { ...product, id: products.length + 1 };
            products.push(newProduct);
        }
        
        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
        if (modal) modal.hide();
        
        // Очищаем форму
        document.getElementById('addProductForm')?.reset();
        
        // Обновляем страницу
        await loadDataFromSupabase();
        initProductsPage();
        
        showNotification('Товар успешно добавлен', 'success');
    } catch (error) {
        console.error('Ошибка добавления товара:', error);
        showNotification('Ошибка при добавлении товара', 'danger');
    }
}

// Сохранение нового пользователя
async function saveNewUser() {
    const user = {
        name: document.getElementById('userName')?.value,
        email: document.getElementById('userEmail')?.value,
        phone: document.getElementById('userPhone')?.value,
        role: document.getElementById('userRole')?.value || 'user',
        registered: new Date().toISOString(),
        avatar: 'images/default-avatar.jpg'
    };
    
    if (!user.name || !user.email) {
        showNotification('Заполните имя и email', 'warning');
        return;
    }
    
    try {
        if (typeof UsersAPI !== 'undefined') {
            await UsersAPI.add(user);
        } else {
            users.push({ ...user, id: users.length + 1 });
        }
        
        bootstrap.Modal.getInstance(document.getElementById('addUserModal')).hide();
        document.getElementById('addUserForm')?.reset();
        
        await loadDataFromSupabase();
        initUsersPage();
        
        showNotification('Пользователь добавлен', 'success');
    } catch (error) {
        console.error('Ошибка:', error);
        showNotification('Ошибка при добавлении пользователя', 'danger');
    }
}

// Подтверждение удаления
async function confirmDelete(item) {
    return confirm(`Вы уверены, что хотите удалить ${item}?`);
}

// Сброс всех фильтров
function resetAllFilters() {
    document.querySelectorAll('input[type="text"], input[type="date"], select').forEach(el => {
        if (el.id !== 'orderStatusFilter') {
            el.value = '';
        }
    });
    
    document.getElementById('orderStatusFilter').value = 'all';
    
    // Показываем все строки
    document.querySelectorAll('table tbody tr').forEach(row => {
        row.style.display = '';
    });
}

// Выход из админ-панели
function logout() {
    if (confirm('Выйти из админ-панели?')) {
        window.location.href = '../index.html';
    }
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.setAttribute('role', 'alert');
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Вспомогательные функции
function setElementText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function setElementValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function getStatusClass(status) {
    const classes = {
        'new': 'status-new',
        'processing': 'status-processing',
        'shipped': 'status-shipped',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-new';
}

function getStatusText(status) {
    const texts = {
        'new': 'Новый',
        'processing': 'В обработке',
        'shipped': 'Отправлен',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
    };
    return texts[status] || status;
}

function getPaymentText(payment) {
    const texts = {
        'card': 'Картой',
        'cash': 'Наличными',
        'sbp': 'СБП',
        'online': 'Онлайн'
    };
    return texts[payment] || payment || '—';
}

function getCategoryName(category) {
    const categories = {
        'guitars': 'Гитары',
        'keyboards': 'Клавишные',
        'drums': 'Ударные',
        'wind': 'Духовые',
        'accessories': 'Аксессуары'
    };
    return categories[category] || category || 'Другое';
}

function getRoleText(role) {
    const texts = {
        'admin': 'Администратор',
        'manager': 'Менеджер',
        'user': 'Пользователь'
    };
    return texts[role] || role;
}

function getRoleClass(role) {
    const classes = {
        'admin': 'danger',
        'manager': 'warning',
        'user': 'primary'
    };
    return classes[role] || 'secondary';
}

function parseDate(dateStr) {
    const parts = dateStr.split('.');
    if (parts.length === 3) {
        return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    return new Date(dateStr);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Экспортируем функции для использования в других файлах
window.adminFunctions = {
    loadDataFromSupabase,
    initDashboard,
    initProductsPage,
    initOrdersPage,
    initUsersPage,
    showNotification,
    refreshData: async () => {
        await loadDataFromSupabase();
        initCurrentPage();
    }
};