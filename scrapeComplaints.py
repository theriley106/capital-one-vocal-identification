# encoding=utf8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import requests
import bs4
import json
SELECTOR = "#campaign-reviews p"
URL = "https://www.consumeraffairs.com/credit_cards/capital_one.htm?page={0}"
headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'}
info = {}
listOfComplaints = []
if __name__ == '__main__':
	i = 1
	res = ""
	while i < 137:
		try:
			for e in range(3):
				# Retries url 3 times
				res = requests.get(URL.format(i+1), headers=headers)
				page = bs4.BeautifulSoup(res.text, 'lxml')
				if res:
					if res.status_code == 200 and len(res.text) > 1000:
						for val in page.select("#campaign-reviews p"):
							if "more information about reviews on ConsumerAffairs.com" not in str(val):
								listOfComplaints.append(val.getText())
			i += 1
		except Exception as exp:
			print exp
		print i

info['complaints'] = listOfComplaints
with open('data.json', 'w') as outfile:
	json.dump(info, outfile)
