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
// Update "Your Borrowed Books" section dynamically
function updateBorrowedBooksList() {
    const borrowedBooksList = document.getElementById('borrowed-books');
    borrowedBooksList.innerHTML = ''; // Clear the current list

    if (selectedBooks.length > 0) {
        borrowedBooksList.innerHTML = '<li>Choose the books you want to borrow and confirm your selection...</li>'; // Indicate selection in progress
        selectedBooks.forEach(book => {
            borrowedBooksList.innerHTML += `<li>${book} <button onclick="confirmBorrow('${book}')">Confirm Borrow</button></li>`;
        });
    } else {
        borrowedBooksList.innerHTML = '<li>No books selected yet.</li>';
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

// Handle book selection and dynamically update "Your Borrowed Books"
function handleMultiSelect(event) {
    const book = event.target.value;

    // Check if the book is already selected
    if (selectedBooks.includes(book)) {
        selectedBooks = selectedBooks.filter(b => b !== book); // Remove book if already selected
    } else {
        selectedBooks.push(book); // Add book to the selection
    }

    // Update the "Your Borrowed Books" list dynamically
    updateBorrowedBooksList();
}

// Update "Your Borrowed Books" section dynamically
function updateBorrowedBooksList() {
    const borrowedBooksList = document.getElementById('borrowed-books');
    borrowedBooksList.innerHTML = ''; // Clear the current list

    if (selectedBooks.length > 0) {
        borrowedBooksList.innerHTML = '<li>Choosing more books...</li>'; // Indicate selection in progress
        selectedBooks.forEach(book => {
            borrowedBooksList.innerHTML += `<li>${book} <button onclick="confirmBorrow('${book}')">Confirm Borrow</button></li>`;
        });
    } else {
        borrowedBooksList.innerHTML = '<li>No books selected yet.</li>';
    }
}

// Function to handle the actual borrowing process
function borrowBook() {
    const borrowPeriod = document.getElementById('borrow-period').value;
    
    if (selectedBooks.length > 0) {
        if (borrowPeriod > 0) {
            selectedBooks.forEach(book => {
                const borrowTime = new Date().toLocaleString();
                borrowedBooks[book] = {
                    user: currentUser,
                    time: borrowTime,
                    returnBy: new Date(new Date().getTime() + (borrowPeriod * 24 * 60 * 60 * 1000))
                };
            });

            // Save to localStorage
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            selectedBooks = []; // Clear selected books after borrowing
            updateBorrowedBooksList();
            updateBookLists();

            // Confirmation message
            alert(`The book(s) you borrowed are confirmed. Please pick up your ticket at the librarian.`);
        } else {
            alert("Please enter a valid borrowing period.");
        }
    } else {
        alert("Please select at least one book to borrow.");
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

// Register new user with additional fields
function register() {
    const username = document.getElementById('username-register').value;
    const password = document.getElementById('password-register').value;
    const firstName = document.getElementById('first-name').value;
    const middleName = document.getElementById('middle-name').value;
    const lastName = document.getElementById('last-name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;

    if (username && password && firstName && lastName && age && gender) {
        if (users[username]) {
            alert("User already exists!");
        } else {
            users[username] = { 
                password, 
                firstName, 
                middleName: middleName || '', // Optional field
                lastName, 
                age, 
                gender 
            };
            localStorage.setItem('users', JSON.stringify(users));
            alert("Registration successful! Please log in.");
            showSection('login-section');
        }
    } else {
        alert("Please fill in all required fields.");
    }
}

// Display user full name in borrowed book details
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
                const user = users[borrowedBooks[book].user];
                const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
                if (borrowedBooks[book].user === currentUser) {
                    availableBooksList.innerHTML += `<li class="borrowed">${book} (Borrowed by ${fullName} on ${borrowedBooks[book].time}) <button onclick="returnBook('${book}')">Return</button></li>`;
                } else {
                    availableBooksList.innerHTML += `<li>${book} (Borrowed by ${fullName})</li>`;
                }
            } else {
                availableBooksList.innerHTML += `<li>${book}</li>`;
            }
        });
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

// Export borrowed books to Excel with full name and section
function exportToExcel() {
    const borrowedBooksData = [];
    Object.keys(borrowedBooks).forEach(book => {
        const borrowDetails = borrowedBooks[book];
        const user = users[borrowDetails.user];
        if (user) {
            const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
            borrowedBooksData.push([
                book, 
                fullName, 
                user.section, 
                borrowDetails.user, 
                borrowDetails.time, 
                borrowDetails.returnBy ? new Date(borrowDetails.returnBy).toLocaleString() : "N/A"
            ]);
        }
    });

    if (borrowedBooksData.length > 0) {
        const ws = XLSX.utils.aoa_to_sheet([
            ["Book Title", "Full Name", "Section", "Username", "Borrowed Date & Time", "Return By"],
            ...borrowedBooksData
        ]);
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
