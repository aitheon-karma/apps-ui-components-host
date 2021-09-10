import { windowMessages } from '@/shared/constants/windowMessages';
import { VIEW_TYPE } from '@/shared/constants/viewType';
import { setViewsLayout } from '@/shared/helpers/setViewsLayout';
import { request, requestTypes } from '@/shared/helpers/request';
import { API_CORE } from '@/shared/constants/api';
import { getElementsFromViews } from '@/shared/helpers/getElementsFromViews';
import { VIEW_MODE } from '@/shared/constants/viewMode';
import { getWidgetsLayout } from '@/shared/helpers/getWidgetsLayout';
import { getHiddenWidgetsFromViews } from '@/shared/helpers/getHiddenWidgetsFromViews';

export default {
  setActiveViewAction: async (context, activeViewId) => {
    const view = context.state.views.find(v => v.id === activeViewId);
    if (view) {
      await context.dispatch('registerViewWidgetsAction', activeViewId);
      context.commit('setActiveView', activeViewId);

      await context.dispatch('sendMessageAction', {
        type: windowMessages.switch_view,
        data: {
          id: view.id,
          key: view.viewName,
          label: view.viewName,
        },
      });
    }
  },
  updateViewAction: (context, view) => {
    context.commit('updateView', view);
  },
  setLayoutsAction: (context, layouts) => {
    context.commit('setLayouts', layouts);
  },
  switchLayoutTypeAction: (context, layoutType) => {
    const layoutKey = layoutType.orientation === VIEW_TYPE.LANDSCAPE
      ? layoutType.landscapeFallback
      : layoutType.key;

    const newLayout = context.state.layouts.find(layout => layout.type === layoutKey);
    const updatedViews = setViewsLayout(context.state.views, layoutType, newLayout);
    context.commit('setViews', updatedViews);
    context.commit('setApplicationData', { layoutType });
  },
  getApplicationLayoutAction: async context => {
    const { projectId, graphNodeId } = context.state.environment;
    return await request(requestTypes.get, `${API_CORE}/node-layout/${projectId}${graphNodeId ? `?graphNodeId=${graphNodeId}` : ''}`);
  },
  saveActiveLayout: async ({ state, dispatch, getters }) => {
    await dispatch('setLoadingAction', true);
    const { views, application, environment } = state;
    const { graphNodeId, projectId } = environment;
    const elements = getElementsFromViews(views);
    const layout = getters.getLayoutByType(application.layoutType.key);
    const existingLayout = layout;
    const objectToSave = {
      elements,
      type: application.layoutType.key,
      graphNodeId,
      projectId,
      width: 0,
      height: 0,
    };
    if (existingLayout) {
      objectToSave._id = layout._id;
    }

    try {
      const layout = await request(
        existingLayout ? requestTypes.put : requestTypes.post,
        `${API_CORE}/node-layout/${projectId}`,
        objectToSave,
        graphNodeId ? { graphNodeId } : null,
      );
      if (layout.data && !existingLayout) {
        await dispatch('setLayoutsAction', [...state.layouts, layout.data]);
      }
    } catch (e) {
      console.error(e.message)
    }
    await dispatch('setApplicationDataAction', {
      isEditing: false,
      viewMode: VIEW_MODE.STANDARD,
    });
    await dispatch('setLoadingAction', false);
  },
  setLayoutShapshotAction: (context) => {
    context.commit('setLayoutShapshot', context.getters.activeView);
  },
  setHiddenWidgetsLayoutAction: async (context) => {
    const hiddenWidgets = getHiddenWidgetsFromViews(context.state.views);
    const cols = context.getters.activeView.cols;
    const { layout } = getWidgetsLayout(hiddenWidgets, cols);
    await context.commit('setHiddenWidgetsView', { layout, cols });
  },
  startEditAction: async (context) => {
    await context.dispatch('setLayoutShapshotAction');
    await context.dispatch('setApplicationDataAction', {
      isEditing: true,
    });
  },
  dismissEditAction: async (context) => {
    await context.dispatch('updateViewAction', context.state.layoutSnapshot);
    await context.dispatch('setApplicationDataAction', {
      isEditing: false,
      viewMode: VIEW_MODE.STANDARD,
    });
  },
}
