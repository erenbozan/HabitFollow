const express = require('express');
const { body } = require('express-validator');
const habitController = require('../controllers/habit.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

// Apply auth middleware to all habit routes
router.use(authMiddleware);

router.post('/', [
    body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    body('frequency')
        .isIn(['daily', 'weekly'])
        .withMessage('Frequency must be daily or weekly')
], habitController.createHabit);

router.get('/', habitController.getHabits);

router.put('/:id', [
    body('title')
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    body('frequency')
        .isIn(['daily', 'weekly'])
        .withMessage('Frequency must be daily or weekly')
], habitController.updateHabit);

router.delete('/:id', habitController.deleteHabit);

router.post('/:id/toggle', habitController.toggleHabit);

module.exports = router; 