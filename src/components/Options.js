import { useQuestions } from "../contexts/QuestionsContext";

function Option({ question }) {
  const { dispatch, answer } = useQuestions();

  const hasAnswered = answer !== null;

  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} 
                            ${
                              hasAnswered
                                ? index === question.correctOption
                                  ? "correct"
                                  : "wrong"
                                : ""
                            }`}
          onClick={() => dispatch({ type: "newAnswer", payload: index })}
          key={index}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Option;
