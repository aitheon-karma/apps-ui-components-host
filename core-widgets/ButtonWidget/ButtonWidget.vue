<template>
  <div class="button-widget"
       v-if="config">
    <button class="button-widget__button button-widget__button--contained button-widget__button--medium"
            v-on:click="widgetChangeHandler">
      {{ config.label }}
    </button>
  </div>
</template>

<script>
import { parseJSON } from '@/shared/helpers/parseJSON';
import { JSONProp } from '../shared/JSONProp';

export default {
  data() {
    return {
      config: parseJSON(this.configJson),
      value: parseJSON(this.valueJson),
    };
  },
  methods: {
    parseProp(newProp, oldProp) {
      if (newProp === oldProp)
        return;

      return parseJSON(newProp);
    },
    widgetChangeHandler() {
      const { id } = this.config;
      this.$emit('widgetChange', {
        componentId: id,
        value: this.value,
      });
    },
  },
  watch: {
    configJson(newProp, oldProp) {
      this.config = this.parseProp(newProp, oldProp);
    },
    valueJson(newProp, oldProp) {
      const value = this.parseProp(newProp, oldProp);
      if (value) {
        this.value = value?.data;
      }
    },
  },
  props: {
    configJson: JSONProp,
    valueJson: JSONProp,
  },
};
</script>

<style lang="scss">
.button-widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;

  &__button {
    display: inline-flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    color: #1a1a1a;
    text-transform: uppercase;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.5px;
    font-size: 12px;
    line-height: 13px;
    border: none;
    box-shadow: none;
    outline: none !important;
    border-radius: 2px;
    transition: 0.2s;

    &:hover {
      cursor: pointer;
    }

    &--medium {
      min-height: 36px;
      padding: 10px 16px;
    }

    &--contained {
      background-color: #dcbc65;

      &:hover {
        background-color: #dcbc65;
      }
    }
  }
}
</style>
