export const parseJSON = JSONString => {
  let object = null;
  if (JSONString) {
    try {
      object = JSON.parse(JSONString);
    } catch (e) {
      console.warn(e.message);
    }
  }
  return object;
}
