/* =========================================
   CODING CONF 2026
   Dynamic Ticket Generation
   ========================================= */


// Retrieve the participant's registration information.

const savedRegistration = localStorage.getItem("codingConfUser");


// Redirect visitors who have not registered.

if (!savedRegistration) {

    window.location.replace("index.html");

} else {

    try {

        // Convert the saved JSON string back into an object.

        const participant = JSON.parse(savedRegistration);


        // Check that the required information exists.

        if (
            !participant ||
            !participant.name ||
            !participant.email ||
            !participant.github ||
            !participant.avatar ||
            !participant.ticketNumber
        ) {

            localStorage.removeItem("codingConfUser");

            window.location.replace("index.html");

        } else {


            // Select the ticket elements.

            const congratsHeading = document.getElementById("congratsHeading");

            const readyMessage = document.getElementById("readyMessage");

            const ticketName = document.getElementById("ticketName");

            const ticketEmail = document.getElementById("ticketEmail");

            const ticketGithub = document.getElementById("ticketGithub");

            const githubLink = document.getElementById("githubLink");

            const ticketAvatar = document.getElementById("ticketAvatar");

            const ticketID = document.getElementById("ticketID");


            // Display the participant's name in the confirmation message.

            congratsHeading.textContent =
                "Congrats, " + participant.name + "!";


            // Display the remaining confirmation message.

            readyMessage.textContent = "Your ticket is ready.";


            // Populate the ticket with registration details.

            ticketName.textContent = participant.name;

            ticketEmail.textContent = participant.email;

            ticketGithub.textContent = participant.github;

            ticketID.textContent = "#" + participant.ticketNumber;


            // Display the uploaded profile picture.

            ticketAvatar.src = participant.avatar;

            ticketAvatar.alt = "Profile picture of " + participant.name;


            // Remove the @ symbol to create the GitHub profile URL.

            const githubUsername = participant.github.substring(1);

            githubLink.href = "https://github.com/" + githubUsername;

        }

    } catch (error) {

        // Remove corrupted information and return to the homepage.

        localStorage.removeItem("codingConfUser");

        window.location.replace("index.html");

        console.error("Ticket loading error:", error);

    }

}


// Allow the participant to print their ticket.

const printButton = document.getElementById("printTicket");

if (printButton) {

    printButton.addEventListener("click", function () {

        window.print();

    });

}