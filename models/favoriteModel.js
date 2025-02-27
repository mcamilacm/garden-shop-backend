const supabase = require('../db');

const getFavoritesByUser = async (userId) => {
    const { data, error } = await supabase
        .from('favorites')
        .select('product_id, products(name, description, price, image_url)')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
};

const addFavorite = async (userId, productId) => {
    const { error } = await supabase.from('favorites').insert([{ user_id: userId, product_id: productId }]);
    if (error) throw error;
};

const removeFavorite = async (userId, productId) => {
    const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('product_id', productId);
    if (error) throw error;
};

module.exports = { getFavoritesByUser, addFavorite, removeFavorite };