const input = document.querySelector('input[type="file"]');

//Currently up-to-date list of file names supported by the system (some will be ignored)
//Future updated compatabliity will require adding file names to this list (or removing the exception handling)
const supportedFiles = [
   "location_history.json",
   "talk_history.json",
   "snap_tokens_order_history.json",
   "scans.json",
   "purchase_history.json",
   "email_campaign_history.json",
   "search_history.json",
   "bitmoji_kit_user.json",
   "netsuite_orders.json",
   "community_lenses.json",
   "shared_story.json",
   "user_profile.json",
   "terms_history.json",
   "connected_apps.json",
   "cameos_metadata.json",
   "snap_pro.json",
   "ranking.json",
   "subscriptions.json",
   "account.json",
   "memories_history.json",
   "in_app_surveys.json",
   "snap_ads.json",
   "bitmoji.json",
   "in_app_reports.json",
   "snap_map_places_history.json",
   "chat_history.json",
   "snap_history.json",
   "account_history.json",
   "support_note.json",
   "story_history.json",
   "snap_games_and_minis.json",
   "shop_history.json",
   "friends.json",
];

function handleFiles(files) {
   try {
      //Throws error if user accidentally imports only one file
      //May be better to check for all 33 files uploaded but if there are more than one files selected but not all, it is assumed to be intentional
      for (var i = 0; i < files.length; i++) {
         //checks for supported file type (currently only json)
         if (files[i].type === "application/json") {
            //checks file names against list of known supported files
            //https://stackoverflow.com/a/5582621/15325119
            if (new RegExp(supportedFiles.join("|")).test(files[i].name)) {
               //if checks are passed, files get added to browser localStorage before user is redirected to the Location View
               let FILE_KEY = files[i].name;
               const reader = new FileReader();
               reader.onload = function () {
                  let save = JSON.parse(reader.result);
                  window.localStorage.setItem(FILE_KEY, JSON.stringify(save));
               };
               reader.readAsText(files[i]);
            } else {
               throw "Unsupported Data File";
            }
         } else {
            throw "Wrong File Type";
         }
      }
      if (files.length === 1) {
         throw "Only 1 file imported";
      }
      //redirects to Location View after successful file import
      //Delay added because there was an error where the loop would finish execution and redirect the page before larger files were finished being read and added to localStorage
      setTimeout(() => { window.location.href = "Location View/Location.html"; }, 200);

   } catch (err) {
      if (err === "Wrong File Type") {
         alert(
            "The system only supports data files that end in .json. Please refer to the instructions on how to find these files."
         );
      } else if (err === "Unsupported Data File") {
         alert(
            "The system currently only supports user data files from Snapchat. Please make sure that the data files are from a Snapchat data export."
         );
      } else if (err === "Only 1 file imported") {
         alert(
            "Select all files for import by selecting the one at the top of the list, holding shift, selecting the one at the bottom, then releasing shift. Refer to video for more details."
         );
      } else {
         alert(
            "Please review and follow instructions to download and then import the correct files."
         );
      }
   }
}


input.addEventListener("change", function (e) {
      handleFiles(input.files);
   },
   false
);

function dropHandler(e) {
   e.preventDefault();
   e.stopPropagation();
   handleFiles(e.dataTransfer.files);
   document.getElementById("drop_zone").style.background = "grey";
}

function dragOverHandler(e) {
   e.preventDefault();
   e.stopPropagation();
   document.getElementById("drop_zone").style.background = "lightgrey";
}

function leaveHandler() {
   document.getElementById("drop_zone").style.background = "grey";
}
