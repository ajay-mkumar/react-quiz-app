function Progress({index, numQuestion, points, maxPoints, answer}) {
    return(
        <header className="progress">
            <p>
                Question <strong>{index +1 }</strong> /{numQuestion}
            </p>
            <progress max={numQuestion} value={index + (answer !== null)} />
            <p>
                <strong>{points}</strong> / {maxPoints}
            </p>
        </header>
    )
}

export default Progress;