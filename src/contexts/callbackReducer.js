let answerTab = [];

function callbackReducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining:
          state.userSetNumber > 0
            ? state.userSetNumber * state.secsPerQuestion
            : state.questions.length * state.secsPerQuestion,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);

      answerTab[state.index] = {
        question: question.question,
        chosen: question.options[action.payload],
        correct: question.options[question.correctOption],
      };

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
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
      if (action.payload > state.questions.length)
        return { ...state, status: "error" };

      return {
        ...state,
        userSetNumber: action.payload,
      };
    case "userSettle":
      if (state.userSetNumber <= 0) return { ...state, status: "error" };

      return {
        ...state,
        status: "timeSet",
        secsPerQuestion: action.payload,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknown action");
  }
}

export { callbackReducer, answerTab };
