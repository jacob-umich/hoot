import re
import json

with open('secondary_1000.txt','r',encoding='utf8') as f:
    txt = f.read()

exp = re.compile('<RECORD [0-9]+>')
entries = exp.split(txt)[1:]

out = ''
titles = []
data = []
i=0
for entry in entries:

    exp = re.compile('Title:(.*)\n')
    title = exp.search(entry).groups(0)[0]
    unique = not(title in titles)
    if unique:
        titles.append(title)
        # res = scholarly.scholarly.search_single_pub(title)
        # res_bib = scholarly.scholarly.bibtex(res)
        try:
            article = {
                # 'id': re.compile('q=info:(.*):').search(res['url_scholarbib']).groups(0)[0],
                'id':i,
                'title':title,
                # 'bib':res_bib,
                'abstract':re.compile('Abstract:(.*)\n').search(entry).groups(0)[0],
                'tags':[],
                'skim_notes':'',

            }
        except:
            article = {
                # 'id': re.compile('q=info:(.*):').search(res['url_scholarbib']).groups(0)[0],
                'id':i,
                'title':title,
                # 'bib':res_bib,
                'abstract':'none',
                'tags':[],
                'skim_notes':'',

            }

        data.append(article)
    else:
        print(title)
    if ('Research on' in title) and ('BIM' in title):
        print(title)
    print(i)
    i+=1
print(len(data))
with open('db.json','w',) as f:
    json.dump(data,f,indent=4)

tags = {
    'e':'economics/logistics/feasibility',
    'b':'bim/digitization',
    't':'modular tech',
    'd':'design framework',
    's':'structural analyses',
    'm':'meta/other modular',
    1:'priority 1',
    2:'priority 2',
    3:'priority 3',
}

# economics/logistics/feasibility
# bim/digitization
# construction details
# modular tech
# design frameworks
# structural analyses

# add progress number
# add database with tags and priority and abstract