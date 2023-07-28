const port = 3000;

const express = require('express');
const app = express();

// socket.io stuff
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io'); 
const io = new Server(server);

// node modules
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

const router = require('./routes/router');
const ServerManager = require('./modules/server-manager');
const SocketManager = require('./modules/socket-manager');

// view engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('public'));

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
    secret: "secret",
    saveUninitialized: true,
    cookie: {maxAge: 100 * 60 * 60 * 24},
    resave: false
}));

// router
app.use(router);

// server and socket manager
app.set('server-manager', new ServerManager(io)); 
new SocketManager(io, app.get('server-manager'));

// Can't use app since socket.io requires http server.
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
});