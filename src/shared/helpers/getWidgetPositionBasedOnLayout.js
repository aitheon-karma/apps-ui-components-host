/**
 *
 * @param layout
 * @returns {{x: number, y: *}}
 */
export const getWidgetPositionBasedOnLayout = (layout = []) => {
  const y = layout.reduce((result, item) => {
    if (item.y + item.h > result) {
      return item.y + item.h;
    }
    return result;
  }, 0);

  return {
    x: 0,
    y,
  };
};
