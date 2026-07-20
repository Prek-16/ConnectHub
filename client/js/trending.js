const container =
document.getElementById("trendingContainer");

async function loadTrending(){

    try{

        const response = await fetch(

            "http://localhost:5000/api/users/trending"

        );

        const data = await response.json();

        container.innerHTML="";

        data.users.forEach((user,index)=>{

            const image = user.profile_image
            ?
            `http://localhost:5000/uploads/${user.profile_image}`
            :
            "../images/default-profile.png";

            const medal =
            index==0 ? "🥇"
            :
            index==1 ? "🥈"
            :
            index==2 ? "🥉"
            :
            `#${index+1}`;

            container.innerHTML += `

            <div class="creator-card">

                <div class="left">

                    <div class="rank">

                        ${medal}

                    </div>

                    <img src="${image}">

                    <div>

                        <h2>${user.full_name}</h2>

                        <p>@${user.username}</p>

                    </div>

                </div>

                <div>

                    <h3>👥 ${user.followers} Followers</h3>

                    <h3>📝 ${user.posts} Posts</h3>

                </div>

            </div>

            `;

        });

    }

    catch(error){

        console.log(error);

    }

}

loadTrending();