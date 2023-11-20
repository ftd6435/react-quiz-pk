import { useQuestions } from "../contexts/QuestionsContext";
import Option from "./Options";

function Question() {
  const { questions, index} = useQuestions();

  const question = questions[index];

  return (
    <div>
      <h4>{question.question}</h4>
      <Option question={question} key={question} />
    </div>
  );
}

export default Question;
