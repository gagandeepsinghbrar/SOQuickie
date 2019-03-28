// Urls that the user might want to look through
var nextUrls = [];
// last index of nextUrls
var maxIndex;
// currentTab reference that is opened by the user ( active tab )
var currentTab;
// keep a pointer of where we are in the nextUrls
var counter = 0;
var page_tag = document.getElementById("page")
var page_total_tag =document.getElementById("page_total")
var main_wrapper_div = document.getElementById("wrapper")
var btn_wrap=document.getElementById("buttons-wrapper")
var inputBox = document.getElementById("classyinp")
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
var next_was_last_clicked=false;

function inputHandler(e) {
          e.stopPropagation();
          if (e.keyCode == 13) {
            createTabWithUrl(e.target.value);
            // store to local storage
            chrome.storage.sync.set({ "last_search": e.target.value }, function(){
            
          });
            e.target.blur()
          } else if (e.keyCode == 192) {
            e.target.value = "";
          }


                         }
function createTabWithUrl(queryString) {
  nextUrls = [];
  maxIndex = null;
  counter = 0;
  // empty html dom element
  var doc = document.createElement("html");

  
  btn_wrap.style.display="block";
  // grab the data and convert it to text
  fetch("https://www.google.com/search?q=" + queryString + " stack overflow")
    .then(strm => {
      return strm.text();
    })
    .then(resp => {



      // assign text to our html dom node
      doc.innerHTML = resp;
      // find all a tags in results section
      allElements = doc.querySelector("#res").getElementsByTagName("a");


      
      // store the next 10 urls for later use
      for (var i = 0; i < allElements.length; i++) {
        // make sure it is a stackoverflow link
        if (allElements[i].href.startsWith("https://stackoverflow.com")) {
          // add it to our urls array
          nextUrls.push(allElements[i]);
        }
      }
      // show page numbers
      page_tag.innerHTML=counter+1;
      page_total.innerHTML=nextUrls.length;
      // store the last index
      maxIndex = nextUrls.length;

      // chrome.tabs.create({ url: allElements[0].href + "#answers-header" });
      chrome.tabs.query({ active: true }, function(activated) {
        // found the activate tab
        currentTab = activated;

        // update that tab by giving the id of activate tab to update()
        chrome.tabs.update(activated.id, {
          url: nextUrls[0].href + "#answers-header"
        });



        counter++;

      });
     


      ranOnce=true
      console.log(nextUrls.map(lst=> lst.href.split("stackoverflow")[1].split("/")[2]))
      // window.setTimeout(function() {
      //   window.close();
      // }, 8000);

        
      return;
    });
}
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

function prevListener(e) {
   
   if(next_was_last_clicked){

      if(counter>=2){
        counter=counter-2;
      }
      else{
        counter = maxIndex-1;
      }

   }
   else{

        if(counter>=1){
          counter=counter-1
        }
        else{
          counter = maxIndex-1;
        }

   }


    chrome.tabs.update(currentTab.id, {
      url: nextUrls[counter].href + "#answers-header"
    });


    page_tag.innerHTML= counter+1;
   

    


   next_was_last_clicked=false;
  }

// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><

function nextListener(e) {
    next_was_last_clicked=true;
    console.log("Index that we used was:  "+counter)
    chrome.tabs.update(currentTab.id, {
      url: nextUrls[counter].href + "#answers-header"
    });

    counter = counter<maxIndex-1 ? counter+1 : 0 
    console.log("for the next time we will have:  "+counter)
    page_tag.innerHTML= counter!=0 ? counter : maxIndex;
    console.log("Page number will be :  "+counter)
    // next_was_clicked=true;
  }

// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
function forwardArrow(e){

  if(e.keyCode==37) prevListener()
  else if(e.keyCode==39) nextListener();
}
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
  document.addEventListener("DOMContentLoaded", function() {

      chrome.storage.sync.get(["last_search"], function(items){
            if(items.last_search){
              inputBox.value=items.last_search
            }
            
      });
      btn_wrap.style.display="none";
      document.getElementById("prev").addEventListener("click", prevListener);
      document.getElementById("next").addEventListener("click", nextListener);
      inputBox.focus();
      inputBox.addEventListener("keyup", inputHandler);
      document.addEventListener("keyup",forwardArrow)
});

// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
// <><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><<><><><><><
