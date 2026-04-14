import React, { useEffect, useState, useRef } from "react";
import { ApiServices } from "../../components/api.service";
import { useDispatch, useSelector } from "react-redux";
import "./index.css"; // Import CSS file for styling
import Questions from "./questions";
import * as Action from "../../reducer/redux";
import Loader1 from "../../components/loader/loader1";
import { useNavigate, useParams } from "react-router-dom";
import { FaClock, FaQuestionCircle, FaCheckCircle, FaArrowRight, FaArrowLeft } from "react-icons/fa";

const Test = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { trace, questions, answers, type } = useSelector(
    (state) => state.events
  );
  const [modal, setModal] = useState(false);
  const [timer, setTimer] = useState(0);
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [availableTests, setAvailableTests] = useState([]);
  const [testLoading, setTestLoading] = useState(false);

  const intervalRef = useRef(null);

  // Function to shuffle array (Fisher-Yates algorithm)
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Function to get random questions based on test type
  const getRandomQuestions = (allTestItems, testType, maxQuestions) => {
    // Filter test items by the selected test type
    const filteredItems = allTestItems.filter(item => 
      item.test.type.id === testType.id
    );

    // Shuffle and take the required number of questions
    const shuffled = shuffleArray(filteredItems);
    const selectedItems = shuffled.slice(0, Math.min(maxQuestions, shuffled.length));

    // Format questions for the quiz
    return selectedItems.map(item => ({
      id: item.question.id,
      question: item.question.question,
      options: item.question.options.map(option => ({
        id: option.id,
        A_B_option: option.A_B_option
      }))
    }));
  };

  const handleTestSelection = async (test) => {
    setTestLoading(true);
    setSelectedTest(test);
    
    try {
      // Fetch all test items
      const testItemsResponse = await ApiServices.getData("/test-items/");
      
      // Get random questions based on test type
      const randomQuestions = getRandomQuestions(
        testItemsResponse, 
        test.type, 
        test.type.number_of_tests || 30
      );

      // Start the exam with selected questions
      dispatch(
        Action.startExamAction({
          question: randomQuestions,
          testType: test.type,
        })
      );

      // Initialize timer
      const initialTimer = test.type.time * 60;
      setTimer(initialTimer);
      localStorage.setItem(`timer_${test.id}`, initialTimer);
      localStorage.setItem(`startTime_${test.id}`, Date.now());
      localStorage.setItem(`selected_test_${test.id}`, JSON.stringify(test));

    } catch (error) {
      console.log("Error starting test:", error);
    } finally {
      setTestLoading(false);
    }
  };

  const handleOpenResult = async (active) => {
    // Clear local storage
    localStorage.removeItem("test_id");
    localStorage.removeItem(`timer_${selectedTest?.id}`);
    localStorage.removeItem(`startTime_${selectedTest?.id}`);
    localStorage.removeItem(`selected_test_${selectedTest?.id}`);
    dispatch(Action.setTestIdAction("no"));
    clearInterval(intervalRef.current);
    setTimer(0);
    setSelectedTest(null);

    try {
      // Oxirgi savolga javobni answers massiviga qo'shamiz
      let allAnswers = [...answers];
      if (allAnswers.length < questions.length && result) {
        allAnswers[trace] = result;
      }
      const formattedAnswers = questions.map((q, idx) => {
        const ans = allAnswers[idx];
        let answerText = 'Tanlanmagan';
        if (!ans) {
          answerText = 'Tanlanmagan';
        } else if (typeof ans === 'object' && ans !== null && 'A_B_option' in ans) {
          answerText = ans.A_B_option;
        } else if (typeof ans === 'string') {
          answerText = ans;
        } else if (typeof ans === 'number') {
          const selectedOption = q.options.find(opt => opt.id === ans);
          answerText = selectedOption ? selectedOption.A_B_option : 'Tanlanmagan';
        }
        return `${q.question} - ${answerText}`;
      });
      const payload = {
        test_id: selectedTest?.id,
        answer: formattedAnswers.join('\n')
      };
      await ApiServices.postData("/analyze-test/", payload);
      navigate("/user/results");
    } catch (error) {
      console.log("Error analyzing test:", error);
      alert("Test natijasi saqlashda xatolik yuz berdi. Natijalar bo'limida ko'rishingiz mumkin.");
      navigate("/user/results");
    }
  };

  const handleActiveModal = () => {
    setModal(!modal);
  };

  const handleAnswerSelection = (option) => {
    setResult(option);
    setError(false);
  };

  const handleNextQuestion = () => {
    if (!result || result.length === 0) {
      setError(true);
      return;
    }
    if (trace + 1 === questions.length) {
      dispatch(Action.answersAction(result));
      // Use alert instead of modal
      const confirmFinish = window.confirm("Testni rostdan ham tugatmoqchimisiz?");
      if (confirmFinish) {
        handleOpenResult(true);
      }
      return;
    }
    dispatch(Action.answersAction(result));
    setResult([]);
    return dispatch(Action.moveNextAction());
  };

  const handlePreviousQuestion = () => {
    if (trace > 0) {
      dispatch(Action.movePrevAction());
      setResult([]);
      setError(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (!selectedTest || !type.time) return;

    const savedStartTime = localStorage.getItem(`startTime_${selectedTest.id}`);
    const savedTimer = localStorage.getItem(`timer_${selectedTest.id}`);

    if (savedStartTime && savedTimer) {
      const elapsedTime = Math.floor(
        (Date.now() - Number(savedStartTime)) / 1000
      );
      const remainingTime = Number(savedTimer) - elapsedTime;
      setTimer(remainingTime > 0 ? remainingTime : 0);
    } else {
      const initialTimer = type.time * 60;
      setTimer(initialTimer);
      localStorage.setItem(`timer_${selectedTest.id}`, initialTimer);
      localStorage.setItem(`startTime_${selectedTest.id}`, Date.now());
    }

    intervalRef.current = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          localStorage.setItem(`timer_${selectedTest.id}`, prevTimer - 1);
          return prevTimer - 1;
        } else {
          clearInterval(intervalRef.current);
          // Auto-submit when time runs out
          if (questions.length > 0) {
            alert("Vaqt tugadi! Test avtomatik ravishda tugatiladi.");
            handleOpenResult(true);
          }
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [selectedTest, type.time, questions.length]);

  // Fetch available tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const testsResponse = await ApiServices.getData("/tests/");
        setAvailableTests(testsResponse);
      } catch (error) {
        console.log("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  // Check for existing test session
  useEffect(() => {
    if (id !== "no") {
      const savedTest = localStorage.getItem(`selected_test_${id}`);
      if (savedTest) {
        const parsedTest = JSON.parse(savedTest);
        setSelectedTest(parsedTest);
        // Restore test session
        const savedStartTime = localStorage.getItem(`startTime_${id}`);
        const savedTimer = localStorage.getItem(`timer_${id}`);
        if (savedStartTime && savedTimer) {
          const elapsedTime = Math.floor(
            (Date.now() - Number(savedStartTime)) / 1000
          );
          const remainingTime = Number(savedTimer) - elapsedTime;
          if (remainingTime > 0) {
            setTimer(remainingTime);
          }
        }
      }
    }
  }, [id]);

  // Format timer display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate progress percentage
  const progressPercentage = questions.length > 0 ? ((trace + 1) / questions.length) * 100 : 0;

  // Check if timer is running low (less than 5 minutes)
  const isTimeLow = timer <= 300 && timer > 0;

  return (
    <>
      {id === "no" && !selectedTest && (
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-start py-6 px-2 bg-[#f7f8fa] test-container">
          <div className="w-full max-w-6xl">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Test Tanlash</h1>
              <p className="text-gray-600">O'zingizga mos testni tanlang va bilimingizni sinovdan o'tkazing</p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <Loader1 />
              </div>
            ) : (
              <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${availableTests.length <= 2 ? 'justify-center' : ''}`}>
                {availableTests.map((test) => (
                  <div
                    key={test.id}
                    className="group relative rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white border border-gray-100 hover:-translate-y-2 mx-auto"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-primary to-blue-600 rounded-xl flex items-center justify-center">
                          <FaQuestionCircle className="text-white text-xl" />
                        </div>
                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                          {test.type.name}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {test.name}
                      </h3>
                      
                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-gray-600">
                          <FaClock className="mr-2 text-primary" />
                          <span>{test.type.time} daqiqa</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <FaQuestionCircle className="mr-2 text-green-500" />
                          <span>{test.type.number_of_tests} ta savol</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleTestSelection(test)}
                        disabled={testLoading}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {testLoading ? (
                          <>
                            <div className="spinner"></div>
                            Yuklanmoqda...
                          </>
                        ) : (
                          <>
                            Testni boshlash
                            <FaArrowRight />
                          </>
                        )}
                      </button>
                    </div>
                    
                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedTest && questions.length > 0 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center justify-start py-4 px-2 bg-[#f7f8fa] test-container">
          <div className="w-full max-w-3xl test-compact">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4 test-header-compact">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-gray-800 mb-1">
                    {selectedTest.name}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Savol {trace + 1} / {questions.length}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Timer */}
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-300 ${
                    isTimeLow 
                      ? 'bg-red-100 text-red-600 timer-warning' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <FaClock className={isTimeLow ? 'text-red-500' : 'text-primary'} />
                    <span className={`font-bold text-sm ${isTimeLow ? 'text-red-600' : 'text-primary'}`}>
                      {formatTime(timer)}
                    </span>
                  </div>
                  
                  {/* Progress */}
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-primary to-blue-600 h-1.5 rounded-full transition-all duration-300 progress-bar"
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Time warning message */}
              {isTimeLow && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 text-red-600">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Vaqt tugab qolyapti! Tezroq javob bering.</span>
                  </div>
                </div>
              )}
            </div>

            {/* Question Content */}
            <div className="bg-white rounded-2xl shadow-lg p-6 test-content-compact">
              <Questions
                handleAnswerSelection={handleAnswerSelection}
                error={error}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-4 test-navigation-compact">
              <button
                onClick={handlePreviousQuestion}
                disabled={trace === 0}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <FaArrowLeft />
                Oldingi
              </button>
              
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:scale-105 text-sm"
              >
                {trace === questions.length - 1 ? (
                  <>
                    <FaCheckCircle />
                    Testni tugatish
                  </>
                ) : (
                  <>
                    Keyingi
                    <FaArrowRight />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default Test;
