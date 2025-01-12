// Assuming Firebase is set up and initialized
// Replace with your Firebase config
const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID'
};
firebase.initializeApp(firebaseConfig);

let currentUser = null;

const books = [
    "Principles of Marketing",
    "The Sea",
    "The Science Library",
    "Mysteries of Mind Space and Time",
    "The World We Lived In",
    "Discover Science",
    "Integrated Science Philippines 8",
    "Earth Science",
    "Skylab's Astronomy and Space Science"
];

let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || {};

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

function updateBookLists() {
    const availableBooksList = document.getElementById('available-books');
    const borrowedBooksList = document.getElementById('borrowed-books');
    const bookSelect = document.getElementById('book-select');

    availableBooksList.innerHTML = '';
    borrowedBooksList.innerHTML = '';
    bookSelect.innerHTML = '<option value="" disabled selected>Select a book</option>';

    books.forEach(book => {
        if (borrowedBooks[book]) {
            borrowedBooksList.innerHTML += `<li class="borrowed">${book} (Borrowed by ${borrowedBooks[book].user} on ${borrowedBooks[book].time}) <button onclick="returnBook('${book}')">Return</button></li>`;
        } else {
            availableBooksList.innerHTML += `<li>${book}</li>`;
            bookSelect.innerHTML += `<option value="${book}">${book}</option>`;
        }
    });
}

// Securely hash the password using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

function sanitizeInput(input) {
    // Escape harmful characters to prevent XSS attacks
    return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function register() {
    const username = sanitizeInput(document.getElementById('username-register').value);
    const password = sanitizeInput(document.getElementById('password-register').value);
    const age = sanitizeInput(document.getElementById('age').value);
    const gender = sanitizeInput(document.getElementById('gender').value);

    if (username && password && age && gender) {
        firebase.auth().createUserWithEmailAndPassword(username, password)
            .then(userCredential => {
                const user = userCredential.user;
                alert("Registration successful! Please log in.");
                showSection('login-section');
            })
            .catch(error => {
                alert("Error during registration: " + error.message);
            });
    } else {
        alert("Please fill in all fields.");
    }
}

function login() {
    const username = sanitizeInput(document.getElementById('username-login').value);
    const password = sanitizeInput(document.getElementById('password-login').value);

    firebase.auth().signInWithEmailAndPassword(username, password)
        .then(userCredential => {
            const user = userCredential.user;
            currentUser = user.email;
            alert(`Welcome, ${user.email}!`);
            updateBookLists();
        })
        .catch(error => {
            alert("Invalid credentials: " + error.message);
        });
}

function logout() {
    firebase.auth().signOut()
        .then(() => {
            currentUser = null;
            alert("You have been logged out!");
            showSection('login-section');
        })
        .catch(error => {
            alert("Error logging out: " + error.message);
        });
}

function borrowBook() {
    const selectedBook = document.getElementById('book-select').value;
    if (selectedBook && currentUser) {
        const borrowTime = new Date().toLocaleString();
        borrowedBooks[selectedBook] = {
            user: currentUser,
            time: borrowTime
        };
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have borrowed "${selectedBook}" at ${borrowTime}`);
    } else {
        alert("Please select a book to borrow or you are not logged in!");
    }
}

function returnBook(book) {
    if (borrowedBooks[book] && borrowedBooks[book].user === currentUser) {
        delete borrowedBooks[book];
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have returned "${book}"`);
    } else {
        alert("This book was not borrowed by you!");
    }
}

function exportToExcel() {
    const borrowedBooksData = [];
    Object.keys(borrowedBooks).forEach(book => {
        const borrowDetails = borrowedBooks[book];
        borrowedBooksData.push([book, borrowDetails.user, borrowDetails.time]);
    });

    if (borrowedBooksData.length > 0) {
        const ws = XLSX.utils.aoa_to_sheet([["Book Title", "Borrowed By", "Date & Time"], ...borrowedBooksData]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Borrowed Books");

        XLSX.writeFile(wb, "borrowed_books.xlsx");
    } else {
        alert("No borrowed books to export.");
    }
}

// Initialize the app
updateBookLists();
showSection('borrow-section');
