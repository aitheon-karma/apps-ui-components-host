import { getWidgetDefaultSize } from '@/shared/helpers/getWidgetDefaultSize';

/**
 *
 * @param cols
 * @returns {function(*, *=): {w: number, x: number, h: number, y: number}}
 */
const getWidgetLayoutFunc = cols => {
  let currentX = 0;
  let currentY = 0;
  let rowHeight = 0;

  return (widget, apiLayout) => {
    let result = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
    };

    if (apiLayout) {
       result.x = apiLayout.x;
       result.y = apiLayout.y;
       result.w = apiLayout.cols;
       result.h = apiLayout.rows;
    } else {
      const defaultWidgetSize = getWidgetDefaultSize(widget.type);
      result.w = defaultWidgetSize.w;
      result.h = defaultWidgetSize.h;
      result.x = currentX;
      result.y = currentY;

      if ((cols - currentX) < defaultWidgetSize.w) {
        result.x = currentX = 0;
        result.y = currentY = currentY + rowHeight;
        rowHeight = 0;
      } else {
        currentX += defaultWidgetSize.w;
        if (rowHeight < defaultWidgetSize.h) {
          rowHeight = defaultWidgetSize.h;
        }
      }
    }

    return result;
  };
};

/**
 *
 * @param items
 * @param columns
 * @param apiLayout
 * @returns {{layout: [], hidden: []}}
 */
export const getWidgetsLayout = (items, columns = 12, apiLayout = []) => {
  const getWidgetLayout = getWidgetLayoutFunc(columns);
  const layout = [];
  const hidden = [];

  items.forEach((item, i) => {
    const itemLayout = apiLayout.find(el => el.id === item.id);

    const widget = {
      i,
      id: item.id,
      type: item.type,
      ...getWidgetLayout(item, itemLayout),
    };

    if (itemLayout?.meta?.hidden) {
      hidden.push(widget);
    } else {
      layout.push(widget);
    }
  });

  return { layout, hidden };
};
