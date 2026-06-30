---
title: Jupyter notebook crashcourse
tags:
  - jupyter
date: 2026-03-13
type: crash outse
status: draft
source: chatgpt
---
# 1. What Jupyter Notebook Actually Is

Think of it as an **interactive coding document**.
A notebook contains **cells** that can include:
- **Code** (Python usually)
- **Markdown** (formatted text for explanations)
- **Outputs** (prints, charts, tables, etc.)

Typical workflow:

```
Write code → run cell → see result immediately
```

That’s why it's great for:

- AI / ML experiments
- Algorithm demonstrations
- Data analysis
- Teaching / documentation
    

---

# 2. Installing Jupyter

### If you use Python with venv

```bash
pip install notebook
```

Run it:

```bash
jupyter notebook
```

Then your browser opens.

---

### Better modern version (recommended)

```bash
pip install jupyterlab
```

Run:

```bash
jupyter lab
```

**JupyterLab is basically the upgraded UI.**

---

# 3. Creating a Notebook

Create a new notebook:

```
New → Python 3
```

It creates a file:

```
example.ipynb
```

This is just a **JSON file storing code + outputs**.

---

# 4. Cells (Most Important Concept)

There are **two main types**.

### Code Cell

Runs Python code.

Example:

```python
x = 5
y = 10
x + y
```

Output:

```
15
```

---

### Markdown Cell

For notes and documentation.

Example:

```
# Title
## Subtitle
**bold**
*italic*

- list item
- list item
```

---

# 5. Essential Shortcuts

These make you fast.

Run cell:

```
Shift + Enter
```

Run and create new cell:

```
Alt + Enter
```

Command mode:

```
Esc
```

Edit mode:

```
Enter
```

Create cells:

```
A → new cell above
B → new cell below
```

Delete cell:

```
DD
```

Change cell type:

```
M → markdown
Y → code
```

---

# 6. Running Cells

Cells run **independently**.

Example:

Cell 1:

```python
x = 10
```

Cell 2:

```python
print(x)
```

Output:

```
10
```

But if you restart kernel and run cell 2 first → **error**.

This is the **biggest beginner mistake**.

---

# 7. Kernel (Important Concept)

Kernel = the **Python runtime** executing code.

Controls:

```
Restart Kernel
Restart & Run All
Interrupt
```

Use restart when:

- variables get messy
    
- notebook acts weird
    

---

# 8. Displaying Plots

Jupyter shines with visualizations.

Example:

```python
import matplotlib.pyplot as plt

x = [1,2,3,4]
y = [1,4,9,16]

plt.plot(x,y)
plt.show()
```

Plot appears **inside notebook**.

---

# 9. Nice Features

### Show last value automatically

```python
2 + 2
```

Output:

```
4
```

No `print()` needed.

---

### Rich outputs

Tables:

```python
import pandas as pd

df = pd.DataFrame({
    "name": ["Jonas", "Alex"],
    "score": [90, 85]
})

df
```

Shows a **nice formatted table**.

---

# 10. Typical Folder Structure


```

notebooks/
    bfs_demo.ipynb
    dfs_demo.ipynb
    astar_visualization.ipynb

src/
    bfs.py
    dfs.py
    astar.py
```

Use notebooks for:

- explanations
    
- experiments
    
- visualization
    

---

# 11. Exporting Notebooks

You can export as:

```
File → Export As
```

Options:

- HTML
    
- PDF
    
- Python script
    

Example:

```
bfs.ipynb → bfs.py
```

---

# 12. Magic Commands (Super Useful)

Special commands starting with `%`.

Example:

### measure runtime

```python
%timeit sum(range(1000))
```

### run external script

```python
%run script.py
```

### list variables

```python
%who
```

---