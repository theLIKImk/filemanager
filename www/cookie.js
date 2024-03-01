console.log("load js OK!");

function checkcookie(){
	document.cookie="check=cookie;";
	if (document.cookie=="") {
		return false;
	}
	cookieadd("check",null,0);
	return true;
}

function cookieadd(name,val,min){
	var now=new Date();
	now.setMinutes(now.getMinutes()+min);
	document.cookie = name.trim() + "=" + val + ";expires=" + now.toUTCString();
}

function cookierm(name){
	document.cookie= name + "=;";
	return;
}

function cookielist(){
	console.log(document.cookie);
	return;
}

function cookieget(name){
	var cookieArr = document.cookie.split(';'); 
	for (var i = 0; i < cookieArr.length; i++) {
		var cookiePair = cookieArr[i].split('=');
		if (name.trim() == cookiePair[0].trim()) {
			return cookiePair[1];
		}
	}
	return null;
}

function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function nowdate(){
	var date=new Date();
	var addmnth=date.getMonth()+1;
	var userdate=date.getFullYear() + "-" + addmnth + "-" + date.getDate();
	return userdate;
}