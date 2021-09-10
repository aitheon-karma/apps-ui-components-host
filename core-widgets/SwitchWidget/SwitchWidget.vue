<template>
  <div class="widget"
       v-if="config">
    <div class="widget__content">
      <div class="content__label"
           v-if="config.label">
        {{ config.label | capitalize }}
      </div>
      <label class="switch">
        <input class="switch__input"
               v-model="value"
               @change="widgetChangeHandler"
               type="checkbox"
               tabindex="1">
        <span class="switch__toggle"></span>
      </label>
    </div>
  </div>
</template>

<script>
import { parseJSON } from "@/shared/helpers/parseJSON";
import { capitalize } from "@/shared/helpers/capitalize";
import { JSONProp } from "../shared/JSONProp";

export default {
  data: function () {
    return {
      config: parseJSON(this.configJson),
      value: parseJSON(this.valueJson)?.data,
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
  filters: {
    capitalize,
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
.widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;

  &__content {
    display: flex;
    align-items: center;
  }
}

.content {
  &__label {
    max-width: 170px;
    color: #ffffff;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.2px;
    padding-right: 16px;
  }
}

.switch {
  position: relative;
  width: 28px;
  height: 12px;
  margin-bottom: 0;

  &:hover .switch__toggle::after {
    opacity: 1;
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: block;
    width: 48px;
    height: 32px;
    border-radius: 16px;
    z-index: 10;
    cursor: pointer;
  }

  &__input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  &__toggle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 6px;
    cursor: pointer;
    background-color: #454545;
    -webkit-transition: 0.4s;
    transition: 0.4s;

    &::before {
      content: "";
      position: absolute;
      left: -3px;
      bottom: -2px;
      display: block;
      height: 16px;
      width: 16px;
      border-radius: 50%;
      background-color: #7e7e7e;
      -webkit-transition: 0.4s;
      transition: 0.4s;
    }

    &::after {
      content: "";
      position: absolute;
      top: -10px;
      left: -11px;
      display: block;
      height: 32px;
      width: 32px;
      border-radius: 50%;
      background-color: rgba(#7e7e7e, 0.15);
      -webkit-transition: 0.4s;
      transition: 0.4s;
      opacity: 0;
    }
  }

  &__input:checked + &__toggle {
    background: #C29E3E;

    &::before {
      transform: translateX(18px);
      background-color: #DCBC65;
    }
  }

  &__input:checked + &__toggle::after {
    transform: translateX(18px);
    background-color: rgba(#DCBC65, 0.15);
  }

  &--disabled {
    > * {
      pointer-events: none !important;
    }

    opacity: 0.4;
    cursor: not-allowed !important;
  }
}
</style>
