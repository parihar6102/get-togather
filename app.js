const express = require('express');
const path = require('path');
const fs = require('fs');
const os=require('os');
const mongoose=require('mongoose');

const app = express();
const port = 80
const hostname = '127.0.0.1';

app.use('/static',express.static('static'));
app.use(express.urlencoded());
app.set('view-engine','pug');
app.set('views',path.join(__dirname,'views'));

// Node server which will handle socket io connections

const io = require('socket.io')(8000,{cors: {origin: '*'}});

const users = {};

io.on('connection',(socket)=>{
    socket.on('new-user-joined',(name)=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });

    socket.on('chat-msg',(msg)=>{
        socket.broadcast.emit('recieve',{message:msg,name:users[socket.id]});
    });

    socket.on('disconnect',()=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    })
});


// connect_db().catch(err=>console.error(err));
// async function connect_db()
// {
//     await mongoose.connect('mongodb://127.0.0.1:27017/database2');
// }

app.get("/",(req,res)=>{
    const params={};
    res.render('index1.pug',{});
});


app.listen(port,hostname,()=>{
    console.log(`Server is live at http://${hostname}:${port}/`);
})