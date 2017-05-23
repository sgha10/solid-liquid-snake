const express = require('express'); // carga la clase - modulo
const app = express();

const server = require("http").Server(app);// carga modulo para el servidor y se le acciona el servidor express
const io = require("socket.io")(server); // carga modulo para sockets y se le asigna el servidor express
const cookieParser = require('cookie-parser'); // carga modulo cookieParser
const session = require('express-session'); // carga modulo express-session

app.use(express.static('client'));
app.use(cookieParser());

var users = new Array();

var messages = [{
  id: 1,
  text: 'Bienvenido al chat',
  nickName: 'Bot-Chat'
}];

io.on('connection', function(socket){ //se encarga de las conecciones
  console.log("se conecto un cliente con la ip: " + socket.handshake.address);
  socket.emit('message',messages); // solo al socket conectado
  socket.emit('users',users); // solo al socket conectado se le manda la lista de los usuarios

  socket.on('add-message',(data) => {
  messages.push(data);
  io.sockets.emit('message',messages); // emite a todos los sockets
  });

// tanto disconnect como connection son eventos propios
  socket.on('disconnect', function() {
    var x = users.indexOf(socket.user)
    users.splice(x, 1);
    console.log('Se desconecto el cliente con la ip: ' + socket.handshake.address);
    io.sockets.emit('users',users); // emite a todos los sockets
   });

  socket.on('nick',(data) => {
    if(users.indexOf(data.nick) == -1){
      socket.user = data.nick;
      users.push({user : data.nick})
      console.log("usuario ingresado");
      socket.emit('nick',{correcto: true, nick: data.nick});
      io.sockets.emit('users',users); // emite a todos los sockets
    }else{
      socket.emit('nick',{correcto: false, nick: data.nick});
    }
  });

});

server.listen(6677, () => { //function callback
  console.log("servidor esta arriba en hhtp://localhost:6677");
});
