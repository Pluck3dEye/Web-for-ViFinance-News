# Web for ViFinance News

This is a web-app built for [the course project of CS3332](https://github.com/DTJ-Tran/VifinanceNews)

## 📸 Demo (In Progress)

![The Main Page](./assets/MainPage.png)

## 🚀 Features

- Vite + React
- Tailwind CSS v4.1
- Flask Python (for backend/testing server)

## Current State
- Frontend is in testing and integrated with the backend project

## 🛠️ Installation & Usage

### Prerequisites
- [Node.js](https://nodejs.org/en/download)  (Recommended: v20.18.0)
- [Python v3.x](https://www.python.org/downloads/) (if using the testing server)

### Setup (Linux/Windows)

1. **Clone the repository**
   ```sh
   git clone https://github.com/Pluck3dEye/Web-for-ViFinance-News.git
   cd Web-for-ViFinance-News
   ```

2. **(Optional) Extract if downloaded as zip**
   ```sh
   unzip <file-name>
   cd Web-for-ViFinance-News
   ```

3. **Install frontend dependencies**
   ```sh
   npm install
   ```

4. **(Optional) Set up the Python server**
   ```sh
   python -m venv .venv
   .venv\Scripts\activate  # On Windows
   # or
   source .venv/bin/activate  # On Linux/Mac
   pip install -r requirements.txt
   ```

5. **Run the app in development mode**
   - Frontend:
     ```sh
     npm run dev
     ```
   - Backend (if needed):
     ```sh
     flask run
     ```

6. **Build for production**
   ```sh
   npm run build
   ```
   This creates a `dist` folder with production-ready files.

7. **Serve the production build locally**
   ```sh
   npm install -g serve  # Install 'serve' if not already
   serve -s dist
   ```
   This will start a local server (default: http://localhost:3000) serving your built frontend.

---

## 🚀 Deployment
- Upload the contents of the `dist` folder to your web server or a static hosting service (Netlify, Vercel, etc.).
- For Netlify/Vercel: set the output directory to `dist`.
- The backend (Flask) should be deployed separately if your frontend fetches data from it.

---

# Log

- [Log fix 1 6/5/2025](https://gist.github.com/Blindn3ss/e2fbb6ecc9437e8c0ffe321314612521)

# Note
⚠️ This project was created as a team effort for academic purposes.
Frontend and partial backend were developed by [Dung "pluck3deye" Nguyen](https://github.com/Pluck3dEye).
