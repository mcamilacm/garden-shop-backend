const supabase = require('../db');

const getAllProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) throw error;
    return data;
};

module.exports = { getAllProducts };