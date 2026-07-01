## Class: [[Website Basics|web]]

## Topic: #web #webcrawler #searchengines #python

## Date: 16-05-2025

---

- web crawler is a program that collects content from the web
- it can also be a bot that systematically browses the internet for indexing websites (see [[Web Scraping]]).

## types of web crawlers

1. focused web crawlers:
2. incremental web crawlers:
3. parallel crawlers:
4. distributed crawlers:

## functional requirements

1. priority crawling / seed urls
2. crawl html only
3. preserve crawled pages
4. preserve duplicates
5. freshness of the pages

Web crawlers, also known as spiders or spiderbots, are automated software programs designed to systematically browse the World Wide Web to discover, download, and index web pages. They are primarily operated by search engines like Google, Bing, and Yahoo to build and update their indexes, enabling faster and more relevant search results for users[1](https://www.akamai.com/glossary/what-is-a-web-crawler)[2](https://www.cloudflare.com/learning/bots/what-is-a-web-crawler/)[4](https://en.wikipedia.org/wiki/Web_crawler).

## How Web Crawlers Work

The crawling process generally involves three main steps:

1. **Discover URLs to Crawl**: Crawlers start with a list of seed URLs, which can come from sitemaps, links from other sites, manually compiled lists, or previous crawl data. These URLs are placed in a queue called the crawl frontier[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

2. **Crawl Each URL**: The crawler takes a URL from the queue, downloads the web page, and processes its content. This processing includes extracting text, keywords, images, and hyperlinks. The crawler then parses the page to find outbound links, adding any new URLs to the queue for future crawling[1](https://www.akamai.com/glossary/what-is-a-web-crawler)[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

3. **Repeat**: This cycle continues recursively, allowing the crawler to autonomously map the interconnected web of sites and pages[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

During crawling, the crawler also analyzes metadata like title tags and descriptions to understand page content, and may evaluate factors such as page load speed, mobile-friendliness, and security protocols, which influence search engine rankings[7](https://www.ask.com/news/understanding-webcrawlers-work-matter-website).

## Architecture of Web Crawlers

A typical web crawler system includes several core components:

- **Controller**: Manages the overall crawling process, including startup, shutdown, and monitoring.

- **Scheduler**: Selects URLs from the crawl frontier and feeds them to the downloader.

- **Downloader**: Fetches the content of web pages.

- **Extractor**: Parses downloaded pages to extract information and discover new URLs.

- **Datastore**: Stores crawled data, link graphs, and extracted information.

- **Frontier**: Maintains the list of URLs yet to be crawled[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

Large-scale crawlers often operate in a distributed manner across multiple servers to handle the vast scale of the web[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

## Types of Web Crawlers

Web crawlers can be categorized based on their purpose and architecture:

- **Generic Crawlers**: Broadly crawl the web to gather URLs and content for general search engines.
- **Focused Crawlers**: Target specific topics or domains, used in vertical search engines.
- **Incremental Crawlers**: Periodically revisit sites to detect new or updated content, useful for news aggregators and price trackers.
- **Deep Web Crawlers**: Index dynamic content from databases and APIs[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

Architecturally, crawlers may be centralized, distributed, or peer-to-peer, with distributed crawlers being most common for large-scale indexing[5](https://www.33rdsquare.com/what-is-a-web-crawler/).

## Additional Considerations

- **Politeness and Load Management**: Crawlers must manage their request rate to avoid overloading websites. They respect directives in files like `robots.txt` that specify which parts of a site may or may not be crawled[4](https://en.wikipedia.org/wiki/Web_crawler).

- **Resource Consumption**: Crawlers consume bandwidth and server resources, so their design includes scheduling and prioritization to balance thoroughness with efficiency[4](https://en.wikipedia.org/wiki/Web_crawler).

- **Content Validation**: Besides indexing, crawlers can validate hyperlinks and HTML code, and can be used for web scraping and data-driven applications[4](https://en.wikipedia.org/wiki/Web_crawler).

- **Importance Assessment**: Crawlers may judge the importance of pages based on factors like link popularity and traffic to prioritize crawling and indexing[8](https://www.webhostingsecretrevealed.net/blog/security/web-crawlers-explained/).

In summary, web crawlers are essential automated agents that systematically explore the internet to collect and organize web content, enabling search engines and other services to provide timely and relevant information to users. Their complex architecture and algorithms ensure efficient, scalable, and respectful crawling of the vast and ever-changing web
