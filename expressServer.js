const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const http = require('http').Server(app); //requiring the http server to show the data through this server
const io = require('socket.io')(http); // requiring socket io library for bidirectional communication
// const MongoClient = require('mongodb').MongoClient;
const mongoose = require('mongoose');



//to use body parser we have to create a new middleware for that
app.use(bodyParser.json());
app.use(express.static(__dirname));  //use method is used for the static content to display on browser //static content like html page,image etc...
//creating middle ware body-parser so that body should be visible
app.use(bodyParser.urlencoded({extended:false}));


// var messages =[
//     {name:"Satyam",
//     message:"Hi"},

//     {name:"Simran",
//     message:"Heyaa"}
// ];
//creating a mongoose model (like defining a schema for collection)
var Message = mongoose.model('message',{
    name: String,
    message: String
})
app.get('/messages',function(req,res){
    Message.find({},(err , messages)=>{
        res.send(messages);
    })
})


app.post('/messages',function(req,res){
    //we don't have built in support to parse the body that's why we use body parser -> (req.body)
    //creating a new instance
    var message = new Message(req.body);
    //saving the message in db
    message.save((err)=>{
        if(err) sendStatus(500);
        // messages.push(req.body);
        io.emit('message',req.body);
        res.sendStatus(200);
    })
    
});

io.on('connection',(socket)=>{
    console.log("socket io connected successfully");
});


// connecting mongodb database with express app
const url = 'mongodb://127.0.0.1:27017/directConnection=true&serverSelectionTimeoutMS=2000';
// MongoClient.connect(url,(err)=>{
//     if(err) throw err;
//     console.log("mongodb connection");
// });

mongoose.connect(url,(err)=>{
    console.log("mongodb connection succcess");
});

//creating the server
var server = http.listen(3000,(err)=>{
    
    console.log("Server is running" ,server.address().port);
});