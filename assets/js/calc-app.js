var n1, n2, c, symb, r;

//does the math
function doMath(choise) {
  n1 = parseFloat(document.getElementById("num1").value);
  n2 = parseFloat(document.getElementById("num2").value);
  c = choise;
//each line does the math equation. Each button assigned to a
//a different "case" button [] to pull answer from
  switch (c) {
    case "1":
      r = n1 + n2;
      document.getElementById("symb").innerHTML = "+";
      break;
    case "2":
      r = n1 - n2;
      document.getElementById("symb").innerHTML = "-";
      break;
    case "3":
      r = n1 * n2;
      document.getElementById("symb").innerHTML = "x";
      break;
    case "4":
      r = n1 / n2;
      document.getElementById("symb").innerHTML = "/";
      break;
    default:
      break;
  }
  document.getElementById("answer").value = r;
  console.log(r);
  symb = document.getElementById("symb").innerHTML;
//prints equation into the "log" div
  document.getElementById("log").innerHTML = n1 + " " + symb + " " + n2 +" = "+ r;
}
//clear values button
function cleary() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("answer").value = "";
  document.getElementById("log").innerHTML = "";
}
