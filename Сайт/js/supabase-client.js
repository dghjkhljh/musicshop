// js/supabase-client.js
// Подключение к Supabase для основного сайта

// Проверяем, загружен ли Supabase
if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded!');
}

// Конфигурация Supabase
const SUPABASE_URL = 'https://ujijwwtvmbusocxprliz.supabase.co';
const SUPABASE_KEY = 'eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MioiJzdXBhYmFzZSIsInJlZii6InVpam';

// Создаем клиент Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// API для работы с товарами
const SiteAPI = {
    // Получить товар по ID
    async getProductById(id) {
        try {
            console.log('Загружаем товар с ID:', id);
            
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('id', id)
                .eq('active', true)
                .maybeSingle();
            
            if (error) {
                console.error('Ошибка Supabase:', error);
                return null;
            }
            
            console.log('Получены данные:', data);
            return data;
            
        } catch (error) {
            console.error('Ошибка при загрузке товара:', error);
            return null;
        }
    },
    
    // Получить все товары
    async getAllProducts() {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('active', true)
                .order('id');
            
            if (error) throw error;
            return data || [];
            
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
            return [];
        }
    },
    
    // Получить товары по категории
    async getProductsByCategory(category) {
        try {
            const { data, error } = await supabaseClient
                .from('products')
                .select('*')
                .eq('category', category)
                .eq('active', true);
            
            if (error) throw error;
            return data || [];
            
        } catch (error) {
            console.error('Ошибка загрузки категории:', error);
            return [];
        }
    }
};

// Для отладки
console.log('Supabase client initialized');