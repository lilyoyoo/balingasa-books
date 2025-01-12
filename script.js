const users = JSON.parse(localStorage.getItem('users')) || {}; 
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

// Function to show different sections
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Function to update available and borrowed books list
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

// Borrow book function
function borrowBook() {
    const selectedBook = document.getElementById('book-select').value;
    if (selectedBook) {
        const borrowTime = new Date().toLocaleString();
        borrowedBooks[selectedBook] = {
            user: currentUser,
            time: borrowTime
        };
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have borrowed "${selectedBook}" at ${borrowTime}`);
    } else {
        alert("Please select a book to borrow!");
    }
}

// Return book function
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

// Register user function
function register() {
    const username = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    // Debugging: Log the user input
    console.log("Registering user:", username, password, age, gender);

    // Validation: Ensure no fields are empty
    if (username && password && age && gender) {
        // Check if the username already exists
        if (users[username]) {
            alert("User already exists!");
            console.log("User already exists:", username);
        } else {
            // Add user to the users object
            users[username] = { password, age, gender };
            localStorage.setItem('users', JSON.stringify(users));  // Save the updated users object to localStorage
            
            // Log the users object to check if it's saved correctly
            console.log("Users saved to localStorage:", users);
            
            alert("Registration successful! Please log in.");
            showSection('login-section');
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// Login function
function login() {
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    // Debugging: Log the input credentials
    console.log("Login attempt:", username, password);

    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert(`Welcome, ${username}!`);
        updateBookLists();
        showSection('borrow-section');  // Show book borrowing section after login
    } else {
        alert("Invalid credentials!");
    }
}

// Logout function
function logout() {
    currentUser = null;
    alert("You have been logged out!");
    showSection('login-section');
}

// Export borrowed books to Excel
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
showSection('login-section');  // Show the login section by default
