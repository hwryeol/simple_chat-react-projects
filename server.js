const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3001",
        methods: ["GET", "POST"],
  }
});
const port = 3000;


http.listen(port, ()=> {
  console.log("listening on *: " + port);
})

io.on('connection', function (socket) {
  console.log(socket.id, 'Connected');
  socket.emit('msg', `${socket.id} 연결 되었습니다.`);

  socket.on('msg', function(data){
    console.log(socket.id,data);
    socket.emit('msg', `Server: "${data} 받았습니다.`)
  })
})