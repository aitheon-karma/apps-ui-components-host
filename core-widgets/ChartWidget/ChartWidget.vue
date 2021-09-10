<template>
  <div v-if="config"
       class="widget">
    <div class="widget__chart">
      <div class="chart__header">
        {{ config.label }}
      </div>
      <template v-if="dataCollection">
        <template v-if="config.look === 'line'">
          <line-chart class="chart__content"
                      :chart-data="dataCollection"
                      :options="options"></line-chart>
        </template>
        <template v-else-if="config.look === 'bar'">
          <bar-chart class="chart__content"
                     :chart-data="dataCollection"
                     :options="options"></bar-chart>
        </template>
        <template v-else-if="config.look === 'pie'">
          <pie-chart class="chart__content"
                     :chart-data="dataCollection"
                     :options="options"></pie-chart>
        </template>
        <div class="chart__empty" v-else>
          No data to display
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';
import { get } from '@/shared/helpers/get';
import { parseJSON } from '@/shared/helpers/parseJSON';
import { JSONProp } from '../shared/JSONProp';

export default {
  components: {
    LineChart,
    BarChart,
    PieChart
  },
  data() {
    const config = parseJSON(this.configJson);
    return {
      config,
      value: parseJSON(this.valueJson)?.data,
      dataCollection: null,
      series: [],
      options: {
        spanGaps: true,
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: config?.legend === 'true',
        }
      },
      datasets: {},
      defaultDatasetName: 'Data',
      labels: [],
      isTimeSeries: false,
    };
  },
  mounted() {
    if (this.config.look === 'line') {
      this.setLineChartOptions();
    }
    this.parseChartData();
  },
  methods: {
    setLineChartOptions() {
      this.options = Object.assign(this.options, {
        scales: {
          xAxes: [{
            gridLines: {
              color: '#303030',
            },
          }],
          yAxes: [{
            gridLines: {
              color: '#303030',
            },
            ticks: {
              min: this.config?.ymin ? +this.config?.ymin : undefined,
              max: this.config?.ymax ? +this.config?.ymax : undefined
            }
          }]
        }
      });
    },
    parseChartData() {
      const {
        data = null,
        labels,
        series,
      } = get(this.value, '[0].values', {});
      if (!data) {
        return;
      }

      const dataIsArray = Array.isArray(data);
      this.isTimeSeries = this.checkIsTimeSeries(data);

      if (this.isTimeSeries) {
        if (dataIsArray) {
          // setting datasets
          const xAxes = this.parseData(data, series);
          xAxes.forEach(([label, storage]) => {
            this.labels.push(label);
            this.iterateDatasets(key => {
              const value = storage.get(key);
              this.datasets[key]?.data?.push(value ? value : null);
            });
          });
        } else {
          // partial update
          const { x, y } = data;
          if (!this.labels.includes(x)) {
            this.labels.push(x);
          }
          const seriesKey = series ? series : this.defaultDatasetName;
          this.iterateDatasets(key => {
            this.datasets[key]?.data?.push(key === seriesKey ? y : null);
          });

          if (this.labels.length > 200) {
            this.labels = this.labels.splice(-100);
            this.iterateDatasets(key => {
              this.datasets[key].data = this.datasets[key].data?.splice(-100);
            });
          }
        }

      } else {
        this.labels = labels;
        series?.forEach((s, i) => {
          this.datasets[s] = {
            data: data[i],
            label: s,
          };

          if (this.config.look === 'line') {
            this.datasets[s].borderColor = this.config.colors[i];
          } else {
            this.datasets[s].borderColor = '#1a1a1a';
            this.datasets[s].backgroundColor = this.config.colors[i];
          }
        });
      }
      this.setChartData();
    },
    iterateDatasets(executor) {
      Object.keys(this.datasets).forEach(executor.bind(this));
    },
    parseData(data, series) {
      const xAxes = new Map();

      data.forEach((values, i) => {
        values = values.slice(-100);
        let currentSeries = series[i] ? series[i] : this.defaultDatasetName;
        this.datasets[currentSeries] = {
          data: [],
          label: currentSeries,
          borderColor: this.config.colors[i],
        };

        values.forEach(value => {
          const storage = xAxes.get(value.x);
          if (!storage) {
            const seriesStorage = new Map();
            seriesStorage.set('timestamp', value.x);
            seriesStorage.set('index', i);
            seriesStorage.set(currentSeries, value.y);
            xAxes.set(value.x, seriesStorage);
          } else {
            storage.set(currentSeries, value.y);
          }
        });
      });

      return Array.from(xAxes).sort((prev, next) => prev[0] - next[0]);
    },
    setChartData() {
      let labels = this.labels;
      if (this.isTimeSeries) {
        labels = this.getTimeSeriesLabels(labels);
      }

      this.dataCollection = {
        labels,
        datasets: Object.values(this.datasets),
        series: Object.keys(this.datasets),
      };
    },
    checkIsTimeSeries(data = {}) {
      let testItem;
      if (data?.length) {
        testItem = data[0];
        if (testItem?.length) {
          testItem = testItem[0];
        }
      } else {
        testItem = data;
      }

      return Object.prototype.hasOwnProperty.call(testItem, 'x') && Object.prototype.hasOwnProperty.call(testItem, 'y');
    },
    getTimeSeriesLabels(labels) {
      return labels.map(l => {
        const date = new Date(l);
        return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      });
    },
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
        this.parseChartData();
      }
    },
  },
  props: {
    configJson: JSONProp,
    valueJson: JSONProp,
  },
}
;
</script>

<style lang="scss">
.widget {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #1f1f1f;

  &__chart {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
    width: 100%;
    padding: 24px;
    box-sizing: border-box;
  }
}

.chart {
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

  &__content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    max-height: calc(100% - 28px - 24px);
    width: 100%;
  }

  &__empty {
    font-size: 12px;
    color: #7e7e7e;
    display: flex;
    align-items: center;
    flex-grow: 1;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
