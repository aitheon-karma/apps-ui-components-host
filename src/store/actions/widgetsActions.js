import { registerViewWidgets } from '@/shared/helpers/registerViewWidgets';
import { getWidgetPositionBasedOnLayout } from '@/shared/helpers/getWidgetPositionBasedOnLayout';
import { registerWidget } from '@/shared/helpers/registerWidget';
import { getViewByWidgetId } from '@/shared/helpers/getViewByWidgetId';

export default {
  registerViewWidgetsAction: async (context, viewId) => {
    const widgetsToRegister = await registerViewWidgets(viewId);

    if (widgetsToRegister.length) {
      context.commit('setApplicationData', {
        registeredWidgetTypes: [...context.state.application.registeredWidgetTypes, ...widgetsToRegister],
      });
    }
  },
  showWidgetAction: async (context, { widgetId }) => {
    const { state, dispatch, commit } = context;

    const view = getViewByWidgetId(state.views, widgetId);
    const layout = [...view.layout];
    const hidden = [...view.hidden];

    const widgetIndex = hidden.findIndex(w => w.id === widgetId);
    if (widgetIndex >= 0) {
      const [widgetToAdd] = hidden.splice(widgetIndex, 1);
      const widgetPosition = getWidgetPositionBasedOnLayout(layout);
      layout.push({
        ...widgetToAdd,
        ...widgetPosition,
      });

      if (!state.application.registeredWidgetTypes.includes(widgetToAdd.type)) {
        const isRegistered = await registerWidget(widgetToAdd.type);
        if (isRegistered) {
          commit('setApplicationData', {
            registeredWidgetTypes: [...state.application.registeredWidgetTypes, widgetToAdd.type],
          });
        }
      }

      const updatedView = {
        ...view,
        layout,
        hidden,
      };

      await dispatch('updateViewAction', updatedView);
      await dispatch('setHiddenWidgetsLayoutAction');
    }
  },
  hideWidgetAction: (context, { widgetId }) => {
    const view = getViewByWidgetId(context.state.views, widgetId);
    const layout = [...view.layout];
    const hidden = [...view.hidden];

    const widgetIndex = layout.findIndex(w => w.id === widgetId);
    if (widgetIndex >= 0) {
      const [widgetToHide] = layout.splice(widgetIndex, 1);
      hidden.push(widgetToHide);
      const updatedView = {
        ...view,
        layout,
        hidden,
      };

      context.dispatch('updateViewAction', updatedView);
      context.dispatch('setHiddenWidgetsLayoutAction');
    }
  },
};
