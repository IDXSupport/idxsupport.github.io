
function toasterNoti(isTrue,displayText) {
  //popup alert unhidden with CSS
  document.getElementById("copyUrl").innerHTML = displayText;
  toaster = document.getElementById("toast");
  // toaster.className = "show";
  if (isTrue == true) {
    toaster.className = "success show"
    setTimeout(function () {
      toaster.className = toast.className.replace("success show", "");
    }, 5000);
  } else {
    toaster.className = "fail show"
    setTimeout(function () {
      toaster.className = toast.className.replace("fail show", "");
    }, 5000);
  }
}

function copyNew() {
  //add output field to clipboard +
  //display toast notification
  copyText = document.getElementById("output");
  copyText.select();
  navigator.clipboard.writeText(copyText.value);
}

// Removes any surrounding whitespace and Replaces any spaces with commas for use with the wrapper endpoint.
function formatTarget(target) {
  return target.trim().replaceAll(" ", ",");
}


let storageValue = localStorage.length

function displayStorage(idName) {
    //Keeps a record of the console.logs you've made during this session
  //Made it a checkbox so you can 'favorite' the ones you like
  let li = document.createElement("li")
  let copyButton = document.createElement("button")
  let label = document.createElement("label")
  label.innerHTML = localStorage.getItem(idName)
  copyButton.className = 'copyButton calc-button'
  li.id = idName
  
  copyButton.onclick = function(){
    copyDivToClipboard(idName)
    toasterNoti(true,label.innerHTML)
  };
  document.getElementById("list").prepend(li)
  document.getElementById(idName).prepend(label)
  document.getElementById(idName).prepend(copyButton)
}

function copyDivToClipboard(elementId) {
  var range = document.createRange();
  range.selectNode(document.getElementById(elementId));
  console.log(elementId)
  window.getSelection().removeAllRanges(); // clear current selection
  window.getSelection().addRange(range); // to select text
  navigator.clipboard.writeText(elementId.value);
  window.getSelection().removeAllRanges();// to deselect
}

function doMath(choice) {
  //This is the function that adds the query to the URL and the class or ID name. Assigns a value
  //to these vars when any button is clicked
  let urlSelector, elementSelector, totalSelector, h1yn, title, c;
  urlSelector = document.getElementById("url").value; //take the value from the URL field
  elementSelector = formatTarget(document.getElementById("idName").value); //take the value from the class/id/element field

  // Might have changed the actual target with formatTarget, so set the idName input to whatever elementSelector is now.
  document.getElementById("idName").value = elementSelector;
  
  if (urlSelector == '') {
    toasterNoti(false, "You should probably enter a URL")
  } else if (isValidHttpUrl(urlSelector) != true) {
    toasterNoti(false, "Your URL doesn't look right... Did you include the protocal?")
  } else {
    if (elementSelector == '') {
      toasterNoti(false, "You're going to need to choose an element")
    } else {
      if (document.getElementById("title").value != '') {
        title = "&title=" + document.getElementById("title").value;
      } else {
        title = '';
      }


    if (document.getElementById("h1ignoreCheck").checked == 1) {
      h1yn = "&h1Ignore=Y";
    } else {
      h1yn = "&h1Ignore=N";
    };


    c = choice;

    // switch call for selecting ID or Class input
    switch (c) {
      case "class":
        urlSelector = "wrapper-v2?site=" + urlSelector;
        totalSelector = "&target=class&class=" + elementSelector;
        break;
      case "id":
        urlSelector = "wrapper-v2?site=" + urlSelector;
        totalSelector = "&target=id&id=" + elementSelector;
        break;
      case "duda":
        urlSelector = "duda?site=" + urlSelector;
        totalSelector = "&target=id&id=" + elementSelector;
        break;
      case "element":
        urlSelector = "wrapper-v2?site=" + urlSelector;
        totalSelector = "&target=element&el=" + elementSelector;
        break;
      default:
        break;
    }

    const outPut = document.getElementById("output")
    
    
    
    //displays wrapper endpoint url
    outPut.value =
      "https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/" +
      urlSelector +
      totalSelector +
      title +
      h1yn;
    copyNew();

    let text = document.getElementById("url")
    toasterNoti(true, c.toUpperCase() + ' selected for "' + text.value + '"')
    // Add the data to local storage for react to pull
    localStorage.setItem(storageValue, outPut.value)


    
    displayStorage(storageValue);
    storageValue++
  }
  }
}

function cleary() {
  //Clears out the page values
  document.getElementById("url").value = "";
  document.getElementById("idName").value = ""; 
  document.getElementById("output").value = ""; 
}

function clearStorage() {
  localStorage.clear();
  let outputtedList = document.getElementById("list")
  outputtedList.innerHTML = '';
  // Get the modal
  var modal = document.getElementById('id01');
  modal.style.display = "none";
  storageValue = 1
}

// Run on load to grab old endpoints from storage
function loadStorage() {
  for (let i = storageValue - 1; i >= 0; i--){
    displayStorage(localStorage.key(i))
  }
  storageValue = localStorage.length + 1
}

function copyFromStorage(target) {
  copyTarget = document.getElementById(target).innerHTML
  console.log(localStorage.getItem(target))
}


function isValidHttpUrl(string) {
  let url;
  
  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
