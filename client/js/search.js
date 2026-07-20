const searchInput = document.getElementById("searchUser");

const searchPostsContainer = document.getElementById("postsContainer");

searchInput.addEventListener("keyup", async () => {

    const keyword = searchInput.value.trim();

    if(keyword===""){

        loadPosts();

        return;

    }

    try{

        const response = await fetch(

            `http://localhost:5000/api/users/search?keyword=${keyword}`

        );

        const data = await response.json();

        searchPostsContainer.innerHTML="";

        if(data.users.length===0){

            searchPostsContainer.innerHTML=`
            <h2 style="text-align:center;margin-top:40px;">
            No User Found
            </h2>
            `;

            return;

        }

        data.users.forEach(user=>{

            const image=user.profile_image
            ?
            `http://localhost:5000/uploads/${user.profile_image}`
            :
            "../images/default-profile.png";

            searchPostsContainer.innerHTML+=`

            <div
            class="post-card"
            onclick="window.location.href='user-profile.html?id=${user.id}'"
            style="cursor:pointer;">

                <div class="post-header">

                    <img
                    src="${image}"
                    class="profile-image">

                    <div>

                        <h3>${user.full_name}</h3>

                        <p>@${user.username}</p>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

});