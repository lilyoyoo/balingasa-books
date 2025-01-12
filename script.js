<!-- Add bcrypt.js to your HTML -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bcryptjs/2.4.3/bcrypt.min.js"></script>

<script>
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

function sanitizeInput(input) {
    // Sanitize to remove any HTML special characters to prevent XSS
    return input.replace(/[<>]/g, ''); // Simple sanitization
}

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
            borrowedBooksList.innerHTML += `<li class="borrowed">${sanitizeInput(book)} (Borrowed by ${sanitizeInput(borrowedBooks[book].user)} on ${sanitizeInput(borrowedBooks[book].time)}) <button onclick="returnBook('${sanitizeInput(book)}')">Return</button></li>`;
        } else {
            availableBooksList.innerHTML += `<li>${sanitizeInput(book)}</li>`;
            bookSelect.innerHTML += `<option value="${sanitizeInput(book)}">${sanitizeInput(book)}</option>`;
        }
    });
}

function borrowBook() {
    const selectedBook = document.getElementById('book-select').value;
    if (selectedBook) {
        const borrowTime = new Date().toLocaleString();
        if (borrowedBooks[selectedBook]) {
            alert("This book is already borrowed!");
            return;
        }

        borrowedBooks[selectedBook] = {
            user: currentUser,
            time: borrowTime
        };
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have borrowed "${sanitizeInput(selectedBook)}" at ${borrowTime}`);
    } else {
        alert("Please select a book to borrow!");
    }
}

function returnBook(book) {
    if (borrowedBooks[book] && borrowedBooks[book].user === currentUser) {
        delete borrowedBooks[book];
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        alert(`You have returned "${sanitizeInput(book)}"`);
    } else {
        alert("This book was not borrowed by you!");
    }
}

function register() {
    const username = sanitizeInput(document.getElementById('username-register').value);
    const password = sanitizeInput(document.getElementById('password-register').value);
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (username && password && age && gender) {
        if (users[username]) {
            alert("User already exists!");
        } else {
            // Hash the password before storing it
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    alert("Error hashing password.");
                    return;
                }

                users[username] = { password: hashedPassword, age, gender };
                localStorage.setItem('users', JSON.stringify(users));
                alert("Registration successful! Please log in.");
                showSection('login-section');
            });
        }
    } else {
        alert("Please fill in all fields.");
    }
}

function login() {
    const username = sanitizeInput(document.getElementById('username-login').value);
    const password = sanitizeInput(document.getElementById('password-login').value);

    if (users[username]) {
        bcrypt.compare(password, users[username].password, (err, res) => {
            if (res) {
                currentUser = username;
                alert(`Welcome, ${sanitizeInput(username)}!`);
                updateBookLists();
                showSection('borrow-section');
            } else {
                alert("Invalid credentials!");
            }
        });
    } else {
        alert("Invalid credentials!");
    }
}

function logout() {
    currentUser = null;
    alert("You have been logged out!");
    showSection('login-section');
}

function exportToExcel() {
    const borrowedBooksData = [];
    Object.keys(borrowedBooks).forEach(book => {
        const borrowDetails = borrowedBooks[book];
        borrowedBooksData.push([sanitizeInput(book), sanitizeInput(borrowDetails.user), sanitizeInput(borrowDetails.time)]);
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

// Session timeout mechanism (Auto-logout after 1 hour of inactivity)
setTimeout(() => {
    if (currentUser) {
        alert("Your session has expired. Please log in again.");
        logout();
    }
}, 3600000); // 1 hour timeout for session

</script>
