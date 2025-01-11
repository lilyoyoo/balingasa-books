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
