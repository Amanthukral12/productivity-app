let timerId;

self.onmessage = function (e) {
  let { action, timer } = e.data;
  console.log(`Worker received: ${action}, timer: ${timer}`);

  if (action === "start") {
    clearInterval(timerId); // Clear any existing intervals
    timerId = setInterval(() => {
      timer -= 1;
      self.postMessage({ timer });
    }, 1000);
  } else if (action === "pause" || action === "reset") {
    clearInterval(timerId);
    if (action === "reset") {
      self.postMessage({ timer: 1500 });
    }
  }
};
