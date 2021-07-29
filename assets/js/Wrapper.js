function toasterNoti() {
  //popup alert unhidden with CSS
  document.getElementById("copyUrl").innerHTML = output.value;
  toaster = document.getElementById("toast");
  toaster.className = "show";
  setTimeout(function () {
    toaster.className = toast.className.replace("show", "");
  }, 3000);
}

function copy() {
  //add output field to clipboard +
  //display toast notification
  copyText = document.getElementById("output");
  copyText.select();
  document.execCommand("copy");
  toasterNoti();
}

function doMath(choise) {
  //This is the function that adds the query to the URL and the class or ID name. Assigns a value
  //to these vars when any button is clicked
  var urlSelector, classSelector, idSelector, totalSelector, c;
  urlSelector = document.getElementById("url").value; //take the value from the URL field
  classSelector = document.getElementById("className").value; //take the value from the class name field
  idSelector = document.getElementById("idName").value; //take the value form the ID field 

  c = choise;

  // switch call for selecting ID or Class input
  switch (c) {
    case "1":
      urlSelector = "wrapper?site="+urlSelector;
      totalSelector = "&target=class&class=" + classSelector;
      break;
    case "2":
      urlSelector = "wrapper?site="+urlSelector;
      totalSelector = "&target=id&id=" + idSelector;
      break;
    case "3":
      urlSelector = "duda?site="+urlSelector;
      totalSelector = "&target=id&id=" + idSelector;
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
}

function cleary() {
  //Clears out the page values
  document.getElementById("url").value = "";
  document.getElementById("className").value = "";
  document.getElementById("idName").value = "";
  document.getElementById("output").value = "";
}
