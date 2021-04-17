function copy(that){
    var inp =document.createElement('input');
    document.body.appendChild(inp)
    inp.value =that.textContent
    inp.select();
    document.execCommand('copy',false);
    inp.remove();
    document.getElementById("output").classname='classname';
    }




function doMath(choise) {
    var n1, n2, n3, r, c;
    n1 = document.getElementById("url").value;
    n2 = document.getElementById("className").value;
    n3 = document.getElementById("idName").value;

    c = choise;

  
switch (c) {
    case "1":
        r = "&target=class&class="+n2;
    break;
    case "2":
        r = "&target=id&id="+n3;
    break;
    default:
    break;
    }
    document.getElementById("output").innerHTML="https://zl6t6xxpc2.execute-api.us-west-2.amazonaws.com/wrappers/wrapper?site="+(n1)+(r)+"&title=Search&h1Ignore=Y";
  }
  
  function cleary() {
    document.getElementById("url").value = "";
    document.getElementById("className").value = "";
    document.getElementById("idName").value = "";
    document.getElementById("output").innerHTML = "";
  }