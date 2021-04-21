function doMath(choise) {
    var urlSelector, classSelector, idSelector, aSelector, c, copyText;
    urlSelector = document.getElementById("url").value;
    classSelector = document.getElementById("className").value;
    idSelector = document.getElementById("idName").value;

    c = choise;

 // Switch for selecting ID or Class input
switch (c) {
    case "1":
        aSelector = "&target=class&class="+classSelector;
    break;
    case "2":
        aSelector = "&target=id&id="+idSelector;
    break;
    default:
    break;
    }
    //displays wrapper endpoint url
    document.getElementById("output").value="https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper?site="+(urlSelector)+(aSelector)+"&title=Search&h1Ignore=Y";

    //copies endpoint url when selecting ID or Class button
    copyText = document.getElementById("output"); 
    copyText.select();
    document.execCommand("copy");

    //popup alert
    alert("Copied "+copyText.value+" to clipboard");

  }
  
  //Clears out the page values
  function cleary() {
    document.getElementById("url").value = "";
    document.getElementById("className").value = "";
    document.getElementById("idName").value = "";
    document.getElementById("output").value = "";
  }