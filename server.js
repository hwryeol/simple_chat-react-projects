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
function getPublicRooms(){
  let {rooms,sids} = io.sockets.adapter;
  let publicRooms = [];

  rooms.forEach((_,key) => {
    if(sids.get(key) === undefined){
      publicRooms.push(key);
    }
  })
  return publicRooms;
}

function getSocketFromID(socketID,namespace="/"){
  return io.of(namespace).sockets.get(socketID);
}

function getUserList(roomName){
  let userList = [];
  io.sockets.adapter.rooms.get(roomName)?.forEach((value)=>{
    userList.push(getSocketFromID(value).username);
  });
  return userList;
}

io.on('connection', (socket) => {
  socket.emit('room_data', getPublicRooms());
  socket.on('username', (data=`user${socket.id.slice(0,5)}`)=>{
    socket["username"] = data;
  })
  
  socket.on('enter_room', (roomName)=>{
    socket.join(roomName);
    io.sockets.emit('room_data', getPublicRooms());
    io.sockets.emit('userList', getUserList(roomName));
    console.log(getUserList(roomName));
    io.to(roomName).emit('notice', `${socket.username}님이 연결 되었습니다.`);

    socket.on('msg', (data) => {
      socket.to(roomName).emit('msg', socket.username, data);
    });

  })
})
