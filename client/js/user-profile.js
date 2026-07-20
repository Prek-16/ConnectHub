const params = new URLSearchParams(window.location.search);

const profileId = params.get("id");

const currentUser = JSON.parse(localStorage.getItem("user"));

async function loadUserProfile(){

    try{

        const response = await fetch(

            `http://localhost:5000/api/users/${profileId}`

        );

        const data = await response.json();

        if(!data.success){

            alert("User not found");

            window.location.href="feed.html";

            return;

        }

        const user=data.user;

        document.getElementById("fullName").innerText=user.full_name;

        document.getElementById("username").innerText="@"+user.username;

        document.getElementById("bio").innerText=user.bio || "No Bio";

        if(user.profile_image){

            document.getElementById("profileImage").src=

            `http://localhost:5000/uploads/${user.profile_image}`;

        }

        loadFollowers();

        loadPosts();

    }

    catch(error){

        console.log(error);

    }

}

async function loadFollowers(){

    try{

        const followers=await fetch(

            `http://localhost:5000/api/follow/followers/${profileId}`

        );

        const following=await fetch(

            `http://localhost:5000/api/follow/following/${profileId}`

        );

        const followerData=await followers.json();

        const followingData=await following.json();

        document.getElementById("followers").innerText=

        followerData.totalFollowers;

        document.getElementById("following").innerText=

        followingData.totalFollowing;

    }

    catch(error){

        console.log(error);

    }

}

async function loadPosts(){

    try{

        const response=await fetch(

            "http://localhost:5000/api/posts"

        );

        const data=await response.json();

        const container=document.getElementById("userPosts");

        container.innerHTML="";

        const posts=data.posts.filter(

            post=>post.user_id==profileId

        );

        if(posts.length===0){

            container.innerHTML="<h2>No Posts</h2>";

            return;

        }

        posts.forEach(post=>{

            container.innerHTML+=`

            <div class="post-card">

                <img
                src="http://localhost:5000/uploads/${post.image}"
                class="post-image">

                <div class="post-body">

                    <p>${post.caption}</p>

                    <button onclick="followUser()">

                        Follow

                    </button>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

async function followUser(){

    try{

        const response=await fetch(

            "http://localhost:5000/api/follow/follow",

            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    follower_id:currentUser.id,

                    following_id:profileId

                })

            }

        );

        const data=await response.json();

        alert(data.message);

        loadFollowers();

    }

    catch(error){

        console.log(error);

    }

}

loadUserProfile();