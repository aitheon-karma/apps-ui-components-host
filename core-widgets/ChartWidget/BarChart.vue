<script>
import { Bar, mixins } from 'vue-chartjs';

export default {
  mixins: [mixins.reactiveProp],
  extends: Bar,
  props: ['chartData', 'options'],
  mounted() {
    this.renderChart(this.chartData, this.options);
  },
}
</script>

<style>
</style>
