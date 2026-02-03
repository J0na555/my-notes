## Course: [[website basics|web]]

## Subject: #web #webScraping #data

## Date: 10-05-2025

## Topic: #data

---

# 📘 Web Scraping – A Comprehensive Note

## 🌐 What is Web Scraping?

Web scraping, also known as web harvesting or web data extraction, is the process of automatically collecting data from websites. It involves fetching web pages and extracting useful information from them, often to store or process it for further use.

Instead of copying and pasting data manually, web scraping uses software (scripts, bots, or [[Web crawlers|libraries]]) to perform the task efficiently and at scale.

---

## ✅ Why Use Web Scraping?

Web scraping is widely used for:

- **Data collection**: For research, business intelligence, or trend analysis.

- **Price monitoring**: Track prices from competitors or marketplaces (e.g., Amazon, Jumia).

- **News aggregation**: Pull headlines and articles from multiple sources.

- **SEO & content analysis**: Analyze competitor keywords or structure.

- **Job listings or real estate**: Aggregate listings across platforms.

- **Market research**: Gather reviews, customer opinions, or survey data.

- **Academic projects**: For building datasets or analysis.

---

## 🛠️ How Does Web Scraping Work?

The typical web scraping process involves:

1. **Sending a request** to a webpage using a script or tool (usually via HTTP GET).

2. **Receiving the HTML response** (raw HTML, often with JavaScript).

3. **Parsing the HTML** to extract required data.

4. **Storing or displaying** the extracted data (in CSV, JSON, database, etc.).

---

## 💡 Example Flow

```plaintext
Step 1: Send request → https://example.com/products

Step 2: Get HTML → "<html><body><h2>Product A</h2>...</body></html>"

Step 3: Parse HTML → Extract product name, price, etc.

Step 4: Save to CSV → name, price
```

---

## 🧰 Tools and Libraries for Web Scraping

### 🐍 Python Libraries

- **Requests** – To fetch HTML content from web pages.

- **BeautifulSoup** – To parse and navigate the HTML.

- **lxml** – Faster parser, used with BeautifulSoup or standalone.

- **Selenium** – For dynamic pages that use JavaScript (automates browsers).

- **Scrapy** – A full-featured scraping framework.

### 🕸️ JavaScript-Based Tools

- **Puppeteer** – Headless browser for scraping JavaScript-heavy pages.

- **Cheerio** – jQuery-like HTML parsing for Node.js.

- **Playwright** – Browser automation tool, supports multiple engines.

---

## ⚖️ Legal and Ethical Considerations

Web scraping can raise legal and ethical issues. Always consider the following:

- **Terms of Service**: Many websites explicitly forbid scraping.

- **Rate Limiting**: Don’t overload the server; respect `robots.txt`.

- **Copyright and data rights**: Some data may be protected.

- **Authentication**: Scraping behind login walls can be risky.

- **Permission**: It’s best practice to ask permission when possible.

> 🧠 Pro tip: Always check the site's `robots.txt` file (e.g., [https://example.com/robots.txt](https://example.com/robots.txt)) to see what is allowed to be scraped.

---

## 🧑‍💻 Real-World Use Cases

|Use Case|Description|
|---|---|
|📈 Finance|Scraping stock market prices, crypto trends.|
|🏠 Real Estate|Aggregating listings across multiple housing platforms.|
|🛍️ E-commerce|Price comparison and product trend analysis.|
|📚 Academia|Creating datasets for NLP or data mining.|
|📅 Events|Gathering event data from public calendars.|

---

## ✨ Advanced Topics

- **Captcha Bypass**: Sites may block bots; use services like 2Captcha or smarter bots.

- **Headless Browsers**: Tools like Puppeteer or Selenium automate full browsers.

- **Proxy Rotation**: Avoid IP bans by rotating proxies (free or paid).

- **Data Cleaning**: Post-processing the extracted data is often necessary.

---

## 🧪 Sample Python Example Using BeautifulSoup

```python
import requests
from bs4 import BeautifulSoup

url = "https://example.com/products"
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')
products = soup.find_all('h2', class_='product-title')

for product in products:
    print(product.text.strip())
```

---

## 🧭 Best Practices

- Be polite: Add headers like `User-Agent` to identify yourself.

- Use delays: Sleep between requests to avoid being flagged.

- Avoid duplicate scraping: Cache data if possible.

- Use APIs when available: They’re faster and more reliable than scraping.

---

## 🧠 Summary

Web scraping is a powerful skill in modern data-driven environments. Whether you're building your own datasets, automating repetitive research tasks, or powering an app that needs external data, scraping is a practical tool.

However, with great power comes great responsibility. Make sure to follow ethical and legal guidelines, respect site limits, and avoid misuse.
