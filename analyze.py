import json
import random
import os
import subprocess
import re

with open('db.json','r') as f:
    data = json.load(f)

tags = {
    'b':{'name':'modeling','color':'#643173'},
    'w':{'name':'wall','color':'#86a59c'},
    'm':{'name':'modular','color':'red'},
    's':{'name':'structure','color':'red'},
    's':{'name':'element','color':'red'},
    'a':{'name':'origami analysis','color':'red'},
    'o':{'name':'other origami','color':'red'},
    'n':{'name':'not tagged/not relevant','color':'red'},
    "1":{'name':'priority 1','color':'red'},
    "2":{'name':'priority 2','color':'red'},
    "3":{'name':'Priority 3','color':'red'}
}

def generate_md(article):
    out = ''
    out = f'### ({article.get("id")}) {article.get("title")}\n'
    out += "<div id='tags'>"
    for tag in article.get('tags'):
        name = tags.get(tag).get('name')
        color = tags.get(tag).get('color')
        out += f"<span style='background:{color};padding:0 .5em;border-radius:.2em;margin:0 0.25em;'>{name}</span>"
    out +="</div>\n\n"
    out += f'> {article.get("abstract")}\n\n'
    out += f"- skim notes ({article.get('complete')})\n"
    out += article.get('skim_notes')
    return out

def get_random(data):
    n_art = len(data)
    ind = random.randint(0,n_art)
    return data[ind]

def get_next(data,i):
    return data[i],i+1

def open_notes(article):
    out = generate_md(article)
    with open('notes.md','w') as f:
        f.write(out)
    # subprocess.run(['code','.\\notes.md'],shell=True)

def add_tags(data, i):
    while True:
        article,i=get_next(data,i)
        if article.get('tags'):
            continue
        open_notes(article)
        tags = input('tags?')
        for tag in tags:
            article.get('tags').append(tag)
        parse_notes(article)
        save_notes(data)

def parse_notes(article):
    with open('notes.md','r') as f:
        txt = f.read()
    skim_notes = re.compile('- skim notes (.*)[)]+\n([\\s\\S]*)').search(txt).groups(0)[1]
    article['skim_notes']=skim_notes

def save_notes(data):
    with open('db.json','w') as f:
        json.dump(data,f,indent=4)



    
if __name__=='__main__':
    add_tags(data,0)

# pick random based on tagged/untagged
# pick selected