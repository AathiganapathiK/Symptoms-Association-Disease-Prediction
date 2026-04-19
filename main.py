from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import pandas as pd

app = FastAPI()

# ---------------- CORS ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- LOAD MODELS ----------------
model_rf = joblib.load("model_artifacts/rf_model.pkl")
model_nb = joblib.load("model_artifacts/nb_model.pkl")

le_rf = joblib.load("model_artifacts/rf_label_encoder.pkl")
le_nb = joblib.load("model_artifacts/label_encoder.pkl")
symptom_cols = joblib.load("model_artifacts/rf_symptom_columns.pkl")

# ---------------- LOAD DATA ----------------
rules_df = pd.read_csv("association_rules.csv")
specialist_df = pd.read_csv("disease_specialist_mapping.csv")

# ---------------- INPUT SCHEMA ----------------
class SymptomInput(BaseModel):
    symptoms: list[str]

# ---------------- API ENDPOINTS ----------------
@app.get("/symptoms")
def get_symptoms():
    return {"symptoms": symptom_cols}

# ---------------- COMMON FEATURE BUILDER ----------------
def build_feature_vector(symptoms):
    input_symptoms = [s.lower() for s in symptoms]
    feature_vector = np.zeros(len(symptom_cols))

    for i, col in enumerate(symptom_cols):
        if col.lower() in input_symptoms:
            feature_vector[i] = 1

    return feature_vector.reshape(1, -1)

# ---------------- GENERIC PREDICTION ----------------
def get_prediction(model,encoder,symptoms):
    feature_vector = build_feature_vector(symptoms)

    pred = model.predict(feature_vector)[0]
    proba = model.predict_proba(feature_vector)[0]

    disease = encoder.inverse_transform([pred])[0]

    top3_idx = np.argsort(proba)[::-1][:3]

    # 🔥 Normalize probabilities
    top_probs = proba[top3_idx]
    top_probs = top_probs / top_probs.sum()

    top3 = [
        {
            "disease": encoder.inverse_transform([idx])[0],
            "confidence": float(top_probs[i])
        }
        for i, idx in enumerate(top3_idx)
    ]

    return disease, top3

# ---------------- CO-OCCURRENCE ----------------
def get_cooccurring(symptoms):
    symptoms = [s.lower() for s in symptoms]
    results = []

    for _, row in rules_df.iterrows():
        antecedents = row['antecedents'].lower().split(', ')
        match_count = sum(1 for sym in antecedents if sym in symptoms)

        if match_count >= 1:
            results.append({
                "if": row['antecedents'],
                "then": row['consequents'],
                "confidence": row['confidence']
            })

    return sorted(results, key=lambda x: x['confidence'], reverse=True)[:5]

# ---------------- SPECIALIST ----------------
def get_specialist(disease):
    specialist_df.columns = specialist_df.columns.str.lower()
    specialist_df['disease'] = specialist_df['disease'].str.lower()

    disease = disease.lower()

    row = specialist_df[specialist_df['disease'] == disease]

    if not row.empty:
        return row.iloc[0]['specialist']

    return "General Physician"


def validate_symptoms(symptoms):
    valid = []
    invalid = []

    for s in symptoms:
        s = s.lower().strip()
        if s in [col.lower() for col in symptom_cols]:
            valid.append(s)
        else:
            invalid.append(s)

    return valid, invalid

# ---------------- API ----------------
@app.post("/predict")
def predict(data: SymptomInput):
    symptoms = data.symptoms

    valid_symptoms, invalid_symptoms = validate_symptoms(symptoms)
    # ❌ No valid symptoms
    if len(valid_symptoms) == 0:
        return {
            "error": "No valid symptoms detected",
            "invalid_inputs": invalid_symptoms
        }

    # ⚠️ Too few valid symptoms
    if len(valid_symptoms) < 2:
        return {
            "error": "Please enter at least 2 valid symptoms",
            "valid": valid_symptoms,
            "invalid": invalid_symptoms
        }


    # 🔥 Get both predictions
    rf_disease, rf_top3 = get_prediction(model_rf,le_rf, symptoms)
    nb_disease, nb_top3 = get_prediction(model_nb,le_nb, symptoms)

    # 🔥 Choose better model (based on top confidence)
    rf_conf = rf_top3[0]["confidence"]
    nb_conf = nb_top3[0]["confidence"]
    # Always prefer RF unless NB is MUCH better
    if nb_conf > rf_conf + 0.2:
        final_model = "Naive Bayes"
        final_disease = nb_disease
    else:
        final_model = "Random Forest"
        final_disease = rf_disease
    # Extra features
    co = get_cooccurring(symptoms)
    specialist = get_specialist(final_disease)

    return {
        "final_prediction": {
            "model": final_model,
            "disease": final_disease
        },
        "rf": {
            "disease": rf_disease,
            "top3": rf_top3
        },
        "nb": {
            "disease": nb_disease,
            "top3": nb_top3
        },
        "specialist": specialist,
        "co_occurrence": co
    }