# Simple GitHub Search Web App

This project is a simple web app for searching GitHub users. The app allows you to search for users by username, view their profile images, and see their public repositories.

## Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/jonahtan1995/simple-web-app.git
   cd simple-web-app
   ```

2. **Set Up the Backend**:

   - Create a `.env` file in the `server` folder:
     ```plaintext
     GITHUB_ACCESS_TOKEN=<Your GitHub Token>
     ```
   - **Install Dependencies** and **Run The Web App**:
     ```bash
     npm i
     npm start
     ```
   - Then visit `http://localhost:3000/`.

3. **Usage**:
   - Enter a GitHub username in the search bar and press "Search."
   - Use pagination to browse through results.
   - Click on a user to view their profile on GitHub.
