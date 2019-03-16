var nextUrls = [];
var maxIndex;
var currentTab;
var counter = 0;
function createTabWithUrl(queryString) {
  var doc = document.createElement("html");
  fetch("https://www.google.com/search?q=" + queryString + " stackoverflow")
    .then(strm => {
      return strm.text();
    })
    .then(resp => {
      doc.innerHTML = resp;

      allElements = doc.querySelector("#res").getElementsByTagName("a");

      // store the next urls for later use
      for (var i = 1; i < 10; i++) {
        if (allElements[i].href.startsWith("https://stackoverflow")) {
          nextUrls.push(allElements[i]);
          console.log(allElements[i].href);
        }
      }

      maxIndex = nextUrls.length - 1;

      // have been creating tabs by mistake
      // chrome.tabs.create({ url: allElements[0].href + "#answers-header" });
      chrome.tabs.query({ active: true }, function(activated) {
        currentTab = activated;
        chrome.tabs.update(activated.id, {
          url: allElements[0].href + "#answers-header"
        });
      });
      // .update({ url: allElements[0].href + "#answers-header" });
      // window.setTimeout(function() {
      //   window.close();
      // }, 8000);
      return;
    });
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById("prev").addEventListener("click", function(e) {
    chrome.tabs.update(currentTab.id, {
      url: nextUrls[counter].href + "#answers-header"
    });

    counter = counter > 0 ? counter - 1 : maxIndex;
  });
  document.getElementById("next").addEventListener("click", function(e) {
    // need to fix bugs here

    chrome.tabs.update(currentTab.id, {
      url: nextUrls[counter].href + "#answers-header"
    });

    counter = counter < maxIndex ? counter + 1 : 0;
  });

  document.getElementById("classyinp").focus();
  document.getElementById("classyinp").addEventListener("keyup", function(e) {
    if (e.keyCode == 13) {
      createTabWithUrl(e.target.value);
    } else if (e.keyCode == 192) {
      e.target.value = "";
    }
  });
});
