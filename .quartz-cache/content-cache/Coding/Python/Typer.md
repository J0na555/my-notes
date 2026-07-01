---
title: " Typer library"
tags:
  - python-library
  - library
date: 2026-02-17
type: reference
status: draft
source: "[typer documentaion](https://typer.tiangolo.com/)"
---
**Typer** is a modern Python library for building command-line interfaces (CLIs) that is intuitive for both developers and users.

###  **Key Features**
Typer is designed as the **"FastAPI of CLIs"**, leveraging Python's type hints to create applications with minimal code.

*   **Intuitive for Developers**: Write less code with great editor support (autocompletion, type checks) and fewer bugs. Parameter declarations are concise.
*   **Easy for Users**: Provides automatic `--help` pages and shell autocompletion (Bash, Zsh, Fish, PowerShell) for a smooth user experience.
*   **Scalable**: Start with a simple 2-line script and grow to complex applications with subcommands and groups.
*   **Run Scripts Easily**: Use the built-in `typer` command to run any Python script as a CLI, even those not using Typer internally.

###  **Installation & Setup**
Installation is straightforward via `pip`. It's recommended to use a virtual environment.

```bash
# 1. Create and activate a virtual environment (example)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install Typer
pip install typer
```

Typer has key dependencies: **Click** (the foundation), **Rich** (for beautiful error formatting), and **Shellingham** (for shell autocompletion detection).

### **Usage Modes & Examples**

Typer can be used in two primary ways:

#### **1. The `typer` Command (No Typer Code Needed)**
You can run any Python script as a CLI without modifying it.

*   **File `main.py`**:
    ```python
    def main(name: str):
        print(f"Hello {name}")
    ```
*   **Run from terminal**:
    ```bash
    typer main.py run Camila    # Output: Hello Camila
    typer main.py run --help    # Shows auto-generated help
    ```

#### **2. Using Typer in Code 
This gives you full control over your CLI's structure.

*   **Simple Application (One Command)**
    Create a script with a single function and use `typer.run()`.
    ```python
    import typer

    def main(name: str, age: int = 20):  # 'age' becomes an optional option
        print(f"Hello {name}, age: {age}")

    if __name__ == "__main__":
        typer.run(main)
    ```
    Run with: `python main.py Camila --age 25`

*   **Multi-Command Application (Using `typer.Typer()`)**
    For complex CLIs with subcommands, create an `app` and use decorators.
    ```python
    import typer

    app = typer.Typer()

    @app.command()
    def hello(name: str):
        """Says hello to you."""  # Docstring becomes command help
        print(f"Hello {name}")

    @app.command()
    def goodbye(name: str, formal: bool = False):
        """Says goodbye."""
        if formal:
            print(f"Goodbye Ms. {name}. Have a good day.")
        else:
            print(f"Bye {name}!")

    if __name__ == "__main__":
        app()
    ```
    Run with: `python main.py goodbye Camila --formal`

### 🧠 **Key Concepts & Parameters**
Typer automatically interprets function parameters based on their type hints and defaults.

| Parameter Type   | How Typer Interprets It                                                                               | Example in Function                                           |
| :--------------- | :---------------------------------------------------------------------------------------------------- | :------------------------------------------------------------ |
| **CLI Argument** | A required positional value.                                                                          | `name: str`                                                   |
| **CLI Option**   | An optional flag or key-value pair. Created by setting a **default value** or using `typer.Option()`. | `age: int = 20` <br> `formal: bool = False`                   |
| **Flag**         | A boolean `option` that doesn't require a value. Its presence toggles the value.                      | `force: bool = False` (use `--force` to set `True`)           |
| **Help Text**    | Add `...` as a default and provide help in `typer.Option()` or `typer.Argument()`.                    | `name: str = typer.Argument(..., help="The person to greet")` |

###  **Additional Notes for Your Studies**
*   **Autocompletion**: To enable shell autocompletion for your installed package, users run `your-cli --install-completion`.
*   **Rich Integration**: Errors are automatically displayed with rich formatting. You can globally disable this by setting the environment variable `TYPER_USE_RICH` to `False` or `0`.
*   **Documentation**: The official tutorial at [link](https://typer.tiangolo.com/tutorial/ ) is the best next step for deeper learning on topics like validators, password prompts, and colors.

