import React, { useState } from 'react';
import {fetchQuizQuestions} from './API';
//Components
import QuestionCard from './components/QuestionCard';
//Types
import {QuestionState, Difficulty} from './API';
//Styles
import { GlobalStyle, Wrapper } from './app.style';
import preloader from "./images/preloader.gif"

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const TOTAL_QUESTIONS =10;

const App = () => {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startTrivia = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.EASY
    );

    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setNumber(0);

    setLoading(false);

  };
  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if(!gameOver){
      //users answer
      const answer = e.currentTarget.value;
      //check answer against correct answer
      const correct = questions[number].correct_answer === answer;
      //add score if answer is correct
      if(correct){
        setScore(prev=>prev+1);
      }
      //save answer in the array for user answer
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswers(prev => [...prev, answerObject])
    }
  }
  const nextQuestion = () => {
    //move on to the next question if not the last question
    const nextQuestion = number+1;
    if(nextQuestion===TOTAL_QUESTIONS){
      setGameOver(true);
    }else{
      setNumber(nextQuestion);
    }
  }
  return (
    <>
    <GlobalStyle/>
      <Wrapper>
          <h1>Quiz App using React &amp; TypeScript</h1>
          {gameOver  
            ?<div className="btn_start" >
              <button className="button" onClick={startTrivia}> Start Quiz </button>
            </div>
            : null}
          {!gameOver ? <p className="score">Score: {score}</p> : null}
          {loading && <div className="loading">
            <img className="preloader" src={preloader} alt="preloader"/> <br/>
          </div>}
          {!loading && !gameOver && (
          <QuestionCard 
            questionNr={number+1}
            totalQuestions={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] :undefined}
            callback={checkAnswer}
          />
          )}
          {!loading && !gameOver && userAnswers.length === number+1 && number !== (TOTAL_QUESTIONS - 1)
          ? <button className="button" onClick={nextQuestion}>Next Question</button> : null}
          
          {userAnswers.length === TOTAL_QUESTIONS ? <div>
            <h3 className="game-over-message">Game Over</h3>
            <button className="button-quiz-again" onClick={startTrivia}> Start Quiz Again </button>
          </div> : null}
          
      </Wrapper>
    </>
  );
}

export default App;