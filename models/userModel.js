const supabase = require('../db');

const getUserByEmail = async (email) => {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).maybeSingle();
    if (error) throw error;
    return data;
};

const createUser = async (userData) => {
    const { data, error } = await supabase.from('users').insert([userData]).select();
    if (error) throw error;
    return data[0];
};

module.exports = { getUserByEmail, createUser };