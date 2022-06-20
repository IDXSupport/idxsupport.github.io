function toasterNoti() {
  //popup alert unhidden with CSS
  document.getElementById("copyUrl").innerHTML = output.value;
  toaster = document.getElementById("toast");
  toaster.className = "show";
  setTimeout(function () {
    toaster.className = toast.className.replace("show", "");
  }, 5000);
}

function copy() {
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

let collection = [];


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
  copy();


  toasterNoti();
  
  
  //Keeps a record of the console.logs you've made during this session
  //Made it a checkbox so you can 'favorite' the ones you like
  let li = document.createElement("input");
  let label = document.createElement("label")
  
  collection.unshift(
    outPut.value)
  
  label.innerHTML = collection[0] + `<br>`
  li.type = 'checkbox'
  document.getElementById("list").prepend(label)
  document.getElementById("list").prepend(li)

  // Add the data to local storage for react to pull
  localStorage.setItem(Date.now(), outPut.value);
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
}
