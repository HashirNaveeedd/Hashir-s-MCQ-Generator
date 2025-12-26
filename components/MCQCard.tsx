
import React from 'react';
import { Question, OptionKey } from '../types';

interface MCQCardProps {
  question: Question;
  index: number;
  selectedOption: OptionKey | undefined;
  onSelect: (option: OptionKey) => void;
  showFeedback: boolean;
}

export const MCQCard: React.FC<MCQCardProps> = ({ 
  question, 
  index, 
  selectedOption, 
  onSelect,
  showFeedback 
}) => {
  const options: OptionKey[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700 mb-6 transition-all hover:shadow-md">
      <div className="flex items-start mb-6">
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-sm mr-4 mt-0.5">
          {index + 1}
        </span>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3">
        {options.map((key) => {
          const isSelected = selectedOption === key;
          const isCorrect = question.correctAnswer === key;
          
          let buttonClass = "flex items-center w-full p-4 rounded-xl border-2 transition-all text-left ";
          let iconClass = "w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 text-xs font-bold ";

          if (!showFeedback) {
            buttonClass += isSelected 
              ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300" 
              : "border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400";
            iconClass += isSelected 
              ? "bg-indigo-600 border-indigo-600 text-white" 
              : "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400";
          } else {
            if (isCorrect) {
              buttonClass += "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300";
              iconClass += "bg-emerald-500 border-emerald-500 text-white";
            } else if (isSelected && !isCorrect) {
              buttonClass += "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300";
              iconClass += "bg-rose-500 border-rose-500 text-white";
            } else {
              buttonClass += "border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/30 opacity-50 grayscale-[0.5]";
              iconClass += "bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-400";
            }
          }

          return (
            <button
              key={key}
              onClick={() => !showFeedback && onSelect(key)}
              disabled={showFeedback}
              className={buttonClass}
            >
              <div className={iconClass}>
                {showFeedback && isCorrect ? <i className="fas fa-check"></i> : 
                 showFeedback && isSelected && !isCorrect ? <i className="fas fa-times"></i> : 
                 key}
              </div>
              <span className="font-medium">{question.options[key]}</span>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="mt-6 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 text-sm">
          <p className="flex items-center text-indigo-800 dark:text-indigo-300 font-bold mb-1">
            <i className="fas fa-info-circle mr-2"></i> Explanation
          </p>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
