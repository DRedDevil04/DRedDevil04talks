var mysql=require('mysql');
var http=require('http');
var fs=require('fs');
var url=require('url');
const { parse } = require('querystring');
const PORT = process.env.PORT || 8080;
const home=fs.readFileSync('./Template/Home.html','utf-8');
const loggedinpage=fs.readFileSync('./Template/loggedinpage.html','utf-8');

var con=mysql.createConnection({
	host:"172.20.10.2",
	user:"devam",
	password:"Dev@m2904",
	database: "blogProj"
});
let blogs;
con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
});
const server=http.createServer((req,res)=>{

	let {query,pathname:path}=url.parse(req.url,true);
	if (req.method === 'POST') {
		let body = '';
		req.on('data', chunk => {
			body += chunk.toString(); // convert Buffer to string
		});
		req.on('end', () => {
			let q=parse(body);
			console.log(q);
			if(path==='/login'){
				if(q.loginid==='devam'&&q.pswd==='Dev@m2904'){
					let siu=loggedinpage.replace('{{%%warning%%}}',' ');
					con.query("SELECT * FROM main",(err,result,field)=>{
						res.writeHead(200,{
							'Content-Type':'text/html'
						});
						let curr_date=new Date();
						let last_date=new Date(result[result.length-1].BlogDate);
						if((curr_date.getDate()===last_date.getDate())&&curr_date.getFullYear()===last_date.getFullYear()&&curr_date.getMonth()===last_date.getMonth()){
							siu=siu.replace('{{%%initial%%}}',result[result.length-1].BlogContents);
							res.end(siu);
						}
						else{
							siu=siu.replace('{{%%initial%%}}'," ");
							res.end(siu);
						}
						console.log(result[result.length-1].BlogDate);
					})
				}
				else{
					con.query("SELECT * FROM main",(err,result,field)=>{
						res.writeHead(200,{
							'Content-Type':'text/html'
						});
						let htm=home.replace('{{%%BLOG%%}}',result[result.length-1].BlogContents);
						let siu=htm.replace('{{%%DATE%%}}',result[result.length-1].BlogDate);
						siu=siu.replace('{{%%warning%%}}','*INVALID CREDENTIALS');
						res.end(siu);
						console.log(result[result.length-1].BlogDate);
					})
				}
			}
			else if(path==='/blogsubmit'){
				let newblog=q.newblog;
				let date=new Date();
				let day;
				let month;
				let year=date.getFullYear();
				const days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
				const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
				for(let i=0;i<7;i++){
					if(i==date.getDay()){
						day=days[i];
						break;
					}
				}
				for(let i=0;i<12;i++){
					if(i==date.getMonth()){
						month=months[i];
						break;
					}
				}
				let dat=date.getDate();
				// let final=`${day} ${dat} ${month} ${year}`;
				let final=date.toString();
				console.log(final);
				console.log(newblog);
				var sql = "INSERT INTO main (BlogContents, BlogDate) VALUES ('"+newblog+"','"+final+"')";
  				con.query(sql, function (err, result) {
    				if (err) throw err;
   					console.log("1 record inserted");
  				});
				con.query("SELECT * FROM main",(err,result,field)=>{
					res.writeHead(200,{
						'Content-Type':'text/html'
					});
					let htm=home.replace('{{%%BLOG%%}}',result[result.length-1].BlogContents);
					let siu=htm.replace('{{%%DATE%%}}',result[result.length-1].BlogDate);
					siu=siu.replace('{{%%warning%%}}',' ');
					res.end(siu);
					console.log(result[result.length-1].BlogDate);
				});
				
				
			}
			else if(path==='/oldblogs'){
				let d=(q.date);
				
				let date=new Date(d);
				
				var flag=0;
				con.query("SELECT * FROM main",(err,result,field)=>{
					res.writeHead(200,{
						'Content-Type':'text/html'
					});
					for(let i=result.length-1;i>=0;i--){
						let odat=new Date(result[i].BlogDate);
						// console.log(date.getDate()+" "+odat.getDate +" "+ date.getMonth+" "+odat.getMonth +" "+ date.getFullYear+" "+odat.getFullYear);
						if((date.getDate()===odat.getDate()) && (date.getMonth()===odat.getMonth()) && (date.getFullYear()===odat.getFullYear())){
							flag=1;
							let htm=home.replace('{{%%BLOG%%}}',result[i].BlogContents);
							let siu=htm.replace('{{%%DATE%%}}',result[i].BlogDate);
							siu=siu.replace('{{%%warning%%}}',' ');
							res.end(siu);
							console.log(result[i].BlogDate);
							break;
						}
					}
					if(flag==0){

						let htm=home.replace('{{%%BLOG%%}}','BLOG FOR FOLLOWING DATE DOESNT EXIST<br>PLEASE TRY ANOTHER DATE');
						let siu=htm.replace('{{%%DATE%%}}',date.toDateString());
						siu=siu.replace('{{%%warning%%}}',' ');
						res.end(siu);
						console.log('NO BLOG EXISTS');
					}
	
				});
			}
			
			
		});
	}
	// console.log(p);
	else{

	
		if(path==='/'){
			con.query("SELECT * FROM main",(err,result,field)=>{
			res.writeHead(200,{
				'Content-Type':'text/html'
			});
			let htm=home.replace('{{%%BLOG%%}}',result[(result.length)-1].BlogContents);
			let siu=htm.replace('{{%%DATE%%}}',result[(result.length)-1].BlogDate);
			siu=siu.replace('{{%%warning%%}}',' ');
			res.end(siu);
			console.log(result[result.length-1].BlogDate);
		});


		}
		else if(path==='/login'){
			res.end("FUCK OFF SCAMMER");
		}
		else{
			res.writeHead(404,{
				'Content-Type':'text/plain'
			});
			res.end("Error 404 File not Found")
		}
}
	console.log("New Request");
});


server.listen(PORT,'0.0.0.0',()=>{
	console.log("Server Started");
});














































// con.connect(function(err) {
//   	if (err) throw err;
//   	console.log("Hello");
//   	var md5 = require('md5');
// 	const express = require('express');
 
// 	const app = express();
 
// 	app.use(express.json());       
// 	app.use(express.urlencoded({extended: true})); 
 
// 	app.get("/", (req, res) => {
//   		res.sendFile(__dirname + "/index.html");
// 	});
 
// 	app.post("/", (req, res) => {
//   		const username = req.body.username;
//   		const password = req.body.password;
//   		con.query("SELECT * FROM LoginCred", function (err, result, fields) {
//     		if (err) throw err;
//     		if(username==result[0].Username && md5(password)==result[0].Password){
//     			res.send("1");
//     		}
//     		else{
//     			res.send("0");
//     		}
//   		});
// 	});
 
// 	app.listen(3000);
//   	var http=require('http');
//   	http.createServer(function (req, res) {
//   		res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1');
//   		con.query("SELECT * FROM main", function (err, result, fields) {
//     		if (err) throw err;
//     		console.log(result);
//     		console.log(JSON.stringify(result));
//     		res.writeHead(200, { 'Content-Type': 'application/json' });
//             res.write(JSON.stringify(result));
//   			res.end(); //end the response
//   		});
  		
//   }).listen(3001);
// });
// var md5 = require('md5');
// const express = require('express');
 
// const app = express();
 
// app.use(express.json());       
// app.use(express.urlencoded({extended: true})); 
 
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index.html");
// });
 
// app.post("/", (req, res) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   if(username==)
// });
 
// app.listen(3000);


// // const mysql = require('mysql');
// // const http = require('http');

// // const con = mysql.createConnection({
// //     host: "localhost",
// //     user: "devam",
// //     password: "Dev@m2904",
// //     database: "blogProj"
// // });

// // con.connect((err) => {
// //     if (err) throw err;
// //     console.log("Connected to MySQL database!");

// //     http.createServer(async (req, res) => {
// //         try {
// //             const results = await new Promise((resolve, reject) => {
// //                 con.query("SELECT * FROM main", (err, results, fields) => {
// //                     if (err) reject(err);
// //                     resolve(results);
// //                 });
// //             });

// //             res.writeHead(200, { 'Content-Type': 'application/json' });
// //             res.write(JSON.stringify(results));
// //             res.end();
// //         } catch (err) {
// //             console.error(err);
// //             res.writeHead(500, { 'Content-Type': 'text/plain' });
// //             res.write('Internal Server Error');
// //             res.end();
// //         }
// //     }).listen(8080);

// //     console.log("Server running on port 8080!");
// // });
