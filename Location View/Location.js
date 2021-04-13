//Google Maps Initialization
let map;
let markers = [];
function initMap() {
   map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 40, lng: -100 },
      zoom: 4,
   });
}

//set the data file to the global constant hist for use in the rest of the script
const hist = getAndParse("location_history.json");

//checks that the data file was properly loaded
if (hist === null) {
   alert("location_history.json file is missing or broken. Press the clear data button on the right of the screen and re-import data files including location_history.json. If error keeps appearing, try re-downloading Snapchat Data.");
}

//control the timelapse functionality using the button to the left of the timeline
const timer = (ms) => new Promise((res) => setTimeout(res, ms));
async function toggle() {

   var j = document.getElementById("sliderPosition").value;

   if (document.getElementById("startStop").value == "STOP") {
      document.getElementById("startStop").value = "GO";
      document.getElementById("startStop").className = "pause";
   } else if (document.getElementById("startStop").value == "GO") {
      document.getElementById("startStop").value = "STOP";
      document.getElementById("startStop").className = "play";
   }

   do {
      document.getElementById("sliderPosition").value = j;
      let output = document.getElementById("dateIndicator");
      let time = hist["Location History"][j].Time;
      output.innerHTML = time;

      let coords = hist["Location History"][j].coord;
      let style = { url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", };
      addMarker(coords, time, style);

      j++;
      await timer(1);

   } while (
      j < hist["Location History"].length &&
      document.getElementById("startStop").value == "GO"
   );

   if (j == hist["Location History"].length) {
      j = 0;
      document.getElementById("startStop").value = "STOP";
   }
}

//IIFE to change slider values based on the data imported into the system
(function setSlider() {
   document.getElementById("sliderPosition").max = hist["Location History"].length - 1;
})();

//handles user input with the slider element
let slider = document.getElementById("sliderPosition");
let output = document.getElementById("dateIndicator");
slider.oninput = function () {
   document.getElementById("startStop").value = "STOP";
   let time = hist["Location History"][this.value].Time;
   output.innerHTML = time;

   let coords = hist["Location History"][this.value].coord;
   let style = {
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
   };
   addMarker(coords, time, style);
};

//function to get file from local storage and the JSON to JS
function getAndParse(file) {
   return JSON.parse(localStorage.getItem(file));
}

//functions to reformat coordinates so that they can be used with Google Maps
(function reformatCoordsHist() {
   for (let i = 0; i < hist["Location History"].length; i++) {
      //splits lat, lng string
      hist["Location History"][i]["Latitude, Longitude"] = hist["Location History"][i]["Latitude, Longitude"].split(",");
      hist["Location History"][i].coord = {
         //creates key:value pairs for lat and lng
         lat: parseFloat(hist["Location History"][i]["Latitude, Longitude"][0]),
         lng: parseFloat(hist["Location History"][i]["Latitude, Longitude"][1]),
      };
   }
})();

(function reformatCoordinatesHW() {
   // hist["Home & Work"].Home = hist["Home & Work"].Home.split(",");
   hist["Home & Work"].coordHome = {
      lat: parseFloat(hist["Home & Work"].Home.substr(4, 10)),
      lng: parseFloat(hist["Home & Work"].Home.substr(31, 46)),
   };
   // hist["Home & Work"].Work = hist["Home & Work"].Work.split(",");
   hist["Home & Work"].coordWork = {
      lat: parseFloat(hist["Home & Work"].Work.substr(4, 10)),
      lng: parseFloat(hist["Home & Work"].Work.substr(31, 46)),
   };
})();

function reformatCoordinatesTop(array) {
   for (let j = 0; j < array.length; j++) {
      for (let i = 0; i < array[j].length; i++) {
         array[j][i].coords = {
            lat: parseFloat(Object.values(array[j][i])[0].substr(4, 10)),
            lng: parseFloat(Object.values(array[j][i])[0].substr(31, 46)),
         };
      }
   }
}
reformatCoordinatesTop(hist["Top Locations Per Six-Day Period"]);
reformatCoordinatesTop(hist["Daily Top Locations"]);

(async function getAreaCoords() {
   //Uses Google's Geocode API to get coordinates based on zipcode
   //https://stackoverflow.com/a/52770895/15325119
   //https://developers.google.com/maps/documentation/geocoding/overview
   //This function takes a while to fully execute but it should be fine to run in the background and will hopefully be complete by the time any users want to access the data that it is creating
   //There appear to be errors when viewing the data, this is not a fault of my algorithim but instead is an error in Snapchat's data exports
   for (let i = 0; i < hist["Areas you may have visited in the last two years"].length; i++) {
      try{
         await fetch(`https://maps.googleapis.com/maps/api/geocode/json?components=postal_code:${hist["Areas you may have visited in the last two years"][i]["Postal Code"]}&key=AIzaSyCWBiNjlecS2ZLkEWnuUE4_xa9v2CvwMXw`)
            .then(response => response.json())
            .then(data => {
               // console.log(`data received index ${i}`)
               const coords = data.results[0].geometry.location;
               hist["Areas you may have visited in the last two years"][i].coords = coords;
               // console.log(`index ${i} complete`)
         })
      }catch{
         console.log(`Bad data/response. Entry ${i} skipped`)
      }
   }
})();

//functions to edit the DOM and add the lists to the details elements
function createListTop(array) {
   //This is all I could figure out for being able to use one function for both arrays... very elegant /s
   if (array === hist["Top Locations Per Six-Day Period"]) {
      var list = document.getElementById("topPerSix");
      var arrayName = "hist['Top Locations Per Six-Day Period']";
   } else if (array === hist["Daily Top Locations"]) {
      var list = document.getElementById("dailyTop");
      var arrayName = "hist['Daily Top Locations']";
   } else {
      console.log("Wrong Array Passed");
   }

   for (let j = 0; j < array.length; j++) {
      let listTitle = document.createElement("li");
      let subList = document.createElement("ol");
      let subListName = Object.keys(array[j][0])[0];

      // listTitle.setAttribute("style", "font-weight: bold;");
      listTitle.appendChild(document.createTextNode(`Top locations beginning on ${subListName}`));
      list.appendChild(listTitle);

      //Create button for list title

      for (let i = 0; i < array[j].length; i++) {
         let item = document.createElement("li");
         let value = Object.values(array[j][i])[0];
         let button = document.createElement("button");
         button.setAttribute("onclick", `topLocMarker(${j}, ${i}, ${arrayName})`);

         button.appendChild(document.createTextNode("Show on Map"));
         item.appendChild(document.createTextNode(value));

         item.appendChild(button);
         subList.appendChild(item);
      }
      list.appendChild(subList);
   }
}
createListTop(hist["Top Locations Per Six-Day Period"]);
createListTop(hist["Daily Top Locations"]);

(function createLocHistList() {
   let list = document.getElementById("locationHistory");

   for (let i = 0; i < hist["Location History"].length; i++) {
      let time = hist["Location History"][i].Time;
      let item = document.createElement("li");
      let button = document.createElement("button");
      button.setAttribute("onclick", `histMarker(${i})`);

      //https://stackoverflow.com/a/11128791/15325119
      // Set its contents:
      button.appendChild(document.createTextNode("Show on Map"));
      item.appendChild(document.createTextNode(time + " "));

      // Add it to the list:
      item.appendChild(button);
      list.appendChild(item);
   }
})();

(function createBusinessList() {
   let list = document.getElementById("businesses");

   for (let i = 0; i < hist["Businesses and public places you may have visited"].length; i++) {
      let date = hist["Businesses and public places you may have visited"][i].Date;
      let name = hist["Businesses and public places you may have visited"][i].Name;
      let item = document.createElement("li");

      item.appendChild(document.createTextNode(`${name} on ${date}`));
      list.appendChild(item);
   }
})();

(function createAreasList() {
   let list = document.getElementById("areasTwoYrs");

   for (let i = 0; i < hist["Areas you may have visited in the last two years"].length; i++) {
      let date = hist["Areas you may have visited in the last two years"][i].Time;
      let name = hist["Areas you may have visited in the last two years"][i].City;
      let region = hist["Areas you may have visited in the last two years"][i].Region;
      let item = document.createElement("li");
      let button = document.createElement("button");
      button.setAttribute("onclick", `areaMarkers(${i})`);

      //https://stackoverflow.com/a/11128791/15325119
      // Set its contents:
      button.appendChild(document.createTextNode("Show on Map"));
      item.appendChild(document.createTextNode(`${name}, ${region} on ${date}`));

      item.appendChild(button);
      list.appendChild(item);
   }
})();

(function createHomeWorkList() {
   let home = hist["Home & Work"].Home;
   let work = hist["Home & Work"].Work;
   let list = document.getElementById("homeWork");
   let itemHome = document.createElement("li");
   let itemWork = document.createElement("li");
   let showWork = document.createElement("button");
   showWork.setAttribute("onclick", `workMarker()`);
   let showHome = document.createElement("button");
   showHome.setAttribute("onclick", `homeMarker()`);

   showWork.appendChild(document.createTextNode("Show on Map"));
   showHome.appendChild(document.createTextNode("Show on Map"));

   itemHome.appendChild(
      document.createTextNode(
         `Snapchat has esimated your home to be at: ${home}`
      )
   );
   itemWork.appendChild(
      document.createTextNode(
         `Snapchat has esimated your work to be at: ${work}`
      )
   );

   itemHome.appendChild(showHome);
   itemWork.appendChild(showWork);

   list.appendChild(itemHome);
   list.appendChild(itemWork);
})();

(function createOtherLists() {
   let list = document.getElementById("freqLoc");

   for (let i = 0; i < hist["Frequent Locations"].length; i++) {
      let city = hist["Frequent Locations"][i].City;
      let country = hist["Frequent Locations"][i].Country;
      let region = hist["Frequent Locations"][i].Region;
      let item = document.createElement("li");

      item.appendChild(document.createTextNode(`${city}, ${region}, ${country}`));
      list.appendChild(item);
   }

   let city = hist["Latest Location"][0].City;
   let country = hist["Latest Location"][0].Country;
   let region = hist["Latest Location"][0].Region;
   let item = document.createElement("li");

   item.setAttribute("style", "font-weight: bold;");

   item.appendChild(
      document.createTextNode(
         `Snapchat has your latest location recorded as: ${city}, ${region}, ${country}`
      )
   );
   list.appendChild(item);
})();

//functions to create markers for different data sets
function topLocMarker(j, i, array) {
   let style = {
      url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
   };
   let coords = array[j][i].coords;
   let label = `Top location from ${Object.keys(array[j][i])[0]}`; //Figure out how to properly name these things
   addMarker(coords, label, style);
}

function histMarker(index) {
   let style = {
      url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
   };
   let coord = hist["Location History"][index].coord;
   let time = hist["Location History"][index].Time;
   addMarker(coord, time, style);
}

function homeMarker() {
   let icon = {
      url: "http://maps.google.com/mapfiles/kml/pal3/icon56.png",
   };
   let coord = hist["Home & Work"].coordHome;
   let label = "Home";
   addMarker(coord, label, icon);
}

function workMarker() {
   let icon = {
      url: "http://maps.google.com/mapfiles/kml/pal3/icon21.png",
   };
   let coord = hist["Home & Work"].coordWork;
   let label = "Work";
   addMarker(coord, label, icon);
}

function areaMarkers(index) {
   let style = {
      url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
   };
   let coord = hist["Areas you may have visited in the last two years"][index].coords;
   let area = hist["Areas you may have visited in the last two years"][index]["Postal Code"];
   addMarker(coord, area, style);
}

//functions to create markers for full datasets
function allTopMarkers(array) {
   for (let j = 0; j < array.length; j++) {
      for (let i = 0; i < array[j].length; i++) {
         topLocMarker(j, i, array);
      }
   }
}

function allAreaMarkers() {
   for (let i = 0; i < hist["Areas you may have visited in the last two years"].length; i++) {
      areaMarkers(i);
   }
}

function allHistMarkers() {
   //Does not work smoothly with exceptionally large datasets
   for (let i = 0; i < hist["Location History"].length; i++) {
      let time = hist["Location History"][i].Time;
      let coords = hist["Location History"][i].coord;
      let style = {
         url: "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
      };
      addMarker(coords, time, style);
   }
}

//Warning of delay if allHistMarkers is called
function warnAllHist(){
   let btn = document.getElementById('locHistBtn')
   btn.innerText = "If clicked, there may be a delay... please wait until markers appear on map."
}

//functions that edit the global variable marker (I believe it to be a hash table but in JS its an array map???) 
function addMarker(coords, content, style) {
   //https://developers.google.com/maps/documentation/javascript/infowindows
   const infowindow = new google.maps.InfoWindow({
      content: content,
   });

   const marker = new google.maps.Marker({
      position: coords,
      map: map,
      icon: style,
   });

   marker.addListener("mouseover", () => {
      infowindow.open(map, marker);
   });
   marker.addListener("mouseout", () => {
      infowindow.close();
   });
   markers.push(marker); //Adds the newly created marker to the marker array
}

function clearMarkers() {
   //Clears Markers (from the API Documentation)
   for (let i = 0; i < markers.length; i++) {
      if (markers[i]) {
         markers[i].setMap(null);
      }
   }
   markers = [];
}