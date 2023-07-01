const socket = io('http://localhost:8000');

const form = document.getElementById('form1');
const msgtyped = document.getElementById('msg-typed');
const container = document.querySelector('.container');

const audio = new Audio('./static/noti_sounds/noti1.mp3');
audio.preload = 'auto';

const append = (message,position)=>{
    const msgelement = document.createElement('div');
    msgelement.innerText=message;
    msgelement.classList.add('message');
    msgelement.classList.add(position);
    container.append(msgelement);
    if(position == 'left')
        audio.play();
}

const name = prompt("Enter your name to join");
append('You joined the chat','right');
socket.emit('new-user-joined',name);





socket.on('user-joined',name=>{
    append(`${name} joined the chat`,'left');
});

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = msgtyped.value;
    append(`You: ${message}`,'right');
    msgtyped.value="";
    socket.emit('chat-msg',message);
});

socket.on('recieve',data=>{
    append(`${data.name}: ${data.message}`,'left');
})

socket.on('left',name=>{
    append(`${name} left the chat`,'left');
});