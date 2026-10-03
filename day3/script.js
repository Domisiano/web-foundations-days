let notes = [
    { id: 1, text: "Buy milk and bread", category: "personal" },
    { id: 2, text: "Finish the Day 3 assignment", category: "study" },
    { id: 3, text: "Email the project report to Grace", category: "work" },
    { id: 4, text: "Revise JavaScript arrays", category: "study" },
    { id: 5, text: "Call mum", category: "personal" },
];

function searchNotes(word) {
    return notes.filter((note) =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}

console.log(searchNotes("day"));
console.log(searchNotes("python"));

function longestNote() {
    if (notes.length === 0) {
        return null;
    }

    let longest = notes[0];

    for (const note of notes) {
        if (note.text.length > longest.text.length) {
            longest = note;
        }
    }

    return longest;
}

function countByCategory() {
    const counts = {
        personal: 0,
        work: 0,
        study: 0
    };

    for (const note of notes) {
        counts[note.category]++;
    }

    return counts;
}

function getSummary() {
    const counts = countByCategory();

    const word = notes.length === 1 ? "note" : "notes";

    return `${notes.length} ${word}: ${counts.personal} personal, ${counts.work} work, ${counts.study} study.`;
}

function isDuplicate(text) {
    const cleanedText = text.trim().toLowerCase();

    return notes.some(
        (note) => note.text.trim().toLowerCase() === cleanedText
    );
}

function addNote(text, category) {
    const cleanedText = text.trim();

    if (cleanedText.length === 0 || cleanedText.length > 200) {
        console.log("Note rejected: text must be 1-200 characters.");
        return false;
    }

    if (isDuplicate(cleanedText)) {
        console.log("Note rejected: duplicate note.");
        return false;
    }

    if (
        category !== "personal" &&
        category !== "work" &&
        category !== "study"
    ) {
        console.log("Note rejected: invalid category.");
        return false;
    }

    const newNote = {
        id: Date.now(),
        text: cleanedText,
        category: category
    };

    notes.push(newNote);

    console.log(`Note added: "${newNote.text}"`);
    return true;
}

