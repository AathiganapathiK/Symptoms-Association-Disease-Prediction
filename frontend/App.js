import React, { useState } from "react";
import axios from "axios";
import SymptomInput from "./components/SymptomInput";
import ResultCard from "./components/ResultCard";
import MapView from "./components/MapView";
import ModelComparisonCard from "./components/ModelComparisonCard";
import CoOccurrenceGraph from "./components/CoOccurenceGraph";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentSymptoms, setCurrentSymptoms] = useState([]);
  const [error, setError] = useState(null);

  const handlePredict = async (symptoms) => {
    setLoading(true);
    setError(null);
    setCurrentSymptoms(symptoms);
    setData(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", {
        symptoms: symptoms,
      });

      if (res.data.error) {
        setError(res.data.error);
        return;
      }

      setData(res.data);
    } catch (err) {
      setError("Error connecting to backend: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-200">
              ⚕️
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 leading-tight">
                Health Diagnostic ( Symptoms-Disease Association )
              </h1>
              <p className="text-sm text-slate-500 font-medium">Predictive Diagnostic Engine</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl relative flex items-start gap-3 shadow-sm" role="alert">
            <div className="text-xl">⚠️</div>
            <div>
               <strong className="block font-semibold">Diagnosis Error</strong>
               <span className="block sm:inline">{error}</span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Column: Input (Sticky) */}
          <div className="w-full lg:w-1/3 lg:sticky lg:top-24 flex-shrink-0 transition-all duration-300">
            <SymptomInput onPredict={handlePredict} />
          </div>

          {/* Right Column: Loading & Results */}
          <div className="w-full lg:w-2/3 flex-grow flex flex-col gap-6">
            
            {/* Loading State with Animation */}
            {loading && (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px]">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-sm"></div>
                <h3 className="text-lg font-semibold text-slate-800 animate-pulse">Running Diagnostic Models...</h3>
                <p className="text-slate-500 mt-2 text-center text-sm">Analyzing symptoms and generating predictions across Naive Bayes, Random Forest, and Gradient Boosting algorithms.</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !data && !error && (
               <div className="hidden lg:flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 border-dashed min-h-[400px] text-slate-400">
                  <div className="text-6xl mb-4 grayscale opacity-50">🩺</div>
                  <h3 className="text-lg font-medium text-slate-600 mb-1">Awaiting Symptoms</h3>
                  <p className="text-sm text-center max-w-sm">Enter your symptoms on the left to receive a comprehensive AI-powered disease prediction and analysis.</p>
               </div>
            )}

            {/* Results Rendering */}
            {!loading && data && (
              <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                {/* Final Result & Map */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  <ResultCard data={data} symptoms={currentSymptoms} />
                  {data?.specialist && (
                    <div className="h-full min-h-[400px]">
                       <MapView specialist={data.specialist} />
                    </div>
                  )}
                </div>

                {/* Model Comparison */}
                <div className="w-full">
                  <ModelComparisonCard data={data} />
                </div>

                {/* Network Graph */}
                <div className="w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                   <CoOccurrenceGraph rules={data.co_occurrence} />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;