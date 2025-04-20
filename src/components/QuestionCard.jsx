import React from 'react';

const QuestionCard = ({ question, options, selectedOptions, onSelect, onUnselect }) => {
  const wordsInSentence = question.split('_____________');

  return (
    <div className="question-area">
      <div className="sentence">
        {wordsInSentence.map((part, i) => (
          <React.Fragment key={i}>
            {part}
            {i < selectedOptions.length && (
              selectedOptions[i] ? (
                <button onClick={() => onUnselect(i)} className="filled">
                  {selectedOptions[i]} 
                </button>
              ) : (
                <span className="blank">_______</span>
              )
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="options">
        {options
          .filter(opt => !selectedOptions.includes(opt))
          .map((opt, i) => (
            <button key={i} onClick={() => onSelect(opt)} className="option-btn">
              {opt}
            </button>
          ))}
      </div>
    </div>
  );
};

export default QuestionCard;
