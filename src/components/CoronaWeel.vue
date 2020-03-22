<template>
  <div>
    <p class="msg"> <span v-if="new_msg">{{recent_msg}}</span> <span><br></span></p>
  <div class="el">
    <div class="warpper" v-for="data in coronaData">
      <div class="country-el" >
        <p>I think <h1>{{data[0]}}</h1> will have</p>
        <input type="number" v-model="bets[data[0]]" @change="checkBet">
        <p>cases on</p>
        <label for="time">
          <select v-model="selectedTime" id="time" class="select-css">
            <option value="" disabled selected>select a day</option>
            <option v-for="item in Object.keys(selectorOptions)">{{item}}</option>
          </select>
        </label>
      <button class="button" @click="updateToggle">Submit</button>
      </div>
      <Graph
              v-bind:oldBets="oldBets[data[0]]"
              v-bind:input-chart-data="data"
              v-bind:bet="{val:bets[data[0]], date:betDate, country: data[0]}"
              v-bind:update-toggle="toggle"
              v-bind:publicBets="publicBets"
              ref="graph"/>
    </div>
  </div>
  </div>
</template>

<script>
  import Graph from "../components/Graph";
  import firebase from 'firebase';

  export default {
  name: 'CoronaWeel',
    components: {
      Graph
    },
    data: function () {
      return {
        selectorOptions: {
          "Valentines Day (14. April)": "2020-4-14" ,
          "Mother’s Day (10. May)": "2020-5-10",
          "Father’s Day (21. June)": "2020-6-21",
          "World Humanitarian Day (19. August)": "2020-8-19",
          "Halloween (31. October)": "2020-10-31",
          "World Children's Day (20. November)": "2020-11-20",
          "New Year's Eve (31. December)": "2020-12-31",
        },
        new_msg: false,
        coronaData: {},
        bets: {},
        validBets: [],
        recent_msg: '',
        selectedTime: '',
        toggle: false,
        betDate: '',
        oldBets: {},
        publicBets: {}
      }
    },
    watch: {
      recent_msg: function () {
        console.log(this.recent_msg);
        this.new_msg = true;
        setTimeout(() => {  this.new_msg = false }, 2000);
      },
    },
  methods: {
    updateToggle: function() {
      // check if fields are selected
      if (this.selectedTime.length > 0) {
        // set time
        this.betDate = this.selectorOptions[this.selectedTime];
        // update toggle
        this.toggle = !this.toggle;
      } else {
        this.recent_msg = "Please select both time dropdown fields.";
      }
    },
    checkBet: function() {
        for (let i in this.coronaData) {
          const country = this.coronaData[i][0];
          const len = this.coronaData[i][1].length-1;
          const cases = this.coronaData[i][1][len]["confirmed"]
          if (cases > this.bets[country]) {
            this.bets[country] = this.coronaData[i][1][len]["confirmed"];
            this.recent_msg = "Bet adjusted to minimum of known cases.";
          } else {
            if (cases < this.bets[country])  {
              if (!this.validBets.includes(country)) {
                this.validBets.push(country);
                console.log("Valid bet registered for " + country)
              }
            }
          }
        }
      },
  },
    created: function () {
      // get corona data
      fetch("https://pomber.github.io/covid19/timeseries.json").then(response => response.json())
      .then(data => {
        this.recent_msg = "Data loading...";
        let all = [];
        let latest = {};
        for (let key in data) {
          if (data.hasOwnProperty(key) && data[key][data[key].length - 1]["confirmed"] > 500) {
            all.push([key, data[key]]);
            latest[key] = data[key][data[key].length - 1]["confirmed"]
          }
        }
        all.sort(function (a, b) {
          return b[1][b[1].length - 1]["confirmed"] - a[1][a[1].length - 1]["confirmed"]
        });
        // get bet data
        let db = firebase.firestore();
        const betsRef = db.collection('bets');
        let publicBets = {};
        betsRef.get()
                .then(snap => {
                  snap.docs.map(doc => {
                    if (publicBets.hasOwnProperty(doc.data().country)) {
                      publicBets[doc.data().country].append([doc.data().betValue, doc.data().betDate])
                    } else {
                      // first init country
                      publicBets[doc.data().country] = [doc.data().betValue, doc.data().betDate]
                    }
                  })
                }).catch(err => {
                  console.log('Error getting document', err)
                });

        // save data
        this.publicBets = publicBets;
        this.coronaData = all;
        this.bets = latest;

        // get url data
        const query = this.$route.query.bet;
        if (query !== undefined) {
          const queryObj = JSON.parse(query);
          for (const key in queryObj) {
            for (const item in queryObj[key]) {
              if (this.oldBets.hasOwnProperty(key)) {
                this.oldBets[key].push({date: queryObj[key][item][0], val: queryObj[key][item][1], country: key});
              } else {
                this.oldBets[key] = [{date: queryObj[key][item][0], val: queryObj[key][item][1], country: key}];
              }
            }
          }
        }

      });
    }
  }
</script>

<style scoped>
  .msg {
    text-align: center;
    color: #b90e1f;
    font-weight: bolder;
    -webkit-animation: fadein 0.4s; /* Safari, Chrome and Opera > 12.1 */
    -moz-animation: fadein 0.4s; /* Firefox < 16 */
    -ms-animation: fadein 0.4s; /* Internet Explorer */
    -o-animation: fadein 0.4s; /* Opera < 12.1 */
    animation: fadein 0.4s;

  }

  @keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Firefox < 16 */
  @-moz-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Safari, Chrome and Opera > 12.1 */
  @-webkit-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  /* Internet Explorer */
  @-ms-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  /* Opera < 12.1 */
  @-o-keyframes fadein {
    from { opacity: 0; }
    to   { opacity: 1; }
  }


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

  color: #b90e1f;
  font-weight: bolder;
  border-color: #b90e1f;
  border-style: solid;
  background-color: #2c3e50;
  padding: 5px;
  box-sizing:border-box;
  font-size: 1.7em;
  width: 70%;
  text-align: center;

  background: url(https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/237/microbe_1f9a0.png) no-repeat scroll 7px 7px;
  background-size: 30px;
  padding-left:30px;
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
