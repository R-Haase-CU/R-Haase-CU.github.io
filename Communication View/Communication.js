const chatHist = getAndParse('chat_history.json');
const snapHist = getAndParse('snap_history.json');
const friends = getAndParse('friends.json');
const callLogs = getAndParse('talk_history.json');

//https://stackoverflow.com/a/35092559/15325119
const userNamesChat = [...new Set(chatHist["Received Chat History"].map(item => item.From))];
const userNamesSnap = [...new Set(snapHist["Received Snap History"].map(item => item.From))];
const displayNamesChat = rename(userNamesChat);
const displayNamesSnap = rename(userNamesSnap)


const chatsRec = countDataFrom(chatHist["Received Chat History"], userNamesChat);
const chatsSent = countDataTo(chatHist["Sent Chat History"], userNamesChat);

const snapsRec = countDataFrom(snapHist["Received Snap History"], userNamesSnap);
const snapsSent = countDataTo(snapHist["Sent Snap History"], userNamesSnap);

const mediaTypes = ["TEXT", "VIDEO", "IMAGE", "VIDEO_NO_SOUND", "AUDIO", ""];
const mediaType = [...addMediaHistory(snapHist["Received Snap History"]), ...addMediaHistory(snapHist["Sent Snap History"]), ...addMediaHistory(chatHist["Received Chat History"]), ...addMediaHistory(chatHist["Sent Chat History"])];
const numOf = [];

addCount(friends.Friends, "friendsSum");
addCount(friends["Friend Requests Sent"], "reqSentSum")
addCount(friends["Blocked Users"], "blockedUsersSum")
addCount(friends["Deleted Friends"], "delFriendsSum")
addCount(friends["Hidden Friend Suggestions"], "hiddenFriendSugSum")
addCount(friends["Ignored Snapchatters"], "ignSnapchattersSum")
addCount(friends["Shortcuts"], "shortcutsSum")

for (let i = 0; i < mediaTypes.length; i++) {
    //https://stackoverflow.com/a/56226304/15325119
    numOf.push(mediaType.filter(type => type === mediaTypes[i]).length);
}

function getAndParse(file) {
    return JSON.parse(localStorage.getItem(file));
}

//https://stackoverflow.com/a/12462387/15325119
function search(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
        if (myArray[i].Username === nameKey) {
            return myArray[i]["Display Name"];
        }
    }
}

function rename(displayNames) {
    const userNameArray = [];
    for (let i = 0; i < displayNames.length; i++) {
        let name = search(displayNames[i], friends.Friends);
        if (name === undefined) {
            userNameArray.push(displayNames[i]);
        } else {
            userNameArray.push(name);
        }
    }
    return userNameArray;
}

function addMediaHistory(array) {
    const tempArray = [];
    for (let i = 0; i < array.length; i++) {
        tempArray.push(array[i]["Media Type"]);
    }
    return tempArray;
}

function countDataTo(dataArray, namesArray) {
    const countDataArray = [];
    //https://stackoverflow.com/a/56226304/15325119
    for (let i = 0; i < namesArray.length; i++) {
        countDataArray.push(dataArray.filter(({ To }) => To === namesArray[i]).length);
    }
    return countDataArray;
}

function countDataFrom(dataArray, namesArray) {
    const countDataArray = [];
    //https://stackoverflow.com/a/56226304/15325119
    for (let i = 0; i < namesArray.length; i++) {
        countDataArray.push(dataArray.filter(({ From }) => From === namesArray[i]).length);
    }
    return countDataArray;
}

//Function to control which chart is displayed
function switchChart(key) {

    let snap = document.getElementById('snapChart');
    let chat = document.getElementById('chatChart');
    let media = document.getElementById('mediaChart');
    let btn1 = document.getElementById('btn1');
    let btn2 = document.getElementById('btn2');
    let btn3 = document.getElementById('btn3');

    switch (key) {
        case 1:
            showHideChart(snap, media, chat);
            showBtnSelect(btn1, btn2, btn3);
            break;

        case 2:
            showHideChart(chat, snap, media);
            showBtnSelect(btn2, btn1, btn3);
            break;

        case 3:
            showHideChart(media, snap, chat);
            showBtnSelect(btn3, btn2, btn1);
            break;

        default:
            break;
    }
}

//sets the display of the canvas element of selected chart to defualt while setting undesired charts to hidden
function showHideChart(show, hideA, hideB) {
    hideA.style.display = "none";
    hideB.style.display = "none";
    show.style.display = "";
}

//Highlights the correct button corresponding to the chart displayed
function showBtnSelect(on, off1, off2) {
    on.style.background = "lightgrey";
    off1.style.background = "";
    off2.style.background = "";
}

//DOM creation to set up the page based on datasets
function addCount(array, elmntId){
    let item = document.getElementById(elmntId);

    if(array === undefined){
        item.appendChild(document.createTextNode(` (Not recorded in dataset)`));
        //Code below was replaced with above due to an issue where chart tooltips no longer work if the element is removed
            // let parent = document.getElementById(elmntId).parentElement;
            // parent.remove();
    }else{
        let num = array.length;
        item.appendChild(document.createTextNode(` (${num})`));
        
        if(num > 0){
            createList(array, elmntId);
        }
    }
}

function createList(array, elmntId){
    let parent = document.getElementById(elmntId).parentElement;
    let list = document.createElement("ul");

    if (array === friends.Shortcuts) {
        array.forEach(element =>
            // console.log(element),
            list.appendChild(listShortcuts(element))
        );
    } else {
        array.forEach(element =>
            list.appendChild(listElements(element))
        );
    }

    parent.appendChild(list);
}

function listElements(element){
    let item = document.createElement("li");
    item.appendChild(document.createTextNode(`${element["Display Name"]} (${element.Username})`));

    if(element.Timestamp != (undefined)){
        item.setAttribute("title", `${element.Source} on ${element.Timestamp}`);
    }
    
    return item;
}

function listShortcuts(element){
    let item = document.createElement("li");
    item.appendChild(document.createTextNode(`${element["Shortcut Name"]} created on ${element.Created}`));
    return item;
}

function createCallLogs(array, listName){
    let parent = document.getElementById("callLogsSum").parentElement;
    let list = document.createElement("ul");
    list.appendChild(document.createTextNode(listName));

    array.forEach(element => list.appendChild(listCalls(element)));

    parent.appendChild(list);
}

createCallLogs(callLogs["Outgoing Calls"], `Outgoing Calls (${callLogs["Outgoing Calls"].length})`)
createCallLogs(callLogs["Incoming Calls"], `Incoming Calls (${callLogs["Incoming Calls"].length})`)
createCallLogs(callLogs["Completed Calls"], `Completed Calls (${callLogs["Completed Calls"].length})`)
createCallLogs(callLogs["Chat Sessions"], `Chat Sessions (${callLogs["Chat Sessions"].length})`)
createCallLogs(callLogs["Game Sessions"], `Game Sessions (${callLogs["Game Sessions"].length})`)

function listCalls(element){
    let item = document.createElement("li");
    item.appendChild(document.createTextNode(`${element["Type"]} call on ${element["Date & Time"]}`));

    // if(element.Timestamp != (undefined)){
        item.setAttribute("title", `${element["People in Chat"]} participants for ${element["Length (sec)"]} seconds on a ${element["Network"]} Network in ${element["City"]}, ${element["Country"]}`);
    // }
    
    return item;
}

//https://www.youtube.com/watch?v=sE08f4iuOhA
let pieChart = new Chart(mediaChart, {
    type: 'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: mediaTypes,
        datasets: [
            {
                label: 'Recieved Snaps',
                data: numOf,
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
            text: 'Media Type Used',
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
                left: 50,
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

let recievedChatsChart = new Chart(chatChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: displayNamesChat,
        datasets: [
            {
                label: 'Recieved Chats',
                data: chatsRec,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            },
            {
                label: 'Sent Chats',
                data: chatsSent,
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
            text: 'Chats in the Past Month',
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
                left: 50,
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

let recievedSnapsChart = new Chart(snapChart, {
    type: 'bar', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: displayNamesSnap,
        datasets: [
            {
                label: 'Recieved Snaps',
                data: snapsRec,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'
            },
            {
                label: 'Sent Snaps',
                data: snapsSent,
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
            text: 'Snaps in the Past Month',
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
                left: 50,
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