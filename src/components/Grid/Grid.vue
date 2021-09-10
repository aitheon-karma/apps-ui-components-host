<template>
  <div class="flex-column-container"
       v-if="view">
    <viewer-header :view="view"
                   v-if="application.showHeader && (application.isToolbarVisible || application.isEditable)"/>
    <grid-layout v-if="view.layout"
                 @layout-updated="layoutUpdateHandler"
                 :layout.sync="showHidden ? hiddenWidgetsView.layout : view.layout"
                 :col-num="view.cols"
                 :row-height="gridConfig.rowHeight"
                 :is-resizable="!showHidden && application.isEditing"
                 :is-draggable="!showHidden && application.isEditing"
                 :vertical-compact="gridConfig.verticalCompact"
                 :margin="gridConfig.margin">
      <grid-item v-for="item in showHidden ? hiddenWidgetsView.layout : view.layout"
                 class="flex-column-container draggable"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i"
                 :key="item.i">
        <div class="grid__item">
          <div class="grid-item__remove"
               v-if="application.isEditing">
            <div class="icon icon--dynamic"
                 :class="{
                    'icon--close': !showHidden,
                    'icon--plus': showHidden,
                    'icon--gold': showHidden,
                 }"
                 @click="showHidden ? widgetAddHandler(item) : removeWidgetFromViewHandler(item)"></div>
          </div>
          <component class="grid__widget"
                     v-if="application.registeredWidgetTypes.includes(item.type)"
                     :is="getWidgetName(item.type)"
                     @widgetChange="widgetChangeHandler"
                     :config-json="widgetsConfigs[item.id]"
                     :value-json="widgetsValues[item.id]"></component>
          <div v-else class="flex-column-container no-widget">
            {{ item.type | capitalize }} is not supported
          </div>
        </div>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import ViewerHeader from '@/components/ViewerHeader/ViewerHeader';
import { GridItem, GridLayout } from 'vue-grid-layout';
import { mapGetters, mapState } from 'vuex';
import { cloneObject } from '@/shared/helpers/cloneObject';
import { socketIoMessages } from '@/shared/constants/socket-io.messages';
import { stringifyObject } from '@/shared/helpers/stringifyObject';
import { parseJSON } from '@/shared/helpers/parseJSON';
import { capitalize } from '@/shared/helpers/capitalize';
import { getWidgetName } from '@/shared/helpers/getWidgetName';
import { VIEW_MODE } from '@/shared/constants/viewMode';

export default {
  name: 'Grid',
  components: {
    ViewerHeader,
    GridLayout,
    GridItem,
  },
  created() {
    this.getWidgetName = getWidgetName;
  },
  data() {
    let view = {};
    if (this.activeView) {
      view = cloneObject(this.activeView);
    }
    return {
      view,
    };
  },
  computed: {
    ...mapState([
      'application',
      'gridConfig',
      'widgetsConfigs',
      'widgetsValues',
      'hiddenWidgetsView',
    ]),
    ...mapGetters([
      'activeView',
    ]),
    storeLayout() {
      return this.activeView;
    },
    showHidden() {
      return this.application.viewMode === VIEW_MODE.HIDDEN;
    }
  },
  methods: {
    layoutUpdateHandler(layout) {
      if (this.showHidden) {
        return;
      }
      this.$store.dispatch('updateViewAction', cloneObject({
        ...this.activeView,
        layout,
      }));
    },
    widgetChangeHandler(event) {
      const [data] = event.detail;
      if (data.componentId) {
        this.$socket.emit(socketIoMessages.update_value, {
          id: data.componentId,
          value: data.value,
        });
      }
    },
    removeWidgetFromViewHandler(item) {
      this.$store.dispatch('hideWidgetAction', {
        widgetId: item.id,
      });
    },
    widgetAddHandler(widget) {
      if (this.application.isEditing) {
        this.$store.dispatch('showWidgetAction', { widgetId: widget.id }).then(() => {
          if (!this.hiddenWidgetsView.layout.length) {
            this.$store.dispatch('setApplicationDataAction', { viewMode: VIEW_MODE.STANDARD });
          }
        });
      }
    },
  },
  watch: {
    storeLayout(val, oldVal) {
      // copy state to prevent mutation
      const valString = stringifyObject(val);
      const oldValString = stringifyObject(oldVal);
      if (valString === oldValString) {
        return;
      }

      this.view = parseJSON(valString);

      //  get values history from node-red storage
      this.$socket.emit(socketIoMessages.ui_replay_state);
    }
  },
  filters: {
    capitalize,
  }
};
</script>

<style lang="scss">
.draggable {
  touch-action: none;
  transition: .35s ease;
  box-sizing: border-box;
}

.grid {
  &__item {
    position: relative;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    background: var(--color-base-black);

    .item__remove {
      opacity: 0;
      pointer-events: none;
    }

    &:hover {
      .item__remove {
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  &__widget {
    @extend .flex-column-container;

    height: 100%;
  }
}

.grid-item {
  &__remove {
    position: absolute;
    right: 18px;
    top: 18px;
  }
}

.no-widget {
  align-items: center;
  justify-content: center;
  color: var(--color-base-gray);
  font-size: 12px;
}
</style>
