from googletrans import Translator
# This is used for tranlating the text
import requests
translator = Translator()
# Initiates translator class

def generateURL(keyWords, region):
	# This generates the GOOGLE TRANSLATE URL
	keyWords = keyWords.replace(" ", "%20")
	# Google translate url doesn't have a space
	return "https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q={}&tl={}".format(keyWords, region.lower())

def translateText(text, toLanguage):
	translation = translator.translate(text, dest=toLanguage)
	# .to_dict or .text work with this object
	return translation.text

def getLanguage(text):
	return translator.detect(text)
