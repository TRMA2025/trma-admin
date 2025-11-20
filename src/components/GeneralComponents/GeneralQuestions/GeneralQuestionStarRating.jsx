import React, { useState } from "react";

const GeneralQuestionStarRating = ({ question, find_answer }) => {
  const [hoverFill, setHoverFill] = useState(null);

  return (
    <div className="star">
      {[...Array(question.scaling_max)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            key={index}
            // onMouseEnter={() => setHoverFill(ratingValue)}
            // onMouseLeave={() => setHoverFill(null)}
            // onClick={() => handleRating(ratingValue)}
            style={{
              background:
                ratingValue <= (hoverFill || find_answer?.answer_statement)
                  ? "#B59D4E"
                  : "transparent",
              textAlign: "center",
            }}
            className="FaStar-button mb-2"
          >
            <p
              className="FaStar mb-0"
              style={{
                color:
                  ratingValue <= (hoverFill || find_answer?.answer_statement)
                    ? "#ffffff"
                    : "#B59D4E",
              }}
            >
              {ratingValue}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default GeneralQuestionStarRating;
