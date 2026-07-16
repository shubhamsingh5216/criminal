import { useEffect, useState } from 'react';

export default function useCurrentTime() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timerId);
  }, []);

  return time;
}
