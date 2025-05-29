const { Habit } = require('../models');
const { validationResult } = require('express-validator');

exports.createHabit = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, frequency } = req.body;
        const habit = await Habit.create({
            title,
            frequency,
            user_id: req.user.id
        });

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error creating habit' });
    }
};

exports.getHabits = async (req, res) => {
    try {
        const habits = await Habit.findAll({
            where: { user_id: req.user.id },
            order: [['created_at', 'DESC']]
        });

        const habitsWithCompletion = habits.map(habit => ({
            ...habit.toJSON(),
            isCompleted: habit.isCompleted()
        }));

        res.json(habitsWithCompletion);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching habits' });
    }
};

exports.updateHabit = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { title, frequency } = req.body;

        const habit = await Habit.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await habit.update({ title, frequency });
        res.json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error updating habit' });
    }
};

exports.deleteHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await Habit.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await habit.destroy();
        res.json({ message: 'Habit deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting habit' });
    }
};

exports.trackHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await Habit.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await habit.update({ last_tracked: new Date() });
        res.json(habit);
    } catch (error) {
        res.status(500).json({ message: 'Error tracking habit' });
    }
};

exports.toggleHabit = async (req, res) => {
    try {
        const { id } = req.params;
        const habit = await Habit.findOne({
            where: { id, user_id: req.user.id }
        });

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const isCurrentlyCompleted = habit.isCompleted();

        await habit.update({
            last_tracked: isCurrentlyCompleted ? null : new Date()
        });

        const updatedHabit = await Habit.findByPk(habit.id);
        
        res.json({
            ...updatedHabit.toJSON(),
            isCompleted: updatedHabit.isCompleted()
        });
    } catch (error) {
        console.error('Toggle habit error:', error);
        res.status(500).json({ message: 'Error toggling habit completion status' });
    }
}; 