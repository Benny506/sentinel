import numpy as np
import pandas as pd
import json
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
from sklearn.metrics import precision_recall_fscore_support, average_precision_score
from imblearn.over_sampling import SMOTE
import joblib
import os

class ModelEngine:
    def __init__(self):
        self.models = {
            'logistic_regression': LogisticRegression(max_iter=1000),
            'random_forest': RandomForestClassifier(n_estimators=100, n_jobs=1),
            'xgboost': XGBClassifier(use_label_encoder=False, eval_metric='logloss')
        }
        self.scaler = StandardScaler()
        self.best_model_name = 'xgboost'
        self.is_trained = False
        self.metrics = {}

    def generate_synthetic_data(self, n_samples=20000):
        """Generates high-fidelity synthetic CC data with decoupled metadata"""
        n_fraud = int(n_samples * 0.0017)
        n_legit = n_samples - n_fraud

        v_features = [f'V{i}' for i in range(1, 29)]
        
        # Legit transactions (Mean ~0)
        data_legit = np.random.normal(0, 1, size=(n_legit, 28))
        
        # Fraud transactions (Intensified shift)
        data_fraud = np.random.normal(5, 2, size=(n_fraud, 28))
        
        # Merge basic features
        X = np.vstack([data_legit, data_fraud])
        y = np.hstack([np.zeros(n_legit), np.ones(n_fraud)])
        
        # Generate metadata INDEPENDENTLY and then shuffle
        # This prevents the "Time Leak" where fraud always had high timestamps
        amount = np.random.exponential(100, size=n_samples)
        time = np.random.uniform(0, 172800, size=n_samples) # Randomly distributed time
        
        df = pd.DataFrame(X, columns=v_features)
        df['Amount'] = amount
        df['Time'] = time
        df['Class'] = y
        
        # Final shuffle ensures stratified distribution and no positional bias
        return df.sample(frac=1, random_state=42).reset_index(drop=True)

    def train_all(self):
        """Trains all models and stores metrics for the leaderboard"""
        df = self.generate_synthetic_data()
        X = df.drop('Class', axis=1)
        y = df['Class']

        # Preprocessing: Scale Amount and Time (StandardScaler)
        X[['Amount', 'Time']] = self.scaler.fit_transform(X[['Amount', 'Time']])

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

        # Handling Imbalance with SMOTE
        smote = SMOTE(random_state=42)
        X_res, y_res = smote.fit_resample(X_train, y_train)

        results = {}
        for name, model in self.models.items():
            print(f"Training {name}...")
            model.fit(X_res, y_res)
            
            y_pred = model.predict(X_test)
            y_probs = model.predict_proba(X_test)[:, 1]
            
            p, r, f, _ = precision_recall_fscore_support(y_test, y_pred, average='binary')
            auprc = average_precision_score(y_test, y_probs)
            
            results[name] = {
                'precision': round(p, 4),
                'recall': round(r, 4),
                'f1': round(f, 4),
                'auprc': round(auprc, 4)
            }

        self.metrics = results
        self.is_trained = True
        
        # Save the best model
        os.makedirs('models', exist_ok=True)
        joblib.dump(self.models[self.best_model_name], f'models/{self.best_model_name}.pkl')
        joblib.dump(self.scaler, 'models/scaler.pkl')
        
        # Save metrics for persistent leaderboard
        with open('models/metrics.json', 'w') as f:
            json.dump(results, f)
        
        return results

    def predict_fraud(self, features):
        """Live inference for the dashboard"""
        if not self.is_trained:
            # Load if exists, else train
            if os.path.exists(f'models/{self.best_model_name}.pkl'):
                self.models[self.best_model_name] = joblib.load(f'models/{self.best_model_name}.pkl')
                self.scaler = joblib.load('models/scaler.pkl')
                
                # Load persistent metrics if they exist
                if os.path.exists('models/metrics.json'):
                    with open('models/metrics.json', 'r') as f:
                        self.metrics = json.load(f)
                
                self.is_trained = True
            else:
                self.train_all()

        model = self.models[self.best_model_name]
        
        # Preprocessing incoming features (expecting array of 30 values: V1-V28, Amount, Time)
        feat_df = pd.DataFrame([features], columns=[f'V{i}' for i in range(1, 29)] + ['Amount', 'Time'])
        feat_df[['Amount', 'Time']] = self.scaler.transform(feat_df[['Amount', 'Time']])
        
        prob = float(model.predict_proba(feat_df)[0][1])
        return prob

# Singleton engine instance
engine = ModelEngine()
