import socketActions from '@/store/actions/socketActions';
import viewActions from '@/store/actions/viewActions';
import widgetsActions from '@/store/actions/widgetsActions';
import commonActions from '@/store/actions/commonActions';

export default {
  ...socketActions,
  ...viewActions,
  ...widgetsActions,
  ...commonActions,
}
