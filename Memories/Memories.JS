const memories = getAndParse('memories_history.json');

createList(memories["Saved Media"]);

const mediaType = [];
const numOf = [];

//Puts all instances of "Media Type" from the saved media table into array mediaType to be searched by filter
for (let i = 0; i < memories["Saved Media"].length; i++) {
    mediaType.push(memories["Saved Media"][i]["Media Type"])
}

//Adds the total number of occurrances of each given mediatype to array numOf
numOf.push(mediaType.filter(type => type === 'VIDEO').length);
numOf.push(mediaType.filter(type => type === 'PHOTO').length);


function getAndParse(file) {
    return JSON.parse(localStorage.getItem(file));
}

//DOM creation to set up the page based on datasets

function createList(array){
    let list = document.getElementById("memoriesList");

    if (array === null) {
        list.appendChild(document.createTextNode("There are no Memories saved on your account."));
    } else {
        array.forEach(element =>
            list.appendChild(listElements(element))
        );
    }
}

function listElements(element){
    let item = document.createElement("li");
    let link = document.createElement("a");
    item.appendChild(document.createTextNode(`${element["Media Type"]} saved on ${element.Date}: `));
    link.appendChild(document.createTextNode("Download"));
    link.setAttribute("href", element["Download Link"]);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
    item.appendChild(link);
    return item;
}

//add a pie chart breaking down the split of mediatype
let pieChart = new Chart(mediaChart, {
    type: 'pie', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
        labels: ["VIDEO", "PHOTO"],
        datasets: [
            {
                label: 'Memories',
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
            text: `Total Memories (${memories["Saved Media"].length})`,
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