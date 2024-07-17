# Reads dummy.json
# Writes qce_summary.json with sorted/organized urls

import json
from collections import defaultdict

# Read the input file
with open('src/components/dummy.json', 'r') as f:
    data = json.load(f)

# g) Create a file with question + category + expert, followed by all URLs
qce_summary = defaultdict(lambda: {'urls': []})

for item in data:
    key = (item['question'], item['category'], item['expert'])
    qce_summary[key]['urls'].append(item['url'])

qce_flat = [
    {
        'question': q,
        'category': c,
        'expert': e,
        'urls': urls['urls']
    }
    for (q, c, e), urls in qce_summary.items()
]

with open('qce_summary.json', 'w') as f:
    json.dump(qce_flat, f, indent=2)
