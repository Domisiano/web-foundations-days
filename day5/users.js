const API_URL = "https://jsonplaceholder.typicode.com/users";

const loadButton = document.querySelector("#load-users");
const filterInput = document.querySelector("#filter-input");
const statusText = document.querySelector("#status");
const usersList = document.querySelector("#users-list");

let loadedUsers = [];
let hasLoadedUsers = false;
let isLoading = false;

/**
 * Render the supplied users into the directory.
 * API text is assigned with textContent rather than parsed as HTML.
 */
function renderUsers(users) {
    usersList.replaceChildren();

    users.forEach((user) => {
        const item = document.createElement("li");
        item.className = "user-card";

        const name = document.createElement("h3");
        name.textContent = user.name || "Name unavailable";

        const email = document.createElement("p");
        email.className = "user-detail";
        const emailLabel = document.createElement("span");
        emailLabel.className = "detail-label";
        emailLabel.textContent = "Email";
        const emailValue = document.createElement("span");
        emailValue.textContent = user.email || "Not provided";
        email.append(emailLabel, emailValue);

        const city = document.createElement("p");
        city.className = "user-detail";
        const cityLabel = document.createElement("span");
        cityLabel.className = "detail-label";
        cityLabel.textContent = "City";
        const cityValue = document.createElement("span");
        cityValue.textContent = user.address?.city || "Not provided";
        city.append(cityLabel, cityValue);

        const company = document.createElement("p");
        company.className = "user-detail";
        const companyLabel = document.createElement("span");
        companyLabel.className = "detail-label";
        companyLabel.textContent = "Company";
        const companyValue = document.createElement("span");
        companyValue.textContent = user.company?.name || "Not provided";
        company.append(companyLabel, companyValue);

        item.append(name, email, city, company);
        usersList.appendChild(item);
    });
}

/**
 * Fetch the users once and keep them in memory for client-side filtering.
 */
async function loadUsers() {
    if (isLoading) return;

    isLoading = true;
    loadButton.disabled = true;
    loadButton.textContent = "Loading…";
    statusText.textContent = "Loading users from the server…";
    usersList.replaceChildren();

    try {
        const response = await fetch(API_URL);

        // fetch() does not reject automatically for HTTP errors such as 404 or 500.
        if (!response.ok) {
            throw new Error(`The server returned status ${response.status}.`);
        }

        const users = await response.json();
        if (!Array.isArray(users)) {
            throw new Error("The server response was not a list of users.");
        }

        loadedUsers = users;
        hasLoadedUsers = true;
        renderUsers(loadedUsers);
        statusText.textContent = `Loaded ${loadedUsers.length} users.`;
    } catch (error) {
        loadedUsers = [];
        hasLoadedUsers = false;
        renderUsers([]);
        statusText.textContent = "Could not load users. Check your connection and try again.";
        console.error("Could not load users:", error);
    } finally {
        // Always restore the button, whether the request succeeds or fails.
        isLoading = false;
        loadButton.disabled = false;
        loadButton.textContent = "Load users";
    }
}

function filterUsers() {
    if (!hasLoadedUsers) {
        if (!isLoading && filterInput.value.trim() !== "") {
            statusText.textContent = "Load users before filtering the directory.";
        }
        return;
    }

    const searchTerm = filterInput.value.trim().toLowerCase();
    const filteredUsers = loadedUsers.filter((user) =>
        (user.name || "").toLowerCase().includes(searchTerm)
    );

    renderUsers(filteredUsers);

    if (filteredUsers.length === 0) {
        statusText.textContent = "No users match your filter.";
    } else if (searchTerm === "") {
        statusText.textContent = `Loaded ${loadedUsers.length} users.`;
    } else {
        statusText.textContent = `Showing ${filteredUsers.length} of ${loadedUsers.length} users.`;
    }
}

loadButton.addEventListener("click", loadUsers);
filterInput.addEventListener("input", filterUsers);
