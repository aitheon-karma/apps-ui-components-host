<script>
import { Pie, mixins } from 'vue-chartjs';

export default {
  mixins: [mixins.reactiveProp],
  extends: Pie,
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
}
</script>

<style>
</style>
