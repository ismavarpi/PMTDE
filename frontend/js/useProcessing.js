function useProcessing() {
  const [busy, setBusy] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  const perform = async (fn) => {
    setBusy(true);
    const start = Date.now();
    const interval = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      if (s >= 1) setSeconds(s);
    }, 1000);
    try {
      await fn();
    } finally {
      clearInterval(interval);
      setSeconds(0);
      setBusy(false);
    }
  };

  return { busy, seconds, perform };
}
