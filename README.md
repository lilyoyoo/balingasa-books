<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Library Borrowing System</title>
    <style>
body {
    font-family: 'Arial', sans-serif;
    background-color: #f5f5f5;
    margin: 0;
    padding: 20px;
}

h1, h2, h3 {
    text-align: center;
    color: #4A4A4A;
}

.section {
    display: none;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
}

.active {
    display: flex;
}

#auth-section, #borrow-section {
    background-color: #EAE1D5;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    padding: 30px;
    max-width: 400px;
    margin: 30px auto;
}

input, select, button {
    width: 100%;
    padding: 12px;
    margin: 10px 0;
    border: 2px solid #B2AFA2;
    border-radius: 4px;
    font-size: 16px;
}

button {
    background-color: #8B6F54;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #5B4C3A;
}

    </style>
</head>
<body>
    <h1>Library Borrowing System</h1>

    <div id="borrow-section" class="section active">
        <h2>Book Borrowing</h2>
        <div id="auth-section">
            <h3>Available Books:</h3>
            <ul id="available-books"></ul>

            <h3>Borrow a Book:</h3>
            <select id="book-select"></select>
            <button onclick="borrowBook()">Borrow</button>

            <h3>Borrowed Books:</h3>
            <ul id="borrowed-books"></ul>

            <button onclick="exportToExcel()">Export Borrowed Books to Excel</button>
        </div>
    </div>

    <script>
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

        let borrowedBooks = {};

        function updateBookLists() {
            const availableBooksList = document.getElementById('available-books');
            const borrowedBooksList = document.getElementById('borrowed-books');
            const bookSelect = document.getElementById('book-select');

            availableBooksList.innerHTML = '';
            borrowedBooksList.innerHTML = '';
            bookSelect.innerHTML = '<option value="" disabled selected>Select a book</option>';

            books.forEach(book => {
                if (borrowedBooks[book]) {
                    borrowedBooksList.innerHTML += `<li class="borrowed">${book} (Borrowed by ${borrowedBooks[book]})</li>`;
                } else {
                    availableBooksList.innerHTML += `<li>${book}</li>`;
                    bookSelect.innerHTML += `<option value="${book}">${book}</option>`;
                }
            });
        }

        function borrowBook() {
            const selectedBook = document.getElementById('book-select').value;
            if (selectedBook) {
                borrowedBooks[selectedBook] = 'User';
                updateBookLists();
                alert(`You borrowed "${selectedBook}".`);
            }
        }

        function exportToExcel() {
            alert('Exporting data to Excel...');
        }

        updateBookLists();
    </script>
</body>
</html>
