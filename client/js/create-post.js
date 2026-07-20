const form = document.getElementById("createPostForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    const image = document.getElementById("image").files[0];
    const caption = document.getElementById("caption").value;

    const formData = new FormData();

    formData.append("user_id", user.id);
    formData.append("caption", caption);
    formData.append("image", image);

    try {

        const response = await fetch(
            "http://localhost:5000/api/posts/create",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData
            }
        );

        const data = await response.json();

        if (data.success) {

            alert("Post Created Successfully");

            window.location.href = "feed.html";

        } else {

            alert(data.message);

        }

    } catch (error) {

        console.log(error);
        alert("Something went wrong");

    }

});