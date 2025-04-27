import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import Progress from "./components/Progress";
import NextButton from "./components/NextButton";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
const initialState = {
  questions: [],

  //"loading", "error", "ready", "active", "completed"
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: null,
};
const SECS_PER_QUES = 30;
function reducer(state, action) {
  switch (action.type) {
    case "dataLoading":
      return { ...state, status: "loading" };
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready"  };
    case "dataFailed":
      return { ...state, status: "error" };
    case "quizActive":
      return { ...state, status: "active", secondsRemaining: state.questions.length * SECS_PER_QUES };
    case "newAnswer":
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          question.correctOption === action.payload
            ? state.points + question.points
            : state.points,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "completed" : state.status,
      };
    case "finishQuiz":
      return {
        ...state,
        status: "completed",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return { ...initialState, questions: state.questions, status: "ready" };
    default:
      throw new Error("action unknown");
  }
}

function App() {
  const [{ questions, status, index, answer, points, highScore, secondsRemaining }, dispatch] =
    useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPoints = questions.length > 0 
  ? questions.reduce((prev, cur) => prev + (cur.points || 0), 0)
  : 0;


  useEffect(function () {
    async function fetchQuestions() {
      try {
        dispatch({ type: "dataLoading" });
        const response = await fetch(`https://react-quizzy-app.netlify.app/questions.json`);

        if (!response.ok) throw new Error("Something went wrong");

        const data = await response.json();

        dispatch({ type: "dataReceived", payload: data });
      } catch (err) {
        console.log(err);
        dispatch({ type: "dataFailed" });
      }
    }

    fetchQuestions();
  }, []);
  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestions}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              index={index}
              numQuestion={numQuestions}
              dispatch={dispatch}
              answer={answer}
            />

            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              {answer != null && (
                <NextButton
                  dispatch={dispatch}
                  index={index}
                  numQuestion={numQuestions}
                />
              )}
            </Footer>
          </>
        )}

        {status === "completed" && (
          <FinishScreen
            points={points}
            maxPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
