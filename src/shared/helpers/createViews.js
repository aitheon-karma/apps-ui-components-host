import { getWidgetConfig } from "@/shared/helpers/getWidgetConfig";
import { stringifyObject } from "@/shared/helpers/stringifyObject";

/**
 * @param groups
 * @returns {Array}
 */
const flattenViewGroups = (groups) => {
  return groups.reduce((res, curr) => {
    return curr?.items?.length
      ? [...res, ...curr.items]
      : res;
  }, []);
}

/**
 * @param menu
 * @returns {{widgetsValues: {}, widgetsConfigs: {}, views}}
 */
export const createViews = menu => {
  let widgetsConfigsArray = [];
  const views = menu.sort((previous, next) => previous.order - next.order)
    .map(view => {
      const viewWidgets = flattenViewGroups(view.items);
      const widgets = viewWidgets.map(getWidgetConfig);
      widgetsConfigsArray.push(...widgets);

      return {
        viewName: view.header,
        id: view.id,
        layout: widgets.map(({ id, type }) => ({ id, type })),
      };
    });

  const widgetsConfigs = {};
  const widgetsValues = {};

  for (const widget of widgetsConfigsArray) {
    widgetsConfigs[widget.id] = stringifyObject(widget);
    widgetsValues[widget.id] = stringifyObject({ data: widget.value });
  }

  return { widgetsConfigs, widgetsValues, views };
};
