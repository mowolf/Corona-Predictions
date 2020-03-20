<template>
  <div class="el">

    <div class="warpper" v-for="data in coronaData">
      <div class="known-cases">
        <p>{{data[1][data[1].length-1]["confirmed"]}}</p>
      </div>
      <div class="country-el">
        <p>I think <h1>{{data[0]}}</h1> will have</p>
        <input type="number" v-model="bets[data[0]]" @change="checkBet">
        <p>cases in
        <label for="nums" >
        <select class="select-css" v-model="selectedNum" id="nums">
          <option disabled value=""># of</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
          <option>8</option>
          <option>9</option>
          <option>10</option>
        </select>
      </label>
        <label for="time">
          <select v-model="selectedTime" id="time" class="select-css">
            <option disabled value="">weeks or months</option>
            <option>day(s)</option>
            <option>week(s)</option>
            <option>month(s)</option>
          </select>
        </label></p>
      <button class="button">Submit</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'CoronaWeel',
  props: {
    // variables to give to component
  },
  data () {
    return {
      coronaData: {},
      bets: {},
      recent_msg: '',
      selectedTime: '',
      selectedNum: ''
    }
  },
  methods: {
    checkBet: function() {
        for (let i in this.coronaData) {
          const country = this.coronaData[i][0];
          const len = this.coronaData[i][1].length-1;
          if (this.coronaData[i][1][len]["confirmed"] > this.bets[country]) {
            this.bets[country] = this.coronaData[i][1][len]["confirmed"];

            this.recent_msg = "Bet adjusted to minimum of known cases."
            console.log(this.recent_msg)
          }
        }
      },
  },
  created() {
    fetch("https://pomber.github.io/covid19/timeseries.json").then(response => response.json())
            .then(data => {
              this.recent_msg = "Data loading..."
              let all=[];
              let latest={};
              for(let key in data){
                if (data.hasOwnProperty(key) && data[key][data[key].length-1]["confirmed"] >1000) {
                  all.push([key, data[key]]);
                  latest[key] = data[key][data[key].length-1]["confirmed"]
                }
              }

              all.sort(function(a, b) {
                return b[1][b[1].length - 1]["confirmed"] - a[1][a[1].length - 1]["confirmed"]
              });


              this.coronaData = all;
              this.bets = latest;
              // data["Argentina"].forEach(({ date, confirmed, recovered, deaths }) => console.log(`${date} active cases: ${confirmed - recovered - deaths}`))
            })
    // Get previous predictions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

a {
  color: #b90e1f;
}
.el {
  display: flex;
  overflow: auto;
  -ms-overflow-y: hidden;
  overflow-y: hidden;
}
.warpper {
  flex-shrink: 0;
  width: 400px;
  text-align: center;
}


.select-css {
  font-size: 16px;
  font-family: sans-serif;
  font-weight: 700;
  color: #e7e6e9;
  line-height: 1.3;
  padding: .6em 1.4em .5em .8em;
  max-width: 100%;
  box-sizing: border-box;
  margin: 0;
  border: 1px solid #171d2f;
  border-radius: 0;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-color: #171d2f;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E'),
  linear-gradient(to bottom, #2c3e50 0%,#2c3e50 100%);
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
}
.select-css::-ms-expand {
  display: none;
}
.select-css:hover {
  border-color: #b90e1f;
}
.select-css:focus {
  border-color: #b90e1f;
  color: #b90e1f;
  outline: none;
}
.select-css option {
  font-weight:normal;
}

.country-el{
  margin: 0 2em 2em 2em;
  padding: 0.5em;
  background-color: #2c3e50;
  display: block;

}

.known-cases p {
  font-size: 2em;
  margin: 0 0 0.7em 0;
  color: #b90e1f;
  font-weight: bolder;
}
input[type=number] {
  border-color: #b90e1f;
  border-style: solid;
  background-color: #2c3e50;
  color: white;
  padding: 5px;
  box-sizing:border-box;
  font-size: 1.7em;
  width: 70%;
  text-align: center;
}

.button {
  background-color: #171d2f; /* Green */
  border: none;
  color: white;
  margin-top: 10px;
  padding: 7px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  width: 100%;
}
/* width */
::-webkit-scrollbar {
  width: 1px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #233446;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #2c3e50;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
