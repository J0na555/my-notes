## Class: [[front-end]]
## Topic: #website #frontend #html #css
## Date: 12-04-2025
---
## **1. Basic Structure of a Website (HTML)**
Every webpage is divided into **semantic sections** for better readability and SEO. Here’s how they work:

### **`<header>`**
- The **top section** of the webpage.
- Usually contains:
  - Logo / Your name
  - Navigation menu (`<nav>`)
  - A brief introduction (optional)

### **`<nav>` (Navigation Bar)**
- Contains **links** to different pages (Home, About, Portfolio, Contact).
- Usually placed inside `<header>` or as a separate section.

### **`<main>`**
- The **primary content** of the webpage.
- Contains:
  - Your projects (Portfolio)
  - About Me section
  - Blog posts (if any)

### **`<footer>`**
- The **bottom section** of the webpage.
- Usually contains:
  - Copyright info
  - Social media links
  - Contact details

---

## **2. HTML Code Example**
Here’s how you structure these sections in HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- HEADER SECTION -->
    <header>
        <h1>John Doe</h1>
        <nav>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- MAIN CONTENT -->
    <main>
        <section id="home">
            <h2>Welcome to My Portfolio!</h2>
            <p>I am a web developer...</p>
        </section>

        <section id="about">
            <h2>About Me</h2>
            <p>I love coding and design...</p>
        </section>

        <section id="portfolio">
            <h2>My Projects</h2>
            <div class="project">Project 1</div>
            <div class="project">Project 2</div>
        </section>
    </main>

    <!-- FOOTER SECTION -->
    <footer>
        <p>&copy; 2024 John Doe</p>
        <a href="https://github.com/johndoe">GitHub</a>
    </footer>
</body>
</html>
```

---

## **3. Styling with CSS**
Now, let’s style these sections to make them visually distinct.

### **Basic CSS Styling**
```css
/* Reset default margins/padding */
body, h1, h2, p, ul {
    margin: 0;
    padding: 0;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
}

/* HEADER STYLES */
header {
    background: #333;
    color: white;
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav ul {
    list-style: none;
    display: flex;
    gap: 1rem;
}

nav a {
    color: white;
    text-decoration: none;
}

nav a:hover {
    text-decoration: underline;
}

/* MAIN CONTENT STYLES */
main {
    padding: 2rem;
}

section {
    margin-bottom: 2rem;
}

/* FOOTER STYLES */
footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem;
}

footer a {
    color: lightblue;
}
```


## **4. How to Differentiate Each Section?**
| **Section** | **Purpose** | **How to Style Differently** |
|-------------|------------|------------------------------|
| **Header** | Top navigation bar | Dark background, centered logo, nav links |
| **Nav** | Navigation menu | Horizontal list, hover effects |
| **Main** | Primary content | Padding, section spacing, white background |
| **Footer** | Copyright & links | Dark background, centered text |


## **5. Key Takeaways**
✔ **`<header>`** → Top section (logo + navigation).  
✔ **`<nav>`** → Contains links (inside `<header>` or standalone).  
✔ **`<main>`** → Main content (projects, about, blog).  
✔ **`<footer>`** → Bottom section (copyright, social links).  

✔ **Use `<section>`** inside `<main>` to organize content.  
✔ **Style each part differently** (colors, spacing, fonts).  



---

## **📌 HTML Keywords (Tags & Attributes)**
### **1. Structural Tags**
| Keyword | Use | Example |
|---------|-----|---------|
| `<!DOCTYPE html>` | Defines HTML5 document | `<!DOCTYPE html>` |
| `<html>` | Root element | `<html lang="en">` |
| `<head>` | Metadata (title, styles, scripts) | `<head><title>My Site</title></head>` |
| `<body>` | Visible content | `<body><h1>Hello</h1></body>` |
| `<header>` | Top section (logo, nav) | `<header><nav>...</nav></header>` |
| `<nav>` | Navigation links | `<nav><a href="#">Home</a></nav>` |
| `<main>` | Primary content | `<main><section>...</section></main>` |
| `<section>` | Content grouping | `<section id="about">...</section>` |
| `<article>` | Independent content (blog post) | `<article><h2>Post</h2></article>` |
| `<footer>` | Bottom section | `<footer>© 2024</footer>` |

### **2. Text & Media Tags**
| Keyword | Use | Example |
|---------|-----|---------|
| `<h1>`-`<h6>` | Headings | `<h1>Title</h1>` |
| `<p>` | Paragraph | `<p>Some text.</p>` |
| `<a>` | Hyperlink | `<a href="https://example.com">Link</a>` |
| `<img>` | Image | `<img src="pic.jpg" alt="Photo">` |
| `<ul>`, `<ol>`, `<li>` | Lists | `<ul><li>Item</li></ul>` |
| `<div>` | Container (no semantic meaning) | `<div class="box">...</div>` |
| `<span>` | Inline container | `<span class="highlight">Text</span>` |

### **3. Form Tags**
| Keyword | Use | Example |
|---------|-----|---------|
| `<form>` | Form container | `<form action="/submit" method="POST">` |
| `<input>` | Input field | `<input type="text" placeholder="Name">` |
| `<button>` | Clickable button | `<button type="submit">Send</button>` |
| `<textarea>` | Multi-line text | `<textarea rows="4"></textarea>` |
| `<select>`, `<option>` | Dropdown | `<select><option>Choice</option></select>` |

---

## **🎨 CSS Keywords (Properties & Values)**
### **1. Layout & Positioning**
| Keyword | Use | Variations/Values | Example |
|---------|-----|-------------------|---------|
| `display` | How an element is displayed | `block`, `inline`, `flex`, `grid`, `none` | `display: flex;` |
| `position` | Element positioning | `static`, `relative`, `absolute`, `fixed`, `sticky` | `position: fixed;` |
| `margin` | Outer spacing | `margin: 10px;` (top, right, bottom, left) | `margin: 0 auto;` |
| `padding` | Inner spacing | `padding: 20px;` | `padding: 10px 5px;` |
| `width`, `height` | Size | `px`, `%`, `vw`, `vh` | `width: 100%;` |
| `flexbox` | Flexible layout | `display: flex;`, `justify-content`, `align-items` | `justify-content: center;` |
| `grid` | Grid layout | `display: grid;`, `grid-template-columns` | `grid-template-columns: 1fr 1fr;` |

### **2. Typography**
| Keyword | Use | Variations/Values | Example |
|---------|-----|-------------------|---------|
| `font-family` | Text font | `Arial`, `Helvetica`, `sans-serif` | `font-family: 'Arial';` |
| `font-size` | Text size | `px`, `em`, `rem`, `%` | `font-size: 16px;` |
| `color` | Text color | Hex (`#FF5733`), RGB, named (`red`) | `color: #333;` |
| `text-align` | Horizontal alignment | `left`, `center`, `right`, `justify` | `text-align: center;` |
| `line-height` | Line spacing | Unitless (1.5), `px`, `em` | `line-height: 1.6;` |

### **3. Colors & Backgrounds**
| Keyword | Use | Variations/Values | Example |
|---------|-----|-------------------|---------|
| `background-color` | Background color | Hex, RGB, named | `background-color: #f4f4f4;` |
| `background-image` | Background image | `url('image.jpg')` | `background-image: url('bg.jpg');` |
| `border` | Element border | `1px solid #000` | `border: 2px dashed red;` |
| `border-radius` | Rounded corners | `px`, `%` | `border-radius: 10px;` |
| `box-shadow` | Shadow effect | `x-offset y-offset blur color` | `box-shadow: 2px 2px 5px grey;` |

### **4. Animations & Effects**
| Keyword | Use | Variations/Values | Example |
|---------|-----|-------------------|---------|
| `transition` | Smooth property changes | `property duration timing-function` | `transition: all 0.3s ease;` |
| `transform` | 2D/3D transformations | `rotate()`, `scale()`, `translate()` | `transform: rotate(45deg);` |
| `animation` | Keyframe animations | `@keyframes`, `animation-name`, `duration` | `animation: fade 2s infinite;` |

### **5. Responsive Design**
| Keyword | Use | Variations/Values | Example |
|---------|-----|-------------------|---------|
| `@media` | Media queries (breakpoints) | `max-width`, `min-width` | `@media (max-width: 600px) { ... }` |
| `vw`, `vh` | Viewport units | `1vw = 1% of viewport width` | `width: 50vw;` |
| `rem`, `em` | Relative font sizes | `1rem = root font size` | `font-size: 1.2rem;` |


## **🔑 Key Takeaways**
### **HTML**
- **Structure:** `<header>`, `<main>`, `<footer>`, `<section>`, `<div>`
- **Text:** `<h1>`, `<p>`, `<a>`, `<span>`
- **Media:** `<img>`, `<video>`, `<audio>`
- **Forms:** `<form>`, `<input>`, `<button>`

### **CSS**
- **Layout:** `display`, `position`, `flexbox`, `grid`
- **Typography:** `font-family`, `color`, `text-align`
- **Styling:** `background`, `border`, `box-shadow`
- **Responsive:** `@media`, `vw`, `rem`

---

# **🚀 Advanced HTML & CSS Cheat Sheet**  
*(Includes Animations, Transforms, and More!)*  


## **🔷 HTML Refresher**  
### **📌 Semantic Structure**  
| Tag               | Use                                | Example |
|-------------------|------------------------------------|---------|
| `<article>`       | Independent content (blog post)    | `<article><h2>Post</h2></article>` |
| `<aside>`         | Sidebar/content                    | `<aside>Related links</aside>` |
| `<figure>` + `<figcaption>` | Image with caption       | `<figure><img src="pic.jpg"><figcaption>Photo</figcaption></figure>` |
| `<time>`          | Machine-readable date/time         | `<time datetime="2024-01-01">Jan 1</time>` |

---

## **🎨 Advanced CSS**  

### **🔥 CSS Transforms**  
*Manipulate elements in 2D/3D space.*  

| Property          | Use                          | Values/Example |
|-------------------|------------------------------|----------------|
| `transform`       | Applies transformations      | `transform: rotate(45deg);` |
| `translate()`     | Moves element (X,Y)          | `transform: translate(50px, 20px);` |
| `scale()`         | Resizes element              | `transform: scale(1.2);` (120%) |
| `rotate()`        | Rotates element              | `transform: rotate(90deg);` |
| `skew()`          | Tilts element                | `transform: skew(20deg);` |
| `transform-origin` | Changes pivot point        | `transform-origin: top left;` |

**Example:**  
```css
.box {
  transform: rotate(30deg) scale(1.1);
  transform-origin: center;
}
```

---

### **✨ CSS Animations**  
*Create smooth animations without JavaScript.*  

#### **1. `@keyframes`**  
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

#### **2. `animation` Properties**  
| Property          | Use                          | Example |
|-------------------|------------------------------|---------|
| `animation-name`  | Links to `@keyframes`         | `animation-name: fadeIn;` |
| `animation-duration` | How long it runs          | `animation-duration: 2s;` |
| `animation-delay` | Delay before starting        | `animation-delay: 1s;` |
| `animation-iteration-count` | Repeat times       | `animation-iteration-count: infinite;` |
| `animation-timing-function` | Speed curve      | `animation-timing-function: ease-in-out;` |

**Example:**  
```css
.element {
  animation: fadeIn 2s ease-in-out infinite alternate;
}
```

---

### **🌀 CSS Transitions**  
*Smoothly animate property changes (e.g., hover effects).*  

| Property          | Use                          | Example |
|-------------------|------------------------------|---------|
| `transition`      | Shorthand for all transitions | `transition: all 0.3s ease;` |
| `transition-property` | Which properties to animate | `transition-property: opacity;` |
| `transition-duration` | How long it takes        | `transition-duration: 0.5s;` |
| `transition-timing-function` | Speed curve      | `transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);` |

**Example:**  
```css
.button {
  background: blue;
  transition: background 0.3s ease;
}
.button:hover {
  background: red;
}
```

---

### **💡 Advanced Selectors**  
| Selector          | Use                          | Example |
|-------------------|------------------------------|---------|
| `:nth-child(n)`   | Selects nth child            | `li:nth-child(2) { color: red; }` |
| `:hover`          | Mouse-over effect            | `a:hover { color: gold; }` |
| `::before`/`::after` | Adds pseudo-elements      | `.box::before { content: "★"; }` |
| `[attribute]`     | Targets HTML attributes      | `input[type="text"] { border: 1px solid; }` |

---

### **📱 Responsive Design (Advanced)**  
#### **1. Flexbox Deep Dive**  
| Property          | Use                          | Example |
|-------------------|------------------------------|---------|
| `flex-direction`  | Row/column layout            | `flex-direction: column;` |
| `flex-wrap`       | Allows wrapping              | `flex-wrap: wrap;` |
| `justify-content` | Horizontal alignment         | `justify-content: space-between;` |
| `align-items`     | Vertical alignment           | `align-items: center;` |

#### **2. CSS Grid Advanced**  
| Property          | Use                          | Example |
|-------------------|------------------------------|---------|
| `grid-template-areas` | Named grid areas         | `grid-template-areas: "header header" "sidebar main";` |
| `grid-gap`        | Spacing between cells        | `grid-gap: 20px;` |
| `grid-auto-flow`  | Auto-placement direction     | `grid-auto-flow: dense;` |

**Example:**  
```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
}
```

---

## **🎯 Pro Tips for Performance**  
✔ **Use `will-change` for smooth animations:**  
```css
.element {
  will-change: transform;
}
```
✔ **Optimize animations with `transform` and `opacity` (GPU-accelerated).**  
✔ **Avoid `@keyframes` on large/complex elements.**  


### **🚀 What’s Next?**  
- **Try SVG animations** with `<animate>`.  
- **Explore 3D transforms** (`rotateX()`, `perspective`).  
- **Learn CSS custom properties (variables):**  
  ```css
  :root {
    --main-color: #3498db;
  }
  .box {
    background: var(--main-color);
  }
  ```


