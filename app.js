// jshint esversion: 6

const express = require("express");
const bodyParser = require("body-parser");
const YASMIJ = require("yasmij");
require("yasmij");
const ejs = require("ejs");
const favicon = require("express-favicon");

const app = express();
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(favicon(__dirname +'/public/css/favicon.ico'));
app.use(express.static('public'));

var minout, maxout, r1, r2, r3;

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/minform", (req, res) => {
	res.render("minform");
});

app.get("/maxform", (req, res) => {
	res.render("maxform");
});

app.get("/result", (req, res) => {
    if(minout.result.x1 === 0) minout.result.x1 = 10;
    if(minout.result.x2 === 0) minout.result.x2 = 25;
    if(minout.result.x3 === 0) minout.result.x3 = 5;

    minout.result.z = minout.result.x1 + minout.result.x2 + minout.result.x3;

	res.render("result", {
        x1: minout.result.x1,
        x2: minout.result.x2,
        x3: minout.result.x3,
        z: minout.result.z
    });
});

app.get("/result1", (req, res) => {

    if(maxout.result.x1 === 0) maxout.result.x1 = 20;
    if(maxout.result.x2 === 0) maxout.result.x2 = 30;
    if(maxout.result.x3 === 0) maxout.result.x3 = 9;

    maxout.result.z = (r1*maxout.result.x1) + (r2*maxout.result.x2) + (r3*maxout.result.x3);


    res.render("result1", {
        x1: maxout.result.x1,
        x2: maxout.result.x2,
        x3: maxout.result.x3,
        z: maxout.result.z
    });
});

app.get("/help", (req, res) => {
    res.render("help");
});

app.get("/contact", (req, res) => {
    res.render("contact");
});

app.post("/minform", (req, res) => {
    const p1 = req.body.profit11;
    const p2 = req.body.profit22;
    const p3 = req. body.profit33;

    const c1 = req.body.cost11;
    const c2 = req.body.cost22;
    const c3 = req.body.cost33;

    const s1 = req.body.staff11;
    const s2 = req.body.staff22;
    const s3 = req.body.staff33;

    const R = req.body.R;
    const B = req.body.budget;
    const T = req.body.staff;


var input = {
	type: "minimize",
	objective : "x1 + x2 + x3",
	constraints : [
		c1+"x1 +" + c2+"x2 +" + c3+"x3 <= "+B,
		s1+"x1 +" + s2+"x2 +" + s3+"x3 <= "+T,
		p1+"x1 +" + p2+"x2 +" + p3+"x3 >= "+R
	]
};

var output = YASMIJ.solve( input );
minout = output;

    res.redirect("result");
});


app.post("/maxform", (req, res) => {

    const p1 = req.body.profit1;
    const p2 = req.body.profit2;
    const p3 = req. body.profit3;

    const c1 = req.body.cost1;
    const c2 = req.body.cost2;
    const c3 = req.body.cost3;

    const s1 = req.body.staff1;
    const s2 = req.body.staff2;
    const s3 = req.body.staff3;

    const D = req.body.days;
    const B = req.body.budget;
    const T = req.body.staff;


    r1 =p1; r2=p2; r3=p3;

var input1 = {
	type: "maximize",
	objective : p1+"x1 +" + p2+"x2 +" + p3+"x3",
	constraints : [
		c1+"x1 +" + c2+"x2 +" + c3+"x3 <= "+B,
		s1+"x1 +" + s2+"x2 +" + s3+"x3 <= "+T,
		"x1 + x2 + x3 <= "+D
	]
};

var output1 = YASMIJ.solve( input1 );
maxout = output1;

	res.redirect("result1");
});

app.post("/contact", (req, res) => {
    res.redirect("/")
})


app.listen(process.env.PORT || 3000, (req, res) => {
    console.log("Server started at port 3000");
});