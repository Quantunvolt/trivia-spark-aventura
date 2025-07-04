import React, { useState, useEffect, useCallback } from 'react';
import { generateTriviaQuestions } from '../services/geminiService';
import { Question, LevelConfig, PowerUpId } from '../types';
import { getMinCorrectToWin } from '../constants';
import { FiftyFiftyIcon, SkipIcon } from './icons';

interface TriviaLevelProps {
  level: LevelConfig;
  onLevelComplete: (correctAnswers: number) => void;
  onLevelFail: (correctAnswers: number) => void;
  powerUps: { [key: string]: number };
  onUsePowerUp: (powerUpId: PowerUpId) => void;
}

const TriviaLevel: React.FC<TriviaLevelProps> = ({ level, onLevelComplete, onLevelFail, powerUps, onUsePowerUp }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [disabledOptions, setDisabledOptions] = useState<string[]>([]);
  const [usedPowerUpsThisQuestion, setUsedPowerUpsThisQuestion] = useState<PowerUpId[]>([]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedQuestions = await generateTriviaQuestions(level.topic, level.questionCount);
      setQuestions(fetchedQuestions);
    } catch (err) {
      setError("¡Ups! No se pudieron obtener las preguntas. Por favor, inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.topic, level.questionCount]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);
  
  // Reset for new question
  useEffect(() => {
    setDisabledOptions([]);
    setUsedPowerUpsThisQuestion([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
  }, [currentQuestionIndex]);

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(s => s + 1);
    }

    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(i => i + 1);
      } else {
        // Level finished
        const finalScore = score + (isCorrect ? 1 : 0);
        if (finalScore >= getMinCorrectToWin(level.questionCount)) {
            onLevelComplete(finalScore);
        } else {
            onLevelFail(finalScore);
        }
      }
    }, 1500);
  };

  const handleUseFiftyFifty = () => {
    if ((powerUps['fifty_fifty'] || 0) <= 0 || isAnswered || usedPowerUpsThisQuestion.includes('fifty_fifty')) return;
    
    onUsePowerUp('fifty_fifty');
    setUsedPowerUpsThisQuestion(prev => [...prev, 'fifty_fifty']);

    const currentQ = questions[currentQuestionIndex];
    const wrongAnswers = currentQ.options.filter(opt => opt !== currentQ.correctAnswer);
    const toDisable = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
    setDisabledOptions(toDisable);
  };

  const handleSkipQuestion = () => {
    if ((powerUps['skip'] || 0) <= 0 || isAnswered) return;
    
    onUsePowerUp('skip');
    setIsAnswered(true); // Prevent answering

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(i => i + 1);
        } else {
            // Last question was skipped. End with current score.
            if (score >= getMinCorrectToWin(level.questionCount)) {
                onLevelComplete(score);
            } else {
                onLevelFail(score);
            }
        }
    }, 300);
  };


  if (loading) {
    return <div className="w-full h-full flex flex-col justify-center items-center font-body text-white">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-bold">Generando Preguntas...</p>
        <p>Tema: {level.topic}</p>
    </div>;
  }

  if (error) {
    return <div className="w-full h-full flex flex-col justify-center items-center bg-red-900/50 font-body text-red-200 p-4 text-center">
        <p className="text-2xl font-bold mb-4">Ocurrió un Error</p>
        <p>{error}</p>
        <button onClick={() => onLevelFail(0)} className="mt-6 bg-white text-red-200 font-bold py-2 px-6 rounded-full shadow-lg">Volver al Mapa</button>
    </div>;
  }
  
  if (questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const availableFiftyFifty = powerUps['fifty_fifty'] || 0;
  const availableSkips = powerUps['skip'] || 0;

  return (
    <div className="w-full h-full flex flex-col p-4 animate-fade-in">
      <div className="flex-grow flex flex-col justify-center items-center">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="bg-slate-300 rounded-full h-4 mb-4">
            <div 
              className="bg-green-400 h-4 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`}}
            ></div>
          </div>
          
          {/* Question Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <p className="text-sm font-bold text-indigo-500 mb-2">Pregunta {currentQuestionIndex + 1} de {questions.length}</p>
            <h2 className="text-2xl font-bold text-slate-800 font-body leading-tight">{currentQuestion.question}</h2>
          </div>

          {/* Power-ups */}
          <div className="flex justify-center items-center gap-6 my-6">
            <button
              onClick={handleUseFiftyFifty}
              disabled={availableFiftyFifty <= 0 || isAnswered || usedPowerUpsThisQuestion.includes('fifty_fifty')}
              className="relative flex flex-col items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full shadow-lg text-white font-bold transition-all transform hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-70"
              aria-label={`Usar 50/50, ${availableFiftyFifty} restantes`}
            >
              <FiftyFiftyIcon className="w-10 h-10" />
              <span className="text-sm mt-1">50/50</span>
              <div className="absolute -top-1 -right-1 bg-white text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-display border-2 border-blue-500">
                {availableFiftyFifty}
              </div>
            </button>
            <button
              onClick={handleSkipQuestion}
              disabled={availableSkips <= 0 || isAnswered}
              className="relative flex flex-col items-center justify-center w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg text-white font-bold transition-all transform hover:scale-105 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed disabled:scale-100 disabled:opacity-70"
              aria-label={`Usar Salto, ${availableSkips} restantes`}
            >
              <SkipIcon className="w-10 h-10" />
              <span className="text-sm mt-1">Saltar</span>
              <div className="absolute -top-1 -right-1 bg-white text-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-display border-2 border-red-500">
                {availableSkips}
              </div>
            </button>
          </div>


          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {currentQuestion.options.map(option => {
              const isCorrect = option === currentQuestion.correctAnswer;
              const isDisabled = disabledOptions.includes(option);
              
              let buttonClass = "bg-white text-slate-700 hover:bg-indigo-100";
              if (isDisabled) {
                  buttonClass = "bg-slate-300 text-slate-500 opacity-50 cursor-not-allowed";
              } else if(isAnswered) {
                  if (isCorrect) {
                      buttonClass = "bg-green-500 text-white transform scale-105";
                  } else if (selectedAnswer === option) {
                      buttonClass = "bg-red-500 text-white";
                  } else {
                      buttonClass = "bg-white/50 text-slate-500 opacity-70";
                  }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isAnswered || isDisabled}
                  className={`p-4 rounded-xl text-lg font-body font-semibold shadow-lg transition-all duration-300 ${buttonClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriviaLevel;