const app = require('express')();
const path = require('path');
const express = require('express');
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
  }
});
const port = 3001;


http.listen(port, ()=> {
  console.log("listening on *: " + port);
})

// app.use( express.static(path.join(__dirname,'public')));

// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,'src/public/index.html'));
// })

io.on('connection', function (socket) {
  console.log(socket.id, 'Connected');
  socket.join("public");
    io.to("public").emit('msg', `${socket.id} 연결 되었습니다.`);

  socket.on('msg', function(data){
    socket.to("public").emit('msg',`${socket.id}:${data}`);
  })
})