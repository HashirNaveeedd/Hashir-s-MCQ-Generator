
import React from 'react';
import { Question, OptionKey } from '../types';

interface ResultsSummaryProps {
  questions: Question[];
  userAnswers: Record<string, OptionKey>;
  onRetry: () => void;
  topic: string;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ 
  questions, 
  userAnswers, 
  onRetry,
  topic
}) => {
  const total = questions.length;
  const correctCount = questions.reduce((acc, q) => {
    return acc + (userAnswers[q.id] === q.correctAnswer ? 1 : 0);
  }, 0);
  const percentage = Math.round((correctCount / total) * 100);

  const getStatusColor = () => {
    if (percentage >= 80) return 'text-emerald-600 dark:text-emerald-400';
    if (percentage >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getStatusMessage = () => {
    if (percentage >= 80) return "Excellent! You've mastered this topic.";
    if (percentage >= 50) return "Good job! You have a solid understanding.";
    return "Keep practicing! You'll get better with time.";
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-8 text-center animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-6">
        <i className="fas fa-trophy text-3xl"></i>
      </div>
      
      <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">Quiz Complete!</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8">Topic: <span className="font-semibold text-slate-700 dark:text-slate-300 italic">"{topic}"</span></p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Score</p>
          <p className={`text-4xl font-black ${getStatusColor()}`}>{percentage}%</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Correct</p>
          <p className="text-4xl font-black text-slate-800 dark:text-slate-100">{correctCount} <span className="text-lg text-slate-400 font-medium">/ {total}</span></p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 transition-colors">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status</p>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-300 mt-2 leading-tight">{getStatusMessage()}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={onRetry}
          className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all"
        >
          New Quiz
        </button>
        <button 
          className="px-8 py-4 bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-slate-600 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-slate-600 transition-all"
          onClick={() => window.print()}
        >
          <i className="fas fa-print mr-2"></i> Print Results
        </button>
      </div>
    </div>
  );
};
