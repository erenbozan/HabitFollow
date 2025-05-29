module.exports = (sequelize, DataTypes) => {
    const Habit = sequelize.define('Habit', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['daily', 'weekly']]
            }
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        last_tracked: {
            type: DataTypes.DATE,
            allowNull: true
        }
    });

    // Habit tamamlanma durumunu kontrol eden method
    Habit.prototype.isCompleted = function() {
        if (!this.last_tracked) return false;

        const now = new Date();
        const lastTracked = new Date(this.last_tracked);

        if (this.frequency === 'daily') {
            // Günlük habitler için: Aynı günde mi kontrol et
            return (
                lastTracked.getFullYear() === now.getFullYear() &&
                lastTracked.getMonth() === now.getMonth() &&
                lastTracked.getDate() === now.getDate()
            );
        } else if (this.frequency === 'weekly') {
            // Haftalık habitler için: Son 7 gün içinde mi kontrol et
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return lastTracked >= oneWeekAgo;
        }

        return false;
    };

    return Habit;
}; 