import { registerWidget } from '@/shared/helpers/registerWidget';
import store from '@/store';
import { get } from './get';

export const registerViewWidgets = async viewId => {
  const { state } = store;
  const view = state.views.find(v => v.id === viewId);

  const registered = state.application.registeredWidgetTypes;

  const viewWidgets = [...get(view, 'layout', []), ...get(view, 'hidden', [])];

  const widgetsToRegister = [];

  for (const widget of viewWidgets) {
    if (!registered.includes(widget.type) && !widgetsToRegister.includes(widget.type)) {
      widgetsToRegister.push(widget.type);
    }
  }

  const result = await Promise.all(widgetsToRegister.map(async w => await registerWidget(w)));
  return result.filter(w => !!w);
};
