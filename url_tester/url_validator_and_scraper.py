import json
import concurrent.futures
import requests
import socket
from urllib.parse import urlparse
from scrapy import Spider, Request, signals
from scrapy.crawler import CrawlerRunner
from scrapy.utils.project import get_project_settings
from scrapy.utils.log import configure_logging
from bs4 import BeautifulSoup
from twisted.internet import reactor, defer
from twisted.internet.defer import inlineCallbacks, returnValue

def check_url(url):
    try:
        response = requests.head(url, timeout=5)
        return url, True
    except requests.RequestException:
        return url, False

def dns_lookup(domain):
    try:
        socket.gethostbyname(domain)
        return True
    except socket.gaierror:
        return False

def process_url(url):
    domain = urlparse(url).netloc
    dns_result = dns_lookup(domain)
    if dns_result:
        url_result, is_valid = check_url(url)
        return url_result, is_valid
    return url, False

def validate_urls(json_file):
    with open(json_file, 'r') as f:
        data = json.load(f)

    if isinstance(data, list) and all(isinstance(item, str) for item in data):
        urls = data
    elif isinstance(data, list) and all(isinstance(item, dict) for item in data):
        urls = [item.get('url') for item in data if 'url' in item]
    else:
        print("Error: The JSON file should contain either a list of URLs or a list of dictionaries with 'url' keys.")
        return [], []

    valid_urls = []
    invalid_urls = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        future_to_url = {executor.submit(process_url, url): url for url in urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url, is_valid = future.result()
            if is_valid:
                valid_urls.append(url)
            else:
                invalid_urls.append(url)

    return valid_urls, invalid_urls

class SummaryScraper(Spider):
    name = 'summary_scraper'
    
    def __init__(self, urls=None, *args, **kwargs):
        super(SummaryScraper, self).__init__(*args, **kwargs)
        self.start_urls = urls or []
        self.results = {}
        self.logger.info(f"Starting SummaryScraper with URLs: {self.start_urls}")

    def start_requests(self):
        for url in self.start_urls:
            self.logger.info(f"Scraping URL: {url}")
            yield Request(url, self.parse, meta={'url': url})

    def parse(self, response):
        url = response.meta['url']
        soup = BeautifulSoup(response.text, 'html.parser')
        
        title = soup.title.string if soup.title else "No title found"
        
        summary = ''
        paragraphs = soup.find_all('p')
        if paragraphs:
            summary = paragraphs[0].get_text().strip()
        if not summary:
            summary = ' '.join(soup.stripped_strings)
        
        summary = summary[:150] + '...' if len(summary) > 150 else summary
        
        self.results[url] = {"title": title, "summary": summary}
        self.logger.info(f"Scraped {url}: Title - {title}, Summary - {summary}")

    @classmethod
    def from_crawler(cls, crawler, *args, **kwargs):
        spider = super(SummaryScraper, cls).from_crawler(crawler, *args, **kwargs)
        crawler.signals.connect(spider.spider_closed, signal=signals.spider_closed)
        return spider

    def spider_closed(self, spider):
        self.crawler.stats.set_value('results', self.results)

@inlineCallbacks
def crawl(runner, urls):
    spider_cls = SummaryScraper
    yield runner.crawl(spider_cls, urls=urls)
    results = runner.stats.get_value('results')
    returnValue(results)

@inlineCallbacks
def scrape_summaries(urls):
    configure_logging()
    runner = CrawlerRunner(get_project_settings())

    try:
        results = yield crawl(runner, urls)
        returnValue(results)
    finally:
        reactor.stop()

def save_results(scraped_data):
    # Create a list of dictionaries with all URLs and their data
    updated_data = []

    # Add valid URLs with their scraped data
    for url in valid:
        if url in scraped_data:
            updated_data.append({
                "url": url,
                "title": scraped_data[url]['title'],
                "summary": scraped_data[url]['summary']
            })
        else:
            updated_data.append({
                "url": url,
                "title": "Could not be scraped",
                "summary": "URL was valid but could not be scraped."
            })

    # Add invalid URLs with a note
    for url in invalid:
        updated_data.append({
            "url": url,
            "title": "Invalid URL",
            "summary": "URL could not be scraped or was invalid."
        })

    # Save the updated data
    try:
        with open('updated_data.json', 'w') as f:
            json.dump(updated_data, f, indent=2)
        print("\nUpdated data has been saved to 'updated_data.json'")
    except Exception as e:
        print(f"Failed to save data to 'updated_data.json': {e}")

if __name__ == "__main__":
    json_file = "urls.json"  # Replace with your JSON file path
    valid, invalid = validate_urls(json_file)
    
    if not valid and not invalid:
        print("No URLs found. Exiting.")
        exit()

    print("Valid URLs:")
    for url in valid:
        print(url)
    
    print("\nInvalid URLs:")
    for url in invalid:
        print(url)

    if not valid:
        print("No valid URLs to scrape. Exiting.")
        exit()

    print("\nScraping summaries for valid URLs...")
    
    d = scrape_summaries(valid)
    d.addCallback(save_results)
    reactor.run()
