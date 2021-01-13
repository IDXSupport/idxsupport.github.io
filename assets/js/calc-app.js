function doMath(choise) {
  var n1, n2, r, c;
  n1 = parseFloat(document.getElementById("num1").value);
  n2 = parseFloat(document.getElementById("num2").value);
  c = choise;

  switch (c) {
    case "1":
      r = n1 + n2;
      s = "+";

      break;
    case "2":
      r = n1 - n2;
      s = "-";
      break;
    case "3":
      r = n1 * n2;
      s = "X";
      break;
    case "4":
      r = n1 / n2;
      s = "/";
      break;
    default:
      break;
  }
  document.getElementById("answer").value = r;
  document.getElementById("equation").innerHTML=(n1)+(s)+(n2)+"="+(r);
  document.getElementById("asymbol").innerHTML=(s);
}

function cleary() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("answer").value = "";
  document.getElementById("equation").innerHTML="";
}




function logTime(){
  console.log(Date);
}