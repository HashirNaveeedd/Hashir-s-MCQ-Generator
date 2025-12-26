
export type OptionKey = 'A' | 'B' | 'C' | 'D';

export interface Question {
  id: string;
  question: string;
  options: {
    [key in OptionKey]: string;
  };
  correctAnswer: OptionKey;
  explanation: string;
}

export interface QuizState {
  topic: string;
  questions: Question[];
  userAnswers: Record<string, OptionKey>;
  isGenerating: boolean;
  error: string | null;
  currentView: 'landing' | 'quiz' | 'results';
}
