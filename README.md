# Library Borrowing System

## Description

The **Library Borrowing System** allows users to register, log in, borrow books, and view borrowed books. It provides an interface for logging in, registering, selecting available books, borrowing, and returning books. The system also allows exporting the list of borrowed books to an Excel file.

## Features

- **User Authentication**: Users can register and log in to the system.
- **Book Borrowing**: Users can borrow books from a list of available books.
- **Return Books**: Users can return borrowed books and update the system.
- **Export Borrowed Books**: Users can export the list of borrowed books to an Excel file for record-keeping.

## Technologies Used

- **HTML**: Provides the structure and layout for the web application.
- **CSS**: Handles the styling and visual presentation of the app.
- **JavaScript**: Powers the functionality, including user authentication, book borrowing, and export features.
- **Firebase**: (Optional) Firebase Authentication can be integrated for user authentication. Refer to `firebaseauth.js` for custom Firebase setup.
- **XLSX.js**: Used to generate and export the list of borrowed books in Excel format.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/yourusername/library-borrowing-system.git
    ```

2. Navigate to the project directory:

    ```bash
    cd library-borrowing-system
    ```

3. Open the `index.html` file in a browser to run the application.

## Usage

### Registering a New User
1. Go to the **Register** section.
2. Fill in the required details: Username, Password, Age, and Gender.
3. Click **Register** to create your account.
4. After registration, you can log in using the newly created username and password.

### Logging In
1. Enter your username and password in the **Login** section.
2. Click **Login** to access the borrowing section.

### Borrowing a Book
1. Once logged in, navigate to the **Book Borrowing** section.
2. Select a book from the available list.
3. Click **Borrow** to borrow the selected book.

### Returning a Book
1. In the **Borrowed Books** list, you can see all the books you've borrowed.
2. Click **Return** to return a book.

### Exporting Borrowed Books to Excel
1. Once you're logged in and have borrowed books, click the **Export Borrowed Books to Excel** button.
2. The system will generate an Excel file with the borrowed books details.

## File Structure

- `index.html`: Main HTML file containing the structure of the application.
- `styles.css`: The stylesheet for the design and layout of the application.
- `script.js`: Contains the JavaScript code for handling functionality like registration, login, book borrowing, and exporting to Excel.
- `firebaseauth.js`: (Optional) Script for Firebase authentication setup.

## Contributing

If you want to contribute to this project:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a new Pull Request.

## License

This project is open-source and available under the [MIT License](LICENSE).

---

Feel free to customize this README to fit your specific project needs, including adding your own repository URL and other necessary details!
