const profile = getAndParse("user_profile.json");

const breakdown = [];
const timeLabels = [];
const timeData = [];

const engageLabels = [];
const engageData = [];

function getAndParse(file) {
    return JSON.parse(localStorage.getItem(file));
}

(function formatDataTimeChart(){
    profile["Breakdown of Time Spent on App"].forEach(element => breakdown.push(element.split(":")));

    for (i=0; i<breakdown.length; i++){
        timeLabels.push(breakdown[i][0]);
        timeData.push(parseFloat(breakdown[i][1]));
    }
})();

(function formatDataEngageChart(){
    for(i=0; i<profile.Engagement.length; i++){
        engageLabels.push(Object.values(profile.Engagement[i])[0]);
        engageData.push(Object.values(profile.Engagement[i])[1]);
    }
})();

function switchChart(key) {

    let time  = document.getElementById('timeChart');
    let engage = document.getElementById('engagementChart');
    let btn1 = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');

    switch (key) {
        case 1:
            showHideChart(time, engage);
            showBtnSelect(btn1, btn2);
            break;

        case 2:
            showHideChart(engage, time);
            showBtnSelect(btn2, btn1);
            break;

        default:
            break;
    }
}

function showHideChart(show, hide) {
    hide.style.display = "none";
    show.style.display = "";
}

function showBtnSelect(on, off) {
    on.style.background = "lightgrey";
    off.style.background = "";
}

let tChart = new Chart(timeChart, {
    type: 'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: timeLabels,
        datasets: [
            {
                label: '%',
                data: timeData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                    'rgba(255, 99, 132, 0.6)'
                ],
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: "Percentage Breakdown of Time in App",
            fontSize: 25
        },
        legend: {
            display: true,
            position: 'right',
            labels: {
                fontColor: '#000'
            }
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                bottom: 20,
                top: 0
            }
        },
        tooltips: {
            enabled: true
        }
    }
});

let eChart = new Chart(engagementChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: engageLabels,
        datasets: [
            {
                label: 'Occurrances',
                data: engageData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: "Engagement",
            fontSize: 25
        },
        legend: {
            display: false,
            position: 'right',
            labels: {
                fontColor: '#000'
            }
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                bottom: 20,
                top: 0
            }
        },
        tooltips: {
            enabled: true
        }
    }
});