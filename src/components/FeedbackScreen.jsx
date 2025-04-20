import React from 'react';

const FeedbackScreen = ({ results, onRestart }) => {
  const score = results.filter(r => r.isCorrect).length * 10;

  return (
    <div className="feedback-screen">
      <h2 className='feedback-heading'>Sentence Construction</h2>
      <p className="score">Overall Score: {score}</p>
      <p className="summary">
        While you correctly formed several sentences, there are a couple of areas where improvement is needed.
        Pay close attention to sentence structure and word placement.
      </p>

      {results.map((res, i) => (
        <div key={i} className={`result-card ${res.isCorrect ? 'correct' : 'incorrect'}`}>
          <p><strong>Prompt {i + 1}</strong></p>
          <p><strong>Your response:</strong> {res.userAnswer.join(' ')}</p>
          <p><strong>Correct answer:</strong> {res.correctAnswer.join(' ')}</p>
        </div>
      ))}

      <button className="dashboard-btn" onClick={onRestart}>Go to Dashboard</button>
    </div>
  );
};

export default FeedbackScreen;
