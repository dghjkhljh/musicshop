// Подключение к Supabase
const SUPABASE_URL = 'https://ujijwwtvmbusocxprliz.supabase.co';
const SUPABASE_KEY = 'eyJhbGci0iJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MioiJzdXBhYmFzZSIsInJlZii6InVpam';

// Создаем клиент Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Класс для работы с товарами
const ProductsAPI = {
    // Получить все товары
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('id');
        
        if (error) {
            console.error('Ошибка загрузки:', error);
            return [];
        }
        return data;
    },
    
    // Получить один товар
    async getById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) console.error('Ошибка:', error);
        return data;
    },
    
    // Добавить товар
    async add(product) {
        const { data, error } = await supabase
            .from('products')
            .insert([product])
            .select();
        
        if (error) {
            console.error('Ошибка добавления:', error);
            return null;
        }
        return data[0];
    },
    
    // Обновить товар
    async update(id, product) {
        const { data, error } = await supabase
            .from('products')
            .update(product)
            .eq('id', id)
            .select();
        
        if (error) {
            console.error('Ошибка обновления:', error);
            return null;
        }
        return data[0];
    },
    
    // Удалить товар
    async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        
        if (error) {
            console.error('Ошибка удаления:', error);
            return false;
        }
        return true;
    }
};

// Класс для работы с заказами
const OrdersAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) console.error('Ошибка:', error);
        return data || [];
    },
    
    async add(order) {
        const { data, error } = await supabase
            .from('orders')
            .insert([order])
            .select();
        
        if (error) console.error('Ошибка:', error);
        return data?.[0];
    },
    
    async updateStatus(id, status) {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select();
        
        if (error) console.error('Ошибка:', error);
        return data?.[0];
    }
};

// Класс для работы с пользователями
const UsersAPI = {
    async getAll() {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('id');
        
        if (error) console.error('Ошибка:', error);
        return data || [];
    },
    
    async add(user) {
        const { data, error } = await supabase
            .from('users')
            .insert([user])
            .select();
        
        if (error) console.error('Ошибка:', error);
        return data?.[0];
    }
};