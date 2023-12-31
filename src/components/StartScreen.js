import { useQuestions } from "../contexts/QuestionsContext";

function StartScreen()
{
    const {numQuestions, dispatch} = useQuestions();

    return(
        <div className="start">
            <h3>{numQuestions} questions to test your React Mastery</h3>
            <button className="btn btn-ui" onClick={() => dispatch({type: "start"})}>Let's Start</button>
        </div>
    );
}

export default StartScreen;