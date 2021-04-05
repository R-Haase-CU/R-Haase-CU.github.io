//const profile imported and function getAndParse imported from ProfileCharts.JS
const acctHist = getAndParse("account_history.json");
const acct = getAndParse("account.json");
const rank = getAndParse("ranking.json");

//add the mobile ad ID to the appropriate HTMl element
document.getElementById("adId").appendChild(document.createTextNode(profile["Mobile Ad Id"]));

function createList(array, elmntId){
    let parent = document.getElementById(elmntId).parentElement;
    let list = document.createElement("ul");

    // if (array === friends.Shortcuts) {
    //     array.forEach(element =>
    //         list.appendChild(listShortcuts(element))
    //     );
    // } else {
    //     array.forEach(element =>
    //         list.appendChild(listElements(element))
    //     );
    // }

    parent.appendChild(list);
}


function listObjectInfo(object, elmntId, title){
    let parent = document.getElementById(elmntId).parentElement;
    let list = document.createElement("ul");
    list.appendChild(document.createTextNode(title));

    for(i=0; i<Object.keys(object).length; i++){
        let item = document.createElement("li");
        let text = `${(Object.keys(object)[i])} : ${(Object.values(object)[i])}`
        if((Object.values(object)[i]) === ""){
            text = `${(Object.keys(object)[i])} : Unknown`
        }
        item.appendChild(document.createTextNode(text));
        list.appendChild(item);
    }

    parent.appendChild(list);
}
listObjectInfo(acct["Basic Information"], "acct", "Basic Info:");
listObjectInfo(acct["Device Information"], "acct", "Device Info:");
listObjectInfo(profile.Demographics, 'demographics', '')

function createArrayList(array, elmntId){
    let parent = document.getElementById(elmntId).parentElement;
    let list = document.createElement("ul");

    array.forEach(element => list.appendChild(listElements(element)))

    parent.appendChild(list);
}
createArrayList(rank["Content Interests"], 'contentInterests')
createArrayList(profile["Interest Categories"], 'adInterests')

function listElements(element){
    let item = document.createElement("li");
    item.appendChild(document.createTextNode(element));
    
    return item;
}

function listObjArray(array, elmntId){
    let parent = document.getElementById(elmntId).parentElement;
    let list = document.createElement("ul");

    array.forEach(element => list.appendChild(listObjElements(element)))

    parent.appendChild(list);
}
listObjArray(profile["Ads You Interacted With"], "adInteractions")

function listObjElements(element){
    let item = document.createElement("li");
    item.appendChild(document.createTextNode(`${Object.values(element)[0]} on ${Object.values(element)[1]}`));
    
    return item;
}
