<template>
  <div class="dropdown-widget"
       v-if="config">
      <dropdown bind-label="label"
                bind-value="value"
                @dropdownChange="widgetChangeHandler"
                :value="config.value"
                :multiselect="config.multiple"
                :placeholder="config.place"
                :items="config.options" />
  </div>
</template>

<script>
import { parseJSON } from '@/shared/helpers/parseJSON';
import Dropdown from '@/components/Dropdown/Dropdown';
import { JSONProp } from '../shared/JSONProp';

export default {
  components: {
    Dropdown,
  },
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
    widgetChangeHandler(value) {
      this.$emit('widgetChange', {
        componentId: this.config.id,
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

.dropdown-widget {
  @extend .widget;
  padding: 0 24px;
}
</style>
