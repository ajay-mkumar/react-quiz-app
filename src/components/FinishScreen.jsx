function FinishScreen({ points, maxPoints, highScore, dispatch }) {
  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥳";
  if (percentage >= 80 && percentage < 100) emoji = "👌";
  if (percentage >= 50 && percentage < 80) emoji = "👏";
  if (percentage >= 0 && percentage < 50) emoji = "👍";
  if (percentage === 0) emoji = "😔";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> you scored{" "}
        <strong>
          {points} out of {maxPoints}({Math.ceil(percentage)}%)
        </strong>
      </p>
      <p className="highscore">Highscore: {highScore}</p>

      <button className="btn btn-ui" onClick={() => dispatch({type: "restart"})}>Restart</button>
    </>
  );
}

export default FinishScreen;
