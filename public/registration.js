const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_pword");
const emailInput = document.getElementById("email");

addEventListener("submit", async (event) => {
  // Check if passwords match
  if (passwordInput.value !== confirmPasswordInput.value) {
    event.preventDefault();
    const errorMessage = document.createElement("p");
    errorMessage.textContent = "Passwords do not match!";
    errorMessage.classList.add("error-message");

    // Insert the error message before the next sibling of confirmPasswordInput
    confirmPasswordInput.parentNode.insertBefore(
      errorMessage,
      confirmPasswordInput.nextSibling
    );

  } else {
    // Check if the email already exists in the database
    const emailExists = await checkEmailExists(emailInput.value);

    if (emailExists) {
      event.preventDefault();
      const errorMessage = document.createElement("p");
      errorMessage.textContent = "Email already exists!";
      errorMessage.classList.add("error-message");

      // Insert the error message before the next sibling of emailInput
      emailInput.parentNode.insertBefore(errorMessage, emailInput.nextSibling);
    } else {
      // If email doesn't exist, submit the form
      event.target.submit();
    }
  }
});

// Function to check if the email already exists in the database
async function checkEmailExists(email) {
  const response = await fetch("/api/check-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const result = await response.json();
  return result.emailExists;
}