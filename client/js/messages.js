const currentUser = JSON.parse(localStorage.getItem("user"));

let selectedUser = null;

const usersContainer =
document.getElementById("usersContainer");

const messagesContainer =
document.getElementById("messagesContainer");

const chatHeader =
document.getElementById("chatHeader");

const messageInput =
document.getElementById("messageInput");

const sendBtn =
document.getElementById("sendBtn");

// ==============================
// Load Users
// ==============================
async function loadUsers(){

    try{

        const response = await fetch(

`http://localhost:5000/api/users/explore?user_id=${currentUser.id}`

);

        const data = await response.json();

        usersContainer.innerHTML="";

        data.users.forEach(user=>{

            const image = user.profile_image
            ?
            `http://localhost:5000/uploads/${user.profile_image}`
            :
            "../images/default-profile.png";

            usersContainer.innerHTML += `

            <div
            class="user-card"
            onclick="selectUser(${user.id},'${user.full_name}')">

                <img src="${image}">

                <div style="flex:1;">

                    <h4>

                        ${user.full_name}

                        ${
                            user.unread > 0
                            ?
                            `<span class="new-badge">${user.unread} New</span>`
                            :
                            ""
                        }

                    </h4>

                    <p>@${user.username}</p>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}
const chatUser = localStorage.getItem("chatUser");

if(chatUser){

    setTimeout(()=>{

        const card = document.querySelector(

            `.user-card[onclick*="${chatUser}"]`

        );

        if(card){

            card.click();

        }

        localStorage.removeItem("chatUser");

    },500);

}
// ==============================
// Select User
// ==============================
async function selectUser(userId, fullName){

    selectedUser = userId;

    chatHeader.innerHTML = `

        <h3>${fullName}</h3>

    `;

    await loadMessages();

}

// ==============================
// Load Messages
// ==============================
async function loadMessages(){

    if(!selectedUser) return;

    try{

        const response = await fetch(

            `http://localhost:5000/api/messages?sender_id=${currentUser.id}&receiver_id=${selectedUser}`

        );

        const data = await response.json();

        messagesContainer.innerHTML = "";

        data.messages.forEach(message=>{

            const myMessage =
            message.sender_id == currentUser.id;

            messagesContainer.innerHTML += `

                <div class="${
                    myMessage
                    ?
                    "my-message"
                    :
                    "other-message"
                }">

                    ${message.message}

                </div>

            `;

        });

        messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

    }

    catch(error){

        console.log(error);

    }

}
// ==============================
// Send Message
// ==============================
async function sendMessage(){

    if(!selectedUser){

        alert("Please select a user");

        return;

    }

    const text = messageInput.value.trim();

    if(text==="") return;

    try{

        const response = await fetch(

            "http://localhost:5000/api/messages/send",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    sender_id:currentUser.id,

                    receiver_id:selectedUser,

                    message:text

                })

            }

        );

        const data = await response.json();

        if(data.success){

            messageInput.value="";

            loadMessages();

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        console.log(error);

    }

}

// ==============================
// Send Button
// ==============================
sendBtn.addEventListener("click",sendMessage);

// ==============================
// Press Enter
// ==============================
messageInput.addEventListener("keypress",(e)=>{

    if(e.key==="Enter"){

        sendMessage();

    }

});

// ==============================
// Auto Refresh Chat
// ==============================
setInterval(()=>{

    if(selectedUser){

        loadMessages();

    }

},2000);

// ==============================
// Initial Load
// ==============================
loadUsers();