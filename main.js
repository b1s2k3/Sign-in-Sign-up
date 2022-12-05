function loginAccount() {
  let mailVal = $("#email-input").val();
  let passwordVal = $("#password-input").val();
  axios
    .get("http://localhost:3000/users")
    .then((response) => {
      let db = response.data;

      let mailAuth = db.find((item) => item.email === mailVal);

      let passwordAuth = db.find((item) => item.password === passwordVal);
      if (
        mailAuth !== undefined &&
        passwordAuth !== undefined &&
        mailAuth === passwordAuth
      ) {
        $(".login-container").hide();
        $("body")
          .append("Logged in")
          .css({ "text-align": "center", "font-size": "2em", color: "red" });
      } else {
        $(".login-container").hide();
        $("body").html(`
          <div id="fail-vld">
            <h3 class="msg">Email or password is not correct</h3>
            <a href="index.html">Try again.</>
          </div>
            `);
      }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  $(".login-container").html(`
     <div class="register-container">
       <label>Email: </label>
       <input id="register-email" type="text" required>
       <label>Password: </label>
       <input class="password" id="register-password" type="password" required >
       <input type="checkbox" class="checkbox" onclick="showPassword()">
       <p id="regex-msg">! Password must contain letter, number, special character(!@#$%^&*) and must be at least 8 characters.</p>
       <button onclick="registerAccount()" id="register-button">Register</button> 
       <a href="index.html">Back to Login</a>
     </div>
    `);
}

function showPassword() {
  var pass = document.getElementById("register-password");
  if (pass.type === "password") {
    pass.type = "text";
  } else {
    pass.type = "password";
  }
}

function registerAccount() {
  let mailVal = $("#register-email").val();
  let passwordVal = $("#register-password").val();
  let uniqueId = new Date().getTime();
  let postingData = { id: uniqueId, email: mailVal, password: passwordVal };
  let regEx = new RegExp("(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

  axios
    .get("http://localhost:3000/users")
    .then((response) => {
      let db = response.data;
      let valuesArr = Object.values(db).map((item) => item.email);

      if (valuesArr.includes(mailVal)) {
        alert("This email is already used.");
        $("#register-email").val("");
        $("#register-password").val("");
      } else if (mailVal.length === 0 && passwordVal.length === 0) {
        return alert("You assign null value.");
      } else {
        if (regEx.test(passwordVal) === true) {
          axios
            .post("http://localhost:3000/users", postingData)
            .then((response) => console.log(response))
            .catch((error) => console.log(error.response.data))
            .finally(() => {
              $(".login-container").html(`
          <h1 class="msg" >Your account created.</h1>
          <a href="index.html">Login</a>
          `);
            });
        } else {
          return alert("Invalid password!");
        }
      }
    })
    .catch((error) => console.log(error));
}
