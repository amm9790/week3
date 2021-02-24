//express is a node modoule for bulding HTTP servers
const { resolveSoa } = require('dns');
var datastore = require('nedb');
var db = new datastore({ filename: 'database.json', autoload: true });
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var urlencodedBodyParser = bodyParser.urlencoded({extended: true});
app.use(urlencodedBodyParser);
//Tell express to look in the "public"
app.use(express.static("public"));

app.set('view engine', 'ejs');

var submittedData = [];
//The defult route of / and what to do!
app.get("/", function(req,res){
    res.send("Hello Hello thank you for connecting!");
});

app.get('/displayrecord', function (req,res){
    db.find({_id: req.query._id}, function(err,docs){
        var dataWrapper = {data: docs[0]};
        res.render("individul.ejs", dataWrapper );
       });
});

app.get('/search', function(req, res){
    // /searrch?q=text to search for
    console.log("search for: "+ req.query.q);
    var query = new RegExp (req.query.q, 'i');
    db.find({text: query}, function(err, docs){
        var dataWrapper = {data: docs};
        res.render("outputtemplate.ejs", dataWrapper );
    })
});

app.post('/formdata', function(req, res){
    console.log(req.body.data);

var dataToSave = {
    text: req.body.data,
    color: req.body.color,
    number: req.body.age,
    longtext:req.body.longtext
};
// console.log(dataToSave);
// submittedData.push(dataToSave);

db.insert(dataToSave, function (err, newDoc) {  
    db.find({}, function (err, docs) {
        var dataWrapper = {data: docs};
        res.render("outputtemplate.ejs",dataWrapper )
    
      });
  });

// console.log(submittedData);



// var output = "<html><body>";
// output += "<h1>Submitted Data</h1>";

// for (var i = 0; i < submittedData.length; i++){

//     output += "<div style='color: " + submittedData[i].color + "'>" + submittedData[i].text +"</div>"; 
// }
// output += "</body></html>";
// res.send(output);

// res.send("Got your data! You submitted:"+ req.body.data+""+req.body.color);

});

    app.listen(80, function (){
        console.log('Example app listening on part 80!')
    })
