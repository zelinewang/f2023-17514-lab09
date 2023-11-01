import React, { useState } from 'react';
import './Quiz.css'
import QuizCore from '../core/QuizCore';

interface QuizState {
  selectedAnswer: string | null;
  quizCompleted: boolean; // New state to track if the quiz is completed
}

const quizCore = new QuizCore();
// Don't need to put the quizCore into the QuizState interface
// QuizState interface is for managing the Quiz state, related to its rendering

const Quiz: React.FC = () => {
  const [state, setState] = useState<QuizState>({
    selectedAnswer: null, // Initialize the selected answer.
    quizCompleted: false, // Initialize if the quiz is completed. 
  });

  const handleOptionSelect = (option: string): void => {
    // select the option as selected answer. 
    setState((prevState) => ({ ...prevState, selectedAnswer: option }));
  };

  const handleButtonClick = (): void => {
    // Implement the logic for button click on 'Next Question', such as moving to the next question.

    // if as we click on next, we've already selected an answer, use answerQuestion() to check if correct.
    // if correct, increment score.
    if (state.selectedAnswer) {
      quizCore.answerQuestion(state.selectedAnswer);
    }
    // and no matter what, we need move to nextquestion, but if the quiz is over, we show score.
    if (quizCore.hasNextQuestion()) {
      // if not over, move to nextquestion and set the unselect answer. 
      quizCore.nextQuestion();
      setState({ ...state, selectedAnswer: null });
    } else {
      // if over, mark completed.
      setState({ ...state, quizCompleted: true });
    }
  };

  // these are to help with construct the GUI
  const currentQuestion = quizCore.getCurrentQuestion();
  const score = quizCore.getScore();

  if (state.quizCompleted) {
    // if all quiz are answered
    // we can onClick submit to reload the web to redo the quiz.
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>Final Score: {score}</p>
        <button onClick={() => window.location.reload()}>Submit</button>
      </div>
    );
  }

  // This is only for ts spelling check, if reminds currentQuestion might be null
  // but we already avoid it by doing quizCompleted. 
  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  // if quiz not completed. 
  // onclick, we can select our answer -- handleOptionSelect()
  // if onclick NextQuestion button, we consider logic in handleButtonClick()
  return (
    <div>
      <h2>Quiz Question:</h2>
      <p>{currentQuestion.question}</p>

      <h3>Answer Options:</h3>
      <ul>
        {currentQuestion.options.map((option) => (
          <li
            key={option}
            onClick={() => handleOptionSelect(option)}
            className={`option ${state.selectedAnswer === option ? 'selected' : ''}`}
          >
            {option}
          </li>
        ))}
      </ul>

      <button onClick={handleButtonClick}>Next Question</button>
    </div>
  );
};

export default Quiz;