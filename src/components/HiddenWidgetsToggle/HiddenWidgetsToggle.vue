<template>
  <div class="hidden-widgets-toggle"
       :class="{ 'hidden-widgets-toggle--mobile': application.viewMode === viewModes.STANDARD && !isDesktop }">
    <button class="button button--small button--ghost hidden-widgets-toggle__button"
            @click="switchModeHandler"
            :class="{ 'button--outlined': outlined }">
      <span class="icon icon icon--gold icon--chevron-left margin-right--8"
            v-if="application.viewMode === viewModes.HIDDEN"></span>
      {{ text }}
    </button>

    <div class="hidden-widgets-toggle__count"
         v-if="application.viewMode === viewModes.HIDDEN && !isDesktop">
      Unused widgets: {{ hiddenWidgetsLength }}
    </div>
  </div>
</template>

<script>
import { VIEW_MODE } from '@/shared/constants/viewMode';
import { LAYOUTS } from '@/shared/constants/layouts';

export default {
  name: 'HiddenWidgetsToggle',
  data() {
    return {
      viewModes: VIEW_MODE,
    };
  },
  methods: {
    switchModeHandler() {
      const viewMode = this.application.viewMode === VIEW_MODE.STANDARD
          ? VIEW_MODE.HIDDEN
          : VIEW_MODE.STANDARD;

      this.$store.dispatch('setApplicationDataAction', { viewMode });
    },
  },
  computed: {
    application() {
      return this.$store.state.application;
    },
    outlined() {
      return this.application.layoutType.key !== LAYOUTS.DESKTOP.key && this.application.viewMode === VIEW_MODE.STANDARD;
    },
    hiddenWidgetsLength() {
      const hidden = this.$store.state.hiddenWidgetsView;
      if (hidden?.layout) {
        return hidden.layout.length;
      }
      return 0;
    },
    text() {
      let text = this.application.viewMode === VIEW_MODE.STANDARD
          ? 'go to unused widgets'
          : 'back to all widgets';

      if (this.application.viewMode === VIEW_MODE.STANDARD && this.application.layoutType.key === LAYOUTS.DESKTOP.key) {
        text = text + ` (${this.hiddenWidgetsLength})`;
      }

      return text;
    },
  },
  props: ['isDesktop'],
}
</script>

<style lang="scss">
.hidden-widgets-toggle {
  flex-direction: column;

  &--mobile {
    .button {
      width: 100%;
      justify-content: center;
      height: 36px;
    }
  }

  &__button {
    min-height: 28px !important;
  }

  &__count {
    color: var(--color-base-white);
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.2px;
    padding-top: 24px;
    margin-bottom: -14px;
  }
}
</style>
