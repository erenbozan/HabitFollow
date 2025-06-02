const cron = require('node-cron');
const { Habit } = require('../models');
const { Op } = require('sequelize');

// Cron job that runs at midnight every day (for daily habits)
const resetDailyHabits = cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running daily habits reset cron job...');
        
        // Find daily habits and set last_tracked to null
        const result = await Habit.update(
            { last_tracked: null },
            {
                where: {
                    frequency: 'daily',
                    last_tracked: {
                        [Op.not]: null
                    }
                }
            }
        );

        console.log(`Reset ${result[0]} daily habits`);
    } catch (error) {
        console.error('Error in daily habits reset cron job:', error);
    }
}, {
    scheduled: true,
    timezone: "Europe/Istanbul" // Local timezone
});

// Cron job that runs at midnight every Monday (for weekly habits)
const resetWeeklyHabits = cron.schedule('0 0 * * 1', async () => {
    try {
        console.log('Running weekly habits reset cron job...');
        
        // Find weekly habits and set last_tracked to null
        const result = await Habit.update(
            { last_tracked: null },
            {
                where: {
                    frequency: 'weekly',
                    last_tracked: {
                        [Op.not]: null
                    }
                }
            }
        );

        console.log(`Reset ${result[0]} weekly habits`);
    } catch (error) {
        console.error('Error in weekly habits reset cron job:', error);
    }
}, {
    scheduled: true,
    timezone: "Europe/Istanbul" // Local timezone
});

module.exports = {
    resetDailyHabits,
    resetWeeklyHabits
}; 