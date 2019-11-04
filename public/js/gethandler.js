function validateForm(){
var name=document.myForm.name.value;
var password=document.myForm.password.value;
if (name==null||name==""){
 alert("Name can't be empty");
return false;
}
}
window.addEventListener('load', function(){
  url = new URL(window.location.href);
  err = url.searchParams.get("error");
  msg = url.searchParams.get("message");
  if(err === "auth/invalid-email"){
    error_box = document.getElementById("error-box");
    error_box.innerText = "Invalid Login, please try again";
    error_box.style.visibility = 'visible';
  }
  else if(err){
    error_box = document.getElementById("error-box");
    error_box.innerText = err;
    error_box.style.visibility = 'visible';
  }
  if(msg === "registered"){
    message_box = document.getElementById("info-box");
    message_box.innerText = "New account created! Login now!";
    message_box.style.visibility = 'visible';
  }
  else if(msg){
    message_box = document.getElementById("info-box");
    message_box.innerText = msg;
    message_box.style.visibility = 'visible';
  }
});
