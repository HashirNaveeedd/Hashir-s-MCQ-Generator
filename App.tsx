
import React, { useState, useEffect, useCallback } from 'react';
import { QuizState, Question, OptionKey } from './types';
import { generateMCQs } from './services/geminiService';
import { Header } from './components/Header';
import { MCQCard } from './components/MCQCard';
import { ResultsSummary } from './components/ResultsSummary';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [state, setState] = useState<QuizState>({
    topic: '',
    questions: [],
    userAnswers: {},
    isGenerating: false,
    error: null,
    currentView: 'landing'
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev: boolean) => !prev);

  const handleGenerate = async () => {
    if (!state.topic.trim()) {
      setState(prev => ({ ...prev, error: "Please enter a topic first." }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null, userAnswers: {} }));

    try {
      const mcqs = await generateMCQs(state.topic);
      setState(prev => ({ 
        ...prev, 
        questions: mcqs, 
        isGenerating: false, 
        currentView: 'quiz' 
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isGenerating: false, 
        error: err.message 
      }));
    }
  };

  const handleSelectOption = (questionId: string, option: OptionKey) => {
    setState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [questionId]: option
      }
    }));
  };

  const handleFinish = () => {
    setState(prev => ({ ...prev, currentView: 'results' }));
  };

  const handleReset = () => {
    setState({
      topic: '',
      questions: [],
      userAnswers: {},
      isGenerating: false,
      error: null,
      currentView: 'landing'
    });
  };

  const copyToClipboard = () => {
    const text = state.questions.map((q, i) => {
      return `Q${i+1}: ${q.question}\nA) ${q.options.A}\nB) ${q.options.B}\nC) ${q.options.C}\nD) ${q.options.D}\nCorrect: ${q.correctAnswer}\nExplanation: ${q.explanation}\n\n`;
    }).join("");
    navigator.clipboard.writeText(text);
    alert("Copied all questions to clipboard!");
  };

  const allAnswered = state.questions.length > 0 && 
    Object.keys(state.userAnswers).length === state.questions.length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-20">
      <Header 
        onHomeClick={handleReset} 
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      <main className="max-w-4xl mx-auto px-4 pt-12">
        {state.currentView === 'landing' && (
          <div className="text-center space-y-8 animate-in fade-in duration-700">
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4 border border-indigo-100 dark:border-indigo-900/50">
                Powered by Gemini AI
              </span>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6">
                Master Any Subject with <span className="text-indigo-600 dark:text-indigo-400">AI Quizzes</span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                Instantly generate high-quality multiple choice questions on any topic. 
                Perfect for students, teachers, and lifelong learners.
              </p>
            </div>

            <div className="max-w-lg mx-auto bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none flex flex-col sm:flex-row gap-2 border border-slate-100 dark:border-slate-700">
              <input
                type="text"
                placeholder="Enter a topic (e.g. Photosynthesis, Ancient Rome...)"
                className="flex-grow px-6 py-4 rounded-xl text-slate-800 dark:text-slate-100 bg-transparent placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                value={state.topic}
                onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
              />
              <button
                onClick={handleGenerate}
                disabled={state.isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[160px]"
              >
                {state.isGenerating ? (
                  <>
                    <i className="fas fa-circle-notch fa-spin mr-2"></i> Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sparkles mr-2"></i> Generate
                  </>
                )}
              </button>
            </div>

            {state.error && (
              <p className="text-rose-600 dark:text-rose-400 font-medium bg-rose-50 dark:bg-rose-900/20 inline-block px-4 py-2 rounded-lg border border-rose-100 dark:border-rose-900/30">
                {state.error}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-slate-200 dark:border-slate-700 mt-12">
              <div className="p-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-bolt"></i>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Instant Generation</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Get 5 unique MCQs in seconds using advanced AI models.</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-book-open"></i>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Detailed Explanations</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Learn why answers are correct with structured feedback.</p>
              </div>
              <div className="p-6">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-mobile-alt"></i>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Fully Responsive</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Practice on your phone, tablet, or desktop anywhere.</p>
              </div>
            </div>
          </div>
        )}

        {state.currentView === 'quiz' && (
          <div className="animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Topic: {state.topic}</h2>
                <p className="text-slate-500 dark:text-slate-400">Select the best answer for each question below.</p>
              </div>
              <button 
                onClick={copyToClipboard}
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 px-4 py-2 rounded-lg transition-colors"
              >
                <i className="fas fa-copy mr-2"></i> Copy Questions
              </button>
            </div>

            <div className="space-y-6">
              {state.questions.map((q, idx) => (
                <MCQCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedOption={state.userAnswers[q.id]}
                  onSelect={(opt) => handleSelectOption(q.id, opt)}
                  showFeedback={false}
                />
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center">
              {!allAnswered && (
                <p className="text-amber-600 dark:text-amber-400 font-medium mb-4 flex items-center">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Please answer all questions to see results
                </p>
              )}
              <button
                disabled={!allAnswered}
                onClick={handleFinish}
                className={`px-12 py-5 rounded-2xl font-bold text-lg shadow-xl transition-all ${
                  allAnswered 
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none" 
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                }`}
              >
                Finish Quiz & See Results
              </button>
            </div>
          </div>
        )}

        {state.currentView === 'results' && (
          <div className="space-y-12">
            <ResultsSummary 
              questions={state.questions} 
              userAnswers={state.userAnswers} 
              onRetry={handleReset}
              topic={state.topic}
            />

            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 pb-4">
                Detailed Review
              </h3>
              {state.questions.map((q, idx) => (
                <MCQCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedOption={state.userAnswers[q.id]}
                  onSelect={() => {}}
                  showFeedback={true}
                />
              ))}
              
              <div className="text-center pt-8">
                <button
                  onClick={handleReset}
                  className="px-10 py-4 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-bold hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors shadow-lg"
                >
                  <i className="fas fa-plus mr-2"></i> Start a New Quiz
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-slate-200 dark:border-slate-700 py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center mb-6">
            <div className="bg-indigo-600 p-1.5 rounded-lg mr-2">
              <i className="fas fa-brain text-white text-sm"></i>
            </div>
            <span className="font-bold text-slate-800 dark:text-slate-200">Hashir's MCQs Generator</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-sm max-w-sm mb-6">
            An advanced AI tool for generating multiple choice questions and improving retention through active recall.
          </p>
          <div className="flex space-x-6 mb-8">
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fab fa-github"></i></a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors"><i className="fab fa-linkedin"></i></a>
          </div>
          <div className="text-slate-400 dark:text-slate-600 text-xs">
            © 2024 Hashir's MCQs Generator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
