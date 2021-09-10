export const getWidgetName = (type) => {
    return type.indexOf('wc_') === -1 ? `${type}-widget` : type;
}