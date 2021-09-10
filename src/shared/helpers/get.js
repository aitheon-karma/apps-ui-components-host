/**
 * @param object
 * @param path
 * @param defaultValue
 * @returns {null|*}
 */
export const get = (object, path, defaultValue = null) => {
  try {
    const keys = Array.isArray(path) ? path : (path || '').split(/[[\]\].]/g).filter(k => k);
    const result = (object || {})[keys[0]];
    if (result && keys.length > 1) {
      return get(result, keys.slice(1), defaultValue);
    }
    return result !== undefined ? result : defaultValue;
  } catch (e) {
    console.warn(e);
    return defaultValue;
  }
};
