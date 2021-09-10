<template>
  <div id="app"
       class="flex-column-container">

    <empty-page v-if="isApplicationEmpty"
                class="fullscreen"/>

    <div class="fullscreen-loader"
         v-else-if="$store.state.isLoading">
      <loader/>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';
import { LAYOUTS } from '@/shared/constants/layouts';
import Loader from '@/components/Loader/Loader';
import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import { windowMessages } from '@/shared/constants/windowMessages';
import EmptyPage from '@/components/EmptyPage/EmptyPage'

export default {
  name: 'App',
  components: {
    Loader,
    EmptyPage
  },
  created() {
    window.addEventListener('message', this.windowMessageHandler);

    const {
      edit = 'false',
      layout = LAYOUTS.DESKTOP.key,
      showSidePanel = 'true',
      showHeader = 'true',
    } = this.$route.query;
    this.$store.dispatch('setApplicationDataAction', {
      isEditable: edit === 'true',
      layoutType: LAYOUTS[layout],
      showSidePanel: showSidePanel === 'true',
      showHeader: showHeader === 'true',
    }).then(() => {
      const { application } = this.$store.state
      this.isCreatorsStudioView = application.isEditable && application.showSidePanel;

      if (!this.isCreatorsStudioView) {
        document.body.classList.add('overflow-hidden');
      }
    });
  },
  data() {
    return {
      isCreatorsStudioView: false,
    };
  },
  methods: {
    windowMessageHandler(event) {
      const { data } = event;
      switch (data.type) {
        case windowMessages.credentials:
          if (data.payload) {
            this.$store.dispatch('setEnvironmentAction', data.payload);
            this.setAxiosConfig();
            this.setWebSocketConfig();
          }
          break;
        case windowMessages.start_edit:
          this.$store.dispatch('startEditAction');
          break;
        case windowMessages.dismiss_edit:
          this.$store.dispatch('dismissEditAction');
          break;
        case windowMessages.save_layout:
          this.$store.dispatch('saveActiveLayout');
          break;
        case windowMessages.switch_view:
          if (data.payload?.id) {
            this.$store.dispatch('setActiveViewAction', data.payload.id);
          }
          break;
      }
    },
    setAxiosConfig() {
      const { environment } = this.$store.state;
      axios.defaults.baseURL = `https://${environment.baseHost}`;
      axios.interceptors.request.use(config => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `JWT ${environment.token}`;
        }
        if (!config.headers['organization-id']) {
          config.headers['organization-id'] = environment.organizationId;
        }
        if (!environment.graphNodeId && environment.fullUrl) {
          config.headers['X-Requested-With'] = 'creators-studio';
        } else {
          delete config.headers['X-Requested-With'];
        }
        return config;
      });
    },

    setWebSocketConfig() {
      const { graphNodeId, fullUrl, baseHost } = this.$store.state.environment;
      const url = new URL(fullUrl || `https://${baseHost}`);
      const path = (fullUrl && url.pathname !== '/') ? url.pathname : '';
      const socketOptions = {
        path: `${graphNodeId ? `/graphs/${graphNodeId}` : path}/ui/socket.io`,
        transports: ['websocket']
      };
      Vue.use(new VueSocketIO({
        connection: SocketIO(url.origin, socketOptions),
        vuex: {
          store: this.$store,
          actionPrefix: 'socket__',
          mutationPrefix: 'socket__'
        },
      }));
    },
  },
  computed: {
    isApplicationEmpty() {
      const { isLoading, widgetsConfigs } = this.$store.state;
      return !isLoading && !Object.keys(widgetsConfigs)?.length
    }
  },
  destroyed() {
    window.removeEventListener('message', this.windowMessageHandler);
  }
}
</script>

<style lang="scss">
.fullscreen-loader {
  @extend .flex-column-container;
  @extend .center;
  @extend .fullscreen;
}

.fullscreen {
  background: var(--color-mineshaft-gray);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
}
</style>
