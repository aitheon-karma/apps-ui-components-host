<template>
  <div class="viewer-header"
       v-if="show">
    <div class="viewer-header__left">
      <hidden-widgets-toggle class="toggle-mode"
                             v-if="showHiddenWidgetsToggle"
                             :is-desktop="isDesktop"
                             :class="{
                               'margin-bottom--16': showNavTabs,
                               'toggle-mode--mobile': !isDesktop
                             }"/>
      <div class="nav-tabs"
           v-if="showNavTabs">
        <div class="nav-tabs__tab"
             :class="{ 'nav-tabs__tab--active': tab.id === view.id }"
             :key="tab.id"
             v-on:click="activeViewChangeHandler(tab.id)"
             v-for="tab in views">
          {{ tab.viewName }}
        </div>
      </div>
    </div>

    <div class="buttons"
         v-if="showEditButtons && !application.showSidePanel">
      <button class="button button--small button--ghost"
              @click="startEditHandler"
              v-if="!application.isEditing">
        edit widgets
      </button>
      <template v-else>
        <button class="button button--small button--ghost button--error margin-right--16"
                @click="dismissEditHandler">
          cancel
        </button>
        <button class="button button--small button--ghost"
                @click="saveLayoutHandler">
          save
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VIEW_TYPE } from '@/shared/constants/viewType';
import HiddenWidgetsToggle from '@/components/HiddenWidgetsToggle/HiddenWidgetsToggle';
import { VIEW_MODE } from '@/shared/constants/viewMode';
import { LAYOUTS } from '@/shared/constants/layouts';

export default {
  name: 'ViewerHeader',
  components: {
    HiddenWidgetsToggle
  },
  data() {
    return {
      viewTypes: VIEW_TYPE
    };
  },
  computed: {
    ...mapState([
      'application',
      'hiddenWidgetsView',
      'views'
    ]),
    activeView() {
      return this.$store.getters.activeView;
    },
    show() {
      return this.showHiddenWidgetsToggle || this.showNavTabs || this.showEditButtons
    },
    showNavTabs() {
      return this.isDesktop &&
          this.application.isToolbarVisible &&
          this.views.length > 1 &&
          this.application.viewMode !== VIEW_MODE.HIDDEN;
    },
    showHiddenWidgetsToggle() {
      return this.application.isEditing && (
          this.application.viewMode === VIEW_MODE.HIDDEN
          || this.hiddenWidgetsView?.layout?.length
      );
    },
    showEditButtons() {
      return this.isDesktop &&
          this.application.isEditable &&
          this.application.layoutType.orientation !== VIEW_TYPE.LANDSCAPE;
    },
    isDesktop() {
      return this.application.layoutType.key === LAYOUTS.DESKTOP.key;
    },
  },
  methods: {
    activeViewChangeHandler(viewId) {
      if (viewId && viewId !== this.view.id) {
        this.$store.dispatch('setActiveViewAction', viewId);
      }
    },
    startEditHandler() {
      this.$store.dispatch('startEditAction', {
        isEditing: true,
      });
    },
    dismissEditHandler() {
      this.$store.dispatch('dismissEditAction');
    },
    saveLayoutHandler() {
      this.$store.dispatch('saveActiveLayout');
    },
  },
  props: ['view']
}
</script>

<style lang="scss">
.viewer-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px 24px 0 24px;

  &__left {
    @extend .flex-column-container;
    align-items: flex-start;
  }
}

.nav-tabs {
  display: flex;

  &__tab {
    padding: 0 12px;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.2px;
    line-height: 20px;
    color: var(--color-base-gray);
    cursor: pointer;
    outline: none;
    transition: .2s ease-in-out;
    user-select: none;

    &:first-child {
      padding-left: 0;
    }

    &:hover,
    &--active {
      color: var(--color-primary);
    }

    &--disabled {
      pointer-events: none;
      cursor: default;
    }
  }
}

.buttons {
  display: flex;
  align-items: center;

  button {
    white-space: nowrap;
  }
}

.justify-end {
  justify-content: flex-end;
}

.toggle-mode {
  margin-left: -8px;

  &--mobile {
    margin-left: 0;
    display: flex;
    width: 100%;
    flex-grow: 1;
  }
}
</style>
