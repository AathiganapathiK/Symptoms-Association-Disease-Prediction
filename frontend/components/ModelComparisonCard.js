import React from "react";

function ModelComparisonCard({ data }) {
  if (!data || !data.rf || !data.nb || !data.final_prediction) return null;

  const rfData = data.rf;
  const nbData = data.nb;
  const finalModel = data.final_prediction.model;

  const modelsDisagree = rfData.disease !== nbData.disease;

  // Helper to render bars
  const renderModelResult = (modelName, modelData, isSelected, themeColor) => {
    // themeColor can be 'blue' or 'green'
    const colorMap = {
      blue: {
        border: "border-blue-200",
        bg: "bg-blue-50",
        text: "text-blue-800",
        bar: "bg-blue-500",
        selectRing: "ring-blue-400",
      },
      green: {
        border: "border-green-200",
        bg: "bg-green-50",
        text: "text-green-800",
        bar: "bg-green-500",
        selectRing: "ring-emerald-400",
      },
    };

    const c = colorMap[themeColor];

    return (
      <div
        className={`flex-1 p-5 rounded-xl border-2 transition-all relative ${
          isSelected
            ? `border-${themeColor}-400 shadow-lg ${c.bg} scale-[1.02] z-10`
            : "border-gray-100 bg-white opacity-80 scale-100 hover:opacity-100"
        }`}
      >
        {isSelected && (
          <div
            className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${c.bar}`}
          >
            WINNING MODEL
          </div>
        )}
        <h3 className={`text-lg font-bold mb-4 ${c.text} flex items-center`}>
          {themeColor === "blue" ? "🌲 " : "📊 "}
          {modelName}
        </h3>

        <div className="space-y-4">
          {modelData.top3.map((item, i) => (
            <div key={i} className="relative">
              <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                <span className="truncate pr-2">{item.disease}</span>
                <span>{(item.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-2.5 rounded-full ${c.bar} transition-all duration-700 ease-out`}
                  style={{ width: `${item.confidence * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-gray-50 flex flex-col w-full h-full">
      <h2 className="text-2xl font-bold text-indigo-900 mb-2">
        Model Analysis
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        See how our leading ML models evaluated your symptoms.
      </p>

      {modelsDisagree && (
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg mb-6 flex items-start">
          <span className="text-amber-500 text-xl mr-3 leading-none">⚠️</span>
          <div>
            <h4 className="text-amber-800 font-semibold text-sm">
              Model Disagreement Detected
            </h4>
            <p className="text-amber-700 text-xs mt-1">
              The models derived different primary conclusions. The "Winning Model"
              was chosen based on a significantly higher confidence score.
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 mt-2 relative">
        {renderModelResult(
          "Random Forest",
          rfData,
          finalModel === "Random Forest",
          "blue"
        )}
        
        {/* VS badge */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full items-center justify-center font-bold text-gray-500 text-xs border border-gray-200 z-20 shadow-sm">
          VS
        </div>

        {renderModelResult(
          "Naive Bayes",
          nbData,
          finalModel === "Naive Bayes",
          "green"
        )}
      </div>
    </div>
  );
}

export default ModelComparisonCard;
