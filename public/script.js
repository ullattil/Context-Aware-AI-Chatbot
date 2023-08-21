const socket=io();

const messageForm=document.getElementById('message-form');
const messageInput=document.getElementById('message-input');
const messages=document.getElementById('messages');

/**
 * Creates a new message element and appends it to the messages container.
 *
 * @param {string} role - The role of the message sender. Accepts "user" or "assistant".
 * @param {string} message - The content of the message.
 */
function displayMessage(role, message) {
    const div = document.createElement('div');
    const sender = role === "user" ? "You" : "Assistant";
    const content = `<p><b>${sender}:</b> ${message}</p>`;
    div.innerHTML = content;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
}

messageForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const message=messageInput.value;
    displayMessage('user', message);

    socket.emit("sendMessage", message, (error)=>{
        if(error){
            return alert(error);
        }
        messageInput.value="";
        messageInput.focus();
    });
});

socket.on("message", (message)=>{
    displayMessage("assistant", message);
});