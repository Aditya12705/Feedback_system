const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('./models/User');
const studentReportRoutes = require('./api/generateStudentReport'); // Import the student report routes

dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());
console.log('express.json() middleware added'); // Debugging log

// Middleware to parse URL-encoded request bodies (if needed)
app.use(express.urlencoded({ extended: true }));
console.log('express.urlencoded() middleware added'); // Debugging log

const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend URL if different
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(bodyParser.json()); // Added body-parser middleware

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/students', require('./routes/students')); // Ensure this route is registered correctly
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/student', require('./routes/student'));
app.use('/api/student-report', studentReportRoutes); // Ensure this route is registered

// Seed an admin user (run this once)
const seedAdmin = async () => {
    try {
        const adminExists = await User.findOne({ role: 'admin' });
        console.log('Checking if admin user exists:', adminExists);
        if (!adminExists) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            console.log('Hashed password for admin:', hashedPassword);
            const admin = new User({
                studentId: 'admin',
                name: 'Admin',
                password: hashedPassword,
                role: 'admin',
            });
            await admin.save();
            console.log('Admin user created: studentId: admin, password: admin123');
        } else {
            console.log('Admin user already exists');
        }
    } catch (err) {
        console.error('Error seeding admin user:', err);
    }
};
seedAdmin();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));