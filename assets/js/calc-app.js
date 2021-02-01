function doMath(choise) {
  var n1, n2, r, c;
  n1 = parseFloat(document.getElementById("num1").value);
  n2 = parseFloat(document.getElementById("num2").value);
  c = choise;
//if n1 isNaN, n1=0
  if (isNaN(n1)){
    n1 = 0;
  }
  if (isNaN(n2)){
    n2 = 0;
  }

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
  if (isNaN(r)){ // 0 divided by 0 does not equal not a number, sort of...
    r = 0;
  }
  if (r == Infinity){ //infinity symbol and answer
    document.getElementById("answer").value = "Infinity";
    r='<i class="fas fa-infinity"></i>';
  }else{ //when the answer isn't infinity
    document.getElementById("answer").value = r;
  }
  document.getElementById("equation").innerHTML=(n1)+(s)+(n2)+"="+(r); //write equation below buttons
  document.getElementById("asymbol").innerHTML=(s); //write symbol between fields
}

function cleary() {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  document.getElementById("answer").value = "";
  document.getElementById("equation").innerHTML="";
}

function logTime(){
  now=(Date());
  console.log(now);
}