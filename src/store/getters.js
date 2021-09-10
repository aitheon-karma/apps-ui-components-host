const getters = {
  activeView: state => {
    const { activeViewId, views } = state;
    return views.find(v => v.id === activeViewId);
  },
  getWidgetById: state => widgetId => {
    return state.widgetsConfigs[widgetId];
  },
  getLayoutByType: state => layoutType => {
    return state.layouts.find(({ type }) => type === layoutType);
  }
};

export default getters;
