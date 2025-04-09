const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/login', async (req, res) => {
    try {
        const { usn, password } = req.body;
        
        if (!usn || !password) {
            return res.status(400).json({ message: 'USN and password are required' });
        }

        console.log('Attempting login for USN:', usn);
        
        const user = await User.findOne({ studentId: usn });
        if (!user) {
            console.log('User not found in MongoDB for USN:', usn);
            return res.status(404).json({ 
                message: 'User not found. Please contact administrator if you are a valid student.',
                details: 'Student exists in MySQL but not in MongoDB'
            });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Include studentId in token payload
        const token = jwt.sign({
            id: user._id,
            role: user.role,
            studentId: user.studentId // Include studentId
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            token,
            role: user.role,
            name: user.name,
            course: user.course,
            studentId: user.studentId
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            message: 'Server error during login',
            error: err.message 
        });
    }
});

module.exports = router;