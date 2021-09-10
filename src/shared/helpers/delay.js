export const delay = (delay = 0) => new Promise(resolve => {
  const timeout = setTimeout(() => {
    clearTimeout(timeout);
    resolve();
  }, delay);
});
