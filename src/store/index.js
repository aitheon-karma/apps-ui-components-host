import Vue from 'vue';
import Vuex from 'vuex';
import getters from '@/store/getters';
import actions from '@/store/actions';
import mutations from '@/store/mutations';
import { LAYOUTS } from '@/shared/constants/layouts';
import { VIEW_MODE } from '@/shared/constants/viewMode';

Vue.use(Vuex);

const state = {
  views: [],
  hiddenWidgetsView: null,
  widgetsConfigs: {},
  widgetsValues: {},
  activeViewId: null,
  gridConfig: {
    margin: [24, 24],
    rowHeight: 75,
    verticalCompact: false,
  },
  application: {
    id: undefined,
    isEditable: false,
    isEditing: false,
    isToolbarVisible: false,
    layoutType: LAYOUTS.DESKTOP,
    viewMode: VIEW_MODE.STANDARD,
    registeredWidgetTypes: [],
    showSidePanel: false,
    showHeader: true,
  },
  layouts: [],
  environment: {
    organizationId: null,
    token: null,
    baseHost: null,
    projectId: null,
    graphNodeId: null,
    fullUrl: null
  },
  isLoading: true,
  layoutSnapshot: null,
}

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict: true,
});

export default store;
