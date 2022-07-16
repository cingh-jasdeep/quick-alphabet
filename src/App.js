import React, { useState, useEffect } from "react";

function App() {
  //possible values A-Z, Success!, Failure!
  const [currentAlphabet, setCurrentAlphabet] = useState("");
  //possible values time in milliseconds
  const [currentTime, setCurrentTime] = useState();
  //best time from local storage
  const [bestTime, setBestTime] = useLocalStorage("bestTime");
  //correct entries array
  const [currentEntries, setCurrentEntries] = useState([]);

  function randomAlphabet() {
    const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return upperLetters[Math.floor(Math.random() * upperLetters.length)];
  }

  useEffect(() => {
    // set on mount
    setCurrentAlphabet(randomAlphabet());
    setCurrentTime(0);
  }, []);

  return (
    <div>
      <div className="text-white text-center">
        <div className=" font-bold font-sans text mt-5">Type The Alphabet</div>
        <div className=" font-sans px-2 text-xs mt-3 leading-relaxed">
          Typing game to see how fast you type. Timer starts when you do :)
        </div>
        {/* add special graphic on success/failure */}
        <div className="mt-3 mx-3 bg-white rounded-lg px-2 py-6 text-5xl font-extrabold text-[#068d32]">
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
        <div className="cursor-text py-3 w-3/4 bg-[#f9f2e7] text-black font-bold">
          {currentEntries.length === 0 ? (
            <span className="opacity-70 ">Type Here</span>
          ) : (
            currentEntries
          )}
        </div>
        <div className="cursor-pointer py-3 w-1/4 bg-[#f1416c] text-white">
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
