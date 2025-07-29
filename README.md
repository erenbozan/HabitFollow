 # FollowHabbit - Habit Tracking Application

A full-stack habit tracking application built with React Native (Expo) and Node.js. Track your daily and weekly habits, monitor your progress, and build better routines.

## 🌟 Features

- User authentication (register/login)
- Create and manage habits
- Daily and weekly habit tracking
- Progress statistics and streaks
- Dark/Light theme support
- Responsive and modern UI
- Real-time habit status updates
- Progress visualization with charts(on progress)

## 🛠 Tech Stack

### Frontend
- React Native with Expo
- TypeScript
- React Navigation
- Axios for API calls
- AsyncStorage for local storage
- React Native Chart Kit
- Expo Router for navigation

### Backend
- Node.js
- Express.js
- PostgreSQL with Sequelize ORM
- JWT for authentication
- Express Rate Limit
- CORS enabled
- Automated cron jobs for habit resets

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL
- Expo CLI (`npm install -g expo-cli`)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/followhabbit.git
cd followhabbit
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd NodeJS

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the server
npm start
```

## ⚙️ Environment Variables

### Backend (.env.example)
```plaintext
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myhabits

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```


## 📱 Running on Mobile

### Android
1. Install Android Studio and set up an emulator
2. Run `npm run android`
3. Press 'a' to run on Android emulator

### iOS
1. Install Xcode (Mac only)
2. Run `npm run ios`
3. Press 'i' to run on iOS simulator

## 🔄 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Habits
- `GET /habits` - Get all habits
- `POST /habits` - Create new habit
- `PUT /habits/:id` - Update habit
- `POST /habits/:id/toggle` - Toggle habit completion

## 📊 Database Schema

### Users
- id (Primary Key)
- username (Unique)
- password (Hashed)
- createdAt
- updatedAt

### Habits
- id (Primary Key)
- userId (Foreign Key)
- title
- frequency (daily/weekly)
- isCompleted
- last_tracked
- createdAt
- updatedAt

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 👥 Authors

- Eren Bozan - Initial work

