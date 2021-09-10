<template>
  <div class="widget"
       v-if="gaugeConfig">
    <div class="widget__gauge">
      <div class="gauge__header">
        {{ gaugeConfig.label }}
      </div>
      <vue-svg-gauge :start-angle="gaugeConfig.startAngle"
                     :end-angle="gaugeConfig.endAngle"
                     :value="gaugeValue"
                     :min="gaugeConfig.min"
                     :max="gaugeConfig.max"
                     :scale-interval="gaugeConfig.scaleInterval"
                     :separator-step="gaugeConfig.separatorStep"
                     :base-color="gaugeConfig.baseColor"
                     :use-shadows="gaugeConfig.useShadows"
                     :gauge-color="gaugeConfig.colors">
        <div class="gauge__value">
          {{ gaugeValue }}
        </div>
      </vue-svg-gauge>
    </div>
  </div>
</template>

<script>
import { VueSvgGauge } from '@furdakov/vue-gauge';
import { parseJSON } from '@/shared/helpers/parseJSON';
import { JSONProp } from '../shared/JSONProp';

export default {
  name: 'gauge-widget',
  created: function () {
    this.gaugeConfig = this.getGaugeConfig();
    this.value = this.parseProp(this.valueJson)?.data;
    this.gaugeValue = this.getValue();
  },
  components: {
    VueSvgGauge,
  },
  data: function () {
    return {
      baseColors: ['#e96058', '#dcbc65', '#67b231'],
      defaultGaugeConfig: {
        baseColor: '#2b2b2b',
        separatorStep: 0,
        startAngle: -120,
        endAngle: 120,
        scaleInterval: 0,
        min: 0,
        max: 100,
        useShadows: false,
      },
      gaugeConfig: null,
      value: null,
      gaugeValue: null,
    };
  },
  methods: {
    getGaugeConfig() {
      const config = parseJSON(this.configJson);
      const gaugeConfig = { ...this.defaultGaugeConfig };
      gaugeConfig.colors = this.getColors(config?.colors);

      if (config) {
        gaugeConfig.label = config.label;

        if (config?.range?.length && config.range.every(n => n === 0 || Number(n))) {
          gaugeConfig.min = config.range[0];
          gaugeConfig.max = config.range[1];
        }

      }
      return gaugeConfig;
    },
    getColors(configColors) {
      const offset = [0, 50, 100];
      const colors = configColors?.length ? configColors : this.baseColors;
      return colors.map((color, i) => ({
        offset: offset[i],
        color,
      }));
    },
    parseProp(newProp, oldProp) {
      if (newProp === oldProp)
        return;

      return parseJSON(newProp);
    },
    getValue() {
      const valueToNumber = Number(this.value);
      return !Number.isNaN(valueToNumber) ? valueToNumber : 0;
    },
  },
  watch: {
    configJson(newProp, oldProp) {
      this.config = this.parseProp(newProp, oldProp);
      this.getGaugeConfig();
    },
    valueJson(newProp, oldProp) {
      const value = this.parseProp(newProp, oldProp)?.data;
      if (!Number.isNaN(Number(value))) {
        this.value = value;
        this.gaugeValue = this.getValue(value);
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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1f1f1f;
  flex-direction: column;

  &__gauge {
    padding: 24px;
    max-height: 100%;
    display: flex;
    flex-grow: 1;
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
  }
}

.gauge {
  max-height: calc(100% - 24px * 2);
  flex-grow: 1;

  &__header {
    color: #ffffff;
    font-size: 10px;
    font-weight: normal;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding-bottom: 16px;
    border-bottom: 1px solid #383838;
    width: 100%;
    margin-bottom: 24px;
  }

  &__value {
    width: 100%;
    height: 50%;
    margin-top: 28%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #ffffff;
    font-size: 28px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }
}
</style>
