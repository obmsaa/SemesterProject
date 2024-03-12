


const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {

  event.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const data = { email, password };
  const cfg = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  try {
    const response = await fetch('/login', cfg); 
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      updateHeader();
      window.history.pushState({}, "", "/myHome");
      handleLocation();
    } else {
      console.log("Login failed:", response.statusText);
    }
  } catch (error) {
    console.error("Login error:", error);
  }
});


