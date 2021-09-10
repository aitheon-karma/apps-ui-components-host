/**
 * @param type
 * @returns {{minW: number, h: number, w: number, minH: number}}
 */
export const getWidgetDefaultSize = type => {
  let w;
  let h;
  let minH;
  let minW;
  switch (type) {
    case 'button':
    case 'switch':
    case 'text':
      w = 3;
      h = 1;
      minH = 1;
      minW = 2;
      break;
    case 'chart':
      w = 6;
      h = 3;
      minH = 3;
      minW = 4;
      break;
    default:
      w = h = 3;
      minH = minW = 2;
  }
  return { w, h, minH, minW };
}
