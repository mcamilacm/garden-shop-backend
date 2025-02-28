const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail, createUser } = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password, birth_date, city } = req.body;
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await createUser({ first_name, last_name, email, password: hashedPassword, birth_date, city });

        res.status(201).json({ message: 'Usuario registrado exitosamente', user });
    } catch (err) {
        res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ userId: user.user_id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login exitoso', token, user });
    } catch (err) {
        res.status(500).json({ message: 'Error interno del servidor', error: err.message });
    }
};

module.exports = { registerUser, loginUser };