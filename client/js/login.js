const BASE_URL = "http://localhost:5000/api";

const LOGIN_API = `${BASE_URL}/auth/login`;

const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const response = await fetch(LOGIN_API, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            email,

            password

        })

    });

    const data = await response.json();

    if (data.success) {

        alert("Login Successful");

        localStorage.setItem("token", data.token);

        localStorage.setItem(

            "user",

            JSON.stringify(data.user)

        );

        window.location.href = "feed.html";

    }

    else {

        alert(data.message);

    }

});