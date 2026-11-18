const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const message = document.getElementById("message");

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            message.textContent = data.message;

            if (data.user.role === "seller") {
                if (!data.user.sellerApproved) {
                    message.textContent =
                        "Your seller account is waiting for approval.";
                    return;
                }

                window.location.href = "/seller.html";
            } else {
                window.location.href = "/index.html";
            }

        } catch (error) {
            message.textContent = error.message;
        }
    });
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: document.getElementById("name").value,
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value,
                    role: document.getElementById("role").value
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message);
            }

            message.textContent = data.message;

            if (data.user.role === "seller") {
                message.textContent +=
                    " Please wait for seller approval.";
            }

            setTimeout(() => {
                window.location.href = "/login.html";
            }, 2000);

        } catch (error) {
            message.textContent = error.message;
        }
    });
}
