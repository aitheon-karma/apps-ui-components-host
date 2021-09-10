export const getWidgetConfig = widget => ({
  ...widget,
  type: widget.type,
  value: widget.value,
  id: widget.id,
  label: widget.label,
  order: widget.order,
  width: widget.width,
  look: widget.look,
  units: widget.units,
  colors: widget.colors,
  range: [widget?.min, widget?.max],
});
