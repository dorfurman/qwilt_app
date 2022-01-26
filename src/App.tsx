import { useEffect, useState } from 'react';
import Game from './components/Game';
import Loader from './components/Loader';

type errorType = {
  // Error Type
  error: boolean; // True: there's an error; False: no errors;
  msg: string; // Error message
};

const App = () => {
  // useStates
  const [serverStatus, setServerStatus] = useState<boolean>(true); // Server status state -> true by default if there's error change to false
  const [appRange, setAppRange] = useState<{ min: number; max: number }>({ min: 0, max: 0 }); // Range state
  const [isLoading, setLoading] = useState<boolean>(true); // Loading state
  const [err, setError] = useState<errorType>({ error: false, msg: '' }); // Error state control
  // URL for server fetch
  const SERVER_URL: string = 'https://guessing-game-backend-v90sychixp46.runkit.sh/status'; // Server URL
  const RANGE_URL: string = 'https://guessing-game-backend-v90sychixp46.runkit.sh/range'; // Range URL
  // Server fetch
  const fetchServer = async () => {
    try {
      const serverResponse = await fetch(SERVER_URL); // Fetch server response
      const serverJson = await serverResponse.json(); // Fetch JSON format
      setServerStatus(serverJson.enabled); // Update state to the enabled boolean value
    } catch (e) {
      setError({ error: true, msg: 'ERROR server is disabled' }); // Set error
      setServerStatus(false); // Update state to disabled
    }
  };
  // Range fetch
  const fetchRange = async () => {
    try {
      const rangeResponse = await fetch(RANGE_URL); // Fetch range response
      const rangeJSON = await rangeResponse.json(); // Fetch JSON format
      setAppRange(() => rangeJSON); // JSON format available - update state
    } catch (e) {
      setError({ error: true, msg: 'Error fetching JSON data, checking server status...' }); // Set error
      setTimeout(async () => await fetchServer(), 1000); // Validate server response after 1 second
    }
  };
  // prettier-ignore
  // Fetch both server and range fetch
  const serverConnection = async () => {
    try {
      await fetchServer(); // Fetch server status
      if (serverStatus) await fetchRange(); // If server is enabled -> fetch range
      else setError({ error: true, msg: 'ERROR server is disabled' }); // Server status is disabled --> throw error
    } catch (e) {
      setError({ error: true, msg: 'ERROR with server connection' }); // Error caught -> throw error
    } finally {
      setLoading(false); // After all the requests are finished - stop loading
    }
  };
  // useEffect to check for servers status
  useEffect(() => {
    serverConnection();
  }, []);

  return (
    <div className="App">{isLoading ? <Loader /> : <Game err={err} appRange={appRange} />}</div>
  );
};

export default App;
