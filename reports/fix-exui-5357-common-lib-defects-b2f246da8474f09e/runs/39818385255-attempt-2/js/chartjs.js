let options = {
        segmentShowStroke: false,
        responsive: false,
        layout: {
            padding: {
                left: 0,
                right: 0,
                top: 10,
                bottom: 0
            }
        },
        scales: {
            yAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    display: false
                },
                scaleLabel: {
                    display: false
                }
            }],
            xAxes: [{
                gridLines: {
                    display: false
                },
                ticks: {
                    display: false
                },
            }]
        },
        legend: {
            display: false,
        },
        animation: {
            duration: 2200
        },
        tooltips: {
            callbacks: {
                label: function (tooltipItem, data) {
                    //get the concerned dataset
                    let dataset = data.datasets[tooltipItem.datasetIndex];
                    //calculate the total of this data set
                    let total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                        return previousValue + currentValue;
                    });
                    //get the current items value
                    let currentValue = dataset.data[tooltipItem.index];
                    //get the current items label
                    let currentLabel = data.labels[tooltipItem.index];
                    //calculate the percentage based on the total and current item, also this does a rough rounding to give a whole number
                    let percentage = Math.floor(((currentValue / total) * 100) + 0.5);

                    return " " + currentLabel + " " + percentage + "%";
                }
            }
        },
        title: {
            display: false,
        }
    }

    let statusPassed = "209"
    let statusFailed = "0"
    let statusTimedOut = "0"
    let statusSkipped = "0"
    let statusInterrupted = "0"
    let statusFlaky = "0"
    let ctxStatus = document.getElementById('chart-status').getContext('2d');
    let datasetList = [];
    let colorList = [];
    let labelList = [];
    if(parseInt(statusPassed) > 0) {
        datasetList.push(parseInt(statusPassed));
        colorList.push("#2E7D31");
        labelList.push('Passed (209)');
    }
    if(parseInt(statusFailed) > 0) {
        datasetList.push(parseInt(statusFailed));
        colorList.push("#C62828");
        labelList.push('Failed (0)');
    }
    if(parseInt(statusTimedOut) > 0) {
        datasetList.push(parseInt(statusTimedOut));
        colorList.push("#fcd12a");
        labelList.push('TimedOut (0)');
    }
    if(parseInt(statusSkipped) > 0) {
        datasetList.push(parseInt(statusSkipped));
        colorList.push("#ff6f00");
        labelList.push('Skipped (0)');
    }
    if(parseInt(statusInterrupted) > 0) {
        datasetList.push(parseInt(statusInterrupted));
        colorList.push("#01579b");
        labelList.push('Interrupted (0)');
    }
    if(parseInt(statusFlaky) > 0) {
        datasetList.push(parseInt(statusFlaky));
        colorList.push("#3c0061");
        labelList.push('Flaky (0)');
    }
    let chartStatus = new Chart(ctxStatus, {
        type: 'doughnut',
        data: {
            labels: labelList,
            datasets: [{
                data: datasetList,
                backgroundColor: colorList,
                borderColor: colorList
            }]
        },
        options: options
    });
let ctxProject = document.getElementById('chart-project').getContext('2d');
    let chartProject = new Chart(ctxProject, {
        type: 'doughnut',
        data: {
            labels: [ 'chromium (209)' ],
            datasets: [{
                data: [ 209 ],
                backgroundColor: [ '#5BAB85' ],
                borderColor: [ '#5BAB85' ]
            }]
        },
        options: options
    });