const http = require('http');
const fs = require('fs');
const url = require('url');
const util = require('util');
//local modules
const ejs = require('ejs');
const formidable = require('formidable');

//设定
const ___dir = "./www";
const port = 80;
___path = "";
___url="";

//用户组
userg=[
	{user: 'admin', passwd: 'admin'},
	{user: 'user', passwd: '123465'}
];

//会话ID
userLoginUUID=[];

http.createServer(function (req, res) {
	url_name = url.parse(req.url,true).pathname;
	url_val = url.parse(req.url,true).query;
	url_allval = url.parse(req.url,true).search;
		
	if (url_name == "/"){
		url_name="/file.html";
	} else if ( url_name == "/login" ){
		login(res,req);
		return;
	} else if ( url_name == "/f" ){
		userFormDate(res,req);
		return;
	} else if ( url_name == "/upload" ){
		upload(res,req);
		return;
	}
 
	___url=url_name;
	___path = ___dir+___url;
	
	console.log(___path);
	loadfile(res,req);
}).listen(port);

async function login(res,req){
	//异步转同步
	const form = new formidable.IncomingForm();
	const formParseAsync = util.promisify(form.parse.bind(form));
	
	// 解析表单数据
	var formData = null;
	formData = await formParseAsync(req);
	
	console.log("[LOGIN FORM] " + formData.user + "-" + formData.passwd);
	
	res.writeHead(200, {'Content-Type': 'text/json'});
	
	//解析用户列表
	for (var i=0 ; i < userg.length; i++){
		if(formData.user==userg[i].user && formData.passwd==userg[i].passwd) {
			
			//创建会话ID
			var getloginUUID=getUuid();
			console.log("Login OK! ID: " + getloginUUID);
			userLoginUUID[getloginUUID]=true;
			res.end('{"login":"0","msg":"","loginUUID":"' + getloginUUID + '"}');
			return;
		}
	}
	console.log('Login Fail！');
	res.end('{"login":"1","msg":"Login Fail！"}');
    return;
}


function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


function userFormDate(res,req){
	
	//没会话ID不给予任何操作
	if (!userLoginUUID[url_val.loginUUID]) {
		console.log("[INDEX NO_LOGIN_USER]");
		backJSON(res,'{"code":"1","msg":"not login"}')
		return;
	}
	
	console.log("[INDEX LOGIN_USER]");
	var filelist = showDir(url_val.dir);
	backJSON(res,'{"code":"0","msg":"","filelist":'+ JSON.stringify(filelist) +'}')
}


function showDir(dir){
	var item_list=[];
	var item_info={};
	var item_num=0;
	var nowInPath=___dir + '/' + dir;



	//读取目录
	const items=fs.readdirSync(nowInPath);
	
	items.forEach(item => {
		item_info={};
		
		const stat = fs.statSync(nowInPath +"/"+ item);
		var item_date = stat.mtime.toString().split(" "); 
		var item_size = stat.size.toString(); 
		
		item_info["name"] = item;
		
		//是否为文件夹
		if (stat.isDirectory())item_info["type"] = "dir";
		else item_info["type"] = "file";
		
		item_info["size"] = item_size;
		item_info["date"] = item_date;

		//加入列表
		item_list[item_num]=item_info;
		item_num++;
	});
	
	return item_list;
}


function errHtml(res,code,msg){
	console.log("[ERR]" + msg);
	res.writeHead(code, {'Content-Type': 'text/html; charset=utf-8'});
	res.end(msg);
}
function backJSON(res,json){
	console.log("[JSON]" + json);
	res.writeHead(200, {'Content-Type': 'text/json; charset=utf-8'});
	res.end(json);
}

function loadfile(res,req){
	console.log("[LOAD_DIR_FILE]");
	var headType = ___path.substr(___path.lastIndexOf(".") + 1, ___path.length);
	
	fs.readFile(___path, function (err, data) {
		if (err) {
			//404
			errHtml(res,404,"err");
			return;
		}else{
			if (headType=="gif" || headType=="png" || headType=="jpg") {
				res.writeHead(200, {'Content-Type': 'image/' + headType});
			} else if (headType=="svg") {
				res.writeHead(200, {'Content-Type': 'image/svg+xml'});
			} else if (headType=="js") {
				res.writeHead(200, {'Content-Type': 'application/javascript'});
			} else if (headType=="mp4") {
				res.writeHead(200, {'Content-Type': 'video/' + headType});
			} else {
				res.writeHead(200, {'Content-Type': 'text/' + headType});
			}
			res.write(data);
		}
		res.end();
	});
	return;
}


console.log('OK! Server running at http://127.0.0.1:' + port + '/');
console.log('____________________________________________\n');
