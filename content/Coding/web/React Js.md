---
title: React Js
tags:
  - frameworks
  - frontend
  - javascript_fundamentals
  - react
date: 2025-09-11
---
We'll cover:

1. **What React Is (The Big Idea)**
2. **Prerequisites: What You Need to Know First**
3. **The Two Ways to Start a React Project**
4. **Deep Dive: Folder Structure of a Modern React Project (Created with Vite)**
5. **Your First React Component: Syntax and Concepts**
6. **Next Steps & Essential Concepts to Learn**

---

### 1. What React Is (The Big Idea)

React is a **JavaScript library** for building user interfaces (UIs), specifically for web applications. Its core philosophy is based on two key concepts:

* **Components:** You build your UI out of small, reusable pieces called components. Think of them like Lego blocks. A button is a component, a navigation bar is a component, a whole page is a component made of smaller components.
* **Declarative Programming:** You *declare* or *describe* what the UI should look like for any given state (e.g., "when the user is logged in, show the dashboard"). React then automatically updates the DOM to match that description. You don't have to manually manipulate the DOM (e.g., `document.getElementById(...).innerHTML = ...`), which is called imperative programming and is error-prone.

**Analogy:** Building with React is like giving a chef a recipe (the component with its logic and state) rather than telling them every single step for every single dish.

---

### 2. Prerequisites: What You Need to Know First

Before diving into React, you **must** be comfortable with:

* **HTML & CSS:** The building blocks of the web.
* **[[JavaScript fundamentals|Core JavaScript]] (ES6+):** This is the most important one. Specifically:
  * `let` and `const`
  * Arrow functions (`() => {}`)
  * Array methods (`map`, `filter`, etc.)
  * `import`/`export` (ES6 Modules)
  * `Promises` and `async/await`
  * The `DOM` (conceptually, you won't manipulate it directly)

---

### 3. The Two Ways to Start a React Project

#### A. The Simple Way (For Learning & Quick Prototypes): Using a CDN

You can add React to a simple HTML file via `<script>` tags. This is great for tiny experiments but **not** how real-world applications are built. It lacks the modern tooling.

#### B. The Standard Way (For All Real Projects): Using a Build Tool

This is the professional approach. You use a command-line tool to generate a full project with all the necessary files and tools. The two most popular tools are:

1. **Create React App (CRA):** The old, stable, beginner-friendly tool. It's a bit heavier and slower.
2. **Vite (Recommended):** The new, incredibly fast, and modern tool. It's becoming the new standard.

**We will use Vite.** To create a new project, you run this in your terminal:

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
npm run dev
```

---

### 4. Deep Dive: Folder Structure of a Modern React Project (Created with Vite)

After running the commands above, your project (`my-react-app`) will look like this:

```
my-react-app/
├── node_modules/          # [A] All 3rd-party libraries (React, etc.) live here. NEVER touch this folder.
├── public/                # [B] Static assets that are served directly. Bypasses the build process.
│   └── vite.svg          #    Example: favicon.ico, robots.txt, or large image files would go here.
├── src/                   # [C] *** THE MOST IMPORTANT FOLDER *** This is where all your work happens.
│   ├── assets/           #    Static assets that are processed by the build tool (e.g., optimized images, CSS).
│   │   └── react.svg     #    Example: This SVG was imported and processed by Vite.
│   ├── App.css           #    The CSS styles for your main `App` component.
│   ├── App.jsx           #    The main top-level React component of your entire application.
│   ├── index.css         #    Global CSS styles. This file is applied to the whole page.
│   ├── main.jsx          #    The **JavaScript entry point**. This is the first file that runs.
│   └── ... (others)
├── .gitignore            # Tells Git which files/folders to ignore (e.g., node_modules, .env)
├── index.html            # The SINGLE HTML page that is served. The root div is here.
├── package-lock.json     # A auto-generated file that locks dependency versions for exact installs.
├── package.json          # [D] The project's manifest file. Lists dependencies, scripts, and metadata.
└── vite.config.js        # Configuration file for the Vite build tool.
```

#### Let's break down the key files

* **`package.json`**: This is your project's ID card. It lists:
  * `dependencies`: Libraries your app needs to run (React, React-DOM, etc.). You install them with `npm install <library-name>`.
  * `devDependencies`: Tools needed only during development (Vite, ESLint).
  * `scripts`: Shortcuts for commands like `npm run dev` (start dev server) or `npm run build` (create production files).

* **`index.html`**: This is the *only* HTML file. Notice the `<div id="root"></div>`. This is the empty container where your entire React app will be "injected" or "mounted".

* **`src/main.jsx`**: This is the bridge between the HTML and your React app.

    ```jsx
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'

    // This finds the div with id="root" and puts your App component inside it.
    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    ```

* **`src/App.jsx`**: This is your first and main component. It's a functional component.

    ```jsx
    // Importing dependencies (like CSS and images)
    import { useState } from 'react'
    import reactLogo from './assets/react.svg'
    import './App.css'

    // Defining the component as a function
    function App() {
      // This is a "state" variable. We'll explain this next.
      const [count, setCount] = useState(0)

      // The function returns JSX - which looks like HTML but is actually JavaScript!
      return (
        <div className="App">
          <div>
            <a href="https://react.dev" target="_blank">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>
          <h1>Vite + React</h1>
          <div className="card">
            {/* This is an event handler. When clicked, it updates the count state. */}
            <button onClick={() => setCount((count) => count + 1)}>
              count is {count} {/* This displays the current value of the count state */}
            </button>
            <p>
              Edit <code>src/App.jsx</code> and save to test HMR
            </p>
          </div>
          <p className="read-the-docs">
            Click on the Vite and React logos to learn more
          </p>
        </div>
      )
    }

    // Exporting the component so it can be used in other files (like main.jsx)
    export default App
    ```

---

### 5. Your First React Component: Syntax and Concepts

Let's dissect the `App.jsx` component to understand the core concepts.

#### A. JSX

It looks like HTML inside JavaScript. Rules:

* You must return a single parent element (e.g., a `<div>` or a `<> </>` Fragment).
* Use `className` instead of `class`.
* Use `htmlFor` instead of `for` (in labels).
* Embed JavaScript expressions inside curly braces `{ }` (e.g., `{count}`, `{myVariable}`).

#### B. State (`useState` Hook)

This is how React remembers and manages data that changes over time (e.g., a counter, user input, data from an API).

* `const [count, setCount] = useState(0)`: This creates a state variable `count` starting at `0`, and a *setter function* `setCount` to update it.
* **You NEVER modify state directly:** `count = 1` is WRONG.
* **You MUST use the setter function:** `setCount(1)` or `setCount(count + 1)` is CORRECT.
* When the state updates, React automatically re-renders the component to show the new value.

#### C. Event Handlers

You use attributes like `onClick`, `onChange`, `onSubmit` to respond to user interactions.

* `onClick={() => setCount(count + 1)}`: When the button is clicked, the arrow function runs, which calls `setCount` to update the state.

---

### 6. Next Steps & Essential Concepts to Learn

Once you're comfortable creating a simple component, learn these concepts in order:

1. **Props:** How to pass data from a parent component to a child component. (e.g., `<UserCard name="John" age={30} />`).
2. **More Hooks:**
    * `useEffect`: For handling "side effects" like fetching data from an API, setting up subscriptions, or manually changing the DOM.
    * `useContext`: For managing global state without passing props down through many levels.
3. **Conditional Rendering:** Showing/hiding parts of your JSX based on conditions (`&&`, `? :`).
4. **Rendering Lists:** Using `map()` to render an array of data into a list of components. Always use a unique `key` prop.
5. **React Router:** The standard library for adding navigation between different "pages" (which are actually different components) in your single-page application (SPA).
6. **State Management (Advanced):** For large apps, you might need libraries like **Redux** or **Zustand** to manage complex state across many components.

## Related

- [[Object reference and copying]]
- [[Python Web Frameworks]]
- [[Objects in JS]]
