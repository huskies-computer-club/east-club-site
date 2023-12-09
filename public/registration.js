const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirm_pword");

addEventListener("submit", (event) => {
    event.preventDefault();
    
    if (passwordInput.value != confirmPasswordInput.value) {
        const errorMessage = document.createElement("p");
        errorMessage.textContent = "Passwords do not match!";
        errorMessage.classList.add("error-message");
        
        // Insert the error message before the next sibling of confirmPasswordInput
        confirmPasswordInput.parentNode.insertBefore(errorMessage, confirmPasswordInput.nextSibling);
    } 
    // get values from input compare if they are different than create and insert a new element into the form saying the passwords do not match
    // if the are the same than do nothing for now. 
})