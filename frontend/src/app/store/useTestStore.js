import { create } from 'zustand';

const useTestStore = create((set) => ({
  currentQuestionId: 1, // Defaulting to 1
  questions: [],        // New: array to hold all test data
  answers: {},
  timers: {},

  // New action to load data
  setQuestions: (questions) => set({ questions }),

  setCurrentQuestion: (id) => set({ currentQuestionId: id }),
  setAnswer: (qId, option) => set((state) => ({ 
    answers: { ...state.answers, [qId]: option } 
  })),
  setTimer: (qId, time) => set((state) => ({ 
    timers: { ...state.timers, [qId]: time } 
  })),
}));

export default useTestStore;