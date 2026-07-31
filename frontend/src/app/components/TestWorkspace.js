import React from 'react';
import useTestStore from '../store/useTestStore';

const TestWorkspace = () => {
  // 1. Access state from the store
  const { currentQuestionId, setCurrentQuestion, questions } = useTestStore();

  // 2. Find the active question object based on the current ID
  const activeQuestion = questions.find((q) => q.id === currentQuestionId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {activeQuestion ? `Question ${activeQuestion.id}` : "Loading..."}
        </h2>
        <div className="bg-white p-6 rounded shadow">
          {/* Dynamic content rendering */}
          <p>{activeQuestion ? activeQuestion.text : "Please wait while we load the questions."}</p>
        </div>
      </div>

      {/* Sidebar Navigation Grid */}
      <div className="w-80 bg-white border-l p-4">
        <h3 className="font-semibold mb-4">Question Navigation</h3>
        <div className="grid grid-cols-4 gap-2">
          {/* Using the length of your questions array instead of a static 20 */}
          {questions.map((q) => (
            <button 
              key={q.id} 
              onClick={() => setCurrentQuestion(q.id)}
              className={`p-2 border rounded ${
                currentQuestionId === q.id ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
              }`}
            >
              {q.id}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestWorkspace;