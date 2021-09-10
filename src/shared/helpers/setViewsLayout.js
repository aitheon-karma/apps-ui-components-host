import { getWidgetsLayout } from '@/shared/helpers/getWidgetsLayout';
import { VIEW_TYPE } from '@/shared/constants/viewType';
import { LAYOUTS } from '@/shared/constants/layouts';

/**
 *
 * @param views
 * @param layoutType
 * @param apiLayout
 * @returns {*}
 */
export const setViewsLayout = (views, layoutType, apiLayout) => {
  const layoutKey = layoutType.orientation === VIEW_TYPE.LANDSCAPE
    ? layoutType.landscapeFallback
    : layoutType.key;

  const cols = LAYOUTS[layoutKey].cols;

  return views.map(view => {
    const { hidden, layout } = getWidgetsLayout(view.layout, cols, apiLayout?.elements);
    return {
      ...view,
      hidden,
      cols,
      layout,
    };
  });
};
