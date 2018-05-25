# encoding: utf-8
import sys
reload(sys)
sys.setdefaultencoding('utf8')
from googletrans import Translator
# This is used for tranlating the text
import requests
translator = Translator()
# Initiates translator class

def generateURL(keyWords, region):
	print str(keyWords).decode("utf-8")
	# This generates the GOOGLE TRANSLATE URL
	keyWords = keyWords.decode('unicode-escape').encode('utf8')
	keyWords = keyWords.encode('string-escape').replace("\\x", "%")
	print keyWords
	keyWords = keyWords.upper()
	url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={}&tl={}".format(keyWords, region.decode("utf-8").lower())
	keyWords = keyWords.replace(" ", "%20")
	# Google translate url doesn't have a space
	url = "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={}&tl={}".format(keyWords, region.decode("utf-8").lower())
	return url

def translateText(text, toLanguage):
	translation = translator.translate(text, dest=toLanguage)
	# .to_dict or .text work with this object
	return translation.text

def getLanguage(text):
	return translator.detect(text)

if __name__ == '__main__':
	#a = "बिनावास"
	#print translateText(a.encode('utf-8'), "en")
	text = raw_input("Words: ")
	text = translateText(text, 'hi')
	print generateURL(text, 'hi')

