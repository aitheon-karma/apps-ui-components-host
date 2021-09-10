/**
 *
 * @param widget
 * @param isHidden
 * @returns {{x: *, y: *, id: *, rows: *, cols: *, widgetType: *}}
 */
const getElement = (widget, isHidden) => {
  const element = {
    id: widget.id,
    widgetType: widget.type,
    cols: widget.w,
    rows: widget.h,
    x: widget.x,
    y: widget.y
  };
  if (isHidden) {
    element.meta = { hidden: true };
  }

  return element;
};

/**
 * @param views
 */
export const getElementsFromViews = views => views.reduce((elements, view) => ([
  ...elements,
  ...view.layout.map(w => getElement(w)),
  ...view.hidden.map(w => getElement(w, true)),
]), []);
