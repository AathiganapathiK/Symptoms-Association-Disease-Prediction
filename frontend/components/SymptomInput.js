import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function SymptomInput({ onPredict }) {
  const [validSymptoms, setValidSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Fetch valid symptoms list exactly as requested
    axios
      .get("http://127.0.0.1:8000/symptoms")
      .then((res) => {
        setValidSymptoms(res.data.symptoms);
      })
      .catch((err) => {
        console.error("Failed to fetch symptoms", err);
      });
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const unselected = validSymptoms.filter(
      (s) => !selectedSymptoms.includes(s)
    );

    if (inputValue.trim() === "") {
      setSuggestions(unselected.slice(0, 50)); // Show initial default list
    } else {
      const query = inputValue.toLowerCase();
      // Contains matching logic for substring and suggestions
      const matches = unselected.filter((s) =>
        s.toLowerCase().includes(query)
      );
      setSuggestions(matches.slice(0, 15));
    }
  }, [inputValue, validSymptoms, selectedSymptoms]);

  const handleAddSymptom = (smp) => {
    if (!selectedSymptoms.includes(smp)) {
      setSelectedSymptoms([...selectedSymptoms, smp]);
    }
    setInputValue("");
  };

  const handleRemoveSymptom = (smp) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s !== smp));
  };

  const handleSubmit = () => {
    if (selectedSymptoms.length < 2) return;
    onPredict(selectedSymptoms);
  };

  return (
    <div
      ref={wrapperRef}
      className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-indigo-50 w-full relative"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-indigo-900 mb-1">
          Analyze Your Symptoms
        </h2>
        <p className="text-gray-500 text-sm">
          Select at least 2 symptoms for our models to evaluate.
        </p>
      </div>

      {/* Selected Chips */}
      {selectedSymptoms.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedSymptoms.map((smp) => (
            <span
              key={smp}
              className="flex items-center px-3 py-1.5 bg-teal-50 text-teal-700 rounded-full text-sm font-medium border border-teal-200 shadow-sm transition-all hover:bg-teal-100"
            >
              {smp}
              <button
                onClick={() => handleRemoveSymptom(smp)}
                className="ml-2 w-5 h-5 flex items-center justify-center rounded-full text-teal-500 hover:text-white hover:bg-red-400 focus:outline-none transition-colors"
                title="Remove"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Dropdown Area */}
      <div className="relative z-20">
        <input
          type="text"
          className="w-full border border-gray-200 p-3.5 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 placeholder-gray-400 transition-all text-gray-700 font-medium"
          placeholder="e.g. Fever, Cough, Nausea..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        
        {isFocused && (
          <div className="absolute w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50">
            <ul className="max-h-64 overflow-y-auto divide-y divide-gray-50">
              {suggestions.map((smp) => (
                <li
                  key={smp}
                  className="px-5 py-3 hover:bg-indigo-50 cursor-pointer text-gray-700 hover:text-indigo-700 font-medium transition-colors flex items-center group"
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevents input from losing focus
                    handleAddSymptom(smp);
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-teal-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {smp}
                </li>
              ))}
              {suggestions.length === 0 && inputValue.trim() !== "" && (
                <li className="px-5 py-4 text-gray-500 text-sm text-center bg-gray-50">
                  No valid symptoms found for "<span className="font-semibold">{inputValue}</span>".<br/>
                  <span className="text-xs text-gray-400 mt-1 block">Please check your spelling or try another term. You must select from the approved list.</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Action / Predict Button Container */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 pt-6">
        <span
          className={`text-sm font-medium px-4 py-1.5 rounded-full ${
            selectedSymptoms.length >= 2
              ? "bg-green-100 text-green-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {selectedSymptoms.length} / 2 required symptoms
        </span>

        <button
          onClick={handleSubmit}
          disabled={selectedSymptoms.length < 2}
          className={`py-3 px-8 rounded-xl font-bold shadow-md transition-all duration-200 block w-full sm:w-auto ${
            selectedSymptoms.length >= 2
              ? "bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white transform hover:-translate-y-0.5 hover:shadow-lg"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none"
          }`}
        >
          Predict Disease
        </button>
      </div>
    </div>
  );
}

export default SymptomInput;