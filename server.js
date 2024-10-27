require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const users = []; // Array to store user data

// Admin Registration
app.post('/register', (req, res) => {
    const { email, password } = req.body;

    // Check if email matches admin email
    if (email === process.env.ADMIN_EMAIL) {
        const hashedPassword = bcrypt.hashSync(password, 10);
        const adminUser = { email, password: hashedPassword, role: 'admin' };
        users.push(adminUser);
        return res.status(201).json({ message: 'Admin account created successfully' });
    } else {
        return res.status(403).json({ message: 'Unauthorized email for admin' });
    }
});

// Customer Registration
app.post('/register-customer', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const customerUser = { email, password: hashedPassword, role: 'customer' };
    users.push(customerUser);
    res.status(201).json({ message: 'Customer account created successfully' });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ message: 'Login successful', token });
    } else {
        return res.status(400).json({ message: 'Invalid credentials' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
