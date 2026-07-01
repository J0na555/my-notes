---
title: Rich library
tags:
  - python-library
  - library
date: 2026-02-17
type: reference
status: draft
source: "[Rich Documentation](https://rich.readthedocs.io/en/stable/)"
---
Rich is a Python library for writing **rich text** (with color and style) to the terminal, and for displaying advanced content like tables, markdown, and syntax-highlighted code.

### **Core Purpose & Philosophy**
Rich's goal is to make terminal output beautiful and human-readable. It enables you to format text, build sophisticated user interfaces, and display complex data structures directly in the console.

###  **Installation & Quick Start**
Getting started with Rich is very simple.
```bash
# 1. Install Rich via pip
pip install rich

# 2. Test the installation with its demo command
python -m rich
```

###  **Core Components & API**

Rich is modular. You can use its high-level features or build custom outputs from smaller components.

| Component            | Description                                                          | Common Use Case                                                                 |
| :------------------- | :------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Console API**      | The main entry point for printing styled output.                     | `console = Console(); console.print("Hello", style="bold red")`                 |
| **Console Markup**   | A simple tag-based language to apply styles within strings.          | `console.print("[bold red]Danger![/bold red] Proceed with care.")`              |
| **Text Object**      | For programmatically building styled text with multiple attributes.  | `text = Text("Data"); text.stylize("bold green", 0, 4)`                         |
| **Pretty Printing**  | Automatically formats and syntax-highlights data structures.         | `console.print(local_variables)` or `from rich import pretty; pretty.install()` |
| **Tables**           | Render tabular data with borders, headers, and column styles.        | `table = Table(title="Data"); table.add_column("Name"); table.add_row("Alice")` |
| **Syntax**           | High-quality syntax highlighting for code in many languages.         | `console.print(Syntax(code, "python", theme="monokai"))`                        |
| **Markdown**         | Render Markdown documents directly in the terminal.                  | `console.print(Markdown("# Title\n- List item"))`                               |
| **Panels & Layouts** | Draw boxes and create complex, resizable terminal layouts.           | `panel = Panel("Content", title="Info")`; `layout = Layout().split_row(...)`    |
| **Progress Bars**    | Display progress for long-running tasks, with multiple styles.       | `for step in track(range(100), description="Processing..."): ...`               |
| **Live Display**     | Create dynamic, auto-refreshing displays (e.g., for real-time data). | `with Live(table, refresh_per_second=4): while updating: ...`                   |

###  **Practical Usage Examples for Your Notes**

Here are some of the most common ways you'll use Rich, translating the concepts above into code.

*   **Basic Styled Printing**
    ```python
    from rich.console import Console
    console = Console()

    console.print("Hello", style="bold underline cyan on grey23")
    console.print("[link=https://example.com]Click Here[/link]") # Hyperlinks
    ```

*   **Inspecting Objects**
    ```python
    from rich import inspect
    import rich

    inspect(rich, methods=True) # Show all methods of the rich module
    ```

*   **Creating a Simple Table**
    ```python
    from rich.table import Table
    from rich.console import Console

    table = Table(title="Star Wars Characters")
    table.add_column("Name", style="cyan", no_wrap=True)
    table.add_column("Affiliation", style="magenta")

    table.add_row("Luke Skywalker", "Jedi")
    table.add_row("Darth Vader", "Sith")
    table.add_row("Leia Organa", "Rebellion")

    console = Console()
    console.print(table)
    ```

*   **Logging with Rich Handler**
    Replace standard logging with Rich's beautifully formatted output, including timestamps and file paths.
    ```python
    import logging
    from rich.logging import RichHandler

    logging.basicConfig(level="INFO", handlers=[RichHandler()])
    log = logging.getLogger("rich")
    log.info("This is a rich log message!")
    ```

### ️ **Advanced Features & Integration Notes**

*   **Tracebacks**: Rich can print beautiful, syntax-highlighted tracebacks with more context, making debugging easier. Activate globally with `from rich import traceback; traceback.install()`.
*   **Environment Variables**: Control Rich's behavior (e.g., `TERM` detection, disabling colors) using standard terminal environment variables.
*   **Console Protocol**: For library creators, you can make your own objects renderable by Rich by implementing the `__rich_console__` method.
*   **Integration with Typer**: As you noted in the previous guide, Rich is a core dependency of Typer, used specifically for its automatic, beautifully formatted error messages.

### **Further Learning Path**
The documentation is extensive. To deepen your knowledge, you can explore:
*   The **"Rich in the REPL"** section for using Rich in interactive Python shells.
*   The **"Reference"** section for a complete API overview of all modules.
*   The **"Appendix"** for details on standard colors and box-drawing characters.