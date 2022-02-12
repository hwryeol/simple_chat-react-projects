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

// app.use( express.static(path.join(__dirname,'build')));

// app.get('/',(req,res)=>{
//   console.log(path.join(__dirname,'build/static'))
//   res.sendFile(path.join(__dirname,'build\\index.html'));
// })

io.on('connection', function (socket) {
  console.log(socket.id, 'Connected');
  socket.join("public");
    io.to("public").emit('msg', `${socket.id} 연결 되었습니다.`);

  socket.on('msg', function(data){
    console.log(data)
    socket.to("public").emit('msg',`${socket.id}:${data}`);
  })
})