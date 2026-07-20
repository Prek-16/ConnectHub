const API_URL = "http://localhost:5000/api/posts";

// =============================
// Elements
// =============================
const postsContainer = document.getElementById("postsContainer");
const loading = document.getElementById("loading");
const emptyFeed = document.getElementById("emptyFeed");
const errorMessage = document.getElementById("errorMessage");
const logoutBtn = document.getElementById("logoutBtn");

// =============================
// Check Login
// =============================
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {

    alert("Please login first");

    window.location.href = "login.html";

}

// =============================
// Logout
// =============================
logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("Logged Out Successfully");

    window.location.href = "login.html";

});

// =============================
// Welcome Card
// =============================
const welcomeUser = document.getElementById("welcomeUser");

const userProfileImage =
document.getElementById("userProfileImage");

if(user){

    welcomeUser.innerText=user.full_name;

    if(user.profile_image){

        userProfileImage.src=
        `http://localhost:5000/uploads/${user.profile_image}`;

    }

}

// =============================
// Load Posts
// =============================
async function loadPosts(){

    try{

        loading.style.display="block";

        emptyFeed.style.display="none";

        errorMessage.style.display="none";

        postsContainer.innerHTML="";

        const response=await fetch(

            `${API_URL}?user_id=${user.id}`

        );

        const data=await response.json();

        loading.style.display="none";

        if(!data.success){

            errorMessage.style.display="block";

            return;

        }

        if(data.posts.length===0){

            emptyFeed.style.display="block";

            return;

        }

        data.posts.forEach(post=>{

            const profileImage=post.profile_image
            ?
            `http://localhost:5000/uploads/${post.profile_image}`
            :
            "../images/default-profile.png";

            const postImage=
            `http://localhost:5000/uploads/${post.image}`;

            postsContainer.innerHTML+=`

            <div class="post-card">

                <div class="post-header">

                    <img
                    src="${profileImage}"
                    class="profile-image">

                    <div>

                        <h3>${post.full_name}</h3>

                        <p>@${post.username}</p>

                        ${
                            post.user_id != user.id
                            ?
                            `
                            <button
                                class="follow-btn"
                                data-user="${post.user_id}"
                                onclick="toggleFollow(${post.user_id})">

                                ${
                                    post.is_following == 1
                                    ?
                                    "Following"
                                    :
                                    "Follow"
                                }

                            </button>

                            <button
                                class="message-btn"
                                onclick="openChat(${post.user_id})">

                                💬 Message

                            </button>
                            `
                            :
                            ""
                        }

                        <small>

                            ${new Date(post.created_at).toLocaleString()}

                        </small>

                    </div>

                </div>

                <img
                src="${postImage}"
                class="post-image">

                <div class="post-body">

                    <p>${post.caption}</p>

                    <div class="post-actions">

                        <button onclick="toggleLike(${post.id})">

                            ❤️ ${post.like_count} Likes

                        </button>

                        <button disabled>

                            💬 ${post.comment_count} Comments

                        </button>

                    </div>

                    <div class="comments-section">

                        <div id="comments-${post.id}"></div>

                        <div class="comment-box">

                            <input
                            type="text"
                            id="commentInput-${post.id}"
                            placeholder="Write a comment...">

                            <button
                            onclick="addComment(${post.id})">

                                Post

                            </button>

                        </div>

                    </div>

                </div>

            </div>

            `;

             loadComments(post.id);

        });

    }

    catch(error){

        loading.style.display="none";

        errorMessage.style.display="block";

        console.log(error);
        alert(error.message);

    }

}

loadPosts();
// =============================
// Unread Message Badge
// =============================
async function loadUnreadCount(){

    try{

        const response = await fetch(

            `http://localhost:5000/api/messages/unread/${user.id}`

        );

        const data = await response.json();

        const badge = document.getElementById("messageBadge");

        if(data.total > 0){

            badge.innerText = `(${data.total})`;

        }else{

            badge.innerText = "";

        }

    }

    catch(error){

        console.log(error);

    }

}
loadUnreadCount();

setInterval(loadUnreadCount, 5000);
// =============================
// Follow / Unfollow
// =============================
async function toggleFollow(followingId){

    try{

        const btn=document.querySelector(
            `button[data-user="${followingId}"]`
        );

        const isFollowing=btn.innerText==="Following";

        const url=isFollowing
        ?"http://localhost:5000/api/follow/unfollow"
        :"http://localhost:5000/api/follow/follow";

        const method=isFollowing?"DELETE":"POST";

        const response=await fetch(url,{

            method:method,

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                follower_id:user.id,

                following_id:followingId

            })

        });

        const data=await response.json();

        if(data.success){

            loadPosts();

        }else{

            alert(data.message);

        }

    }

    catch(error){

        console.log(error);

    }

}

function openChat(userId){

    localStorage.setItem("chatUser", userId);

    window.location.href = "messages.html";

}
// =============================
// Like Post
// =============================
async function toggleLike(postId){

    try{

        const response=await fetch(

            "http://localhost:5000/api/likes/toggle",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    user_id:user.id,

                    post_id:postId

                })

            }

        );

        const data=await response.json();

        if(data.success){

            loadPosts();

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        console.log(error);

    }

}

// =============================
// Add Comment
// =============================
async function addComment(postId){

    const input=document.getElementById(

        `commentInput-${postId}`

    );

    const comment=input.value.trim();

    if(comment===""){

        alert("Enter a comment");

        return;

    }

    try{

        const response=await fetch(

            "http://localhost:5000/api/comments/add",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    post_id:postId,

                    user_id:user.id,

                    comment:comment

                })

            }

        );

        const data=await response.json();

        if(data.success){

            input.value="";

            // loadComments(postId);

            loadPosts();

        }

        else{

            alert(data.message);

        }

    }

    catch(error){

        console.log(error);

    }

}

// =============================
// Load Comments
// =============================
async function loadComments(postId){

    try{

        const response=await fetch(

            `http://localhost:5000/api/comments/${postId}`

        );

        const data=await response.json();

        const container=document.getElementById(

            `comments-${postId}`

        );

        if(!container) return;

        container.innerHTML="";

        data.comments.forEach(comment=>{

            container.innerHTML+=`

                <div class="comment">

                    <strong>${comment.full_name}</strong>

                    <p>${comment.comment}</p>

                </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}
function openChat(userId){

    localStorage.setItem("chatUser", userId);

    window.location.href = "messages.html";

}