import React, { useEffect, useState } from 'react'; // React import
import '../styles/game.css'; // CSS import
// FontAwesome icons
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Components
import Alert from './Alert';

// Game Interface
interface GameInterface {
  err: errorType;
  appRange: rangeType;
}
// Rrange object type
type rangeType = {
  min: number;
  max: number;
};
// Error object type
type errorType = {
  error: boolean;
  msg: string;
};

const Game: React.FC<GameInterface> = ({ err, appRange }) => {
  // useStates
  const [number, setNumber] = useState<number>(50); // State for the guessed number
  const [range, setRange] = useState<rangeType>(appRange); // State for the guess range
  const [counter, setCounter] = useState<number>(1); // State to count the amount of guesses
  const [direction, setDirection] = useState<string>(''); // State for higher / lower button
  const [stage, setStage] = useState<number>(0); // State to control the game stages

  // useEffect for the localstorage (aka user did a refresh to the tab)
  // prettier-ignore
  useEffect(() => {
    if (localStorage.getItem('number')) { // If there's localstorage stage item use the saved data
      setNumber(parseInt(JSON.parse(localStorage.getItem('number') as string)));
      const localStorageRange = JSON.parse(localStorage.getItem('range') as string);
      setRange((range) => ({ min: localStorageRange.min, max: localStorageRange.max }));
      setCounter(parseInt(JSON.parse(localStorage.getItem('counter') as string)));
      setStage(parseInt(JSON.parse(localStorage.getItem('stage') as string)));
    }
  }, []);

  // Control the number guess
  const changeGuess = async (str: string) => {
    if (counter < 7) {
      // Max amount of guesses is 7 then check for it
      setDirection(() => str); // Update direction state to the button press (higher or lower);
      if (str === 'lower') setRange((range) => ({ ...range, max: number }));
      // Pressed the lower button -> Update range max only
      else setRange((range) => ({ ...range, min: number })); // Pressed the higher button -> Update range min only
      setCounter((counter) => counter + 1); // Increase the amount of guesses by 1;
    }
  };

  // Find the middle number
  const middleNumber = (obj: rangeType, str: string): number => {
    if (str === 'lower') return Math.floor((obj.max + obj.min) / 2); // Round up if number is higher
    return Math.ceil((obj.max + obj.min) / 2); // Round down if number is lower
  };

  // Update number guess every range update
  useEffect(() => {
    setNumber(() => middleNumber(range, direction)); // Update number's state on range change
    localStorage.setItem('number', number.toString()); // Store to localstorage the 'number'
    localStorage.setItem('range', JSON.stringify(range)); // Store to localstorage the 'range'
    localStorage.setItem('counter', counter.toString()); // Store to localstorage the 'counter'
  }, [range]);

  // Update game stage stats
  useEffect(() => {
    if (stage === 3) {
      // Reset game states to default
      setNumber(() => 50);
      setRange((range) => ({ ...range, min: 0, max: 100 }));
      setCounter(() => 1);
    }
    localStorage.setItem('stage', stage.toString()); // Store to localstorage the 'stage'
  }, [stage]);

  // Render
  // prettier-ignore
  return (
    <>
      {!err.error ? ( // If there's no erros
        <div id="gameContainer"> {/* Game Container */}
          <h1>Guess the number game</h1>
          {stage === 0 || stage === 3 ? ( // stage 0 = First load; stage 3 = Localstorage load
            <div id="stage0"> {/* First stage */}
              <h3>Think of a number between 1 and 100</h3>
              <button id="startButton" onClick={() => setStage((stage) => 1)}> {/* Start the game button aka move to stage 1 */}
                I thought of a number
              </button>
            </div>
          ) : stage === 1 ? ( // Stage 1 elements aka main guess page
            <div id="stage1"> {/* Second stage */}
              <h3>
                I guess your number is <br></br>
                <span>{number}</span>
              </h3>
              <button id="lowerButton" onClick={() => changeGuess('lower')}> {/* Lower number guessed BUTTON */}
                My number is lower <FontAwesomeIcon icon={faArrowDown}></FontAwesomeIcon>
              </button>
              <button id="higherButton" onClick={() => changeGuess('higher')}> {/* Higher number guessed BUTTON */}
                My number is higher <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>
              </button>
              <br></br>
              <button id="finishButton" onClick={() => setStage((stage) => 2)}> {/* Found number BUTTON */}
                That's my number!
              </button>
            </div>
          ) : ( // Stage 2 elements aka final page
            <div id="stage2"> {/* Third stage (last) */}
              <h3>I've guessed your number in {counter} tries</h3>
              <button id="restartButton" onClick={() => setStage((stage) => 3)}> {/* Restart the game BUTTON */}
                Play Again
              </button>
            </div>
          )
        }
        </div>
      ) : ( // There are some errors - display error component
        <Alert msg={err.msg} />
      )}
    </>
  );
};

export default Game;
