import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./index.css";

export default function Questions({ handleAnswerSelection, error }) {
  const { trace, questions } = useSelector((state) => state.events);
  const question = useSelector(
    (state) => state.events.questions[state.events.trace]
  );
  const [selectedOption, setSelectedOption] = useState(null);

  function onSelect(option, question) {
    setSelectedOption(option.id);
    handleAnswerSelection(option, question);
  }

  // Reset selected option when question changes
  React.useEffect(() => {
    setSelectedOption(null);
  }, [trace]);

  if (!question) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-500">Savol yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="questions">
      <div className="space-y-8">
        {/* Question Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Savol {trace + 1} / {questions.length}
          </div>
        </div>

        {/* Question Text */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 leading-relaxed">
            {question?.question}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Javobni tanlang:
          </h3>
          
          <div className="space-y-3">
            {question?.options.map((option, index) => (
              <label
                key={option.id}
                className={`block cursor-pointer transition-all duration-200 ${
                  error ? "animate-pulse" : ""
                }`}
              >
                <input
                  type="radio"
                  name="options"
                  id={`q${index}-option`}
                  onChange={() => onSelect(option, question?.question)}
                  className="sr-only"
                  checked={selectedOption === option.id}
                />
                <div className={`
                  p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                  ${error 
                    ? 'border-red-300 bg-red-50 hover:border-red-400' 
                    : selectedOption === option.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }
                `}>
                  <div className="flex items-center gap-3">
                    <div className={`
                      w-6 h-6 rounded-full border-2 flex items-center justify-center
                      ${error 
                        ? 'border-red-400' 
                        : selectedOption === option.id
                        ? 'border-blue-500'
                        : 'border-gray-300'
                      }
                    `}>
                      <div className={`
                        w-3 h-3 rounded-full transition-all duration-200
                        ${error 
                          ? 'bg-red-500' 
                          : selectedOption === option.id
                          ? 'bg-blue-500 scale-100'
                          : 'bg-blue-500 scale-0'
                        }
                      `}></div>
                    </div>
                    <span className={`
                      text-lg font-medium transition-colors duration-200
                      ${error 
                        ? 'text-red-700' 
                        : selectedOption === option.id
                        ? 'text-blue-700'
                        : 'text-gray-700'
                      }
                    `}>
                      {option.A_B_option}
                    </span>
                  </div>
                </div>
              </label>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-200 shake">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Iltimos, javobni tanlang!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
