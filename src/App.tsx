import { useState } from "react";
import "./App.css";

function App() {
  const [counter, setCounter] = useState(59);
  return (
    <>
      <span className="countdown font-mono text-6xl">
        <span
          style={{ "--value": counter, "--digits": 2 } as React.CSSProperties}
          aria-live="polite"
          aria-label={counter.toString()}
        >
          {counter}
        </span>
      </span>
      <button onClick={() => setCounter(counter - 1)}>Decrementar</button>
    </>
  );
}

export default App;
