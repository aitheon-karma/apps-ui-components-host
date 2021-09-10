export const getViewByWidgetId = (views, widgetId) => {
  return views.find(view => {
    let widget = view?.hidden?.find(w => w.id === widgetId);
    if (!widget) {
      widget = view?.layout?.find(w => w.id === widgetId);
    }
    return !!widget;
  });
};
