/**** Import npm libs ****/

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const session = require("express-session")({
    // CIR2-chat encode in sha256
    secret: "eb8fcc253281389225b4f7872f2336918ddc7f689e1fc41b64d5c4f378cdc438",
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 2 * 60 * 60 * 1000,
        secure: false
    }
});



const sharedsession = require("express-socket.io-session");
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const mysql = require('mysql');
const fs = require('fs');
const bcrypt = require('bcrypt');

const urlencodedParser = bodyParser.urlencoded({ extended: false });


const Game = require('./Back/Classes/Game.js')
const scoreHandler = require("./Back/Modules/scoreHandler")


app.use(express.static(__dirname + '/front/'));
app.use(urlencodedParser);
app.use(session);

const roomnbr = 10
let rooms = new Array(roomnbr)
let games =  new Array(roomnbr)

for(let i = 0;i<10;i++){
    rooms[i] = new Array(3);
    rooms[i][0]
}



//Connexion à la base de donnée
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "stratego"
});

con.connect( err => {
    if (err) throw err;
    else console.log('Connexion a mysql effectuee');
});
/***************/

io.use(sharedsession(session, {
    // Session automatiquement sauvegardée en cas de modification
    autoSave: true
}));

// redirige vers la page d'accueil
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/Front/Html/accueil.html');
    let sessionData = req.session;
});

// redirige vers la page de connexion si l'URL contient '/login'
app.get("/login", (req, res) => {
    res.sendFile(__dirname + '/Front/Html/login.html');
});


// redirige vers la page d'enregistrement si l'URL contient '/register'
app.get("/register", (req, res) => {
    res.sendFile(__dirname + '/Front/Html/register.html');
});


// redirige vers la page d'accueil si l'URL contient '/logout'
app.get('/logout', (req,res) => {
    req.session = null;
    res.redirect('/');
});

// redirige vers la page d'attente si l'URL contient '/waitingRoom'
app.get('/waitingRoom', (req,res) => {
    if(req.session)
        res.sendFile(__dirname + '/Front/Html/salleAttente.html');
    else
        res.redirect('/');
});

// redirige vers la page de jeu si l'URL contient '/game'
app.get('/game',(req,res)=>{
    if(req.session)
        res.sendFile(__dirname + '/Front/Html/game.html');
    else
        res.redirect('/');

});

/******************/

// Directement après la connexion d'un socket au serveur
io.on('connection', (socket) => {

    socket.on("register", (info) => {
        let sql = "INSERT INTO users VALUES (default,?,?,?)";
        con.query(sql, [info[0], info[2],info[1]], (err, res)=> {
            if (err)throw err;
            console.log("personne ajouté")
        });
    });

    socket.on("login",(info)=>{
        let sql = "SELECT id, username FROM users WHERE username = ? and password = ?";
        con.query(sql, [info[0], info[1]], (err, res) => {
            if(err) throw err;

            socket.emit("resultLogin",res)
        });
    });

    socket.on("isSession",()=>{
        socket.emit("onSession",socket.handshake.session.username)
    });

    socket.on("username", (info) => {
        let sql = "SELECT username FROM users WHERE username = ?";
        con.query(sql, [info[0]], (err, res) => {
            if (err) throw err;
            socket.emit("resultUser",res)
        });
    });

    socket.on("crypt", (info) =>{
        bcrypt.hash(info,10, function (err, res){
            if (err) throw err;
            socket.emit("resultCrypt",res);
        });
    });

    //judith socket login decrypt
    socket.on("decrypt", (info) => {
        bcrypt.compare(info[0], info[1], function (err, res) {
            if (err) throw err;
            console.log(res);
            socket.emit("resultDecrypt", res);
        });
    });

    socket.on("getRoom",()=>{
       for(let i = 0;i<10;i++){
           if(rooms[i][0] !== 2 && (i === 0||rooms[i-1][0]===2)){
               rooms[i][0] +=1;
               socket.handshake.session.player = rooms[i][0];
               socket.join(i.toString());
               rooms[i][rooms[i][0]] = socket.handshake.session.username
               if(rooms[i] === 2){
                   socket.handshake.session.room = i;
                   io.to(i.toString()).emit("validStart")
               }
             i = 9;
           }
       }
    });
    socket.on("startGame",()=>{
        socket.join((socket.handshake.session.room).toString());
        if (games[socket.handshake.session.room]){
            games[socket.handshake.session.room] = new Game();

        }
    });

    socket.on("move",(start,end)=>{

    });
    socket.on("attack",(start,end)=>{

    });
    socket.on('disconnect', () => {
        if(socket.handshake.session.room !== undefined){
            rooms[socket.handshake.session.room][0]--;
            room[socket.handshake.session.room][socket.handshake.session.player] = undefined;
            if(socket.handshake.session.player === 1){
                let srvSockets = io.to[socket.handshake.session.room].sockets.sockets;
                srvSockets.forEach(user => {
                    if (user.handshake.session.room === socket.handshake.session.room){
                        user.handshake.session.player = 1;
                    }
                });
            }
            io.to[(socket.handshake.session.room).toString()].emit("removePlay");
        }
    });
    socket.on("endPlacement",(tab)=> {
            for(let i = 6;i< 10;i++){
                for(let j  = 0; j < 10;j++){

                }
        }
    })

});

app.post('/login', body('login').isLength({ min: 3 }).trim().escape(), (req, res) => {
    const login = req.body.login

    // Error management
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return res.status(400).json({ errors: errors.array() });
    } else {
        // Store login
        req.session.username = login;
        req.session.save()
        res.redirect('/');
    }

});



/******************/
http.listen(8880, () => {
    console.log('Serveur lancé sur le port 8880');
})


