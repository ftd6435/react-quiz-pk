import { useQuestions } from "../contexts/QuestionsContext";

function Error() {
  const { dispatch } = useQuestions();
  return (
    <>
      <p className="error">
        <span>💥</span> There was an error fecthing questions OR you may have
        forgotten setting the number of questions.
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Back to Settings
      </button>
    </>
  );
}

export default Error;
