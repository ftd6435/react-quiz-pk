import {useReducer, useEffect} from "react";
import Header from "./Header";
import Main from "./Main";
import StartScreen from "./StartScreen";
import Progress from "./Progress";
import Question from "./Question";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Input from "./Input";
import Timer from "./TImer";
import Footer from "./Footer";
import Loader from "./Loader";
import Error from "./Error";

const initialState = {
  questions: [],

  // loading, Error, ready, active, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
  userSetNumber: 0,
  secsPerQuestion: 30,
};

let answerTab = [];

// const SECS_PER_QUES = 30;

function reducer(state, action) {
  switch(action.type){
    case "dataReceived":
      return {
        ...state, questions: action.payload, status: "ready"
      };
    case "dataFailed":
      return {
        ...state, status: "error"
      };
    case "start":
      return{
        ...state, status: "active", secondsRemaining: state.userSetNumber > 0 ? state.userSetNumber * state.secsPerQuestion : state.questions.length * state.secsPerQuestion
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      answerTab[state.index] = {
        'question': question.question,
        'chosen': question.options[action.payload],
        'correct': question.options[question.correctOption]
      };

      return{
        ...state, answer: action.payload, points: action.payload === question.correctOption ? state.points + question.points : state.points
      };
    case "nextQuestion":
      return{
        ...state, index: state.index + 1, answer: null
      };
    case "finished":
      return{
        ...state, status: "finished", highscore: state.points > state.highscore ? state.points : state.highscore
      };
    case "restart":
      return{
        questions: state.questions,
        status: "ready",
        index: 0,
        answer: null,
        points: 0,
        highscore: state.highscore,
        secondsRemaining: null,
        userSetNumber: 0,
        secsPerQuestion: 30,
      };
    case "userSetNumber":
      if(action.payload > state.questions.length) return {...state, status: "error"};

      return{
        ...state, userSetNumber: action.payload
      };
    case "userSettle":
      if(state.userSetNumber <= 0) return {...state, status: "error"};

      return{
        ...state, status: "timeSet", secsPerQuestion: action.payload
      };
    case 'tick':
      return{
        ...state, secondsRemaining: state.secondsRemaining - 1, status: state.secondsRemaining === 0 ? "finished" : state.status
      };
    default:
      throw new Error("Unknown action");
  }
}

export default function App()
{
  const [{questions, status, index, answer, points, highscore, secondsRemaining, userSetNumber}, dispatch] = useReducer(reducer, initialState);

  // Number of questions
  const numQuestions = userSetNumber <= 0 ? questions.length : userSetNumber;

  let maxPossiblePoints;
  if(userSetNumber > 0)
    maxPossiblePoints = questions.filter((_, index) => index < userSetNumber).reduce((point, cur, i) => point + cur.points, 0);
  else
    maxPossiblePoints = questions.reduce((point, cur, i) => point + cur.points, 0);

  useEffect(function(){
    try{
      async function getQuestions(){
        const res = await fetch("http://localhost:8000/questions");
        if(!res.ok) dispatch({type: "dataFailed"});

        const data = await res.json();

        dispatch({type: "dataReceived", payload: data});
      }
  
      getQuestions();
    }catch(error){
      throw new Error("Something went wrong");
    }
  }, []);

  return(
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {(status === "ready" || status === "timeSet") && <Input value={userSetNumber} dispatch={dispatch} />}
        {status === "timeSet" && <StartScreen numQuestions={numQuestions} dispatch={dispatch} />}
        {
          status === "active" && 
            (
              <>
              <Progress index={index} numQuestions={numQuestions} points={points} maxPossiblePoints={maxPossiblePoints} answer={answer} />
              <Question question={questions[index]} dispatch={dispatch} answer={answer} key={index} />
              <Footer>
                <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
                  <NextButton dispatch={dispatch} answer={answer} index={index} numQuestions={numQuestions} />
              </Footer>
              </>
            )
        }
        {status === "finished" && <FinishScreen points={points} maxPossiblePoints={maxPossiblePoints} highscore={highscore} dispatch={dispatch} answerTab={answerTab} />}
      </Main>
    </div>
  );
}