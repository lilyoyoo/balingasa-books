const users = JSON.parse(localStorage.getItem('users')) || {};
let currentUser = null;

const books = {
    English: [
        "DISCOVER SKILLS FOR LIFE",
        "Encyclopedia of The World and its people",
        "MODULE IN ENGLISH 7",
        "MODULE IN ENGLISH 8",
        "The Apartheid Reader",
        "Visual Intelligence",
        "Other books you want to borrow"
    ],
    Filipino: [
        "FLORANTE AT LAURA",
        "Ibong Adarna",
        "NOLI ME TANGERE",
        "SIBIKA AT KULTURA PARA SA MALAYANG PILIPINO",
        "Other books you want to borrow"
    ],
    ICT: [
        "Computer In Business",
        "CYBERSTRATEGIES - HOW TO BUILD AN INTERN",
        "SIMPLE ELECTRONIC (BASIC)",
        "Stevens COMPUTER GRAPHICS BASICS Prentice",
        "Word Processing - Desktop Publishing",
        "Other books you want to borrow"
    ],
    Science: [
        "HOLT SCIENCE AND TECHNOLOGY WATER ON EA",
        "Prentice Hall SCIENCE MATTER Building block of matter",
        "SKYLABS ASTRONOMY AND SPACE SCIENCES",
        "THE SCIENCE OF ANIMAL AGRICULTURE",
        "Principles of Marketing",
        "The Sea",
        "The Science Library",
        "Mysteries of Mind Space and Time",
        "The World We Lived In",
        "Discover Science",
        "Integrated Science Philippines 8",
        "Earth Science",
        "Skylab's Astronomy and Space Science",
        "Other books you want to borrow"
    ]
};

let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || {};
let selectedBooks = []; // For storing selected books

// Show section
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Update book lists
function updateBookLists() {
    const categorySelect = document.getElementById('category-select');
    const availableBooksList = document.getElementById('available-books');
    const bookSelect = document.getElementById('book-select');

    availableBooksList.innerHTML = '';
    bookSelect.innerHTML = '<option value="" disabled>Select books</option>';

    const selectedCategory = categorySelect.value;
    if (selectedCategory && books[selectedCategory]) {
        books[selectedCategory].forEach(book => {
            const option = document.createElement('option');
            option.value = book;
            option.textContent = book;
            bookSelect.appendChild(option);

            if (borrowedBooks[book]) {
                // Show the "Return" button only for the logged-in user
                if (borrowedBooks[book].user === currentUser) {
                    availableBooksList.innerHTML += `<li class="borrowed">${book} (Borrowed by ${borrowedBooks[book].user} on ${borrowedBooks[book].time}) <button onclick="returnBook('${book}')">Return</button></li>`;
                } else {
                    availableBooksList.innerHTML += `<li>${book} (Borrowed by ${borrowedBooks[book].user})</li>`;
                }
            } else {
                availableBooksList.innerHTML += `<li>${book}</li>`;
            }
        });
    }
}

// Update borrowed books list
function updateBorrowedBooksList() {
    const borrowedBooksList = document.getElementById('borrowed-books');
    borrowedBooksList.innerHTML = '';

    selectedBooks.forEach(book => {
        borrowedBooksList.innerHTML += `<li>${book} <button onclick="returnBook('${book}')">Return</button></li>`;
    });
}

// Handle book selection and updating borrowed books list
function handleMultiSelect(event) {
    const book = event.target.value;

    if (selectedBooks.includes(book)) {
        // If already selected, remove it
        selectedBooks = selectedBooks.filter(b => b !== book);
    } else {
        // Otherwise, add to selected list
        selectedBooks.push(book);
    }

    // Update the list of borrowed books
    updateBorrowedBooksList();
}

// Borrow selected books
function borrowBook() {
    const borrowPeriod = document.getElementById('borrow-period').value;

    if (selectedBooks.length > 0 && borrowPeriod > 0) {
        const borrowTime = new Date().toLocaleString();

        selectedBooks.forEach(book => {
            if (!borrowedBooks[book]) {
                borrowedBooks[book] = {
                    user: currentUser,
                    time: borrowTime,
                    returnBy: new Date(new Date().getTime() + (borrowPeriod * 24 * 60 * 60 * 1000))
                };
            }
        });

        // Save updated borrowedBooks to localStorage
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));

        // Update book lists UI
        updateBookLists();
        alert(`You have borrowed ${selectedBooks.length} book(s) for ${borrowPeriod} days.`);
    } else {
        alert("Please select at least one book and enter a valid borrowing period!");
    }
}

// Return borrowed book
function returnBook(book) {
    if (borrowedBooks[book] && borrowedBooks[book].user === currentUser) {
        delete borrowedBooks[book];
        localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
        updateBookLists();
        updateBorrowedBooksList();
        alert(`You have returned "${book}".`);
    } else {
        alert("This book was not borrowed by you!");
    }
}

// Register new user
function register() {
    const username = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (username && password && age && gender) {
        if (users[username]) {
            alert("User already exists!");
        } else {
            users[username] = { password, age, gender };
            localStorage.setItem('users', JSON.stringify(users));
            alert("Registration successful! Please log in.");
            showSection('login-section');
        }
    } else {
        alert("Please fill in all fields.");
    }
}

// User login
function login() {
    const username = document.getElementById('username-login').value;
    const password = document.getElementById('password-login').value;

    if (users[username] && users[username].password === password) {
        currentUser = username;
        alert(`Welcome, ${username}!`);
        updateBookLists();
        showSection('borrow-section');
    } else {
        alert("Invalid credentials!");
    }
}

// User logout
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
function init() {
    const bookSelect = document.getElementById('book-select');
    bookSelect.addEventListener('change', handleMultiSelect);
    updateBookLists();
}

init();
