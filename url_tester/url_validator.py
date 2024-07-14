import json
import asyncio
import aiohttp
from urllib.parse import urlparse
import socket
from bs4 import BeautifulSoup

import json
import asyncio
import aiohttp
from urllib.parse import urlparse
import socket
from bs4 import BeautifulSoup
import os
import glob



async def dns_lookup(domain):
    try:
        await asyncio.get_event_loop().run_in_executor(None, socket.gethostbyname, domain)
        return True
    except socket.gaierror:
        return False

async def check_url(session, url):
    try:
        async with session.get(url, timeout=10) as response:
            if response.status == 200:
                content = await response.text()
                soup = BeautifulSoup(content, 'html.parser')
                title = soup.title.string if soup.title else "No title found"
                return url, True, response.status, title
            else:
                return url, False, response.status, f"HTTP {response.status}"
    except asyncio.TimeoutError:
        return url, False, None, "Timeout"
    except Exception as e:
        return url, False, None, str(e)

async def process_urls(urls):
    async with aiohttp.ClientSession() as session:
        tasks = []
        for url in urls:
            domain = urlparse(url).netloc
            dns_result = await dns_lookup(domain)
            if not dns_result:
                tasks.append(asyncio.create_task(asyncio.sleep(0, result=(url, False, None, "DNS resolution failed"))))
            else:
                tasks.append(asyncio.create_task(check_url(session, url)))
        
        results = await asyncio.gather(*tasks)
        return results

def load_data(file_path):
    data = []
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data.append(json.loads(line))
            except json.JSONDecodeError:
                print(f"Error parsing JSON in line: {line}")
    return data

async def process_file(input_file):
    output_file = f"validated_{os.path.basename(input_file)}"
    
    data = load_data(input_file)
    urls = [item['url'] for item in data]

    results = await process_urls(urls)

    for item, result in zip(data, results):
        url, success, status, message = result
        item['url_valid'] = success
        item['url_status'] = status
        item['url_message'] = message
        if success:
            item['page_title'] = message
        else:
            item['page_title'] = None

    with open(output_file, 'w', encoding='utf-8') as f:
        for item in data:
            json.dump(item, f)
            f.write('\n')

    print(f"Validation complete for {input_file}. Results saved to {output_file}")

def get_jsonl_files(directory):
    return glob.glob(os.path.join(directory, '*.jsonl'))

async def main():
    samples_dir = './samples'
    jsonl_files = get_jsonl_files(samples_dir)

    if not jsonl_files:
        print(f"No .jsonl files found in {samples_dir}")
        return

    tasks = [process_file(file) for file in jsonl_files]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())
