<template>
  <div class="widget"
       v-if="config">
    <div class="widget__content">
      <div class="content__label"
           v-if="config.label">
        {{ config.label | capitalize }}:
      </div>
      <div class="content__text">{{ value }}</div>
    </div>
  </div>
</template>

<script>
import { capitalize } from '@/shared/helpers/capitalize';
import { parseJSON } from '@/shared/helpers/parseJSON';
import { JSONProp } from '../shared/JSONProp';

export default {
  data() {
    return {
      config: parseJSON(this.configJson),
      value: parseJSON(this.valueJson)?.data,
    };
  },
  filters: {
    capitalize,
  },
  methods: {
    parseProp(newProp, oldProp) {
      if (newProp === oldProp)
        return;

      return parseJSON(newProp);
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
@import "core-widgets/shared/widget";

.widget {
  &__content {
    display: flex;
    align-items: baseline;
  }
}

.content {
  &__label {
    color: #ffffff;
    font-size: 14px;
    font-weight: normal;
    letter-spacing: 0.2px;
    line-height: 20px;
    padding-right: 16px;
  }

  &__text {
    max-width: 100px;
    color: #7e7e7e;
    font-size: 12px;
  }
}
</style>
