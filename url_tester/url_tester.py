## THIS SCRIPT IS ALMOST DONE, BUT STILL HAS A PROBLEM
# THE PROBLEM IS THAT THE OUTPUT FILE IS NOT SAVED
# AND THE SCRIPT STALLS AFTER DOING ALL THE SCRAPING

import json
import concurrent.futures
import requests
import socket
from urllib.parse import urlparse

def check_url(url):
    try:
        response = requests.head(url, timeout=1)
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
        urls = json.load(f)

    valid_urls = []
    invalid_urls = []

    with concurrent.futures.ThreadPoolExecutor(max_workers=100) as executor:
        future_to_url = {executor.submit(process_url, url): url for url in urls}
        for future in concurrent.futures.as_completed(future_to_url):
            url, is_valid = future.result()
            if is_valid:
                valid_urls.append(url)
            else:
                invalid_urls.append(url)

    return valid_urls, invalid_urls

if __name__ == "__main__":
    json_file = "urls.json"  # Replace with your JSON file path
    valid, invalid = validate_urls(json_file)
    
    print("Valid URLs:")
    for url in valid:
        print(url)
    
    print("\nInvalid URLs:")
    for url in invalid:
        print(url)

