from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, firestore, auth
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="FinSight Analytics API",
    description="AI-powered financial analytics and insights",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase Admin
try:
    # For production, use service account key
    if os.getenv("GOOGLE_APPLICATION_CREDENTIALS"):
        cred = credentials.ApplicationDefault()
    else:
        # For development, use service account key file
        cred = credentials.Certificate("serviceAccountKey.json")
    
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logger.info("Firebase initialized successfully")
except Exception as e:
    logger.error(f"Firebase initialization failed: {e}")
    # Initialize with default credentials for demo
    firebase_admin.initialize_app()
    db = firestore.client()

# Security
security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify Firebase ID token"""
    try:
        token = credentials.credentials
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception as e:
        logger.error(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid authentication token")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "FinSight Analytics API",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/analytics/summary/{user_id}")
async def get_analytics_summary(
    user_id: str,
    month: Optional[str] = None,
    token_data: dict = Depends(verify_token)
):
    """Get comprehensive financial analytics summary"""
    try:
        # Verify user authorization
        if token_data.get('uid') != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized access")

        # Fetch transactions from Firestore
        transactions_ref = db.collection('transactions').where('userId', '==', user_id)
        
        if month:
            # Filter by specific month
            start_date = datetime.strptime(f"{month}-01", "%Y-%m-%d")
            end_date = start_date.replace(day=28) + timedelta(days=4)
            end_date = end_date - timedelta(days=end_date.day)
            
            transactions_ref = transactions_ref.where('date', '>=', start_date.strftime('%Y-%m-%d'))
            transactions_ref = transactions_ref.where('date', '<=', end_date.strftime('%Y-%m-%d'))

        transactions = transactions_ref.stream()
        
        # Convert to DataFrame for analysis
        data = []
        for transaction in transactions:
            trans_data = transaction.to_dict()
            trans_data['id'] = transaction.id
            data.append(trans_data)

        if not data:
            return {
                "summary": {
                    "totalIncome": 0,
                    "totalExpenses": 0,
                    "netSavings": 0,
                    "savingsRate": 0,
                    "topExpenseCategory": "None",
                    "topIncomeSource": "None"
                },
                "suggestions": [],
                "trends": []
            }

        df = pd.DataFrame(data)
        df['amount'] = pd.to_numeric(df['amount'])
        df['date'] = pd.to_datetime(df['date'])

        # Calculate summary statistics
        income_df = df[df['type'] == 'income']
        expense_df = df[df['type'] == 'expense']

        total_income = income_df['amount'].sum()
        total_expenses = expense_df['amount'].sum()
        net_savings = total_income - total_expenses
        savings_rate = (net_savings / total_income * 100) if total_income > 0 else 0

        # Top categories
        top_expense_category = expense_df.groupby('category')['amount'].sum().idxmax() if not expense_df.empty else "None"
        top_income_source = income_df.groupby('category')['amount'].sum().idxmax() if not income_df.empty else "None"

        # Generate trends (last 6 months)
        trends = generate_trends(df)

        # Generate AI suggestions
        suggestions = generate_suggestions(df)

        return {
            "summary": {
                "totalIncome": float(total_income),
                "totalExpenses": float(total_expenses),
                "netSavings": float(net_savings),
                "savingsRate": float(savings_rate),
                "topExpenseCategory": top_expense_category,
                "topIncomeSource": top_income_source
            },
            "suggestions": suggestions,
            "trends": trends
        }

    except Exception as e:
        logger.error(f"Analytics summary error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/suggestions/{user_id}")
async def get_suggestions(
    user_id: str,
    token_data: dict = Depends(verify_token)
):
    """Get AI-powered financial optimization suggestions"""
    try:
        # Verify user authorization
        if token_data.get('uid') != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized access")

        # Fetch recent transactions
        transactions_ref = db.collection('transactions').where('userId', '==', user_id)
        transactions = transactions_ref.stream()

        data = []
        for transaction in transactions:
            trans_data = transaction.to_dict()
            data.append(trans_data)

        if not data:
            return []

        df = pd.DataFrame(data)
        suggestions = generate_suggestions(df)

        return suggestions

    except Exception as e:
        logger.error(f"Suggestions error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analytics/trends/{user_id}")
async def get_trends(
    user_id: str,
    months: int = 6,
    token_data: dict = Depends(verify_token)
):
    """Get financial trends over specified months"""
    try:
        # Verify user authorization
        if token_data.get('uid') != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized access")

        # Fetch transactions
        transactions_ref = db.collection('transactions').where('userId', '==', user_id)
        transactions = transactions_ref.stream()

        data = []
        for transaction in transactions:
            trans_data = transaction.to_dict()
            data.append(trans_data)

        if not data:
            return []

        df = pd.DataFrame(data)
        trends = generate_trends(df, months)

        return trends

    except Exception as e:
        logger.error(f"Trends error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

def generate_suggestions(df: pd.DataFrame) -> List[Dict]:
    """Generate AI-powered financial suggestions"""
    suggestions = []
    
    if df.empty:
        return suggestions

    try:
        df['amount'] = pd.to_numeric(df['amount'])
        expense_df = df[df['type'] == 'expense']
        
        if expense_df.empty:
            return suggestions

        # Category analysis
        category_spending = expense_df.groupby('category')['amount'].sum().sort_values(ascending=False)
        total_expenses = expense_df['amount'].sum()

        # High spending categories
        for category, amount in category_spending.head(3).items():
            percentage = (amount / total_expenses) * 100
            
            if percentage > 30:
                suggestions.append({
                    "id": f"high_spending_{category.lower().replace(' ', '_')}",
                    "category": category,
                    "suggestion": f"Your {category} spending is {percentage:.1f}% of total expenses. Consider reducing by 15% to save ${amount * 0.15:.0f}/month",
                    "potentialSavings": float(amount * 0.15),
                    "priority": "high"
                })
            elif percentage > 20:
                suggestions.append({
                    "id": f"moderate_spending_{category.lower().replace(' ', '_')}",
                    "category": category,
                    "suggestion": f"Consider optimizing your {category} expenses to save ${amount * 0.10:.0f}/month",
                    "potentialSavings": float(amount * 0.10),
                    "priority": "medium"
                })

        # Frequency analysis
        frequent_small_expenses = expense_df[expense_df['amount'] < 50].groupby('category').size()
        for category, count in frequent_small_expenses.items():
            if count > 10:
                avg_amount = expense_df[expense_df['category'] == category]['amount'].mean()
                suggestions.append({
                    "id": f"frequent_small_{category.lower().replace(' ', '_')}",
                    "category": category,
                    "suggestion": f"You have {count} small {category} transactions averaging ${avg_amount:.2f}. Consider budgeting to reduce frequency",
                    "potentialSavings": float(avg_amount * count * 0.2),
                    "priority": "low"
                })

        # If no specific suggestions, add general ones
        if not suggestions:
            suggestions.extend([
                {
                    "id": "general_tracking",
                    "category": "General",
                    "suggestion": "Great start! Keep tracking your expenses to identify optimization opportunities",
                    "potentialSavings": 0,
                    "priority": "low"
                },
                {
                    "id": "emergency_fund",
                    "category": "Savings",
                    "suggestion": "Consider building an emergency fund of 3-6 months of expenses",
                    "potentialSavings": 0,
                    "priority": "medium"
                }
            ])

    except Exception as e:
        logger.error(f"Suggestion generation error: {e}")

    return suggestions[:5]  # Return top 5 suggestions

def generate_trends(df: pd.DataFrame, months: int = 6) -> List[Dict]:
    """Generate monthly trend data"""
    trends = []
    
    if df.empty:
        return trends

    try:
        df['amount'] = pd.to_numeric(df['amount'])
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M')

        # Group by month and type
        monthly_data = df.groupby(['month', 'type'])['amount'].sum().unstack(fill_value=0)

        # Get last N months
        for month_period in monthly_data.index[-months:]:
            month_str = month_period.strftime('%Y-%m')
            income = float(monthly_data.loc[month_period, 'income']) if 'income' in monthly_data.columns else 0
            expenses = float(monthly_data.loc[month_period, 'expense']) if 'expense' in monthly_data.columns else 0
            
            trends.append({
                "month": month_str,
                "income": income,
                "expenses": expenses,
                "savings": income - expenses
            })

    except Exception as e:
        logger.error(f"Trend generation error: {e}")

    return trends

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)