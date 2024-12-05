import React, { useState, useEffect } from 'react';

const Timer = ({ eventOn }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = +new Date(eventOn) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <div key={interval} className="flex flex-col items-center">
        <span className="text-2xl font-bold text-red-600">{timeLeft[interval]}</span>
        <span className="text-xs text-gray-500">{interval}</span>
      </div>
    );
  });

  return (
    <div className="flex justify-between w-full">
      {timerComponents.length ? timerComponents : <span className="text-red-600 font-semibold">Event has started!</span>}
    </div>
  );
};

export default Timer;

