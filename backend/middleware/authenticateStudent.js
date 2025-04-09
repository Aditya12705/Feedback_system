const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateStudent = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            console.error('No token provided');
            return res.status(401).json({ message: 'No token provided' });
        }

        let decoded;
        try {
             decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (jwtErr) {
            console.error('JWT Verification Error:', jwtErr);
            return res.status(401).json({ message: 'Invalid token' });
        }

        const user = await User.findById(decoded.id);
        
        if (!user) {
            console.error('User not found:', decoded.id);
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'student') {
            console.error('Invalid role:', user.role);
            return res.status(403).json({ message: 'Access denied' });
        }

        // Attach complete user data
        req.user = {
            id: user._id,
            role: user.role,
            studentId: user.studentId,
            course: user.course,
            semester: user.semester,
            name: user.name
        };

        console.log('Authenticated user data:', req.user);
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateStudent;
