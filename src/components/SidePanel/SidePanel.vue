<template>
  <div class="side-panel">
    <div class="side-panel__title">
      Layouts
    </div>
    <div class="side-panel__section">
      <div class="section__content">
        <div class="layout__item"
             v-for="layout in layoutTypes"
             :class="{ 'layout__item--active': layout.key === layoutType.key, [ layout.key.toLowerCase() ] : true }"
             :key="layout.key"
             v-on:click="layoutTypeChangeHandler(layout)">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { LAYOUTS } from '@/shared/constants/layouts';
import { VIEW_TYPE } from '@/shared/constants/viewType';

export default {
  name: 'SidePanel',
  data() {
    return {
      layoutTypes: LAYOUTS,
    }
  },
  methods: {
    layoutTypeChangeHandler(layoutType) {
      if (layoutType.key !== this.layoutType.key || this.layoutType.orientation === VIEW_TYPE.PORTRAIT) {
        this.$store.dispatch('setApplicationDataAction', {
          layoutType,
        });
      }
    },
  },
  computed: {
    activeView() {
      return this.$store.getters.activeView;
    },
    application() {
      return this.$store.state.application;
    },
    layoutType() {
      return this.$store.state.application.layoutType;
    }
  },
}
</script>

<style lang="scss">
.side-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 13px;

  &__title {
    position: absolute;
    top: 8px;
    left: 16px;
    color: #fff;
    font-size: 24px;
    letter-spacing: 0px;
    line-height: 32px;
  }
}

.section {

  &__content {
    display: flex;
    justify-content: center;
  }
}

.layout {

  &__item {
    border-radius: 2px;
    text-transform: uppercase;
    color: var(--color-base-gray);
    cursor: pointer;
    user-select: none;
    width: 24px;
    height: 24px;
    margin: 0 12px;

    &.desktop {
      background: url('~@/assets/icons/desktop-mode-ic.svg') center center no-repeat;
    }

    &.mobile {
      background: url('~@/assets/icons/mobile-mode-ic.svg') center center no-repeat;
    }

    &.tablet {
      background: url('~@/assets/icons/tablet-mode-ic.svg') center center no-repeat;
    }

    &:hover,
    &--active {
      color: var(--color-primary);

      &.desktop {
        background: url('~@/assets/icons/desktop-active-mode-ic.svg') center center no-repeat;
      }

      &.mobile {
        background: url('~@/assets/icons/mobile-active-mode-ic.svg') center center no-repeat;
      }

      &.tablet {
        background: url('~@/assets/icons/tablet-active-mode-ic.svg') center center no-repeat;
      }
    }
  }
}

.widget {
  padding: 8px 8px 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  transition: .2s ease-in-out;
  cursor: pointer;

  &:hover {
    background: var(--color-lightcoal-gray);
  }

  &__left {
    display: flex;
    flex-direction: column;
  }

  &__label {
    font-size: 12px;
    color: var(--color-base-white);
  }

  &__type {
    font-size: 10px;
    color: var(--color-base-gray);
    text-transform: uppercase;
  }
}
</style>
