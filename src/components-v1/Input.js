function Input({value, dispatch})
{
    return(
        <>
        <h2>Welcome to The React Quiz!</h2>
        <h4>How many questions are you willing to answer over 15?</h4>
        <input type="number" className="input-ui" value={value} onChange={(e) => dispatch({type: "userSetNumber", payload: Number(e.target.value)})} />
        <h3>Set Your Timer</h3>
        <div className="difficulty-btn">
            <button className="btn btn-ui" onClick={() => dispatch({type: "userSettle", payload: 10})}>10s / Question</button>
            <button className="btn btn-ui" onClick={() => dispatch({type: "userSettle", payload: 20})}>20s / Question</button>
            <button className="btn btn-ui" onClick={() => dispatch({type: "userSettle", payload: 30})}>30s / Question</button>
        </div>
        </>
    );
}

export default Input;