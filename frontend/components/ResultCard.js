import React from 'react';
import CoOccurrenceGraph from "./CoOccurenceGraph";

function ResultCard({ data, symptoms = [] }) {
  if (!data || !data.final_prediction) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-red-100 flex items-center justify-center">
        <p className="text-red-500 font-medium">⚠️ No valid prediction data available.</p>
      </div>
    );
  }

  const final = data.final_prediction;
  
  // Find confidence based on the winning model
  const winningModelData = final.model === "Random Forest" ? data.rf : data.nb;
  const topPrediction = winningModelData?.top3?.[0] || { confidence: 0 };
  const confidenceScore = topPrediction.confidence;

  const isLowConfidence = confidenceScore < 0.3;
  const isMedConfidence = confidenceScore >= 0.3 && confidenceScore < 0.7;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl flex flex-col h-full border border-gray-50 relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100 to-purple-50 rounded-bl-full -z-10 opacity-70"></div>

      <div className="flex justify-between items-start mb-2">
        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
          Diagnostic Analysis
        </h2>
        {/* Confidence Badge */}
        {!isLowConfidence && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
            isMedConfidence ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {isMedConfidence ? "Medium Confidence" : "High Confidence"}
          </span>
        )}
      </div>

      <div className="mt-2 mb-6">
        {isLowConfidence ? (
          <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
             <h3 className="text-xl font-bold text-red-700 flex items-center">
               <span className="mr-2">⚠️</span> Uncertain Prediction
             </h3>
             <p className="text-red-600 text-sm mt-1">
               The models could not confidently match the selected symptoms to a specific disease. 
               ({(confidenceScore * 100).toFixed(1)}% confidence match).
             </p>
          </div>
        ) : (
          <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 leading-tight">
            {final.disease}
          </h1>
        )}
      </div>

      <div className="space-y-4 mb-6 relative z-10 flex-shrink-0">
        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
           <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xl shadow-inner shrink-0 mr-4">
              👨‍⚕️
           </div>
           <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Recommended Specialist</p>
              <p className="text-base font-bold text-gray-800 leading-tight">{data.specialist}</p>
           </div>
        </div>

        <div className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100">
           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xl shadow-inner shrink-0 mr-4">
              🤖
           </div>
           <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Primary Model Engine</p>
              <p className="text-base font-bold text-gray-800 leading-tight">{final.model}</p>
           </div>
        </div>
      </div>

      {/* Explainability Section */}
      {symptoms.length > 0 && (
        <div className="mt-auto pt-4 border-t border-gray-100">
          <h4 className="text-sm font-bold text-indigo-900 mb-2">Why this prediction?</h4>
          <p className="text-xs text-gray-500 mb-3 leading-relaxed">
            These features strongly contributed to the diagnostic evaluation model:
          </p>
          <div className="flex flex-wrap gap-2">
            {symptoms.map(s => (
               <span key={s} className="px-2.5 py-1 bg-gray-100 text-gray-600 font-medium text-xs rounded-md border border-gray-200">
                 {s}
               </span>
            ))}
          </div>
        </div>
      )}


      {/* Disclaimer */}
      <div className="mt-6 text-center pt-4">
        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-gray-300 mr-2"></span>
          For Educational Purposes Only • Consult a Doctor
        </p>
      </div>
    </div>
  );
}

export default ResultCard;