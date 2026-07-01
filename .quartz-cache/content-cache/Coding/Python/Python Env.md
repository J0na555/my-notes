# python

When starting a new project that requires different dependencies—like using BeautifulSoup for web scraping—it's best to create a separate project directory with its own virtual environment. This approach ensures that each project's dependencies are isolated, preventing potential conflicts.

---

### 🧰 Why Separate Virtual Environments?

Even if you name all your virtual environments `pypy`, placing them in different project directories maintains isolation. For example:

```
~/Projects/
├── game_project/
│   ├── pypy/               # Virtual environment for game_project
│   └── game_code.py
└── scraper_project/
    ├── pypy/               # Virtual environment for scraper_project
    └── scraper_code.py
```

In this setup:

- Each `pypy` directory is a distinct virtual environment specific to its project.

- Dependencies installed in one environment won't affect the other.

This structure aligns with best practices in Python development, ensuring clean and manageable projects.

---

### 🛠️ Setting Up Your New Project

Here's how you can set up your new project with [[Web Scraping#BeautifulSoup|BeautifulSoup]]:

1. **Create a New Project Directory:**

    ```bash
    mkdir ~/Projects/scraper_project
    cd ~/Projects/scraper_project
    ```

2. **Create a Virtual Environment Named `pypy`:**

    ```bash
    virtualenv pypy
    ```

    This command creates a new virtual environment in the `pypy` directory within your project.

3. **Activate the Virtual Environment:**

    ```bash
    source pypy/bin/activate
    ```

    Once activated, your shell prompt will change to indicate that you're working within the `pypy` environment.

4. **Install Beautiful Soup:**

    ```bash
    pip install beautifulsoup4
    ```

    This installs BeautifulSoup in your isolated environment.

5. **Start Coding:**

    Create your Python scripts as needed, and they will utilize the packages installed in the `pypy` environment.

---

### 🔄 Switching Between Projects

When working on multiple projects:

- **Activate the relevant environment:**

    ```bash
    cd ~/Projects/game_project
    source pypy/bin/activate
    ```

    or

    ```bash
    cd ~/Projects/scraper_project
    source pypy/bin/activate
    ```

- **Deactivate when done:**

    ```bash
    deactivate
    ```

This practice ensures that you're always working within the correct environment for each project.
