const acctHist = getAndParse('account_history.json');
const acct = getAndParse('account.json');
const search = getAndParse('search_history.json');
const profile = getAndParse('user_profile.json')

createArrayList(profile.Interactions["Web Interactions"], 'webHist');
createArrayList(profile.Interactions["App Interactions"], 'appHist');

(function listAcctHist(){
    let parent = document.getElementById("acctHist").parentElement;

    for(let i=0; i<Object.keys(acctHist).length; i++){
        let arrayName = Object.keys(acctHist)[i];
        let array = acctHist[`${arrayName}`];
        if(array.length > 0){
            let list = document.createElement("ul");
            list.appendChild(document.createTextNode(`${arrayName}:`));

            for(let j = 0; j < array.length; j++){
                let item = document.createElement("li");
                let text = `Changed to ${Object.values(array[j])[1]} on ${Object.values(array[j])[0]}}`

                item.appendChild(document.createTextNode(text));
                list.appendChild(item);
            }

            parent.appendChild(list);
        }

    }
})();

function getAndParse(file) {
    return JSON.parse(localStorage.getItem(file));
}

function createArrayList(array, elmntId){
    let parent = document.getElementById(elmntId).parentElement;
    let list = document.createElement("ul");
    array.forEach(element => list.appendChild(listElements(element)));

    parent.appendChild(list);
}

function listElements(element){
    let item = document.createElement("li");
    let link = document.createElement("a");
    link.appendChild(document.createTextNode(element));
    if(element.startsWith("http")){
        link.setAttribute("href", element);
    }else{
        link.setAttribute("href", `https://${element}`);
    }
    link.setAttribute("target", "_blank")

    item.appendChild(link);
    
    return item;
}

////////////////////////
function listObjArray(objectArray, elmntId, subTitle){
    let parent = document.getElementById(elmntId).parentElement;
    let parentList = document.createElement("ul");
    if(objectArray != search){
        parent.appendChild(document.createTextNode("Decending from most recent to oldest"))
        parentList.appendChild(document.createTextNode(`The oldest recorded is number ${objectArray.length -1}`));    
    }
 

    for (let i = 0; i < objectArray.length; i++) {
        let listTitle = document.createElement("li");
        listTitle.appendChild(document.createTextNode(`${subTitle} ${i+1}`));
        parentList.appendChild(listTitle);

        let list = document.createElement("ul");
        for (j = 0; j < Object.keys(objectArray[i]).length; j++) {
            let item = document.createElement("li");
            let text = `${(Object.keys(objectArray[i])[j])} : ${(Object.values(objectArray[i])[j])}`
            item.appendChild(document.createTextNode(text));
            list.appendChild(item);
        }
        parentList.appendChild(list);
    }
    parent.appendChild(parentList)
}
listObjArray(acct["Device History"], "deviceHist", "New Device");
listObjArray(acct["Login History"], "loginHist", "New Login");
listObjArray(search, "searchHist", "Search Term");



// listObjectInfo(acct["Device Information"], "acct", "Device Info:");
// listObjectInfo(profile.Demographics, 'demographics', '')

// function listObjArray2(array, elmntId){
//     let parent = document.getElementById(elmntId).parentElement;
//     let list = document.createElement("ul");

//     array.forEach(element => list.appendChild(listObjElements(element)))

//     parent.appendChild(list);
// }
// // listObjArray2(profile["Ads You Interacted With"], "adInteractions")

// function listObjElements(element){
//     let item = document.createElement("li");
//     item.appendChild(document.createTextNode(`${Object.values(element)[0]} on ${Object.values(element)[1]}`));
    
//     return item;
// }


// function createList(array, elmntId){
//     let parent = document.getElementById(elmntId).parentElement;
//     let list = document.createElement("ul");

//     // if (array === friends.Shortcuts) {
//     //     array.forEach(element =>
//     //         list.appendChild(listShortcuts(element))
//     //     );
//     // } else {
//     //     array.forEach(element =>
//     //         list.appendChild(listElements(element))
//     //     );
//     // }

//     parent.appendChild(list);
// }

