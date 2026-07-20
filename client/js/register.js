const API_URL = "http://localhost:5000/api/auth/register";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (e) => {

    e.preventDefault();
    const imageInput = document.getElementById("profile_image");
    const previewImage = document.getElementById("previewImage");

    imageInput.addEventListener("change", () => {

        const file = imageInput.files[0];

        if(file){

            previewImage.src = URL.createObjectURL(file);

        }

    });

    const full_name = document.getElementById("full_name").value.trim();

    const username = document.getElementById("username").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value.trim();

    if (!full_name || !username || !email || !password) {

        alert("Please fill all fields");

        return;

    }

    try {

        const formData = new FormData();

        formData.append("full_name", full_name);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("password", password);
        formData.append(
            "profile_image",
            imageInput.files[0]
        );

        const response = await fetch(API_URL, {

            method:"POST",

            body:formData

        });

        const data = await response.json();

        if (data.success) {

            alert("Registration Successful");

            window.location.href = "login.html";

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