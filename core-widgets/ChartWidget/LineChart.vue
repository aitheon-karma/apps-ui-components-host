<script>
import { Line, mixins } from 'vue-chartjs';

export default {
  mixins: [mixins.reactiveProp],
  extends: Line,
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
}
</script>

<style>
</style>
