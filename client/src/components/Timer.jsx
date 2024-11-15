
import React, { useState } from "react";
const Timer = ({eventOn}) => {
    const [days, setDays] = React.useState(0);
    const [hours, setHours] = React.useState(0);
    const [minutes, setMinutes] = React.useState(0);
    const [seconds, setSeconds] = React.useState(0);
  
     const deadline = eventOn;
    const getTime = () => {
      const time = Date.parse(deadline) - Date.now();    
  
      setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((time / 1000 / 60) % 60));
      setSeconds(Math.floor((time / 1000) % 60));
    };
  
    React.useEffect(() => {
      const interval = setInterval(() => getTime(deadline), 1000);
  
      return () => clearInterval(interval);
    }, []);
  
    return (
      <div  role="timer" className="bg-black text-white flex justify-center rounded-md p-2 text-xs gap-2">
        <div >
          <div >
            <p id="day" className="bg">{days < 10 ? "0" + days : days}</p>
            <span >Days</span>
          </div>
        </div>
        <div >
          <div>
            <p id="hour" className="bg">{hours < 10 ? "0" + hours : hours}</p>
            <span >Hours</span>
          </div>
        </div>
        <div >
          <div >
            <p id="minute" className="bg">{minutes < 10 ? "0" + minutes : minutes}</p>
            <span >Minutes</span>
          </div>
        </div>
        <div >
          <div>
            <p id="second" className="bg">{seconds < 10 ? "0" + seconds : seconds}</p>
            <span >Seconds</span>
          </div>
        </div>
      </div>
    );
  };

  export default Timer;