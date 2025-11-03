const express = require('express');
const router = express.Router();

const Habit = require('../models/Habit');

// ✅ Fix: added missing parentheses, fixed sorting logic.
const isSameDay = (aIso, bIso) => {
    if (!aIso || !bIso) return false;
    const a = new Date(aIso);
    const b = new Date(bIso);
    return (
        a.getUTCFullYear() === b.getUTCFullYear() &&
        a.getUTCMonth() === b.getUTCMonth() &&
        a.getUTCDate() === b.getUTCDate()
    );
};

// ✅ Fixed CalcStreak — previous version had many bugs
function CalcStreak(history) {
    if (!history || history.length === 0) return 0;

    // ✅ Convert to yyyy-mm-dd format & sort descending
    const days = [...new Set(history.map(d => new Date(d).toISOString().slice(0, 10)))]
        .sort((a, b) => b.localeCompare(a));

    let today = new Date();
    let pointer = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    let streak = 0;

    for (let day of days) {
        const pointerStr = pointer.toISOString().slice(0, 10);
        if (day === pointerStr) {
            streak++;
            pointer.setUTCDate(pointer.getUTCDate() - 1);
        } else break;
    }

    return streak;
}

// ✅ computeBadges must return the updated list (your version returned nothing)
function computeBadges(streak, badges = []) {
    const earned = new Set(badges);
    const thresholds = [
        { days: 7, id: '7-day' },
        { days: 30, id: '30-day' },
        { days: 90, id: '90-days' },
        { days: 180, id: '180-days' },
    ];
    thresholds.forEach(t => {
        if (streak >= t.days) {
            earned.add(t.id);
        }
    });

    return Array.from(earned);
}

// ✅ GET all habits


// ✅ Create habit
router.post('/', async (req, res) => {
    try {
        const { title, description } = req.body;
        const habit = new Habit({ title, description });
        await habit.save();
        res.status(201).json(habit);  // ✅ 201 not 210
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Complete habit
router.post('/:id/complete', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ error: 'Not found' });

        const todayISO = new Date().toISOString().slice(0, 10);

        if (habit.lastCompleted?.slice(0, 10) === todayISO) {
            const streak = CalcStreak(habit.history);
            habit.streak = streak;
            habit.badges = computeBadges(streak, habit.badges);
            await habit.save();
            return res.json(habit);
        }

        habit.history.push(new Date());
        habit.lastCompleted = new Date();

        const streak = CalcStreak(habit.history);
        habit.streak = streak;

        habit.bestStreak = Math.max(streak, habit.bestStreak || 0);
        habit.badges = computeBadges(streak, habit.badges);

        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Reset habit
router.put('/:id/reset', async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);
        if (!habit) return res.status(404).json({ error: 'Not found' });

        habit.history = [];
        habit.streak = 0;
        habit.bestStreak = 0;
        habit.badges = [];
        habit.lastCompleted = null;

        await habit.save();
        res.json(habit);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ FIXED: delete route path
router.delete('/:id', async (req, res) => {
    try {
        await Habit.findByIdAndDelete(req.params.id);
        res.json({ message: 'Deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ✅ Analytics
router.get('/analytics/summary', async (req, res) => {
    try {
        const habits = await Habit.find().lean();
        const total = habits.length;

        const avgStreak =
            habits.reduce((s, h) => s + (h.streak || 0), 0) / (total || 1);

        const top = habits
            .sort((a, b) => (b.bestStreak || 0) - (a.bestStreak || 0))
            .slice(0, 3);

        res.json({
            total,
            avgStreak: Math.round(avgStreak * 100) / 100,
            top,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const habits = await Habit.find().sort({ createdAt: -1 }).lean();

        const updated = habits.map(h => {
            const streak = CalcStreak(h.history);
            const badges = computeBadges(streak, h.badges || []);
            return { ...h, streak, badges };
        });

        res.json(updated);   // ✅ was res.join (incorrect)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
