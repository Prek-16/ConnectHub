const user = JSON.parse(localStorage.getItem("user"));

if (!user) {

    window.location.href = "login.html";

}

document.getElementById("fullName").innerText = user.full_name;
document.getElementById("username").innerText = "@" + user.username;
document.getElementById("email").innerText = user.email;
document.getElementById("bio").innerText = user.bio || "No Bio Added";

if (user.profile_image) {

    document.getElementById("profileImage").src =
    `http://localhost:5000/uploads/${user.profile_image}`;

}

document
.getElementById("logoutBtn")
.addEventListener("click", () => {

    localStorage.clear();

    window.location.href = "login.html";

});

async function loadMyPosts(){

    try{

        const response = await fetch(
            "http://localhost:5000/api/posts"
        );

        const data = await response.json();

        const container =
        document.getElementById("myPosts");

        container.innerHTML="";

        const myPosts =
        data.posts.filter(
            post=>post.username===user.username
        );

        document.getElementById("postCount").innerText =
        myPosts.length;

        // Followers Count
        const followersResponse = await fetch(
            `http://localhost:5000/api/follow/followers/${user.id}`
        );

        const followersData = await followersResponse.json();

        if (followersData.success) {

            document.getElementById("followersCount").innerText =
                followersData.totalFollowers;

        }

        // Following Count
        const followingResponse = await fetch(
            `http://localhost:5000/api/follow/following/${user.id}`
        );

        const followingData = await followingResponse.json();

        if (followingData.success) {

            document.getElementById("followingCount").innerText =
                followingData.totalFollowing;

        }
        let totalLikes = 0;

        myPosts.forEach(post=>{

            totalLikes += post.like_count || 0;

            const profileImage =
            post.profile_image
            ?
            `http://localhost:5000/uploads/${post.profile_image}`
            :
            "../images/default-profile.png";

            container.innerHTML += `

            <div class="post-card">

                <div class="post-header">

                    <img
                    src="${profileImage}"
                    class="profile-image">

                    <div>

                        <h3>${post.full_name}</h3>

                        <p>@${post.username}</p>

                    </div>

                </div>

                <img
                src="http://localhost:5000/uploads/${post.image}"
                class="post-image">

                <div class="post-body">

                    <p>${post.caption}</p>

                    <button
                    class="delete-btn"
                    onclick="deletePost(${post.id})">

                    🗑 Delete Post

                    </button>

                </div>

            </div>

            `;

        });

        document.getElementById("likeCount").innerText =
        totalLikes;

    }

    catch(error){

        console.log(error);

    }

}

loadMyPosts();

async function deletePost(postId){

    if(!confirm("Delete this post?")) return;

    try{

        const response = await fetch(

            `http://localhost:5000/api/posts/${postId}`,

            {

                method:"DELETE"

            }

        );

        const data = await response.json();

        if(data.success){

            alert("Post Deleted");

            loadMyPosts();

        }

    }

    catch(error){

        console.log(error);

    }

}