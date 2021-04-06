const story = getAndParse("story_history.json")
const friends = getAndParse("friends.json");

const usernames = [...new Set(story["Friend and Public Story Views"].map(item => item.View))].sort();
const objArrays = [];

create2dArray();

const stories = createDataArray("STORY");
const snaps = createDataArray("");
const vids = createDataArray("VIDEO");

const displayNames = rename(usernames);

const days = [...new Set(story["Your Story Views"].map(item => item["Story Date"].substring(0,10)))].sort();

const views = [];
const replies = [];

formatAnalyticsData();

const subs = getAndParse("subscriptions.json");
const discover = getAndParse("user_profile.json")["Discover Channels Viewed"];

///////////////////////

function getAndParse(file) {
    return JSON.parse(localStorage.getItem(file));
}

//////////////////////// viewsChart

function create2dArray(){
    usernames.forEach(element => objArrays.push(getObjArray(element)))
}

function getObjArray(name){
    const tempArray = [];

    for(let i=0; i< story["Friend and Public Story Views"].length; i++){
        if(story["Friend and Public Story Views"][i].View === name){
            tempArray.push(story["Friend and Public Story Views"][i]);
        }
    }

    return tempArray;
}

function createDataArray(mediaType){
    const countDataArray = [];
    for (let i = 0; i < objArrays.length; i++) {
        countDataArray.push(objArrays[i].filter(item => item["Media Type"] === mediaType).length);
    }
    return countDataArray;
}

function rename(names) {
    const userNameArray = [];
    for (let i = 0; i < names.length; i++) {
        let name = search(names[i], friends.Friends);
        if (name === undefined) {
            userNameArray.push(names[i]);
        } else {
            userNameArray.push(name);
        }
    }
    return userNameArray;
}

function search(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].Username === nameKey) {
            return myArray[i]["Display Name"];
        }
    }
}

//////////////////////////////// analyticsChart

function formatAnalyticsData(){
    for (let i = 0; i<days.length; i++){
        let viewCount = 0;
        let replyCount = 0;

        story["Your Story Views"].forEach(element =>
            {if(element["Story Date"].startsWith(days[i])){
                viewCount = viewCount + element["Story Views"];
                replyCount = replyCount + element["Story Replies"];
            }}
        );
        
        views.push(viewCount);
        replies.push(replyCount);    
    }
}

///////////////////////////// show/hide charts

function switchChart(key) {

    let views = document.getElementById('viewsChart');
    let analytics = document.getElementById('analyticsChart');
    let btn1 = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');

    switch (key) {
        case 1:
            showHideChart(views, analytics);
            showBtnSelect(btn1, btn2);
            break;

        case 2:
            showHideChart(analytics, views);
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

////////////////////////// create charts

let storiesViewedChart = new Chart(viewsChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: displayNames,
        datasets: [
            {
                label: 'Stories',
                data: stories,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(54, 162, 235, 1)',
                hoverBorderWidth: 1,
                hoverBorderColor: '#000'
            }
            ,
            {
                label: 'Videos',
                data: snaps,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(255, 99, 132, 1)',
                hoverBorderWidth: 1,
                hoverBorderColor: '#000'
            },
            {
                label: 'Snaps',
                data: vids,
                backgroundColor: 'rgba(255, 206, 86, 0.6)',
                borderWidth: 1,
                borderColor: 'rgba(255, 206, 86, 1)',
                hoverBorderWidth: 1,
                hoverBorderColor: '#000'
            }
        ]
    },
    options: {
        title: {
            display: true,
            text: "Stories You've Viewed in the Past Month",
            fontSize: 25
        },
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                fontColor: '#000'
            }
        },
        layout: {
            padding: {
                left: 0,
                right: 0,
                bottom: 0,
                top: 0
            }
        },
        tooltips: {
            enabled: true
        }
    }
});

let storyAnalyticsChart = new Chart(analyticsChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: days,
        datasets: [
            {
                label: 'Story Views',
                data: views,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            },
            {
                label: 'Story Replies',
                data: replies,
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
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
            text: "Story Analytics for the Past Month",
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
                bottom: 0,
                top: 0
            }
        },
        tooltips: {
            enabled: true
        }
    }
});

//////////////////////// DOM creation
console.log(subs);
console.log(discover);