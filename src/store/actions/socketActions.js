import { parseApplicationData } from '@/shared/helpers/parseApplicationData';
import { createViews } from '@/shared/helpers/createViews';
import { setViewsLayout } from '@/shared/helpers/setViewsLayout';
import { windowMessages } from '@/shared/constants/windowMessages';
import { socketActions } from '@/shared/constants/socket-io.messages';

export default {
  initApplicationAction: async ({ dispatch, state, getters, commit }, data) => {
    try {
      const applicationData = parseApplicationData(data);
      await dispatch('setApplicationDataAction', applicationData);

      const applicationLayouts = await dispatch('getApplicationLayoutAction');
      await dispatch('setLayoutsAction', applicationLayouts.data);

      const { views, widgetsConfigs, widgetsValues } = createViews(data.menu);
      const layoutType = state.application.layoutType;
      const viewsWithLayout = setViewsLayout(views, layoutType, getters.getLayoutByType(layoutType.key));

      commit('setViews', viewsWithLayout);
      commit('setWidgets', widgetsConfigs);
      commit('setWidgetsValues', widgetsValues);

      if (views?.length) {
        let activeViewId;
        if (state.activeViewId) {
          const view = views.find(v => v.id === state.activeViewId);
          activeViewId = view ? view.id : views[0].id;
        } else {
          activeViewId = views[0].id;
        }
        if (activeViewId) {
          await dispatch('setActiveViewAction', activeViewId);
        }
        dispatch('setHiddenWidgetsLayoutAction');
      }
      await dispatch('sendViewsTabsMessageAction');

      await dispatch('sendMessageAction', {
        type: windowMessages.ui_components,
        data: {
          ok: !!Object.keys(widgetsConfigs).length,
        }
      });

      await dispatch('setLoadingAction', false);
    } catch (error) {
      await dispatch('setLoadingAction', false);
    }
  },
  [socketActions.ui_controls]: async function ({ state, dispatch }, data) {
    const { organizationId, baseHost, token } = state.environment;
    const unsubscribe = this.subscribeAction((action) => {
      if (action.type === 'setEnvironmentAction') {
        dispatch('initApplicationAction', data);
        unsubscribe();
      }
    });
    if (organizationId && baseHost && token) {
      unsubscribe();
      await dispatch('initApplicationAction', data);
    }
  },
  [socketActions.ui_control]: async (context, data) => {
    const tab = data.tab || data;
    if (tab) {
      const activeView = context.state.views.find(v => v.viewName === tab);
      if (activeView) {
        await context.dispatch('setActiveViewAction', activeView.id);
      }
    }
  },
  [socketActions.update_value]: (context, payload) => {
    context.commit('setWidgetValue', payload);
  },
  [socketActions.connect_error]: ({ dispatch }) => {
    dispatch('sendMessageAction', {
      type: windowMessages.socket_error,
      data: {
        socketError: true,
      }
    });
  },
  [socketActions.disconnect]: ({ dispatch }) => {
    dispatch('sendMessageAction', {
      type: windowMessages.socket_disconnected,
      data: {
        disconnected: true,
      },
    });
  },
};
