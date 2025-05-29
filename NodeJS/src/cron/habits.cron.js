const cron = require('node-cron');
const { Habit } = require('../models');
const { Op } = require('sequelize');

// Her gün gece yarısı çalışacak cron job (daily habits için)
const resetDailyHabits = cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Running daily habits reset cron job...');
        
        // Günlük alışkanlıkları bul ve last_tracked'ı null yap
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
    timezone: "Europe/Istanbul" // Türkiye saat dilimi
});

// Her Pazartesi gece yarısı çalışacak cron job (weekly habits için)
const resetWeeklyHabits = cron.schedule('0 0 * * 1', async () => {
    try {
        console.log('Running weekly habits reset cron job...');
        
        // Haftalık alışkanlıkları bul ve last_tracked'ı null yap
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
    timezone: "Europe/Istanbul" // Türkiye saat dilimi
});

module.exports = {
    resetDailyHabits,
    resetWeeklyHabits
}; 