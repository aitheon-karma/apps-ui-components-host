import { stringifyObject } from '@/shared/helpers/stringifyObject';
import { parseJSON } from '@/shared/helpers/parseJSON';

/**
 * @param object
 */
export const cloneObject = (object = {}) => {
  try {
    return parseJSON(stringifyObject(object));
  } catch (e) {
    console.error(e.message);
  }
  return null;
};
