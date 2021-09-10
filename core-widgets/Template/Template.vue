<template>
  <div class="widget"
       v-if="config">
  </div>
</template>

<script>
// import { Bar } from 'vue-chartjs'
import { parseJSON } from '@/shared/helpers/parseJSON';
import { JSONProp } from '../shared/JSONProp';

export default {
  data() {
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
      const { id, value } = this.config;
      this.$emit('widgetChange', {
        componentId: id,
        value,
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
@import "core-widgets/shared/widget";
</style>
