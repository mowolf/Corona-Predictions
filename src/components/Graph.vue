<script>
import { Line } from 'vue-chartjs'
export default {
    props: {
        inputChartData: {},
        bet: {},
        updateToggle: false,
        publicBets: {},
        oldBets: {},
    },
    extends: Line,
    data: () => ({
        chartdata: {},
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                xAxes: [{
                    type: 'time',
                }]
            }
        },
        urlQuery: {},
        myBetsAdded: false,
        oldBetAdded: false,
        myBetIdx: 0,
        oldBetIdx: 0,
        myBetData: {},
        oldBetData: {},
        recent_msg: '',
    }),
    methods: {
        updateURL() {
            // get url data
            const query = this.$route.query.bet;
            if (query !== undefined) {
                this.urlQuery = JSON.parse(query);
            }
            // TODO: ADD TO QUERY NOT OVERRIDE
            console.log("start")
            console.log(this.urlQuery)
            if (this.urlQuery.hasOwnProperty(this.bet.country)) {
                this.urlQuery[this.bet.country].push([this.bet["date"], parseInt(this.bet["val"])]);
            } else {
                this.urlQuery[this.bet.country] = [[this.bet["date"], parseInt(this.bet["val"])]];
            }
            console.log(this.urlQuery)
            console.log("end")
            this.$router.push({path: '/', query: {bet: JSON.stringify(this.urlQuery)}})
        },
        updateGraph(newBet, chart) {
            const realLen = this.chartdata["datasets"][0]["data"].length;
            if (parseInt(newBet["val"]) > this.chartdata["datasets"][0]["data"][realLen-1]) {
                const betDate = new Date(Date.parse(newBet["date"].replace(/-/g, " ")));
                let added = false;
                const len = this.chartdata["labels"].length;
                for (let i = len - 1; i >= 0; i--) {
                    const labelDate = new Date(Date.parse(this.chartdata["labels"][i].replace(/-/g, " ")));

                    let value;
                    let dataLen;
                    if (chart === "myBet") {
                        value = this.myBetData[i];
                        dataLen = this.myBetData.length;
                    } else {
                        value = this.oldBetData[i];
                        dataLen = this.oldBetData.length;
                    }

                    const betValue = newBet["val"];
                    if (labelDate.getFullYear() === betDate.getFullYear() &&
                        labelDate.getMonth() === betDate.getMonth() &&
                        labelDate.getDate() === betDate.getDate()) {
                        this.myBetData[i] = betValue;
                        // increase all other vals if needed
                        for (let j=1; j < 10; j++) {
                            if (this.myBetData[i + j] !== undefined && this.myBetData[i + j] < betValue) {
                                this.myBetData[i + j] = betValue
                            }
                        }

                    }
                    if ((betDate > labelDate) && !added) {
                        // add it at it correct position
                        // check that bet is valid
                        if (betValue >= value) {
                            if (i >= dataLen - 1) {
                                // add label
                                this.chartdata["labels"].push(newBet["date"]);
                                // add value to respective graph
                                if (chart === "myBet") {
                                    this.myBetData.push(newBet["val"]);
                                } else {
                                    this.oldBetData.push(newBet["val"]);
                                    this.myBetData.push(0);
                                }
                            } else {
                                let nextVal;
                                if (chart === "myBet") {
                                    nextVal = this.myBetData[i+1]
                                } else {
                                    nextVal = this.oldBetData[i+1]
                                }
                                if (betValue <= nextVal) {
                                    // add label
                                    this.chartdata["labels"].splice(i + 1, 0, newBet["date"]);
                                    // add value to respective graph
                                    if (chart === "myBet") {
                                        this.myBetData.splice(i + 1, 0, newBet["val"]);
                                    } else {
                                        this.oldBetData.splice(i + 1, 0, newBet["val"]);
                                    }
                                } else {
                                    this.recent_msg = "Total cases must be increasing by time!";
                                }
                            }
                        }
                        added = true
                    }
                }
                // update myBetData and interpolate
                const lenBets = this.myBetData.length;
                for (let i = realLen; i <= lenBets - 1 ; i++) {

                    // check if we need to interpolate
                    if (this.myBetData[i] === 0) {
                        if (this.myBetData[i+1] !== 0 && this.myBetData[i+1] !== undefined) {
                            this.myBetData[i] = (this.myBetData[i-1] + this.myBetData[i+1])/2
                        } else {
                            this.myBetData[i] = this.myBetData[i-1]
                        }
                    }
                }
                // update array with actual predictions
                const lenGraps = this.chartdata["datasets"].length;
                if (chart === "myBet") {
                    if (this.myBetsAdded) {
                        this.chartdata["datasets"][this.myBetIdx]["data"] = this.myBetData;
                    } else {
                        if (this.myBetIdx === 0) {
                            this.myBetIdx = lenGraps;
                            this.oldBetIdx = lenGraps + 1;
                        }
                        this.myBetsAdded = true;
                        this.chartdata["datasets"].push(
                            {
                                lineTension: 0,
                                label: "❔ bets",
                                backgroundColor: 'rgba(231,230,233,0.1)',
                                borderColor: 'rgb(231,230,233)',
                                data: this.myBetData
                            })
                    }
                    this.updateURL();
                } else if (chart === "oldBet") {
                    if (this.oldBetAdded) {
                        this.chartdata["datasets"][this.oldBetIdx]["data"] = this.oldBetData;
                    } else {
                        if (this.myBetIdx === 0) {
                            this.oldBetIdx = lenGraps;
                            this.myBetIdx = lenGraps + 1;
                        }
                        this.oldBetAdded = true;
                        this.chartdata["datasets"].push(
                            {
                                lineTension: 0,
                                label: "❓ link bet",
                                backgroundColor: 'rgba(231,230,233,0.1)',
                                borderColor: 'rgb(82,120,168)',
                                data: this.oldBetData
                            })
                    }
                }
                this.renderChart(this.chartdata, this.options)
            }
        }
    },
    watch: {
        updateToggle: function() {
            // update bets data as well as labels to fit new projected data
            this.updateGraph(this.bet, "myBet");
        }
    },
    mounted() {
        // load public data
        if (this.publicBets.hasOwnProperty(this.bet["country"])) {
            //console.log(this.bet["country"])
            console.log("Public data not implemented yet.")
        }
        // create chartdata
        let labels = [];
        let datasets = [
            {label: " 🥵 confirmed", backgroundColor: 'rgba(185,14,31,0.1)', borderColor: 'rgb(185,138,64)', data: [],},
            {label: "💀 deaths", backgroundColor: 'rgba(185,14,31,0.1)', borderColor: 'rgba(185,14,31,1)', data: []},
            {label: "😃 recovered", backgroundColor: 'rgba(75,148,46,0.1)', borderColor: 'rgba(75,148,46,1)', data: []}
        ];
        for (let i in this.inputChartData[1]) {
            labels.push(this.inputChartData[1][i]["date"]);
            datasets[0]["data"].push(this.inputChartData[1][i]["confirmed"]);
            datasets[1]["data"].push(this.inputChartData[1][i]["deaths"]);
            datasets[2]["data"].push(this.inputChartData[1][i]["recovered"]);
            // check if new bets to add
            this.chartdata = {
                labels: labels,
                datasets: datasets
            };
        }
        this.renderChart(this.chartdata, this.options);
        this.myBetData = JSON.parse(JSON.stringify(datasets[0]["data"]));

        // get old bets
        if (this.oldBets !== undefined) {
            //for (bet in this.oldBets)
            this.oldBetData = JSON.parse(JSON.stringify(datasets[0]["data"]));

            for (let item in this.oldBets) {
                this.updateGraph(this.oldBets[item], "oldBet")
            }
        }
    }
}
</script>
