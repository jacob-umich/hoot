import json
from analyze import generate_md,tags
import sys

filename = sys.argv[1]
if len(sys.argv)>2:

    tags_in = sys.argv[2]
else:
    tags_in =None

out = ''
with open('db.json','r') as f:
    data = json.load(f)

if tags_in==None:
    tags_in = 'ebtdsm123n'

for tag in tags_in:
    if tag == 'n':
        out += f"# No Tags\n\n"
    else:
        out += f"# {tags[tag]['name']}\n\n"
    count = 0
    for article in data:
        if tag in article['tags'] or (tag=='n' and not(article['tags'])):
            out+=generate_md(article)
            out+='\n\n'
            count+=1
    print(f'{count} articles found for [{tags[tag]["name"]}] tag')

with open(filename,'w') as f:
    f.write(out)