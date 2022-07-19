import React, { useEffect, useRef } from "react";
import useState from "react-usestateref";

function App() {
  //possible values A-Z, Success!, Failure!
  const [currentAlphabet, setCurrentAlphabet, currentAlphabetRef] =
    useState("");
  //possible values time in milliseconds
  const [currentTime, setCurrentTime, currentTimeRef] = useState(0);
  //best time from local storage
  const [bestTime, setBestTime] = useLocalStorage("bestTime");
  const bestTimeRef = useRef();
  bestTimeRef.current = bestTime;

  //correct entries array
  const [currentEntries, setCurrentEntries, currentEntriesRef] = useState([]);
  const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const [timerInterval, setTimerInterval, timerIntervalRef] = useState();

  function randomAlphabet() {
    return upperLetters[Math.floor(Math.random() * upperLetters.length)];
  }

  function startTimer() {
    setTimerInterval((timerInterval) => {
      if (timerInterval === undefined) {
        timerInterval = setInterval(function () {
          setCurrentTime((time) => time + 10);
        }, 10);
      }
      return timerInterval;
    });
  }

  function stopTimer() {
    setTimerInterval((timerInterval) => {
      clearInterval(timerInterval);
      return undefined;
    });
  }

  // add 0.5 to timer for wrong input
  function timerPenalty() {
    setCurrentTime((time) => time + 500);
  }

  function onReset() {
    setCurrentEntries([]);
    stopTimer();
    setCurrentTime(0);
    setCurrentAlphabet(randomAlphabet());
  }

  // callback for any keypress
  const onType = (event) => {
    const inputText = event.target.value;
    const keyPress = inputText[inputText.length - 1].toUpperCase();

    //filter key
    if (!upperLetters.includes(keyPress)) {
      //invalid key
      return;
    }

    const currAlphaUpper = currentAlphabetRef.current.toUpperCase();
    if (currAlphaUpper.includes("SUC") || currAlphaUpper.includes("FAIL")) {
      return;
    }

    if (currentEntriesRef.current.length === 0) {
      startTimer();
    }

    if (currAlphaUpper === keyPress) {
      //match
      setCurrentEntries((currentEntries) => [
        ...currentEntries,
        currAlphaUpper,
      ]);
      if (currentEntriesRef.current.length === 20) {
        stopTimer();

        // check high score
        if (
          bestTimeRef.current === undefined ||
          currentTimeRef.current < bestTimeRef.current
        ) {
          // success
          setCurrentAlphabet("Success!");
          setBestTime(currentTimeRef.current);
          bestTimeRef.current = currentTimeRef.current;
        } else {
          //failure
          setCurrentAlphabet("Failure!");
        }
      } else {
        setCurrentAlphabet(randomAlphabet());
      }
    } else {
      // not match
      timerPenalty();
    }
  };

  useEffect(() => {
    document.title = "Quick Alphabet";

    // set on mount
    setCurrentAlphabet(randomAlphabet());
    setCurrentTime(0);

    return function cleanup() {
      stopTimer();
    };
  }, []);

  return (
    <div>
      <div className="text-white text-center">
        <div className=" font-bold font-sans text mt-5">Type The Alphabet</div>
        <div className=" font-sans px-2 text-xs mt-3 leading-relaxed">
          Typing game to see how fast you type. Timer starts when you do :)
        </div>
        {/* add special graphic on success/failure */}
        <div
          className={`mt-3 mx-3 bg-white rounded-lg px-2 py-6 text-5xl font-extrabold text-[#068d32]${
            currentAlphabet.toUpperCase().includes("SUC")
              ? " bg-success"
              : currentAlphabet.toUpperCase().includes("FAIL")
              ? " bg-failure !text-red-500"
              : ""
          }`}
        >
          {currentAlphabet}
        </div>

        <div className="mt-9 text-xs">
          Time: {(currentTime / 1000).toFixed(3)}s
        </div>
        <div className="text-white/70 text-xs mt-3">
          my best time:{" "}
          {bestTime ? (bestTime / 1000).toFixed(2) + "s!" : "none yet!"}
        </div>
      </div>
      {/* footer */}
      <div className="flex fixed bottom-0 inset-x-0 w-screen text-center text-xs">
        {/* add opacity on placeholder */}
        {/* <div className="cursor-text py-3 w-3/4 bg-[#f9f2e7] text-black font-bold">
          {currentEntries.length === 0 ? (
            <span className="opacity-50 ">Type Here</span>
          ) : (
            currentEntries
          )}
        </div> */}
        <input
          type="text"
          placeholder="Type Here"
          onChange={onType}
          value={currentEntries.join("")}
          className=" outline-1 outline-slate-300 py-3 w-3/4 bg-[#f9f2e7] text-black text-center font-bold"
        />
        <div
          onClick={onReset}
          className="cursor-pointer py-3 w-1/4 bg-[#f1416c] text-white font-medium"
        >
          Reset
        </div>
      </div>
    </div>
    // bonus extra features
    // - add font
  );

  // Hook
  // https://usehooks.com/useLocalStorage/
  function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      if (typeof window === "undefined") {
        return initialValue;
      }
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
    return [storedValue, setValue];
  }
}

export default App;
