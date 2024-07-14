import asyncio
import aiohttp
import json
from urllib.parse import urlparse
import urllib3
import ssl
import socket
import os

# Disable InsecureRequestWarning
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

async def dns_lookup(domain):
    try:
        await asyncio.get_event_loop().run_in_executor(None, socket.gethostbyname, domain)
        return True
    except socket.gaierror:
        return False

async def check_url(session, url, retries=2):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Accept-Encoding': 'gzip, deflate, br'
    }

    if is_blacklisted(url):
        return f"{url}, Blacklisted domain"

    # Preprocess Amazon URLs
    original_url = url
    url = preprocess_amazon_url(url)

    domain = urlparse(url).netloc
    dns_result = await dns_lookup(domain)
    if not dns_result:
        return f"{original_url}, DNS resolution failed"

    for attempt in range(retries + 1):
        try:
            async with session.get(url, allow_redirects=True, timeout=30, headers=headers) as response:
                if 200 <= response.status < 300:
                    return None
                elif response.status in [403, 404]:
                    content_type = response.headers.get('Content-Type', '').lower()
                    if 'application/pdf' in content_type:
                        return None
                    text = await response.text()
                    if len(text) > 500 or "access denied" in text.lower():
                        return None
                    else:
                        return f"{original_url}, HTTP status {response.status} (Confirmed)"
                elif response.status in [429, 503, 504, 400]:
                    return None  # Treat as temporarily unavailable (valid)
                else:
                    return f"{original_url}, HTTP status {response.status}"
        except aiohttp.ClientError:
            return None  # Treat client errors as temporarily unavailable (valid)
        except asyncio.TimeoutError:
            if attempt == retries:
                return f"{original_url}, Timeout"
        except ssl.SSLError:
            return f"{original_url}, SSL certificate error"
        except Exception as e:
            if attempt == retries:
                return f"{original_url}, Unexpected error: {str(e)}"
    return f"{original_url}, Failed after {retries} retries"

async def process_urls(urls, concurrency=50):
    connector = aiohttp.TCPConnector(ssl=False, limit=concurrency)
    async with aiohttp.ClientSession(connector=connector) as session:
        tasks = [check_url(session, url) for url in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)

def load_urls(file_path):
    urls = []
    with open(file_path, 'r') as f:
        for line in f:
            try:
                data = json.loads(line)
                url = data.get('url')
                if url and urlparse(url).scheme:
                    urls.append(url)
            except json.JSONDecodeError:
                pass
    return urls

def is_blacklisted(url):
    blacklist = [
        'linkedin.com',
        'wsj.com',
        'quantum-computing.net',
        'quantum-magazine.org',
        'navdanya.org',
        'urbanlandinstitute.org',
        'thesustainabilityagenda.org', 
        'podbean.com',
    ]
    return any(domain in url for domain in blacklist)

def preprocess_amazon_url(url):
    if 'amazon.com' in url:
        parts = url.split('/')
        if len(parts) > 5:
            return '/'.join(parts[:5])  # Keep only up to the book title
        elif '\\' in url:
            return url.split('\\')[0]  # Handle backslash case
    return url

async def process_file(file_path):
    urls = load_urls(file_path)
    
    print(f"Checking {len(urls)} URLs from {file_path}...")
    results = await process_urls(urls)
    
    invalid_urls = [result for result in results if result is not None]
    
    print(f"\nResults for {file_path}:")
    print("Invalid URLs:")
    for url in invalid_urls:
        print(url)
    
    print(f"Total number of invalid URLs: {len(invalid_urls)}")
    print(f"Total number of valid URLs: {len(urls) - len(invalid_urls)}")
    print("----------------------------------------")

async def main():
    file_path = "climate_change.jsonl"
    await process_file(file_path)

if __name__ == "__main__":
    asyncio.run(main())