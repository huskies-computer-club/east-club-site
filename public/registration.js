const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_pword");

addEventListener("submit", (event) => {
  event.preventDefault();
  console.log("out here");
  if (passwordInput.value != confirmPasswordInput.value) {
    console.log("here");
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Passwords do not match!";
    errorMessage.classList.add("error-message");

    // Insert the error message before the next sibling of confirmPasswordInput
    confirmPasswordInput.parentNode.insertBefore(
      errorMessage,
      confirmPasswordInput.nextSibling
    );
  } else {
    console.log("submit logic");
    let data = {
      key1: "value1",
      key2: "value2",
    };

    // Create the request object
    let requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch("user", requestOptions).then((response) => {
      console.log("INSIDE RESPONSE", response);
    });
  }
  // get values from input compare if they are different than create and insert a new element into the form saying the passwords do not match
  // if the are the same than do nothing for now.
});
