import { useState, useEffect } from "react";

export default function CountdownTimer() {

  const targetDate = new Date("2026-10-17T00:00:00").getTime(); // set target date for the countdown

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const now = new Date().getTime();
    const difference = targetDate - now;

    let time = {};

    if (difference > 0) {
      time = {
        months: Math.floor(difference / (1000 * 60 * 60 * 24 * 30)),
        days: Math.floor((difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    } else {
      time = {
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return time;
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // helper to format numbers to always show two digits (05 instead of 5)
  const FormatNumber = (num) => {
    return num < 10 ? `0${num}` : num;
  }

  return (
    <div className="flex justify-center my-12">                                           {/* outer wrapper for the countdown block */}
      <div className="flex gap-4 items-start">                                         {/* inner wrapper for the five time units */}
        <div className="flex flex-col items-center"><span className="timer-digit">{FormatNumber(timeLeft.months)}</span> <small className="timer-label">MONTHS</small></div> <span className="timer-digit mt-1">:</span>
        <div className="flex flex-col items-center"><span className="timer-digit">{FormatNumber(timeLeft.days)}</span> <small className="timer-label">DAYS</small></div> <span className="timer-digit mt-1">:</span>
        <div className="flex flex-col items-center"><span className="timer-digit">{FormatNumber(timeLeft.hours)}</span> <small className="timer-label">HOURS</small></div> <span className="timer-digit mt-1">:</span>
        <div className="flex flex-col items-center"><span className="timer-digit">{FormatNumber(timeLeft.minutes)}</span> <small className="timer-label">MINUTES</small></div> <span className="timer-digit mt-1">:</span>
        <div className="flex flex-col items-center"><span className="timer-digit">{FormatNumber(timeLeft.seconds)}</span> <small className="timer-label">SECONDS</small></div>
      </div>
    </div>
  );
}