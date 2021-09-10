import { stringifyObject } from '@/shared/helpers/stringifyObject';

const mutations = {
  setViews: (state, views) => {
    state.views = views;
  },
  setWidgets: (state, widgets) => {
    state.widgetsConfigs = widgets;
  },
  setActiveView: (state, activeViewId) => {
    state.activeViewId = activeViewId;
  },
  setApplicationData: (state, data) => {
    state.application = {
      ...state.application,
      ...data,
    };
  },
  setEnvironment: (state, data) => {
    state.environment = data;
  },
  setLayouts: (state, layouts) => {
    state.layouts = layouts;
  },
  setLoading: (state, isLoading) => {
    state.isLoading = isLoading;
  },
  updateView: (state, updatedView) => {
    const views = [...state.views];
    const viewIndex = views.findIndex(v => v.id === updatedView.id);
    if (viewIndex >= 0) {
      views[viewIndex] = updatedView;
      state.views = views;
    }
  },
  updateWidget: (state, updated) => {
    if (updated.id) {
      state.widgetsConfigs[updated.id] = updated;
    }
  },
  setLayoutShapshot: (state, snapshot) => {
    state.layoutSnapshot = snapshot;
  },
  setWidgetValue: (state, { id, value }) => {
    state.widgetsValues[id] = stringifyObject({ data: value });
  },
  setWidgetsValues: (state, widgetsValues) => {
    state.widgetsValues = widgetsValues;
  },
  setHiddenWidgetsView: (state, hiddenWidgetsView) => {
    state.hiddenWidgetsView = hiddenWidgetsView;
  },
};

export default mutations;
