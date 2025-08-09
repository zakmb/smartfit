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
- React Router for navigation

**Backend:**
- Spring Boot 3.2 + Java 17
- Firebase Firestore database
- Spring Security + JWT
- Maven build system
- Comprehensive validation

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.6+
- Firebase project setup

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/smartfit-ai.git
cd smartfit-ai
```

2. **Start the application**
```bash
# Windows
.\start-project.bat

# PowerShell
.\start-project.ps1
```

The application will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

### Manual Setup

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

## 📱 Usage

1. **Sign up/Login** with your email
2. **Set preferences** in the personalization page
3. **Track activities** - Add workouts, meals, weight, and water
4. **View progress** on the interactive dashboard
5. **Monitor streaks** and achieve your fitness goals

## 🔧 Configuration

Create Firebase project and add configuration:
- Frontend: Update Firebase config in `frontend/src/firebase.ts`
- Backend: Add Firebase service account JSON to backend resources

## 📦 Deployment

**Recommended: Vercel + Railway**
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway
- Database: Firebase Firestore (managed)

See deployment guide in the repository for detailed instructions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for fitness enthusiasts