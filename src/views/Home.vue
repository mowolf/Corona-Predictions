<template>
  <div class="home">
    <div class="tooltip">
      <h1>😷 How bad will COVID-19 become? 😷</h1>
      <span class="tooltiptext">How will the different nations handle COVID-19? Here you can submit guesses on how many <br>
      cases a country will have at a certain point in time and check it again to see how your predictions performed! <br>
      You can also share your link with friends, they will see your bets only with your link!<br>
      You need to increase the numbers of cases above the current level to submit.</span>
    </div>
    <div class="main">
      <CoronaWeel/>
    </div>

    <div class="share">
      <h2>Share the link with your friends to send them your predictions!</h2>
      <button class="button" @click="getLink">Get Link of current state!</button>
      <p>Dont forget to regenerate link if you changed your predictions.</p>
      <p v-if="active" class="link">
        {{this.link}}
      </p>
    </div>

    <div class="footer">
      <h2>Stay Safe!</h2>

      <p>Data Used: <a href="https://github.com/pomber/covid19">https://github.com/pomber/covid19</a></p>
      <p>Code for this dashboard: <a href="https://github.com/mowolf/Corona-Predictions">https://github.com/mowolf/Corona-Predictions</a></p>
      Made out of boredom in quarantine.

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
  },
  methods: {
    getLink() {
      this.link = window.location.href;
      this.active = true;
    }
  },
  data: () => ({
    link: '',
    active: false,
  }),
}
</script>

<style scoped>
  .link {
    background-color: #2c3e50;
    text-align: center;
    padding: 1em;
    font-size: 2em;
    color: #b90e1f;
  }
  .share {
    margin: 2em;
    padding: 4em;
    border-color: #2c3e50;
    border-style: dashed;
  }
  .button {
    background-color: #2c3e50;
  }
  .main {
    padding-bottom: 1em;
  }
  h1, h2, p{
    text-align: center !important;
  }
  .footer {
    text-align: center;
    background-color: #233446;
    padding: 20px;
  }
  a {
    color: #e7e6e9;
  }

</style>
