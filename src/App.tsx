import React, { useEffect } from 'react';
import { ChangeEvent, useState } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Button from '@mui/material/Button';
import { Input, Typography } from "@mui/material";

const toggle_high_low = true;
const socketUrl = 'ws://' + window.location.hostname + ':8088';

function App() {
  const [duration, setDuration] = useState<number>(5);
  // const [pinNumber, setPinNumber] = useState<number>(4);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [pinState, setPinState] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<Array<string>>([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory(messageHistory.concat(lastMessage.data));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage, setMessageHistory]);

  useEffect(() => {
    console.log("switching GPIO 4 to " + (pinState ? 'on' : 'off'));
    const realPinState = pinState !== toggle_high_low;
    sendMessage('{"gpio":"' + (realPinState ? 0 : 1) + '"}');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinState]);

  useEffect(() => {
    if (secondsLeft === 0) {
      setPinState(false);
    } else {
      runTimerFunc();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const runTimerFunc = () => {
    const _secondsLeft = secondsLeft - 1;
    setTimeout(() => setSecondsLeft(_secondsLeft), 1000);
  };

  const start = (seconds: number) => {
    setPinState(true);
    setSecondsLeft(seconds);
    runTimerFunc();
  }

  return (
    <div style={{background: 'lightgrey', height: "100vh", padding: 10}}>
        <Typography variant='h4'>MODZ Controller</Typography>
        <div>
          <Typography>Verbindung zu {socketUrl} - {readyState} - {connectionStatus} </Typography>
        </div>
        <div>
          <Typography>Drehdauer in Sekunden: </Typography>
          <Input value={duration} disabled={secondsLeft > 0} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setDuration(e.target.value ? parseInt(e.target.value)%10 : 0);
          }} /> 
        </div>
        <Button disabled={secondsLeft > 0} onClick={() => start(duration)}>Bestätigen { secondsLeft > 0 && <Typography> ({secondsLeft})</Typography> }</Button>
    </div>
  );
}

export default App; 
