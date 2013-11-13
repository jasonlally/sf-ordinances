import re, json, sys, codecs

data = codecs.open('OrdTable.txt','r',encoding='utf-8').readlines()

json_final = []
index = 0

for line in data:
	found = True
	while found:
		ordno_search = re.search('(?<![0-9]\.)([0-9]{1,3}-1[123])(?=[0-9])', line) #([1-9][0-9]{0,2}-1[123])
		if ordno_search:
			#If there's a dollar value or Fiscal Year range preceeding the ordinance number, let's give it some space
			#Matches any value starting with a dollar sign followed by 1 to 3 digits, followed by 1 or more sets of ",xxx", optionally followed by ".xx" (only some dollar figures contain decimals), finally all of this must proceed another number digit OR search for FY xxxx-xxxx proceeded by a single number digit
			money_search = re.search('((\$[0-9]{1,3}(,[0-9]{3})+)(\.[0-9]{2})?(?=[0-9])|(FY\s?[0-9]+-[0-9]{4})(?=[0-9]))', line[0:ordno_search.end(1)])
			if money_search:
				#put space between the dollar value and the ord no, and re-run regex
				money = money_search.group(1) #.encode('utf-8')
				line = line.replace(money, money + " ")
				ordno_search = re.search('(?<![0-9]\.)([0-9]{1,3}-1[123])(?=[0-9])', line)
			#This takes care of removing the text headers for the table just before the first value
			ordno = ordno_search.group(1)
			if len(ordno) == 4 and ordno[0] == str(1):
				text = ""
			else:
				text = line[0:ordno_search.start(1)]
				if 'desc' in json_final[index-1]:
					json_final[index - 1]['desc'] = unicode(json_final[index - 1]['desc'] + " " + text)
				else:
					json_final[index - 1]['desc'] = unicode(text)
			
			date_search = re.search('(\d{2}\/\d{2}\/\d{2})|TBD', line)
			if date_search:
				date = date_search.group(1)
				if date is None:
					date = "TBD"
			fileno = line[ordno_search.end(1):ordno_search.end(1)+6]
			line = line[date_search.end(1):len(line)]
			json_str = {"ordno" : unicode(ordno), "fileno" : unicode(fileno), "date": unicode(date)}
			json_final.append(json_str)
			index = index + 1
		else:
			if index > 0:
				if 'desc' in json_final[index-1]:
					json_final[index - 1]['desc'] = unicode(json_final[index - 1]['desc'] + " " + line.rstrip())
				else:
					json_final[index - 1]['desc'] = unicode(line.rstrip())
			found = False

print json.dumps(json_final, sort_keys=False, indent=4, separators=(',', ': '))

