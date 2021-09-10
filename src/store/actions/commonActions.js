import { windowMessages } from '@/shared/constants/windowMessages';
import { VIEW_MODE } from '@/shared/constants/viewMode';

export default {
  sendMessageAction: ({ state }, { type, data }) => {
    const { graphNodeId, projectId } = state.environment;
    window.parent.postMessage({
      type,
      payload: {
        graphNodeId,
        projectId,
        data,
      }
    }, '*');
  },
  setLoadingAction: (context, isLoading) => {
    context.commit('setLoading', isLoading);
  },
  setApplicationDataAction: async (context, data) => {
    if (data.layoutType) {
      await context.dispatch('switchLayoutTypeAction', data.layoutType);
    }
    if (Object.prototype.hasOwnProperty.call(data, 'isEditing')) {
      await context.dispatch('sendMessageAction', {
        type: windowMessages.edit_layout,
        data: {
          editing: data.isEditing
        },
      });
    }
    if (data.viewMode && data.viewMode === VIEW_MODE.HIDDEN) {
      await context.dispatch('setHiddenWidgetsLayoutAction');
    }
    context.commit('setApplicationData', data);
  },
  setEnvironmentAction: (context, data) => {
    context.commit('setEnvironment', data);
    context.dispatch('sendMessageAction', {
      type: windowMessages.initialized,
      data: true,
    });
  },
  sendViewsTabsMessageAction: ({ state, dispatch }) => {
    const viewsTabs = state.views.map(v => ({ label: v.viewName, id: v.id, key: v.viewName }));
    const data = {
      viewsTabs,
      showTabs: state.application.isToolbarVisible,
    };
    dispatch('sendMessageAction', {
      type: windowMessages.views_tabs,
      data,
    });
  },
};
