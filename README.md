# SmartFit AI 🏋️‍♂️

A comprehensive fitness tracking web application with AI-powered insights and personalized dashboards.

## 🚀 Features

- **User Authentication** - Firebase Auth integration
- **Fitness Tracking** - Log workouts, meals, weight, and water intake
- **Interactive Dashboard** - Real-time stats, streaks, and progress charts
- **Personalization** - Customizable preferences and data types
- **Responsive Design** - Works on desktop and mobile devices
- **Data Validation** - Frontend and backend validation for data integrity

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite + Tailwind CSS
- Firebase Auth
- Recharts for data visualization

**Backend:**
- Spring Boot 3.2 + Java 17
- Firebase Firestore database
- Spring Security + JWT
- Maven build system

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+

### Setup Instructions

1. **Clone the repository**

2. **Set up Firebase**
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password) and Firestore Database
   - Download the service account JSON file and place it in `backend/src/main/resources/`
   - Update Firebase config in `frontend/src/firebase.ts` with your project details

3. **Install dependencies**
```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
mvn clean install
```

4. **Start the application**
```bash
cd backend
mvn spring-boot:run

cd ../frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 📱 Usage

1. **Sign up/Login** with your email
2. **Set preferences** in the personalization page
3. **Track activities** - Add workouts, meals, weight, and water
4. **View progress** on the interactive dashboard
5. **Monitor streaks** and achieve your fitness goals

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request
