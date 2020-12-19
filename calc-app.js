function doMath(choise) {
  var n1, n2, r, c;
  n1 = parseFloat(document.getElementById("num1").value);
  n2 = parseFloat(document.getElementById("num2").value);
  c = choise;

  switch (c) {
    case "1":
      r = n1 + n2;
      break;
    case "2":
      r = n1 - n2;
      break;
    case "3":
      r = n1 * n2;
      break;
    case "4":
      r = n1 / n2;
      break;
    default:
      break;
  }
  document.getElementById("answer").value = r;
}

function cleary() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("answer").value = "";
}
