const user = JSON.parse(localStorage.getItem("user"));

const usersContainer =
document.getElementById("usersContainer");

async function loadUsers(){

    try{

        const response = await fetch(

            `http://localhost:5000/api/users/explore?user_id=${user.id}`

        );

        const data = await response.json();

        usersContainer.innerHTML = "";

        if(!data.success){

            usersContainer.innerHTML =
            "<h2>Unable to load users.</h2>";

            return;

        }

        data.users.forEach(person=>{

            const image = person.profile_image
            ?
            `http://localhost:5000/uploads/${person.profile_image}`
            :
            "../images/default-profile.png";

            usersContainer.innerHTML += `

            <div class="user-card">

                <img
                src="${image}"
                class="profile-image">

                <h3>${person.full_name}</h3>

                <p>@${person.username}</p>

                <button
                onclick="window.location.href='user-profile.html?id=${person.id}'">

                    View Profile

                </button>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

        usersContainer.innerHTML =
        "<h2>Server Error</h2>";

    }

}

loadUsers();