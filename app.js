var config = require("config");
var express = require("express");
var session = require("express-session");
var BodyParser = require("body-parser"); // lấy thông tin từ formdata gửi lên với method post từ client

var app = express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({extended : true})); // lấy body trong form đưa lên   

app.set("trust proxy",1);
app.use(session({
    secret: config.get("secret_key"),
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.set("views",__dirname + "/apps/views");
app.set("view engine","ejs");

app.use("/static",express.static(__dirname + "/public"));

var controllers = require(__dirname + "/apps/controllers");
app.use(controllers);

var host = config.get("server.host");
var port = config.get("server.port");

app.listen(port,host,function(){
    console.log("server is running on port",port);

});