import React, { useEffect } from 'react';
import { ChangeEvent, useState } from "react";
import { Gpio } from "onoff";
import Button from '@mui/material/Button';
import { Input, Typography } from "@mui/material";

const pin = new Gpio(4, 'out'); // use GPIO pin 4, and specify that it is output
const toggle_high_low = true;

function App() {
  const [duration, setDuration] = useState<number>(5);
  // const [pinNumber, setPinNumber] = useState<number>(4);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [pinState, setPinState] = useState<boolean>(false);

  useEffect(() => {
    console.log("switched pin 4 to " + (pinState ? 'on' : 'off'));
    const realPinState = pinState !== toggle_high_low;
    pin.writeSync(realPinState ? 0 : 1);
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
        {/* <div>
          <Typography>Pin-Nummer: </Typography>
          <Input value={pinNumber} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setPinNumber(e.target.value ? parseInt(e.target.value) : -1);
          }} /> 
        </div> */}
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
