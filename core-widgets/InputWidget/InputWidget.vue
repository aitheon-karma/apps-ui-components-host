<template>
  <div class="input-widget"
       v-if="config">
    <input-component @inputChange="widgetChangeHandler"
                     :value="config.value"
                     :placeholder="config.label"
                     :value-change-delay="300"/>
  </div>
</template>

<script>
import InputComponent from '@/components/Input/Input';
import { parseJSON } from '@/shared/helpers/parseJSON';
import { JSONProp } from "../shared/JSONProp";

export default {
  components: {
    InputComponent,
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
      const { id } = this.config;
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
@import "core-widgets/shared/widget.scss";

.input-widget {
  @extend .widget;
  padding: 0 24px;
}
</style>
