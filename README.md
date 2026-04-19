# 🧠 AI Disease Prediction Dashboard

An intelligent healthcare web application that predicts diseases based on user-input symptoms using Machine Learning and Data Mining techniques. The system provides top disease predictions, explains symptom relationships, and suggests nearby specialist doctors.

---

## 📌 Project Overview

The **AI Disease Prediction Dashboard** is designed to assist users in preliminary diagnosis by analyzing symptoms and predicting possible diseases.  

It combines:
- **Machine Learning (Random Forest & Naive Bayes)**
- **Data Mining (Association Rule Mining)**
- **Interactive Visualization (Graphs + Maps)**

The system also recommends **specialist doctors** and displays **nearby locations using geolocation**.

---

## ⚙️ Installation Instructions

### 🔹 Prerequisites
- Python 3.10+
- Node.js (v16+)
- npm
- Git

---

### 🔹 Backend Setup (FastAPI)

```bash
# Clone the repository
git clone https://github.com/your-username/ai-disease-prediction.git
cd ai-disease-prediction

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run backend
uvicorn backend.main:app --reload
````

👉 Backend runs on: `http://127.0.0.1:8000`

---

### 🔹 Frontend Setup (React)

```bash
cd frontend

# Install dependencies
npm install

# Run frontend
npm start
```

👉 Frontend runs on: `http://localhost:3000`

---

## 📊 Data Sources

### 1. Diseases & Symptoms Dataset

* Contains binary symptom features for each disease
* Used for training ML models

### 2. Specialist Mapping Dataset

* Maps diseases → specialist doctors

### 3. Association Rules Dataset

* Generated using Apriori algorithm
* Used for symptom co-occurrence analysis

---

### 🔧 Preprocessing Steps

* Removed rare diseases (low frequency)
* Balanced dataset (class imbalance handling)
* Converted symptoms → binary feature vectors
* Label encoding for disease classes

---

## 🗂️ Code Structure

```
Sym-Dis-Association/
│
├── backend/
│   ├── main.py                  # FastAPI server
│   ├── model_artifacts/         # Saved ML models
│   └── datasets/                # CSV datasets
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SymptomInput.js
│   │   │   ├── ResultCard.js
│   │   │   ├── MapView.js
│   │   │   └── CoOccurrenceGraph.js
│   │   ├── App.js
│   │   └── index.js
│
├── Naive_Bayes.py               # Model training script
├── association_rules.csv
├── disease_specialist_mapping.csv
└── README.md
```

---

## 🤖 Models Used

### 🔹 Random Forest

* Handles complex relationships
* High accuracy (~92%)

### 🔹 Naive Bayes

* Fast and lightweight
* Good baseline performance

---

## 📈 Results & Evaluation

* **Accuracy Achieved:** ~92%
* **Top-3 Predictions:** Displayed with confidence scores
* **Model Comparison:** Random Forest vs Naive Bayes

### 📊 Evaluation Metrics:

* Accuracy
* Precision
* Recall
* F1-score

---

### 🖥️ Features

✔ Disease prediction from symptoms
✔ Top 3 predictions with probabilities
✔ Symptom co-occurrence graph
✔ Specialist recommendation
✔ Nearby doctor map (Leaflet)
✔ Model comparison (RF vs NB)

---

## 🔮 Future Work

* Integrate **Deep Learning models**
* Use **real-world hospital APIs**
* Add **voice-based symptom input**
* Improve dataset quality
* Deploy as **mobile/web application**
* Add **patient history tracking**

---

## 🙏 Acknowledgments / References

* Scikit-learn Documentation
* FastAPI Documentation
* React & Tailwind CSS
* OpenStreetMap (Leaflet maps)
* Apriori Algorithm (Association Rule Mining)

---

## ⚠️ Disclaimer

This system is for **educational purposes only** and should not be used as a replacement for professional medical diagnosis.

---
