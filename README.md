# FinSight - Smart Financial Tracker

A production-ready financial tracking application with React frontend, Python backend, and Firebase integration. Features real-time expense tracking, AI-powered insights, and comprehensive analytics.

## 🚀 Features

### Core Features
- **Multi-Authentication**: Google Sign-In & Email/Password with Firebase Authentication
- **Real-time Database**: Firebase Firestore for instant data synchronization
- **Transaction Management**: Complete CRUD operations for income and expenses
- **Smart Categories**: 
  - **Expenses**: Rent, Grocery, EMI, Bills, Entertainment, Travel, Miscellaneous, Savings
  - **Income**: Salary, Freelance, Investment Returns, Mutual Funds, Other Income
- **Interactive Dashboard**: 
  - Monthly summary cards (Income, Expenses, Net Savings, Savings Rate)
  - Expense distribution charts (Pie/Donut)
  - Income vs Expense trends (Bar charts)
  - 12-month financial trends (Line charts)
- **AI-Powered Insights**: Python backend with ML-driven optimization suggestions
- **Responsive Design**: Mobile-first approach with dark/light mode
- **Real-time Analytics**: Live data processing and visualization

### Advanced Features
- **Python Analytics Backend**: FastAPI service with pandas, numpy, scikit-learn
- **Smart Suggestions**: AI-powered expense optimization recommendations
- **Trend Analysis**: Historical data analysis and forecasting
- **Security**: Firebase Authentication with JWT token verification
- **Production Ready**: Comprehensive error handling, logging, and monitoring

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom design system
- **Charts**: Recharts for interactive data visualization
- **Forms**: React Hook Form for efficient form handling
- **Icons**: Lucide React for consistent iconography
- **Notifications**: React Hot Toast for user feedback
- **Build Tool**: Vite for fast development and building

### Backend
- **API Framework**: FastAPI (Python)
- **Analytics**: Pandas, NumPy, Scikit-learn
- **Authentication**: Firebase Admin SDK
- **Database**: Firebase Firestore
- **Deployment**: Docker containerized

### Database & Authentication
- **Authentication**: Firebase Authentication (Google OAuth + Email/Password)
- **Database**: Firebase Firestore (NoSQL, real-time)
- **Security**: Row-level security with user-specific data isolation

## 🏗️ Project Structure

```
finsight-app/
├── src/
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard and analytics
│   │   ├── transactions/    # Transaction management
│   │   └── layout/          # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # External library configurations
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
├── backend/                 # Python FastAPI backend
│   ├── main.py             # FastAPI application
│   ├── requirements.txt    # Python dependencies
│   ├── Dockerfile          # Docker configuration
│   └── .env.example        # Environment variables template
├── vercel.json             # Vercel deployment config
├── netlify.toml            # Netlify deployment config
└── README.md               # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- Python 3.11+
- Firebase project
- Git

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finsight-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Google + Email/Password providers)
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_API_BASE_URL=http://localhost:8000
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Firebase Admin Setup**
   - Go to Firebase Console → Project Settings → Service Accounts
   - Generate a new private key
   - Save as `serviceAccountKey.json` in the backend directory

5. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   Update with your configuration:
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=serviceAccountKey.json
   FIREBASE_PROJECT_ID=your_project_id
   ```

6. **Start the backend server**
   ```bash
   python main.py
   ```

### Firebase Security Rules

Add these Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Transactions collection
    match /transactions/{document} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

## 🚀 Deployment

### Frontend Deployment

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push

#### Netlify
1. Connect your GitHub repository to Netlify
2. Configure build settings: `npm run build` → `dist`
3. Set environment variables in Netlify dashboard

### Backend Deployment

#### Heroku
1. **Install Heroku CLI**
2. **Create Heroku app**
   ```bash
   heroku create your-app-name
   ```
3. **Set environment variables**
   ```bash
   heroku config:set FIREBASE_PROJECT_ID=your_project_id
   ```
4. **Deploy**
   ```bash
   git subtree push --prefix backend heroku main
   ```

#### Render
1. Connect your GitHub repository
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:$PORT`
5. Configure environment variables

#### Docker Deployment
```bash
cd backend
docker build -t finsight-api .
docker run -p 8000:8000 finsight-api
```

## 📱 Usage Guide

### Adding Transactions
1. Click "Add Transaction" button
2. Select Income or Expense
3. Fill in amount, category, date, and notes
4. Save to automatically sync with database

### Viewing Analytics
- **Dashboard**: Overview of financial health with interactive charts
- **AI Insights**: Machine learning-powered optimization suggestions
- **Trends**: Historical analysis and spending patterns

### Categories
- **Income**: Salary, Freelance, Investment Returns, Mutual Funds, Other Income
- **Expenses**: Rent, Grocery, EMI, Bills, Entertainment, Travel, Miscellaneous, Savings

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Code Organization
- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks for data fetching and state management
- **Types**: Comprehensive TypeScript interfaces
- **Responsive Design**: Mobile-first with Tailwind breakpoints

### API Endpoints
- `GET /analytics/summary/{user_id}` - Get financial summary
- `GET /analytics/suggestions/{user_id}` - Get AI suggestions
- `GET /analytics/trends/{user_id}` - Get trend analysis

## 🔒 Security

- Firebase Authentication with JWT tokens
- User-specific data isolation
- CORS configuration for production
- Input validation and sanitization
- Secure API endpoints with authentication middleware

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
cd backend
pytest
```

## 📊 Analytics Features

### AI-Powered Insights
- **Spending Pattern Analysis**: Identify unusual spending behaviors
- **Category Optimization**: Suggest areas for cost reduction
- **Savings Recommendations**: Personalized advice for better financial health
- **Trend Forecasting**: Predict future spending patterns

### Data Processing
- **Real-time Analytics**: Live data processing with pandas
- **Statistical Analysis**: NumPy for mathematical computations
- **Machine Learning**: Scikit-learn for predictive insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend infrastructure
- Recharts for beautiful data visualizations
- TailwindCSS for utility-first styling
- FastAPI for high-performance Python API
- Lucide React for consistent iconography

---

**FinSight** - Smart financial tracking with AI-powered insights 💰📊🤖

## 🆘 Support

For support, email support@finsight.app or create an issue in the GitHub repository.

## 🔮 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced ML forecasting
- [ ] Bill reminders and notifications
- [ ] Multi-currency support
- [ ] Investment portfolio tracking
- [ ] Shared family budgets
- [ ] Receipt scanning with OCR
- [ ] Bank account integration
- [ ] Advanced reporting and exports