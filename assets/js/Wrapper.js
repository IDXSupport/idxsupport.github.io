
function toasterNoti() {
  //popup alert unhidden with CSS
  document.getElementById("copyUrl").innerHTML = "for " + document.getElementById("url").value;
  toaster = document.getElementById("toast");
  toaster.className = "show";
  setTimeout(function () {
    toaster.className = toast.className.replace("show", "");
  }, 5000);
}

function copyNew() {
  //add output field to clipboard +
  //display toast notification
  copyText = document.getElementById("output");
  copyText.select();
  document.execCommand("copy");
  toasterNoti();
}

// Removes any surrounding whitespace and Replaces any spaces with commas for use with the wrapper endpoint.
function formatTarget(target) {
  return target.trim().replaceAll(" ", ",");
}


let storageValue = localStorage.length
let collection = [];

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
    alert('here be dragons');return false;
  };
  document.getElementById("list").prepend(li)
  document.getElementById(idName).prepend(label)
  document.getElementById(idName).prepend(copyButton)

}


function doMath(choice) {
  //This is the function that adds the query to the URL and the class or ID name. Assigns a value
  //to these vars when any button is clicked
  let urlSelector, elementSelector, totalSelector, h1yn, title, c;
  urlSelector = document.getElementById("url").value; //take the value from the URL field
  elementSelector = formatTarget(document.getElementById("idName").value); //take the value from the class/id/element field

  // Might have changed the actual target with formatTarget, so set the idName input to whatever elementSelector is now.
  document.getElementById("idName").value = elementSelector;

  if(document.getElementById("title").value != ''){
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
  
  // Add the data to local storage for react to pull
  localStorage.setItem(storageValue, outPut.value)


  toasterNoti();
  
  displayStorage(storageValue);
  storageValue++
  
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
