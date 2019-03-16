// Urls that the user might want to look through
var nextUrls = [];
// last index of nextUrls
var maxIndex;
// currentTab reference that is opened by the user ( active tab )
var currentTab;
// keep a pointer of where we are in the nextUrls
var counter = 0;

// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

function createTabWithUrl(queryString) {
  // empty html dom element
  var doc = document.createElement("html");

  // grab the data and convert it to text
  fetch("https://www.google.com/search?q=" + queryString + " stackoverflow")
    .then(strm => {
      return strm.text();
    })
    .then(resp => {
      // assign text to our html dom node
      doc.innerHTML = resp;
      // find all a tags in results section
      allElements = doc.querySelector("#res").getElementsByTagName("a");

      // store the next 10 urls for later use
      for (var i = 1; i < 10; i++) {
        // make sure it is a stackoverflow link
        if (allElements[i].href.startsWith("https://stackoverflow")) {
          // add it to our urls array
          nextUrls.push(allElements[i]);
        }
      }
      // store the last index
      maxIndex = nextUrls.length - 1;

      // chrome.tabs.create({ url: allElements[0].href + "#answers-header" });
      chrome.tabs.query({ active: true }, function(activated) {
        // found the activate tab
        currentTab = activated;

        // update that tab by giving the id of activate tab to update()
        chrome.tabs.update(activated.id, {
          url: allElements[0].href + "#answers-header"
        });
      });

      // window.setTimeout(function() {
      //   window.close();
      // }, 8000);
      return;
    });
}
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("prev").addEventListener("click", function(e) {
    chrome.tabs.update(currentTab.id, {
      url: nextUrls[counter].href + "#answers-header"
    });

    counter = counter > 0 ? counter - 1 : maxIndex;
  });

  // <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
  // <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

  document.getElementById("next").addEventListener("click", function(e) {
    chrome.tabs.update(currentTab.id, {
      url: nextUrls[counter].href + "#answers-header"
    });

    counter = counter < maxIndex ? counter + 1 : 0;
  });

  // <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
  // <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

  // Brings the cursor to input on opening the popup
  document.getElementById("classyinp").focus();

  // <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
  // <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

  // check what key user presses. ' to clear. Enter to call function
  document.getElementById("classyinp").addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
      createTabWithUrl(e.target.value);
    } else if (e.keyCode == 192) {
      e.target.value = "";
    }
  });
});

// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
