<template>
  <div class="home">

    <div class="tooltip">
      <h1>How will the corona numbers evolve?</h1>
      <span class="tooltiptext">How will the different nations handle COVID-19? Here you can submit guesses on how many <br>
      cases a country will have at a certain point in time and check it again to see how your predictions performed!</span>
    </div>
    <CoronaWeel/>

    <Graph input-chart-data="chart"/>

  </div>
</template>

<script>
// @ is an alias to /src
import CoronaWeel from '@/components/CoronaWeel.vue'
import Graph from "../components/Graph";

export default {
  name: 'Home',
  components: {
    CoronaWeel,
    Graph
  }
}
</script>

<style scoped>
  h1 {
    text-align: center !important;
  }
</style>
