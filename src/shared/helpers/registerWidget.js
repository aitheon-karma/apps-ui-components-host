import axios from 'axios';
import { getWidgetName } from '@/shared/helpers/getWidgetName';


export const registerWidget = async widgetType => {
  const scriptURL = `widgets/${getWidgetName(widgetType)}.min.js`;

  const isAlreadyRegistered = !!document.querySelector(`script[src='${scriptURL}']`);
  if (isAlreadyRegistered) {
    return widgetType;
  }

  const loadWidget = () => new Promise(resolve => {
    const script = document.createElement('script');
    script.onload = () => resolve(widgetType);
    script.src = scriptURL;
    document.body.appendChild(script);
  });

  try {
    await axios.head(scriptURL, { baseURL: '' });
    await loadWidget();
    return widgetType;
  } catch (e) {
    return undefined;
  }
};
