let app = require('express')();

let express = require('express');
let http = require('http').Server(app);
let io = require('socket.io')(http);
let mongoose = require('mongoose');
let MongoClient = require('mongodb').MongoClient;
let session = require('express-session');
const SocketIOFile = require('socket.io-file');

app.use(express.static(__dirname + '/css'));

const bodyParser = require('body-parser');



app.get('/css/normalize.css', function(req, res){
    res.sendFile(__dirname + '/css/normalize.css');
});


app.get('/css/main.css', function(req, res){
    res.sendFile(__dirname + '/css/main.css');
});

app.use(express.static(__dirname+'/gennect'));
app.use(express.static(__dirname+'/css'));
app.use(express.static(__dirname+'/fonts'));
app.use(express.static(__dirname+'/gfx'));





//mongodb://<dbuser>:<dbpassword>@ds127825.mlab.com:27825/minder

let conString = "mongodb://admin:hackville2019@ds127825.mlab.com:27825/minder";
/**
 * Models
 */
let Chat = mongoose.model("Chat", {
    name: String,
    message: String
});

let db;
let chats;



MongoClient.connect(conString,  (err, client) => {
    if (err) return console.log(err);

    /**
     let dummyChat={
        name:"Saad",
        message:"HI"
    };

     db = client.db('minder');

     db.collection('chats').save(dummyChat);


     */

    http.listen(3000, function(){
        console.log('listening on *:3000');
    });
    io.on('connection', function(socket) {


        socket.on('chat message', function (msg) {

            socket.broadcast.emit('chat message', msg);

            let msgInst = msg.split(": ");
            let name_input = msgInst[0];
            let message_input = msgInst[1]
            let chatInst = {
                name: name_input,
                message: message_input
            };

            db = client.db('minder');

            db.collection('chats').save(chatInst);

        });
    });


});





/**
 app.post('/login', function(request, response){
    response.send(response.param('username'));
});
 */

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', function(request, response){





    console.log(request.body.username);


    request.session.user = request.body.username;
    response.redirect('/index2.html');
    response.send(request.body.username);
    //response.render('index',request.param('username'))
})







/**
 mongoose.connect(conString, { useMongoClient: true }, (err, client) => {

    if (err) return console.log(err)
    db = client.db('minder');

    for(key in db){
        console.log(key)
    }

    console.log("DB is connected")
    let dummyChat={
        name:"Saad",
        message:"HI"
    };


    db.collection('chats').save(dummyChat);



    console.log("dfsd")
})
 function test(){
    console.log("test")
}
 function saveData(dummy) {

    console.log("newChat")
    var chat = new Chat(dummy);
    chat.save();
}

 */

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});





io.on('connection', function(socket){
    console.log('some guy came in');
    socket.on('disconnect', function(){
        console.log('some guy left');
    });
});


io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
    });
});

io.on('connection', function(socket){
    socket.on('chat message', function(msg){
        socket.broadcast.emit('chat message', msg);
    });
});

io.on('connection',function(socket){
    io.emit('connection message', "user connected");
    socket.on('disconnect', function(){
        io.emit('chat message', socket.name + " disconnected");
    });

    socket.on('connection response', function(user_name){  socket.name=user_name; io.emit('chat message', socket.name + " connected");});

});



io.on('connection', function(socket){
    socket.on('is typing', function(user_name){
        console.log('typing: ' + user_name);
        socket.broadcast.emit('is typing', user_name);
    });
});

io.on('connection', function(socket){
    socket.on('no longer typing', function(user_name){
        console.log('not typing: ' + user_name);
        socket.broadcast.emit('no longer typing', user_name);
    });
});


