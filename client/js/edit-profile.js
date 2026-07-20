const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "login.html";
}

const previewImage = document.getElementById("previewImage");
const imageInput = document.getElementById("profile_image");
const fullName = document.getElementById("full_name");
const bio = document.getElementById("bio");

// Existing Data
fullName.value = user.full_name;
bio.value = user.bio || "";

if (user.profile_image) {
    previewImage.src =
        `http://localhost:5000/uploads/${user.profile_image}`;
}

// Image Preview
imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (file) {

        previewImage.src = URL.createObjectURL(file);

    }

});

// Submit
document
.getElementById("editProfileForm")
.addEventListener("submit", async (e) => {

    e.preventDefault();

    try {

        const formData = new FormData();

        formData.append(
            "full_name",
            fullName.value
        );

        formData.append(
            "bio",
            bio.value
        );

        if (imageInput.files.length > 0) {

            formData.append(
                "profile_image",
                imageInput.files[0]
            );

        }

        const response = await fetch(

            `http://localhost:5000/api/auth/update/${user.id}`,

            {

                method: "PUT",

                body: formData

            }

        );

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(

                "user",

                JSON.stringify(data.user)

            );

            alert("Profile Updated Successfully");

            window.location.href = "profile.html";

        }

        else {

            alert(data.message);

        }

    }

    catch (error) {

        console.log(error);

        alert("Something went wrong");

    }

});