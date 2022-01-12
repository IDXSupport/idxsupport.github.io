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

function doMath(choice) {
  //This is the function that adds the query to the URL and the class or ID name. Assigns a value
  //to these vars when any button is clicked
  var urlSelector, elementSelector, totalSelector, c;
  urlSelector = document.getElementById("url").value; //take the value from the URL field
  elementSelector = formatTarget(document.getElementById("idName").value); //take the value from the class/id/element field

  // Might have changed the actual target with formatTarget, so set the idName input to whatever elementSelector is now.
  document.getElementById("idName").value = elementSelector;

  c = choice;

  // switch call for selecting ID or Class input
  switch (c) {
    case "1":
      urlSelector = "wrapper-v2?site=" + urlSelector;
      totalSelector = "&target=class&class=" + elementSelector;
      break;
    case "2":
      urlSelector = "wrapper-v2?site=" + urlSelector;
      totalSelector = "&target=id&id=" + elementSelector;
      break;
    case "3":
      urlSelector = "duda?site=" + urlSelector;
      totalSelector = "&target=id&id=" + elementSelector;
      break;
    case "4":
      urlSelector = "wrapper-v2?site=" + urlSelector;
      totalSelector = "&target=element&el=" + elementSelector;
      break;
    default:
      break;
  }
  //displays wrapper endpoint url
  document.getElementById("output").value =
    "https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/" +
    urlSelector +
    totalSelector +
    "&title=Search&h1Ignore=Y";

  copy();
  toasterNoti();
  //adds submissions in the console
  console.log(document.getElementById("output").value);
}

function cleary() {
  //Clears out the page values
  document.getElementById("url").value = "";
  document.getElementById("idName").value = "";
}
