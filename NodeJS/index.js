require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Sequelize } = require('sequelize');
const { sequelize } = require('./src/models');
const authRoutes = require('./src/routes/auth.routes');
const habitRoutes = require('./src/routes/habit.routes');
const { resetDailyHabits, resetWeeklyHabits } = require('./src/cron/habits.cron');

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/auth', authRoutes);
app.use('/habits', habitRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;

// Database initialization and server start
async function initializeDatabase() {
    try {
        // Create database if it doesn't exist
        const rootSequelize = new Sequelize('postgres', 'postgres', '1234', {
            host: 'localhost',
            port: 5432,
            dialect: 'postgres'
        });

        try {
            await rootSequelize.query(`CREATE DATABASE myhabits`);
            console.log('Database created successfully');
        } catch (error) {
            if (error.parent.code !== '42P04') { // 42P04 is the error code for "database already exists"
                throw error;
            }
            console.log('Database already exists');
        }

        await rootSequelize.close();

        // Sync all models with force: false (this won't drop existing tables)
        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully');

        // Start cron jobs
        resetDailyHabits.start();
        resetWeeklyHabits.start();
        console.log('Habit reset cron jobs started');

        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database initialization error:', error);
        process.exit(1);
    }
}

// Start the application
initializeDatabase(); 
