/* =========================================
   CODING CONF 2026
   Registration Form Validation
   ========================================= */


// Wait for the page to load before accessing form elements.

const registrationForm = document.getElementById("registrationForm");

const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const githubInput = document.getElementById("github");
const avatarInput = document.getElementById("avatar");

const avatarPreview = document.getElementById("avatarPreview");
const previewContainer = document.getElementById("previewContainer");
const fileNameDisplay = document.getElementById("fileName");


// Maximum permitted image size: 500KB.

const MAX_FILE_SIZE = 500 * 1024;


// Regular expressions for checking user input.

const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

const githubPattern = /^@[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;


// Display an error message beneath an input.

function showError(input, message, errorID) {

    const errorElement = document.getElementById(errorID);

    const formGroup = input.closest(".form-group");

    errorElement.textContent = message;

    formGroup.classList.add("has-error");

    input.setAttribute("aria-invalid", "true");
}


// Remove an error message when the input is corrected.

function clearError(input, errorID) {

    const errorElement = document.getElementById(errorID);

    const formGroup = input.closest(".form-group");

    errorElement.textContent = "";

    formGroup.classList.remove("has-error");

    input.removeAttribute("aria-invalid");
}


// Validate the participant's full name.

function validateName() {

    const name = fullNameInput.value.trim();

    if (name === "") {

        showError(
            fullNameInput,
            "Please enter your full name.",
            "nameError"
        );

        return false;
    }

    if (name.length < 2) {

        showError(
            fullNameInput,
            "Your name must contain at least 2 characters.",
            "nameError"
        );

        return false;
    }

    clearError(fullNameInput, "nameError");

    return true;
}


// Validate the email address.

function validateEmail() {

    const email = emailInput.value.trim();

    if (email === "") {

        showError(
            emailInput,
            "Please enter your email address.",
            "emailError"
        );

        return false;
    }

    if (!emailPattern.test(email)) {

        showError(
            emailInput,
            "Please enter a valid email address, e.g. user@domain.com.",
            "emailError"
        );

        return false;
    }

    clearError(emailInput, "emailError");

    return true;
}


// Validate the GitHub username.

function validateGithub() {

    const github = githubInput.value.trim();

    if (github === "") {

        showError(
            githubInput,
            "Please enter your GitHub username.",
            "githubError"
        );

        return false;
    }

    if (!githubPattern.test(github)) {

        showError(
            githubInput,
            "Your GitHub username must begin with @ and contain a valid username.",
            "githubError"
        );

        return false;
    }

    clearError(githubInput, "githubError");

    return true;
}


// Validate the uploaded profile picture.

function validateAvatar() {

    const file = avatarInput.files[0];

    if (!file) {

        showError(
            avatarInput,
            "Please upload a profile picture.",
            "avatarError"
        );

        return false;
    }

    const validTypes = ["image/jpeg", "image/png"];

    if (!validTypes.includes(file.type)) {

        showError(
            avatarInput,
            "Only JPEG and PNG images are allowed.",
            "avatarError"
        );

        return false;
    }

    if (file.size >= MAX_FILE_SIZE) {

        showError(
            avatarInput,
            "Your image must be smaller than 500KB.",
            "avatarError"
        );

        return false;
    }

    clearError(avatarInput, "avatarError");

    return true;
}


// Preview the selected profile picture.

avatarInput.addEventListener("change", function () {

    const file = avatarInput.files[0];

    if (!file) {

        previewContainer.hidden = true;

        validateAvatar();

        return;
    }

    if (validateAvatar()) {

        const reader = new FileReader();

        reader.onload = function (event) {

            avatarPreview.src = event.target.result;

            fileNameDisplay.textContent = file.name;

            previewContainer.hidden = false;
        };

        reader.readAsDataURL(file);

    } else {

        previewContainer.hidden = true;
    }

});


// Clear field errors as the user corrects information.

fullNameInput.addEventListener("input", function () {

    if (fullNameInput.value.trim() !== "") {
        clearError(fullNameInput, "nameError");
    }

});

emailInput.addEventListener("input", function () {

    if (emailPattern.test(emailInput.value.trim())) {
        clearError(emailInput, "emailError");
    }

});

githubInput.addEventListener("input", function () {

    if (githubPattern.test(githubInput.value.trim())) {
        clearError(githubInput, "githubError");
    }

});


// Validate fields when the user leaves them.

fullNameInput.addEventListener("blur", validateName);

emailInput.addEventListener("blur", validateEmail);

githubInput.addEventListener("blur", validateGithub);


// Intercept form submission.

registrationForm.addEventListener("submit", function (event) {

    // Prevent the browser from submitting the form normally.

    event.preventDefault();


    // Check every required field.

    const nameIsValid = validateName();

    const emailIsValid = validateEmail();

    const githubIsValid = validateGithub();

    const avatarIsValid = validateAvatar();


    // Stop processing if any field is invalid.

    if (
        !nameIsValid ||
        !emailIsValid ||
        !githubIsValid ||
        !avatarIsValid
    ) {

        const firstInvalidInput = registrationForm.querySelector(
            '[aria-invalid="true"]'
        );

        if (firstInvalidInput) {
            firstInvalidInput.focus();
        }

        return;
    }


    // Retrieve the validated information.

    const name = fullNameInput.value.trim();

    const email = emailInput.value.trim();

    const github = githubInput.value.trim();

    const avatarFile = avatarInput.files[0];


    // Read the uploaded image as a Base64 data URL.

    const reader = new FileReader();

    reader.onload = function (event) {

        // Generate a unique five-digit ticket number.

        const ticketNumber = Math.floor(
            10000 + Math.random() * 90000
        );


        // Create the participant's registration object.

        const registrationData = {

            name: name,

            email: email,

            github: github,

            avatar: event.target.result,

            ticketNumber: ticketNumber

        };


        // Save registration details in browser storage.

        try {

            localStorage.setItem(
                "codingConfUser",
                JSON.stringify(registrationData)
            );

            // Move to the ticket confirmation page.

            window.location.href = "ticket.html";

        } catch (error) {

            showError(
                avatarInput,
                "Your information could not be saved. Please try a smaller image.",
                "avatarError"
            );

            console.error("Storage error:", error);

        }

    };


    reader.onerror = function () {

        showError(
            avatarInput,
            "There was a problem reading your image. Please try again.",
            "avatarError"
        );

    };


    reader.readAsDataURL(avatarFile);

});