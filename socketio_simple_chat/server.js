var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function(req, res){
  res.sendFile(__dirname + '/chat.html');
});

var nameIndex=1;
io.on('connection', function(socket){

  // 접속 시, 유저명은 시퀀스하게 증가
  var chatName = "name_" + nameIndex++;

  // 유저명 변경에 대한 이벤트를 클라이언트로 전송
  io.to(socket.id).emit('change_name',chatName);

  // 로~~깅
  console.log('[connection] user : ' + chatName + ", socket_id : " +  socket.id);

  // 유저명과 채팅글을 조합하여 클라이언트로 전송
  socket.on('send_text', function(name,text){
    var msg = "[" + name + '] : ' + text;
    console.log(msg);
    io.emit('receive_text', msg);
  });

  // 연결 해제
  socket.on('disconnect', function(){
    console.log('[disconnection] user : ' + chatName + ", socket_id : " +  socket.id);
  });

});

http.listen(3000, function(){
  console.log('server start : port 3000');
});
