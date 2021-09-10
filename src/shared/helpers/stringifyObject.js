export const stringifyObject = obj => {
  if (obj) {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      console.warn(e.message);
    }
  }
  return '';
}
