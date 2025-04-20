import React from "react";
import fetchQuestions from "./utils/fetchQuestions";
import QuestionCard from "./components/QuestionCard";
import FeedbackScreen from "./components/FeedbackScreen";
import { ClipLoader } from "react-spinners"; // importing loader
import { FaCheckCircle } from "react-icons/fa"; // Importing the icon
import "./App.css";

class App extends React.Component {
  state = {
    questions: [],
    current: 0,
    selected: Array(4).fill(null),
    results: [],
    timeLeft: 30,
    showFeedback: false,
    isLoading: true, // New state to manage the loading screen
    showStartPage: false, // New state to show the start page after loading
  };

  async componentDidMount() {
    // a loading screen for 2 seconds
    setTimeout(async () => {
      const questions = await fetchQuestions();
      this.setState({ questions, isLoading: false, showStartPage: true });
    }, 2000); // Adjust the time as necessary
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startTimer = () => {
    this.timer = setInterval(() => {
      const { timeLeft, showFeedback } = this.state;
      if (showFeedback) {
        clearInterval(this.timer);
        return;
      }

      if (timeLeft > 0) {
        this.setState((prev) => ({ timeLeft: prev.timeLeft - 1 }));
      } else {
        this.handleNext();
      }
    }, 1000);
  };

  handleSelect = (option) => {
    const { selected } = this.state;
    const index = selected.findIndex((item) => item === null);
    if (index !== -1 && !selected.includes(option)) {
      const newSelected = [...selected];
      newSelected[index] = option;
      this.setState({ selected: newSelected });
    }
  };

  handleUnselect = (index) => {
    const newSelected = [...this.state.selected];
    newSelected[index] = null;
    this.setState({ selected: newSelected });
  };

  handleNext = () => {
    clearInterval(this.timer);

    const { questions, current, selected, results, showFeedback } = this.state;

    if (showFeedback || current >= questions.length) return;

    const q = questions[current];
    const isCorrect =
      JSON.stringify(q.correctAnswer) === JSON.stringify(selected);

    const newResult = {
      question: q.question,
      userAnswer: selected,
      correctAnswer: q.correctAnswer,
      isCorrect,
    };

    if (current + 1 < questions.length) {
      this.setState(
        {
          current: current + 1,
          selected: Array(4).fill(null),
          timeLeft: 30,
          results: [...results, newResult],
        },
        this.startTimer
      );
    } else {
      this.setState({
        results: [...results, newResult],
        showFeedback: true,
        selected: Array(4).fill(null), // Reset for safety
      });
    }
  };

  handleRestart = () => {
    this.setState(
      {
        current: 0,
        selected: Array(4).fill(null),
        results: [],
        timeLeft: 30,
        showFeedback: false,
      },
      this.startTimer
    );
  };

  handleQuit = () => {
    const confirmQuit = window.confirm(
      "Are you sure you want to quit the test?"
    );
    if (!confirmQuit) return;

    clearInterval(this.timer);

    const { questions, current, selected, results, showFeedback } = this.state;

    if (showFeedback || current >= questions.length) return;

    const currentQuestion = questions[current];
    const isCorrect =
      JSON.stringify(currentQuestion.correctAnswer) ===
      JSON.stringify(selected);

    const newResult = {
      question: currentQuestion.question,
      userAnswer: selected,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
    };

    this.setState({
      showFeedback: true,
      results: [...results, newResult],
      selected: Array(4).fill(null), // Reset selected answers for clarity
      current: questions.length, // Set current to the last question (or exit screen)
    });
  };

  handleStartChallenge = () => {
    this.setState({ showStartPage: false });
    this.startTimer(); // Start the game logic
  };

  renderLoadingView = () => (
    <div className="loading-screen">
      <ClipLoader color="#0b69ff" loading={true} size={50} />
    </div>
  );

  render() {
    const {
      questions,
      current,
      selected,
      timeLeft,
      showFeedback,
      results,
      isLoading,
      showStartPage,
    } = this.state;

    if (isLoading) {
      // Display loading screen with spinner
      return this.renderLoadingView();
    }

    if (showStartPage) {
      // Show start page after loading
      return (
        <div className="start-page">
          <div className="start-page-content">
            <h1>Sentence Construction Challenge</h1>
            <p>
              Complete sentences by placing the correct words in the blanks.
            </p>
            <p>You have 30 seconds for each question.</p>
            <ul>
              <li>
                <FaCheckCircle /> 10 challenging questions
              </li>
              <li>
                <FaCheckCircle /> 30-second timer for each question
              </li>
              <li>
                <FaCheckCircle /> Detailed feedback at the end
              </li>
            </ul>
            <button onClick={this.handleStartChallenge}>Start Challenge</button>
          </div>
        </div>
      );
    }

    if (showFeedback)
      return (
        <FeedbackScreen results={results} onRestart={this.handleRestart} />
      );

    if (questions.length === 0)
      return <div className="loading">Loading...</div>;

    const currentQuestion = questions[current];

    return (
      <div className="container">
        <div className="container-content">
          <div className="top-bar">
            <h2 className="top-bar-heading">Sentence Construction</h2>
            <div className="timer-box">
              <span>{timeLeft < 10 ? `0:0${timeLeft}` : `0:${timeLeft}`}</span>
              <button className="quit-btn" onClick={this.handleQuit}>
                Quit
              </button>
            </div>
          </div>

          <p className="instruction">
            Select the missing words in the correct order
          </p>

          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            selectedOptions={selected}
            onSelect={this.handleSelect}
            onUnselect={this.handleUnselect}
          />

          <button
            className="next-btn"
            onClick={this.handleNext}
            disabled={selected.includes(null) || showFeedback}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default App;
