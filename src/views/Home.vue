<template>
  <div class="home">

    <div class="tooltip">
      <h1>😷 How bad will COVID-19 become? 😷</h1>
      <span class="tooltiptext">How will the different nations handle COVID-19? Here you can submit guesses on how many <br>
      cases a country will have at a certain point in time and check it again to see how your predictions performed!</span>
    </div>
    <div class="main">
      <CoronaWeel/>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import CoronaWeel from '@/components/CoronaWeel.vue'

export default {
  name: 'Home',
  components: {
    CoronaWeel
  }
}
</script>

<style scoped>
  .main {
    padding-bottom: 1em;
  }
  h1 {
    text-align: center !important;
  }
</style>
