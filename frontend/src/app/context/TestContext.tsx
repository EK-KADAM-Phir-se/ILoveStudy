"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Question {
  id: string;
  subject: string;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface TestContextType {
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  answers: Record<string, string>;
  selectOption: (questionId: string, option: string) => void;
  examTimeLeft: number;
  questionTimers: Record<string, number>;
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
  submitFinalExam: () => Promise<void>;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider = ({ children }: { children: React.ReactNode }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [examTimeLeft, setExamTimeLeft] = useState<number>(10800); // 3 Hours
  const [questionTimers, setQuestionTimers] = useState<Record<string, number>>({});
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Define a static active Shift ID for our testing staging sandbox environment
  const targetShiftId = "sandbox-shift-jee-2026";

  // Master countdown tracking loop
  useEffect(() => {
    if (examTimeLeft <= 0) return;
    const masterClock = setInterval(() => {
      setExamTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(masterClock);
  }, [examTimeLeft]);

  // Integrated Fire-and-Forget Network synchronization method
  const selectOption = async (questionId: string, option: string) => {
    // 1. Optimistically update local client-side UI immediately for zero input lag
    setAnswers((prev) => ({ ...prev, [questionId]: option }));

    try {
      // 2. Stream payload directly into our high-performance Redis cache backend
      await axios.post('http://localhost:5000/api/test/save-answer', {
        shiftId: targetShiftId,
        questionId,
        selectedOption: option,
        timeSpent: questionTimers[questionId] || 0
      }, {
        headers: { 
          // Temporary placeholder fallback bypass auth signature token parameter key
          'Authorization': 'Bearer SIMULATED_TOKEN' 
        }
      });
    } catch (err) {
      console.error("Failed to sync selection to Redis backing cache:", err);
    }
  };

  // Final Exam submission wrapper
  const submitFinalExam = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/test/submit', {
        shiftId: targetShiftId
      }, {
        headers: { 'Authorization': 'Bearer SIMULATED_TOKEN' }
      });
      alert(`Exam submitted successfully! Your calculated score is: ${response.data.finalScore}`);
    } catch (err) {
      console.error("Submission pipeline failure:", err);
      alert("Failed to submit exam cleanly.");
    }
  };

  return (
    <TestContext.Provider value={{
      questions, currentQuestionIndex, setCurrentQuestionIndex,
      answers, selectOption, examTimeLeft, questionTimers, isFullscreen, setIsFullscreen,
      submitFinalExam
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTest must be used within a TestProvider");
  return context;
};