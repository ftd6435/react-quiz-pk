import { createContext, useContext, useEffect, useReducer } from "react";
import { callbackReducer, answerTab } from "./callbackReducer";

const QuestionsContext = createContext();

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

function QuestionProvider({ children }) {
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highscore,
      secondsRemaining,
      userSetNumber,
    },
    dispatch,
  ] = useReducer(callbackReducer, initialState);

  // Number of questions
  const numQuestions = userSetNumber <= 0 ? questions.length : userSetNumber;

  let maxPossiblePoints;
  if (userSetNumber > 0)
    maxPossiblePoints = questions
      .filter((_, index) => index < userSetNumber)
      .reduce((point, cur, i) => point + cur.points, 0);
  else
    maxPossiblePoints = questions.reduce(
      (point, cur, i) => point + cur.points,
      0
    );

  useEffect(function () {
    try {
      async function getQuestions() {
        const res = await fetch("http://localhost:8000/questions");
        if (!res.ok) dispatch({ type: "dataFailed" });

        const data = await res.json();

        dispatch({ type: "dataReceived", payload: data });
      }

      getQuestions();
    } catch (error) {
      throw new Error("Something went wrong");
    }
  }, []);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        status,
        index,
        answer,
        points,
        highscore,
        secondsRemaining,
        userSetNumber,
        numQuestions,
        maxPossiblePoints,
        answerTab,
        dispatch,
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
}

function useQuestions() {
  const context = useContext(QuestionsContext);
  if (context === undefined)
    throw new Error(
      "You have used the questionContext out of the ContextProvider :)"
    );
  return context;
}

export { QuestionProvider, useQuestions };
