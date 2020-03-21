<script>
    import { Line } from 'vue-chartjs'

    export default {
        props: {
            inputChartData: {},
            bet: {},
            updateToggle: false,
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
            betData: {},
            recent_msg: ''
        }),
        watch: {
            updateToggle: function() {
                // update bets data as well as labels to fit new projected data
                const len = this.chartdata["datasets"][0]["data"].length;

                if (parseInt(this.bet["val"]) > this.chartdata["datasets"][0]["data"][len-1]) {
                    const betDate = new Date(Date.parse(this.bet["date"].replace(/-/g, " ")))
                    let added = false;
                    const len = this.chartdata["labels"].length;
                    for (let i = len - 1; i >= 0; i--) {
                        const labelDate = new Date(Date.parse(this.chartdata["labels"][i].replace(/-/g, " ")));
                        const value = this.betData[i];
                        const betValue = this.bet["val"];
                        if ((betDate > labelDate) && !added) {
                            // add it at it correct position
                            // check that bet is valid

                            if (betValue >= value) {

                                if (i === len - 1) {
                                    this.chartdata["labels"].push(this.bet["date"]);
                                    this.betData.push(this.bet["val"]);
                                } else if (betValue <= this.betData[i+1]) {
                                    this.chartdata["labels"].splice(i + 1, 0, this.bet["date"]);
                                    this.betData.splice(i + 1, 0, this.bet["val"]);
                                } else {
                                    this.recent_msg = "Total cases must be increasing by time!";
                                }
                            }
                            added = true
                        }
                    }
                    // update array with actual predictions
                    if (this.chartdata["datasets"].length > 3) {
                        this.chartdata["datasets"][3]["data"] = this.betData;
                    } else {
                        this.chartdata["datasets"].push(
                            {
                                label: "❔ bets",
                                backgroundColor: 'rgba(231,230,233,0.1)',
                                borderColor: 'rgb(231,230,233)',
                                data: this.betData
                            })
                    }
                    this.renderChart(this.chartdata, this.options)
                }
            }
        }
        ,
        mounted() {
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
            this.betData = JSON.parse(JSON.stringify(datasets[0]["data"]));
        }
    }
</script>
