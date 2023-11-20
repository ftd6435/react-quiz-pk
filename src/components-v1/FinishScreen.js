function FinishScreen({ points, maxPossiblePoints, highscore, dispatch, answerTab }) {
  const percentage = (points / maxPossiblePoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
    <p className="result">
      {emoji} You scored {points} out of {maxPossiblePoints} ({Math.ceil(percentage)}%)
    </p>
    <p className="highscore">
        (Highscore: {highscore} points)
    </p>

    <button className="btn btn-ui" onClick={() => dispatch({type: "restart"})}>Start Over</button>
  
    <div className="options">
      {
        answerTab.map((answer, index) => 
        <>
          <button className="btn btn-option" key={index}>{answer.question}</button>
          <p>Chosen: {answer.chosen} {answer.chosen === answer.correct ? '✅' : '❌'}</p>
          <p>Correct: {answer.correct} ✅</p>
        </>
        )
      }
    </div>
    </>
  );
}

export default FinishScreen;
