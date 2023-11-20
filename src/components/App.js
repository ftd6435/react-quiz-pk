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
import { QuestionProvider, useQuestions } from "../contexts/QuestionsContext";

export default function App() {
  return (
    <QuestionProvider>
      <div className="app">
        <Header />
        <Main>
          <MainContent />
        </Main>
      </div>
    </QuestionProvider>
  );
}

function MainContent() {
  const { status } = useQuestions();

  return (
    <>
      {status === "loading" && <Loader />}
      {status === "error" && <Error />}
      {(status === "ready" || status === "timeSet") && <Input />}
      {status === "timeSet" && <StartScreen />}
      {status === "active" && (
        <>
          <Progress />
          <Question />
          <Footer>
            <Timer />
            <NextButton />
          </Footer>
        </>
      )}
      {status === "finished" && <FinishScreen />}
    </>
  );
}
