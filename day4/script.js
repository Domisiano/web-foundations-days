
const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "day4-draft";
const THEME_KEY = "day4-theme";

function updateCounts() {
    const text = textarea.value;
    const characters = text.length;
    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    charCount.classList.remove("warning", "over");

    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }

    localStorage.setItem(DRAFT_KEY, text);
}

function clearDraft() {
    textarea.value = "";
    localStorage.removeItem(DRAFT_KEY);
    updateCounts();
}

textarea.addEventListener("input", updateCounts);

clearBtn.addEventListener("click", clearDraft);

textarea.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        clearDraft();
    }
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");

    themeToggle.textContent = isDark ? "Light mode" : "Dark mode";

    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// Restore saved draft and theme when the page loads.
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
    textarea.value = savedDraft;
}

const savedTheme = localStorage.getItem(THEME_KEY);

if (savedTheme === "dark") {
    document.body.classList.add("dark");
}

themeToggle.textContent =
    document.body.classList.contains("dark")
        ? "Light mode"
        : "Dark mode";

updateCounts();
